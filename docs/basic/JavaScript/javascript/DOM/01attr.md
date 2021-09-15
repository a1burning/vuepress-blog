---
title: JS、Jquery的属性操作方法总结
tags: 
  - JavaScript
  - Jquery
date: 2018-10-09
prev: false
next: false
sidebarDepth: 5
---
## 属性分为三种：
1. html标签特性，例如普通的class，input中的name等
2. 用户自定义属性，div中设置的cmd、time属性等
3. 用户自定义data-属性，这个是DOMStringMap的一个实例。区别于上面的。
## js原生属性操作方法
- 获取属性 getAttribute()
- 设置属性 setAttribute()
- 删除属性 removeArrtibute()
- 自定义数据属性 dataset
- dataset与attribute的比较

```html
<div id="example"></div>
```

### 获取属性
**方法**

> `domObj.getAttribute(attribute);`<br/>
> - dom元素调用方法<br/>
> - 参数是属性名<br/>
> - **该方法是js原生方法去获得DOM属性值**
> - 返回的值不管之前是什么，都**返回string字符串格式**

**栗子**

```js
var domObj = document.getElementById("example");
var id = domObj.getAttribute("id");  //"example"
typeof id //"string"
```

### 设置属性
**方法**
> `domObj.setAttribute(attribute,value);`<br/>
> - dom元素调用方法<br/>
> - 参数1是属性名<br/>
> - 参数2是设置的值<br/>
> - 如果有此属性，直接更改覆盖原属性值<br/>
> - 如果无此属性，创建属性，并设置属性值

**栗子**
```js
var domObj = document.getElementById("example");
domObj.getAttribute("title");  //null  不存在属性便会返回null
domObj.setAttribute("title","good");
domObj.getAttribute("title"); //"good"
```

### 删除属性
**方法**
> `domObj.removeAttribute(attribute);`<br/>
> - dom元素调用方法<br/>
> - 参数1是属性名<br/>
> - 如果传多个参数或者不传参数会报错，只能一个属性一个属性的删除


**栗子**

```js
var domObj = document.getElementById("example");
domObj.removeAttribute("class");
domObj.getAttribute("class"); //null
```
### 自定义数据属性 dataset
HTML5新增的用户自定义属性，并规定形式为"data-"，**目的是为元素提供与渲染无关的信息，或者提供语义信息。** 很多时候，我们会把一些信息定义到dom元素中，以供使用。
形式如下：

```html
<div class="add" data-id="12" data-type-name="normal"></div>
```

而定义了自定义属性之后，可以通过元素的dataset属性来访问自定义属性的值，也可以进行设置。
>dataset属性的值是DOMStringMap的一个实例，其中有映射关系，<br/>
**规则如下:**<br/>
>- data-name在dataset对象中属性是name。
>- data-id-name在dataset对象中属性是idName
>- data自定义属性设置之后还是会==返回string字符串格式==

#### 获得自定义属性的值

```js
var example = document.getElementById("example");
var id = example.dataset.id;  //12
var type = example.dataset.typeName;  //normal
```
#### 设置自定义属性的值

```js
var example = document.getElementById("example");
example.dataset.id = 12345;  //12345
example.dataset.typeName = 'special';  //special
```

#### 删除自定义属性

```js
var example = document.getElementById("example");
//删除属性和值
delete example.dataset.typeName;   //true
example.dataset.typeName   //undefined
//只删除值
example.dataset.typeName = "";
```

#### 判断是否有此属性

```js
var example = document.getElementById("example");
if(example.dataset.id){
    alert("hello");
}
```

#### dataset的问题
##### 1. 兼容问题

