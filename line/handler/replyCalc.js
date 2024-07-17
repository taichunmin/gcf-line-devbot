const _ = require('lodash')
const msgText = require('../msg/text')

module.exports = async (ctx, next) => {
  const text = ctx?.event?.message?.text
  try {
    if (!_.isString(text)) throw new Error('Not a string')
    if (/[^0-9!.()*/&%^+<>|~A-Fa-fnoOxX -]/.test(text)) throw new Error('Not a arithmetic string')
    const result = new Function(`return ${text}`)() // eslint-disable-line no-new-func
    await ctx.replyMessage(msgText(`${result}`))
  } catch (err) {
    // console.log(err)
    return await next()
  }
}
