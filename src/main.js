
const { readFileSync, writeFileSync } = require('fs')
const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const { mkdirSync } = require('fs')
const DetailWindow = require('./tool/detail-window')
const PicWindow = require('./tool/pic-window')


let mainWindow
let webContents
let code = readFileSync(join(__dirname, '/scripts/do.js')).toString()
let targetPath = '/Users/huangruichang/Desktop/1688-result'
// let prefix = 'GA'

let bucket = []

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

  //next('https://taodoupf.1688.com/page/offerlist.htm')

  next('https://shop1461949109898.1688.com/page/offerlist.htm')

  webContents = mainWindow.webContents

  webContents.on('did-finish-load', () => {
    webContents.executeJavaScript(code)
  })
})

let queue = []
let doing = false
let detailWindow
let picWindow
let currentItem
let initIPC = () => {
  ipcMain.on('alibaba.results', (event, arg) => {
    queue = queue.concat(arg)
  })
  ipcMain.on('alibaba.results.detail', (event, arg) => {
    //console.log(arg)
    //@TODO handle detail data
    let data = arg.data
    currentItem = data
    let content = `标题:${data.title}\r\n价格:${data.prices.join(',')}\r\n尺码:${data.sizes.join(',')}\r\n颜色:${data.colors.join(',')}`;
    // console.log(content)
    writeFileSync(join(detailWindow.getOutput(), '产品信息.txt'), content)
    doing = false
    picWindow = new PicWindow(arg.data.picURL, detailWindow.getOutput())
  })
  ipcMain.on('alibaba.results.pics', (event, arg) => {
    // console.log(arg)
    // let arr = []
    let arr = arg.data.images
    // let final = () => {
    //   doing = false
    //   detailWindow.close()
    //   picWindow.close()
    // }
    // picWindow.fetchPic(arr, final, final)
    currentItem.images = arr
    bucket.push(currentItem)
  })
}
let dirIndex = 0
let doJob = function () {
  let interval = setInterval(function () {
    if (queue.length <= 0 || doing) {
      return
    }
    doing = true
    // let dirname = join(targetPath, prefix + dirIndex)
    // dirIndex++
    // try {
    //   mkdirSync(dirname)
    // } catch (ignore) {
    //   //console.log(ignore)
    // }
    let job = queue.splice(0, 1)[0]
    detailWindow = new DetailWindow(job, dirname)
    // clearInterval(interval)
  }, 2000)

}

doJob()

