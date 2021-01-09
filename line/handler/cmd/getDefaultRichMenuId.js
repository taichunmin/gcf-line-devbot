const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getDefaultRichMenuId()))
}
