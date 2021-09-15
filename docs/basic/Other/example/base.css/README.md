---
title: 页面的基础样式base.css
tags: 
  - CSS
  - Example
date: 2018-01-17
prev: false
next: false
sidebarDepth: 5
---
这玩意，俗称base.css
几乎所有的页面，在搭建之前，都要用下面那个。BUT
```css
/*还在用这个？过时了吧？*/
*{
  margin:0;
  padding:0;
}
```
一网打尽并不是最全的，最好的。还是要讲究需要什么用什么，小白知道怎么用就行了，而对于追求更高层次的而言，不仅要知其然，还要知其所以然。
什么文本域、什么a链接的默认下划线，通通都一边呆着去。我把这个base.css准备好，有利于下面的界面的开发。
之前总结过一次 ，但是在我新建一个工程的时候，在有些情况下，我有时候又会忘了如何去配置。所以还是总结在这个里面，使用起来更加的方便。
所以还是要先讲原理后上代码的：

- 块元素
  + 关于边距问题
  + 关于字体的问题
  + 关于列表的原点问题
  + （可选）鼠标手势
  + （可选）宽高设置
- 行内块元素
- 行内元素
  + a标签
  + i标签
  + textarea标签
- 清除浮动类
- 版心——主体内容可视区
- 通用配置——（随意搭配）
  + 浮动
  + 定位
  + 一些固定边距
  + 背景颜色
- （可选）自定义表单设置
  + 自定义单选框/复选框设置
  + 自定义数值框设置
- 配置完整版代码base.css

## 块元素
### 关于边距问题
>`<body>`有8px的外边距

>`<p>`有16px的外边距

>`<h1>~<h6>`都有内外边距，有默认字体加粗

>`<ul><ol><li>`标签就不用说了，前面还有间隙啊丑啊丑

>所以要把这些块元素的间隙都要清除
`margin:0;padding:0;`

### 关于字体的问题
>1. 浏览器的默认字体大小是16px，字体为宋体,而不同的浏览器的文字样式是不一样的。现在基本上大多数页面的字体是14px，大多数为微软雅黑这种扁平化又常见的字体。
>2. 况且IE6（虽然现在很少会兼容IE6了）不认识奇数字号，所以为了便于显示，基本也都用偶数字号。
>3. `font-family: "Microsoft Yahei",sans-serif，tahoma;` 这样写会依次加载三个字体。而且写的时候要注意，中文字体一定要加引号，英文下可以不加引号，英文之间有空格的必须加引号。
>4. 为了避免文件编码（GB2312,UTF-8）等不匹配时产生乱码的问题，XP系统不支持微软雅黑的中文等原因。我们也推荐使用css的unicode编码的字体。如：
    `宋体->\5B8B\4F53`
    `微软雅黑->\5FAE\8F6F\96C5\9ED1 `

### 关于列表的原点问题
>这个也是一个头疼的事，现在基本上都是用ul和li搭建，所以就提前把那些东西去掉。这些`list-style-type、list-style-position、list-style-position`都不要所以写合写：
`list-style:none;`

### 关于表格边框问题
>之前一直避免运用表格是因为表格有很多自己特有属性，导致css控制其样式非常困难。但是最近我需要大量的使用表格，用ul和li去做就比较心累。听说表格对于数据加载还是有其优势，所以我就冒险使用了表格。哈哈~~
>不过后来发现，其实也很简单。主要就是边框的问题么，所以就有了合并边框：
>`border-collpase:collpase;`
>然后设置单元格之间的距离为0之后就可以为所欲为了哈哈
>`border-spacing:0;`
>其余的宽高什么的，都可以直接用css控制了，也很方便。

### （可选）鼠标手势
>我在写页面的时候，发现我写的文本自动变成了光标的形式，其实有的地方要有的地方不要，所以这里做了可选，如果不要就在这里配置，什么时候需要用别的再覆盖就可以。如果无所谓不设置也是可以的。
`cursor: default;`

### （可选）宽高设置
>有的时候如果要适配的话，要求html标签和body标签按照百分比计算。
>有的时候需要rem布局的时候，还要考虑font-size的值。这个根据不同的布局进行配置。
`html,body{
    width: 100%;
    height: 100%;
    font-size: 100px!important;
}`
## 行内块元素
>行内块元素有：
>- 内外边距   `margin: 0;padding: 0;`
>- 有边框  `border: 0 none;`
>- 有蓝色轮廓线  `outline-style: none;`
>- 因为默认基线对齐有默认3px的距离。 `vertical-align: bottom;`
##行内元素
###a标签
> a标签有自己默认的样式
>- a标签的默认样式是蓝色的，且下面有一条下划线。
>- a标签在点击active和visited的状态的时候也有下划线。
>    + `text-decoration文本的修饰
    none 表示无修饰
    blink 闪烁（一般不用）
    underline  下划线
    line-through 贯穿线
    overline 上划线`
>    + `color:#333;`
>- a标签移动上去的时候会变颜色
`a:hover{
    color:#333;
}`

### i标签
>i标签是有语义的标签，是斜体，但是现在基本用来加载小图标。所以里面if要用到小的文字的时候就要去掉字体风格：
>防止字体倾斜  normal  italic  oblique 后面两个是斜体，但是第三个基本上不使用，两者在web中都是一样的，但是在设计中是不一样的
>`font-style: normal;`

