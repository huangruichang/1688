
const { readFileSync } = require('fs')
const { BrowserWindow } = require('electron')
const { join } = require('path')
const Promise = require('bluebird')
const FetchPic = require('./fetch-pic')

let code = readFileSync(join(__dirname, '../scripts/doPic.js')).toString()

class PicWindow {

  constructor(url, output) {
    this.url = url
    this.output = output
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 640,
      center: true,
      webPreferences: {
        nodeIntegration: false,
        preload: join(__dirname, '../scripts/', "preload.js"),
      },
      show: false
    })
    let webContents = this.mainWindow.webContents
    webContents.on('did-finish-load', () => {
      webContents.executeJavaScript(code)
    })
    this.mainWindow.hide()
    this.mainWindow.loadURL(url)
  }

  fetchPic(picArr, success, fail) {
    let promises = []
    this.picArr = picArr
    for (let value of picArr) {
      let fetchPic = new FetchPic(value, this.output)
      let fPromise = fetchPic.fetchData()
      promises.push(fPromise)
    }
    Promise.all(promises).then(() => {
      success && success()
    }).catch((e) => {
      fail && fail(e)
      console.log(e)
    })
  }

  close() {
    this.mainWindow.close()
  }

}

module.exports = PicWindow
