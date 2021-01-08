const _ = require('lodash')

const TEXT_MAXLEN = 5000

module.exports = text => ({
  type: 'text',
  text: _.truncate(_.toString(text), { length: TEXT_MAXLEN }),
})
