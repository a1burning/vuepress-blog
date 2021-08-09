module.exports = [
  { text: 'Home', link: '/' },
  { text: '最新博客', link: '/newBlog.html' },
  {
    text: '前端基础', items: 
    [ 
      {
        text: 'JavaScript', items: [
          {text: 'JS', link: '/javascript/javascript/' },
          {text: 'ES6-ES10', link: '/javascript/ES6-ES10/' },
          {text: 'TypeScript', link: '/javascript/typescript/01.md' },
        ]
      },
      {
        text: 'CSS', items: [
          { text: 'css', link: '/CSS/css/' },
          { text: 'less', link: '/CSS/less/01.md' },
        ]
      },
      {
        text: '其他', items: [
          { text: '专题', link: '/javascript/subjects/' },
          { text: '实践', link: '/javascript/example/' },
        ]
      }
    ]
  },
  {
    text: '前端进阶', items:
    [
      {
        text: '函数式编程', link: '/javascript/javascript/Functor/01.md'
      },
      {
        text: '性能优化', link: '/performance/'
      },
      {
        text: '前端工程化', items: [
          { text: '工程化', link: '/program/#工程化概述' },
          { text: '脚手架', link: '/program/#脚手架' },
          { text: '自动化构建流', link: '/program/#自动化构建流' },
          { text: '模块化', link: '/program/#模块化打包工具' },
          { text: '测试', link: '/program/test/01.md' }
        ]
      },
      {
        text: '源码', items: 
        [
          {text: 'Promise', link: '/code/promise/'}
        ]
      },
    ]
  },
  {
    text: '工具库', items:
    [
      { text: 'QRCodeJS', link: '/toolsLibrary/QRCodeJS/'},
      { text: 'LottieJS', link: '/toolsLibrary/LottieJS/'},
      { text: 'Flow', link: '/toolsLibrary/Flow/01.md'},
      { text: 'Jquery', link: '/toolsLibrary/Jquery/'},
    ]
  },
  {
    text: '框架', items:
    [
      { text: 'Vue', items: [
        { text: 'Vuex', link: '/vue/vuex/01vuex.html'},
        { text: 'Vue3.0', link: '/vue/vue3.0/01vue3.0.html'}
      ]}
    ]
  },
  // {
  //   text: '实践', items:
  //   [
  //     { text: '专题', link: '/others/Git/01.md'}
  //   ]
  // },
  {
    text: 'Tools', items: 
    [
      {text: 'node', items: [
        {text: 'nodemon', link: '/tools/node/nodemon/'},
        {text: 'nrm', link: '/tools/node/nrm/'},
        {text: 'nvm', link: '/tools/node/nvm/'},
      ]},
      {text: 'vscode', items: [
        {text: 'Fria Code', link: '/tools/vscode/firacode.html'},
        {text: 'codeSpellChecker', link: '/tools/vscode/codespellchecker.html'},
        {text: 'FlowLanguageSupport', link: '/toolsLibrary/Flow/05.md'},
      ]},
    ]
  },
  {
    text: '更多', items:
    [
      { text: 'Git', link: '/others/Git/01.md'}
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
]