
const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const LogWindow = require('./tool/log-window')
const main = require('./main')

let mainWindow
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'scripts/', 'preload.js'),
    }
  })
  mainWindow.loadURL(`file:\/\/${join(__dirname, 'public/index.html')}`)
})

ipcMain.on('alibaba.start', (event, arg) => {
  let logWindow = new LogWindow()
  main(arg.targetPath, arg.targetUrl, arg.prefix, {
    logWindow: logWindow
  })
})
