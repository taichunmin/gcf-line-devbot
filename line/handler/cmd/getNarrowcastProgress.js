const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const requestId = _.get(ctx, 'cmdArg.0')
  if (!requestId) throw new Error('缺少必要參數 requestId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getNarrowcastProgress(requestId)))
}
