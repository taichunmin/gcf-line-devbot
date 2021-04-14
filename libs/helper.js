const _ = require('lodash')
const JSON5 = require('json5')
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

  return async (context, next) => {
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
