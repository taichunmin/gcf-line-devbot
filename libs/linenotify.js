const _ = require('lodash')
const { httpBuildQuery } = require('./helper')
const axios = require('axios')

const LINE_NOTIFY_API_APIBASE = 'https://notify-api.line.me'

/**
 * @param {String} body.message 1000 characters max
 * @param {URL?} body.imageThumbnail Maximum size of 240×240px JPEG
 * @param {URL?} body.imageFullsize Maximum size of 2048×2048px JPEG
 * @param {File?} body.imageFile Upload a image file to the LINE server. Supported image format is png and jpeg. If you specified imageThumbnail ,imageFullsize and imageFile, imageFile takes precedence. There is a limit that you can upload to within one hour. For more information, please see the section of the API Rate Limit.
 * @param {Number?} body.stickerPackageId Package ID. https://devdocs.line.me/files/sticker_list.pdf
 * @param {Number?} body.stickerId Sticker ID.
 * @param {Boolean?} body.notificationDisabled true: The user doesn't receive a push notification when the message is sent. false: The user receives a push notification when the message is sent (unless they have disabled push notification in LINE and/or their device). If omitted, the value defaults to false.
 */
exports.notify = async (accessToken, body) => {
  try {
    await axios.post(`${LINE_NOTIFY_API_APIBASE}/api/notify`, httpBuildQuery(body), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  } catch (err) {
    err.message = _.get(err, 'response.data.message', err.message)
    err.status = _.get(err, 'response.status', 500)
    if (err.status === 401) err.message = 'Notify Token Revoked'
    throw err
  }
}
