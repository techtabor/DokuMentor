var express = require('express');
var router = express.Router();

const models = require('../models/');

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('../auth/login');
    } else {
        next();
    }
};

router.get('/', (req, res) => {
    res.render('pages/home', { user: req.user });
});

router.get('/newdocument', authCheck, (req, res) => {
    res.render('pages/newdocument', { user: req.user });
});

router.get('/documents', (req, res) => {
    models.Document.findAll().then( (result)=>{
        res.render('pages/documents', { user: req.user, documents: result});
    });
});

router.get('/document/:docid', (req, res) => {
    models.Document.findById(req.params.docid).then( (document) => {
        models.File.findAll({where: {DocumentId: req.params.docid}}).then( (result)=>{
            res.render('pages/document', { user: req.user, document: document, files: result});
        });
    });
});

module.exports = router;
