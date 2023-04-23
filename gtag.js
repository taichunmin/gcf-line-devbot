/* eslint-disable camelcase */
const _ = require('lodash')
const { log, parseJsonOrDefault } = require('./libs/helper')
const axios = require('axios')
const createError = require('http-errors')

const reqToJson = req => {
  const tmp = _.omitBy(req, (v, k) => k[0] === '_')
  tmp.headers = _.chunk(tmp.rawHeaders, 2)
  return _.pick(tmp, ['body', 'headers', 'httpVersion', 'method', 'originalUrl', 'params', 'query', 'url'])
}

module.exports = async (ctx, next) => {
  const { req, res } = ctx
  if (req.method !== 'GET' || req.path !== '/mp/collect') return await next()
  try {
    const { api_secret, measurement_id } = req.query
    if (!api_secret || !measurement_id) throw createError(400, 'invalid request')
    const json = parseJsonOrDefault(Buffer.from(req.query.json, 'base64url').toString('utf8'))
    if (!json) throw createError(400, 'invalid request')
    const tmpReq = reqToJson(req)
    log({ message: `GA4 collect: event = ${JSON.stringify(_.get(json, 'events.0', {}))}, remote_ip = ${_.find(tmpReq.headers, [0, 'x-forwarded-for'])?.[1]}`, json, req: tmpReq })
    // https://www.google-analytics.com/debug/mp/collect
    const url = new URL('https://www.google-analytics.com/mp/collect')
    url.searchParams.set('api_secret', api_secret)
    url.searchParams.set('measurement_id', measurement_id)
    return await axios.post(url.href, json)
  } catch (err) {
    log('ERROR', err)
  } finally {
    // 一律回傳 1x1 GIF 並快取 1 年
    res.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000')
    res.set('Content-Type', 'image/gif')
    res.send(Buffer.from('R0lGODlhAQABAIAAAP___wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw', 'base64url'))
  }
}
