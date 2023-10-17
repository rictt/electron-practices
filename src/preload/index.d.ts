import { ElectronAPI, IpcRenderer, NodeProcess } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    ipcRenderer: IpcRenderer
    api: unknown
    process: NodeProcess
  }
}
