import { IpcRendererService } from './index'
import type { IpcRendererEvent, OpenDialogOptions } from 'electron'

type TypeFormatParams = {
  storageDir: string
  inputFilePath: string
  outputFilePath: string
  onProgress?: Function
  onFinished?: Function
}

type TypeScreenRecord = {
  width?: string | number
  height?: string | number
  input?: string
  outputPath?: string
  closeChannel?: string
}

type RecordInstance = {
  close: Function
}

export class FFMpegIpcRendererService extends IpcRendererService {
  constructor() {
    super('ffmpeg')
  }

  async flvToMp4(formatParams: TypeFormatParams) {
    const progressChannel = this.generateResponseChannel('progress')
    const finishedChannel = this.generateResponseChannel('finished')
    const { onProgress, onFinished } = formatParams

    if (onProgress) {
      this.ipcRenderer.on(progressChannel, (event: IpcRendererEvent, args: any) => {
        onProgress(args)
      })
    }
    if (onFinished) {
      this.ipcRenderer.on(finishedChannel, (event: IpcRendererEvent, args: any) => {
        onFinished(args)
      })
    }

    delete formatParams.onProgress
    delete formatParams.onFinished

    const result = await this.invoke('flvToMp4', {
      ...formatParams,
      processReplyChannel: progressChannel,
      finishedReplyChannel: finishedChannel
    })
    this.ipcRenderer.removeAllListeners(progressChannel)
    this.ipcRenderer.removeAllListeners(finishedChannel)
    return result
  }

  async getMetadata(filePath: string) {
    return await this.invoke('getMetadata', filePath)
  }

  async getCapturerSources() {
    return await this.invoke('getCapturerSources')
  }

  async screenRecord(params: TypeScreenRecord | any): Promise<RecordInstance> {
    const closeChannel = this.generateResponseChannel('close')
    params.closeChannel = closeChannel
    await this.invoke('screenRecord', params)
    return {
      close: async () => {
        const r = await this.ipcRenderer.invoke(params.closeChannel)
      }
    }
  }
}

export const ffmpegIpcRendererService = new FFMpegIpcRendererService()
