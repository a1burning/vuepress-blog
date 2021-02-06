// VuePress 的配置文件

module.exports = {
  title: '狐七的个人博客', // meta中的title
  description: '我努力向前，在看不到终点的路上，欣赏风景~', // meta中的description
  head: [
    ['link', { rel: 'icon', href: '/assets/img/favicon.ico'}],
    ['meta', { name: 'author', content: '狐七'}],
    ['meta', {name: 'keywords', content: 'vuepress，狐七的个人博客，html，css，javascript，es6'}],
    ['link', { rel: 'manifest', href: '/assets/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/assets/icons/icon-152x152.png' }],
    ['link', { rel: 'mask-icon', href: '/assets/icons/icon-72x72.png', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/assets/icons/icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig: {
    lastUpdated: '更新时间', // string | boolean
    logo: '/assets/img/logo.jpg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'JavaScript', items: 
        [
          {text: 'ES6-ES10', link: '/javascript/ES6-ES10/'}
        ]
      },
      { text: 'Blog/Repository', items: [
          {
            text: '技术博客', items: [
              { text: '掘金', link: 'https://juejin.cn/user/2735240659352702' },
              { text: 'segmentfault', link: 'https://segmentfault.com/u/wanpidexuehuqiqi' },
              { text: '简书', link: 'https://www.jianshu.com/u/633ee08c3769' },
              { text: '知乎', link: 'https://www.zhihu.com/people/wan-pi-de-xue-hu-yi-zhi' },
              { text: 'SCDN', link: 'https://blog.csdn.net/weixin_40664145?spm=1010.2135.3001.5343' },
            ]
          },
          {
            text: 'Code Repository', items: [
              { text: 'Github', link: 'https://github.com/a1burning' },
              { text: 'Gitee', link: 'https://gitee.com/burningQiQi' }
            ]
          }
        ]  
      }
    ],
    // sidebar: [
    //   '/',
    //   ['/javascript/es6/','JavaScript'],
    //   ['/page-b','hahaha']
    // ]
  },
  plugins: [
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
    }]
  ]
}