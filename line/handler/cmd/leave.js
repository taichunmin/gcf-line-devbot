const _ = require('lodash')

module.exports = async (ctx, next) => {
  const type = _.get(ctx, 'event.source.type')
  const text = _.get(ctx, 'event.message.text')
  if (text !== '/leave' || !_.includes(['room', 'group'], type)) return await next()
  await (type === 'room' ? ctx.line.leaveRoom(ctx.roomId) : ctx.line.leaveGroup(ctx.groupId))
}
