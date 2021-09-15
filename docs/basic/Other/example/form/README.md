---
title: 用H5+CSS3实现自定义表单控件
tags: 
  - H5
  - CSS
  - Example
date: 2018-02-04
prev: false
next: false
sidebarDepth: 5
---
为什么要写这个文章呢？是因为写页面不可避免的就要用到表单控件啊，当然在我用最常用的text和button的时候，基本上用css直接改就可以覆盖其表单控件。
**BUT！！** 当我用到一些单选框、多选框、数字框、还有文件框的时候，就有了这种默认样式太过强大，超级的不合群（和整体的风格完全不同，什么鬼啊都是！），而且这些样式随着浏览器的不同样式还不一样，而且和各种不一样的系统有各自的风格，下面有一些我在使用过程中遇到的部分type的input样式，我也查了一些资料，这篇将不定期更新~


- **目录**
    + 自定义文本框input[type="text"]
    + 自定义单选框、多选框
       *  input[type="radio"]，input[type="checkbox"]
       *  图片
       *  字体图标
    + 自定义文件框 input[type="file"]
    + 自定义数字框 input[type="number"]



## 自定义文本框input[type="text"]
哈哈，这个改样式其实很简单，但是我还是要总结完整：
看一看不同浏览器中的文本框什么样？
**Chrome的文本框**——hover的时候没有状态，这是focus的时候的状态，渐变的蓝色框框。
![chorme默认文本框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c1eeb5f57?w=189&h=34&f=png&s=783)
**Firefox的文本框**——hover和focus的状态差不多，都是蓝色边框，这个没有渐变
![firefox默认文本框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c1e9494d1?w=164&h=39&f=png&s=611)
**IE的文本框**——向来就是特立独行的鹅，hover状态是蓝色的，focus状态就变成了黑色的框，IE10还有个小×是什么鬼，我点了一下我的value值都木有了，也是智能到要命。
![IEhover默认文本框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c1ed20c17?w=167&h=38&f=png&s=447)
![IEfocus默认文本框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c1eec48df?w=172&h=39&f=png&s=1054)

不过这个最简单，第一个是要去掉那个边框，第二个就是要去掉IE浏览器中的叉叉
下面是html
```html 
<input type="text" value="这是一个文本框"  id="text"/>
```
css
```css
#text{
  outline:none;
  border: 1px solid orange;  
 /*上面这个就可以解决问题啦
*/
/*下面这个就是随意写啦*/
  height: 30px;
  line-height: 30px;
  width: 140px;
  padding: 0 5px;
  font-size: 18px;

}
#text::-ms-clear{display: none;}
 /*这个只适用于IE10哦，如果要兼容IE9，IE8说是要用一个元素定位到这里，也有人说要用textarea来代替text，目前也没什么更好的办法*/
```
好了这下差不多了。
![自定义文本框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c1ea6be7a?w=171&h=46&f=png&s=727)


**密码框input[type="password"]也是一样哦**

![自定义密码框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c1f0ba9e6?w=170&h=46&f=png&s=274)


## 自定义单选框、多选框
### input[type="radio"]，input[type="checkbox"]
这个框框，看看他的本来面目
**Chrome的单选框**——灰灰的~
![Chrome的默认单选框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c3bb20dfe?w=57&h=30&f=png&s=806)

**Firefox和IE的单选框**——扁平化
![Firefox和IE的默认单选框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c3c55ffc7?w=56&h=30&f=png&s=314)

下面来优化：有两种方式，一种是找图片，让UI做一个和页面风格一样的单选框图片。还有一种就是使用字体图标，方便好使。
他们的html格式是不变的——**使用label+input的形式去自定义样式**

