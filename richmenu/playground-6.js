const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-6'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/gcXGaGd.png',
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
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-richmenu-switch-action',
        },
      },
      {
        bounds: { x: 0, y: 208, width: 300, height: 256 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-1',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-1' }),
        },
      },
      {
        bounds: { x: 300, y: 208, width: 730, height: 256 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-4',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-4' }),
        },
      },
      {
        bounds: { x: 0, y: 1000, width: 1250, height: 550 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-5',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-5' }),
        },
      },
      {
        bounds: { x: 1250, y: 1000, width: 1250, height: 550 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-7',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-7' }),
        },
      },
    ],
  },
}
