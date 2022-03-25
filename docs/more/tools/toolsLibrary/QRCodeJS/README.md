---
title: QRCode.js生成二维码插件
tags: 
  - Tools
date: 2018-11-22
sidebarDepth: 5
---
# QRCode.js生成二维码插件

本文用于推荐一款很好用的二维码生成插件QRCode.js，测试使用方便且简单。
其实官方就有很好的文档，这里只是做一个我工作的记录和总结。

## 介绍
- 这个插件主要使用canvas实现的。
- 原生代码不需要依赖jquery，或者zepto。
- 兼容性也很好，IE6~10, Chrome, Firefox, Safari, Opera, Mobile Safari, Android, Windows Mobile, ETC.
- [前端开发者仓库官网](http://code.ciaoca.com/javascript/qrcode/)
- [GitHub地址](https://github.com/davidshimjs/qrcodejs)

## 使用
### 1.引入js文件
```html
<script src="qrcode.js"></script>
```

### 2.定义承载二维码标签
```html
<div id="qrcode"></div>
```

### 3.js调用
#### 简单调用
```js
new QRCode(document.getElementById('qrcode'), 'your content');
```

#### 设置参数调用
下面会有参数详解
```js
var qrcode = new QRCode('qrcode', {
    text: 'your content',
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
});
```

### 4.页面预览
这样就很简单的生成了一个二维码
![qrcode.jpg](https://user-gold-cdn.xitu.io/2018/11/22/1673bb0b207e6c91?w=278&h=271&f=jpeg&s=15536)

## 参数API
### QRCode参数
```js
new QRCode(element, option)
```
|    名称  |   默认值   |   说明   |
|:----:| :----: | :----: |
|   element   |   -   |  承载二维码的DOM元素的ID    |
|   option   |   -   |   参数设置   |

#### Option参数
|    名称  |   默认值   |   说明   | 备注 |
|:----:| :----: | :----: | :----:|
|   text   |   -   |  二维码承载的信息  | 如果是string那没有什么好说的。<br/>如果是url的话，为了微信和QQ可以识别，连接中的中文使用encodeURIComponent进行编码|
|   width  |   256   |   二维码宽度   | 单位像素（百分比不行）|
|   height  |   256   |   二维码高度   | 单位像素（百分比不行）|
|   colorDark  |   '#000000'  |   二维码前景色   | 英文\十六进制\rgb\rgba\transparent都可以|
|   colorLight  |   '#ffffff'  |   二维码背景色   | 英文\十六进制\rgb\rgba\transparent都可以|
|   correctLevel  |   QRCode.CorrectLevel.L  |   容错级别   | 由低到高<br/>QRCode.CorrectLevel.L<br/>QRCode.CorrectLevel.M<br/>QRCode.CorrectLevel.Q<br/>QRCode.CorrectLevel.H|


#### API接口
|    名称  |   参数   |   说明   |  使用
|:----:| :----: | :----: | :----:|
|   clear |   -   |  清除二维码    |  qrcode.clear()
|   makeCode  |   string   |   替换二维码（参数里面是新的二维码内容）   |  qrcode.makeCode('new content')

```js
var qrcode = new QRCode('qrcode',{
    'text':'content',
    'width':256,
    'height':256,
    'colorDark':'red',
    'colorLoght':'transparent',
    'correctLevel':QRCode.CorrectLevel.H
})


qrcode.clear();
qrcode.madkCode('new content');
```

## 实践
### 生成二维码，微信QQ识别打开网页
#### 需求
- 前端根据传的不同的参数，在页面生成一个二维码
- 由端分享到QQ、QQ空间、微信、朋友圈的时候，截屏成图片
- 长按图片，识别其中的二维码，打开网页链接。

#### 思路
- 和端交互的网页a.html后面加query参数，如：`http://www.test.html/a.html?code=123`
- a.html中调用QRCode.js生成一个二维码，二维码中的信息是`http://www.test.html/b.html?code=123`
- 分享出去的页面是截屏是a.html的，识别图中的二维码打开b.html

#### 实现
由于很简单，所以就不贴代码了。

#### 注意
>如果传的是url，但是打开的时候只是一堆字符串让手动复制，那么说明url的地址不正确。
如果是微信，传的url的地址中有中文是可以识别的，但是在QQ中是不行的
所以其中的中文要进行encodeURIComponent编码，但是不要整体都编码，只是中文的部分编码即可。

