import { IpcMainBaseController } from './base'
import type { IpcMainEvent } from 'electron'
import { BrowserWindow, screen, desktopCapturer, clipboard, nativeImage } from 'electron'
import { captureWindow } from '../../captureWindow'

export const setCaptureWindowMax = async () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  captureWindow?.setSize(width, height)
}

export class SystemController extends IpcMainBaseController {
  constructor() {
    super('system')
  }

  async closeWindow(event: IpcMainEvent) {
    return event.sender.close()
  }

  async hideWindow(event: IpcMainEvent) {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.hide()
  }

  async showWindow(event: IpcMainEvent) {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.show()
  }

  async screenShot(event: IpcMainEvent, params: Size, options?: InvokeOptions) {
    const size = await this.getScreenSize()
    return new Promise((resolve, reject) => {
      desktopCapturer
        .getSources({
          types: ['screen'],
          thumbnailSize: {
            width: size.width,
            height: size.height
          }
        })
        .then((sources) => {
          const imgSrc = sources[0].thumbnail.toDataURL()
          clipboard.writeImage(nativeImage.createFromDataURL(imgSrc))
          resolve(imgSrc)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  async showCapture(event: IpcMainEvent) {
    await setCaptureWindowMax()
    await captureWindow?.setFullScreen(true)
    await captureWindow?.show()
    await captureWindow?.setAlwaysOnTop(true)
    await captureWindow?.focus()
  }

  // 最小化当前窗口（发送请求的窗口）
  async windowMinimize(event: IpcMainEvent) {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.minimize()
    }
  }

  async getScreenSize() {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    return {
      width,
      height
    }
  }

  async setMini(event: IpcMainEvent, params: InvokeParams) {
    // eslint-disable-next-line prefer-const
    let { width, height, direction } = params
    direction = direction || 'right-bottom'
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.setSize(width, height)
      const areaInfo = screen.getPrimaryDisplay().workAreaSize
      if (direction === 'right-bottom') {
        const x = areaInfo.width - width
        const y = areaInfo.height - height
        window.setPosition(x, y)
      }
    }
  }

  async setSize(
    event: IpcMainEvent,
    width: number,
    height: number,
    full?: boolean,
    x?: number,
    y?: number
  ) {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (typeof x === 'number' && typeof y === 'number') {
      window?.setPosition(x, y)
    }
    if (window) {
      if (full) {
        window.maximize()
        window.setFullScreen(true)
        window.setAlwaysOnTop(true, 'screen-saver')
      } else {
        window.setSize(width, height)
      }
    }
  }
}
