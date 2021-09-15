---
title: Gradient渐变
tags: 
  - CSS
date: 2018-12-20
prev: false
next: false
sidebarDepth: 5
---
css3定义了两种渐变：**线性渐变（Linear Gradients）**or **径向渐变（Radial Gradients）**

而这个属性只有IE10以上才兼容，完了我们讨论一下渐变的兼容问题。

渐变属于背景图片中的一种，所以在css属性中，写==background== 可以写==background-image== 也可以，下面都是用background来写。

## 线性渐变（linear-gradient）

==特点== ：就是向一个方向进行颜色渐变，上/下/左/右/对角线

==要素== ：方向，颜色（起始，终止，中间色）

==语法== ：`background: linear-gradient(to direction, color-start, color-stop1, ... , color-end);`

==使用== : 

### 第一个参数（方向，可忽略）

#### 1. 默认第一个参数如果不写就是从上到下的

   ```css
   background: linear-gradient(hotpink, darkblue);
   ```

   效果图：
![derection1.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65154a1eb2?w=297&h=143&f=png&s=1846)


#### 2. 如果有第一个参数(top/left/bottom/right)

   ==如果是原生写法记得要加to，所以后面的方向正好相反，而且对角线的时候上下和左右可以互换位置==

   > to bottom(从上边开始)
   >
   > to right(从左边开始)
   >
   > to left(从右边开始)
   >
   > to top(从下边开始)
   >
   > to top left(从右下角开始)
   >
   > to top right(从左下角开始)
   >
   > to bottom left(从右上角开始)
   >
   > to bottom right(从右下角开始)

   ```css
   background: linear-gradient(to bottom,hotpink, darkblue);
   background: linear-gradient(to right,hotpink, darkblue);
   background: linear-gradient(to left,hotpink, darkblue);
   background: linear-gradient(to top,hotpink, darkblue); 
   background: linear-gradient(to right bottom,hotpink, darkblue); 
   background: linear-gradient(to top right,hotpink, darkblue);
   background: linear-gradient(to left bottom,hotpink, darkblue);
   background: linear-gradient(to top left,hotpink, darkblue);
   ```
![derection2.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e651559ed15?w=1222&h=313&f=png&s=59028)


#### 3. 使用角度也可以angle(角度值deg)进行控制

   >所有的颜色都是从中心出发，0deg是to top的方向，顺时针是正，逆时针是负
   >
   >0deg / 360deg （从下到上）
   >
   >90deg （从左到右）
   >
   >180deg （从上到下）
   >
   >270deg / -90deg （从右到左）
   >
   >45deg （对角线左下到右上）

   ```css
   background: linear-gradient(0deg,#fc466b, #3f5efb);
   background: linear-gradient(90deg,#fc466b, #3f5efb);
   background: linear-gradient(180deg,#fc466b, #3f5efb);
   background: linear-gradient(270deg,#fc466b, #3f5efb);
   background: linear-gradient(360deg,#fc466b, #3f5efb);
   background: linear-gradient(-90deg,#fc466b, #3f5efb);
   background: linear-gradient(-180deg,#fc466b, #3f5efb);
   background: linear-gradient(45deg,#fc466b, #3f5efb);
   ```

   效果图：
![derection3.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65156eb175?w=1221&h=315&f=png&s=36954)

   ​

### 第二个参数（颜色）

#### 1. 可以使用英文字母进行颜色控制

```css
   background: linear-gradient(slateblue, cornflowerblue);
```

效果图：
![color1.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65157a4253?w=297&h=149&f=png&s=887)

当然如果使用transparent可以看到全透明的效果渐变

```css
   background: linear-gradient(transparent, cornflowerblue);
```

效果图：
![color7.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e6515ab8794?w=306&h=161&f=png&s=2494)

#### 2. 可以使用16进制#RRGGBB进行颜色控制

```css
background: linear-gradient(#fc466b, #3f5efb);
```

