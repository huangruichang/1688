
const { app, BrowserWindow } = require('electron')
const { join } = require('path')

class LogWindow {

  constructor() {
    this.mainWindow = new BrowserWindow({
      width: 600,
      height: 300,
      center: false,
      webPreferences: {
        nodeIntegration: false,
        preload: join(__dirname, '../scripts/', 'preload.js'),
      }
    })
    this.mainWindow.loadURL(`file:\/\/${join(__dirname, '../public/log.html')}`)
    this.contents = this.mainWindow.webContents
    this.mainWindow.on('close', () => {
      app.quit()
    })
  }

  log(url, index) {
    this.contents.send('alibaba.process.log', {
      url: url,
      index: index
    })
  }

  progress(total) {
    this.contents.send('alibaba.progress', {
      total: total
    })
  }

  error(msg) {
    this.contents.send('alibaba.process.error', {
      msg: msg
    })
  }

  finish() {
    this.contents.send('alibaba.process.finish')
  }
}

module.exports = LogWindow
