const config = require('./secret')
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
  ['@vssue/vuepress-plugin-vssue', {
    // 设置 `platform` 而不是 `api`
    platform: 'github-v4',

    // 其他的 Vssue 配置
    owner: config.owner,
    repo: config.repo,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    autoCreateIssue: true
  }],
  ['@vuepress/back-to-top'],
  ['@vuepress/medium-zoom'],
  ['@vuepress/active-header-links']
]