const _ = require('lodash')
const { getenv } = require('../../../libs/helper')
const linenotify = require('../../../libs/linenotify')
const msgNotifySticker = require('../../msg/notify-sitcker')

const LINE_NOTIFY_TOKEN = getenv('LINE_NOTIFY_TOKEN')

module.exports = async (ctx, next) => {
  const stickers = _.chunk(ctx.cmdArg, 2).slice(0, 5)
  if (!stickers.length) throw new Error('缺少 packageId 或 stickerId')
  await ctx.replyMessage(msgNotifySticker(await Promise.all(_.map(stickers, async ([packageId, stickerId]) => {
    try {
      ;[packageId, stickerId] = _.map([packageId, stickerId], _.toSafeInteger)
      await linenotify.notify(LINE_NOTIFY_TOKEN, {
        message: `\npackageId = ${packageId}\nstickerId = ${stickerId}`,
        notificationDisabled: 'true',
        stickerId,
        stickerPackageId: packageId,
      })
      return { packageId, stickerId }
    } catch (err) {
      return { packageId, stickerId, message: err.message }
    }
  }))))
}
