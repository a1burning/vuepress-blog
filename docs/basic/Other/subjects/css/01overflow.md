---
title: 清除浮动所有方法总结
tags: 
  - CSS
date: 2017-05-23
sidebarDepth: 5
---
## 为什么要清除浮动？
一开始`css`的浮动，其本质是用来做一些文字混排效果的，但是后来被我们拿来做布局用，就出现了很多问题。

> **清除浮动的本质：**
> 为解决父级元素因为子级浮动引起高度为0的问题

我们很多时候不方便给父盒子的高度，因为我们不清除有多少子盒子，有多少内容。经常的做法会让内容撑开父盒子的高度。
但是如果父盒子中有子盒子浮动了之后，就会影响到后面的盒子，因为浮动元素脱离了标准流。会把后面还在标准流的盒子覆盖，解决这个问题的方法就要**清除浮动** 

**原理图**

![float.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d54b44c047494fbb9b53f023d99b9b1d~tplv-k3u1fbpfcp-zoom-1.image)



## 如何清除浮动？
清除浮动其实叫做 **闭合浮动** 更合适，因为是把浮动的元素圈起来，让父元素闭合出口和入口不让他们出来影响其他的元素。
在`CSS`中，`clear`属性用于清除浮动，其基本语法格式如下：
```css
选择器 { clear : 属性值 ; }
/*属性值为left,清除左侧浮动的影响
  属性值为right,清除右侧浮动的影响
  属性值为both,同时清除左右两侧浮动的影响*/
```

### 1. 额外标签法
#### 1.1 末尾标签法
通过在浮动元素的末尾添加一个空的标签。这是`W3C`推荐的做法，虽然比较简单，但是添加了无意义的标签，结构化比较差，所以不推荐使用。下面三种写法都适用：
```html
<!--写法一：直接用style-->
<div style="clear:both"></div>

<!--写法二：使用clear类-->
<style>
.clear { clear:both }
</style>
<div class="clear"></div>

<!--写法三：可以使用br等别的块级元素来清除浮动-->
<style>
.clear { clear:both }
</style>
<br class="clear" />
```

#### 1.2 内部标签法
把`div`放进父盒子里，这样盒子会撑开，一般也不会用。

### 2. overflow 
给父级元素添加`overflow`样式方法。

这种方法代码比较简洁，可以通过触发`BFC`方式，但是因为本身`overflow`的本质是 **溢出隐藏** 的效果，所以有的时候也会有一些问题存在，比如内容增多的时候不会自动换行导致内容被隐藏掉，无法显示出要溢出的元素。
```css
.father {
      overflow: auto;  
    /* 加上这句话，就可以清除浮动   overflow = hidden|auto|scroll 都可以实现*/
  }
```

### 3. 伪元素法（最常用）
#### 3.1 使用after伪元素清除浮动
`after`是在父元素中加一个盒子，这个元素是通过`css`添加上去的，符合闭合浮动思想，结构语义化正确。
父元素中加一个类名为`clearfix` 。但是这个方法`IE6-IE7`不识别，要进行兼容，使用`zoom:1`触发`hasLayout`来清除浮动

> 代表网站：百度、淘宝、网易等

```css
.clearfix:after{
    content:".";  /*尽量不要为空，一般写一个点*/
    height:0;     /*盒子高度为0，看不见*/
    display:block;    /*插入伪元素是行内元素，要转化为块级元素*/
    visibility:hidden;      /*content有内容，将元素隐藏*/
    clear:both;  
}

.clearfix {
    *zoom: 1;   /*  *只有IE6,7识别 */
}
```

#### 3.2 after伪元素空余字符法
父元素中加一个类名为`clearfix`，也需要兼容`IE6-IE7`

>在Unicode字符里有一个“零宽度空格”，即U+200B，代替“.”，可以减少代码量，不再使用visibility:hidden
>
> 代表网站：阿里巴巴

```css
.clearfix::after{
    content:"\200B";   /* content:'\0200'; 也可以 */
    display:block;
    height:0;
    clear:both;
}

.clearfix {
    *zoom: 1; 
}
```
#### 3.3 使用before和after双伪元素清除浮动（推荐）
这种方法完全符合闭合浮动思想。给父元素加一个类名为`clearfi`x,需要兼容`IE6-IE7`

> 代表网站：小米、腾讯

```css
 .clearfix:before, .clearfix:after {
        content: ""; 
        display: table;
    }
    .clearfix:after {
        clear: both;
    }
    .clearfix {
        *zoom: 1;
    }
```
## 三种方法总结

css清除浮动方法 | 额外标签法 | overflow | 伪元素法
---|---|---|---
优点 | 写法简单，兼容性好 | 写法简单，兼容性好 | 符合闭合浮动思想，结构语义化正确，可以解决问题
缺点 | 添加了无意义的标签，结构化比较差 | overflow的本质是 溢出隐藏，超出元素无法显示 | 写法复杂，需要兼容


