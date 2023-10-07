import { OpenDialogOptions, dialog } from 'electron'
import { IpcMainBaseController } from './base'
import type { IpcMainEvent } from 'electron'
import * as osenv from 'osenv'
import * as fs from 'fs'
import * as path from 'path'

export type FILE_STAT = {
  dir?: string
  ext?: string
  root?: string

  isDirectory?: boolean
  isFile?: boolean
  fileName?: string

  [key: string]: any
}

// 不同系统下的用户个人文件夹位置不同，通过osenv来抹平差距
// https://www.cnblogs.com/tugenhua0707/p/11080473.html
export function getUsersHomeFolder() {
  return osenv.home()
}

const mapDirs = (dirs: string[]) => {
  return new Promise((resolve) => {
    if (!dirs || !dirs.length) {
      return resolve([])
    }
    const result: FILE_STAT[] = []
    let count = 0
    dirs.forEach((dir, index) => {
      fs.stat(dir, (err, data) => {
        if (data) {
          const parseUrl = path.parse(dir)
          result[index] = {
            dir: parseUrl.dir,
            fileName: parseUrl.base,
            isDirectory: data.isDirectory(),
            isFile: data.isFile(),
            ext: parseUrl.ext
          }
        }

        if (++count === dirs.length) {
          resolve(result)
        }
      })
    })
  })
}

const getDirs = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err)
      }
      const dirs = data.map((e) => path.join(filePath, e))
      mapDirs(dirs).then((res) => {
        resolve(res)
      })
    })
  })
}

export class FileController extends IpcMainBaseController {
  constructor() {
    super('file')
  }

  async open(event: IpcMainEvent, path: string, params?: any) {
    const module = await import('open')
    return module.default(path, params)
    // return open(path, params)
  }

  selectFile(event: IpcMainEvent, params: OpenDialogOptions) {
    return dialog.showOpenDialogSync(params)
  }

  getDirs(event: IpcMainEvent, path: string = getUsersHomeFolder()) {
    return getDirs(path)
  }

  getUserHome() {
    return getUsersHomeFolder()
  }

  pathJoin(event: IpcMainEvent, ...pathList) {
    return path.join(...pathList)
  }
}
