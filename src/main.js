
const { readFileSync } = require('fs')
const { BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const url = require('url')
const DetailWindow = require('./tool/detail-window')
const PicWindow = require('./tool/pic-window')
const XLSXUtil = require('./tool/xlsx-util')
const Cache = require('./tool/cache')

let mainWindow
let logWindow
let webContents
let code = readFileSync(join(__dirname, '/scripts/do.js')).toString()
let targetPath = '/Users/huangruichang/Desktop/1688-result'
let prefix = 'GA'
let targetUrl = 'https://infshop.1688.com/page/offerlist.htm'.split('?')[0]
// let targetUrl = 'https://shop1461949109898.1688.com/page/offerlist.htm?spm=a261y.7663282.0.0.FeHOyp'.split('?')[0]
// let targetUrl = 'https://enla365.1688.com/page/offerlist.htm?spm=a261y.7663282.0.0.qEoSwH'.split('?')[0]
let bucket = []
let cache
let cachePath

const next = (url) => {
  mainWindow && mainWindow.close()
  mainWindow = new BrowserWindow({
    width: 800,
    height: 640,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'scripts/', "preload.js"),
    },
    show: false
  })
  webContents = mainWindow.webContents

  webContents.on('did-finish-load', () => {
    webContents.executeJavaScript(code)
  })
  mainWindow.loadURL(url)
}

module.exports = (tp, tu, pre, opt) => {
  targetPath = tp
  targetUrl = tu.split('?')[0]
  prefix = pre
  logWindow = opt.logWindow
  initIPC()
  initCache()
  //next('https://shop1461949109898.1688.com/page/offerlist.htm')
  next(targetUrl)
}

let queue = []
let doing = false
let detailWindow
let picWindow
let currentItem
let total
let dirIndex = 0
let currentPage = 1
let progressInit = false
let initIPC = () => {
  ipcMain.on('alibaba.results', (event, arg) => {
    let targetLinks = []
    for (let url of arg.links) {
      let result = cache.find('url', url)
      if (result) {
        bucket.push(result)
        dirIndex++
        logWindow.log(url, dirIndex)
        console.log('existed!')
      } else {
        targetLinks.push(url)
      }
    }

    // queue = queue.concat(arg.links)
    queue = queue.concat(targetLinks)
    total = +arg.offerCount
    if (total === 0) {
      total = queue.length + cache.size()
    }
    if (!progressInit) {
      progressInit = true
      logWindow.progress(total)
    }
    pageTotal = +arg.pageCount
    currentPage++
    if (currentPage <= pageTotal) {
      next(targetUrl + `?pageNum=${currentPage}`)
    }
  })
  ipcMain.on('alibaba.results.detail', (event, arg) => {
    let data = arg
    currentItem = data
    let output = detailWindow.getOutput()
    detailWindow.close()
    detailWindow = undefined
    if (data.picURL) {
      picWindow = new PicWindow(data.picURL, output)
    } else {
      // 下架以后
      bucket.push({
        itemName: prefix + dirIndex,
        url: data.url,
        prices: ['已下架'],
        amounts: ['已下架'],
        colors: ['已下架'],
        sizes: ['已下架']
      })
      cache.push({
        itemName: prefix + dirIndex,
        url: data.url,
        prices: ['已下架'],
        amounts: ['已下架'],
        colors: ['已下架'],
        sizes: ['已下架']
      })
      // dirIndex--
      doing = false
    }
  })
  ipcMain.on('alibaba.results.pics', (event, arg) => {
    let arr = arg.images
    currentItem.images = arr
    // currentItem.itemName = `${prefix}${dirIndex}`
    currentItem.itemName = prefix + dirIndex
    bucket.push(currentItem)
    picWindow.close()
    picWindow = undefined
    doing = false
    if (!cache.exist('url', currentItem.url)) {
      cache.push(currentItem)
    }
  })
}

let initCache = () => {
  cachePath = `${targetPath}\/${prefix}-${url.parse(targetUrl).hostname}.json`
  cache = new Cache(cachePath, 'alibaba')
  // let cacheSize = cache.size()
  // dirIndex = cacheSize
  // console.log('initCache')
  // console.log(dirIndex)
}

let doJob = function () {
  let interval = setInterval(function () {
    if ((queue.length <= 0 && bucket.length <= 0) || doing) {
      return
    }
    dirIndex++

    doing = true
    let dirname = join(targetPath, prefix + dirIndex)
    let job = queue.splice(0, 1)[0]
    if (job) {
      detailWindow = new DetailWindow(job, dirname)
      logWindow.log(job, dirIndex)
    } else {
      doing = false
    }
    // clearInterval(interval)

    console.log(dirIndex)
    // console.log(total)
    // if (dirIndex === total) {
    if (dirIndex >= total) {
      // detailWindow && detailWindow.close()
      // mainWindow && mainWindow.close()
      // picWindow && picWindow.close()

      // console.log(bucket)
      // console.log(bucket.length)
      // console.log(total)
      clearInterval(interval)
      setTimeout(() => {
        let hehe = targetPath + '/' + new Date().getTime() + '.xlsx'
        let targetBucket = cache.all()
        console.log('targetBucket length:%d', targetBucket.length)
        let xlsxUtil = new XLSXUtil(targetBucket, hehe)
        console.log('finished!')
        cache.clear()
        logWindow.finish()

      }, 30 * 1000)
      // app.quit()
    }
  }, 2000)

}

doJob()

