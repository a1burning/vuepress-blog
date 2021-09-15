---
title: H5移动端弹幕动画实现
tags: 
  - H5
  - CSS
  - Example
date: 2018-08-22
prev: false
next: false
sidebarDepth: 5
---
## 需求
已知20条内容要有弹幕效果，分成三层，速度随机。
先来看看效果:

![小小弹幕效果.gif](https://user-gold-cdn.xitu.io/2018/8/22/16560de464f0183e?w=272&h=129&f=gif&s=851057)

所以这里不考虑填写生成的。只是一个展现的效果。
**如果要看填写生成的，请不要浪费Time**

## 思路
1. 把单个内容编辑好，计算自身宽度，确定初始位置
2. 移动的距离是屏幕宽度
3. js动态的添加css动画函数，将高度、动画移动时间、动画延迟时间都用随机数控制
![mind.png](https://user-gold-cdn.xitu.io/2018/8/22/16560de464bb64b5?w=993&h=543&f=png&s=11584)



## 代码
### html骨架结构
(太长了，以三个为例，如果觉得界面太长不友好，也可以js动态的生成)
```html
<div class="cute-barrage">
	<div class="barrage-div">
		<img src="http://kw1-1253445850.file.myqcloud.com/static/image/stimg_7656dc02eb1cd13adbacbdd2695dc3a8.jpg"/>
		<span>么么嗒今天提现<i>1Q币</i></span>
	</div>
	<div class="barrage-div">
		<img src="http://kw1-1253445850.file.myqcloud.com/static/image/stimg_632fecdcb52417cb8ab89fa283e07281.jpg"/>
		<span>橘色的大耳朵猫今天提现<i>5Q币</i></span>
	</div>
	<div class="barrage-div">
		<img src="../../static/cutePresent/resource/avatar.png"/>
		<span>丶鹿锅里面装着吴奶包今天提现<i>3Q币</i></span>
	</div>
</div>		
```

### css样式

>`.cute-barrage`是确定展示范围和位置，宽度为100%，高度自定，横向超出部分隐藏
>`.barrage-div` 内容部分，长度由内容决定，确定相对父级的位置
```less
html,body{
    width:100%;
}
.cute-barrage{
    width: 100%;
    height: 4rem;  /*确定弹幕长度*/
    position: absolute;
    top: 1.5rem;   /*确定弹幕高度*/
    left: 0;
    overflow-x: hidden;  /*横向超出部分隐藏*/
    .barrage-div{
        position: absolute;
        top: 0;
        right: -100%;  /*保证一开始在界面外侧，从右向左就是right，从左向右就是left*/
        height: 0.6rem;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 2rem;
        white-space: nowrap;   /*确保内容在一行显示，不然移动到最后会折行*/
        img{
            width: 0.5rem;
            height: 0.5rem;
            vertical-align: middle;  //内联块元素，居中对齐
            padding-left: 0.05rem;
            border-radius: 50%;
        }
        span{
            font-size: 14px;
            padding: 0 0.1rem;
            line-height: 0.6rem;    //内联块元素，居中对齐四个缺一不可
            height: 0.6rem;      //内联块元素，居中对齐四个缺一不可
            display: inline-block;       //内联块元素，居中对齐四个缺一不可
            vertical-align: middle;      //内联块元素，居中对齐四个缺一不可
            i{
                color: #fe5453;
                font-weight: 700;
            }
        }
    }
}
```
### js动态动画实现(zepto.js)
```js
//弹幕
var winWidth = $(window).width();  //获取屏幕宽度
$(".barrage-div").each(function(index,value){   //遍历每条弹幕
    var width = $(value).width();   //获取当前弹幕的宽度
    var topRandom = Math.floor(Math.random() * 3) + 'rem';  //获取0,1,2的随机数  可根据情况改变
    $(value).css({"right":-width,"top":topRandom});  //将弹幕移动到屏幕外面，正好超出的位置
    //拼写动画帧函数，记得每个ani要进行区分，宽度从自己的负宽度移动一整个屏幕的距离    
    var keyframes = `\    
        @keyframes ani${index}{   
            form{
                right:${-width}px;
            }
            to{
                right:${winWidth}px;
            }
        }\    
        @-webkit-keyframes ani${index}{
            form{
                right:${-width}px;
            }
            to{
                right:${winWidth}px;
            }
        }`;      
    //添加到页面的head标签里面
    $("<style>").attr("type","text/css").html(keyframes).appendTo($("head"));      
    //定义动画速度列表
    var aniList = [3,5,7,9,11];
    //取数组的随机数，0,1,2,3,4
    var aniTime =Math.floor(Math.random() * 5);
    //给当全前弹幕添加animation的css
    //延迟的时间用每个的*1.5倍，这个可变
    $(value).css({"animation":`ani${index} ${aniList[aniTime]}s linear ${index * 1.5}s`,"-webkit-animation":`ani${index} ${aniList[aniTime]}s linear ${index * 1.5}s`});
})
```
之后看看浏览器的效果:
![css.png](https://user-gold-cdn.xitu.io/2018/8/22/16560de465176e8d?w=394&h=418&f=jpeg&s=21056)

![html.jpg](https://user-gold-cdn.xitu.io/2018/8/22/16560de465225c27?w=854&h=449&f=jpeg&s=126903)


