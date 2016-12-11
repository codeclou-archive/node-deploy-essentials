exports = module.exports = {};
const shell = require('shelljs');
const request = require('sync-request');


//
//
// PUBLIC METHODS
//
//

exports.waitForStatusCode = function(_statusCode, _url) {

    shell.echo('nde> http waitForStatusCode ' + _statusCode + ' on url ' + _url);

    var statusCodeMatches = false;
    var breakCounter = 5000;
    while (statusCodeMatches === false) {
        var response = { statusCode: -1 };
        try {
            response = request('GET', _url);
        } catch (err) {
            shell.echo(':');
        }
        if (response.statusCode == _statusCode) {
            statusCodeMatches = true;
        }
        shell.echo('.');
        breakCounter--;
        if (breakCounter == 0) {
            shell.echo('nde> http waitForStatusCode ' + _statusCode + ' on url ' + _url + ' ERROR breakCounter reached 0');
            shell.exit(1)
        }
    }

    shell.echo('nde> http waitForStatusCode ' + _statusCode + ' on url ' + _url + ' SUCCESS');

};