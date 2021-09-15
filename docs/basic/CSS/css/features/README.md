---
title: css的三大特性(层叠、继承、优先级)
tags: 
  - CSS
date: 2018-05-15
sidebarDepth: 5
---
## 层叠性

`CSS(Cascading Style Sheets)`又称为层叠样式表，所以这个第一个特性就是层叠性。

要说层叠性就要先明确一个定义：**样式冲突** 。因为层叠性就是解决样式冲突的问题的。

> **样式冲突**：是指一个标签指定了相同样式同值的情况。一般情况，如果出现样式冲突，会按照**书写顺序最后的为准** 。

### 原理

这种特性的原理与浏览器的渲染原理有关:

一般打开网页，会先下载文档内容，加载头部的样式资源，然后按照从上而下，自外而内的顺序渲染`DOM`内容。

**所以在运行的过程中，上面的样式先执行，下面的样式元素会将上面的层叠掉** 。

### DEMO

下面看一个小例子：

一个`div`，在`head`标签里面添加这个样式

```html
<style>
  div{
    width: 300px;
    height: 150px;
    background-color: red;
    background-color: blueviolet;
    color:pink;
    color:#fff;
    font-size: 30px;
    font-size: 20px;
    text-align: center;
    text-align: right;
  }
  div{
    color:yellow;
  }
</style>
```

然后会显示什么呢？

![css1.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e6c9dbce5a5479fbfdbf5a96ae57304~tplv-k3u1fbpfcp-zoom-1.image)


可能到这里显示的不是很明白，那么`F12`审查元素看一下：

![cssstyle.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd5e357ad0ee40c09e9449c291c5de10~tplv-k3u1fbpfcp-zoom-1.image)

> **结论** :无论在同一个`div`中还是在不同的`div`中，后面的样式将前面的层叠掉了，所以这就是`css`的层叠性。

## 继承性
**继承性** 是指书写`css`样式表时，子标签会继承父标签的某些样式，有一些样式是具有继承性的，想要设置一个可继承的属性，只需将它应用于父元素即可。

### 优缺点

| 优点 | 缺点 |
| --- | --- |
| 继承可以简化代码，降低`css`样式的复杂性。 | 如果在网页中所有的元素都大量使用继承样式，那么判断样式的来源就会很困难。 |


### 哪些样式可以继承？

并不是所有的`css`属性都可以继承，对于 **字体、文本属性等网页中通用的样式** 可以使用继承。例如：字体、字号、颜色、行距等可以在`body`元素中统一设置，然后通过继承影响文档中所有文本。而有一些属性就不具有继承性：边框、外边距、内边距、背景、定位、元素高属性。

| 可继承的（字体、文本属性等） | 不可继承的 |
| --- | --- |
| 颜色、font-开头、text-开头、line-开头的、white-space | 边框、外边距、内边距、背景、定位、高度 |
|  | 浮动 |

下面来试验一下下，第一行的来个大锅烩看看：

### DEMO

#### html代码

```html
<div class="father">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈
  <p>呵呵</p>
  <span>嘻嘻</span>
  <div class="son">嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿黑嘿嘿<p>哦~</p></div>
</div>
```

#### css代码

```css
.father{
  width: 300px;
  height: 200px;
  font-size: 20px;
  font-weight: 700;
  text-align: right;
  text-decoration: underline;
  line-height: 20px;
  background-color: green;
  color:greenyellow;
  margin: 5px;
  padding: 5px;
  position: relative;
}
.son{
  width: 90%;
  background-color: darkorange;
  position: absolute;
  bottom: 0;
  left: 0;
  color:#fff;
}
```

效果是什么呢？

![inherited.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb1e610b85f44fc995db577a7d4b50d2~tplv-k3u1fbpfcp-zoom-1.image)



> **分析：**
> 
> 用`F12`审查元素一下看看最里面的`<p>`，其中`<p>`的`color`属性继承自父亲`.son`
> 
> `font-size\font-weight\text-align\line-height\white-space`继承自`.son`的父亲`.father`
> 
> 可以看到下面继承的元素显示的颜色比较深，没有继承的元素灰掉

![inherited1.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a868fb64b50470999cdec936502f401~tplv-k3u1fbpfcp-zoom-1.image)


## 优先级

定义`css`样式时，经常出现两个或更多规则应用在同一元素上，这时就会出现优先级的问题。

### css特殊性（权重Specificity）

关于`css`权重，我们需要一套计算公式去计算，这就是`css`特性。

| 元素 | 贡献值 |
| --- | --- |
| 继承、* | 0，0，0，0 |
| 每个标签 | 0，0，0，1 |
| 类、伪类 | 0，0，1，0 |
| ID | 0，1，0，0 |
| 行内样式 | 1，0，0，0 |
| !important | 无穷大 |
| max-height、max-width覆盖width、height | 大于无穷大 |
| min-height、min-width | 大于max-height、max-width |


### 计算规则

