import { BrowserWindow } from 'electron'

type NetworkUtilParams = {
  browser: BrowserWindow
}
type ResponseStatus = 'init' | 'pending' | 'success' | 'failed'

type InterceptItem = {
  condition: (url: string, ...any) => boolean
  callback: (res: any) => void
}

type Response = {
  url: string
  requestId: string
  response: any
  status: ResponseStatus
  base64Encoded?: boolean
  callbackList: any[]
  [key: string]: any
}

export class NetworkUtil {
  responseMap: {
    [key: string]: Response
  }
  browser: BrowserWindow
  interceptList: InterceptItem[]

  constructor(params: NetworkUtilParams) {
    const { browser } = params
    this.browser = browser
    this.responseMap = {}
    this.interceptList = []
    this.initDebugger()
  }

  initDebugger() {
    try {
      this.browser.webContents.debugger.attach('1.1')
    } catch (error) {
      console.log('init debugger failed: ', error)
    }

    console.log('debugger success!!')

    this.browser.webContents.debugger.on('detach', (event, message) => {
      console.log('控制台连接中断', message)
    })

    this.browser.webContents.debugger.on('message', this.onDebuggerMessage.bind(this))
    this.browser.webContents.debugger.sendCommand('Network.enable')
  }

  onDebuggerMessage(event, method, params) {
    const url = params?.request?.url ?? params?.response?.url ?? ''
    const requestId = params.requestId
    const onRequestWillBeSent = () => {
      this.interceptList.forEach((callbackItem) => {
        const { condition, callback } = callbackItem
        if (!condition || typeof condition !== 'function') {
          return
        }
        if (condition(url)) {
          const res: Response = {
            requestId,
            url: url,
            status: 'init',
            response: '',
            callbackList: [callback]
          }
          this.responseMap[requestId] = res
        }
      })
    }
    const onResponseReceived = () => {}
    const onLoadingFinished = () => {
      const responseItem = this.responseMap[requestId]
      if (!responseItem) {
        return
      }
      const { callbackList } = responseItem
      if (callbackList && callbackList.length) {
        this.getResponseBody({
          requestId
        }).then((responseItem: Response) => {
          responseItem.callbackList.forEach((callback) => callback(responseItem.response))
        })
      }
    }

    switch (method) {
      case 'Network.requestWillBeSent':
        onRequestWillBeSent()
        break
      case 'Network.responseReceived':
        onResponseReceived()
        break
      case 'Network.loadingFinished':
        onLoadingFinished()
        break
    }
  }

  getResponseBody(queryParams: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      const { requestId } = queryParams
      this.browser.webContents.debugger
        .sendCommand('Network.getResponseBody', queryParams)
        .then((response) => {
          this.responseMap[requestId].status = 'success'
          const { base64Encoded, body } = response
          if (base64Encoded) {
            this.responseMap[requestId].response = Buffer.alloc(
              body.length,
              body,
              'base64'
            ).toString('ascii')
          } else {
            console.log('not found code mode: ', response)
            this.responseMap[requestId].response = body
          }
        })
        .catch((error) => {
          if (this.responseMap[requestId]) {
            this.responseMap[requestId].status = 'failed'
            console.log('getResponseBody catch error: ', error)
          }
          reject(this.responseMap[requestId])
        })
        .finally(() => {
          resolve(this.responseMap[requestId])
        })
    })
  }

  addIntercept(intercept: InterceptItem) {
    this.interceptList.push(intercept)
  }
}
