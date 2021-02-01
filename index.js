const _ = require('lodash')
const { log } = require('./libs/helper')
const Line = require('@line/bot-sdk').Client
const lineHandler = require('./line/handler')

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.main = async (req, res) => {
  try {
    // 處理 access token
    const channelAccessToken = req.path.substring(1)
    if (!/^[a-zA-Z0-9+/=]+$/.test(channelAccessToken)) throw new Error('invalid channel access token')
    const line = new Line({ channelAccessToken })

    // 處理 events
    const events = _.get(req, 'body.events', [])
    await Promise.all(_.map(events, event => lineHandler({ req, event, line })))
    res.status(200).send('OK')
  } catch (err) {
    log('ERROR', err)
    res.status(err.status || 500).send(err.message)
  }
}
