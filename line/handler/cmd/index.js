const _ = require('lodash')
const { log } = require('../../../libs/helper')
const fs = require('fs')
const path = require('path')

const cmdCache = {}

const cmdUnknown = async (ctx, next) => { // 未知指令
  return await next() // 轉交給下一個 middleware 處理
}

const findIdFuncs = {
  groupId (ctx) {
    const found = _.find(ctx.cmdArg, arg => /^C[0-9a-f]{32}$/i.test(arg))
    return found || _.get(ctx, 'event.source.groupId')
  },
  roomId (ctx) {
    const found = _.find(ctx.cmdArg, arg => /^R[0-9a-f]{32}$/i.test(arg))
    return found || _.get(ctx, 'event.source.roomId')
  },
  userId (ctx) {
    const found = _.find(ctx.cmdArg, arg => /^U[0-9a-f]{32}$/i.test(arg))
    return found || _.get(ctx, 'event.source.userId')
  },
  richmenuId (ctx) {
    return _.find(ctx.cmdArg, arg => /^richmenu-[0-9a-f]{32}$/i.test(arg))
  },
  requestId (ctx) {
    return _.find(ctx.cmdArg, arg => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(arg))
  },
  mentionUserIds (ctx) {
    const mentionees = _.filter(_.map(_.get(ctx, 'event.message.mention.mentionees', []), 'userId'))
    return mentionees.length ? mentionees : null
  },
}

module.exports = async (ctx, next) => {
  const text = _.trim(_.get(ctx, 'event.message.text'))
  log(text)
  if (text.length >= 1000) return await next() // 轉交給下一個 middleware 處理
  const match = text.match(/^\/(\w+)(?: (.+))?/)
  if (!match) return await next() // 轉交給下一個 middleware 處理

  const cmd = match[1]
  if (!cmdCache[cmd]) {
    const cmdPath = path.resolve(__dirname, `${cmd}.js`)
    cmdCache[cmd] = fs.existsSync(cmdPath) ? require(cmdPath) : cmdUnknown
  }
  // 處理參數
  ctx.cmdArg = _.filter((match[2] || '').split(/\s+/))

  // 尋找各種 ID
  _.each(findIdFuncs, (fn, key) => { _.set(ctx, key, fn(ctx)) })

  return await cmdCache[cmd](ctx, next)
}
