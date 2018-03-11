var dropboxSync = require("./dropbox-sync")
var dBoxSync = dropboxSync.syncTheDbox


dBoxSync()

const imagesDir = "./images"

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const app = express()
app.use(morgan('tiny'))

// uncomment if you decouple the client app
app.use(cors())

// serve route for app directory --
// remove these next two lines to decouple the client app,
// also you will need to point the client app to the deployed url within the app/assets/main.js
const path = require('path');
app.use(express.static(path.join(__dirname, './app')))

var imageList = []

getImagesList()

function getImagesList() {
  fs.readdir(imagesDir, (error, images) => {

    //console.log(imageList);
    images.forEach((image) => {
      if (image != 'thumbs') {
        imageList.push({
          path: image,
          title: "",
          caption: ""
        })
      }
    })
  })
  // populate imageList..
  app.get('/api/images', (req, res) => {
    res.json(imageList)
  })
}


// serve up the imagesDir,
app.use('/images/', express.static('images'))

// Not Found (404) handler
app.use((req, res, next) => {
  // Set the response status code
  res.status(404)
  const error = new Error('Not Found....')
  // Forward the error to the error handler
  next(error)
})

// Error handler
app.use((error, req, res, next) => {
  res.status(res.statusCode || 500)
  res.json({
    message: error.message,
    error: error.stack
  });
})

// Set the PORT to listen on
const port = process.env.PORT || 3000;
// Listen on the port
app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
