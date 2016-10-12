
const { writeFileSync } = require('fs')
const xlsx = require('node-xlsx')

class XLSXUtil {

  constructor(arr, path) {
    let prices = this.getGridLength(arr, 'prices')
    let amounts = this.getGridLength(arr, 'amounts')
    let colors = this.getGridLength(arr, 'colors')
    let sizes = this.getGridLength(arr, 'sizes')
    let images = this.getGridLength(arr, 'images')
    let pricesArr = this.getTitleArr('价格', prices)
    let amountsArr = this.getTitleArr('批发量', amounts)
    let colorArr = this.getTitleArr('颜色', colors)
    let sizeArr = this.getTitleArr('尺码', sizes)
    let imageArr = this.getTitleArr('图片', images)
    let titleArr = ['SKU', '标题', '网址']
      .concat(pricesArr)
      .concat(amountsArr)
      .concat(colorArr)
      .concat(sizeArr)
      .concat(imageArr)
    this.dataOrder = [
      {
        name: 'prices',
        length: prices,
      },
      {
        name: 'amounts',
        length: amounts,
      },
      {
        name: 'colors',
        length: colors,
      },
      {
        name: 'sizes',
        length: sizes,
      },
      {
        name: 'images',
        length: images,
      },
    ]
    let formatData = this.formatData(arr)
    formatData.unshift(titleArr)
    // this.build('test-衣服.xlsx', formatData)
    this.build(path, formatData)
  }

  build(name, data) {
    // console.log(data)
    let buffer = xlsx.build([{name: "mySheetName", data: data}])
    writeFileSync(name, buffer)
  }

  formatData(data) {
    let dataOrder = this.dataOrder
    let result = []
    for (let value of data) {
      let item = [value.itemName, value.title, value.url]
      for (let order of dataOrder) {
        let arr = this.paddingNull(value[order.name], order.length)
        item = item.concat(arr)
      }
      result.push(item)
    }
    return result
  }

  paddingNull(arr, num) {
    let result = arr
    if (!result) return []
    if (arr.length < num) {
      let nullArr = []
      for (let i = 0; i < num - arr.length; i++) {
        nullArr.push(null)
      }
      result = arr.concat(nullArr)
    }
    return result
  }

  getGridLength(data, field) {
    if (!data) return 0
    let maxLength = 0
    for (let value of data) {
      let arr = value[field]
      if (!arr) return 0
      if (arr.length > maxLength) {
        maxLength = arr.length
      }
    }
    return maxLength
  }

  getTitleArr(title, num) {
    let arr = []
    for (let i = 0; i < num; i++) {
      arr.push(`${title}${i + 1}`)
    }
    return arr
  }
}

module.exports = XLSXUtil
