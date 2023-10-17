import { app, shell, BrowserWindow, globalShortcut, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerMainHanlders } from './ipc/index'
import { NetworkUtil } from './utils/network'

let mainWindow: BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1000,
    show: false,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon,
    webPreferences: {
      webviewTag: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false
    }
  })
  const network = new NetworkUtil({
    browser: mainWindow
  })
  network.addIntercept({
    condition: (url) => url.indexOf('.m3u8') !== -1,
    callback: (response) => {
      console.log('response: ', response)
    }
  })

  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.loadURL('https://www.med66.com/demo/linchuang/c724034-v1/')
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  // } else {
  //   mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  // }
}

export let captureWindow: BrowserWindow | null
export function createCaptureWindow() {
  captureWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    fullscreen: true
  })

  globalShortcut.register('f12', () => {
    captureWindow?.webContents?.openDevTools()
  })

  captureWindow.on('show', () => {
    globalShortcut.register('esc', () => {
      captureWindow?.hide()
    })
  })
  captureWindow.on('hide', () => {
    globalShortcut.unregister('esc')
  })

  globalShortcut.register('f2', () => {
    captureWindow?.show()
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    captureWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/capture.html`)
  } else {
    captureWindow.loadFile(join(__dirname, '../renderer/capture.html'))
  }

  captureWindow.once('ready-to-show', () => {})

  captureWindow.on('close', () => {
    // captureWindow = null;
    globalShortcut.unregister('f12')
  })
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'atom',
    privileges: {
      bypassCSP: true,
      standard: true,
      secure: true,
      supportFetchAPI: true
    }
  }
])

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  protocol.handle('atom', (request: any) => {
    console.log('request: ', request.url)
    console.log('handle: ', decodeURIComponent(request.url.slice('atom://'.length)))
    return decodeURIComponent(request.url.slice('atom://'.length))
  })
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // 暂时只兼容windows平台
  if (process.platform === 'win32') {
    setTimeout(() => {
      createCaptureWindow()
    }, 1000)
  }

  registerMainHanlders(mainWindow)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
