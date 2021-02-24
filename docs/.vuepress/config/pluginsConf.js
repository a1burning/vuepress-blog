module.exports = [
  ["vuepress-plugin-auto-sidebar", {
    collapsable: true
  }],
  ['@vuepress/last-updated', {
    transformer: (timestamp, lang) => {
      // 不要忘了安装 moment
      const moment = require('moment')
      moment.locale(lang)
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    }
  }],
  ['@vuepress/pwa', {
    serviceWorker: true,
    updatePopup: {
    message: "博客更新啦，要刷新看看嘛?",
    buttonText: "Refresh"
    }
  }],
  ['@vuepress/back-to-top'],
  ['@vuepress/medium-zoom'],
  ['@vuepress/active-header-links']
]