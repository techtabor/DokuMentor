const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(fileUpload());


//Feltöltött fájlok helye
const dir = './uploads/';

const port = process.env.PORT || 3000;

//Oldalak:
app.get('/', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/home.ejs', {
      files: files
    });
  });
});

app.get('/upload', (req, res) => {
  res.render('pages/fileupload.ejs');
});

app.get('/search', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/search.ejs', {
      files: files
    });
  });
});

//A /file elérési úttal tudjuk elérni a feltöltött fájlokat a $dir mappából
app.use('/file', express.static(dir));

//Fájl feltöltése
app.post('/fileupload', function(req, res) {
  if (!req.files)
  return res.status(400).send('Nincs feltöltött fájl.');
  //Ha nem létezik a mappa, hozza létre
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  //A küldött fájl:
  var uploadedFile = req.files.files;
  // Fájl áthelyezése
  uploadedFile.mv(dir+uploadedFile.name, function(err) {
    if (err)
    return res.status(500).send(err);
    res.redirect('/');
  });
});

//Szerver indítása
app.listen(port, '0.0.0.0', () => console.log('DokuMentor is available on port ' + port + '!'));