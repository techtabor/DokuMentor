var express = require('express');
var router = express.Router();

const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.render('pages/login.ejs', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google', {session: true}), (req, res) => {
    //res.send(req.user);
    res.redirect('/profile');
});


module.exports = router;