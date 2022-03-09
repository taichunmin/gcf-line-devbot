require('dotenv').config()

const _ = require('lodash')
const { log } = require('./libs/helper')
const functions = require('@google-cloud/functions-framework')
const Line = require('@line/bot-sdk').Client
const lineHandler = require('./line/handler')
const richmenu = require('./richmenu')

functions.http('main', async (req, res) => {
  try {
    // 處理 access token
    const channelAccessToken = req.path.substring(1)
    if (!/^[a-zA-Z0-9+/=]+$/.test(channelAccessToken)) throw new Error('invalid channel access token')
    const line = new Line({ channelAccessToken })

    const ctx = { line, req }
    await richmenu.bootstrap(ctx)

    // 處理 events
    const events = _.get(req, 'body.events', [])
    await Promise.all(_.map(events, event => lineHandler({ ...ctx, event })))
    res.status(200).send('OK')
  } catch (err) {
    log('ERROR', err)
    res.status(err.status || 500).send(err.message)
  }
})
