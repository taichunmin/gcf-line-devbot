const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-2'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://hackmd.io/_uploads/B1_Pu5fAge.png',
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
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-postback-1-action',
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
      { // 包含 displayText
        bounds: { x: 0, y: 875, width: 1250, height: 420 },
        action: {
          type: 'postback',
          data: 'actionId=21',
          displayText: '這則文字將顯示在聊天視窗內。',
        },
      },
      { // 沒有 displayText
        bounds: { x: 1250, y: 875, width: 1250, height: 420 },
        action: {
          type: 'postback',
          data: 'actionId=22',
        },
      },
      { // 測試 inputOption 屬性
        bounds: { x: 0, y: 1295, width: 2500, height: 320 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-8',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-8' }),
        },
      },
    ],
  },
}
