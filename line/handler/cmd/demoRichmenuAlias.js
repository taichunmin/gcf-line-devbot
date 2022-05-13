const _ = require('lodash')
const msgRichmenuLinked = require('../../msg/richmenu-linked')
const msgRichmenuRemoved = require('../../msg/richmenu-removed')
const msgSendTextToBot = require('../../msg/send-text-to-bot')

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

  if (action === 'exit') {
    await ctx.line.unlinkRichMenuFromUser(userId)
    await ctx.replyMessage(msgRichmenuRemoved('/demoRichmenuAlias'))
  } else {
    await ctx.line.linkRichMenuToUser(userId, _.get(ctx, ['richmenus', action]))
    await ctx.replyMessage(msgRichmenuLinked(action))
  }
}
