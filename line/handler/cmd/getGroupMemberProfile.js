const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  if (!ctx.groupId) throw new Error('缺少必要參數 groupId')
  const userIds = ctx.mentionUserIds || _.castArray(ctx.userId)
  if (!userIds.length) throw new Error('缺少必要參數 userId')
  const promises = _.map(userIds, userId => ctx.line.getGroupMemberProfile(ctx.groupId, userId).catch(err => err.message))
  await ctx.replyMessage(msgJsonStringify(await Promise.all(promises)))
}
