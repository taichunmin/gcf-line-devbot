const { middlewareCompose } = require('../../libs/helper')

// 模仿 Koajs 的 middleware
const middleware = []

middleware.push(require('./init-event')) // 紀錄事件、過濾測試事件、輔助函式、錯誤處理
middleware.push(require('./reply-flex-from-text')) // 嘗試回傳 flex
middleware.push(require('./reply-event-json')) // 把事件用 json 回傳

module.exports = middlewareCompose(middleware)
