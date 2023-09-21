const _ = require('lodash')
const msgJsonStringify = require('../msg/json-stringify')

const eventToMsgsHandlers = [
  // event 轉成 json
  ctx => { ctx.msgs.push(msgJsonStringify({ ...ctx.req.body, events: [ctx.event] })) },

  // quickreply sticker
  ctx => {
    if (_.get(ctx, 'event.message.type') !== 'sticker') return
    const msg = _.last(ctx.msgs)
    _.update(msg, 'quickReply.items', items => {
      items = items ?? []
      const { stickerId, packageId } = ctx.event.message
      items.push({
        type: 'action',
        action: {
          label: '/replySticker',
          text: `/replySticker ${packageId} ${stickerId}`,
          type: 'message',
        },
      }, {
        type: 'action',
        action: {
          label: '/notifySticker',
          text: `/notifySticker ${packageId} ${stickerId}`,
          type: 'message',
        },
      })
      return items
    })
  },
]

module.exports = async (ctx, next) => {
  ctx.msgs = []
  for (const handler of eventToMsgsHandlers) {
    handler(ctx)
  }
  await ctx.replyMessage(ctx.msgs)
}
