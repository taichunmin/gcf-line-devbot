const _ = require('lodash')
const JSON5 = require('json5')

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
  return err => _.transform(ERROR_KEYS, (json, k) => {
    if (_.hasIn(err, k)) _.set(json, k, _.get(err, k))
  }, {})
})()

const GCP_PROJECT = exports.getenv('GCP_PROJECT', 'taichunmin')
exports.getGcfLogger = req => {
  const baseFields = {}

  // Add log correlation to nest all log messages beneath request log in Log Viewer.
  const traceHeader = _.invoke(req, 'header', 'X-Cloud-Trace-Context')
  if (traceHeader) {
    baseFields['logging.googleapis.com/trace'] = `projects/${GCP_PROJECT}/traces/${_.first(traceHeader.split('/'))}`
  }

  const baseFn = defaults => (...args) => _.map(args, arg => {
    if (_.isString(arg)) arg = { message: arg }
    if (arg instanceof Error) arg = exports.errToPlainObj(arg)
    console.log(JSON.stringify({
      ...defaults,
      ...arg,
    }))
  })

  return {
    log: baseFn({ ...baseFields, severity: 'DEFAULT' }),
    debug: baseFn({ ...baseFields, severity: 'DEBUG' }),
    info: baseFn({ ...baseFields, severity: 'INFO' }),
    warn: baseFn({ ...baseFields, severity: 'WARNING' }),
    error: baseFn({ ...baseFields, severity: 'ERROR' }),
  }
}

exports.middlewareCompose = middleware => {
  // 型態檢查
  if (!_.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  if (_.find(middleware, fn => !_.isFunction(fn))) throw new TypeError('Middleware must be composed of functions!')

  return async context => {
    let executed = -1
    const dispatch = async cur => {
      if (cur <= executed) throw new Error('next() called multiple times')
      executed = cur
      if (cur >= middleware.length) return
      return await middleware[cur](context, () => dispatch(cur + 1))
    }
    return dispatch(0)
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
