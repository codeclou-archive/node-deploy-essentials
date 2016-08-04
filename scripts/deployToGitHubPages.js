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
    //
    // BANNER
    //
    shell.echo('=============================');
    shell.echo('DEPLOY TO GITHUB PAGES SCRIPT');
    shell.echo('=============================');

    //
    // PRE
    //
    if (shell.test('-d', CLONE_DIR)) {
        shell.echo('cleaning existing clone dir');
        shell.rm('-rf', CLONE_DIR);
    }

    var gitVersion = shell.exec('git --version', {silent:true}).stdout;
    var workspace = CLONE_DIR;
    if (gitHubSubdirectory !== undefined && gitHubSubdirectory !== null) {
        workspace = CLONE_DIR + '/' + gitHubSubdirectory;
    }



    //
    // TEST
    //
    if (shell.test('-d', '.git')) {
        shell.echo('PLEASE DELETE .git DIRECTORY. CANNOT CLONE INTO AND EXISTING REPOSITORY WORKSPACE! EXIT.');
        process.exit(2);
    }

    //
    // PARAMS
    //
    shell.echo('git version:           ' + gitVersion.trim());
    shell.echo('git committer email:   ' + gitHubCommitterEmail);
    shell.echo('git committer name:    ' + gitHubCommitterName);
    shell.echo('git auth username:     ' + gitHubAuthUsername);
    shell.echo('git auth token:        ******');
    shell.echo('git clone url:         ' + gitHubCloneUrl);
    if (gitHubSubdirectory !== undefined && gitHubSubdirectory !== null) {
        shell.echo('git subdirectory:      ' + gitHubSubdirectory);
    }
    shell.echo('source to deploy:      ' + sourceDirToDeployContents);
    shell.echo('workspace:             ' + workspace );
    shell.echo('=============================');


    //
    // STUFF
    //
    shell.exec('git config --global user.email "' + gitHubCommitterEmail + '"', {silent:true});
    shell.exec('git config --global user.name "' + gitHubCommitterName + '"', {silent:true});
    shell.exec('git config --global push.default simple', {silent:true});
    gitHubCloneUrl = gitHubCloneUrl.replace(/^https:\/\//,'https://' + gitHubAuthUsername + ':' + gitHubAuthTokenOrPassword + '@');
    var rememberedWorkDir = shell.pwd();

    //
    // CLONE
    //
    shell.echo("... cloning ... please wait");
    var gitClone = shell.exec('git clone --single-branch --branch gh-pages ' + gitHubCloneUrl + ' ' + CLONE_DIR);
    if (gitClone.code !== 0) {
        shell.echo('Error cloning failed. Quitting.');
        shell.exit(1);
    }
    if (gitHubSubdirectory !== undefined && gitHubSubdirectory !== null) {
        if (!shell.test('-d', CLONE_DIR + '/' + gitHubSubdirectory)) {
            shell.mkdir(CLONE_DIR + '/' + gitHubSubdirectory);
        }
    }

    //
    // COPY BUILD ARTIFACTS
    //
    shell.rm('-rf', workspace + '/*');
    shell.cp('-r', sourceDirToDeployContents + '/*', workspace + '/');

    shell.cd(CLONE_DIR);
    shell.exec('git ls-files --other --exclude-standard --directory | wc -l', {silent:true}, function(code, stdout, stderr) {
        if (stdout.trim() === '0') {
            shell.echo("... nothing to commit. quitting.");
            shell.cd(rememberedWorkDir);
        } else {
            shell.echo("... changes detected. pushing changes ... please wait");
            shell.exec('git add . -A');
            shell.exec('git commit -m "automatic deploy by node-deploy-essentials script"');
            shell.exec('git push', function(code, stdout, stderr) {
                shell.cd(rememberedWorkDir);
            });
        }
    });
};