const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const roomId = _.get(ctx, 'cmdArg.0') || _.get(ctx, 'event.source.roomId')
  if (!roomId) throw new Error('缺少必要參數 roomId')
  const userId = _.get(ctx, 'cmdArg.1') || _.get(ctx, 'event.source.userId')
  if (!userId) throw new Error('缺少必要參數 userId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getGroupMemberProfile(roomId, userId)))
}
