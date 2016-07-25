# node-deploy-essentials

Node.js Deploy Essential Scripts

### :bangbang: THIS IS WORK IN PROGRESS - DO NOT USE

## Howto Use

Add the **dependency** to your **package.json** (soon there will be npm install). Also add a **scripts** entry.

```json
{
  "devDependencies": {
    "node-deploy-essentials": "git+https://github.com/codeclou/node-deploy-essentials.git#master"
  },
  "scripts": {
    "ndes": "node ./node_modules/.bin/ndes"
  }
}
```
 
## Scripts

### Deploy to GitHub Pages

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
