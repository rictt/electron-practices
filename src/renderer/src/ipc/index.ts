/**
 * 把ipc通信类比成http通信
 *
 * ipc事件发送类比http请求
 * ipc事件返回类比http返回
 */

import type { IpcRenderer } from 'electron'
export class IpcRendererService {
  prefix: string
  ipcRenderer: IpcRenderer
  constructor(prefix: string) {
    this.prefix = prefix
    this.ipcRenderer = (window.electron.ipcRenderer || window.ipcRenderer) as unknown as IpcRenderer
  }

  generateResponseChannel(channel: string) {
    return `${channel}_response_${Date.now()}`
  }

  async invoke(channel: string, ...params: any[]): Promise<any> {
    // async invoke(channel: string, params?: any) {
    const fullChannel = `${this.prefix}:${channel}`
    try {
      const result = await this.ipcRenderer.invoke(fullChannel, ...params)
      return result
    } catch (error) {
      console.error('[invoke error]: ', error)
      throw error
    }
  }
}
