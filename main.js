const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(fileUpload());


//Feltöltött fájlok helye
const dir = './uploads/';

const port = process.env.PORT || 8080;


//Főoldal
app.get('/', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/index.ejs', {
      files: files
    });
  });
});


//A /file elérési úttal tudjuk elérni a feltöltött fájlokat
app.use('/file', express.static(dir));


//Fájl feltöltése (html post)
app.post('/upload', function(req, res) {
  if (!req.files)
  return res.status(400).send('No files were uploaded.');
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  // Fájl áthelyezése
  sampleFile.mv(dir+sampleFile.name, function(err) {
    if (err)
    return res.status(500).send(err);
    res.redirect('/');
  });
});

//Szerver indítása, tárolómappa létrehozása
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
app.listen(port, '0.0.0.0', () => console.log('DokuMentor is available on port ' + port + '!'));