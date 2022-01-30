module.exports = [
  { text: 'Home', link: '/', icon: 'reco-home' },
  {
    text: '前端基础', items: 
    [ 
      {
        text: 'JavaScript', items: [
          {text: 'JS', link: '/basic/JavaScript/javascript/' },
          {text: 'ES6-ES10', link: '/basic/JavaScript/ES6-ES10/' },
          {text: 'TypeScript', link: '/basic/JavaScript/typescript/01.md' },
        ]
      },
      {
        text: 'CSS', items: [
          { text: 'css', link: '/basic/CSS/css/' },
          { text: 'less', link: '/basic/CSS/less/01.md' },
        ]
      },
      {
        text: '其他', items: [
          { text: '专题', link: '/basic/Other/subjects/' },
          { text: '实践', link: '/basic/Other/example/' },
        ]
      }
    ]
  },
  {
    text: '前端进阶', items:
    [
      {
        text: '函数式编程', link: '/advance/Functor/01.md'
      },
      {
        text: '性能优化', link: '/advance/performance/'
      },
      {
        text: '前端工程化', items: [
          { text: '工程化', link: '/advance/program/01.md' },
          { text: '脚手架', link: '/advance/program/Scaffold/01.md' },
          { text: '自动化构建', link: '/advance/program/BuildAutomation/01.md' },
          { text: '模块化', link: '/advance/program/Modules/01.md' },
          { text: '测试', link: '/advance/program/test/01.md' }
        ]
      },
      {
        text: '源码', items: 
        [
          {text: 'Promise', link: '/advance/sourceCode/promise/'},
          {text: 'Webpack', link: '/advance/sourceCode/webpack/01.md'},
          {text: 'Snabbdom', link: '/frame/Vue/virtual-dom/03.md'},
          {text: 'Vue', link: '/frame/Vue/vue-source-code/01.md'},
          {text: 'vue-observe', link: '/frame/Vue/vue-observe/02.md'},
          {text: 'vue-router', link: '/frame/Vue/vue-router/04.md'},
          {text: 'vuex', link: '/frame/Vue/Vuex/03vuex.md'},
        ]
      },
    ]
  },
  {
    text: '框架', items:
    [
      { text: 'Vue', items: [
        { text: 'Vue2', link: '/frame/Vue/'},
        { text: 'Vue3', link: '/frame/Vue3/01vue3.md'},
        { text: 'SSR', link: '/frame/SSR/'},
      ]}
    ]
  },
  {
    text: 'Tools', link: '/tools/', icon: 'reco-api'
  },
  {
    text: '更多', items:
    [
      { text: 'Git', link: '/more/Git/01.md'},
      { text: 'AST', link: '/more/AST/01.md'},
      { text: '部署', link: '/more/deployment/'},
      { text: 'Docker', link: '/more/Docker/01.md'},
      { text: '计算机网络', link: '/more/Network/'},
    ]
  },
  { text: '标签分类', link: '/tag/', icon: 'reco-category' },
  { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
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
]