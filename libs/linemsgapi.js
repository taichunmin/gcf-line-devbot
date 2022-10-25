const _ = require('lodash')
const axios = require('axios')

const LINE_API_APIBASE = 'https://api.line.me'

exports.validateReplyMessage = async (line, msg) => {
  try {
    if (!_.isArray(msg)) msg = [msg]
    return await axios.post(`${LINE_API_APIBASE}/v2/bot/message/validate/reply`, { messages: msg }, {
      headers: {
        Authorization: `Bearer ${line.config.channelAccessToken}`,
      },
    })
  } catch (err) {
    err.message = err?.response?.data?.message ?? err.message
    throw err
  }
}
