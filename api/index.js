const _ = require('lodash')

const apis = new Map([
  ['GET /mp/collect', require('./mpCollect')],
  ['POST /api/createLineMsgGist', require('./createLineMsgGist')],
  ['POST /api/lineVerifyReplyMsg', require('./lineVerifyReplyMsg')],
])

module.exports = async (ctx, next) => {
  const { req } = ctx
  const apiMethodPath = `${_.toUpper(req.method)} ${req.path}`
  if (!apis.has(apiMethodPath)) return await next()
  return await apis.get(apiMethodPath)(ctx, next)
}
