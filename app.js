const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(fileUpload());

//Külső config fájl betöltése:
var config = require('./config.js').get(process.env.NODE_ENV);


//Elérési utak külön fájlban:
var index = require('./routes/index');
app.use('/', index);

//MySQL
var mysql = require('mysql');


var db = require('./routes/db')();
app.use('/db', db);

//Ez a rész csak akkor működik, ha  indítás előtt kiadjuk a nodeenv='development' parancsot
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

//Szerver indítása
app.listen(config.port, '0.0.0.0', () => console.log('DokuMentor is available on port ' + config.port + '!'));