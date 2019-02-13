#!/usr/bin/env node
import '@babel/polyfill'
import fs from 'fs'
import { configure } from './index'

const [,, ...args] = process.argv

const help = () => {
  console.log('Usage: chaos <command> [options]\n')

  console.log('Options:')
  console.log('-h, --help   \toutput usage information')
  console.log('-V, --version\toutput the version number\n')

  console.log('Commands:')
  console.log('initdb  \tinit db, Usage: chaos initdb <config-file-path>')
  console.log('updatedb\tupdate db, Usage: chaos updatedb <config-file-path>')
}

const version = () => {
  console.log('0.1.2')
}

const initdb = async () => {
  if (args.length < 2) {
    console.log('Invalid config file, Usage: chaos initdb <config-file-path>')
    return
  }
  const str = fs.readFileSync(args[1], 'utf8')
  const options = JSON.parse(str)
  const dbManager = await configure(options)
  await dbManager.rebuild()
  console.log(`Current db version: ${dbManager.version}`)
}

const updatedb = async () => {
  if (args.length < 2) {
    console.log('Invalid config file, Usage: chaos update <config-file-path>')
    return
  }
  const str = fs.readFileSync(args[1], 'utf8')
  const options = JSON.parse(str)
  const dbManager = await configure(options)
  const version = await dbManager.getCurrentVersion()
  console.log(`Before update db version: ${version}`)
  await dbManager.update()
  console.log(`After update db version: ${dbManager.version}`)
}

if (args.length === 0) {
  help()
} else {
  switch (args[0]) {
  case '-V':
  case '--version':
  case '-v':
    version()
    break
  case '-h':
  case '--help':
    help()
    break
  case 'initdb':
    initdb()
    break
  case 'updatedb':
    updatedb()
    break
  default:
    console.log('Invalid command, try chaos --help')
  }
}

