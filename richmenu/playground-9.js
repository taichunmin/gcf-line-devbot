const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-9'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/FQTPA2J.png',
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
          uri: 'https://developers.line.biz/en/reference/messaging-api/#clipboard-action',
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
      { // 5. 切換選單
        bounds: { x: 1030, y: 208, width: 730, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-5',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-5' }),
        },
      },
      { // 複製文字
        bounds: { x: 576, y: 1055, width: 1346, height: 494 },
        action: {
          type: 'clipboard',
          clipboardText: '這是你從圖文選單遊樂場複製的文字',
        },
      },
    ],
  },
}
