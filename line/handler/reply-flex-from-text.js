const _ = require('lodash')
const { log, parseJsonOrDefault } = require('../../libs/helper')
const msgReplyFlexError = require('../msg/reply-flex-error')

module.exports = async (ctx, next) => {
  try {
    let msg = parseJsonOrDefault(_.get(ctx, 'event.message.text'))
    if (!_.isArray(msg) && !_.isPlainObject(msg)) return await next() // 轉交給下一個 middleware 處理

    // 幫忙補上外層的 flex (從 FLEX MESSAGE SIMULATOR 來的通常有這問題)
    const isPartialFlex = _.includes(['bubble', 'carousel'], _.get(msg, 'type'))
    if (isPartialFlex) msg = { altText: '缺少替代文字', contents: msg, type: 'flex' }

    // 回傳前先記錄一次
    log({ message: 'reply flex from text', msg })
    await ctx.replyMessage(msg)
  } catch (err) {
    const lineApiErrData = _.get(err, 'originalError.response.data')
    if (!lineApiErrData) throw err // 並非 LINE API 的錯誤
    await ctx.replyMessage(msgReplyFlexError(lineApiErrData))
  }
}
