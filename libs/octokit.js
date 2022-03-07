const { getenv } = require('./helper')
const { Octokit } = require('@octokit/core')

const OCTOKIT_ACCESS_TOKEN = getenv('OCTOKIT_ACCESS_TOKEN')

exports.Octokit = Octokit

if (OCTOKIT_ACCESS_TOKEN) {
  exports.octokit = new Octokit({
    auth: OCTOKIT_ACCESS_TOKEN,
    timeZone: 'Asia/Taipei',
    userAgent: 'gcf-line-devbot/v1.0.0',
  })
}
