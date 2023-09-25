import { IpcMainBaseController } from './base'
import type { IpcMainEvent } from 'electron'
import { BrowserWindow, screen } from 'electron';
import { createCaptureWindow } from '../../index'

export class SystemController extends IpcMainBaseController {
  constructor() {
    super('system')
  }

  async closeWindow(event: IpcMainEvent) {
    return event.sender.close();
  }

  async showCapture(event: IpcMainEvent) {
    this.windowMinimize(event)
    createCaptureWindow()
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
      window.setMaximumSize(width, height)
      window.setMinimumSize(width, height)
      window.setSize(width, height)
      const areaInfo = screen.getPrimaryDisplay().workAreaSize
      if (direction === 'right-bottom') {
        const x = areaInfo.width - width
        const y = areaInfo.height - height
        window.setPosition(x, y)
      }
    }
  }

  async setSize(event: IpcMainEvent, width: number, height: number) {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.setSize(width, height)
    }
  }
}
