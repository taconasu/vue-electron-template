
const esbuild = require("esbuild")
const { readFileSync } = require("fs")
const path = require("path")

let pkgJsonPath = path.join(process.cwd(), "package.json")
let localPkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"))

// esbuild
esbuild.buildSync({
  entryPoints: ["./bin/index.js"],
  outfile: "./dist/cli.js",
  bundle: true,
  platform: "node",
  external: Object.keys({
    ...(localPkgJson.dependencies || {}),
    ...(localPkgJson.devDependencies || {}),
    ...(localPkgJson.peerDependencies || {}),
  }),
});
