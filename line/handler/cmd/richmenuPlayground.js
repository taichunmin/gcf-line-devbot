const _ = require('lodash')
const msgText = require('../../msg/text')

const ACTIONS = [
  'playground-1',
  'playground-2',
  'playground-3',
  'playground-4',
  'playground-5',
  'playground-6',
  'playground-7',
  'exit',
]

module.exports = async (ctx, next) => {
  const userId = _.get(ctx, 'event.source.userId')
  const action = ctx.cmdArg[0] || 'playground-1'
  if (!_.includes(ACTIONS, action)) return await next()
  if (action === 'exit') {
    await ctx.line.unlinkRichMenuFromUser(userId)
    await ctx.replyMessage({
      ...msgText('已將選單 playground 移除，若要再次啟用請在手機中點選下方按鈕。'),
      quickReply: {
        items: [{
          type: 'action',
          action: { label: '再次啟用', text: '/richmenuPlayground', type: 'message' },
        }],
      },
    })
  } else {
    await ctx.line.linkRichMenuToUser(userId, _.get(ctx, ['richmenus', action]))
    await ctx.replyMessage(msgText(`已幫您設定為「${action}」選單，請在手機上查看。`))
  }
}
