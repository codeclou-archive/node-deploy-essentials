[![](https://codeclou.github.io/node-deploy-essentials/doc/node-deploy-essentials-logo.svg)](https://github.com/codeclou/node-deploy-essentials)

----

This library brings you easy to use deploy scripts and helper scripts to write human readable deploy code.
It is powered by [ShellJS](https://github.com/shelljs/shelljs) and [jsonpath](https://www.npmjs.com/package/jsonpath).


## Howto Use

Install the **dependency**

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
 
## Scripts

### :bulb: 1. Replace Helper

The replace helper helps you replace Strings in files.

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

### :bulb: 2. Grep JSON Helper

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

                       
#### :cyclone: deployToGitHubPages as {gitHubCommitterName} withEmail {gitHubCommitterEmail} withGitHubAuthUsername {gitHubAuthUsername} withGitHubAuthToken {gitHubAuthTokenOrPassword} toRepository {gitHubCloneUrl} fromSource {sourceDirToDeployContents} intoSubdirectory {gitHubSubdirectory}

Will deploy content of `sourceDirToDeployContents` to GitHub Pages `https://owner.github.io/repoName/gitHubSubdirectory/`.

**Example**

This script will deploy the contents of `./build/` directory into `https://john123.github.io/customdir/`

```
npm run ndes deployToGitHubPages as "John Smith" withEmail "john@something.foo" withGitHubAuthUsername john123 withGitHubAuthToken aaa121411f31f31ff13 toRepository https://github.com/john123/johntest.git fromSource build intoSubdirectory customdir 
```

**Notice**

  * :bangbang: System needs to have `git` installed
  * :bangbang: Inside the directory you run the script there should be no `.git` directory! Delete that before running the script.
  * :bangbang: The order of the parameters is NOT interchangable.

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


## License

[MIT License ](./LICENSE.md) 
