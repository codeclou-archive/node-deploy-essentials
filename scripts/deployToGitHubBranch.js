var exports = module.exports = {};
var shell = require('shelljs');
var CLONE_DIR = 'github-deploy-to-branch';

exports.run = function(gitHubCommitterEmail,
                       gitHubCommitterName,
                       gitHubAuthUsername,
                       gitHubAuthTokenOrPassword,
                       gitHubCloneUrl,
                       gitHubBranchName,
                       gitHubSubdirectory,
                       sourceDirToDeployContents) {
    //
    // BANNER
    //
    shell.echo('nde> ==============================');
    shell.echo('nde> DEPLOY TO GITHUB BRANCH SCRIPT');
    shell.echo('nde> ==============================');

    var gitVersion = shell.exec('git --version', {silent:true}).stdout;
    var workspace = CLONE_DIR;
    if (gitHubSubdirectory !== undefined && gitHubSubdirectory !== null) {
        workspace = CLONE_DIR + '/' + gitHubSubdirectory;
    }

    //
    // PARAMS
    //
    shell.echo('nde> git version:           ' + gitVersion.trim());
    shell.echo('nde> git committer email:   ' + gitHubCommitterEmail);
    shell.echo('nde> git committer name:    ' + gitHubCommitterName);
    shell.echo('nde> git auth username:     ' + gitHubAuthUsername);
    shell.echo('nde> git auth token:        ******');
    shell.echo('nde> git branch:            ' + gitHubBranchName);
    shell.echo('nde> git clone url:         ' + gitHubCloneUrl);
    if (gitHubSubdirectory !== undefined && gitHubSubdirectory !== null) {
        shell.echo('nde> git subdirectory:      ' + gitHubSubdirectory);
    }
    shell.echo('nde> source to deploy:      ' + sourceDirToDeployContents);
    shell.echo('nde> workspace:             ' + workspace );
    shell.echo('nde> =============================');

    //
    // BACKUP EXISTING .git
    //
    if (shell.test('-d', '.git')) {
        shell.echo('nde> BACKUP existing .git directory');
        shell.mv('.git', '_git_BACKUP_TMP');
    }

    //
    // PRE CLEANUP
    //
    if (shell.test('-d', CLONE_DIR)) {
        shell.echo('nde> cleaning existing clone dir');
        shell.rm('-rf', CLONE_DIR);
    }

    //
    // GIT CONFIG
    //
    shell.exec('git config --global user.email "' + gitHubCommitterEmail + '"', {silent:true});
    shell.exec('git config --global user.name "' + gitHubCommitterName + '"', {silent:true});
    shell.exec('git config --global push.default simple', {silent:true});

    //
    // INJECT CREDENTIALS INTO CLONEURL
    //
    gitHubCloneUrl = gitHubCloneUrl.replace(/^https:\/\//,'https://' + gitHubAuthUsername + ':' + gitHubAuthTokenOrPassword + '@');
    var rememberedWorkDir = shell.pwd();

    //
    // CLONE
    //
    shell.echo('nde> cloning ... please wait');
    var gitClone = shell.exec('git clone --single-branch --branch ' + gitHubBranchName + ' ' + gitHubCloneUrl + ' ' + CLONE_DIR);
    if (gitClone.code !== 0) {
        shell.echo('nde> Error cloning failed. Quitting.');
        shell.exit(1);
    }
    if (gitHubSubdirectory !== undefined && gitHubSubdirectory !== null) {
        if (!shell.test('-d', CLONE_DIR + '/' + gitHubSubdirectory)) {
            shell.mkdir(CLONE_DIR + '/' + gitHubSubdirectory);
        }
    }
    if (shell.test('-d', sourceDirToDeployContents)) {
        //
        // COPY BUILD ARTIFACTS
        //
        shell.rm('-rf', workspace + '/*');
        shell.cp('-r', sourceDirToDeployContents + '/*', workspace + '/');
        // copy hidden files as well
        shell.cp('-r', sourceDirToDeployContents + '/.*', workspace + '/');

        //
        // ADD, COMMIT AND PUSH TO GH-PAGES
        //
        shell.cd(CLONE_DIR);
        shell.exec('git status --porcelain | wc -l', {silent:true}, function(code, stdout, stderr) {
            if (stdout.trim() === '0') {
                shell.echo('nde> nothing to commit. quitting.');
            } else {
                shell.echo('nde> changes detected. pushing changes ... please wait');
                shell.exec('git add . -A');
                shell.exec('git commit -m "automatic deploy by node-deploy-essentials script"');
                shell.exec('git push');
            }

            //
            // POST CLEANUP
            //
            shell.cd(rememberedWorkDir);
            shell.echo('nde> cleanup. deleting ' + CLONE_DIR + '... please wait');
            shell.rm('-rf', CLONE_DIR);

            //
            // RESTORE EXISTING .git
            //
            if (shell.test('-d', '_git_BACKUP_TMP')) {
                shell.echo('nde> RESTORING existing .git directory.');
                shell.mv('_git_BACKUP_TMP', '.git');
            }

            shell.echo('nde> all done.');
        });
    } else {
        shell.echo('nde> WARN  sourceDirToDeployContents does not exist: ' + sourceDirToDeployContents);
    }
};