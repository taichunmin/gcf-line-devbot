const _ = require('lodash')
const { log, parseJsonOrDefault } = require('../../../libs/helper')
const { octokit } = require('../../../libs/octokit')
const { tryAddShareBtn } = require('../../../libs/tryAddShareBtn')
const JSON5 = require('json5')
const msgReplyFlexError = require('../../msg/reply-flex-error')

module.exports = async (ctx, next) => {
  try {
    if (!octokit) return await next() // 轉交給下一個 middleware 處理
    const { event } = ctx
    if (event?.type !== 'message') return // 忽略開鍵盤的 postback
    const text = _.trim(event?.message?.text ?? event?.postback?.data ?? '')
    const match = /^\/\w+\s+(\w+)\s+((?:.|\s)+)$/.exec(text)
    if (!match) throw new Error('指令的參數有誤，請點選「改簡介」按鈕後重新輸入指令。')
    const [, gistId, altText] = match
    const gistOld = await octokit.request('GET /gists/{gistId}', { gistId })
    log({ message: `oldGistId = ${gistId}`, gistOld: gistOld.data })
    const oldJson5 = _.find(_.values(gistOld.data.files), { language: 'JSON5' })?.content
    if (!oldJson5) throw new Error(`在指定的 gist 內找不到 json5, ${JSON5.stringify({ gistId })}`)
    let msg = parseJsonOrDefault(oldJson5)
    if (!_.isArray(msg) && !_.isPlainObject(msg)) throw new Error(`gist 內的 json5 不是陣列或物件, ${JSON5.stringify({ gistId })}`)

    // 幫忙補上外層的 flex (從 FLEX MESSAGE SIMULATOR 來的通常有這問題)
    const isPartialFlex = _.includes(['bubble', 'carousel'], _.get(msg, 'type'))
    if (isPartialFlex) msg = { altText, contents: msg, type: 'flex' }
    const last = _.isArray(msg) ? _.last(msg) : msg
    if (_.has(last, 'altText')) last.altText = altText

    log({ message: `reply flex from text, altText: ${last.altText}`, msg }) // 回傳前先記錄一次
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
