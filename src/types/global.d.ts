type Size = {
  width: number
  height: number
  x: number
  y: number
}

type ResponseChannel = {
  responseChannel: string
}

type InvokeParams = {
  [key: string]: any
}

type InvokeOptions = {
  onSuccess?: (event: IpcRendererEvent, ...params: any[]) => void
  onFail?: (event: IpcRendererEvent, ...params: any[]) => void
  onSuccessChannel?: string
  onFailChannel?: string
  once?: boolean
}
