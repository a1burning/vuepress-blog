---
title: H5移动端获奖无缝滚动动画实现
tags: 
  - H5
  - Example
date: 2018-06-21
prev: false
next: false
sidebarDepth: 5
---
## 需求分析
哈哈，上动态图真的是一下就明了了。

![roll.gif](https://user-gold-cdn.xitu.io/2018/6/21/16421299ab89569d?w=300&h=94&f=gif&s=1025073)


就是滚动么滚动，那么制作这个有什么方法呢？我们来总结一下:
## html骨架
其实很简单，最外面的`<div>`是做固定的窗口，里面的`<ul>`控制运动，`<li>`里面是展示动画
```html
<div class="roll" id="roll">
    <ul>
         <li>第一个结构</li>
         <li>第二个结构</li>
         <li>第三个结构</li>
         <li>第四个结构</li>
         <li>第五个结构</li>
         <li>第六个结构</li>
         <li>第七个结构</li>
         <li>第八个结构</li>
    </ul>
</div>
```
## 基本css样式
先把基本的css样式实现
```css
*{
    margin:0;
    padding:0;
}
.roll{
    margin: 100px auto;
    width: 200px;
    height: 40px;
    overflow:hidden;
    border: 1px solid aquamarine;
}
.roll ul{
    list-style: none;
}
.roll li{
    line-height:20px;
    font-size:14px;
    text-align:center;
}
```
可以看看大致的样式:
![css.jpg](https://user-gold-cdn.xitu.io/2018/6/21/16421299ab9d7cd1?w=505&h=303&f=jpeg&s=4175)


## 实现思路
### 一、使用jquery的animate动画
#### animate()方法
`$(selector).animate(styles,speed,easing,callback)` 
> 参数：
>`styles:必需参数，需要产生动画的css样式(使用驼峰式命名)`<br/>
>`speed: 规定动画的速度`<br/>
>        `@number:1000(ms)`<br/>
>        `@string:"slow","normal","fast"`<br/>
>`easing:动画速度（swing,linear）`<br/>
>`callback:函数执行完之后的回调函数`<br/>
```js
    $(document).ready(function(){
            setInterval(function(){  // 添加定时器，每1.5s进行转换
                $("#roll").find("ul:first").animate({
                        marginTop:"-40px"  //每次移动的距离
                },500,function(){   // 动画运动的时间
                        //$(this)指的是ul对象，
                        //ul复位之后把第一个元素和第二个元素插入
                        //到ul的最后一个元素的位置
                        $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
                        $(this).find("li:first").appendTo(this);
                });
            },1500)
        });
```

看看效果:
![finish.gif](https://user-gold-cdn.xitu.io/2018/6/21/16421299aba67b0a?w=300&h=84&f=gif&s=140634)

### 二、使用css3的animation动画
通过css3中的关键帧，可以得到跳步的效果。先通过一个短的看一下思路。
#### 初步
1. 如果是写死的获奖，那么需要把前面的那个复制一份到后面去，如果是一个一个滚动那么就复制第一个，如果是两个两个滚动的就复制第一个和第二个。
```html
<div class="roll" id="roll">
        <ul>
             <li>第一个结构</li>
             <li>第二个结构</li>
             <li>第三个结构</li>
             <li>第四个结构</li>
             <li>第五个结构</li>
             <li>第六个结构</li>
             <li>第七个结构</li>
             <li>第八个结构</li>
             <li>第一个结构</li>
             <li>第二个结构</li>
        </ul>
</div>
```
2. 然后计算需要滚动多少次，一次多少秒,例子是两个两个滚动，需要5s，所以css3的`animation`的时间是5s。那么`@keyframe`需要分成几份呢？因为是停顿，每一个滚动都需要两份，最后一个要跳动所以只有一份，所以需要`5 * 2 - 1 = 9份`，看代码就晓得了：
```css
/*这里不做兼容性处理*/
.roll ul{
    list-style: none;
    animation: ani 5s  linear infinite;  /*动画ani，5s，循环匀速播放*/
}
@keyframes ani{  
    0%{
        margin-top: 0;
    }
    12.5%{
        margin-top: 0;
    }
    25%{
        margin-top: -40px;
    }
    37.5%{
        margin-top: -40px;
    }
    50%{
        margin-top: -80px;
    }
    62.5%{
        margin-top: -80px;
    }
    75%{
        margin-top: -120px;
    }
    87.5%{
        margin-top: -120px;
    }
    100%{
        margin-top: -160px; /*最后是一个，这样可以打断动画*/
    }
}
```
 #### 进阶
如果个数不确定，那么就需要动态的计算，用js动态地添加`@keyframes` ，到时候只要自己可以计算清楚间隔还有移动的距离就好。
>1. 首先获取`<li>`的长度length
>2. 然后计算间隔百分比，因为有停顿所以记得要用秒数×2
>3. 然后用字符串拼写`@keyframes`，0~length，包括length，因为多一个，双数和单数分开。
>4. 把`<ul>`中的第一个和第二个克隆到`<ul>`的最后
>5. 创建一个`<style>`标签加入到`<head>`中
>6. 给`<ul>`添加动画属性

话不多说上代码：
 ```js
    function addKeyFrame(){
        var ulObj = $("#roll ul"),  //获取ul对象
              length = $("#roll li").length,  //获取li数组长度
              per = 100 / (length / 2 * 2 );  //计算中间间隔百分比
        // 拼接字符串
        var keyframes = `\    
        @keyframes ani{`;
        for(var i = 0 ; i<=length ; i++ ){
            keyframes+=`${i * per}%{
                            margin-top: ${i % 2 == 0 ? -i * 20 : -(i - 1) * 20}px;
                        }`;
        }
        keyframes+='}';
        var liFirst = $("#roll li:first"),   //获取第一个元素
            liSec = liFirst.next();    //获取第二个元素
        ulObj.append(liFirst.clone()).append(liSec.clone());   //将两个元素插入到ul里面
        $("<style>").attr("type","text/css").html(keyframes).appendTo($("head"));    //创建style标签把关键帧插入到头部
        ulObj.css("animation","ani 5s linear infinite");  //给ul添加css3动画
    }
    addKeyFrame();
```

### 三、zepto+transition实现
移动端的zepto没有animate函数，如果不用css3的属性，那如何用js去写？
```js
var timer,top;
function roll(){
    var ulObj = $("#roll").find("ul"),
        length = $("#roll li").length,  
        liFirst = $("#roll").find("li:first");
        liSec = liFirst.next();
    ulObj.append(liFirst.clone()).append(liSec.clone());  //把第一个第二个都添加到<ul>标签中
    clearInterval(timer);
    timer = setInterval(function(){  //设置定时器
        var top = ulObj.css("margin-top");
        top = +top.slice(0,-2);
        if(top != -(20 * length)){  //获取现在的高度如果没有到最后就上移
            top -= 40;
            ulObj.css({"-webkit-transition":"all 1s","transition":"all 1s","margin-top":top});
        }else{  //如果到了最后就迅速到零
            top = 0;
            ulObj.css({"-webkit-transition":"none","transition":"none","margin-top":top});
            setTimeout(function(){  //这里加一个延时器，也是要放在队列最后去执行，为了避免两个动画合并
                top -= 40;
                ulObj.css({"-webkit-transition":"all 1s","transition":"all 1s","margin-top":top});
            },0)
        }
    },2000);
}

roll();
```

如果还有别的方法，下次我会不定期更新的。不过移动端的话这几个应该够用了。

