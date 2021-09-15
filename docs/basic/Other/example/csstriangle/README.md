---
title: CSS三角的写法（兼容IE6）
tags: 
  - CSS
  - Example
date: 2018-11-08
prev: false
next: false
sidebarDepth: 5
---
## 简介
三角的做法有好几种：
>- 图片、精灵图（网易）
>- 字体图标（京东）
>- 纯代码写（亚马逊）

这里主要介绍的纯代码写的。

## 优点
1. 代码写的三角，不管大小是多少，是不失真的。
2. 代码运行比图片更快。
3. 如果项目中没有引用字体图标，代码写是比较可靠的。

## 原理
>原理就是使用css的盒模型中的border属性<br/>
>使用border属性就可以实现一个兼容性很好的三角图形效果，其底层受到border-style的inseet/outset影响，边框3D效果在互联网早期还是很流行的，。
### 1. 先创建一个div
```html
<div></div>
```
### 2. 然后给div设定边框。
```css
div{
    width:200px;
    height:100px;
    border:10px solid red; 
}
```
可以看到效果：

![border.jpg](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7b08c14e3?w=248&h=141&f=jpeg&s=3254)


### 3. 给div的四个边框都设置不同的颜色
```css
div{
    width:200px;
    height:100px;
    border-left:10px solid red;
    border-top:10px solid green; 
    border-right:10px solid blue; 
    border-bottom:10px solid yellow; 
}
```
可以看到以下效果：

![border1.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7b0cfa6bb?w=255&h=154&f=png&s=388)


可以看到两个border交叉的地方，有斜边存在。
### 4. 把宽度和高度都变成0
```css
div{
    width:0px;
    height:0px;
    border-left:10px solid red;
    border-top:10px solid green; 
    border-right:10px solid blue; 
    border-bottom:10px solid yellow; 
}

/*也可以这么写*/
div{
    width:0px; 
    height:0px;
    border:10px solid;   
    border-color:red green blue yellow;
}
```
可以看到以下效果：

![border2.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7b0dd78ba?w=71&h=71&f=png&s=254)


这个时候就看得很明显了，出现了四个三角。那如果要出现一个，那么就将其他的三个弄成透明色就可以了。

**这个就是三角形的由来。**

### 5. 其余角为透明
这里的设置也遵循 **上右下左** 的顺序，把不需要的角弄成透明色。
```css
div{
    width:0px; 
    height:0px;
    border-width:10px;   
    border-color:#f00 transparent transparent transparent;
    border-style:solid;
}

/*也可以再进行合并*/
div{
    width:0px; 
    height:0px;
    border:10px solid;   
    border-color:#f00 transparent transparent transparent;
}
```

![bingo.jpg](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7b0d32505?w=72&h=64&f=jpeg&s=527)


这样一个三角就完成了。
那么问题来了，那就是兼容问题，IE6的兼容问题，如果不要求兼容IE6可以忽略下一步。

### 6. 兼容IE6浏览器
同样的一个三角，在IE6的显示是什么呢？

![IE6.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7b1022c2a?w=208&h=156&f=png&s=319)


#### 造成这样的原因是：
- IE6不支持border的transparent
- IE6的高度最小为19px，不支持高度为0
>在IE6下面，如果想把元素例如div设置成19像素以下的高度就设置不了了。这是因为IE6浏览器里面有个默认的高度，IE6下这个问题是因为默认的行高造成的。


#### 最简单的解决办法：(后面添加)
```css
div{
    /*不支持transparent*/
    border-style:solid dashed dashed dashed;
    /*高度最小不为0*/
    overflow:hidden;
}
```

#### 其他的解决办法：<br/>
1. 查了查网上的，如果是IE6不支持transparent,
可以这么做：

```css
div{
    border:solid 1px transparent; 
    _border-color:tomato; 
    _filter:chroma(color=tomato); 
}
```
所以我觉得用在这里也可以，**BUT没有亲测过，如果哪位小可爱测过可以请告知我^ ^。**
```css
div{
    width:0px;
    height:0px;
    margin:100px auto;
    border-width:10px;
    border-style:solid;
    border-color:#f00 transparent transparent transparent;
    _border-color:#f00 tomato tomato tomato; 
    _filter:chroma(color=tomato);
}
```
2. 如果是解决IE6的高度问题(也可以前面加下划线，表示兼容的IE6)

```css
div{
    height:0;
    font-size:0;
    line-height:0;
    overflow:hidden;
}
```
### 7. 解决内联元素的三角显示问题
#### 为什么会有这个问题
因为我们刚才用`<div>`去制作三角，当然我们经常会使用`<em><i>`或者伪元素去做一些小图标。那么在显示上面，可能会有问题。
下面的代码：
```html
<style>
em{
	width: 0;
	height: 0;
	border-width: 50px;
	border-color: transparent transparent transparent #f40;
	border-style: solid;
}
</style>

<em></em>
```
可以看到页面是这个样子的:

![inline.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7b1150ff2?w=167&h=162&f=png&s=1246)


为什么是这个样子的，那么我们再看的仔细一点。
它实际是这个样子的。

![inline2.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7cf442467?w=119&h=167&f=png&s=683)


>造成这样的原因<br/>
>1. 是因为行内元素自己有固定的高度，不能设置宽高为0，所以上面下面都是50px没有问题，但是中间撑开了距离，也就有了梯形的效果。
>2. 而且如果上面没有块元素的时候，是从内联元素的内容开始算起的，所以上面的border就会到浏览器可视区域的上面。

