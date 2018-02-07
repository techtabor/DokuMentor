//Ágoston kódja

//Load HTTP module
var http = require("http");
var dt = require("./firstmodule.js");

//Create HTTP server and listen on port 8000 for requests
http.createServer(function (request, response) {

   // Set the response HTTP header with HTTP status and Content type
   response.writeHead(200, {'Content-Type': 'text/html'});
   
   response.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
   response.write('<input type="file" name="filetoupload"><br>');
   response.write('<input type="submit">');
   response.write('</form>');

   response.write("Date: " + dt.myDateTime() + "\n");

   // Send the response body "Hello World"
   response.end('<p/><strong>Hello World</strong>\n');


}).listen(8000);

// Print URL for accessing server
console.log('Server running at http://127.0.0.1:8000/')



// Create folder for uploaded files

var fs = require('fs');
var dir = './uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}