效果图：
![color2.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65159e570e?w=296&h=146&f=png&s=2158)


#### 3. 可以使用16进制加透明度#RRGGBBAA进行颜色控制

​	所谓16进制加透明度一般不怎么使用也不推荐使用，为什么不推荐使用呢？那就是==会带来比较大的兼容问题== ，但是有时候不得不用，因为要处理透明度的兼容问题。

​	问题在哪里？
>
	>  Chrome和火狐浏览器是支持的，形式是==#rrggbbaa== 但是这种形式在IE中就是不支持的。
	>
	>  IE浏览器是什么情况呢？IE9以下如果加透明度是按照==#aarrggbb== 的形式来的，但是这种形式IE10和IE11都是不支持的，所以用这个办法，IE10和IE11都出不来。所以==不推荐使用== 。


>        
	>AA指透明度：00表示全透明，FF表示完全不透明。
	>
	>RR指红色值
	>
	>GG指绿色值
	>
	>BB指蓝色值

​	==0~1的透明度如何转化为00-FF的十六进制的透明度呢？==

​	`Math.round(256 * opacity).toString(16)`

下面把2中的代码进行50%的透明度试试：

```CSS
background: linear-gradient(#7ffc466b, #7f3f5efb);
```

下面是Chrome和火狐浏览器的效果图：
![color6.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e652daff2cb?w=418&h=310&f=png&s=6787)

#### 4. 使用rgb/rgba进行颜色控制

```css
background: linear-gradient(rgb(255,237,188), rgb(237,66,100));   /*rbg*/
background: linear-gradient(rgb(255,237,188,.5), rgb(237,66,100,.5));  /*rgba*/
```

效果图：
![color3.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65332a6908?w=308&h=307&f=png&s=4263)

#### 5. 使用多个颜色控制

只需要在后面加值就好了

```css
background: linear-gradient(#3a1c71, #d76d77,#ffaf7b);
```

效果图：
![color4.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e6534b41c6e?w=299&h=149&f=png&s=2040)


#### 6. 使用多个有指定范围的颜色控制

在颜色后面加百分比，就可以控制在整个宽度的百分之多少的时候到达某一个颜色值

```css
background: linear-gradient(#3a1c71, #d76d77,#ffaf7b); 
background: linear-gradient(#3a1c71, #d76d77 20% ,#ffaf7b 70%); 
background: linear-gradient(#3a1c71, #d76d77 80% ,#ffaf7b 90%); 
```

效果图：
![color5.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65376ee6b2?w=538&h=472&f=png&s=12382)


### 线性渐变总写法

```css
background: linear-gradient(to bottom,#3a1c71, #d76d77 80% ,#ffaf7b 90%); 
```

## 径向渐变（radial-gradient）

==特点== ：就是一个中心点向外围进行颜色渐变

==要素== ：方向，形状，大小，颜色（起始，终止，中间色）

==语法== ：`background: radial-gradient(size shape at position,start-color, ..., last-color);`

==使用== : ==都是使用200px * 200px的div==

### 第一个参数中的第一个参数（半径，可忽略）

#### 1. 第一个参数不写就默认从中间开始，样式为圆形

```css
background: radial-gradient(hotpink, darkblue);
```

效果图：
![dc1.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e653c47d81e?w=198&h=197&f=png&s=25234)


#### 2. 如果传一个值半径

```css
background: radial-gradient(300px,hotpink, darkblue);
background: radial-gradient(200px,hotpink, darkblue);
```

====

效果图：
![size2.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65406b882d?w=619&h=312&f=png&s=93686)


#### 3 .如果传两个半径值

 ==传两个值默认为椭圆，一个是横向的长度，一个是纵向的长度==

```css
background: radial-gradient(200px 50px,hotpink, darkblue);
background: radial-gradient(50px 100px,hotpink, darkblue);
```

