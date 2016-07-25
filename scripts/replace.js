exports = module.exports = {};
var shell = require('shelljs');

exports.run = function(stringToReplace, replacementString, fileToPerformReplaceOn) {
    shell.echo("replacing " + stringToReplace + " by " + replacementString + " in file " + fileToPerformReplaceOn);
    shell.sed('-i', stringToReplace, replacementString, fileToPerformReplaceOn);
};