---
title: nvm——node版本管理
tags: 
  - node
  - nvm
  - tools
sidebarDepth: 5
---
# nvm——node版本管理

## nvm是什么？
`node`版本管理工具，可以在同一台电脑上安装多个不同的`node`版本，并且随意切换。
## 下载
这个是安装`windows`版本

[nvm-gitHub下载地址](https://github.com/coreybutler/nvm-windows/releases) 其中，可以看到
- `nvm-noinstall.zip`：绿色免安装版，但使用时需进行配置。
- `nvm-setup.zip`：安装版，推荐使用


## 安装
> 注意，在安装之前需要先卸载`nodejs`

下载到本地之后进行安装，一路`next`之后完成安装

## 检验
在命令行中写`nvm`看是否能正常运行
![nvm](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe15119e2a0845749a5e36eea94a754f~tplv-k3u1fbpfcp-zoom-1.image)

## 命令
- nvm version —— 查看当前nvm版本
- nvm install 12.19.0 —— 安装指定node版本
- nvm ls —— 查看所有安装的node版本
- nvm use 12.10.0 —— 切换到指定node版本
- nvm uninstall 12.10.0 —— 卸载指定node版本
- nvm root —— 展示当前nvm安装根目录
- nvm root <path> —— 设置nvm安装根目录

## 安装问题
### use之后版本切换不过来
如果遇到`use`之后版本切换不过来，原因大概是，安装`nvm`之前需要先卸载`node.js`，再安装`nvm`。

**解决方案**：卸载当前`node.js`，用`nvm`切换试一下

<Vssue :options="{ locale: 'zh' }"/>