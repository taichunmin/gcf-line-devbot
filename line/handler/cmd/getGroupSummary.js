const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  if (!ctx.groupId) throw new Error('缺少必要參數 groupId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getGroupSummary(ctx.groupId)))
}