#### 解决办法
这个有很多的办法：
##### 1. 去掉固定的内容高度
使用font-size:0;可以去掉内容的固定高度。

```css
em{
	border-width: 50px;
	border-color: transparent transparent transparent #f40;
	border-style: solid;
	font-size: 0;
}
```

##### 2. 将内联元素转化为块级元素或者行内块元素

```css
em{
	border-width: 50px;
	border-color: transparent transparent transparent #f40;
	border-style: solid;
	display: block;   /*也可以是inline-block*/
}
```
##### 3. 将元素脱标（如果涉及特殊的布局可以直接使用）

```css
/*脱标*/
em{
	border-width: 50px;
	border-color: transparent transparent transparent #f40;
	border-style: solid;
	position: absolute;
	top:0;
	left:0;
}

/*or 浮动*/
em{
	border-width: 50px;
	border-color: transparent transparent transparent #f40;
	border-style: solid;
	float:left;
}

```

## 最终代码
下面就是兼容了IE6版本的三角代码。
```css
div{
    width:0px; /*设置宽高为0*/
    height:0px;/*可不写*/
    border-width:10px;   /*数值控制三角的大小，垂直的位置*/
    border-color:#f00 transparent transparent transparent;/*上右下左，transparent是透明的*/
    border-style:solid dashed dashed dashed;/*设置边框样式，dashed是兼容IE6写的*/
    overflow:hidden;/*兼容IE6最小高度不为0写的*/
}
```
改变border-width,三角变大，是不失真的。很清晰。

==**三角制作完成**。==

## 扩展
### 有角度的三角
上面制作的都是45度的三角，三角可以通过border的高度宽度确定角度。

![有角度的三角.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7cfba84bd?w=126&h=96&f=png&s=221)


比如这样一个三角，只需要确定上下的和左右的宽度不一样即可。

```css
div{
	width: 0px;
	height: 0px;
	margin: 100px auto;
	border-width:10px 30px;
	border-color:transparent transparent transparent red;
	border-style:solid;
}
```

### 有一个角是直角的三角
![有一个角是直角的三角.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7d4e34e16?w=74&h=78&f=png&s=238)


观察可以看到，是上面和右面的三角同时设置成一个颜色。就会出现直角的三角。
```css
div{
	width: 0;
	border-width: 20px 10px;
	border-style: solid;
	border-color: red red transparent transparent;
}
```

### 箭头

![箭头.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7d4d05d8f?w=134&h=101&f=png&s=362)


其实原理也简单，就是两个三角重叠在一起。上面的三角就是背景的颜色

```html
<style type="text/css">
.san {
	border-width: 50px;
	border-color: transparent transparent transparent #f40;
	border-style: solid; 
	position: relative;
	}
.si {
	border-width: 30px;
	border-color: transparent transparent transparent #fff;
	border-style: solid; 
	position: absolute;
	left: -50px;
	top: -30px;
}
</style>

<!--html结构-->
<div class="san">
	<div class="si"></div>
</div>
```

### 对话框
![对话框.jpg](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7d5603992?w=217&h=103&f=jpeg&s=2655)

这个使用伪元素去做就很方便。
```html
<style type="text/css">
div{
	width: 150px;
	padding: 10px;
	line-height: 20px;
	color: #9c623f;
	background-color: rgba(255, 236, 193, 0.72);
	border-radius: 10px;
	position: relative;
}
div::before{    
    content:"";   
    border-width: 10px; 
    border-color:transparent rgba(255, 236, 193, 0.72) transparent transparent;
    border-style: solid; 
    position: absolute;  
    left: -20px;
    top: 10px;
}
</style>

<div class="select-toast">早安，哈哈！今天天气不错，很好！</div>
```

### 兼容IE8的小圆角矩形
原理就是一个矩形，上面和下面使用伪元素设置。

before是方向朝上的梯形，after是方向朝下的梯形。

**注意不要太宽了，否则会变成切边矩形，这样就可以避免`border-radius`的兼容问题**

![兼容IE8的小圆角矩形.png](https://user-gold-cdn.xitu.io/2018/11/8/166f2be7d5ebd01c?w=369&h=202&f=png&s=2176)


```html
<style type="text/css">
div{
	width: 140px;
	height: 40px;
    background-color: rgb(244,121,128);
	position: relative;
}
div:before,
div:after {
    content: "";
    position: absolute;
    left: 0; right: 0;
    border-style: solid;
}
div:before {
    top: -3px;
    border-width: 0 3px 3px;
    border-color: transparent transparent red;
}
div:after {
    bottom: -3px;
    border-width: 3px 3px 0;
    border-color: red transparent transparent;
}
</style>

<div></div>
```
### 利用css3旋转来制作三角形

如果可以用到css3，也可以使用到transform的rotate属性

大概原理图就是：
将里面的旋转45度，外面的`overflow:hidden`即可

![利用css3旋转来制作三角形.jpg](https://user-gold-cdn.xitu.io/2018/11/8/166f2bedc9a84f66?w=182&h=213&f=jpeg&s=3634)


```html
<style type="text/css">
	i,s{
		text-decoration: none;
		font-style: normal;
		display: block;
		width: 20px;
		height: 20px;
	}
	i{
		position: relative;
		overflow: hidden;
	}
	s{
		position: absolute;
		top:-14px;
		background: yellowgreen;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}
</style>

<!--html结构-->
<i>
	<s></s>
</i>
```

最终效果图是：

![利用css3旋转来制作三角形2.jpg](https://user-gold-cdn.xitu.io/2018/11/8/166f2bedc9bfdf78?w=129&h=113&f=jpeg&s=1127)


