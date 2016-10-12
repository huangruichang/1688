
const { dirname } = require('path')
const { unlinkSync } = require('fs')
const { ensureDirSync } = require('fs-extra')
const low = require('lowdb')
const fileAsync = require('lowdb/lib/file-async')

class Cache {

  constructor(path, name) {
    this.path = path
    ensureDirSync(dirname(path))
    this.db = low(path, {
      storage: fileAsync
    })
    this.name = name
    this.db.defaults({ [name]: [] }).value()
    console.log(this.all().length)
  }

  find(filed, value) {
    return this.db.get(this.name)
      .chain()
      .find({
        [filed]: value
      })
      .value()
  }

  findAll(field, value) {
    return this.db.get(this.name)
      .chain()
      .filter({
        [field]: value
      })
      .value()
  }

  exist(field, value) {
    return this.findAll(field, value).length > 0
  }

  push(data) {
    return this.db.get(this.name)
      .push(data)
      .value()
  }

  size() {
    return this.db.get(this.name)
      .size()
      .value()
  }

  clear() {
    try {
      unlinkSync(this.path)
    } catch (ignored) {}
  }

  all() {
    return this.db.get(this.name).value()
  }

  getDB() {
    return this.db
  }
}

// let test = () => {
//   let cache = new Cache('db.json', 'good')
//   cache.push({
//     hehe: 'fuck'
//   })
// }
//
// test()

// let test = () => {
//   let cache = new Cache('db.json', 'good')
//   let result = cache.find('hehe', 'fuck')
//   console.log(result)
// }
//
// test()

// let test = () => {
//   let cache = new Cache('db.json', 'good')
//   console.log('fuck')
//   console.log(cache.getDB().get('good').chain().filter({
//     hehe: 'fuck'
//   }).value())
// }
//
// test()

// let test = () => {
//   let cache = new Cache('db.json', 'good')
//   let result = cache.size()
//   console.log(result)
// }
//
// test()

// let test = () => {
//   let cache = new Cache('db.json', 'good')
//   let result = cache.findAll('hehe', 'fuck')
//   console.log(result)
// }
//
// test()

// let test = () => {
//   let cache = new Cache('db.json', 'good')
//   let result = cache.exist('hehe', 'fuck')
//   console.log(result)
// }
//
// test()

// const url = require('url')
// console.log(url.parse('https://shop1461949109898.1688.com/page/offerlist.htm?spm=a2615.7691456.0.0.W5G5cZ').hostname)

// let test = () => {
//   let cache = new Cache('db.json', 'good')
//   let result = cache.all()
//   console.log(result)
// }
//
// test()

module.exports = Cache
