var exports = module.exports = {};
var shell = require('shelljs');
var CLONE_DIR = 'github-pages-to-deploy';

exports.run = function(gitHubCommitterEmail,
                       gitHubCommitterName,
                       gitHubAuthUsername,
                       gitHubAuthTokenOrPassword,
                       gitHubCloneUrl,
                       gitHubSubdirectory,
                       sourceDirToDeployContents) {
    console.log('running');

    var gitVersion = shell.exec('git --version', {silent:true}).stdout;

    console.log('gitVersion: ' + gitVersion);

    shell.exec('git config --global user.email "' + gitHubCommitterEmail + '"', {silent:true});
    shell.exec('git config --global user.name "' + gitHubCommitterName + '"', {silent:true});
    shell.exec('git config --global push.default simple', {silent:true});

    gitHubCloneUrl = gitHubCloneUrl.replace(/^https:\/\//,'https://' + gitHubAuthUsername + ':' + gitHubAuthTokenOrPassword + '@');

    //
    // TEST
    //
    if (shell.test('-d', '.git')) {
        shell.echo('PLEASE DELETE .git DIRECTORY. CANNOT CLONE INTO AND EXISTING REPOSITORY WORKSPACE! EXIT.')
        process.exit(2);
    }

        //
    // CLONE
    //
    shell.exec('git clone --single-branch --branch gh-pages ' + gitHubCloneUrl + ' ' + CLONE_DIR, {silent:true});

    //
    // CREATE SUBDIR IF NECESSARY
    //
    var workspace = CLONE_DIR;
    if (gitHubSubdirectory !== undefined && gitHubSubdirectory !== null) {
        if (! shell.test('-d', CLONE_DIR + '/' + gitHubSubdirectory)) {
            shell.mkdir(CLONE_DIR + '/' + gitHubSubdirectory);
        }
        workspace = CLONE_DIR + '/' + gitHubSubdirectory;
    }

    //
    // COPY BUILD ARTIFACTS
    //
    shell.rm('-rf', workspace + '/*');
    shell.cp('-r', sourceDirToDeployContents + '/*', workspace + '/');

    shell.cd(workspace);
    shell.exec('git diff --exit-code', function(code, stdout, stderr) {
        if (code === 0) {
            shell.echo("NOTHING TO COMMIT");
        } else {
            shell.echo("CHANGES DETECTED. ADDING, COMMITTING, PUSHING.");
            shell.exec('git add . -A');
            shell.exec('git commit -m "automatic deploy by node-deploy-essentials script"');
            shell.exec('git push');
        }
    });
};