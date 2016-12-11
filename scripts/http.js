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

    let statusCodeMatches = false;
    let breakCounter = 5000;
    while (statusCodeMatches === false) {
        const response = request('GET', _url);
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