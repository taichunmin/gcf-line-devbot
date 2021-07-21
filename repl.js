const _ = require('lodash')
const Repl = require('repl')

require('dotenv').config() // init dotenv

const repl = Repl.start('> ')
if (repl.setupHistory) {
  repl.setupHistory('.node_repl_history', (err, r) => {
    if (err) console.log(err)
  })
}

repl.context.process.env = {
  ...repl.context.process.env,
  NODE_ENV: 'development',
  DEBUG: 'app:*',
  DEBUG_COLORS: true,
}

repl.context._ = _
repl.context.log = require('debug')('app:repl')
