---
title: background-size总结及兼容解决
tags: 
  - CSS
date: 2019-01-15
sidebarDepth: 5
---
## 定义
`background-size` 属性是规定了背景图像的尺寸，是 **`css3`的属性** 。

## css语法
> background-size: length | percentage | cover | contain;
> 


background-size | param1 | param2 | 效果图 |
:---:|:---:|:---:|:---:|
**length**<br/>(单位px/rem/em，不可为负值) | 160px(宽度) | 160px(高度)<br/>[default:auto(如果宽度固定，高度auto，图片是等比缩放的)] | ![160px.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea608b7876bf45909bcea183c1ed38f9~tplv-k3u1fbpfcp-zoom-1.image)
**percentage**<br/>(以父元素的百分比来设置背景图像的宽高，，不可为负值) | 70%(宽度) | 80%(高度)<br/>[default:auto(如果宽度固定百分比，高度auto，图片是等比缩放的，图片完全显示在盒子里)] | ![70%.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cd06a9959984576af315dc014fb41d6~tplv-k3u1fbpfcp-zoom-1.image)
**cover** | 背景图成比例，按照最小边进行适配，多余的裁切 | -  |![cover.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00dfbcbdbaa0494fa84846177cb719c1~tplv-k3u1fbpfcp-zoom-1.image)
**contain** | 背景成比例，按照最大边进行适配，图片完全显示在盒子里，少的部分出现白边 | -  |![contain.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16c59b15abe142589f7c969bbdd7fdab~tplv-k3u1fbpfcp-zoom-1.image)


## DOM原生语法
```js
DOMObj.style.backgroundSize="60px 80px"
```

## jQuery语法
```js
jQObj.css("background-size","60px 80px");
jQObj.css("backgroundSize","60px 80px");
```
## 兼容问题
一张图看懂咯。
`IE9+`、`Firefox 4+`、`Opera`、`Chrome` 以及 `Safari 7+` 支持 `background-size` 属性。
![canIuse.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80a395b5dde3498285a83966a0cdbea0~tplv-k3u1fbpfcp-zoom-1.image)

> `NOTICE:`
> 
> 上述可以看出来一般是不需要加私有前缀的，但是为了兼容性需要可以加上
>
>（因为很多低端手机或者刷过机的低版本，即使版本在安卓4.4+，也可能不支持简写`╮(╯﹏╰)╭`）。

```css
.test{
    background: url("./yw.png") no-repeat;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
}
```

### 移动端
#### 4.4- Android手机不支持css3的background简写
低版本安卓手机，官方说`4.3`以下的不支持，但是测有一些比较低端的`4.4`版本的也不支持`css3`的`background`简写，但是支持`css2.1`的简写。简写的形式，在`postCSS`处理的时候，并不会处理`background`的简写形式，把他们拆解开，所以如果要兼容低端机型最好放弃简写形式，或者在简写之后单独补上`background-size`的处理。

**实验的手机：**
- 魅蓝m1，`Android`版本`4.4.4`
- 小米2A，`Android`版本`4.2.2`

```css
/*可以的css*/
    .test{
        background: url("./yw.png") no-repeat;
        background-size: 100% auto;
    }
    .test{
        background-image: url("./yw.png");
        background-repeat:no-repeat;
        background-size: 100% auto;
    }

/*不可以的css*/
    /*情况1，css3简写*/
    .test{
        background: url("./yw.png") top/100% no-repeat;
    }
    /*情况2，background-size少auto*/
    .test{
        background: url("./yw.png") no-repeat;
        background-size: 100%; /*第二个参数默认不是auto，必须要写*/
    }
```
#### iOS Safari的可以忽略?
关于`Can I use`上所说的:

>iOS Safari has buggy behavior with background-size: cover;

测试了`iphone4s`——版本`9.3.5`和`iphone5`——版本`10.2`均没有问题。
我实在找不出比这个还低端的机子了￣へ￣，可能这个问题只有`6以下`的版本会有，所以可以忽略。`ヽ(ﾟ∀ﾟ)ﾒ(ﾟ∀ﾟ)ﾉ `

### pc端

#### polyfill for IE6-IE8
##### 使用滤镜
使用`div`的宽高控制背景的宽高，让图片全部适应到边框中，（类似于`100% 100%`）。
```css
.test{
    width:600px; 
    height:400px;
    background: url("./yw.png") no-repeat;
    background-size: 100%;
    /*针对IE8的hack，目的是除掉之前background*/
    background: none\9;
    /*设置css滤镜*/
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='./yw.png', sizingMethod='scale');
}
```
![iescale.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac83958da78f4460909791c39f23ab4e~tplv-k3u1fbpfcp-zoom-1.image)


如果`filter`里面的`sizingMethod`弄成`crop`，则只是单纯的裁剪，对背景图片的大小没有影响。

![iecrop.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a36690b7431f4d9da2bbfc36abb33627~tplv-k3u1fbpfcp-zoom-1.image)


`filter`相关参数说明：
>filter : progid:DXImageTransform.Microsoft.AlphaImageLoader ( enabled=bEnabled , sizingMethod=sSize , src=sURL )
>
>**enabled**：可选项。布尔值(Boolean)。设置或检索滤镜是否激活。 true：默认值。滤镜激活。 false：滤镜被禁止。
>
>**sizingMethod**：可选项。字符串(String)。设置或检索滤镜作用的对象的图片在对象容器边界内的显示方式:
>
>   1.**crop**：剪切图片以适应对象尺寸。
>
>   2.**image**：默认值。增大或减小对象的尺寸边界以适应图片的尺寸。（目前无用）
>
>   3.**scale**：缩放图片以适应对象的尺寸边界。
>
>**src**：必选项。字符串(String)。使用绝对或相对url，地址指定背景图像。假如忽略此参数，滤镜将不会作用。

##### background-size-polyfill
- [gitHub官方关于兼容IE7-8的background-size-polyfill](https://github.com/louisremi/background-size-polyfill)

## 最佳实践
总结那么多，其实是根据自己具体的情况去看需不需要做兼容的。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3690b927483e4ce693f1aa6b8e8d832d~tplv-k3u1fbpfcp-watermark.image)
