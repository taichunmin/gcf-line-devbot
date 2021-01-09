const _ = require('lodash')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const audienceGroupId = _.get(ctx, 'cmdArg.0')
  if (!audienceGroupId) throw new Error('缺少必要參數 audienceGroupId')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getAudienceGroup(audienceGroupId)))
}
