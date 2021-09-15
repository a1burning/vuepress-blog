---
title: 前端浏览器加载照片方向问题的研究
tags: 
  - JavaScript
  - Example
date: 2019-07-09
prev: false
next: false
sidebarDepth: 5
---
## 问题描述

这个问题之所以不常发现，是因为我们很少加载手机拍摄的图片，更少加载图片被人为旋转过的图片。

> 在我们加载图片的时候，浏览器有时候加载带有旋转信息的图像文件的时候方向有旋转的偏差，下面就是深度剖析一下这个问题和解决方案。

## 了解手机拍摄方向

一张图带你了解手机拍摄方向和在手机系统中呈现的样式。
![手机拍摄方向.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5d053202e?w=1227&h=744&f=png&s=667860)
  这些照片拍出来，不管呈现是不是正的，EXIF里面的旋转信息都为1，表示正方向。

可以看出来，

> **如果是`垂直方向`拍出来的，会根据横向纵向进行方向的调整。**
 **如果是`水平方向`拍出来的，因为无法判断手机的方向，所以拍的总是按照横短竖长为正方向。**

## 关于照片的EXIF信息

Exif就是用来记录拍摄图像时的各种信息：

*   图像信息（厂商，分辨率等）

*   相机拍摄记录（ISO，白平衡，饱和度，锐度等）

*   缩略图（缩略图宽度，高度等）

*   gps（拍摄时的经度，纬度，高度）等

将这些信息按照JPEG文件标准放在图像文件二进制流的头部。

## 浏览器如何加载图片

那么一个图片如何加载的呢？上面的图片使用了`<div>+backgroundImage`和`<img>+src`两种方式渲染。
![浏览器正常加载图片.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5d070c35a?w=1240&h=663&f=png&s=454737)
可以看出来，渲染的效果和手机刚拍摄的展示的效果是一样的。

那么我们现在，点击图片右键将图片进行旋转。再看效果。
![向右旋转.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5d0a5c7a4?w=282&h=240&f=png&s=3197)
*   第一张照片顺时针旋转一次

*   第二张照片顺时针旋转两次

*   第三张照片顺时针旋转一次

*   第四张照片逆时针旋转一次
![旋转之后的图片方向.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5d0b04a36?w=481&h=136&f=png&s=48549)
这个时候，**`发现加载的方向依旧和没有旋转过是一样的。`** （为了避免是没刷新啥的，我还修改了一下样式）
![旋转之后没有任何变化.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5d0f807b8?w=1240&h=614&f=png&s=402990)
然后我们再将图片使用图片工具打开，进行旋转保存，查看效果。
![使用照片编辑器编辑图片.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5d1ac06c2?w=586&h=962&f=png&s=349582)
* * *
![使用画板编辑图片.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5f57b3ff7?w=732&h=1269&f=png&s=324990)
然后在浏览器展示看，发现浏览器加载的图片进行了旋转
![旋转之后没有任何变化.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5ebd709bd?w=1240&h=614&f=png&s=402990)
可以看出来，在html进行加载的时候，根据不同的渲染方式，会有不一样的展示。原因是什么呢？

> *   **使用电脑右键的旋转或者手机直接旋转**
>     
>     
> 
> 只是更改了图像附加的EXIF的一些旋转信息，本身图片的元数据并没有进行改变。
> 
> *   **使用图画工具或者照片编辑器进行旋转保存**
>     
>     
> 
> 会直接更改图片的元数据，并将当前的EXIF旋转信息置为正方向。

**浏览器会根据图片本身的元数据进行渲染。会忽略EXIF里面的旋转信息Orientation，永远展示的是Orientation为1的方向。**

## 遇到这种问题我们如何解决？

### 解决思路

只要我们可以获取到图片本身的信息，就可以对其方向进行判断了。  但是本身文件并没有给我们暴露那些接口获取信息，使用原生方法比较复杂。  还好的是有一个插件`exif.js` 解决了这个问题。

