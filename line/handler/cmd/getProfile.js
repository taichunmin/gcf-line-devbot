const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const userIds = ctx.mentionUserIds || _.castArray(ctx.userId)
  if (!userIds.length) throw new Error('缺少必要參數 userId')
  const promises = _.map(userIds, userId => ctx.line.getProfile(userId).catch(err => err?.originalError?.response?.data?.message ?? err.message))
  await ctx.replyMessage(msgJsonStringify(_.zipObject(userIds, await Promise.all(promises))))
}
