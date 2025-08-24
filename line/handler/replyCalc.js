const _ = require('lodash')
const { default: nstr } = require('nstr')
const { errToJson } = require('../../libs/helper')
const msgText = require('../msg/text')

module.exports = async (ctx, next) => {
  const text = ctx?.event?.message?.text
  try {
    if (!_.isString(text) || /[^0-9!.()*/&%^+<>|~A-Fa-fnoOxX -]/.test(text)) return await next() // Not a arithmetic string
    const result = new Function(`return ${text}`)() // eslint-disable-line no-new-func
    const str1 = result.toString()
    const str2 = nstr(result)
    await ctx.replyMessage([
      msgText(str1),
      ...(str1 === str2 ? [] : [msgText(str2)]),
    ])
  } catch (err) {
    console.log(errToJson(err))
    return await next()
  }
}
