const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

const dir = './uploads/';

// default options
app.use(fileUpload());
 
app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server
  //console.log(sampleFile.name);
  sampleFile.mv(dir+sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

app.get('/', (req, res) => res.sendFile(__dirname+'/index.html'));


if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
app.listen(8000, () => console.log('Example app listening on port 3000!'));