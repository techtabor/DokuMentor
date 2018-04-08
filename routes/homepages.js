var express = require('express');
var router = express.Router();


const fs = require('fs');
const dir = './uploads/';


//Főoldal
router.get('/', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/home.ejs', {
      files: files,
      user: req.user
    });
  });
});

//Feltöltés oldal
router.get('/upload', (req, res) => {
  res.render('pages/fileupload.ejs', {
    user: req.user
  });
});

//Keresés oldal
router.get('/search', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/search.ejs', {
      files: files,
      user: req.user
    });
  });
});

//A /file elérési úttal tudjuk elérni a feltöltött fájlokat a $dir mappából
router.use('/file', express.static(dir));

//Fájl feltöltése
router.post('/fileupload', function(req, res) {
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

module.exports = router;
