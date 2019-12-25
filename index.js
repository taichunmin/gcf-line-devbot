require('dotenv').config() // init dotenv

const _ = require('lodash')
const Line = require('@line/bot-sdk').Client
const JSON5 = require('json5')

const line = new Line({
  channelAccessToken: _.get(process, ['env', 'CHANNEL_ACCESS_TOKEN']),
  channelSecret: _.get(process, ['env', 'CHANNEL_SECRET']),
})

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
    const events = _.get(req, 'body.events', [])
    await Promise.all(_.map(events, async event => {
      let messages
      try {
        if (_.get(event, 'message.type') === 'text') { // 如果是 JSON 就嘗試回傳
          try {
            messages = JSON5.parse(_.get(event, 'message.text'))
            // 判斷要不要幫忙補外層的 flex (從 FLEX MESSAGE SIMULATOR 來的通常有這問題)
            if (_.includes(['bubble', 'carousel'], _.get(messages, 'type'))) {
              messages = {
                type: 'flex',
                altText: '沒有替代文字',
                contents: messages
              }
            }
          } catch (err) {
            console.log(errToString(err))
          }
        }
        if (!messages) { // 其他類型就直接把 event 轉成 JSON
          messages = messageText(jsonToString(event))
        }
        console.log(JSON.stringify({ event, messages }))
        await line.replyMessage(event.replyToken, messages)
      } catch (err) {
        console.log(errToString(err))
      }
    }))
    res.status(200).send('OK')
  } catch (err) {
    console.log(errToString(err))
  }
}
