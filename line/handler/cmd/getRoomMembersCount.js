const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  if (!ctx.roomId) throw new Error('缺少必要參數 roomId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getGroupMembersCount(ctx.roomId)))
}
