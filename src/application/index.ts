import { app, BrowserWindow, screen } from "electron"
import Store from 'electron-store'
import { Page } from './page'

// ストアの項目の型定義
type StoreType = {
  window: {
    pos: Array<number>,
    size: Array<number>
  }
}
// ストアにサイズ情報がない場合のデフォルトサイズ定義
const DEFAULT_SIZE = {
  width: 800,
  height: 600
}

let win: BrowserWindow
const store = new Store<StoreType>()

function createWindow () {
  const pos: Array<number> = store.get('window.pos')  || getCenterPosition()
  const size: Array<number> = store.get('window.size') || [DEFAULT_SIZE.width, DEFAULT_SIZE.height]

  win = new BrowserWindow({
    width: size[0],
    height: size[1],
    x: pos[0],
    y: pos[1],
    webPreferences: {
      preload: 'preload.js'
    }
  })
  new Page().load(win, "index.html")

  win.on('close', () => {
    store.set('window.pos', win.getPosition())  // ウィンドウの座標を記録
    store.set('window.size', win.getSize())     // ウィンドウのサイズを記録
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * ウィンドウの中央の座標を返却
 *
 * @return {array}
 */
const getCenterPosition = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const x = Math.floor( (width - DEFAULT_SIZE.width) / 2)
  const y = Math.floor( (height - DEFAULT_SIZE.height) / 2)
  return([x, y]);
}
