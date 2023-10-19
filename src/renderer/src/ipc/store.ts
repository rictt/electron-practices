import { IpcRendererService } from './index'

const CONFIG_KEY = '__CONFIG__'

export class StoreIpcRendererService extends IpcRendererService {
  constructor() {
    super('store')
  }

  get(key: string) {
    return this.invoke('get', { key })
  }

  set(key: string, value: any) {
    return this.invoke('set', { key, value })
  }

  getConfig() {
    return this.get(CONFIG_KEY) || {}
  }

  async setConfig(value: any, override = false) {
    if (!override) {
      const oldConfig = await this.getConfig()
      return this.set(CONFIG_KEY, { ...oldConfig, ...value })
    }
    return this.set(CONFIG_KEY, value)
  }
}

export const storeIpcRendererService = new StoreIpcRendererService()
