/**
 * USAGE:
 *   (0) node tests/test_server.js
 *
 *   (1) GET http://localhost:3000/reset
 *       => will reset the counter
 *
 *   (2) GET http://localhost:3000/
 *       => will return HTTP 400 for the first 10 requests
 *       => will return HTTP 200 for the 11th plus requests
 */
var express = require('express');
var app = express();
var kill3k = require('kill3k');
kill3k(3000);

var counter = 0;
app.get('/', function (req, res) {
    if (counter > 10) {
        res.status(200);
    } else {
        res.status(400);
    }
    res.send('ok');
    counter++;
});
app.get('/reset', function (req, res) {
    counter = 0;
    res.send('ok');
});
app.listen(3000, function () {
    console.log('counter-testserver started on port 3000');
});