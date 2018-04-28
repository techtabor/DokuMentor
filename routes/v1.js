var express = require('express');
var router = express.Router();
const fs = require('fs');
const dir = './uploads/';

router.get('/', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/home.ejs', {
      files: files,
      user: req.user
    });
  });
});

router.get('/upload', (req, res) => {
  res.render('pages/fileupload.ejs', {
    user: req.user
  });
});

router.get('/search', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/search.ejs', {
      files: files,
      user: req.user
    });
  });
});

router.use('/file', express.static(dir));

router.post('/fileupload', function(req, res) {
  if (!req.files)
  return res.status(400).send('Nincs feltöltött fájl.');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  var uploadedFile = req.files.files;
  uploadedFile.mv(dir+uploadedFile.name, function(err) {
    if (err)
    return res.status(500).send(err);
    res.redirect('/');
  });
});

module.exports = router;
