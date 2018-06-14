var express = require('express');
var router = express.Router();
var moment = require('moment');
var path = require('path');
var fs = require('fs');

const models = require('../models/');

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('../auth/login');
    } else {
        next();
    }
};

router.get('/newdocument', authCheck, (req, res) => {
      loadnewdocpage(req, res);
});

function loadnewdocpage(req, res, flash = false){
      models.Document.getUniversities(models, (unis) => {
            models.Document.findOne({where: {UserId: req.user.id}, order: [['add_date', 'DESC']]}).then((doc)=>{
                  if (doc === null) doc = {};
                  res.locals.flashwarning = flash;
                  models.Document.getUniversities(models, (unis) => {
                        res.render('pages/newdocument', { user: req.user, universities: unis, prevdoc: doc});
                  });
            });
      });
}

router.post('/newdocument', authCheck , (req, res) => {
    if ((!req.files 
          || !req.body 
          || !req.body.title 
          || !req.body.university
          || !req.body.course )
          || (req.body.university === 'Egyéb' && !req.body.newUniversity)) return res.status(400).send('Hiányos adatok.');
          
    req.body.UserId = req.user.id;

    //TODO: if (!Number.isInteger(req.body.semester) || req.body.semester <= 0) req.body.semester = null;
    if (!moment(req.body.lecture_date).isValid()) req.body.lecture_date = null;
    if (req.body.university === 'Egyéb') req.body.university = req.body.newUniversity;

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
          res.redirect('/document/'+doc.id);
    }).catch((error) => {
      console.log(error.errors[0].message);
      message = '';
      error.errors.forEach(err => {
            message += err + " "
      });
      loadnewdocpage(req, res, {
            message: message
      });
    });
    //res.send('Hiba');
});

module.exports = router;