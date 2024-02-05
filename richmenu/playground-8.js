const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-8'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/VG5R2jn.png',
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
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-postback-2-action',
        },
      },
      { // 1. message
        bounds: { x: 0, y: 208, width: 742, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-1',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-1' }),
        },
      },
      { // 2. postback
        bounds: { x: 742, y: 208, width: 737, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-2',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-2' }),
        },
      },
      { // 3. URI
        bounds: { x: 1479, y: 208, width: 730, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-3',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-3' }),
        },
      },
      { // 4. 選擇日時
        bounds: { x: 2209, y: 208, width: 291, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-4',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-4' }),
        },
      },
      { // 切換文字輸入
        bounds: { x: 0, y: 875, width: 1250, height: 370 },
        action: {
          data: 'actionId=61',
          fillInText: '---\n這是預先填寫的文字\n---',
          inputOption: 'openKeyboard',
          type: 'postback',
        },
      },
      { // 切換語音訊息
        bounds: { x: 1250, y: 875, width: 1250, height: 370 },
        action: {
          data: 'actionId=62',
          inputOption: 'openVoice',
          type: 'postback',
        },
      },
      { // 關閉及開啟圖文選單
        bounds: { x: 0, y: 1245, width: 2500, height: 370 },
        action: {
          data: '/postbackInputOption',
          inputOption: 'closeRichMenu',
          type: 'postback',
        },
      },
    ],
  },
}
