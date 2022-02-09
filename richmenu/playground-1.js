const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-1'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/JDmkmjC.png',
  metadata: {
    chatBarText: '打開圖文選單',
    selected: true,
    size: { width: 2500, height: 1684 },
    areas: [
      {
        bounds: { x: 2310, y: 0, width: 190, height: 208 },
        action: {
          type: 'message',
          text: '/richmenuPlayground exit',
        },
      },
      {
        bounds: { x: 2120, y: 0, width: 190, height: 208 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-message-action',
        },
      },
      {
        bounds: { x: 742, y: 208, width: 737, height: 256 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-2',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-2' }),
        },
      },
      {
        bounds: { x: 1479, y: 208, width: 730, height: 256 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-3',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-3' }),
        },
      },
      {
        bounds: { x: 2209, y: 208, width: 291, height: 256 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-4',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-4' }),
        },
      },
      {
        bounds: { x: 576, y: 1026, width: 1346, height: 494 },
        action: {
          type: 'message',
          text: 'message sent successfully!',
        },
      },
    ],
  },
}
