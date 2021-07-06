import { BrowserWindow, webContents } from "electron"

export class Page {
  public load(win: BrowserWindow | webContents, url: string): void {
    if (process.env.ENV === "dev") {
      win.loadFile(`${url}`)
    } else {
      win.loadURL(`file://${__dirname}/${url}`)
    }
  }
}
