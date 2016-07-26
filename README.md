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

```
npm run ndes grepJson "$.homepage" from "package.json" withMessage "deployed to:"
```

Greps a JSON Value by using [jsonpath querys](https://www.npmjs.com/package/jsonpath)


### :bulb: 3. Deploy to GitHub Pages

Will deploy to GitHub Pages with the following command:

```
npm run ndes deployToGitHubPages as "John Smith" withEmail "john@something.foo" withGitHubAuthUsername john123 withGitHubAuthToken aaa121411f31f31ff13 toRepository https://github.com/john123/johntest.git fromSource build intoSubdirectory customdir 
```

This script will deploy the contents of `./build/` directory into `https://john123.github.io/customdir/`.

Notice:

  * System needs to have `git` installed
  * Inside the directory you run the script there should be no `.git` directory. Delete that before running the script.
  * `intoSubdirectory` is optional. When omitted the contents of `fromSource` are pushed to `/`.


## License

[MIT License ](./LICENSE.md) 
