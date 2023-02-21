const _ = require('lodash')
const { log, parseJsonOrDefault } = require('../../libs/helper')
const { tryAddShareBtn } = require('../../libs/tryAddShareBtn')
const msgReplyFlexError = require('../msg/reply-flex-error')

const getAltText = msg => {
  msg = _.chain(msg).castArray().last().value()
  return msg?.altText ?? msg?.text
}

module.exports = async (ctx, next) => {
  try {
    let msg = parseJsonOrDefault(_.get(ctx, 'event.message.text'))
    if (!_.isArray(msg) && !_.isPlainObject(msg)) return await next() // 轉交給下一個 middleware 處理

    // 幫忙補上外層的 flex (從 FLEX MESSAGE SIMULATOR 來的通常有這問題)
    const isPartialFlex = _.includes(['bubble', 'carousel'], _.get(msg, 'type'))
    if (isPartialFlex) msg = { altText: '缺少替代文字', contents: msg, type: 'flex' }

    log({ message: `reply flex from text, altText: ${getAltText(msg)}`, msg }) // 回傳前先記錄一次
    await ctx.line.validateReplyMessage(msg) // 先驗證 messaging api 的內容正確

    msg = await tryAddShareBtn(ctx, msg) // 嘗試新增透過 LINE 數位版名片分享的按鈕
    await ctx.replyMessage(msg)
  } catch (err) {
    const lineApiErrData = err?.originalError?.response?.data ?? err?.response?.data
    if (!lineApiErrData?.message) throw err // 並非訊息內容有誤
    err.message = `reply flex from text: ${lineApiErrData?.message ?? err.message}`
    log('ERROR', err)
    try { // 如果還可以 reply 就嘗試把訊息往回傳
      await ctx.replyMessage(msgReplyFlexError(lineApiErrData))
    } catch (err) {}
  }
}
