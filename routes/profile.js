var express = require('express');
var router = express.Router();
const models = require('../models/');

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    models.Document.findAll({where: {UserId: req.user.id}, order: [['add_date', 'DESC']]}).then((docs) => {
        res.render('pages/profile', { user: req.user, documents: docs });
    });
});

module.exports = router;
