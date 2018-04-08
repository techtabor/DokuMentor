const express = require('express');
const fileUpload = require('express-fileupload');
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./controllers/passport-setup');
const Sequelize = require('sequelize');
const fs = require('fs');

const app = express();

//Külső config fájl betöltése
const config = require('./config/config.js').get(process.env.NODE_ENV);

app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [config.session.cookieKey]
}));

//Passport betöltése
app.use(passport.initialize());
app.use(passport.session());

//Adatbázis ellenőrzése
require("./models").sequelize.sync().then(function() {
    console.log('Adatbázis betöltve.'); 
}).catch(function(err) {
    console.log(err, "Adatbázis hiba.");
});

//Elérési utak betöltése
app.use(require('./routes'));

//Szerver indítása
app.listen(config.port, '0.0.0.0', () => console.log('A DokuMentor alkalmazás erérhető a következő porton: ' + config.port + '.'));