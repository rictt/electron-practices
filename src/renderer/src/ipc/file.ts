import { IpcRendererService } from './index'
import type { OpenDialogOptions } from 'electron'

export class FileIpcRendererService extends IpcRendererService {
  constructor() {
    super('file')
  }

  getDirs(p?: string) {
    return this.invoke('getDirs', { path: p })
  }

  selectFile(params?: OpenDialogOptions): string[] | undefined {
    return this.invoke('selectFile', {
      ...params,
      properties: ['openFile', ...(params?.properties || [])]
    } as OpenDialogOptions)
  }

  selectFolder(params?: OpenDialogOptions) {
    return this.invoke('selectFile', {
      ...params,
      properties: ['openDirectory', ...(params?.properties || [])]
    })
  }

  open(path: string, params?: any) {
    return this.invoke('open', { path, params })
  }

  getUserHome() {
    return this.invoke('getUserHome')
  }

  pathJoin(...paths) {
    return this.invoke('pathJoin', ...paths)
  }
}

export const fileIpcRendererService = new FileIpcRendererService()
