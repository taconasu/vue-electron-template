import { spawn, ChildProcess } from "child_process"
import * as vite from "vite"
import { Base } from "./base"
import { ViteDevServer } from 'vite'
import * as path from 'path'
import * as chalk from 'chalk'
import viteConfig from '../../vite.config'

export class Dev extends Base {
  private viteServer: ViteDevServer
  private electronProcess: ChildProcess

  private viteServerOnErr(err) {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${this.viteServerPort} is in use, trying another one...`
      )
      setTimeout(() => {
        this.viteServer.close()
        this.viteServerPort += 1
        this.viteServer.listen(this.viteServerPort)
      }, 100)
    } else {
      console.error(chalk.red(`[vite] server error:`))
      console.error(err)
    }
  }

  private async createViteServer() {
    const options: vite.InlineConfig = viteConfig
    this.viteServer = await vite.createServer(options)
    this.viteServer.httpServer.on("error", (e: any) => this.viteServerOnErr(e))
    this.viteServer.httpServer.on("data", (e: any) => {
      console.log(e.toString())
    })
    this.viteServer.listen(this.viteServerPort, false)
  }

  private createElectronProcess() {
    this.electronProcess = spawn(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('electron').toString(),
      [path.join(this.bundledDir, 'entry.js')],
      {
        env: { },
      }
    )
    this.electronProcess.on('close', () => {
      this.viteServer.close()
      process.exit()
    })
    this.electronProcess.stdout.on('data', (data: any) => {
      data = data.toString()
      console.log(data)
    })
  }

  async start(argv?): Promise<void> {
    this.prepareDirs()
    this.buildMain('dev')
    if (argv && argv.debug) {
      console.log('launch electron through your debugger')
      return
    }
    await this.buildRender()
    // electron起動
    this.createElectronProcess()
    // WEBアプリ起動
    await this.createViteServer()
  }
}
