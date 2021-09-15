---
title: Plop —— 小而美的脚手架工具
tags: 
  - 前端工程化
  - Plop
  - 脚手架
date: 2020-12-26
sidebarDepth: 5
---
## Plop介绍

主要用于创建项目中特定文件类型的小工具，类似于`Yeoman`中的`sub generator`，一般不会独立使用。一般会把`Plop`集成到项目中，用来自动化的创建同类型的项目文件。

- [plop-npm](https://www.npmjs.com/package/plop)
- [plop-github](https://github.com/plopjs/plop)
## Plop的具体使用
### 具体步骤
1. 新建目录，初始化`npm init -y`，安装`Plop`

```bash
npm install -g plop
```

2. 在目录下创建`plop-templates`文件夹，里面创建三个模板文件

- component.css.hbs

```css
.{{name}} {
  
}
```
- component.hbs

```js
import React from 'react';

export default () => (
  <div className="{{ name }}">
    <h1>{{name}} Component</h1>
  </div>
)
```

- component.test.hbs
```js
import React from 'react';
import ReactDOM from 'react-dom';
import {{name}} from './{{name}}';

it('renders widthout crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<{{name}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

3. 在根目录下创建一个`plopfile.js`的文件，这个文件是`Plop`的入口文件，需要导出一个函数，这个函数接收一个`plop`对象，用于创建生成器任务。

> - `plop.setGenerator`：设置一个生成器，第一个参数是项目名称，第二个函数是对象，对应设置选项
> - 配置项内容：
>	 + `description`：描述
>    + `prompts`：值是数组，命令行交互问题，一个问题对应一个对象
>    + `actions`：值是数组，完成命令行交互过后完成的一些动作，一个对象一个动作
```js
module.exports = plop => {
  // 设置一个生成器，第一个参数是项目名称，第二个函数是对象，对应设置选项
  plop.setGenerator('compontent', {
    // 描述
    description: 'create a component',
    // 命令行交互问题
    prompts: [
        // 一个问题对应一个对象，配置参考自定义Generator
      {
        type: 'input',
        name: 'name',
        message: 'component name',
        default: 'MyComponent'
      }
    ],
    // 完成命令行交互过后完成的一些动作
    actions: [
      //每一个对象都是一个动作
      {
        type: 'add', // 代表添加文件
        // 被添加的文件在输出的哪个路径，双花括号插值表达式可以获取交互得到的数据
        path: 'src/components/{{name}}/{{name}}.js',
        // 模板文件是什么
        templateFile: 'plop-templates/component.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.css',
        templateFile: 'plop-templates/component.css.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.test.js',
        templateFile: 'plop-templates/component.test.hbs'
      }
    ]
  })
}
```
4. 在`package.json`中添加
```js
  "scripts": {
    "plop": "plop"
  }
```

5. 运行
```bash
npm run plop
# 输入模块名称
? component name Header
#√  ++ \src\components\Header\Header.js
#√  ++ \src\components\Header\Header.css
#√  ++ \src\components\Header\Header.test.js
```
此时在根目录的`src\components`下面，有了三个文件

- Header.js

```js
import React from 'react';

export default () => (
  <div className="Header">
    <h1>Header Component</h1>
  </div>
)
```
- Header.css

```css
.Header {
  
}
```

- Header.test.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';

it('renders widthout crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

这样，就可以根据模板一键生成一个组件目录。

## 总结
1. 将`plop`模块作为项目开发依赖安装 
2. 编写用于生成特定类型文件的模板
3. 在项目根目录下创建一个`plopfile.js`文件
4. 在`plopfile.js`文件中定义脚手架任务
5. 通过`Plop`提供的`CLI`运行脚手架任务

