exports = module.exports = {};
var shell = require('shelljs');

exports._extractPortFromDockerPortsEntry = function(_dockerPortsEntry) {
    /* Expected _dockerPortsEntry
       0.0.0.0:4422->4444/tcp
       ----
       will return 4422
     */
    if (_dockerPortsEntry !== undefined && _dockerPortsEntry !== null && _dockerPortsEntry !== '') {
        const regex = /^.*:([0-9]+)[-][>].*$/gi;
        return _dockerPortsEntry.replace(regex, '$1');
    }
    return null;
};

exports._extractDockerIdFromDockerPsOutput = function(_dockerPsOutput, _port) {
    /* Expected _dockerPsOutput
     7d41ed198b59---0.0.0.0:4444->4444/tcp
     2002e09a3440---0.0.0.0:4443->4443/tcp
     ----
     Public port is on the left side
     */
    if (_dockerPsOutput !== undefined && _dockerPsOutput !== null && _dockerPsOutput !== '') {
        const dockerPsOutputLineByLine = _dockerPsOutput.split('\n');
        for (var i = 0, len = dockerPsOutputLineByLine.length; i < len; i++) {
            const currentLine = dockerPsOutputLineByLine[i].split('---');
            const dockerId = currentLine[0];
            const port = exports._extractPortFromDockerPortsEntry(currentLine[1]);
            if (port == _port) return dockerId;
        }
    }
    return null;
};

exports._getDockerIdOnPort = function(_port) {
    var dockerPsOutput = shell.exec('docker ps --format "{{.ID}}---{{.Ports}}"', {silent:true}).stdout;
    return exports._extractDockerIdFromDockerPsOutput(dockerPsOutput, _port);
};

exports.killOnPort = function(_port) {

    shell.echo('nde> docker killOnPort ' + _port);

    const dockerId = exports._getDockerIdOnPort(_port);
    if (dockerId !== null) {
        shell.echo('nde> docker killOnPort KILLING ' + dockerId + ' on port ' + _port);
        shell.exec('docker kill ' + dockerId);
    } else {
        shell.echo('nde> docker killOnPort NO CONTAINER RUNNING on port ' + _port);
    }

};