效果图：
![size3.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e654ae0d73e?w=619&h=312&f=png&s=57021)


#### 4. 如果传关键字(closest-side/closest-corner/farthest-side/farthest-corner)

==这个大小是由位置决定的==

##### 4.1 如果是圆形

```css
/*closest-side*/
background: radial-gradient(closest-side,#ffaf7b, #d76d77 ,#3a1c71);
/*40%只写一个表示40% 50%*/
background: radial-gradient(closest-side circle at 40%,#ffaf7b, #d76d77 ,#3a1c71);  
background: radial-gradient(closest-side circle at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
/*closest-corner*/
background: radial-gradient(closest-corner,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(closest-corner circle at 40%,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(closest-corner circle at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
/*farthest-side*/
background: radial-gradient(farthest-side,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-side circle at 40%,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-side circle at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
/*farthest-corner*/
background: radial-gradient(farthest-corner,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-corner circle at 40%,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-corner circle at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
```

效果图：
![sizec2.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e6550a815ba?w=1240&h=628&f=png&s=348204)


##### 4. 2 如果是椭圆

```css
/*closest-side*/
background: radial-gradient(closest-side ellipse,#ffaf7b, #d76d77 ,#3a1c71);
/*40%只写一个表示40% 50%*/
background: radial-gradient(closest-side ellipse at 40%,#ffaf7b, #d76d77 ,#3a1c71);  
background: radial-gradient(closest-side ellipse at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
/*closest-corner*/
background: radial-gradient(closest-corner ellipse,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(closest-corner ellipse at 40%,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(closest-corner ellipse at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
/*farthest-side*/
background: radial-gradient(farthest-side ellipse,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-side ellipse at 40%,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-side ellipse at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
/*farthest-corner*/
background: radial-gradient(farthest-corner ellipse,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-corner ellipse at 40%,#ffaf7b, #d76d77 ,#3a1c71);
background: radial-gradient(farthest-corner ellipse at 20% 30%,#ffaf7b, #d76d77 ,#3a1c71);
```

效果图：
![sizec3.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e6550bafa10?w=1240&h=577&f=png&s=293632)


### 第一个参数中的二个参数（形状，可忽略）

#### 1. 如果只参数shape（circle,ellipse）

==如果div是正方形那么circle和ellipse并没有什么区别，但是如果是长方形，那么ellipse就会根据长度进行压缩==

```css
background: radial-gradient(circle,hotpink, darkblue); /*下图1和3*/
background: radial-gradient(ellipse,hotpink, darkblue); /*下图2和4*/
```

效果图（左边两个是200px * 200px ，右边两个是200px *100px）
![circle1.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65550c5806?w=821&h=206&f=png&s=82437)


#### 2. 如果是加上长度范围和形状

==该范例要说明半径要写到形状前面，且半径作用大于形状==

```css
background: radial-gradient(300px circle,hotpink, darkblue);
background: radial-gradient(200px circle,hotpink, darkblue);
background: radial-gradient(100px circle,hotpink, darkblue);
background: radial-gradient(50px circle,hotpink, darkblue);
background: radial-gradient(0px circle,hotpink, darkblue);

/*如果这里加了长短轴的尺寸后面又写了circle，那么circle是不起作用的，出来还是一个椭圆*/
background: radial-gradient(200px 50px ellipse,hotpink, darkblue);
```

效果图：
![size1.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e655f5271c2?w=1240&h=250&f=png&s=117441)


### 第一个参数中的第三个参数（方向，可忽略）

#### 1. 如果第一个有参数(center/top/bottom/left/right)

 ==如果是原生写法记得要加at，而且对角线的时候上下和左右可以互换位置==

