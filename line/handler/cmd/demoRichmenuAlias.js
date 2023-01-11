const _ = require('lodash')
const msgRichmenuLinked = require('../../msg/richmenu-linked')
const msgRichmenuRemoved = require('../../msg/richmenu-removed')
const msgSendTextToBot = require('../../msg/send-text-to-bot')
const richmenu = require('../../../richmenu')

const ACTIONS = [
  'alias-a',
  'alias-b',
  'alias-c',
  'link-a',
  'link-b',
  'link-c',
  'exit',
]

module.exports = async (ctx, next) => {
  const userId = _.get(ctx, 'event.source.userId')
  const action = ctx.cmdArg[0] || 'alias-a'
  if (!_.includes(ACTIONS, action)) return await next()

  const isFromUser = ctx?.event?.source?.type === 'user'
  if (!isFromUser) {
    await ctx.replyMessage(msgSendTextToBot({
      title: '圖文選單切換範例',
      body: '請在手機上點選下方按鈕，加入 LINE 官方帳號，然後送出文字，即可透過這個功能來比較圖文選單的兩種切換方法喔！',
      text: '/demoRichmenuAlias',
    }))
    return
  }

  await richmenu.bootstrap(ctx) // 確認圖文選單已更新

  if (action === 'exit') {
    await ctx.line.unlinkRichMenuFromUser(userId)
    await ctx.replyMessage(msgRichmenuRemoved({
      command: '/demoRichmenuAlias',
      share: 'https://liff.line.me/1654437282-A1Bj7p4a/share-google-sheet.html?apiKey=QUl6YVN5QzVVMWJiYkkyNzZZaWFQQ2xEbkx3SDI2aTBQeDZQbXN3&key=aWQ&range=5bel5L2c6KGoMQ&spreadsheetId=MVlveHFXZ3RYa01IUjVfejEwR0hLRkJWWUVsSTA1RmlHeVNnWm5ISWFjQVk&template=aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS90YWljaHVubWluL2M5YzllMDA0ZjhkNzdiMGNhYWI2MjRmYzhhZDE2ZGE5L3Jhdy90ZW1wbGF0ZS50eHQ&value=MTM',
    }))
  } else {
    await ctx.line.linkRichMenuToUser(userId, _.get(ctx, ['richmenus', action]))
    await ctx.replyMessage(msgRichmenuLinked(action))
  }
}
