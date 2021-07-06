#!/usr/bin/env node

import { Dev } from './env/dev'
import { Build } from './env/release'

const argv = require('minimist')(process.argv.slice(2));

(async () => {
  const command = argv._[0];
  const { help, h, version, v } = argv;
  if (help || h) {
    return
  } else if (version || v) {
    return
  }
  if (command === 'start') {
    await new Dev().start(argv)
  }
  else if (command === 'release') {
    await new Build().start(argv)
  }
})()
