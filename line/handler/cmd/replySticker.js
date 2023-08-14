const _ = require('lodash')
const msgStickerTestResult = require('../../msg/sitcker-test-result')

module.exports = async (ctx, next) => {
  const stickers = _.chunk(ctx.cmdArg, 2).slice(0, 5)
  if (!stickers.length) throw new Error('缺少 packageId 或 stickerId')
  await ctx.replyMessage(msgStickerTestResult({
    nextCmd: '/notifySticker',
    title: 'RESULTS OF /replySticker',
    stickers: await Promise.all(_.map(stickers, async ([packageId, stickerId]) => {
      try {
        await ctx.line.validateReplyMessageObjects({
          packageId: _.toSafeInteger(packageId),
          stickerId: _.toSafeInteger(stickerId),
          type: 'sticker',
        })
        return { packageId, stickerId }
      } catch (err) {
        return { packageId, stickerId, message: err?.response?.data?.details?.[0]?.message ?? err.message }
      }
    })),
  }))
}
