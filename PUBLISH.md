# Howto Publish to npmjs.org

(1) use this because of npm proxy:

```
npm --registry https://registry.npmjs.org/ login
npm --registry https://registry.npmjs.org/ publish
```

(2) Create Git Tag

```
git tag -a 0.0.4 -m "rel 0.0.4"
git push origin 0.0.4
```

(3) Go to github releases and create release from tag.

(4) Increase version in package.json.