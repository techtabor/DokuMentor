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
var connection;
function handleDisconnect() {
  connection = mysql.createConnection(config.databaseconnection); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
handleDisconnect();

var db = require('./routes/db')(connection);
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