> 1.  遇到有贡献值的就进行**累加**，例如：
>     - `div ul li ---> 0,0,0,3`
>     - `.nav ul li ---> 0,0,1,2`
>     - `a:hover ---> 0,0,1,1`
>     - `.nav a ---> 0,0,1,1`
>     - `#nav p ---> 0,1,0,1`
> 2.  **数位的进位是256，不满足就不会有进位：**<br/>
>     `0,0,0,5 + 0,0,0,5 = 0,0,0,10` 而不是`0,0,1,0`，所以**不会存在`10`个`div`能赶上一个类选择器的情况** ，但是`256`个`div`的话，就不一定了.
> 3.  **权重不会继承**，所以父元素的权重再高也和子元素没有关系
> 4.  如果有`!important`那么相加的那些无论多高就不管用
> 5.  如果有`max-height/max-width`那么`!important`不管用，如果同时有`min-height/min-width`和 `max-height/max-width`，那么`max-height/max-width`的不管用。

### 总结

> 权重由高到低排序
> `min-height/min-width` > `max-height/max-width` > `!important` > 行内样式 > ID选择器 > 类选择器、属性选择器、伪元素和伪类选择器 > 元素选择器 > 通用选择器 > 继承样式

1.  使用了`!important`声明的规则；

2.  内嵌在`HTML`元素的`style`属性里面的声明；

3.  使用了`ID`选择器的规则

4.  使用了类选择器、属性选择器、伪元素和伪类选择器的规则

5.  使用过了元素选择器的规则

6.  只包含一个通用选择器的规则

7.  继承自父元素的样式优先级是最低的

### 面试宝典

> 1.  先找到影响文字的最里面的盒子
> 2.  然后计算权重
> 3.  如果权重一样，看层叠性

### DEMO
#### 特殊标签的样式需要通过样式层叠覆盖
1.  给`body`指定样式，`a`标签和`h`标签都不会改变

```html
<!--css代码-->
<style>
  body{
    font-size: 20px;
  }
</style>

<!--html代码-->
<body>
  <div>正常文本</div>
  <div>正常文本</div>
  <div>正常文本</div>
  <p>正常文本</p>
  <p>正常文本</p>
  <p>正常文本</p>
  <p>正常文本</p>
  <a href="#">连接文本</a>
  <a href="#">连接文本</a>
  <a href="#">连接文本</a>
  <h1>标题名称</h1>
  <h1>标题名称</h1>
  <h1>标题名称</h1>
</body>
```
效果：

![demo1.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/697a038781fc4f398b918e749bf62d11~tplv-k3u1fbpfcp-zoom-1.image)


因为`a`标签和`h`标签都是特殊的标签，都有自己的样式，要想改变，就应该在其元素中定义将元素的样式层叠掉。

```css
body{
  font-size: 20px;
}
a{
  color: #000;
  text-decoration: none;
  font-size: 20px;
}
h1{
  font-size: 20px;
  font-weight: 400;
}
```

效果：

![demo2.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4ca77cf01784db38a83a6c1cebe6cb5~tplv-k3u1fbpfcp-zoom-1.image)


#### 面试题一
```html
<div id="father" class="c1">
  <p id="son" class="c2">
    试问这行文字是什么颜色？
  </p>
</div>

<style type="text/css">
  #father #son{  /*0,2,0,0*/
    color:blue;
  }
  
  #father p.c2{  /*0,1,1,1*/
    color:black;
  }
  
  div.c1 p.c2{  /*0,0,2,2*/
    color:red;
  } 
  
  #father{  /*0,0,0,0*/
    color:green!important;
  }
</style>

<!--字体颜色是蓝色-->
```

#### 面试题二

```html
<style type="text/css">
  #father{  /*0,1,0,0*/
    color:red;
  }
  
  p{  /*0,0,0,0*/
    color:blue;
  }
</style>

<div id="father">
  <p>
    字体颜色是什么？
  </p>
</div>

<!--字体颜色是蓝色-->
```

#### 面试题三（权重一样，层叠性就有用了）

```html
<div id="box1" class="c1">
  <div id="box2" class="c2">
    <div id="box3" class="c3">
      文字
    </div>
  </div>
</div>

<style type="text/css">
  .c1 .c2 div{  /*0,0,2,1*/
    color:blue;
  }
  
  div #box3{  /*0,1,0,1*/
    color:green;
  }
  
  #box1 div{  /*0,1,0,1*/
    color:yellow;
  }
</style>

<!--字体颜色是黄色-->
```

#### max-width覆盖width

```css
div{
  width: 480px!important;
  height: 300px;
  background-color: blueviolet;
  max-width: 200px;
}

<div></div>
```
![demo3.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f95bedefae34390a8be25477cc048eb~tplv-k3u1fbpfcp-zoom-1.image)


#### min-width覆盖max-width，如果这两个发生冲突，最大的比最小的还要小，那么以哪个为准？

```css
div{
  max-width: 300px!important;
  height: 300px;
  background-color: blueviolet;
  min-width: 500px;
}

<div></div>
```

![demo4.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db673fcc1ea34a2ba43a81609f2c5105~tplv-k3u1fbpfcp-zoom-1.image)

