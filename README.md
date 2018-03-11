## Dropbox Node sync


syncs a users dropbox folder to the node instance directory

run
``` sh
git clone https://github.com/jasenmichael/dropbox-node-sync.git

cd dropbox-node-sync

npm install

```
  - get an access token from dropbox
  - rename the .config/example_index.js to index.js
  - in the .config/index.js file set your dropbox accessToken
  - in the .config/index.js file set your local sync directory

``` sh
npm start
```


### todo:

 - [] add directory handling, as of now will error if a folder exists in the dldDir
 - [] add compare files for changes and update
