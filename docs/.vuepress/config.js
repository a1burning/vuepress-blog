// VuePress 的配置文件

module.exports = {
  title: '狐七的个人博客', // meta中的title
  description: '我努力向前，在看不到终点的路上，欣赏风景~', // meta中的description
  head: [
    ['link', { rel: 'icon', href: '/assets/img/favicon.ico'}],
    ['meta', { name: 'author', content: '狐七'}],
    ['meta', {name: 'keywords', content: 'vuepress，狐七的个人博客，html，css，javascript，es6'}]
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
  plugins: {
    "vuepress-plugin-auto-sidebar": {
      collapsable: true
    }
  }
}