const _ = require('lodash')
const Line = require('@line/bot-sdk').Client
const JSON5 = require('json5')

const TEXT_MAXLEN = 5000

const jsonToString = json => {
  let str = JSON.stringify(json, null, 2)
  if (str.length > TEXT_MAXLEN) str = JSON.stringify(json, null, 1)
  if (str.length > TEXT_MAXLEN) str = JSON.stringify(json)
  return str
}

const errToJson = (() => {
  const ERROR_KEYS = [
    'address',
    'code',
    'data',
    'dest',
    'errno',
    'info',
    'message',
    'name',
    'originalError.response.data',
    'path',
    'port',
    'reason',
    'response.data',
    'response.headers',
    'response.status',
    'stack',
    'status',
    'statusCode',
    'statusMessage',
    'syscall',
  ]
  return err => _.transform(ERROR_KEYS, (json, k) => {
    if (_.hasIn(err, k)) _.set(json, k, _.get(err, k))
  }, {})
})()

const messageText = text => ({
  type: 'text',
  text: _.truncate(_.toString(text), { length: TEXT_MAXLEN })
})

const flexLineApiError = data => ({
  type: 'flex',
  altText: data.message || '訊息物件有誤',
  contents: {
    size: 'giga',
    type: 'bubble',
    body: {
      layout: 'vertical',
      spacing: 'md',
      type: 'box',
      contents: _.map(data.details, detail => ({
        layout: 'horizontal',
        spacing: 'md',
        type: 'box',
        contents: [
          {
            height: '40px',
            layout: 'vertical',
            type: 'box',
            width: '40px',
            contents: [
              {
                aspectMode: 'cover',
                aspectRatio: '1:1',
                size: 'full',
                type: 'image',
                url: 'https://i.imgur.com/2VH5JeS.png'
              }
            ]
          },
          {
            layout: 'vertical',
            spacing: 'xs',
            type: 'box',
            contents: [
              {
                color: '#666666',
                flex: 0,
                size: 'xxs',
                text: detail.property,
                type: 'text',
                wrap: true
              },
              {
                flex: 1,
                layout: 'vertical',
                type: 'box',
                contents: [
                  {
                    type: 'filler'
                  }
                ]
              },
              {
                flex: 0,
                size: 'sm',
                text: detail.message,
                type: 'text',
                wrap: true
              }
            ]
          }
        ]
      })),
    },
    header: {
      backgroundColor: '#00C300',
      layout: 'vertical',
      spacing: 'sm',
      type: 'box',
      contents: [
        {
          color: '#99ff99',
          size: 'xxs',
          text: '訊息物件有誤',
          type: 'text',
          weight: 'bold'
        },
        {
          color: '#ffffff',
          text: data.message || '訊息物件有誤',
          type: 'text',
          wrap: true
        }
      ]
    }
  }
})

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
      console.log('event =', JSON.stringify(event))
      if (!event.replyToken) return // unfollow
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
          console.log('messages =', JSON.stringify(messages))
        } catch (err) {
          messages = messageText(jsonToString(event)) // 無法解析成物件就直接把 event 轉成 JSON
        }
        await line.replyMessage(event.replyToken, messages)
      } catch (err) {
        try {
          const lineApiErrData = _.get(err, 'originalError.response.data')
          if (lineApiErrData) return await line.replyMessage(event.replyToken, flexLineApiError(lineApiErrData))
          await line.replyMessage(event.replyToken, messageText(jsonToString(errToJson(err))))
        } catch (err) {
          console.log('reply error =', jsonToString(errToJson(err)))
        }
      }
    }))
    res.status(200).send('OK')
  } catch (err) {
    console.log('error =', jsonToString(errToJson(err)))
    res.status(err.status || 500).send(err.message)
  }
}
