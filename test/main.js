const { app, shell, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const { join } = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    title: '',
    show: true,
    transparent: true,
    // frame: false,
    // alwaysOnTop: true,
    webPreferences: {
      devTools: true,
      preload: join(__dirname, './perload.js'),
      sandbox: false
    }
  })

  console.log(1234)

  mainWindow.setAlwaysOnTop(true, 'screen-saver')
  // 设置窗口在所有工作区都可见
  mainWindow.setVisibleOnAllWorkspaces(true)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  ipcMain.handle('window:show', () => {
    mainWindow.show()
  })
  ipcMain.handle('window:hide', () => {
    mainWindow.hide()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.loadFile(join(__dirname, './index.html'))
}

function whenAppReady() {
  createWindow()

  globalShortcut.register('f2', () => {
    mainWindow.show()
  })

  globalShortcut.register('esc', () => {
    mainWindow.hide()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}

app.whenReady().then(() => {
  whenAppReady()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
