---
title: nodemon —— Node服务自动重启实时刷新
tags: 
  - node
  - tools
  - nodemon
sidebarDepth: 5
---
# nodemon —— Node服务自动重启实时刷新

`nodemon`作用就是实时更新，不用每次都运行一个`node <filename>`了
## 起步
- [github-nodemon](https://github.com/remy/nodemon)
- [npm-nodemon](https://www.npmjs.com/package/nodemon)
```bash
npm i -g nodemon
```
## 使用
```bash
nodemon <filename>
```
举个例子：
```js
// 00.js
console.log("test")
```
```bash
nodemon .\00-parpare.js

# [nodemon] 2.0.4
# [nodemon] to restart at any time, enter `rs`
# [nodemon] watching path(s): *.*
# [nodemon] watching extensions: js,mjs,json
# [nodemon] starting `node .\00-parpare.js`
# test    ------>输出结果
```
修改00.js，无需重启
```js
console.log("test123")
```
```bash
# [nodemon] clean exit - waiting for changes before restart
# [nodemon] restarting due to changes...
# [nodemon] starting `node .\00-parpare.js`
# test123   ------>输出结果
# [nodemon] clean exit - waiting for changes before restart
```

<Vssue :options="{ locale: 'zh' }"/>