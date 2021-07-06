import path from 'path'
import esbuild from 'esbuild'
import fs from 'fs'
import os from 'os'
import vite from 'vite'
import { RollupOutput, RollupWatcher } from 'rollup'
import viteConfig from '../../vite.config'
import electronConfig from '../../electron.config'

// electron.config.jsが存在しない場合のデフォルト設定値
const defaultConfig = {
  main: path.join(process.cwd(), "src/application/index.ts"),
  build: {
    appId: 'vue-electron-template',
    productName: 'vue-electron-template'
  },
  env: {
    test: {},
    dev: {},
    release: {}
  }
}

export class Base {
  /** electron.config */
  protected config = electronConfig || defaultConfig
  protected projectPath = process.cwd()
  protected bundledDir = viteConfig.build.outDir || path.join(this.projectPath, 'dist')
  protected releaseDir = path.join(this.bundledDir, 'release')
  protected viteServerPort = 3000

  /**
   * 実行に必要なディレクトリを準備する
   */
  protected prepareDirs(): void {
    // dist ディレクトリが存在しなければ作る
    if (!fs.existsSync(this.bundledDir)) {
      fs.mkdirSync(this.bundledDir, { recursive: true });
    }
  }

  protected preparePackageJson(): void {
    const pkgJsonPath = path.join(process.cwd(), "package.json")
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
    //https://github.com/electron-userland/electron-builder/issues/4157#issuecomment-596419610
    const electronConfig = localPkgJson.devDependencies.electron.replace("^","")
    localPkgJson.main = "entry.js"
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies
    localPkgJson.devDependencies = {electron:electronConfig}
    fs.writeFileSync(
      path.join(this.bundledDir, "package.json"),
      JSON.stringify(localPkgJson)
    )
    // node_modulesがない場合作っておく
    if (!fs.existsSync(`${this.bundledDir}/node_modules`)) {
      fs.mkdirSync(path.join(this.bundledDir, "node_modules"))
    }
  }

  /**
   * vite build処理
   * https://vitejs.dev/guide/api-javascript.html#build
   */
   protected async buildRender(): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
    return await vite.build(viteConfig)
  }

  /**
   * electron起動用のビルド処理
   * @param env
   */
  protected buildMain(env = "dev"): void {
    const outfile = path.join(this.bundledDir, "entry.js");
    const entryFilePath = path.join(this.projectPath, this.config.main);
    // esbuildによるバンドル処理
    esbuild.buildSync({
      entryPoints: [entryFilePath],
      outfile,
      minify: env === "release",
      bundle: true,
      platform: "node",
      sourcemap: false,
      external: ["electron"],
    })
    // 環境変数設定
    const envObj = this.config.env[env]
    envObj.ENV = env
    envObj.WEB_PORT = this.viteServerPort.toString()
    const envScript = `process.env={...process.env,...${JSON.stringify(envObj)}};`
    const js = `${envScript}${os.EOL}${fs.readFileSync(outfile)}`
    fs.writeFileSync(outfile, js)
  }
}
