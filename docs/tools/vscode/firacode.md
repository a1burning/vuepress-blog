---
title: VSCode中使用Fira Code字体
tags: 
  - VSCode
  - Fira Code
  - tools
sidebarDepth: 5
---
# VSCode中使用Fira Code字体

## 下载字体
[github-FiraCode](https://github.com/tonsky/FiraCode)
下载压缩包zip -> 解压 -> distr -> 目录下面的字体全部安装，windows应该安装ttf就可以

## VSCode中设置
设置 -> font -> `Editor:Font Ligatures` 在`setting.json`中编辑 -> 末尾添加者两个之后重启即可
```bash
"editor.fontFamily": "Fira Code",
"editor.fontLigatures": true
```
## 效果
![全等.png](https://upload-images.jianshu.io/upload_images/6100773-541b7cb0ce20d753.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![arrow.png](https://upload-images.jianshu.io/upload_images/6100773-72d5951e9cd2a461.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 参考
下面的图片是我从知乎上copy来的，为了自己看方便，勿喷！
![参考图](https://upload-images.jianshu.io/upload_images/6100773-9e21ed06ba594641.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


<Vssue :options="{ locale: 'zh' }"/>