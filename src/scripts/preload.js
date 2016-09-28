
process.on('loaded', function () {
  window.$ = require('jquery')
  window.ipc = require('electron').ipcRenderer
})
