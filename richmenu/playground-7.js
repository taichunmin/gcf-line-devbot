const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'playground-7'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://hackmd.io/_uploads/ByCnO9GRll.png',
  metadata: {
    chatBarText: '點此打開圖文選單',
    selected: true,
    size: { width: 2500, height: 421 },
    areas: [
      { // 換回綠色選單
        bounds: { x: 0, y: 0, width: 1600, height: 421 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'playground-5',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'playground-5' }),
        },
      },
      { // size 說明文件
        bounds: { x: 1600, y: 0, width: 660, height: 421 },
        action: {
          type: 'uri',
          uri: 'https://developers.line.biz/en/reference/messaging-api/#size-object',
        },
      },
    ],
  },
}
