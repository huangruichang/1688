
const os = require('os')

window.targetPath = `${os.homedir()}/Desktop/1688-result`

process.on('loaded', function () {
  window.$ = require('jquery')
  window.ipc = require('electron').ipcRenderer
})
