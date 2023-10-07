import { IpcMainBaseController } from './base'
import type { IpcMainEvent } from 'electron'
import { BrowserWindow, screen } from 'electron'
import { createCaptureWindow, captureWindow } from '../../index'

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

  async showCapture(event: IpcMainEvent) {
    this.windowMinimize(event)
    captureWindow?.show()
  }

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

  async setMini(event: IpcMainEvent, width: number, height: number, direction?: string) {
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
    console.log(width, height, full, x, y)
    if (typeof x === 'number' && typeof y === 'number') {
      window?.setPosition(x, y)
    }
    if (window) {
      if (full) {
        window.maximize()
        window.setFullScreen(true)
        window.setAlwaysOnTop(true, "screen-saver")
      } else {
        window.setSize(width, height)
      }
    }
  }
}
