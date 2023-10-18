import { IpcRendererService } from './index'
import { IpcRendererEvent } from 'electron'

export class DataIpcRendererService extends IpcRendererService {
  constructor() {
    super('data')
  }

  get(key: string) {
    return this.invoke('key', key)
  }

  set(key: string, value) {
    this.invoke('set', key, value)
  }

  listener(key: string, callback) {
    const responseChannel = this.generateResponseChannel('response')
    this.ipcRenderer.on(responseChannel, (event: IpcRendererEvent, args) => {
      console.log(key + 'change:  ' + args)
      callback(args)
    })

    this.invoke('listener', key, responseChannel)
    return {
      close: () => {}
    }
  }
}

export const dataIpcRendererService = new DataIpcRendererService()

/**
 * 流程，A窗口请求打开截图窗口，传递一些窗口参数，放在全局上
 * B窗口打开后，从全局上获取需要的参数作为初始化
 *
 * B窗口监听某某数据的变化
 * A修改数据，B触发监听
 */
