var config = require("./.config")
var dldDir = config.dldDir
var accessToken = config.accessToken

var https = require('https')
var fs = require('fs')


require('isomorphic-fetch') // or another library of choice.
var Dropbox = require('dropbox').Dropbox
var dbx = new Dropbox({
  accessToken: accessToken
})
var DROPBOX_PATH = '' // dropbox app root dir


function syncTheDbox() {
  dbx.filesListFolder({
      path: DROPBOX_PATH
    })
    .then(res => res.entries)
    .then(entries => entries.map(entry =>
      dbx.filesGetTemporaryLink({
        path: entry.path_display
      })))
    .then(actions => Promise.all(actions).catch(console.log))
    .then(results => {
      //console.log(results)
      return results
    })
    .then(results => results.map(result => ({
      name: result.metadata.name,
      link: result.link
    })))
    .then(newlist => {
      //console.log(newlist)
      newlist.forEach(file => {
        /// checks if the file exists locally in dldDir
        if (!fs.existsSync(dldDir + file.name)) {
          /// if it does not exist locally, download the file
          var fileDld = fs.createWriteStream(dldDir + file.name)
          var request = https.get(file.link, function(response) {
            response.pipe(fileDld)
            console.log(file.name + " synced from dropbox")
          })
        }
      })
      return newlist
    })
    // next check if local file exist on dropbox,
    // if it does not delete local file.
    //creates dboxFiles array of dBox file names
    .then(newlist => {
      dboxFiles = []
      newlist.forEach(item => {
        dboxFiles.push(item.name)
      })
      //console.log(dboxFiles)

      // deletes local files not in dboxFiles array
      fs.readdirSync(dldDir).forEach(file => {
        if (dboxFiles.includes(file) == false) {
          console.log(file + " not located on Dropbox", dldDir + "file" + " deleted")
          fs.unlinkSync(dldDir + file)
        }
      })
    })
    .catch(console.log);
}
//syncTheDbox()

module.exports = {
  syncTheDbox
}
