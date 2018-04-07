var express = require('express');
var router = express.Router();

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.render('pages/profile', { user: req.user });
});

module.exports = router;
