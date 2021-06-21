const { httpBuildQuery } = require('../libs/helper')

const RICHMENU_ALIAS = 'alias-a'

module.exports = {
  alias: RICHMENU_ALIAS,
  image: 'https://i.imgur.com/uTSeCeQ.png',
  metadata: {
    chatBarText: `範例 ${RICHMENU_ALIAS}`,
    selected: true,
    size: { width: 800, height: 400 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 268, height: 114 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'alias-a',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'alias-a' }),
        },
      },
      {
        bounds: { x: 268, y: 0, width: 264, height: 114 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'alias-b',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'alias-b' }),
        },
      },
      {
        bounds: { x: 532, y: 0, width: 268, height: 114 },
        action: {
          type: 'richmenuswitch',
          richMenuAliasId: 'alias-c',
          data: httpBuildQuery({ from: RICHMENU_ALIAS, to: 'alias-c' }),
        },
      },
      {
        bounds: { x: 0, y: 114, width: 268, height: 118 },
        action: {
          type: 'message',
          text: '/demoRichmenuAlias link-a',
        },
      },
      {
        bounds: { x: 268, y: 114, width: 264, height: 118 },
        action: {
          type: 'message',
          text: '/demoRichmenuAlias link-b',
        },
      },
      {
        bounds: { x: 532, y: 114, width: 268, height: 118 },
        action: {
          type: 'message',
          text: '/demoRichmenuAlias link-c',
        },
      },
      {
        bounds: { x: 0, y: 232, width: 400, height: 168 },
        action: {
          type: 'message',
          text: '/demoRichmenuAlias exit',
        },
      },
      {
        bounds: { x: 400, y: 232, width: 400, height: 168 },
        action: {
          type: 'uri',
          uri: 'https://lihi1.com/kIcgO',
        },
      },
    ],
  },
}
