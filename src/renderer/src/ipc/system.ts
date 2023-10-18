import { IpcRendererService } from './index'
import { mediaSourceToDataURL } from '@/utils/canvas'

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

  async setSize(width, height, full?, x?, y?) {
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

  async screenShot(params: Size) {
    const { width, height, x, y } = params
    const screen = await this.getScreenSize()
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          width: screen.width,
          height: screen.height
        }
      }
    })
    const video = document.createElement('video')

    video.srcObject = stream
    video.style.width = screen.width + 'px'
    video.style.height = screen.height + 'px'
    video.onloadeddata = () => {
      video.play()
      mediaSourceToDataURL({ source: video, width, height, x, y, downloadName: 'screenshot.png' })
      stream.getTracks()[0].stop()
    }
  }
}

export const systemIpcRendererService = new SystemIpcRendererService()
