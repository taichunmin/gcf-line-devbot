const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-1'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://hackmd.io/_uploads/B1P8_qf0lg.png',
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
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-message-action',
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
      { // 傳送訊息
        bounds: { x: 576, y: 1055, width: 1346, height: 494 },
        action: {
          type: 'message',
          text: 'message sent successfully!',
        },
      },
    ],
  },
}
