const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-4'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/ewGGiZI.png',
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
          uri: 'https://developers.line.biz/en/docs/messaging-api/try-rich-menu/#try-datetime-picker-action',
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
      { // 5. 切換選單
        bounds: { x: 1030, y: 208, width: 730, height: 245 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-5',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-5' }),
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
      { // 選擇日期與時間
        bounds: { x: 0, y: 1016, width: 1600, height: 300 },
        action: {
          type: 'datetimepicker',
          data: 'actionId=31',
          mode: 'datetime',
        },
      },
      { // 指定初始值
        bounds: { x: 0, y: 1315, width: 830, height: 300 },
        action: {
          type: 'datetimepicker',
          data: 'actionId=32',
          initial: '2021-11-01t00:00',
          mode: 'datetime',
        },
      },
      { // 指定上下限
        bounds: { x: 830, y: 1315, width: 770, height: 300 },
        action: {
          type: 'datetimepicker',
          data: 'actionId=33',
          max: '2021-12-31t23:59',
          min: '2021-11-01t00:00',
          mode: 'datetime',
        },
      },
      { // 選擇日期
        bounds: { x: 1600, y: 1016, width: 900, height: 300 },
        action: {
          type: 'datetimepicker',
          data: 'actionId=34',
          mode: 'date',
        },
      },
      { // 選擇時間
        bounds: { x: 1600, y: 1315, width: 900, height: 300 },
        action: {
          type: 'datetimepicker',
          data: 'actionId=35',
          mode: 'time',
        },
      },
    ],
  },
}