### 图片
先上html代码
```html
<!--label代表了整个单选域，里面的input是要有的，只不过是要隐藏掉，后面的i元素，是利用表单的图片进行的替代，后面的span用来写对应的文本-->
<label>
     <input type="radio" name="haha" value="haha"/>
     <i></i>
     <span>haha</span>
</label>
<label>
     <input type="radio" name="haha" value="hehe"/>
     <i></i>
     <span>hehe</span>
</label>
```
然后上css代码
```css
/*我从阿里巴巴下了一个32px × 32px的图标，放在了同目录下*/
/*把原来的单选框隐藏掉*/
input[type="radio"]{
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: none;
}

label{
     display: inline-block;
     cursor: pointer;
}

/*代替的图标*/
label input[type="radio"]+i{
     width: 32px;
     height: 32px;
     display: block;
     background: url("./radio.png") no-repeat;
     float: left;
}

/*选中的时候代替的图标*/
label input[type="radio"]:checked+i{
     background: url("./radio-active.png") no-repeat;
}

/*后面的文字说明*/
label input[type="radio"]~span{
    display: block;
    line-height: 32px;
    height: 32px;
    float: left;
    font-family: 'Microsoft Yahei';
}

/*选中的时候文字说明*/
label input[type="radio"]:checked~span{
     color: #38d6ff;
}
```
下面看一下效果图：
![自定义单选框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c3d405549?w=165&h=40&f=png&s=798)


### 字体图标
上html代码，只是在i标签里面加了font-awesome的字体图标
```html
<label>
      <input type="radio" name="haha" value="haha"/>
      <i class="fa fa-circle-o"></i>
      <span>haha</span>
</label>
<label>
       <input type="radio" name="haha" value="hehe"/>
       <i class="fa fa-circle-o"></i>
       <span>hehe</span>
</label>
```
css稍微有些变化
```css
input[type="radio"]{
     appearance: none;
     -webkit-appearance: none;
     outline: none;
     display: none;
}

label{
     display: inline-block;
     cursor: pointer;
}

label input[type="radio"]+i{
      width: 32px;
      height: 32px;
      display: block;
      float: left;
      text-align: center; /*字体图标垂直水平居中*/
      line-height: 32px;
      font-size:18px;  /*字体图标大小用字体大小来控制*/
}

label input[type="radio"]~span{
     display: block;
     line-height: 32px;
     height: 32px;
     float: left;
     font-family: 'Microsoft Yahei';
}
```

字体图标需要一些jquery代码
```javascript
$("i").click(function(){
    //如果是没有选中的情况
     if($(this).is(".fa-circle-o") == true){
           //当前的字体颜色改变，后面的字体改变
           $(this).css("color","#38d6ff").removeClass("fa-circle-o").addClass("fa-dot-circle-o").next().css("color","#38d6ff");
     }else{
           //选中的情况
           $(this).css("color","#000").removeClass("fa-dot-circle-o").addClass("fa-circle-o").next().css("color","#000");
    }
})
```
效果图如下
![字体图标自定义单选框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c3e521365?w=164&h=39&f=png&s=934)

## 自定义文件框 input[type="file"]
文件框原来是什么样？
**Chrome的文件框**
![Chrome的默认文件框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c552be37e?w=181&h=40&f=png&s=1153)
**firefox的文件框**（鼠标移上去的时候）
![firefox的默认文件框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c45a17d0a?w=154&h=37&f=png&s=787)
再来看看奇葩的**IE的默认文件框**（这也是鼠标hover状态的，我就不一一截不同的版本了，截完就明年了）
![谁也不服就服你的IE默认文件框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c587e2b76?w=237&h=35&f=png&s=898)

赶紧的粉刷匠的工程开启~~~~

下面来上代码，先了解一下html的结构
```html
<!--文件的input，需要隐藏的-->
<input type="file" id="myFile" class="myFile"/>
<!--实际显示出来的按钮-->
<div class="clickMe"></div>
<!--实际显示出来选择的文件名称-->
<span class="textShow"></span>
```

然后我们需要看看如何给这两个元素来设置样式
```css
/*input文件的样式，隐藏*/
.myFile{
    width:0;
    height:0;
    display:none;
}
/*按钮的样式，根据自己的需求来定*/
.clickMe{
    width: 105px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background-color: #00c8ff;
    text-align: center;
    cursor: pointer;
    float: left;
    margin-right: 10px;
}
/*选择文本名称的样式*/
.textShow{
    width: 100px;
    height: 30px;
    line-height: 30px;
}
```

