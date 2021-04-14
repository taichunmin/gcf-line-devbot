const _ = require('lodash')

module.exports = async (ctx, next) => {
  const stickers = _.chunk(ctx.cmdArg, 2).slice(0, 5)
  if (!stickers.length) throw new Error('缺少 packageId 或 stickerId')
  await ctx.replyMessage(_.map(stickers, ([packageId, stickerId]) => ({
    packageId: _.toSafeInteger(packageId),
    stickerId: _.toSafeInteger(stickerId),
    type: 'sticker',
  })))
}
