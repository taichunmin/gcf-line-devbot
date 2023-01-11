const _ = require('lodash')
const msgText = require('../../msg/text')

module.exports = async (ctx, next) => {
  const sleepMs = _.chain(ctx.cmdArg[0] ?? 0).toSafeInteger().clamp(0, 48e4).value()
  const remainMs = sleepMs - _.clamp(Date.now() - ctx.event.timestamp, sleepMs)
  // 如果需等候的時間不小於 60 秒，就故意等候 3 秒觸發訊息重送機制，然後把 replyToken 留給訊息重送機制使用
  if (remainMs >= 6e4) return await new Promise(resolve => setTimeout(resolve, 3000))
  await new Promise(resolve => setTimeout(resolve, remainMs))
  await ctx.replyMessage(msgText(`如果你成功看到這個回覆，代表 replyToken 的時效至少有 ${sleepMs} 毫秒。`))
}
