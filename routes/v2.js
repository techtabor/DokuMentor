var express = require('express');
var router = express.Router();

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

module.exports = router;
