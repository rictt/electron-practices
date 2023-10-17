import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('ipcRenderer', electronAPI.ipcRenderer)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('process', electronAPI.process)
    console.log(window.process)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.ipcRenderer = electronAPI.ipcRenderer
  // @ts-ignore (define in dts)
  window.process = electronAPI.process
  // @ts-ignore (define in dts)
  window.api = api
}
