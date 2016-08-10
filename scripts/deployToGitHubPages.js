var exports = module.exports = {};
var shell = require('shelljs');
var deployToGitHubBranch = require('./deployToGitHubBranch.js');

exports.run = function(gitHubCommitterEmail,
                       gitHubCommitterName,
                       gitHubAuthUsername,
                       gitHubAuthTokenOrPassword,
                       gitHubCloneUrl,
                       gitHubSubdirectory,
                       sourceDirToDeployContents) {
    return deployToGitHubBranch.run(
        gitHubCommitterEmail,
             gitHubCommitterName,
             gitHubAuthUsername,
             gitHubAuthTokenOrPassword,
             gitHubCloneUrl,
             'gh-pages',
             gitHubSubdirectory,
             sourceDirToDeployContents);
};