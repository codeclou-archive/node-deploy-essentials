# Howto Publish to npmjs.org

(1) use this because of npm proxy:

```
npm --registry https://registry.npmjs.org/ login
npm --registry https://registry.npmjs.org/ publish
```

(2) Create Git Tag

```
tag -a 0.1.6 -m "rel 0.1.6"
git push origin 0.1.6
```

(3) Go to github releases and create release from tag.

(4) Increase version in package.json.