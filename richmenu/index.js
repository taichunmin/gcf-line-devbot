const _ = require('lodash')
const { log, sha1Base64url } = require('../libs/helper')
const axios = require('axios')
const resolvable = require('@josephg/resolvable')
const fsPromises = require('fs').promises
const path = require('path')

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
  'playground-8',
  'playground-9',
]

exports.bootstrap = (() => {
  const cached = {}
  return async (ctx, isForce = false) => {
    // 避免重複執行
    if (ctx.event?.deliveryContext?.isRedelivery === true) return // 重新送達的事件不處理 richmenu 更新
    const line = ctx.line
    if (line.richmenuReady) return await line.richmenuReady
    line.richmenuReady = resolvable()

    try {
      const channelAccessToken = line.config.channelAccessToken
      const botBasicId = (await line.getBotInfo())?.basicId
      const nowts = Date.now()
      if (isForce || _.toSafeInteger(cached[botBasicId]?.expiredAt) < nowts) {
        // 先取得舊的 richmenu
        const [oldMenus, newMenus, oldAliases] = await Promise.all([
          line.getRichMenuList(),
          exports.loadMenus(),
          exports.getRichMenuAliases(channelAccessToken),
        ])
        const oldAliasToId = _.fromPairs(_.map(oldAliases, menu => [menu.richMenuAliasId, menu.richMenuId]))
        const oldIdToHash = _.fromPairs(_.map(oldMenus, menu => [menu.richMenuId, menu.name]))

        // 新增 menu
        for (const menu of newMenus) {
          try {
            // 檢查 menu 是否已存在
            const oldId = oldAliasToId[menu.alias] ?? null
            const oldHash = oldIdToHash[oldId] ?? null
            if (!isForce && oldHash === menu.metadata.name) {
              menu.richMenuId = oldId
              return
            }
            // 上傳新的 richMenu
            menu.richMenuId = await line.createRichMenu(menu.metadata)
            log(`${botBasicId}: 上傳新的 Rich Menu, alias = ${menu.alias}, hash = ${menu.metadata.name}, richMenuId = ${menu.richMenuId}`)
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
            err.message = `${botBasicId}: ${err.message}`
            log('ERROR', err)
          }
        }
        const newAliasToId = _.fromPairs(_.map(newMenus, menu => [menu.alias, menu.richMenuId]))
        log(`${botBasicId}: newAliasToId = ${JSON.stringify(newAliasToId)}`)

        // 刪除不需要的 menu 和 alias
        const delMenuIds = _.difference(_.map(oldMenus, 'richMenuId'), _.map(newMenus, 'richMenuId'))
        const delAlias = _.difference(_.map(oldAliases, 'richMenuAliasId'), _.map(newMenus, 'alias'))
        await Promise.all([
          ..._.map(delMenuIds, async menuId => {
            log(`${botBasicId}: 刪除不需要的 menuId = ${menuId}, hash = ${oldIdToHash[menuId]}`)
            await line.deleteRichMenu(menuId)
          }),
          ..._.map(delAlias, async alias => {
            log(`${botBasicId}: 刪除不需要的 menuAlias = ${alias}`)
            await exports.deleteRichmenuAlias(channelAccessToken, alias)
          }),
        ])

        // 避免重複執行
        cached[botBasicId] = {
          cache: newAliasToId,
          expiredAt: nowts + 36e5, // 1hr
        }
      }
      ctx.richmenus = cached[botBasicId].cache
      line.richmenuReady.resolve(ctx)
      return await line.richmenuReady
    } catch (err) {
      log('ERROR', err)
      line.richmenuReady.reject(err)
    } finally {
      line.richmenuReady = null
    }
  }
})()

exports.loadMenus = async () => {
  const menus = []
  for (const filename of RICHMENU_FILES) {
    const file = await fsPromises.readFile(path.resolve(__dirname, `${filename}.js`), { charset: 'utf8' })
    const fileHash = sha1Base64url(file)
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
    _.set(menu, 'metadata.name', fileHash)
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
