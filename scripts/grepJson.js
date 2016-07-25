exports = module.exports = {};
var jp = require('jsonpath');
var fs = require('fs');
var shell = require('shelljs');


exports.run = function(jsonpath, jsonfile, message) {
    fs.readFile(jsonfile, 'utf8', function(err, data) {
        if (err) throw err;
        var result = jp.query(JSON.parse(data), jsonpath);
        if (message !== null) {
            shell.echo(message + ' ' + result);
        } else {
            shell.echo(result);
        }
    });
};