# node-deploy-essentials

## :bangbang: Deprecated and Discontinued :bangbang:

----

This library brings you easy to use deploy scripts and helper scripts to write human readable deploy code.
It is powered by [ShellJS](https://github.com/shelljs/shelljs) and [jsonpath](https://www.npmjs.com/package/jsonpath).


## Howto Use


### 1) :monkey: Install as **dev dependency**

```shell
npm install node-deploy-essentials --save-dev
```

Then add this **script** to wrap the binary in your `package.json`

```json
{
  "scripts": {
    "ndes": "node ./node_modules/.bin/ndes"
  }
}
```

Now you can run 

```shell
npm run ndes --version
```


###  2) :monkey: Install **globally**

```shell
npm install -g node-deploy-essentials
```

Now you can run 

```shell
ndes --version
```

### 3) :monkey: Run via **docker**

```shell
docker run --tty --volume $(pwd)/:/opt/npm codeclou/docker-node-deploy-essentials:latest ndes --version
```

Note: Not all commands might work right when running as docker container. If you use *waitForStatus* or *dockerHelper* commands this might not work.

----

 
## Scripts

  * **1. Replace Helper**
    * [replace byCurrentTimetamp](#replace_byCurrentTimetamp)
    * [replace by value](#replace_by_value)
  * **2. Grep Helper**
    * [grepJson](#grepJson)
  * **3. Deployment Scripts**  
    * [deployToGitHubPages](#deployToGitHubPages)
    * [deployToGitHubBranch](#deployToGitHubBranch)
  * **4. HTTP Helper**  
    * [waitForStatusCode](#waitForStatusCode)
   
    
----
----


### :bulb: 1. Replace Helper

The replace helper helps you replace Strings in files.

<a id="replace_byCurrentTimetamp"></a>

#### :cyclone: replace {searchString} byCurrentTimetamp in {filename}

This helper replaces the `searchString` by the current ISO 8601 DateString in the file called `filename`.

**Example**

Let's assume you have the following file `src/deploy-info.js`

```js
export default {
  branch:    '___BRANCH___',
  commit:    '___COMMIT___',
  buildTime: '___TIMEST___'
}
```

Then we want to replace `___TIMEST___` by the current timestamp you do

```
npm run ndes replace "___TIMEST___" byCurrentTimetamp in "src/deploy-info.js"
```

The `src/deploy-info.js` now looks like

```js
export default {
  branch:    '___BRANCH___',
  commit:    '___COMMIT___',
  buildTime: '2016-07-25T20:50:23.722Z'
}
```

----

<a id="replace_by_value"></a>

#### :cyclone: replace {searchString} by {value} in {filename}

This helper replaces the `searchString` by the `value` in the file called `filename`.

**Example**

Let's assume you have the following file `src/deploy-info.js`

```js
export default {
  branch:    '___BRANCH___',
  commit:    '___COMMIT___',
  buildTime: '___TIMEST___'
}
```

Then we want to replace `___BRANCH___` by our Branchname.


```
npm run ndes replace "___BRANCH___" byValue "master" in "src/deploy-info.js"
```

The `src/deploy-info.js` now looks like

```js
export default {
  branch:    'master',
  commit:    '___COMMIT___',
  buildTime: '___TIMEST___'
}
```

----

### :bulb: 2. Grep Helper

<a id="grepJson"></a>

#### :cyclone: grepJson {jsonPathQuery} from {filename} withMessage {message}

Extracts a JSON Value by using [`jsonPathQuery`](https://www.npmjs.com/package/jsonpath) from `filename` echos it to STDOUT prefixed by `message`.

**Example**

Let's assume our `package.json` looks like this

```json
{
  "homepage": "https://codeclou-int.github.io/bitbucket-pipeline-app-demo/master/"
}
```

With this command you extract the value of `"homepage"` from `package.json`

```
npm run ndes grepJson "$.homepage" from "package.json" withMessage "deployed to:"
```

Then the console output will be

```
deployed to: https://codeclou-int.github.io/bitbucket-pipeline-app-demo/master/
```

----

### :bulb: 3. Deployment Scripts

<!-- keep old anchors for incoming deep links -->                     
<a id="cyclone-deploytogithubpages-as-githubcommittername-withemail-githubcommitteremail-withgithubauthusername-githubauthusername-withgithubauthtoken-githubauthtokenorpassword-torepository-githubcloneurl-fromsource-sourcedirtodeploycontents-intosubdirectory-githubsubdirectory"></a>
<a id="deployToGitHubPages"></a>

#### :cyclone: deployToGitHubPages as {gitHubCommitterName} withEmail {gitHubCommitterEmail} withGitHubAuthUsername {gitHubAuthUsername} withGitHubAuthToken {gitHubAuthTokenOrPassword} toRepository {gitHubCloneUrl} fromSource {sourceDirToDeployContents} intoSubdirectory {gitHubSubdirectory}

Will deploy content of `sourceDirToDeployContents` to GitHub Pages `https://owner.github.io/repoName/gitHubSubdirectory/`.

**Example**

This script will deploy the contents of `./build/` directory into `https://john123.github.io/customdir/`

```
npm run ndes deployToGitHubPages as "John Smith" withEmail "john@something.foo" withGitHubAuthUsername john123 withGitHubAuthToken aaa121411f31f31ff13 toRepository https://github.com/john123/johntest.git fromSource build intoSubdirectory customdir 
```

**Notice**

  * :bangbang: System needs to have `git` installed.
  * :bangbang: The order of the parameters is NOT interchangable.
  * :bangbang: The target directory is purged (all files are deleted before new files are copied).
  * :bangbang: The `gitHubAuthTokenOrPassword` might appear printed out as shell output!

**Parameters**

| parameter | Example Usage | Description |
| --------- | ------------- | ----------- |
| `gitHubCommitterName`       | `deployToGitHubPages as "John Smith" ...` | - | 
| `gitHubCommitterEmail`      | `deployToGitHubPages ... withEmail "john@foo.bar" ...` | - |
| `gitHubAuthUsername`        | `deployToGitHubPages ... withGitHubAuthUsername johnsmith ...` | The actual GitHub username that corresponds to `gitHubAuthTokenOrPassword` | 
| `gitHubAuthTokenOrPassword` | `deployToGitHubPages ... withGitHubAuthToken aafaffaf121212 ...` | The [GitHub Private Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) with `repo` scope. | 
| `gitHubCloneUrl`            | `deployToGitHubPages ... toRepository https://repoOwner.github.com/repoName.git` | Note that you have to provide the full URL ending with `.git`. Only `https://` URLs are supported at the moment. |
| `sourceDirToDeployContents` | `deployToGitHubPages ... fromSource build ...` | The source folder whose contents should be deployed |
| `gitHubSubdirectory`        | `deployToGitHubPages ... intoSubdirectory myBranch ...` | OPTIONAL-PARAMETER: The subfolder that should be created on baseDir of the gh-pages Branch and deployed into. |  


----

<!-- keep old anchors for incoming deep links -->                     
<a id="deployToGitHubBranch"></a>

#### :cyclone: deployToGitHubBranch as {gitHubCommitterName} withEmail {gitHubCommitterEmail} withGitHubAuthUsername {gitHubAuthUsername} withGitHubAuthToken {gitHubAuthTokenOrPassword} toRepository {gitHubCloneUrl} branch {gitHubBranch} fromSource {sourceDirToDeployContents} intoSubdirectory {gitHubSubdirectory}

Will deploy content of `sourceDirToDeployContents` to GitHub Repository on Branch {gitHubBranch}.

**Example**

This script will deploy the contents of `./build/` directory into the `foobar` branch.

```
npm run ndes deployToGitHubBranch as "John Smith" withEmail "john@something.foo" withGitHubAuthUsername john123 withGitHubAuthToken aaa121411f31f31ff13 toRepository https://github.com/john123/foo.git branch foobar fromSource build
```

**Notice**

  * :bangbang: System needs to have `git` installed.
  * :bangbang: The order of the parameters is NOT interchangable.
  * :bangbang: The target directory is purged (all files are deleted before new files are copied).
  * :bangbang: The `gitHubAuthTokenOrPassword` might appear printed out as shell output!

**Parameters**

| parameter | Example Usage | Description |
| --------- | ------------- | ----------- |
| `gitHubCommitterName`       | `deployToGitHubBranch as "John Smith" ...` | - | 
| `gitHubCommitterEmail`      | `deployToGitHubBranch ... withEmail "john@foo.bar" ...` | - |
| `gitHubAuthUsername`        | `deployToGitHubBranch ... withGitHubAuthUsername johnsmith ...` | The actual GitHub username that corresponds to `gitHubAuthTokenOrPassword` | 
| `gitHubAuthTokenOrPassword` | `deployToGitHubBranch ... withGitHubAuthToken aafaffaf121212 ...` | The [GitHub Private Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) with `repo` scope. | 
| `gitHubCloneUrl`            | `deployToGitHubBranch ... toRepository https://repoOwner.github.com/repoName.git` | Note that you have to provide the full URL ending with `.git`. Only `https://` URLs are supported at the moment. |
| `gitHubBranch`              | `deployToGitHubBranch ... branch master` | Do provide the Branchname without prefixes like `origin/`. Just the plain name. |
| `sourceDirToDeployContents` | `deployToGitHubBranch ... fromSource build ...` | The source folder whose contents should be deployed |
| `gitHubSubdirectory`        | `deployToGitHubBranch ... intoSubdirectory myBranch ...` | OPTIONAL-PARAMETER: The subfolder that should be created on baseDir of Branch and deployed into. |  





----

### :bulb: 4. HTTP Helper

<a id="http-helper"></a>

#### :cyclone: http waitForStatusCode {statusCode} {url}

<a id="waitForStatusCode"></a>

This is usefull when you are starting up a big server that needs some time for startup
and you want to wait for a HTTP 200 status code. Request Loop will break after 5000 requests and will NOT pause in between requests.

**Example**

This command will request the url and wait for a HTTP 200 and blocks the next command inside a shell script.

```
npm run ndes http waitForStatusCode 200 http://someurl/foo
```

**Notice**

  * :bangbang: request loops stops after 5000 requests with an `exit 1`

**Parameters**

| parameter | Example Usage | Description |
| --------- | ------------- | ----------- |
| `statusCode`       | `200` | e.g. 200, 302 a.s.o |
| `url`       | `https://some.url` | e.g. http://google.com |



## License

[MIT License ](./LICENSE.md) 

## Changelog

Read details in [Releases](https://github.com/codeclou/node-deploy-essentials/releases).

## Note to contributors

By sending us patches/PRs, you automatically license the code under the same terms as node-deploy-essentials.
