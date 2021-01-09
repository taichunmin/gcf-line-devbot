const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const groupId = _.get(ctx, 'cmdArg.0') || _.get(ctx, 'event.source.groupId')
  if (!groupId) throw new Error('缺少必要參數 groupId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getGroupMemberIds(groupId)))
}
