const _ = require('lodash')
const msgText = require('../../msg/text')

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
  if (action === 'exit') {
    await ctx.line.unlinkRichMenuFromUser(userId)
    await ctx.replyMessage(msgText('已將選單切換範例移除。'))
  } else {
    await ctx.line.linkRichMenuToUser(userId, _.get(ctx, ['richmenus', action]))
    await ctx.replyMessage(msgText(`已幫您設定為選單切換範例的「${action}」選單，請在手機上查看。`))
  }
}
