require('dotenv').config()

const _ = require('lodash')
const { log } = require('./libs/helper')
const { middlewareCompose } = require('./libs/helper')
const functions = require('@google-cloud/functions-framework')

const handlers = middlewareCompose([
  require('./api/cors'),
  require('./api/index'),
  require('./line/handler/index'),
  require('./api/notFound'),
])

functions.http('main', async (req, res) => {
  try {
    await handlers({ req, res })
  } catch (err) {
    log('ERROR', err)
    res.status(err.status ?? 500).json(_.pick(err, ['message']))
  }
})
