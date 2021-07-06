# vue-electron-template

Vue3 / ESBuild / vite を利用したElectronボイラープレート。
個人用なので諸々のメンテナンスは保証しません。

## Commands

### vite起動

electronを起動しない、シンプルなローカルWEBアプリケーションの起動。

```sh
$ npm run dev
```

### クライアントビルド

※各コマンド実行時に毎回行っているので個別で実行する必要はありません。

```sh
$ npm run build
```

### electron起動

同時にviteによるローカルWEBアプリケーションも起動します。

```sh
$ npm run start
```

### electronアプリケーションのビルド

インストーラを生成します。

```sh
$ npm run release
```

### Linter

```sh
$ npm run lint
```
