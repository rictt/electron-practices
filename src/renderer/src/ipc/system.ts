import { IpcRendererService } from './index'
export class SystemIpcRendererService extends IpcRendererService {
  constructor() {
    super('system')
  }

  async closeWindow() {
    return await this.invoke('closeWindow')
  }

  async setSize(width, height) {
    return await this.invoke('setSize', width, height)
  }

  async setMini(width, height, direction?) {
    return await this.invoke('setMini', width, height, direction)
  }

  async showCapture() {
    return this.invoke('showCapture')
  }
  
}

export const systemIpcRendererService = new SystemIpcRendererService()