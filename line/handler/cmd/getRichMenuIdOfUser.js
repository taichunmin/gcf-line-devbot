const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')
const richmenu = require('../../../richmenu')

module.exports = async (ctx, next) => {
  const userIds = ctx.mentionUserIds || _.castArray(ctx.userId)
  if (!userIds.length) throw new Error('缺少必要參數 userId')
  await richmenu.bootstrap(ctx) // 確認圖文選單已更新
  const promises = _.map(userIds, userId => ctx.line.getRichMenuIdOfUser(userId).catch(err => err?.originalError?.response?.data?.message ?? err.message))
  await ctx.replyMessage(msgJsonStringify(_.zipObject(userIds, await Promise.all(promises))))
}
