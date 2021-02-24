---
title: nrm——管理npm源不再繁琐
tags: 
  - npm
  - node
  - nrm
  - tools
sidebarDepth: 5
---
# nrm——管理npm源不再繁琐

不知道你们每次怎么更换`npm`源的，我每次都要百度一下，那一大串网址我是记不住。来回切换更是费劲，直到同事推荐给了我这个，觉得甚是好用，网上找了教程，记个笔记。
## 什么是nrm？
`nrm`——`npm`的镜像源管理工具
## nrm有什么特点？
专门管理镜像源，可以一个命令直接切换，直接操作别名，管理起来不要太简单。我们有些资源通过外网下载资源速度慢，切换淘宝源，下载资源非常的快，但是有些还必须要`npm`源下载，来回切换不要太麻烦。

[npm nrm](https://www.npmjs.com/package/nrm)

## 如何安装？
so easy！！
```bash
npm i nrm -g
```
## 如何使用？
### 查——浏览所有配置的镜像源
这几个是默认的镜像源，还可以添加自己的
```bash
nrm ls
#* npm -------- https://registry.npmjs.org/
#  yarn ------- https://registry.yarnpkg.com/
#  cnpm ------- http://r.cnpmjs.org/
#  taobao ----- https://registry.npm.taobao.org/
#  nj --------- https://registry.nodejitsu.com/
#  npmMirror -- https://skimdb.npmjs.com/registry/
#  edunpm ----- http://registry.enpmjs.org/
```
### 切——切换不同的镜像源
`use`后面直接加别名即可
```bash
nrm use taobao
```
检查一下
```bash
nrm ls
#  npm -------- https://registry.npmjs.org/
#  yarn ------- https://registry.yarnpkg.com/
#  cnpm ------- http://r.cnpmjs.org/
#* taobao ----- https://registry.npm.taobao.org/
#  nj --------- https://registry.nodejitsu.com/
#  npmMirror -- https://skimdb.npmjs.com/registry/
#  edunpm ----- http://registry.enpmjs.org/
```
### 增——添加私有的镜像源
格式：`nrm add 别名 网址`
```bash
nrm add haha http://haha.com
# add registry haha success
```
检查一下，在最后面加上了haha的源
```bash
nrm ls
#  npm -------- https://registry.npmjs.org/
#  yarn ------- https://registry.yarnpkg.com/
#  cnpm ------- http://r.cnpmjs.org/
#* taobao ----- https://registry.npm.taobao.org/
#  nj --------- https://registry.nodejitsu.com/
#  npmMirror -- https://skimdb.npmjs.com/registry/
#  edunpm ----- http://registry.enpmjs.org/
#  haha ------- http://haha.com/
```
### 删——删除不需要的镜像源
格式：`nrm del 别名`
```bash
nrm del haha
# delete registry haha success
```
### 测——可以测试不同镜像源的速度
格式：`nrm test 别名`
果然淘宝的还是很快的
```bash
nrm test taobao
# * taobao - 216ms
nrm test npm
# npm ---- 910ms
nrm test cnpm
# cnpm --- 1906ms
```

