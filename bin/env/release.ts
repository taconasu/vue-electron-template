import { Base } from "./base"
import builder from 'electron-builder'

export class Build extends Base {
  /**
   * electronアプリケーションのインストーラのビルド
   */
  private async buildInstaller() {
    // https://www.electron.build/configuration/configuration
    return builder.build({
      config: {
        directories: {
          output: this.releaseDir,
          app: this.bundledDir,
        },
        // files: [
        //   'release/bundled/',
        //   'node_modules/',
        //   'package.json'
        // ],
        extends: null,
        ...this.config.build,
      },
      projectDir: process.cwd(),
      publish: 'never'
    })
  }

  async start(argv?): Promise<void> {
    this.prepareDirs()
    await this.buildRender()
    this.preparePackageJson()
    this.buildMain("release")
    await this.buildInstaller()
  }
}
