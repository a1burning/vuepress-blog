---
title: Stylelint
tags: 
  - 前端工程化
  - 模块化开发
prev: false
next: false
sidebarDepth: 5
---

css代码的lint操作使用工具Stylelint，和eslint基本一致

- 提供默认的代码检查规则，可以手动开启或者关闭某个规则
- 提供CLI工具，可以在终端中快速调用检查文件
- 通过插件支持Sass Less PostCSS
- 支持 Gulp 或 Webpack 等自动化打包工具的集成

## 快速上手
1. npm初始化`npm init -y`，安装stylelint模块`npm install stylelint -D`
2. 使用之前需要先进行文件配置`stylelintrc.js`
3. 安装共享的配置模块 `npm i stylelint-config-standard`，在配置文件中使用

```js
module.exports = {
  extends: 'stylelint-config-standard'
}
```
4. 准备错误文件`index.css`

```css
.{
  background:chartreuse;
  color: center;
  hello: '20px'
}
```
命令行`npx stylelint ./index.ts`可以看到所有报错

![image](~@public/assets/program/modules/stylelint1.png)

也可以使用`npx stylelint index.css --fix`自动解决大部分问题。

## stylelint检查sass代码
我们如果要检查sass代码，需要额外安装插件`stylelint-config-sass-guidelines`。

1. 原来项目的中安装`npm i stylelint-config-sass-guidelines -D`
2. 在`stylelintrc.js`配置文件中修改

```js
module.exports = {
  extends: [
    'stylelint-config-standard',
    // 添加模块继承
    'stylelint-config-sass-guidelines'
  ]
}
```
3. 创建`index.scss`文件并写入错误样式
```js
$jumbotron-bg: #ccc;

body{
  background-color: $jumbotron-bg
}

```
4. 执行命令`npx stylelint index.scss`可以看到文件检查报错

![image](~@public/assets/program/modules/stylelint2.png)