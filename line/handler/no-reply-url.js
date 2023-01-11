const _ = require('lodash')

module.exports = async (ctx, next) => {
  const text = ctx?.event?.message?.text
  try {
    if (!_.isString(text)) throw new Error('Not a string')
    return new URL(text) // 如果是一個合法的 URL 就不作回應
  } catch (err) {
    return await next()
  }
}
