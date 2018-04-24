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
    res.render('v2/pages/home', { user: req.user });
});

router.get('/newdocument', authCheck, (req, res) => {
    res.render('v2/pages/newdocument', { user: req.user });
});

router.get('/documents', (req, res) => {
    models.Document.findAll().then( (result)=>{
        console.log(result[0].dataValues);
        //res.send(result);
        res.render('v2/pages/documents', { user: req.user, documents: result});
    });
});

module.exports = router;
