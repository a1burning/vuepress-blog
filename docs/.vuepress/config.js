const headConf = require('./config/headConf')
const pluginsConf = require('./config/pluginsConf')
const navConf = require('./config/navConfig')
// const { config } = require('vuepress-theme-hope')
// VuePress 的配置文件

module.exports = {
  title: '狐七的个人博客', // meta中的title
  description: '我努力向前，在看不到终点的路上，欣赏风景~', // meta中的description
  head: headConf,
  theme: 'reco',
  themeConfig: {
    author: '狐七',
    lastUpdated: '更新时间', // string | boolean
    logo: '/assets/img/logo.jpg',
    nav: navConf,
    smoothScroll: true,
    subSidebar: 'auto',
    noFoundPageByTencent: false,
    // 备案
    record: '京ICP备2021001777号',
    recordLink: 'https://beian.miit.gov.cn/',
    // cyberSecurityRecord: '公安部备案文案',
    // cyberSecurityLink: '公安部备案指向链接',
    // sidebar: [
    //   '/',
    //   ['/javascript/es6/','JavaScript'],
    //   ['/page-b','hahaha']
    // ]
  },
  plugins: pluginsConf,
  configureWebpack: {
    resolve: {
      alias: {
        '@public': '/docs/.vuepress/public'
      }
    }
  },
  markdown: {
    lineNumbers: true
  }
}