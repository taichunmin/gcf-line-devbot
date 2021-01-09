const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const roomId = _.get(ctx, 'cmdArg.0') || _.get(ctx, 'event.source.roomId')
  if (!roomId) throw new Error('缺少必要參數 roomId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getGroupMembersCount(roomId)))
}
