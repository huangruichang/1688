
const { readFileSync } = require('fs')
const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const DetailWindow = require('./tool/detail-window')

let mainWindow
let webContents
let code = readFileSync(join(__dirname, '/scripts/do.js')).toString()

const next = (url) => {
  mainWindow.loadURL(url)
}



app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 640,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'scripts/', "preload.js"),
    }
  })
  initIPC()
  //next('https://s.1688.com/selloffer/offer_search.htm?keywords=a&button_click=top&earseDirect=false&n=y')

  next('https://taodoupf.1688.com/page/offerlist.htm')

  webContents = mainWindow.webContents

  webContents.on('did-finish-load', () => {
    webContents.executeJavaScript(code)
  })
})

// let winMap = {}
let queue = []
let picQueue = []
let doing = false
let doingPic = false
let detailWindow
let picWindow
let initIPC = () => {
  ipcMain.on('alibaba.results', (event, arg) => {
    queue = queue.concat(arg)
  })
  ipcMain.on('alibaba.results.detail', (event, arg) => {
    doing = false
    // detailWindow.close()
  })
}
let doJob = function () {
  let interval = setInterval(function () {
    if (queue.length <= 0 || doing) {
      return
    }
    doing = true
    let job = queue.splice(0, 1)[0]
    detailWindow = new DetailWindow(job)
    clearInterval(interval)
  }, 2000)

}

let doPicJob = function () {
  let interval = setInterval(function () {
    if (picQueue.length <= 0 || doingPic) {
      return
    }
    doingPic = true
    let job = picQueue.splice(0, 1)[0]

  }, 2000)
}

doJob()

