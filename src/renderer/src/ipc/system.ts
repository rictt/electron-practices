import { IpcRendererService } from './index'
export class SystemIpcRendererService extends IpcRendererService {
  constructor() {
    super('system')
  }

  async closeWindow() {
    return await this.invoke('closeWindow')
  }

  async showWindow() {
    return await this.invoke('showWindow')
  }

  async hideWindow() {
    return await this.invoke('hideWindow')
  }

  async setSize(width, height, full?,  x?, y?) {
    return await this.invoke('setSize', width, height, full, x, y)
  }

  async setMini(width, height, direction?) {
    return await this.invoke('setMini', width, height, direction)
  }

  async showCapture() {
    return this.invoke('showCapture')
  }

  async getScreenSize() {
    return this.invoke('getScreenSize')
  }
  
}

export const systemIpcRendererService = new SystemIpcRendererService()