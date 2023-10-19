const { contextBridge, ipcRenderer } = require('electron')
console.log(contextBridge)

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
window.ipcRenderer = ipcRenderer
