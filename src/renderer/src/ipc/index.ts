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

  generateChannel(...channels: (string | number)[]) {
    channels.push(Date.now())
    return channels.join('_')
  }

  initCallbackChannel(channel: string, options?: InvokeOptions) {
    if (!options) return
    const { once } = options
    const onFun = once ? this.ipcRenderer.once : this.ipcRenderer.on
    if (options.onSuccess) {
      options.onSuccessChannel = this.generateChannel(this.prefix, channel, 'success')
      onFun(options.onSuccessChannel, options.onSuccess)
    }
    if (options.onFail) {
      options.onFailChannel = this.generateChannel(this.prefix, channel, 'fail')
      onFun(options.onFailChannel, options.onFail)
    }
  }

  // async invoke(channel: string, ...params: any[]): Promise<any> {
  async invoke(channel: string, params?: InvokeParams, options?: InvokeOptions): Promise<any> {
    try {
      const fullChannel = `${this.prefix}:${channel}`
      this.initCallbackChannel(channel, options)
      const result = await this.ipcRenderer.invoke(
        fullChannel,
        params || {},
        options
          ? {
              onSuccessChannel: options?.onSuccessChannel,
              onFailChannel: options?.onFailChannel
            }
          : null
      )
      return result
    } catch (error) {
      console.error('[invoke error]: ', error)
      throw error
    }
  }
}
