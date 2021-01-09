const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const cmdUnknown = async (ctx, next) => { // 未知指令
  return await next() // 轉交給下一個 middleware 處理
}

const cmdCache = {}

module.exports = async (ctx, next) => {
  const text = _.trim(_.get(ctx, 'event.message.text'))
  ctx.logger.log(text)
  if (text.length >= 1000) return await next() // 轉交給下一個 middleware 處理
  const match = text.match(/^\/(\w+)(?: (.+))?/)
  if (!match) return await next() // 轉交給下一個 middleware 處理

  const cmd = match[1]
  if (!cmdCache[cmd]) {
    const cmdPath = path.resolve(__dirname, `${cmd}.js`)
    cmdCache[cmd] = fs.existsSync(cmdPath) ? require(cmdPath) : cmdUnknown
  }
  ctx.cmdArg = _.filter((match[2] || '').split(/\s+/))
  return await cmdCache[cmd](ctx, next)
}