```css
background: radial-gradient(at center,hotpink, darkblue);
background: radial-gradient(at top,hotpink, darkblue);
background: radial-gradient(at bottom,hotpink, darkblue);
background: radial-gradient(at left,hotpink, darkblue);
background: radial-gradient(at right,hotpink, darkblue);
background: radial-gradient(at center center,hotpink, darkblue);
background: radial-gradient(at top left,hotpink, darkblue);
background: radial-gradient(at top right,hotpink, darkblue);
background: radial-gradient(at bottom right,hotpink, darkblue);
background: radial-gradient(at bottom left,hotpink, darkblue);
```

效果图：
![dc2.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e6569daef06?w=1026&h=412&f=png&s=251564)


#### 2. 如果方向为具体数值确定圆心

==可以是正数也可以是负数，可以超出范围==

```css
background: radial-gradient(circle at 0 0,hotpink, darkblue);
background: radial-gradient(circle at 50px 50px,hotpink, darkblue);
background: radial-gradient(circle at 100px 50px,hotpink, darkblue);
background: radial-gradient(circle at 50px 100px,hotpink, darkblue);
background: radial-gradient(circle at 100px 100px,hotpink, darkblue);
```

效果图：
![dc3.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e656c0aa774?w=1240&h=466&f=png&s=184073)


#### 3. 如果方向为百分比确定圆心

==可以是整数也可以是负数，可以超出范围，方向和上面的一样== 

```css
background: radial-gradient(circle at 0 0,hotpink, darkblue);
background: radial-gradient(circle at 25% 25%,hotpink, darkblue);
background: radial-gradient(circle at -25% 50%,hotpink, darkblue);
background: radial-gradient(circle at 50% 150%,hotpink, darkblue);
background: radial-gradient(circle at 50% 50%,hotpink, darkblue);
```

效果图：
![dc4.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e657643eb9b?w=1240&h=250&f=png&s=160380)


### 第二个参数（颜色）

颜色在线性渐变中已经讨论过，径向渐变与线性渐变等同。这里只阐述不同的部分：

只是径向渐变再算百分比的时候，颜色过渡是从内而外进行的

```css
background: radial-gradient(#ffaf7b, #d76d77,#3a1c71); 
background: radial-gradient(#ffaf7b, #d76d77 20% ,#3a1c71 70%); 
background: radial-gradient(#ffaf7b, #d76d77 80% ,#3a1c71 90%); 
```

效果图：
![color8.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e6581a5c680?w=1240&h=593&f=png&s=208582)


### 径向渐变总写法

```css
background: radial-gradient(100px circle at 75% 75%,#ffaf7b, #d76d77 20% ,#3a1c71 60%); 
background: radial-gradient(200px 100px ellipse at 25% 25%,#ffaf7b, #d76d77 60% ,#3a1c71 90%); 
```

效果图：
![all.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e6585fe8c4f?w=618&h=311&f=png&s=46173)




## 兼容问题

所说的兼容问题，就是各个浏览器的兼容性问题。

1. 第一步只需要添加私有前缀就可以解决。

    ==注意标准语法要写在最下面，带有私有前缀的就不加to了，方向就是起始点== 

   ```css
   /*线性渐变*/
   background: -webkit-linear-gradient(left, hotpink , darkblue); /* Safari 5.1 - 6.0 */
   background: -o-linear-gradient(left, hotpink, darkblue); /* Opera 11.1 - 12.0 */
   background: -moz-linear-gradient(left, hotpink, darkblue); /* Firefox 3.6 - 15 */
   background: linear-gradient(to right, hotpink , darkblue); /* 标准的语法 */
   /*径向渐变*/
   background: -webkit-radial-gradient(center, hotpink , darkblue); /* Safari 5.1 - 6.0 */
   background: -o-radial-gradient(center, hotpink, darkblue); /* Opera 11.1 - 12.0 */
   background: -moz-radial-gradient(center, hotpink, darkblue); /* Firefox 3.6 - 15 */
   background: radial-gradient(at center, hotpink , darkblue); /* 标准的语法 */
   ```

