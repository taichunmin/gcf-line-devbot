require('dotenv').config()

const { log } = require('./libs/helper')
const { middlewareCompose } = require('./libs/helper')
const functions = require('@google-cloud/functions-framework')

const handler = middlewareCompose([
  require('./cors'),
  require('./gtag'),
  require('./line/handler/index'),
])

functions.http('main', async (req, res) => {
  try {
    await handler({ req, res })
  } catch (err) {
    log('ERROR', err)
    res.status(err.status || 500).send(err.message)
  }
})