下面就是js代码了，用的jquery记得引用的时候要下下载jquery哦~
```javascript
//给按钮绑定点击事件
$('.clickMe').off("click").on("click",function(){
        //当文件选择完毕之后，触发了改变的事件
        $("#myFile").off('change').on('change',function(){
            //获得的是绝对路径，并不是真实的路径，只是一个虚拟的路径
            var fileFullName = $(this).val();
            console.log(fileFullName);
            //获得的是文件名（正则表达式）
            var strFileName = fileFullName.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");
            console.log(strFileName);
            //获得的是后缀名（正则表达式）
            var fileExt = fileFullName.replace(/.+\./,"");
            console.log(fileExt);
            //将完整的名字填入文本框中
            var realFileName = strFileName + "."+fileExt;
            $(".textShow").text(realFileName);
        })
        //触发input的点击事件
        $(".myFile").click();
    })
```
获取文件的名称的方法很多，这只是用**正则表达式**来获取的。

下面来看看自定义的文件框是啥样？
![自定义文件框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c6942db2d?w=195&h=42&f=png&s=647)

完了之后会总结一些文件的表单控件的一些东西。还是就着这次的主题来~，这样的文件表单控件的样式就完成了。


## 自定义数字框 input[type="number"]
看看这默认的框
![chrome的默认数字框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c5e0c9533?w=185&h=35&f=png&s=312)
Firefox的默认框
![firefox的默认数字框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c636a5f41?w=162&h=35&f=png&s=268)
IE的默认框——和文本框没有什么区别好哇
![IE的默认数字框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c75f5d1b3?w=170&h=38&f=png&s=801)


其实这个的主要功能就是计数，一些购物网站上会用到比较多，下面来大改造一下：
先来看一下html的结构
```html
<!--外面要记得清除浮动，什么方法都可以-->
<div class="clearfix">
       <!--这个是数字框-->
       <input type="number" name="number" value="1" class="f_l" id="number" />
       <!--这个是后面的上下加减按钮-->
       <div class="f_l">
             <i class="add" id="add">+</i>
             <i class="subtract" id="subtract">-</i>
      </div>
</div>
```

然后是css添加样式
```css
/* 清除浮动 */
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

/*浮动*/
.f_l{
     float:left;
}

/*自定义数字框配置*/
input[type="number"]{
     width: 36px;
     height: 36px;
     border: 2px solid skyblue;
     border-radius: 4px 0 0 4px;  /*左上边和左下边有弧度*/
     color: #137ac6;
     font-size: 20px;
     padding: 0 10px;
     border-right: none;
     outline: none; /*去掉外边框*/
     -moz-appearance:textfield;/*给火狐浏览器去掉上下加减号*/
}

/*数字框旁边的加减号去掉*/
input[type="number"]::-webkit-inner-spin-button{
      -webkit-appearance: none;
}

input[type="number"]+div{
     cursor: pointer;
}

/*按钮的通用样式*/
input[type="number"]+div i{
     display: block;
     width: 28px;
     height: 17px;
     background-color: #137ac6;
     font-style: normal;
     line-height: 17px;
     text-align: center;
     font-size: 18px;
     color: #fff;
     border: 2px solid skyblue;
}

/*加号键的特殊样式，右上角有弧度*/
input[type="number"]+div > .add{
     border-bottom: none;
     border-radius: 0 4px 0 0;
}

/*减号键的特殊样式，右下角有弧度*/
input[type="number"]+div > .subtract{
     border-radius: 0 0 4px 0;
}
```

然后需要对两个div进行绑定事件，一个加数字一个减数字，减的数字不能超过0···
```javascript
//给加号按钮绑定事件
$("#add").on("click",function(){
    var add = $("#number").val();
    add++;
    $("#number").val(add);
})

//给减号按钮绑定事件
$("#subtract").on("click",function(){
    var subtract = $("#number").val();
    if(subtract > 0){
         subtract--;
    }
    $("#number").val(subtract);
})
```

然后用一张图看看效果: )
![自定义数字框.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a6c760c0a74?w=115&h=53&f=png&s=273)

