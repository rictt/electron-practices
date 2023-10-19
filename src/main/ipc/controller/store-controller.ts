import Store from 'electron-store'
import type { IpcMainEvent } from 'electron'
import { IpcMainBaseController } from './base'

export const store = new Store()

export class StoreController extends IpcMainBaseController {
  constructor() {
    super('store')
  }

  get(event: IpcMainEvent, params: InvokeParams) {
    const { key } = params
    return store.get(key)
  }

  set(event: IpcMainEvent, params: InvokeParams) {
    const { key, value } = params
    return store.set(key, value)
  }
}