### textarea标签
>表单默认都有很多的样式：
>- 边框  `border:none;`
>- 轮廓线  `outline: none;`
>- 文本域可拖拽   `resize: none;`

## 清除浮动类
>浮动常用，清除浮动也就常用，封装成一个类，直接加类会更加方便
>`.clearfix`

## 版心——主要内容可视区
>版心根据设计稿的不同设计，加上浏览器不同的分辨率，一般这个可以保证内容水平居中在页面上。注意的是一定要指定其宽度
>`.w`

## 通用配置
>我们其实有的时候需要一些通用配置，什么是通用配置，就是经常用的一些css属性，有的时候为了结构看上去很明确，就单独一个成类。可以设置的属性就可以跟随自己的实际情况来定，到时候只要加到标签的类里面就可以了。
可以举一个栗子：
`<div class=".nav  .p_r">`
——`<div class=".nav-in .p_a .clearfix"> `
———`<i class=".f_l"></i><span class=".f_r"></span>`
——`</div>`
`</div>`
> 上面的代码，nav是父盒子相对定位，nav-in是子盒子绝对定位（top和left就在类里面定位就可以了），里面的元素一个左浮动一个右浮动，外面的盒子再清除一下浮动。这样看上去，是不是结构清晰明了。：）
### 浮动
>`.f_l{float:left;}`
>`.f_r{float:right;}`
### 定位
>`p_a{position:absolute;}`
>`p_r{position:relative;}`
### 一些固定边距
>`m_b10{margin_bottom:10px;}`
>`p_l10{padding_left:10px;}`
### 背景颜色
>`bgc-blue{background-color:#137ac6;}`

## (可选)自定义表单设置
### 自定义单选框/复选框设置
> 这个可以自己选择单选框和复选框的设置，因为有的时候，一套页面风格比较同意，单选框不会随意变。
>注意这里只针对input+label的方式去自定义——这个详见`css中的自定义表单`的文章

### 自定义数值框设置
>因为input的type=number的数值框中的上下按钮，会有默认的样式，所以最好的办法就是隐藏，然后自己用div自己做一个上下按钮。
>这个也在`css中的自定义表单`的文章会详细阐述。

### 下面来个完整版的base.css
```css
body,p,h1,h2,h3,h4,h5,h6,ul,ol,dl,li,dt,dd{
    /* 默认有边距，都要清除 */
    margin: 0;
    padding: 0;
    /*字体设置*/
    font-size: 14px;
    font-family: "Microsoft Yahei",sans-serif;
    color: #ccc;
    /* 去掉列表的原点 */
    list-style: none;
    /* 默认鼠标 */
    cursor: default;
}

/*可选*/
html,body{
    width: 100%;
    height: 100%;
    font-size: 100px!important;
}

/*行内块元素*/
input,img{
    margin: 0;
    padding: 0;
    border: 0 none;
    outline-style: none;
    vertical-align: bottom; 
}

/*行内元素*/
a,a:active,a:visited{
    /*下划线和颜色*/
    text-decoration: none;
    color: #ccc;
}

a:hover{
    color:#333;
}

textarea{
    /* 边框清零 */
    border:none;
    /* 轮廓线清零 */
    outline: none;
    /* 防止文本域被随意拖拽 */
    resize: none;
}

i{
    /*文字样式*/
    font-style: normal; 
}

table{
    /*边框合并*/
    border-collapse:collapse;
    border-spacing:0;
}


/* 使用伪元素清除浮动 */
.clearfix::before,
.clearfix::after{
    content:"";
    height: 0;
    line-height: 0;
    display: block;
    visibility: none;
    clear: both;
}

.clearfix {
    *zoom: 1;
}

/* 版心*/
.w{
    width: 1883px;
    margin: 0 auto;
}

/*可选*/
/*单选框和复选框的配置，一般是分开的*/
input[type="radio"],input[type="checkbox"]{
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: none;
}

label{
    display: inline-block;
    cursor: pointer;
}

label input[type="radio"]+span,label input[type="checkbox"]+span{
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url("../images/nocheck.png") no-repeat;
}

label input[type="radio"]:checked+span,label input[type="checkbox"]:checked+span{
    background: url("../images/check.png") no-repeat;
}

label input[type="radio"]:checked~i,label input[type="checkbox"]:checked~i{
    color: #38d6ff;
}

/*可选*/
/* 自定义数字框配置 */
input[type="number"]{
    width: 76px;
    height: 36px;
    background-color: rgba(5,45,82,0.4);
    border: 2px solid #ccc;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
    padding: 0 10px;
}

input[type="number"]::-webkit-inner-spin-button{
    -webkit-appearance: none;
}

input[type="number"]+div{
    width: 30px;
    height: 40px;
    padding-left: 2px;
    cursor: pointer;
}

input[type="number"]+div > .count_add{
    display: block;
    width: 28px;
    height: 19px;
    background: url("../images/count_add.png") no-repeat;
    background-size: contain;
    margin-bottom: 2px;
}

input[type="number"]+div > .count_subtract{
    display: block;
    width: 28px;
    height: 19px;
    background: url("../images/count_subtract.png") no-repeat;
    background-size: contain;
}
```

这样，在页面中直接引入base.css就可以啦。
是不是很方便？

