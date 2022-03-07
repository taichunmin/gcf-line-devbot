const _ = require('lodash')
const { beautifyFlex, encodeBase64url, log, parseJsonOrDefault } = require('../../libs/helper')
const { octokit } = require('../../libs/octokit')
const JSON5 = require('json5')
const msgReplyFlexError = require('../msg/reply-flex-error')

const flexShareBtn = uri => ({
  altText: '點此透過 LINE 數位版名片分享',
  type: 'flex',
  contents: {
    size: 'nano',
    type: 'bubble',
    body: {
      alignItems: 'center',
      justifyContent: 'center',
      layout: 'horizontal',
      paddingAll: '5px',
      spacing: 'md',
      type: 'box',
      action: {
        type: 'uri',
        label: 'action',
        uri,
      },
      contents: [
        {
          height: '16px',
          layout: 'vertical',
          type: 'box',
          width: '16px',
          contents: [
            {
              aspectMode: 'cover',
              aspectRatio: '1:1',
              size: 'full',
              type: 'image',
              url: 'https://i.imgur.com/IFjR25G.png',
            },
          ],
        },
        {
          flex: 0,
          size: '16px',
          text: '分享',
          type: 'text',
        },
      ],
    },
  },
  sender: {
    iconUrl: 'https://i.imgur.com/1KZoSue.png',
    name: '數位版名片',
  },
})

const tryAddShareBtn = async (ctx, msg) => {
  try {
    if (!octokit) throw new Error() // 未設定 OCTOKIT_ACCESS_TOKEN
    if (_.isArray(msg) && msg.length >= 5) throw new Error() // 沒有辦法新增分享按鈕
    const { describeEventSource, event } = ctx
    const filename = `gcf-line-devbot-${event?.message?.id}.json5`
    const gist = await octokit.request('POST /gists', {
      description: describeEventSource,
      files: { [filename]: { content: JSON5.stringify(beautifyFlex(msg)) } },
    })
    const url = `https://lihi1.com/kLzL9/${encodeBase64url(gist.data.files[filename].raw_url)}`
    return [flexShareBtn(url), ..._.castArray(msg)]
  } catch (err) {
    if (err.message) log('ERROR', err)
    return msg
  }
}

module.exports = async (ctx, next) => {
  try {
    let msg = parseJsonOrDefault(_.get(ctx, 'event.message.text'))
    if (!_.isArray(msg) && !_.isPlainObject(msg)) return await next() // 轉交給下一個 middleware 處理

    // 幫忙補上外層的 flex (從 FLEX MESSAGE SIMULATOR 來的通常有這問題)
    const isPartialFlex = _.includes(['bubble', 'carousel'], _.get(msg, 'type'))
    if (isPartialFlex) msg = { altText: '缺少替代文字', contents: msg, type: 'flex' }

    log({ message: `reply flex from text, altText: ${msg?.altText ?? msg?.text}`, msg }) // 回傳前先記錄一次
    msg = await tryAddShareBtn(ctx, msg) // 嘗試新增透過 LINE 數位版名片分享的按鈕
    await ctx.replyMessage(msg)
  } catch (err) {
    const lineApiErrData = _.get(err, 'originalError.response.data')
    if (!lineApiErrData) throw err // 並非 LINE API 的錯誤
    err.message = `reply flex from text: ${_.get(lineApiErrData, 'message', err.message)}`
    log('ERROR', err)
    try { // 如果還可以 reply 就嘗試把訊息往回傳
      await ctx.replyMessage(msgReplyFlexError(lineApiErrData))
    } catch (err) {}
  }
}
