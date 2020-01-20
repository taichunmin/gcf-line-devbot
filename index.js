const _ = require('lodash')
const Line = require('@line/bot-sdk').Client
const JSON5 = require('json5')

const jsonToString = json => {
  let str = JSON.stringify(json, null, 2)
  if (str.length > 2000) str = JSON.stringify(json, null, 1)
  if (str.length > 2000) str = JSON.stringify(json)
  return str
}

const errToString = err => {
  const debug = {}
  _.each([
    'args',
    'code',
    'message',
    'name',
    'raw',
    'stack',
    'status',
    'statusCode',
    'statusMessage',
  ], key => {
    if (_.hasIn(err, key)) _.set(debug, key, _.get(err, key))
  })
  return JSON.stringify(debug)
}

const messageText = text => {
  text = _.truncate(_.toString(text), {
    length: 2000
  })
  return {
    type: 'text',
    text
  }
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.main = async (req, res) => {
  try {
    // get access token
    const channelAccessToken = req.path.substring(1)
    if (!/^[a-zA-Z0-9+/=]+$/.test(channelAccessToken)) throw new Error('wrong channel access token')
    const line = new Line({ channelAccessToken })

    const events = _.get(req, 'body.events', [])
    await Promise.all(_.map(events, async event => {
      if (_.get(event, 'source.userId') === 'Udeadbeefdeadbeefdeadbeefdeadbeef') return // webhook verify
      let messages
      try {
        try { // 如果是 JSON 就嘗試回傳
          const tmp = JSON5.parse(_.get(event, 'message.text'))
          if (!_.isArray(tmp) && !_.isPlainObject(tmp)) throw new Error('text is not array or object')

          // 判斷要不要幫忙補外層的 flex (從 FLEX MESSAGE SIMULATOR 來的通常有這問題)
          const isPartialFlex = _.includes(['bubble', 'carousel'], _.get(tmp, 'type'))
          messages = !isPartialFlex ? tmp : {
            type: 'flex',
            altText: '沒有替代文字',
            contents: tmp
          }
        } catch (err) {
          messages = messageText(jsonToString(event)) // 無法解析成物件就直接把 event 轉成 JSON
        }
        console.log(JSON.stringify({ event, messages }))
        await line.replyMessage(event.replyToken, messages)
      } catch (err) {
        console.log(errToString(err))
        try {
          await line.replyMessage(event.replyToken, messageText(errToString(err)))
        } catch (err) {}
      }
    }))
    res.status(200).send('OK')
  } catch (err) {
    console.log(errToString(err))
  }
}
