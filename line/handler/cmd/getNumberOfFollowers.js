const _ = require('lodash')
const dayjs = require('dayjs')
const msgJsonStringify = require('../../msg/json-stringify')

module.exports = async (ctx, next) => {
  const date = _.get(ctx, 'cmdArg.0') || dayjs().format('YYYYMMDD')
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getNumberOfFollowers(date)))
}
