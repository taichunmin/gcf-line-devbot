const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  if (!ctx.requestId) throw new Error('缺少必要參數 requestId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getNarrowcastProgress(ctx.requestId)))
}
