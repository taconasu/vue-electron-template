export default {
  main: "src/application/index.ts",
  build: {
    appId: "com.xland.app",
    productName: "vue-electron-template",
    mac: {
      target: 'dmg',
      icon: 'public/ninja-icon.png'
    },
    win: {
      target: 'nsis',
      icon: 'public/ninja-icon.png'
    },
  },
  env: {
    test: {},
    dev: {},
    release: {}
  }
}