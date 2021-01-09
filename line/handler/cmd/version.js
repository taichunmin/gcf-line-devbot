const { getenv } = require('../../../libs/helper')
const msgText = require('../../msg/text')

module.exports = async (ctx, next) => {
  await ctx.replyMessage(msgText(`GITHUB_SHA: ${getenv('GITHUB_SHA', 'unknown')}`))
}
