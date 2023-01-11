const msgText = require('../../msg/text')
const richmenu = require('../../../richmenu')

module.exports = async (ctx, next) => {
  await richmenu.bootstrap(ctx, true) // 確認圖文選單已更新

  await ctx.replyMessage(msgText('已嘗試強制更新圖文選單'))
}
