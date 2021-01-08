const msgText = require('./text')

const TEXT_MAXLEN = 5000

const jsonStringifyMinify = json => {
  let str = JSON.stringify(json, null, 2)
  if (str.length > TEXT_MAXLEN) str = JSON.stringify(json, null, 1)
  if (str.length > TEXT_MAXLEN) str = JSON.stringify(json)
  return str
}

module.exports = obj => msgText(jsonStringifyMinify(obj))
