import { IpcMainBaseController } from './base'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import { desktopCapturer, ipcMain } from 'electron'

type MetaData = {
  streams: any
  format: any
}

export const getMetadata = (fileName: string): Promise<MetaData> => {
  return new Promise((resolve, reject) => {
    const path = fileName
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      resolve(metadata)
    })
  })
}

export const flvToMp4 = (inputFilePath: string, outputFilePath: string, ops?: any) => {
  return new Promise((resolve) => {
    const cmd = new ffmpeg(inputFilePath)
    if (ops.onProgress) {
      cmd.on('progress', ops.onProgress)
    }
    cmd.on('end', function () {
      ops.onFinish && ops.onFinish()
      resolve(null)
    })
    cmd.format('mp4')
    cmd.save(outputFilePath)
  })
}

export class FFMpegController extends IpcMainBaseController {
  constructor() {
    super('ffmpeg')
  }

  async flvToMp4(event: IpcMainEvent, args) {
    const { storageDir, inputFilePath, outputFilePath, ...rest } = args
    const data = await getMetadata(inputFilePath)
    const processReplyChannel = args.processReplyChannel || ''
    const finishedReplyChannel = args.finishedReplyChannel || ''
    // const outputFilePath = "C:\\Users\\liaozhicheng\\Desktop\\代办项\\test3.mp4"
    await flvToMp4(inputFilePath, outputFilePath, {
      onProgress: (progress) => {
        processReplyChannel && event.sender.send(processReplyChannel, progress)
      },
      onFinish: (progress) => {
        finishedReplyChannel && event.sender.send(finishedReplyChannel, progress)
      }
    })
    return data
  }

  async getMetadata(event: IpcMainEvent, filePath: string) {
    return await getMetadata(filePath)
  }

  async getCapturerSources(event: IpcMainEvent) {
    const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] })
    return sources || []
    // console.log(sources)
    // for (const source of sources) {
    //   if (source.name === 'Electron') {
    //     return source.id
    //   }
    // }
    // return null
  }

  async screenRecord(event: IpcMainEvent, params: any) {
    // 需要提供结束方法
    console.log('start screen record')
    console.log('start screen record params： ', params)
    const { x, y, width, height } = params
    const inputOptions: any[] = []
    inputOptions.push('-f dshow')
    // if (x && y) {
    //   inputOptions.push(
    //     `offset_x ${x}`,
    //     `offset_y ${y}`
    //   )
    // }
    if (width && height) {
      inputOptions.push(
        // `-s ${width}x${height}`
        `-s ${1920}x${1080}`
      )
    }
    console.log("inputOptions: ", inputOptions)
    const cmd = new ffmpeg()
    cmd
      .input('video=screen-capture-recorder')
      .inputOptions(inputOptions)
      .videoCodec('libx264')
      // 如果是可以保证正常录制结束，可以保证MP4不会损坏
      // 如果是异常中断，MP4可能会损坏播放不了，这种情况考虑flv格式
      .output('F:\\test.mp4')
      .outputOptions(['-pix_fmt yuv420p'])
      .on('progress', function (progress) {
        console.log('time: ' + progress.timemark)
      })
      .on('error', function (err) {
        //ffmpeg出错时的回调
        console.log('An error occurred: ' + err.message)
      })
      .on('end', function () {
        console.log('Processing finished !')
      })

    cmd.run()

    if (params.closeChannel) {
      ipcMain.handle(params.closeChannel, (event: IpcMainInvokeEvent) => {
        cmd.ffmpegProc.stdin.write('q\n')
        return true
      })
    }
  }
}
