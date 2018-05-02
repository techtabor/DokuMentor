var express = require('express');
var router = express.Router();

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/advsearch', authCheck, (req, res) => {
    res.render('pages/advsearch', { user: req.user });
});

module.exports = router;