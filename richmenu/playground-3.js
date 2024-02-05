const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-3'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/phSK2zz.png',
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
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-uri-action',
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
      { // 4. 選擇日時
        bounds: { x: 2209, y: 208, width: 291, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-4',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-4' }),
        },
      },
      { // 開啟 URL
        bounds: { x: 0, y: 485, width: 1332, height: 375 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/reference/messaging-api/#uri-action',
        },
      },
      { // 開啟 URL 查看網址
        bounds: { x: 1332, y: 485, width: 380, height: 375 },
        action: {
          type: 'message',
          text: '網址為:\nhttps://developers.line.biz/en/reference/messaging-api/#uri-action',
        },
      },
      { // 在外部瀏覽器開啟
        bounds: { x: 0, y: 860, width: 1332, height: 375 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/reference/messaging-api/?openExternalBrowser=1#uri-action',
        },
      },
      { // 在外部瀏覽器開啟 查看網址
        bounds: { x: 1332, y: 860, width: 380, height: 375 },
        action: {
          type: 'message',
          text: '網址為:\nhttps://developers.line.biz/en/reference/messaging-api/?openExternalBrowser=1#uri-action',
        },
      },
      { // 在 APP 內的 Chrome 開啟
        bounds: { x: 0, y: 1235, width: 1332, height: 375 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/reference/messaging-api/?openInAppBrowser=0#uri-action',
        },
      },
      { // 在 APP 內的 Chrome 開啟 查看網址
        bounds: { x: 1332, y: 1235, width: 380, height: 375 },
        action: {
          type: 'message',
          text: '網址為:\nhttps://developers.line.biz/en/reference/messaging-api/?openInAppBrowser=0#uri-action',
        },
      },
    ],
  },
}
