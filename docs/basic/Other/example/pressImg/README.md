---
title: 使用canvas压缩图片大小
tags: 
  - Canvas
  - H5
  - Example
date: 2019-08-02
prev: false
next: false
sidebarDepth: 5
---
## 问题来源
这个问题，源于上传图片文件的时候，后台限制了2MB的大小，but在调起相机拍照的时候分分钟超过了2MB,为了不影响用户体验和功能需求，需要前端对大小进行压缩，然后传到后台。

## 思路分析
找了很多资料，发现只有canvas可以对图片进行压缩处理。

原理大概就是：
1、先将图片的file文件转成baseURL
2、创建一个image标签去接收文件获取图片的宽高和比例。
3、创建canvas画布设置画布的大小。
4、将图片绘制到canvas上面。
5、对canvas进行压缩处理，获得新的baseURL
6、将baseURL转化回文件。

## 前提的函数
### 将file文件转化为base64
```js
/**
* @param {二进制文件流} file 
* @param {回调函数，返回base64} fn 
*/
function changeFileToBaseURL(file,fn){
  // 创建读取文件对象
      var fileReader = new FileReader();
      //如果file没定义返回null
      if(file == undefined) return fn(null);
      // 读取file文件,得到的结果为base64位
      fileReader.readAsDataURL(file);
      fileReader.onload = function(){
        // 把读取到的base64
        var imgBase64Data = this.result;
        fn(imgBase64Data);
      }
    }
```
### 将base64转化为文件流
```js
/**
 * 将base64转换为文件
 * @param {baseURL} dataurl 
 * @param {文件名称} filename 
 * @return {文件二进制流}
*/
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
 }
```

## 压缩方法
```js
/**
* canvas压缩图片
* @param {参数obj} param 
* @param {文件二进制流} param.file 必传
* @param {目标压缩大小} param.targetSize 不传初始赋值-1
* @param {输出图片宽度} param.width 不传初始赋值-1，等比缩放不用传高度
* @param {输出图片名称} param.fileName 不传初始赋值image
* @param {压缩图片程度} param.quality 不传初始赋值0.92。值范围0~1
* @param {回调函数} param.succ 必传
*/
function pressImg(param){
  //如果没有回调函数就不执行
  if(param && param.succ){
     //如果file没定义返回null
     if(param.file == undefined) return param.succ(null);
     //给参数附初始值
     param.targetSize = param.hasOwnProperty("targetSize") ? param.targetSize : -1;
     param.width = param.hasOwnProperty("width") ? param.width : -1;
     param.fileName = param.hasOwnProperty("fileName") ? param.fileName: "image";
     param.quality = param.hasOwnProperty("quality") ? param.quality : 0.92;
     var _this = this;
     // 得到文件类型
     var fileType = param.file.type;
     // console.log(fileType) //image/jpeg
     if(fileType.indexOf("image") == -1){
       console.log('请选择图片文件^_^');
       return param.succ(null);
     }
     //如果当前size比目标size小，直接输出
     var size = param.file.size;
     if(param.targetSize > size){
       return param.succ(param.file);
     }
     // 读取file文件,得到的结果为base64位
     changeFileToBaseURL(param.file,function(base64){
       if(base64){
         var image = new Image();
         image.src = base64;
         image.onload = function(){
           // 获得长宽比例
           var scale = this.width / this.height;
           // console.log(scale);
           //创建一个canvas
           var canvas = document.createElement('canvas');
           //获取上下文
           var context = canvas.getContext('2d');
           //获取压缩后的图片宽度,如果width为-1，默认原图宽度
           canvas.width = param.width == -1 ? this.width : param.width;
           //获取压缩后的图片高度,如果width为-1，默认原图高度
           canvas.height = param.width == -1 ? this.height : parseInt(param.width / scale);
           //把图片绘制到canvas上面
           context.drawImage(image, 0, 0, canvas.width, canvas.height);
           //压缩图片，获取到新的base64Url
           var newImageData = canvas.toDataURL(fileType,param.quality);
           //将base64转化成文件流
           var resultFile = dataURLtoFile(newImageData,param.fileName);
           //判断如果targetSize有限制且压缩后的图片大小比目标大小大，就弹出错误
           if(param.targetSize != -1 && param.targetSize < resultFile.size){
             console.log("图片上传尺寸太大，请重新上传^_^");
             param.succ(null);
           }else{
             //返回文件流
             param.succ(resultFile);
           }
         }
       }
     });
   }
 }
```

## 方法使用
>文件的size是按照字节，所以我们需要把要求的大小转化成字节。
1字节就是1byte就是1B，1KB = 1024B，1MB = 1024 * 1024B
```html
<input type="file" id="fileImg" class="fileImg"/>
```
```js
// 图片文件上传获取url
$("#fileImg").on('change',function(){
   pressImg({
     file:this.files[0],
     targetSize:2 * 1024 * 1024,
     quality:0.5,
     width:600,
     succ:function(resultFile){
         //如果不是null就是压缩成功
         if(resultFile){
           //TODO
        }
     }
  })
});
```

## 问题总结
### 图片压缩程度
图片的压缩程度不太好确定，所以可以进行多次尝试，根据需求方的要求进行调整。
改变目标图片的大小和清晰度都可以改变图片的压缩程度。
### 本来想做一个压缩图片的递归，直到图片大小符合期望
后来发现
- 如果目标大小比较小，图片如何进行压缩都不能满足条件的时候，会造成循环无法跳出，浪费资源。
- 如果图片进行几次压缩之后，文件大小不会改变了，有的时候还会增加，奇奇怪怪。
所以就放弃了递归。

### ios拍摄方向问题
因为ios调起系统相机拍照是逆时针旋转了90度。
而在我压缩图片之后传到后台，发现图片的exif信息的拍摄方向丢失，导致ios上传的图片都是逆时针旋转了90度。这个问题安卓不曾发现。

![image.png](https://user-gold-cdn.xitu.io/2019/8/2/16c506706b3bd4f8?w=259&h=145&f=png&s=1900)

目前有些怀疑，是base64转化成file文件的时候，丢失的。
之后验证后会在这里进行补充说明。