![兼容问题](https://user-gold-cdn.xitu.io/2018/10/9/16658372c25c2986?w=1240&h=521&f=png&s=129071)

一些浏览器如`IE11-,andriod 2.3-,ios10-`是没有dataset这个对象的，所以如果要兼容低版本的浏览器，需要加上兼容代码：

```js
if(example.dataset){
    example.dataset.idName='12';
}else{
    example.setAttribute('data-id-name','12');
}
```

##### 2. 值类型问题
dataset和attribute设置的数值就算是true、123、[1,2,3]，在读取的时候仍然是==字符串类型== 

```js
var example = document.getElementById("example");

example.dataset.idName = 123;
typeof example.dataset.idName;  //"string"

example.dataset.idName = true;
typeof example.dataset.idName; //"string"

example.setAttribute("time",123456);
example.setAttribute("ok",true);

typeof example.getAttribute("time"); //"string"
typeof example.getAttribute("ok"); //"string"
```


### dataset与attribute的比较
- dataset在运行速度上面没有attribute快，但是就其数量时间几乎可以忽略不计，而他可以让我们省去很多attribute带来的麻烦，具有较强的可读性，尤其在添加一些不可见的数据以便进行其他处理，**使用自定义属性比较好。但是如果需要兼容低版本，dataset是有兼容问题的。**<br/>
- dataset设置的属性，getAttribute是可以访问的，：

```js
example.dataset.idName = 'hello';
example.getAttribute("data-id-name"); //"hello"
```

## jquery属性方法操作
- 获取和设置属性 attr() 
- 删除属性 removeAttr()
- 获取和设置特性 prop()
- 删除特性 removeProp()
- 获取和设置自定义属性 data()


### 获取和设置属性 attr()
#### 获取属性
**方法**
> `$div.attr(attribute);`<br/> 
> - 传一个参数是获取元素属性的值<br/>
> - 参数是“属性名”<br/>
> - 用attr获取的属性值，无论设置的时候是什么，都**返回string字符串类型**

**栗子**

```js
var $div = $("#example");
var titleValue = $div.attr("title"); //获取title属性值
//如果读取的是data-属性
var dataTitleValue = $div.attr("data-title"); //获取data-title属性值
```

#### 设置属性
**方法**
> 设置单个属性值<br/> 
> `$div.attr(attribute,value);`<br/> 
> - 传两个参数是设置元素属性的值<br/>
> - 参数1是要设置的**属性名**<br/>
> - 参数2是要设置的**属性值**<br/>

> 设置多个属性值<br/> 
> `$div.attr({attribute1:value,attribute2:value});`<br/> 
> - 传一个json对象，里面的属性分别是键/值<br/>

**栗子**

```js
var $div = $("#example");
$div.attr({"title":"good","time":10,"ok",false});
var titleValue = $div.attr("title");
//"good"
typeof titleValue;
//"string"
var timeValue = $div.attr("time");
//"10"
typeof timeValue;
//"string"
var okValue = $div.attr("ok");
//"false"
typeof okValue;
//"string"


//设置data-属性值
var dataTitleValue = $div.attr("data-title","ohhh");
//"ohhh"
```

### 删除属性  removeAttr()
**方法1**
> `$div.removeAttr(attribute);`<br/> 
> - 传一个参数是删除特定属性<br/>
> - 参数是“属性名”<br/>

**方法2**
> `$div.removeAttr(attribute1 attribute2);`<br/>
> - 传一个参数并用空格隔开可以删除多个属性<br/>
> - 参数是“属性名1 属性名2 ...”<br/>


**栗子**

```js
var $div = $("#example");
//<div id="example" data-title="hello" title="good" class="add"></div>

//if:
$div.removeAttr("title");
//<div id="example" data-title="hello" class="add"></div>
var titleValue = $div.attr("title");
//undefined

//else if
$div.removeAttr("title class");
//<div id="example" data-title="hello"></div>

//删除自定义属性值
$div.removeAttr("data-title");
//<div id="example"></div>
```

**与attr("title","")的区别**<br/>
removeAttr("title")是删除整个“title”属性，而attr("title","")是删除“title”属性的值：

```js
//<div id="example" title="hello"></div>
removeAttr("title");
//<div id="example"></div>
attr("title","")
//<div id="example" title></div>
```

### 获取和设置特性 prop()

#### 获取属性
**方法**
> `$div.prop(property);`<br/> 
> - 传一个参数是获取元素属性的值<br/>
> - 参数是“属性名”<br/>
> - 用attr获取的属性值，无论设置的时候是什么，都==返回string字符串类型==

**栗子**
```js
var $div = $("#example");
var titleValue = $div.prop("title"); //获取title属性值
```

#### 设置属性
**方法**
> 设置单个属性值<br/> 
> `$div.prop(property,value);`<br/> 
> - 传两个参数是设置元素属性的值<br/>
> - 参数1是要设置的**属性名**<br/>
> - 参数2是要设置的**属性值**<br/>

> 设置多个属性值 **(zepto不支持)**<br/> 
> `$div.prop({property1:value1,property2:value2});`<br/> 
> - 传一个json对象，里面的属性分别是键/值<br/>

**栗子**

```js
var $div = $("#example");
$div.prop("title","good");
var titleValue = $div.prop("title");
//"good"
```

### 删除属性  removeProp()
**方法1**
> `$div.removeProp(property);`<br/> 
> - 传一个参数是删除特定属性<br/>
> - 参数是“属性名”<br/>
> - 删除之后此属性值为undefined;

**栗子**

```js
var $div = $("#example");
$div.removeProp("title");
var titleValue = $div.prop("title");
//"undefined"
```


### 特别说明（prop必看）
**prop()方法主要针对于html的固有属性**，所以就会有在读取属性值的时候，很多时候是读不到的。那我们可以用prop读的范围有哪些？

标签 | property 
:---:|:---:
html | lang,id,class,style,title,tabIndex
div | id,class,style,title,tabIndex
input | id,class.style,title,tabIndex




例如：

属性 | attr | prop | 说明
:---:|:---:|:---:|:---:
div-->class | can | can | 固有属性
div-->name | can | undefined | 自定义属性
div-->data-time | can | undefined | 自定义data属性
input -->type | can | can | 固有属性
input-->time | can | undefined | 自定义属性
input-->data-type | can | undefined | 自定义data属性

#### 输出比较表(未完)
element | 属性 | example | attr | prop
:---:|:---:|:---:|:---:|:---:
全局属性 | id | `<div id="hello"></div>` | hello | hello
全局属性 | class | `<div class="hello"></div>` | hello | hello
全局属性 | **style** | `<div style="color:red;"></div>`| color:red; | [CSSStyleDeclaration对象]( https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration)
全局属性 | title | `<div title="hello"></div>` | hello | hello
全局属性(基本作用于`<html>`中,以下标签无效`<base>,<br>,<frame>,<frameset>,<hr>,<iframe>,<param>,<script>` | lang | `<html lang="en"></html>` | en | en
全局属性(作用在于div,a,input利用tab键获得焦点且有顺序) | ==tabIndex== | `<div tabindex="0" onfocus='console.log("得到焦点!");'>ohhhh</div>` | "0"("string") | 0("number")

### 获取和设置自定义属性 data()
#### 获取自定义属性
**方法**
> `$div.data(attribute);`<br/> 
> - 传一个参数是获取元素属性的值，如果没有参数获取的是元素全部属性键值对组成的对象<br/>
> - 参数是“属性名”<br/>
> - 用attr获取的属性值，存的时候是什么类型的值，就是什么类型的值（包括数组和对象） 

**栗子**
```js

var $div = $("#example");
$div.data("title",12345);
var title = $div.data("title");
// 12345
typeof title
// "number"
$div.data("haha",true);
var value = $div.data();
// { title:12345 , haha:true }
console.log(value.title);
//12345
value.title = "houhou";
console.log($div.data());
// { title:"houhou" , haha:true }
```


#### 设置自定义属性
设置自定义属性的时候，在DOM上不会有信息出现。但是已经临时存下了变量的值。

**注意** undefined是不认可的属性值，如果第二个值传undefined，视为不传值，变为获取属性。
##### 设置单个属性值
**方法1**
> `$div.data(key,value);`<br/> 
> - 传两个参数是设置元素属性的值<br/>
> - 参数1是要设置的==属性名==<br/>
> - 参数2是要设置的==属性值==,可以是的那个的值，也可以传obj<br/>

**栗子**
```js
var $div = $("#example");
$div.data("title",{myData:"yoyo",count:40});
var titleValue = $div.data("title");
//{myData:"yoyo",count:40}
$div.data("time",true);
var timeValue = $div.data("time");
//true
```

**方法2**
> `$div.data(obj);`<br/> 
> - 传一个对象参数是设置元素属性的值<br/>
> - 参数中的键是要设置的==属性名==，值是要设置的==属性值==<br/>

**栗子**
```js
var $div = $("#example");
$div.data({"title":{myData:"yoyo",count:40}});
var titleValue = $div.data("title");
//{ myData:"yoyo" , count:40 }
```

##### 设置多个属性值
**方法**
> `$div.data({key1:value1,key2:value2});`<br/> 
> - 传一个json对象，里面的属性分别是键/值<br/>

**栗子**
```js
var $div = $("#example");
$div.data({"title":{myData:"yoyo",count:40},"time":true});
var titleValue = $div.data("title");
//{ myData:"yoyo" , count:40 }
var timeValue = $div.data("time");
//true
```

### 删除自定义属性 removeData()
**方法**
> `$div.removeData(key);`<br/> 
> - 传一个参数是删除特定属性<br/>
> - 参数是“属性名”<br/>
> - 删除之后此属性值为undefined; 

**栗子**
```js
var $div = $("#example");
$div.removeData("title");
var titleValue = $div.data("title");
//"undefined"
```


---
## 总结
### 取属性出来有没有被强制转化为字符串
获取属性 | 是否强制转化
:---:|:---:
getAttribute("title") | true
dataset.title | true
attr("title") | true
prop("title") | true
data("title") | false


### 没有此属性，返回值是什么？

获取属性 | 返回值
:---:|:---:
getAttribute("title") | null
dataset.title | undefined
attr("haha") | null
attr("title") | ""
prop("title") | ""
prop("haha") | undefined
data("title") | undefined

### attr()与data()
1. attr设置的属性，data可以取到，但是data进行修改之后，两者取到的值会不一样。

```js
var $div = $("#example");
$div.attr("data-houhou",123456);
$div.attr("data-houhou");
//"123456"  --> string
$div.data("houhou");
//123456 --> number

//用data修改houhou的值，attr取到的值不会变。
$div.data("houhou",789);
$div.attr("data-houhou");
//"123456"  --> string
$div.data("houhou");
//789 --> number
```

2. data设置的属性值，attr()无法获取到

```js
var $div = $("#example");
$div.data("houhou",123456);
$div.attr("data-houhou");
//null
$div.data("houhou");
//123456 --> number
```

3. jquery和zepto已经做了很多兼容处理
所以在没有兼容问题下，data()方法比attr()使用的效率更高，而且没有值被转化类型的风险，==所以推荐使用data()==。


4. 是否显示在DOM上面
在使用data()在html上面没有属性值的显示，可以通过data来取，attr()是会表现在html上面的。

### 元素集(未完)
上面的属性操作方法如果是获得的元素集。
那么是取第一个元素进行操作。

### attr的input中的checked属性问题

在复选框的checked函数，没选中回返回undefined，选中返回checked，这个时候使用prop可以获取html标签中属性的值，复选框选中状态获取的true，未选中获取的是false


对于HTML元素本身就带有的固有属性，在处理时，使用prop(),removeProp()。 <br/>
对于HTML元素我们自己自定义的DOM属性，在处理时，使用attr(),removeAttr()。<br/>

attr与prop区别
http://www.cnblogs.com/Showshare/p/different-between-attr-and-prop.html

