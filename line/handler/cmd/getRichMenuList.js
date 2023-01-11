const msgJsonStringify = require('../../msg/json-stringify')
const richmenu = require('../../../richmenu')

module.exports = async (ctx, next) => {
  await richmenu.bootstrap(ctx) // 確認圖文選單已更新
  await ctx.replyMessage(msgJsonStringify(await ctx.line.getRichMenuList()))
}
