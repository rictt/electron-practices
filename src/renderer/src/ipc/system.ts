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
    return await this.invoke('setSize', { width, height, full, x, y })
  }

  async setMini(width, height, direction?) {
    return await this.invoke('setMini', { width, height, direction })
  }

  async showCapture(mode?: string) {
    return this.invoke('showCapture', { mode })
  }

  async getScreenSize() {
    return this.invoke('getScreenSize')
  }

  /**
   * 凭借electron提供的desktopCapture，将屏幕绘制下来，送到浏览器进行canvas区域裁剪
   */
  async screenShotByDeskCapture(params: Size) {
    return new Promise((resolve) => {
      this.invoke('screenShot', params).then((base64Url) => {
        const image = new Image()
        image.onload = () => {
          const url = mediaSourceToDataURL({ source: image, ...params })
          resolve(url)
        }
        image.src = base64Url
      })
    })
  }

  /**
   * 凭借chrome提供的媒体采集，直接在浏览器获取桌面的媒体信号，然后转换成canvas，裁剪成对应尺寸的图片
   */
  async screenShowByUserMedia(params: Size) {
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

    return new Promise((resolve) => {
      const { width, height, x, y } = params
      const video = document.createElement('video')

      video.srcObject = stream
      video.style.width = screen.width + 'px'
      video.style.height = screen.height + 'px'
      video.onloadeddata = () => {
        video.play()
        const url = mediaSourceToDataURL({ source: video, width, height, x, y })
        stream.getTracks()[0].stop()
        resolve(url)
      }
    })
  }

  async screenShot(params: Size) {
    await this.hideWindow()
    // return await this.screenShowByUserMedia(params)
    return await this.screenShotByDeskCapture(params)
  }
}

export const systemIpcRendererService = new SystemIpcRendererService()
