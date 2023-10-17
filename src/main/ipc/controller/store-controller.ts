import Store from 'electron-store'
import type { IpcMainEvent } from 'electron'
import { IpcMainBaseController } from './base'

export const store = new Store()

export class StoreController extends IpcMainBaseController {
  constructor() {
    super('store')
  }

  get(event: IpcMainEvent, key: string) {
    return store.get(key)
  }

  set(event: IpcMainEvent, key: string, value: any) {
    return store.set(key, value)
  }
}
