
const http = require('https')
const { writeFileSync, createWriteStream } = require('fs')
const { join } = require('path')
const Promise = require('bluebird')

class FetchPic {
  constructor(url, output) {
    this.url = url
    this.output = output
  }

  fetchData() {
    return new Promise((resolve, reject) => {
      let src = this.url
      var filename = src.substring(src.lastIndexOf('/') + 1)
      let writeStream = createWriteStream(join(this.output, filename))
      writeStream.on('finish', function () {
        resolve()
      })
      http.get(src, (res) => {
        res.pipe(writeStream)
      }).on('error', (e) => {
        console.log(e)
        reject(e)
      })
    })
  }
}

module.exports = FetchPic
