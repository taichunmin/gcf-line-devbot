const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-5'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/zDNynYv.png',
  metadata: {
    chatBarText: '點此打開圖文選單',
    selected: true,
    size: { width: 2500, height: 1684 },
    areas: [
      { // 關閉圖文選單遊樂場
        bounds: { x: 2325, y: 0, width: 175, height: 208 },
        action: {
          type: 'message',
          text: '/richmenuPlayground exit',
        },
      },
      { // 動作說明
        bounds: { x: 2150, y: 0, width: 175, height: 208 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-richmenu-switch-action',
        },
      },
      { // 1. message
        bounds: { x: 0, y: 208, width: 300, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-1',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-1' }),
        },
      },
      { // 4. 選擇日時
        bounds: { x: 300, y: 208, width: 730, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-4',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-4' }),
        },
      },
      { // 6. clipboard
        bounds: { x: 1760, y: 208, width: 730, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-9',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-9' }),
        },
      },
      { // 換成藍色選單
        bounds: { x: 0, y: 1100, width: 1250, height: 450 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-6',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-6' }),
        },
      },
      { // 換成小型選單
        bounds: { x: 1250, y: 1100, width: 1250, height: 450 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-7',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-7' }),
        },
      },
    ],
  },
}
