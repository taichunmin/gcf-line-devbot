const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  if (!ctx.richmenuId) throw new Error('缺少必要參數 richmenuId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getRichMenu(ctx.richmenuId)))
}
