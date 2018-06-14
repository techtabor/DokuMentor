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

router.get('/', (req, res) => {
    res.redirect('/documents');
    //res.render('pages/home', { user: req.user });
});

router.get('/howto', (req, res) => {
    res.render('pages/howto', { user: req.user });
});

router.get('/about', (req, res) => {
    res.render('pages/about', { user: req.user });
});

router.get('/document/:docid', (req, res) => {
    models.Document.findById(req.params.docid).then(document => {
        models.File.findAll({where: {DocumentId: req.params.docid}}).then( (result) => {
            res.render('pages/document', { user: req.user, document: document, files: result});
        });
    });
});

router.get('/file/:fileid', (req, res) => {
    var download = false;
    if (typeof req.query.d !== 'undefined') download=true;
    models.File.findById(req.params.fileid).then(file => {
        if (file != null) fs.exists('./files/'+file.id+'.'+file.extension, function(exists) {
            if(exists){
                if (download) return res.download('./files/'+file.id+'.'+file.extension);
                else return res.sendFile(path.resolve(__dirname,'../files/'+file.id+'.'+file.extension));
            }
        });
        return res.send('A fájl nem található a szerveren.');
    });
});

const limit=6;
const Op = models.Sequelize.Op;

router.get('/documents', (req, res) => {
    var page=1;
    if (typeof req.query.page !== 'undefined') page=req.query.page;
    models.Document.count().then(all => {
        page=Math.min(Math.max(page,1),Math.ceil(all/limit));
        models.Document.findAll({order: [['add_date', 'DESC']], include: [{model: models.File, as: 'Files'}], offset: (page-1)*limit, limit: limit}).then(result=>{
            res.render('pages/documents', { user: req.user, page: page, all: all, limit: limit, documents: result,  title: 'Dokumentumok'});
        });
    });
});

router.get('/advsearch', (req, res) => {
    res.render('pages/advsearch', { user: req.user });
});

router.get('/search', (req, res) => {
    var where = {};
    var prop = ['title','university','course','teacher','tags','description'];
    var page=1;
    if (typeof req.query.page !== 'undefined') page=req.query.page;
    if (typeof req.query.q !== 'undefined'){
        where[Op.or] = [];
        prop.forEach(p => {
            where[Op.or].push({[p]: {[Op.like]: ('%'+req.query.q+'%')}});
        });
    }
    else {
        where[Op.and] = [];
        prop.forEach(p => {
            if (typeof req.query[p] !== 'undefined') where[Op.and].push({[p]: {[Op.like]: ('%'+req.query[p]+'%')}});
        });
    }
    models.Document.count({where: where}).then(all => {
        page=Math.min(Math.max(page,1),Math.ceil(all/limit));
        models.Document.findAll({where: where, order: [['add_date', 'DESC']], include: [{model: models.File, as: 'Files'}], offset: (page-1)*limit, limit: limit}).then(result=>{
            res.render('pages/documents', { user: req.user, page: page, all: all, limit: limit, documents: result,  title: 'Keresés eredménye'});
        });
    });
});

module.exports = router;
