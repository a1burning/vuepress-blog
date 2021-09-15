---
title: White-space
tags: 
  - CSS
date: 2018-04-23
prev: false
next: false
sidebarDepth: 5
---
**white-space 属性**设置处理元素内的空白，所谓空白有哪些？

**Space(空格)、Enter(回车)、Tab(制表符)**

我们熟知的是：

1. 在开发中，无论我们敲多少空格和回车，显示在页面上的都会合并成一个。
2. 我们的文字在超过一行的情况下，就会自动换行。



## 属性介绍

但是开发的要求各种各样，white-space的功能属性也很强大，可以有各种各样的不同效果，下面来看一张图：

![whiteSpace.png](https://user-gold-cdn.xitu.io/2018/4/23/162f1e8bb3469e29?w=391&h=583&f=png&s=11614)


这个古诗是怎么打出来的呢？

>床(空格)前(空格)(空格)(空格)(空格)明月光，疑是地上霜
>（回车）
>举头望明月，低头(Tab)思故乡



下面一个表格来说明一下出现这种情况的原因：

| 属性         | 效果                         | 兼容           |
| ---------- | -------------------------- | ------------ |
| normal(默认) | 所有空格、回车、制表符都合并成一个空格，文本自动换行 | IE7\IE6+     |
| nowrap     | 所有空格、回车、制表符都合并成一个空格，文本不换行  | IE7\IE6+     |
| pre        | 所有东西原样输出，文本不换行             | IE7\IE6+     |
| pre-wrap   | 所有东西原样输出，文本换行              | IE8+         |
| pre-line   | 所有空格、制表符合并成一个空格，回车不变，文本换行  | IE8+         |
| _inherit_  | _继承父元素_                    | _IE不支持，不推荐用_ |


## 属性使用

### 一、列表溢出换行处理

同样是320px的手机，iphone4可以在一行显示，但是安卓端就会有错位现象，这个开始让我很头疼：

ios端

![row.png](https://user-gold-cdn.xitu.io/2018/4/23/162f1e8bb33d2533?w=368&h=58&f=png&s=943)

andriod

![overrow.png](https://user-gold-cdn.xitu.io/2018/4/23/162f1e8bb3610603?w=369&h=118&f=png&s=4865)


这样的话使用媒体查询也无法处理，所以在这一行的父元素中设置，所有的元素强制一行显示。

```css
ul{
  white-space: nowrap; /*强制内容在一行显示*/
  overflow:hidden; /*超出部分隐藏*/
}
```



### 二、文字溢出省略处理

文字超出去怎么办？

![overtext.png](https://user-gold-cdn.xitu.io/2018/4/23/162f1e8bb373bdea?w=170&h=76&f=png&s=943)


一般都自动换行了，想要文字溢出的部分自动用省略号表示，那么离不开三个属性:

```css
white-space: nowrap; /*强制内容在一行显示*/
overflow: hidden;/*超出部分溢出*/
text-overflow: ellipsis;/*溢出的部分使用省略号*/
```

可以看到下面的效果:

![overEllipsis.png](https://user-gold-cdn.xitu.io/2018/4/23/162f1e8bb381c3e5?w=177&h=54&f=png&s=599)


### 三、文字展示

如果是显示诗歌，或者文案之类的，很多情况需要输入什么样子，出来什么样子。

![poetry.png](https://user-gold-cdn.xitu.io/2018/4/23/162f1e8bb3975970?w=302&h=170&f=png&s=9303)



这个时候用pre属性是最合适的(毕竟兼容性最好么):

```css
white-space:pre;
```
