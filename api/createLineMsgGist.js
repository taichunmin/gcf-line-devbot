const _ = require('lodash')
const { beautifyFlex, getenv, log } = require('../libs/helper')
const { octokit } = require('../libs/octokit')
const dayjs = require('dayjs')
const JSON5 = require('json5')
const Line = require('../libs/linebotsdk').Client

const LINE_MESSAGING_TOKEN = getenv('LINE_MESSAGING_TOKEN')

module.exports = async (ctx, next) => {
  const { req, res } = ctx
  if (_.isNil(LINE_MESSAGING_TOKEN) || _.isNil(octokit)) return await next() // 未設定 TOKEN
  if (!_.isArray(req.body) && !_.isPlainObject(req.body)) return await next() // 轉交給下一個 middleware 處理

  try {
    ctx.line = new Line({ channelAccessToken: LINE_MESSAGING_TOKEN })

    // verify message
    const tmp1 = _.castArray(req.body)
    for (let i = 0; i < tmp1.length; i++) {
      if (_.includes(['bubble', 'carousel'], tmp1[i]?.type)) tmp1[i] = { altText: 'altText', contents: tmp1[i], type: 'flex' }
      const tmp2 = tmp1[i]
      if (!_.isNil(tmp2?.replyToken)) throw new Error(`msg[${i}].replyToken is not allowed`)
      if (!_.includes(['text', 'sticker', 'image', 'video', 'audio', 'location', 'imagemap', 'template', 'flex'], tmp2?.type)) throw new Error(`msg[${i}].type = ${JSON5.stringify(tmp2?.type)} is invalid`)
    }
    await ctx.line.validateReplyMessageObjects(tmp1) // 先透過 messaging api 驗證內容
      .catch(err => { throw _.merge(err, { status: err?.originalError?.response?.status ?? 500, ..._.pick(err?.originalError?.response?.data, ['message', 'details']) }) })

    // 上傳到 gist
    const nowts = dayjs()
    const filename = `gcf-line-devbot-${+nowts}.json5`
    const gist = await octokit.request('POST /gists', {
      description: `Upload by line-devbot /gist/createLineMessage at ${nowts.format('YYYY-MM-DD HH:mm:ss')}`,
      files: { [filename]: { content: JSON5.stringify(beautifyFlex(req.body)) } },
    })
    res.json({ rawUrl: gist.data.files[filename].raw_url })
  } catch (err) {
    log('ERROR', err)
    res.status(err.status ?? 500).json(_.pick(err, ['message', 'details']))
  }
}
