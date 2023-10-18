import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron'
import { IpcMainBaseController } from './controller/base'
import { FileController } from './controller/file-controller'
import { FFMpegController } from './controller/ffmpeg-controller'
import { StoreController } from './controller/store-controller'
import { SystemController } from './controller/system'
import { DataController } from './controller/data-controller'

export const enumControllerMethods = <T extends IpcMainBaseController>(clsInstance: T) => {
  const result = {}
  const filterKeys = ['constructor']
  const keys = Object.getOwnPropertyNames(clsInstance.constructor.prototype)
  keys.forEach((key) => {
    if (filterKeys.includes(key)) {
      return
    }
    const serviceFunction = clsInstance[key]
    if (typeof serviceFunction === 'function') {
      const channel = clsInstance.getChannelName(key)
      ipcMain.handle(channel, serviceFunction.bind(clsInstance))
      result[channel] = serviceFunction
    }
  })

  console.log('register result: ', result)
  return result
}

export const registerMainHanlders = (mainWindow: BrowserWindow) => {
  const file = new FileController()
  const ffmpeg = new FFMpegController()
  const store = new StoreController()
  const system = new SystemController()
  const data = new DataController()

  enumControllerMethods(file)
  enumControllerMethods(ffmpeg)
  enumControllerMethods(store)
  enumControllerMethods(system)
  enumControllerMethods(data)

  const controllers = {
    file,
    ffmpeg,
    store,
    system,
    data
  }

  return controllers
}
