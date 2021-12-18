---
title: FIS
tags: 
  - 前端工程化
  - FIS
date: 2020-12-26
prev: false
next: ./02smarty.md
sidebarDepth: 5
---
# FIS

之前工作一直用到`FIS`，`FIS2`和`FIS3`都有用过，现在只是把学习笔记放上来，因为手中实践的东西较多，之后有时间会进行下一步的整理。
## FIS介绍
`FIS`是百度的前端团队出款的一种构建系统，`FIS`现在也基本没有团队维护了，但是我们还需要了解一下他。相比于`grunt`和`gulp`，`FIS`的核心特点是**高度集成**。

他把前端日常开发中常见的开发任务和构建任务都集成在了内部，这样开发者可以通过简单的配置文件的方式去配置我们构建过程需要的工作。我们不需要在`FIS`中像`grunt`和`gulp`一样定义任务，`FIS`中有一些内置任务，内置任务会根据开发过程自动完成构建任务。`FIS`中也有用于调试的`web-server`，可以很方便的调试构建结果。

## FIS3初体验 —— 发布文件
1. 下载项目目录 [fis-demo-temp](https://github.com/a1burning/demofiles/tree/master/fis-demo-temp)，安装依赖`npm install -g fis3`
2. 使用`fis3 release`可以把项目发布到一个临时目录中`C:/Users/Administrator/AppData/Local/.fis3-tmp/www`，这个使用`fis3 server open`就可以打开服务的默认地址
3. 我们可以指定目录发布的地址`fis3 release -d output`，发布到根目录下面的`output`文件夹中。

> **资源定位**：`release`的发布会让我们引用文件的相对路径转化成绝对路径，从而实现资源定位，是**FIS中的核心特性**。
>
> **作用**： 是让我们从开发的资源路径彻底与部署之间的路径分离开来，前端人员不用关心部署上线的目录结构，我们只需要在开发阶段使用相对路径引用资源，通过fis构建之后的结果会自动将资源文件的引用路径变成绝对路径。

4. 如果要有部署的配置，需要创建`fis-conf.js`文件
5. 我们要把静态资源文件放到`assets`目录下，需要这样配置

```js
// fis的match方法是匹配对应文件，第一个参数是匹配规则，这里面试文件夹下面的所有js,scss,png文件
// 第二个参数是对应的配置
fis.match('*.{js,scss,png}', {
  // release是发布目录
  // $0 指的是原始文件目录结构
  release: '/assets/$0'
})
```

6. 运行`fis3 release -d output`可以看到目录结构发生了变化

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b662c5539db41dab33f2914f6f3dee8~tplv-k3u1fbpfcp-watermark.image)

里面的引用资源也变成了绝对定位

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e1eecb62c9e4912a875ddbaae714d9b~tplv-k3u1fbpfcp-watermark.image)

## FIS编译与压缩
### sass文件编译
1. 安装插件`npm i fis-parser-node-sass`
2. 在`fis-conf.js`中写

```js
fis.match('*.{js,scss,png}', {
  release: '/assets/$0'
})

fis.match('**/*.scss', {
  // 修改scss扩展名为css
  rExt: '.css',
  // 使用插件fis-parser-node-sass，前面的不用写
  parser: fis.plugin('node-sass')
})
```
3. 在命令行中执行`fis3 release -d output`可以看到，sass文件已经被转换成css文件，在index.html的引用也变成了css

### js文件编译
1. 安装插件`npm i fis-parser-babel-6.x`
2. 在`fis-conf.js`中写

```js
fis.match('*.{js,scss,png}', {
  release: '/assets/$0'
})

fis.match('**/*.js', {
  // 目前只有6.x版本，现在babel已经更新到7.x了
  parser: fis.plugin('babel-6.x')
})
```
3. 在命令行中执行`fis3 release -d output`可以看到，js文件已经被编译了

### 文件压缩
1. 因为`css`和`js`压缩是`fis`内置插件，所以直接在`fis-conf.js`中写

```js
fis.match('*.{js,scss,png}', {
  release: '/assets/$0'
})

fis.match('**/*.scss', {
  rExt: '.css',
  parser: fis.plugin('node-sass'),
  // fis内置css压缩插件
  optimizer: fis.plugin('clean-css')
})

fis.match('**/*.js', {
  parser: fis.plugin('babel-6.x'),
  // fis内置js压缩插件
  optimizer: fis.plugin('uglify-js')
})
```

## 调试
使用`fis3 inspect`命令可以看到对哪些文件进行了操作
```bash
fis3 inspect

# [INFO] Currently running fis3 (C:\Users\huqi\AppData\Roaming\npm\node_modules\fis3\)

# ~ /css/style.scss
# -- release /assets/css/style.css `*.{js,scss,png}`   (0th)
# -- rExt .css `**/*.scss`   (1th)
# -- parser [plugin `node-sass`] `**/*.scss`   (1th)
# -- optimizer [plugin `clean-css`] `**/*.scss`   (1th)


# ~ /dist/fis-conf.dev.js
# -- release /assets/dist/fis-conf.dev.js `*.{js,scss,png}`   (0th)
# -- parser [plugin `babel-6.x`] `**/*.js`   (2th)
# -- optimizer [plugin `uglify-js`] `**/*.js`   (2th)


# ~ /img/icon.png
# -- release /assets/img/icon.png `*.{js,scss,png}`   (0th)


# ~ /index.html
# -- empty

# ~ /js/app.js
# -- release /assets/js/app.js `*.{js,scss,png}`   (0th)
# -- parser [plugin `babel-6.x`] `**/*.js`   (2th)
# -- optimizer [plugin `uglify-js`] `**/*.js`   (2th)


# ~ /package-lock.json
# -- empty

# ~ ::package
# -- empty

# ~  plugin check
# installed plugins:
#  fis-parser-node-sass
#  fis-parser-babel-6.x
#  fis-optimizer-clean-css
#  fis-optimizer-uglify-js

# no more plugin are needed
```

