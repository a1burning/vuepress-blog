---
title: Parcel —— 零配置的模块打包工具
tags: 
  - 前端工程化
  - Parcel
sidebarDepth: 5
---
## Parcel概述
是一款完全零配置的前端应用打包器，其提供了近乎傻瓜式的使用体验。我们只需要使用它提供的简单的几个命令就可以直接构建前端应用程序了。

### Parcel的背景
`Parcel`发布于2017年，当时的`Webpack`使用上过于繁琐，官方文档也不是很清晰明了。所以一发布就被推上了封口浪尖。

### Parcel的特点

- 完全零配置
- 构建速度更快
- 自动安装依赖，开发更加便捷


> PS: 不过现在使用最广的还是`webpack`，因为`webpack`有更好的生态，扩展更丰富，很多问题可以查找资料解决，这两年`webpack`也越来越好用，开发者也越来越熟悉。
>
> **Parcel工具对于开发者而言，了解它也是为了学习新技术，保持对新技术和思想的敏感度，从而更好的把握技术的趋势和走向。**

## 快速上手
1. 创建目录并使用`npm init -y`初始化`package.json`，
2. 安装模块`npm i parcel-bundler --save-dev`
3. 创建`src/index.html`文件作为入口文件，虽然`Parcel`支持任意文件为打包入口，但是还是**推荐我们使用HTML文件作为打包入口，官方理由是HTML是浏览器运行的入口**故应该使用`HTML`作为打包入口。

> `HTML`中引用的文件最终会被`Parcel`打包到一起到输出目录


```html
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="main.js"></script>
</body>
</html>
```

4. 准备`src/foo.js`和`src/main.js`

```js
// foo.js
export default {
  bar: () => {
    console.log("hello")
  }
}
```
```js
// main.js
import foo from './foo'

foo.bar()
```
5. 在`package.json`中配置`script`

```js
"scripts": {
    "parcel": "parcel"
},
```

6. 在命令行中输入`npm run parcel src/index.html`，后面要跟着入口文件名称，可以看到有`dist`文件输出，并且`Parcel`自动开启了开发服务器，这个开发服务器和`webpack`中`dev-server`一样也开启了自动刷新，如果修改文件可以看到浏览器中的内容及时进行更新。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ade887b9268403388543291f636629f~tplv-k3u1fbpfcp-watermark.image)

### HMR —— 模块热替换

Parcel也是和webpack一样支持HMR热替换的
1. 在`main.js`中写

```js
import foo from './foo'

foo.bar()

if (module.hot) {
  // 注意：这里有些不一样
  // webpack的支持两个参数指定某个模块执行更新之后的逻辑
  // parcel只支持一个参数，当前模块及当前模块依赖的模块更新后会执行逻辑
  module.hot.accept(() => {
    console.log('hmr')
  })
}
```

2. 浏览器中修改些文字，在`foo.js`中修改代码，可以看到浏览器中的文字没有刷新，但是控制台刷新了新的代码。

```js
export default {
  bar: () => {
    console.log("hello1")
  }
}
```

### 自动安装依赖
我们在开发的时候，如果需要第三方模块，就需要先关闭`dev-server`，去安装第三方模块，安装完成之后再启动`dev-server`，就比较麻烦。

这里可以不需要停止`dev-server`就可以使用。
1. 在模块中引用`jquery`

```js
// main.js
import $ from 'jquery'

$(document.body).append('<h1>hello~</h1>')
```
2. 可以看到保存之后parcel会自动安装依赖

### 零配置支持其他类型资源模块
使用Parcel不需要引入loader或者plugins就可以支持其他类型资源模块。

1. 在`src/`中添加一个`style.css`文件

```css
body {
    background-color: yellow;
}
```
​
2. 在`main.js`中引入，保存之后样式可以立即生效
```js
import './style.css'
```
​
3. 在`src`中导入一张图片，在`main.js`中引入，保存之后图片也会立即显示。
​
```js
import logo from './zce.png'
```
​
### 支持动态导入之后自动分包
​
1. 将`jquery`改为动态导入
​
```js
import('jquery').then($ => {
  $(document.body).append('<h1>hello~</h1>')
  const img = $('<img>').attr('src', icon)
  $(document.body).append(img)
})
```
2. 可以看到浏览器中会jquery进行了单独打包。
​
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1d90405ba864b53bba5dad075a72a42~tplv-k3u1fbpfcp-watermark.image)
​
## 生产模式运行打包
​
很简单，在命令行后面添加一个`build`，后面跟着入口文件的路径即可。
​
> `npm run parcel build src/index.html`
​
可以看到dist目录下，代码都进行了压缩，而且css代码也单个进行了提取，自动生成了source map
​
> PS: 相同体量项目下，`parcel`的打包速度比`webpack`快很多，因为`parcel`内部使用的是多进程同时去工作，充分发挥了多核`CPU`的性能，`webpack`中可以使用`happypack`插件来实现。
​
​
Parcel使用下来很舒服，不需要我们额外的进行很多配置，自动的帮我们处理了很多的事情。
​