2. 第二步主要针对IE9以下的浏览器，是不支持渐变效果的。

   ==解决办法就是使用IE私有的渐变滤镜==

   ```css
   filter:progid:DXImageTransform.Microsoft.gradient(startcolorstr=hotpink,endcolorstr=darkblue,gradientType=1);
   /**
   @ 第一个参数：startcolorstr 表示起始颜色（英文字母 or 十六进制）
   @ 第二个参数：endcolorstr 表示终止颜色（英文字母 or 十六进制）
   @ 第三个参数：gradientType 表示方向（1为横向渐变，0为纵向渐变）
   */
   ```

   如果想有白透明的效果，就使用8字符的十六进制表示法，在上面也提到了，规则是==#AARRBBGG== 

   所以如果还想要兼容IE9以下的浏览器就写成：

   ```css
   /*50%透明度的#fc466b和50%透明度的#3f5efb*/
   filter:progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7ffc466b,endcolorstr=#7f3f5efb,gradientType=1);/*兼容IE9以下*/
   background: -webkit-linear-gradient(left, rgba(252,70,107,.5) , rgba(63,94,251,.5)); /* 标准的语法 */
   background: -o-linear-gradient(left, rgba(252,70,107,.5) , rgba(63,94,251,.5)); /* 标准的语法 */
   background: -moz-linear-gradient(left, rgba(252,70,107,.5) , rgba(63,94,251,.5)); /* 标准的语法 */
   background: linear-gradient(to right, rgba(252,70,107,.5) , rgba(63,94,251,.5)); /* 标准的语法 */
   ```

   效果图：
![jianrong1.jpg](https://user-gold-cdn.xitu.io/2018/4/20/162e2e658f0cc0c4?w=706&h=340&f=jpeg&s=12346)


## 特殊效果

### 进度条动画

效果是什么样的？截图：
![jindutiao.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e659fd788e2?w=1240&h=148&f=png&s=13951)


分析：设置颜色渐变的角度、颜色和范围。然后设置从左到右的动画。

实现：

```css
body{
  margin:0;
  padding:0;
  /*为了展示方便就用灰色的背景*/
  background-color:#ccc;  
}

.load{
  width:500px;
  height:100px;
  /*如果渐变出不来，有一个背景颜色*/
  background:#fff;  
  margin:100px auto;
  /*间隔色的关键代码*/
  background-image:linear-gradient(
  	45deg,
    #fff 0%,
    #fff 25%,
    #000 25%,
    #000 50%,
    #fff 50%,
    #fff 75%,
    #000 75%,
    #000 100%
  );
  /*把刚才的背景压缩到100px * 100px以内的，没有设定不重复所以是重复的*/
  background-size: 100px 100px; 
  /*一秒播一次的永动动画*/
  animation: move 1s linear infinite; 
}

@keyframes move{
  0%{
    
  }
  100%{
    background-position:100px;  /*终止状态是移动到100px像素的位置，然后下一秒又开始从0px开始运动*/
  }
}


<div class="load"></div>
```

### 立体小球

效果图：
![ball.png](https://user-gold-cdn.xitu.io/2018/4/20/162e2e65a0698a54?w=493&h=282&f=png&s=34260)


分析：背景色设置一个，渐变是黑色的透明到不透明的渐变，外面的轮廓是圆。

```css
body {
  margin: 0;
  padding: 0;
  background-color: #F7F7F7;
}

.radial-gradient {
  width: 200px;
  height: 200px;
  margin: 40px auto;
  border-radius: 100px;
  background-color: hotpink; /*左边的没有背景色，右边的加了背景色*/
  background-image: radial-gradient(
    200px at 50px 60px,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.6)
  );
}

<div class="radial-gradient"></div>
```



## 参考

[再说线性渐变](https://www.w3cplus.com/css3/new-css3-linear-gradient.html)

[再说径向渐变](https://www.w3cplus.com/css3/new-css3-radial-gradient.html)

