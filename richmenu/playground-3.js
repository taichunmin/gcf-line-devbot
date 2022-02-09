const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-3'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/pp0hGsm.png',
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
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-uri-action',
        },
      },
      {
        bounds: { x: 0, y: 208, width: 742, height: 256 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-1',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-1' }),
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
        bounds: { x: 2209, y: 208, width: 291, height: 256 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-4',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-4' }),
        },
      },
      {
        bounds: { x: 0, y: 530, width: 1320, height: 358 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/reference/messaging-api/#uri-action',
        },
      },
      {
        bounds: { x: 1320, y: 530, width: 380, height: 358 },
        action: {
          type: 'message',
          text: '網址為:\nhttps://developers.line.biz/en/reference/messaging-api/#uri-action',
        },
      },
      {
        bounds: { x: 0, y: 888, width: 1320, height: 358 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/reference/messaging-api/?openExternalBrowser=1#uri-action',
        },
      },
      {
        bounds: { x: 1320, y: 888, width: 380, height: 358 },
        action: {
          type: 'message',
          text: '網址為:\nhttps://developers.line.biz/en/reference/messaging-api/?openExternalBrowser=1#uri-action',
        },
      },
      {
        bounds: { x: 0, y: 1246, width: 1320, height: 358 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/reference/messaging-api/?openInAppBrowser=0#uri-action',
        },
      },
      {
        bounds: { x: 1320, y: 1246, width: 380, height: 358 },
        action: {
          type: 'message',
          text: '網址為:\nhttps://developers.line.biz/en/reference/messaging-api/?openInAppBrowser=0#uri-action',
        },
      },
    ],
  },
}
