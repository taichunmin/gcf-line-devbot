const _ = require('lodash')
const { errToPlainObj } = require('../../libs/helper')
const msgJsonStringify = require('../msg/json-stringify')

module.exports = async (ctx, next) => {
  try {
    const { event, line } = ctx
    ctx.logger.log({ message: 'log incoming event', event }) // 先把 event 紀錄到 logger

    // 如果是測試訊息或是沒有 replyToken 就直接不處理
    if (!event.replyToken || _.get(event, 'source.userId') === 'Udeadbeefdeadbeefdeadbeefdeadbeef') return

    // 設定輔助函式
    ctx.replyMessage = async msg => {
      if (ctx.replyed) throw new Error('重複呼叫 event.replyMessage')
      await line.replyMessage(event.replyToken, msg)
      ctx.replyed = 1
    }

    await next() // 繼續執行其他 middleware
  } catch (err) {
    try { // 如果還可以 reply 就嘗試把訊息往回傳
      if (!ctx.replyed) await ctx.replyMessage(msgJsonStringify(errToPlainObj(err)))
    } catch (err) {}

    // 避免錯誤拋到外層
    err.message = `fnPreEvent: ${err.message}`
    ctx.logger.error(err)
  }
}
