var express = require('express');
var router = express.Router();

var connection;

//Főoldal
router.get('/all', (req, res) => {
    //connection.connect();

    connection.query('SELECT * from new_view', function(err, rows, fields) {
    if (!err) fetchActors(res);
    else console.log('Error while performing Query.');
    });

    //connection.end();
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



module.exports = function(database){
    connection = database;
    return router;
}