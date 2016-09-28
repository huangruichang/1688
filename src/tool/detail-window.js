
const { readFileSync } = require('fs')
const { BrowserWindow } = require('electron')
const { join } = require('path')
const xlsx = require('node-xlsx')

let code = readFileSync(join(__dirname, '../scripts/doDetail.js')).toString()

class DetailWindow {

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
      }
    })
    let webContents = this.mainWindow.webContents
    webContents.on('did-finish-load', () => {
      webContents.executeJavaScript(code)
    })
    this.mainWindow.loadURL(url)
  }

  close() {
    this.mainWindow.close()
  }

  getOutput() {
    return this.output
  }
}

module.exports = DetailWindow
