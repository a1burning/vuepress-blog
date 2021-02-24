---
title: Parcel —— 零配置的模块打包工具
tags: 
  - parcel
  - hmr
sidebarDepth: 5
---
# Parcel —— 零配置的模块打包工具

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
