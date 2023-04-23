const _ = require('lodash')
const { errToJson, log } = require('../../libs/helper')
const msgJsonStringify = require('../msg/json-stringify')

const describeEventSource = source => {
  const type = source.type
  if (type === 'user') return `Incoming event from ${source.userId}`
  if (!source.userId) return `Incoming event from ${type} ${source[type + 'Id']}`
  return `Incoming event from ${source.userId} in ${type} ${source[type + 'Id']}`
}

module.exports = async (ctx, next) => {
  try {
    const { event, line } = ctx
    const source = _.get(event, 'source', {})
    ctx.describeEventSource = describeEventSource(source)
    log({ message: ctx.describeEventSource, event }) // 先把 event 紀錄到 logger

    // 如果是測試訊息或是沒有 replyToken 就直接不處理
    if (!event.replyToken || source.userId === 'Udeadbeefdeadbeefdeadbeefdeadbeef') return

    // 設定輔助函式
    ctx.replyMessage = async msg => {
      try {
        if (ctx.replyed) throw new Error('重複呼叫 event.replyMessage')
        await line.replyMessage(event.replyToken, msg)
        ctx.replyed = 1
      } catch (err) {
        _.set(err, 'data.msg', msg)
        err.response = _.get(err, 'originalError.response', err.response)
        throw err
      }
    }

    await next() // 繼續執行其他 middleware
  } catch (err) {
    err.message = _.get(err, 'response.data.message', err.message)
    try { // 如果還可以 reply 就嘗試把訊息往回傳
      if (!ctx.replyed) await ctx.replyMessage(msgJsonStringify(_.omit(errToJson(err), ['stack'])))
    } catch (err) {}

    // 避免錯誤拋到外層
    err.message = `fnInitEvent: ${err.message}`
    log('ERROR', err)
  }
}
