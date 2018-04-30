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

const limit=15;
router.get('/documents', (req, res) => {
    models.Document.findAll({order: [['add_date', 'DESC']]}).then(result => {
        var page=1;
        if (typeof req.query.page !== 'undefined') page=req.query.page;
        page=Math.min(page,Math.ceil(result.length/limit));
        res.render('pages/documents', { user: req.user, page: page, all:result.length, limit: limit, documents: result.slice((page-1)*limit,(page-1)*limit+limit),  title: 'Dokumentumok'});
    });
});

const Op = models.Sequelize.Op;
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
    models.Document.findAll({where: where, order: [['add_date', 'DESC']]}).then(result => {
        page=Math.min(page,Math.ceil(result.length/limit));
        res.render('pages/documents', { user: req.user, page: page, all:result.length, limit: limit, documents: result.slice((page-1)*limit,(page-1)*limit+limit),  title: 'Keresés eredménye'});
    });
});

router.get('/document/:docid', (req, res) => {
    models.Document.findById(req.params.docid).then(document => {
        models.File.findAll({where: {DocumentId: req.params.docid}}).then( (result) => {
            res.render('pages/document', { user: req.user, document: document, files: result});
        });
    });
});

module.exports = router;
