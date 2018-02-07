const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

const dir = './uploads/';

// default options
app.set('view engine', 'ejs');
app.use(fileUpload());
 
app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 
  // Fájl áthelyezése
  sampleFile.mv(dir+sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

app.get('/', (req, res) => {
  //res.sendFile(__dirname+'/views/pages/index.html')
  fs.readdir(dir, (err, files) => {
    res.render('pages/index.ejs', {
      files: files
    });
  });
});

app.get('/list', (req, res) => {
  fs.readdir(dir, (err, files) => {
    res.render('pages/list.ejs', {
      files: files
    });
  });
});

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
app.listen(8000, () => console.log('Example app listening on port 3000!'));