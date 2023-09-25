import { IpcRendererService } from './index'
import type { OpenDialogOptions } from 'electron'

export class FileIpcRendererService extends IpcRendererService {
  constructor() {
    super('file')
  }

  getDirs(p?: string) {
    return this.invoke('getDirs', p)
  }

  selectFile(params?: OpenDialogOptions) {
    return this.invoke('selectFile', params)
  }

  selectFolder(params?: OpenDialogOptions) {
    return this.invoke('selectFile', {
      ...params,
      properties : [
        'openDirectory'
      ]
    })
  }

  open(path: string, params?: any) {
    return this.invoke('open', path, params)
  }

  getUserHome() {
    return this.invoke('getUserHome')
  }

  pathJoin(...paths) {
    return this.invoke('pathJoin', ...paths)
  }
}

export const fileIpcRendererService = new FileIpcRendererService()