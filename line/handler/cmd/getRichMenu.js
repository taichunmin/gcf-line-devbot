const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const richMenuId = _.get(ctx, 'cmdArg.0')
  if (!richMenuId) throw new Error('缺少必要參數 richMenuId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getRichMenu(richMenuId)))
}
