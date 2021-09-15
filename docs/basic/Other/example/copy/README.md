---
title: 实现前端点击按钮自动复制剪贴板功能
tags: 
  - JavaScript
  - Example
date: 2018-05-07
prev: false
next: false
sidebarDepth: 5
---
只要是文本，长按选中就可以复制，但是需求来了挡也挡不住：
## 明确需求
为了提升用户体验，点击【复制】按钮就自动复制到剪贴板，那么就需要前端实现这种功能了。

首先明确了需求就先看一下最终图片：
![copy.jpg](https://user-gold-cdn.xitu.io/2018/5/7/163392f99478483e?w=323&h=84&f=jpeg&s=2076)

## html分析
左边是一个input的文本框，只读，右边是一个按钮。
### 代码实现：
```html
<!--左边是一个input输入框，要求只读，而且里面的内容通过url?后面的code传入-->
<input type="text" value="AJS4EFS" readonly id="textAreas"/>
<!--右边是一个按钮-->
<a href="javascript:;" class="cuteShareBtn" id="copy">复制</a>
```
## css分析
这种东西就跳过吧，不是重点。
## js分析
1. 点击按钮获取input对象
>解决方法：
>1. 如果使用的jquery，那么直接$("#textArea").select()选中的就是这个input对象
>2. 如果使用的zepto，上面的方法是获取到的zepto对象是不支持原生select()方法的，那么就使用原生的办法
> `var obj = document.getElementById("textAreas");`
> `obj.select();`
2. 然后复制到剪贴板

两行？看起来是不是很简单？哈哈~那你就错了，这里面是有坑的。
第一目前没有一个很完美的方法可以兼容各个浏览器和移动端，引用插件也是一样的。
查了半天最好的办法就是使用 **document.execCommand("Copy")** 
兼容性是不错的：
![use1.jpg](https://user-gold-cdn.xitu.io/2018/5/7/163392f994522bd0?w=1240&h=892&f=jpeg&s=52231)
![use.jpg](https://user-gold-cdn.xitu.io/2018/5/7/163392f9946584e9?w=1240&h=919&f=jpeg&s=91534)

手机安卓支持到4.1、各种浏览器是可以的，**但是唯独ios是不支持的**，来给我把刀，ios你这玩意你限制是干什么？是要保护手机安全还是咋的。
所以只是**pc端** 使用那么就下面几行代码就可以搞定了：
### 代码实现
```javascript
//复制按钮事件绑定
$("#copy").on("tap",function(){
  //获取input对象
  var obj = document.getElementById("textAreas");
  //选择当前对象
  obj.select(); 
  try{
    //进行复制到剪切板
    if(document.execCommand("Copy","false",null)){
      //如果复制成功
      alert("复制成功！");  
    }else{
      //如果复制失败
      alert("复制失败！");
    }
  }catch(err){
    //如果报错
    alert("复制错误！")
  }
})
```
那如果是**移动端** 的话，就要兼容IOS，但是依然在iPhone5的10.2的系统中，依然显示复制失败，由于用户使用率较低，兼容就做到这里，那些用户你们就自己手动复制吧。
下面的两种方法都可以进行复制，因为核心代码就那么几行，先来简单的：
```javascript
$("#copy").on("tap",function(){
  //获取input对象
  var obj = document.getElementById("textAreas");
  //如果是ios端
  if(isiOSDevice){
    // 获取元素内容是否可编辑和是否只读
    var editable = obj.contentEditable;
    var readOnly = obj.readOnly;

    // 将对象变成可编辑的
    obj.contentEditable = true;
    obj.readOnly = false;

    // 创建一个Range对象，Range 对象表示文档的连续范围区域，如用户在浏览器窗口中用鼠标拖动选中的区域
    var range = document.createRange();
   //获取obj的内容作为选中的范围
    range.selectNodeContents(obj);
    
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    obj.setSelectionRange(0, 999999);  //选择范围，确保全选
    //恢复原来的状态
    obj.contentEditable = editable;
    obj.readOnly = readOnly;
    //如果是安卓端    
  }else{
    obj.select();
  }
  try{
    if(document.execCommand("Copy","false",null)){
      alert("复制成功！");  
    }else{
      alert("复制失败！请手动复制！");
    }
  }catch(err){
    alert("复制错误！请手动复制！")
  }
})
```


下面是一个比较完整的升级版方法，和插件Clipboard.js一样，不过代码不多，就直接拿来用好了。
这个获取的不是input对象，而是需要复制的内容。
```javascript
//定义函数
window.Clipboard = (function(window, document, navigator) {
  var textArea,
      copy;

  // 判断是不是ios端
  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }
  //创建文本元素
  function createTextArea(text) {
    textArea = document.createElement('textArea');
    textArea.value = text;
    document.body.appendChild(textArea);
  }
  //选择内容
  function selectText() {
    var range,
        selection;

    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

//复制到剪贴板
  function copyToClipboard() {        
    try{
      if(document.execCommand("Copy")){
        alert("复制成功！");  
      }else{
        alert("复制失败！请手动复制！");
      }
    }catch(err){
      alert("复制错误！请手动复制！")
    }
    document.body.removeChild(textArea);
  }

  copy = function(text) {
    createTextArea(text);
    selectText();
    copyToClipboard();
  };

  return {
    copy: copy
  };
})(window, document, navigator);

```
使用函数
```javascript
//使用函数
$("#copy").on("tap",function(){
  var  val = $("#textAreas").val();
  Clipboard.copy(val);
});
```


这样就实现了前端点击按钮自动复制剪贴板的功能。

