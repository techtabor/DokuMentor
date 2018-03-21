var express = require('express');
var router = express.Router();

//Külső config fájl betöltése:
var config = require('../config.js').get(process.env.NODE_ENV);

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

//Főoldal
router.get('/all', (req, res) => {
    connection.query('SELECT * from new_view', function(err, rows, fields) {
    if (!err) fetchActors(res);
    else console.log('Error while performing Query.');
    });
});

router.get('/dg/:docgroupid', (req, res) => {
    connection.query('SELECT * from new_view WHERE docg_id='+req.docgroupid, function(err, rows, fields) {
    if (!err) fetchActors(res);
    else console.log('Error while performing Query.');
    });
});

//TESZT:
//FUNCTIONS
//Exectues queries on declared db (it can be extended if you want to use more than one db)
function executeQuery(sql, cb) {
    connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        cb(result);
    });
}
//Prints actors table
function fetchActors(res){
        executeQuery("SELECT * FROM new_view", function(result){
        res.write("<!DOCTYPE html><meta charset=\"UTF-8\">");
        res.write("<table>");
        res.write("<tr>");
        for(var column in result[0]){
            res.write("<td><label>" + column + "</label></td>");
        }
        res.write("</tr>");
        for(var row in result){
            res.write("<tr>");
            for(var column in result[row]){
                res.write("<td><label>" + result[row][column] + "</label></td>");       
            }
            res.write("</tr>");         
        }
        res.end("</table>");
    });
}

module.exports = function(){
    handleDisconnect();
    return router;
}