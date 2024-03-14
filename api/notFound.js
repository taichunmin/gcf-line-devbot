const createError = require('http-errors')

module.exports = async (ctx, next) => {
  throw createError(404)
}
