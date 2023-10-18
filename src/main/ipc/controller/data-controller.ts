import type { IpcMainEvent } from 'electron'
import { IpcMainBaseController } from './base'
import { BrowserWindow } from 'electron'

export const state = {
  capture: {
    mode: 'screenrecord',
    screenshotUrl: ''
  }
}

type StateListenerItem = {
  key: string
  responseChannel: string
}

export class DataController extends IpcMainBaseController {
  stateListeners: StateListenerItem[]
  constructor() {
    super('data')
    this.stateListeners = []
  }

  listener(event: IpcMainEvent, key: string, responseKey: string) {
    this.stateListeners.push({
      key,
      responseChannel: responseKey
    })
  }

  getMode() {
    return state.capture.mode
  }

  setMode(event: IpcMainEvent, value: string) {
    state.capture.mode = value
  }

  get(event: IpcMainEvent, key: string) {
    if (key.indexOf('.') !== -1) {
      const keys = key.split('.')
      let value = state[keys[0]]
      for (let i = 1; i < keys.length; i++) {
        value = value[keys[i]]
        if (!value) {
          return value
        }
      }
      return value
    }
    return state[key]
  }

  set(event: IpcMainEvent, key: string, newValue: any) {
    if (key.indexOf('.') !== -1) {
      const keys = key.split('.')
      let value = state[keys[0]]
      for (let i = 1; i < keys.length - 1; i++) {
        value = value[keys[i]]
      }
      value[keys[keys.length - 1]] = newValue
    } else {
      state[key] = newValue
    }

    this.stateListeners.forEach((listener) => {
      if (listener.key === key) {
        const windows = BrowserWindow.getAllWindows()
        windows.forEach((window) => {
          window.webContents.send(listener.responseChannel, newValue)
        })
      }
    })
  }
}
