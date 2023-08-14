const _ = require('lodash')
const { Client } = require('@line/bot-sdk')
const axios = require('axios')

const LINE_API_APIBASE = 'https://api.line.me'

Client.prototype.validateReplyMessageObjects = async function (msg) {
  try {
    if (!_.isArray(msg)) msg = [msg]
    return await axios.post(`${LINE_API_APIBASE}/v2/bot/message/validate/reply`, { messages: msg }, {
      headers: {
        Authorization: `Bearer ${this.config.channelAccessToken}`,
      },
    })
  } catch (err) {
    throw _.merge(new Error('Failed to validate reply message objects'), { originalError: err })
  }
}

exports.Client = Client
