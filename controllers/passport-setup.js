const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config.js').get(process.env.NODE_ENV);
const User = require('../models/').users;

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findOne({where: {key: id.toString()}}).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: 'http://ec2-18-195-57-19.eu-central-1.compute.amazonaws.com:3000/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {

        User.findOrCreate({where: {key: profile.id}, defaults: {name: profile.displayName, email: profile.emails[0].value}})
        .spread(function(user, created) {
            console.log(user.get({
                plain: true
            }))
            console.log('Új?', created);
            done(null, profile);
        });
    })
);