[exif.js插件API](http://code.ciaoca.com/javascript/exif-js/)

### exif.js的使用

#### 1\. 先引用js文件
```js
<script src="exif.js"></script>
```
#### 2\. 使用方法获得对应img图片的exif信息
```js
EXIF.getData(document.getElementById('img'), function(){
  EXIF.getAllTags(this); //获取所有信息，以对象形式返回
  EXIF.getTag(this, 'Orientation')	//获取图像的Orientation指定属性值
  EXIF.pretty(this); //获取所有信息，以字符串形式返回
});
```
#### 3\. 根据Orientation的值不为6，判断需要进行旋转，使用css进行相应的旋转

根据值的不同做不同的旋转

[可供参考的exif-orientation说明](https://www.impulseadventure.com/photo/exif-orientation.html)
![exif-orientation说明.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5f88ad59b?w=516&h=249&f=png&s=9358)

| 参数 | 0行（未旋转上） | 0列（未旋转左） | 旋转（方法很多） |
| --- | --- | --- | --- |
| `1` | 上 | 左 | 0° |
| 2 | 上 | 右 | 水平翻转 |
| `3` | 下 | 右 | 180° |
| 4 | 下 | 左 | 垂直翻转 |
| 5 | 左 | 上 | 顺时针90°+水平翻转 |
| `6` | 右 | 上 | 顺时针90° |
| 7 | 右 | 下 | 顺时针90°+垂直翻转 |
| `8` | 左 | 下 | 逆时针90° |

### exif.js原理思路

1.  首先定义了一套16进制数据对应的种类标记，已经种类对应的值的含义
![EXIF tags.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c5fa48d272?w=372&h=682&f=png&s=14265)
2.  根据图片的加载途径不同，殊途同归的转化成`ArrayBuffer对象`，并创建一个`DataView对象`进行操作。
![exif流程图.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c60a455119?w=540&h=346&f=png&s=13641)
3.  根据一套规则去解析`ArrayBuffer对象`

*   先判断其是不是jpeg图片文件**`（照片只存储jpg格式，不存储png格式，所以不需要进行png文件的考虑）`**

> 二进制文件通过文件头识别文件类型
> 
> jpeg的头文件标识是(0xFF, 0xD8)，这是JPEG协议规定的
> 
> 用16进制转化为10进制为(255,216)，如果是jpeg文件我们就进行下一步解析。

![二进制文件类型.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c6067def8d?w=744&h=452&f=png&s=27455)
*   然后找到对应的Exif字母标记，找到开始读取信息

4.  匹配上面的键值对，进行配对输出。
![最终输出exif对象.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c616f30c84?w=413&h=159&f=png&s=4084)
### 一些专有名词？

#### ArrayBuffer？

[ArrayBuffer MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
![arrayBuffer.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c61bac2aed?w=712&h=214&f=png&s=8694)

> `ArrayBuffer 对象` 用来表示通用的、固定长度的原始二进制数据缓冲区。
> 
> 根据不同的类型进行区分
> 
> *   `Uint8Array`是无符号八进制数组
>     
>     
> *   `Int8Array`是有符号八进制数组
>     
>     
> *   `Int16Array`是有符号16进制数组。
>     
>     
> 
> 其中`ArrayBuffer对象`不能直接操作，原型链上也没有暴露的方法，所有只能通过`类型数组对象`或`DataView对象`来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

#### DataView？

[DataView MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)

![dataView.png](https://user-gold-cdn.xitu.io/2019/7/9/16bd63c61c5e18d3?w=706&h=628&f=png&s=18117)

> `DataView对象`用于呈现指定的缓存区数据，可以认为是一个二进制解释器，下面的不同的方法，就是根据不同的位数去取数据进行解析。
```js
var buffer = new ArrayBuffer(16);
var dv = new DataView(buffer);

dv.setInt16(0, 42);
dv.getInt16(0); //42
```

