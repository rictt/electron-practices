type MediaToDataURLParams = {
  width: number
  height: number
  x: number
  y: number
  source: CanvasImageSource
  downloadName?: string
}

export const mediaSourceToDataURL = (params: MediaToDataURLParams) => {
  // mac下由于tray的存在，截图y值需要进行高度偏移
  // tray的高度暂时通过new一个tray实例，然后获取bounds返回高度
  const trayHeight = process.platform === 'darwin' ? 24 : 0
  const { width, height, x, y, source, downloadName } = params

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.width = width
  canvas.height = height
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(source, x, y + trayHeight, width, height, 0, 0, width, height)
  const url = canvas.toDataURL('image/png', 1)
  if (downloadName) {
    downloadURL(url, downloadName)
  }
  return url
}

export const downloadURL = (url: string, downloadName?: string) => {
  const a = document.createElement('a')
  a.download = downloadName ? downloadName : new Date().toTimeString()
  a.href = url
  a.click()
}
