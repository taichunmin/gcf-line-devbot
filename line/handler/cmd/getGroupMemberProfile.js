const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const groupId = _.get(ctx, 'cmdArg.0') || _.get(ctx, 'event.source.groupId')
  if (!groupId) throw new Error('缺少必要參數 groupId')
  const userId = _.get(ctx, 'cmdArg.1') || _.get(ctx, 'event.source.userId')
  if (!userId) throw new Error('缺少必要參數 userId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getGroupMemberProfile(groupId, userId)))
}
