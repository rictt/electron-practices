import { app, BrowserWindow, globalShortcut } from 'electron'
import { join } from 'path'
import { setCaptureWindowMax } from './ipc/controller/system'

export let captureWindow: BrowserWindow | null

export function createCaptureWindow() {
  const isMac = process.platform === 'darwin'
  const macOptions = isMac
    ? {
        fullscreen: false,
        width: 0,
        height: 0
      }
    : {}
  captureWindow = new BrowserWindow({
    title: '',
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
    // fullscreen: true,
    fullscreen: process.platform === 'win32',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    ...macOptions
  })

  captureWindow.setAlwaysOnTop(true, 'screen-saver')
  // 设置窗口在所有工作区都可见
  captureWindow.setVisibleOnAllWorkspaces(true)

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
    setCaptureWindowMax()
    captureWindow?.show()
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    captureWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/capture.html`)
  } else {
    captureWindow.loadFile(join(__dirname, '../renderer/capture.html'))
  }

  captureWindow.once('ready-to-show', () => {})

  captureWindow.on('close', () => {
    globalShortcut.unregister('f12')
  })
}
