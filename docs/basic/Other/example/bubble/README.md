---
title: H5+CSS3实现说话气泡点击动画
tags: 
  - H5
  - CSS
  - Example
date: 2018-11-07
prev: false
next: false
sidebarDepth: 5
---
## 需求
还是要先把需求拿出来。
要求：
>1. 对话气泡要有动画，动画总共4秒 
>2. 在没有点击的时候，气泡每隔8秒出现一次
>3. 在点击的时候，如果动画没有播放完毕就不执行，如果动画播放完毕，立即出现气泡

然后还是把完成图拿出来，就是做成下面这个样子：
![bubble.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d1d9fddda234ba687ce18d5010e9288~tplv-k3u1fbpfcp-zoom-1.image)
 
## 思路
1. 首先要制作气泡
2. 其次使用css制作动画
3. 添加计时器完成点击动画和计时动画

## 实现
### 半透明气泡制作
![bubble.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e35b19244944e968557a42947ea25e6~tplv-k3u1fbpfcp-zoom-1.image)

#### html结构
```html
<p class="select-toast" id="select-toast">闭上眼睛，用心祈祷，努力的人有回报</p>
```

#### less(rem规则自己换算，也可以使用px)
```less
.select-toast{
    position: absolute;   //确定对话的位置
    top: 3.4rem;
    right: 0.2rem;
    width: 1.45rem;   //确定宽度，高度由文字撑开
    padding: 0.18rem;  //确定文字距离对话框外部的距离
    line-height: 0.4rem;  //确定文字的行高
    color: #d06e5a;  //文字颜色
    background-color: rgba(255,255,255,0.85);  //背景色，半透明
    border-radius: 0.2rem;  //对话框圆角
    opacity: 0;  //初始情况透明度为0
    &::before{    //三角的制作
        content:"";   //伪元素必需
        width: 0;    //本身的宽高为0
        height: 0;
        border-width: 0.2rem;  //三角形的高
        border-color:transparent rgba(255,255,255,0.85) transparent transparent;   //角朝左的三角形
        border-style: solid;  //边框为实心的
        position: absolute;  //三角的位置
        left: -0.4rem;
        top: 0.4rem;
    }
}


```
### 对话框css动画
```less

.select-toast.toastAni{
     -webkit-animation: toast 4s;   //对话框的动画
     animation: toast 4s;
}

//对话框的动画定义
@-webkit-keyframes toast {  
    8%{
        opacity: 0.8;
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
    }
    16%{
        opacity: 1;
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
    24%{
        opacity: 1;
        -webkit-transform: scale(0.95);
        transform: scale(0.95);
    }
    32%{
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
    82.5%{
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
    100%{
        opacity: 0;
    }
}

@keyframes toast {
    8%{
        opacity: 0.8;
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
    }
    16%{
        opacity: 1;
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
    24%{
        opacity: 1;
        -webkit-transform: scale(0.95);
        transform: scale(0.95);
    }
    32%{
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
    82.5%{
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
    100%{
        opacity: 0;
    }
}
```
### 添加计时器完成点击动画和计时动画
首先要确定一个点击的区域，这个区域一点击，就会触发气泡出现
```html
<!--点击<・)))><|出气泡-->
<div class="fish-click" id="fish-click"></div>
```
#### 封装功能函数

```js
//随机出现的话术数组
var toastText = [
   "哈哈，早安",
   "早上吃饭了吗？",
   "好好学习，天天向上",
   "闭上眼睛，用心祈祷，努力的人有回报",
   "记得早点睡觉",
]

//计时器变量
var fishAlert;
//弹出功能函数
function textShow(aniTime,spaceTime){
    //清空计时器
    clearInterval(fishAlert);
    //解绑事件
    $("#fish-click").off("tap");
    //设置显示的文本，随机生成0-4的整数
    var random = Math.floor(Math.random() * 5);
    //展示随机生成的文本
    $("#select-toast").html(toastText[random]).addClass("toastAni");
    //4000秒后去掉动画
    setTimeout(function(){
        //去掉动画样式
        $("#select-toast").removeClass("toastAni");
        //重新绑定事件
        $("#fish-click").off("tap").on("tap",function(){
            textShow(4000,8000);
        })
        //添加8秒计时器
        fishAlert = setInterval(function(){
            //随机生成0-4的整数
            var random = Math.floor(Math.random() * 5);
            //添加动画
            $("#select-toast").html(toastText[random]).addClass("toastAni");
            setTimeout(function(){
                //动画结束后移除动画
                $("#select-toast").removeClass("toastAni");
            },aniTime)
        },spaceTime);
    },aniTime);
}
```
函数调用
```js
$(document).ready(function(){
    //动画时间4000ms，间隔时间8000ms
    textShow(4000,8000);
})
```

整体还是比较简单的，所以这里做一下记录。

