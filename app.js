const express = require('express');
const fileUpload = require('express-fileupload');

const cookieSession = require('cookie-session');
const passport = require('passport');
const Sequelize = require('sequelize');

const app = express();
const fs = require('fs');

//Külső config fájl betöltése:
const config = require('./config/config.js').get(process.env.NODE_ENV);

app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [config.session.cookieKey]
}));

//Passport.js betöltése
app.use(passport.initialize());
app.use(passport.session());

//Elérési utak külön fájlban: (.controllers/index.js !!!)
app.use(require('./controllers'));

//Szerver indítása
app.listen(config.port, '0.0.0.0', () => console.log('DokuMentor is available on port ' + config.port + '!'));