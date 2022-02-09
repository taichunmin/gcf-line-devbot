const _ = require('lodash')
const { beautifyFlex, log, sha1Base64url } = require('../libs/helper')
const axios = require('axios')
const JSON5 = require('json5')

const RICHMENU_FILES = [
  'alias-a',
  'alias-b',
  'alias-c',
  'link-a',
  'link-b',
  'link-c',
  'playground-1',
  'playground-2',
  'playground-3',
  'playground-4',
  'playground-5',
  'playground-6',
  'playground-7',
]

exports.bootstrap = (() => {
  const cached = {}
  return async ctx => {
    try {
      const line = ctx.line
      const channelAccessToken = line.config.channelAccessToken
      const nowts = Date.now()
      if (_.toSafeInteger(cached.expiredAt) < nowts) {
        // 先取得舊的 richmenu
        const [oldMenus, newMenus, oldAliases] = await Promise.all([
          line.getRichMenuList(),
          exports.loadMenus(),
          exports.getRichMenuAliases(channelAccessToken),
        ])
        const oldAliasToId = _.fromPairs(_.map(oldAliases, menu => [menu.richMenuAliasId, menu.richMenuId]))
        const oldIdToHash = _.fromPairs(_.map(oldMenus, menu => [menu.richMenuId, menu.name]))

        // 新增 menu
        await Promise.all(_.map(newMenus, async menu => {
          try {
            // 檢查 menu 是否已存在
            const oldId = oldAliasToId[menu.alias]
            const oldHash = oldId ? oldIdToHash[oldId] : null
            if (oldHash === menu.metadata.name) {
              menu.richMenuId = oldId
              return
            }
            // 上傳新的 richMenu
            menu.richMenuId = await line.createRichMenu(menu.metadata)
            log(`上傳新的 Rich Menu, alias = ${menu.alias}, hash = ${menu.metadata.name}, richMenuId = ${menu.richMenuId}`)
            // 上傳圖
            const image = await axios.get(menu.image, { responseType: 'arraybuffer' })
            await line.setRichMenuImage(menu.richMenuId, image.data, image.headers['content-type'])
            // 設定為預設 richMenu
            if (menu.default) await line.setDefaultRichMenu(menu.richMenuId)
            // 新增或更新 alias
            if (!oldId) await exports.setRichmenuAlias(channelAccessToken, menu.alias, menu.richMenuId)
            else if (oldId !== menu.richMenuId) await exports.updateRichmenuAlias(channelAccessToken, menu.alias, menu.richMenuId)
          } catch (err) {
            _.set(err, 'data.menu', menu)
            log('error', err)
          }
        }))
        const newAliasToId = _.fromPairs(_.map(newMenus, menu => [menu.alias, menu.richMenuId]))
        log(`newAliasToId = ${JSON.stringify(newAliasToId)}`)

        // 刪除不需要的 menu 和 alias
        const delMenuIds = _.difference(_.map(oldMenus, 'richMenuId'), _.map(newMenus, 'richMenuId'))
        const delAlias = _.difference(_.map(oldAliases, 'richMenuAliasId'), _.map(newMenus, 'alias'))
        await Promise.all([
          ..._.map(delMenuIds, async menuId => {
            log(`刪除不需要的 menuId: ${menuId}`)
            await line.deleteRichMenu(menuId)
          }),
          ..._.map(delAlias, async alias => {
            log(`刪除不需要的 menuAlias: ${alias}`)
            await exports.deleteRichmenuAlias(channelAccessToken, alias)
          }),
        ])

        // 避免重複執行
        cached.cache = newAliasToId
        cached.expiredAt = nowts + 36e5 // 1hr
      }
      ctx.richmenus = cached.cache
      return ctx
    } catch (err) {
      log('error', err)
    }
  }
})()

exports.loadMenus = async () => {
  const menus = []
  for (const filename of RICHMENU_FILES) {
    const menu = require(`./${filename}`)
    const areas = menu?.metadata?.areas
    if (_.isArray(areas)) {
      menu.metadata.areas = _.sortBy(areas, [
        'bounds.x',
        'bounds.y',
        'bounds.width',
        'bounds.height',
        'action.type',
      ])
    }
    _.set(menu, 'metadata.name', '') // 避免不小心指定 menu.metadata.name
    const sha1 = sha1Base64url(JSON5.stringify(beautifyFlex(menu)))
    _.set(menu, 'metadata.name', sha1)
    menus.push(menu)
  }
  return menus
}

exports.getRichMenuAliases = async channelAccessToken => {
  return _.get(await axios.get('https://api.line.me/v2/bot/richmenu/alias/list', {
    headers: { Authorization: `Bearer ${channelAccessToken}` },
  }), 'data.aliases', [])
}

exports.setRichmenuAlias = async (channelAccessToken, richMenuAliasId, richMenuId) => {
  try {
    if (!richMenuAliasId) return
    return _.get(await axios.post('https://api.line.me/v2/bot/richmenu/alias', {
      richMenuAliasId,
      richMenuId,
    }, {
      headers: { Authorization: `Bearer ${channelAccessToken}` },
    }), 'data')
  } catch (err) {
    _.set(err, 'data.alias', richMenuAliasId)
    _.set(err, 'data.richMenuId', richMenuId)
    throw err
  }
}

exports.updateRichmenuAlias = async (channelAccessToken, richMenuAliasId, richMenuId) => {
  try {
    if (!richMenuAliasId) return
    return _.get(await axios.post(`https://api.line.me/v2/bot/richmenu/alias/${richMenuAliasId}`, {
      richMenuId,
    }, {
      headers: { Authorization: `Bearer ${channelAccessToken}` },
    }), 'data')
  } catch (err) {
    _.set(err, 'data.alias', richMenuAliasId)
    _.set(err, 'data.richMenuId', richMenuId)
    throw err
  }
}

exports.deleteRichmenuAlias = async (channelAccessToken, richMenuAliasId) => {
  try {
    if (!richMenuAliasId) return
    return _.get(await axios.delete(`https://api.line.me/v2/bot/richmenu/alias/${richMenuAliasId}`, {
      headers: { Authorization: `Bearer ${channelAccessToken}` },
    }), 'data')
  } catch (err) {
    _.set(err, 'data.func', 'deleteRichmenuAlias')
    _.set(err, 'data.alias', richMenuAliasId)
    throw err
  }
}
