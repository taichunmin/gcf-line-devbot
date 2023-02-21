const { middlewareCompose } = require('../../libs/helper')

// 模仿 Koajs 的 middleware
const middleware = []

middleware.push(require('./initEvent')) // 紀錄事件、過濾測試事件、輔助函式、錯誤處理
middleware.push(require('./cmd')) // 處理指令
middleware.push(require('./replyFlexFromText')) // 嘗試回傳 flex
middleware.push(require('./noReplyUrl')) // 如果是一個合法的 URL 就不作回應
middleware.push(require('./replyEventJson')) // 把事件用 json 回傳

module.exports = middlewareCompose(middleware)
