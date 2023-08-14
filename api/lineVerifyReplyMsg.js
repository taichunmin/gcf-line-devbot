const _ = require('lodash')
const { getenv } = require('../libs/helper')
const { log } = require('../libs/helper')
const Line = require('../libs/linebotsdk').Client

const LINE_MESSAGING_TOKEN = getenv('LINE_MESSAGING_TOKEN')

module.exports = async (ctx, next) => {
  const { req, res } = ctx
  if (_.isNil(LINE_MESSAGING_TOKEN)) return await next() // 未設定 TOKEN
  if (!_.isArray(req.body) && !_.isPlainObject(req.body)) return await next() // 轉交給下一個 middleware 處理

  try {
    ctx.line = new Line({ channelAccessToken: LINE_MESSAGING_TOKEN })
    await ctx.line.validateReplyMessageObjects(req.body) // 先透過 messaging api 驗證內容
      .catch(err => { throw _.merge(err, { status: err?.originalError?.response?.status ?? 500, ..._.pick(err?.originalError?.response?.data, ['message', 'details']) }) })
    res.json({})
  } catch (err) {
    log('ERROR', err)
    res.status(err.status ?? 500).json(_.pick(err, ['message', 'details']))
  }
}
