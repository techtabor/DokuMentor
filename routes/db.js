var express = require('express');
var router = express.Router();

var moment = require('moment');
var path = require('path');
const fs = require("fs");

var config = require('../config/config.js').get(process.env.NODE_ENV);

const models = require('../models/');

const authCheck = (req, res, next) => {
      if(!req.isAuthenticated()){
            res.redirect('../auth/login');
      } else {
            next();
      }
};

router.get('/alluser', (req, res) => {
    models.User.findAll().then( (result)=>{
          res.send(result);
      });
});

router.get('/user/:userid', (req, res) => {
      models.User.findById(req.params.userid).then((result) =>{
            res.send(result);
      });
});

router.post('/createdocument', authCheck , (req, res) => {
      if (!req.files 
            || !req.body 
            || !req.body.title 
            || !req.body.university
            || !req.body.course ) return res.status(400).send('Hiányos adatok.');
            
      req.body.UserId = req.user.id;

      if (!Number.isInteger(req.body.semester) || req.body.semester <= 0) req.body.semester = null;
      if (!moment(req.body.lecture_date).isValid()) req.body.lecture_date = null;
      
      models.Document.create(req.body).then(doc => {
            console.log('Új dokumentum id: ' + doc.id);
            
            var files;
            if (Array.isArray(req.files.files)) files=req.files.files;
            else files = [req.files.files];
            
            files.forEach((uploadedFile,i) => {        
                  var ext = path.extname(uploadedFile.name||'').split('.');
                  ext = ext[ext.length - 1];
                  models.File.create({extension: ext,
                              DocumentId: doc.id}).then(file => {
                        if (!fs.existsSync('./files')) fs.mkdirSync('./files');
                        uploadedFile.mv('./files/'+file.id+'.'+file.extension, function(err) {
                              if (err) return console.log(err);
                              file.update({
                                    size: fs.statSync('./files/'+file.id+'.'+file.extension).size
                              }).then(() => {
                                    console.log('Új fájl id: ' + file.id);
                              })
                        });
                  });
            });
      });

      
      res.end('OK');
      // if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      // var uploadedFile = req.files.files;
      // uploadedFile.mv(dir+uploadedFile.name, function(err) {
      //       if (err)
      //       return res.status(500).send(err);
      //       res.redirect('/');
      // });
});

module.exports = router;