module.exports = [
  { text: 'Home', link: '/' },
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
          { text: '工程化', link: '/advance/program/#工程化概述' },
          { text: '脚手架', link: '/advance/program/#脚手架' },
          { text: '自动化构建流', link: '/advance/program/#自动化构建流' },
          { text: '模块化', link: '/advance/program/Modules/01.md' },
          { text: '测试', link: '/advance/program/test/01.md' }
        ]
      },
      {
        text: '源码', items: 
        [
          {text: 'Promise', link: '/advance/sourceCode/promise/'}
        ]
      },
    ]
  },
  {
    text: '框架', items:
    [
      { text: 'Vue', items: [
        { text: 'Vuex', link: '/frame/vuex/01vuex.html'},
        { text: 'Vue3.0', link: '/frame/vue3.0/01vue3.0.html'}
      ]}
    ]
  },
  {
    text: 'Tools', items: 
    [
      {text: 'node', items: [
        {text: 'nodemon', link: '/tools/node/nodemon/'},
        {text: 'nrm', link: '/tools/node/nrm/'},
        {text: 'nvm', link: '/tools/node/nvm/'},
      ]},
      {text: '工具库', items: [
        { text: 'QRCodeJS', link: '/tools/toolsLibrary/QRCodeJS/'},
        { text: 'LottieJS', link: '/tools/toolsLibrary/LottieJS/'},
        { text: 'Flow', link: '/tools/toolsLibrary/Flow/01.md'},
        { text: 'Jquery', link: '/tools/toolsLibrary/Jquery/'},
      ]},
      {text: 'vscode', items: [
        {text: 'Fria Code', link: '/tools/vscode/firacode.html'},
        {text: 'codeSpellChecker', link: '/tools/vscode/codespellchecker.html'},
        {text: 'FlowLanguageSupport', link: '/tools/toolsLibrary/Flow/05.md'},
      ]},
    ]
  },
  {
    text: '更多', items:
    [
      { text: 'Git', link: '/more/Git/01.md'}
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