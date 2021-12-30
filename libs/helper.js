const _ = require('lodash')
const { enc: { Base64, Utf8 }, lib: { WordArray }, SHA1 } = require('crypto-js')
const JSON5 = require('json5')
const pako = require('pako')
const Qs = require('qs')

exports.getenv = (key, defaultval) => _.get(process, ['env', key], defaultval)

exports.errToPlainObj = (() => {
  const ERROR_KEYS = [
    'address',
    'code',
    'data',
    'dest',
    'errno',
    'info',
    'message',
    'name',
    'originalError.response.data',
    'originalError.response.headers',
    'originalError.response.status',
    'path',
    'port',
    'reason',
    'response.data',
    'response.headers',
    'response.status',
    'stack',
    'status',
    'statusCode',
    'statusMessage',
    'syscall',
  ]
  return err => _.pick(err, ERROR_KEYS)
})()

exports.log = (() => {
  const LOG_SEVERITY = ['DEFAULT', 'DEBUG', 'INFO', 'NOTICE', 'WARNING', 'ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY']
  return (...args) => {
    let severity = 'DEFAULT'
    if (args.length > 1 && _.includes(LOG_SEVERITY, _.toUpper(args[0]))) severity = _.toUpper(args.shift())
    _.each(args, arg => {
      if (_.isString(arg)) arg = { message: arg }
      if (arg instanceof Error) arg = exports.errToPlainObj(arg)
      console.log(JSON.stringify({ severity, ...arg }))
    })
  }
})()

exports.middlewareCompose = middleware => {
  // 型態檢查
  if (!_.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  if (_.some(middleware, fn => !_.isFunction(fn))) throw new TypeError('Middleware must be composed of functions!')

  return async (context = {}, next) => {
    const cloned = [...middleware, ...(_.isFunction(next) ? [next] : [])]
    const executed = _.times(cloned.length + 1, () => 0)
    const dispatch = async cur => {
      if (executed[cur] !== 0) throw new Error(`middleware[${cur}] called multiple times`)
      if (cur >= cloned.length) {
        executed[cur] = 2
        return
      }
      try {
        executed[cur] = 1
        const result = await cloned[cur](context, () => dispatch(cur + 1))
        if (executed[cur + 1] === 1) throw new Error(`next() in middleware[${cur}] should be awaited`)
        executed[cur] = 2
        return result
      } catch (err) {
        executed[cur] = 3
        throw err
      }
    }
    return await dispatch(0)
  }
}

exports.parseJsonOrDefault = (str, defaultValue) => {
  try {
    if (!_.isString(str) && !_.isBuffer(str)) return defaultValue
    return JSON5.parse(str)
  } catch (err) {
    return defaultValue
  }
}

exports.httpBuildQuery = (obj, overrides = {}) => Qs.stringify(obj, { arrayFormat: 'brackets', ...overrides })

exports.encodeBase64url = str => {
  if (!_.isInteger(str.sigBytes)) str = Utf8.parse(`${str}`)
  return Base64.stringify(str).replace(/[+/=]/g, c => _.get({ '+': '-', '/': '_', '=': '' }, c))
}

exports.decodeBase64 = str => {
  return Utf8.stringify(Base64.parse(str.replace(/[-_]/g, c => _.get({ '-': '+', _: '/' }, c))))
}

exports.sha1Base64url = str => exports.encodeBase64url(SHA1(str))

exports.beautifyFlex = obj => {
  if (_.isArray(obj)) return _.map(obj, exports.beautifyFlex)
  if (!_.isPlainObject(obj)) return obj
  const grp = _.groupBy(_.toPairs(obj), pair => (_.isArray(pair[1]) || _.isPlainObject(pair[1])) ? 'b' : 'a')
  _.each(grp.b, v => { v[1] = exports.beautifyFlex(v[1]) })
  return _.fromPairs([..._.sortBy(grp.a, '0'), ..._.sortBy(grp.b, '0')])
}

exports.encodeGzip = str => exports.encodeBase64url(WordArray.create(pako.deflate(str)))

exports.WordArrayToUint8Array = word => {
  const len = word.words.length
  const view = new DataView(new ArrayBuffer(len << 2))
  for (let i = 0; i < len; i++) view.setInt32(i << 2, word.words[i])
  return new Uint8Array(view.buffer.slice(0, word.sigBytes))
}

exports.urlToBase64 = str => str.replace(/[-_]/g, c => _.get({ '-': '+', _: '/' }, c))

exports.decodeGzip = base64url => pako.inflate(exports.WordArrayToUint8Array(Base64.parse(exports.urlToBase64(base64url))), { to: 'string' })
