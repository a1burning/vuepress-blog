---
title: 如何用jQuery加载并解析XML?
tags: 
  - jQuery
  - Tools
date: 2017-08-30
sidebarDepth: 5
---
# 如何用jQuery加载并解析XML?

## 什么是XML？
`XML（eXtensible Markup Language）`即可扩展标记语言。
## XML语法
在`XML`中采用如下的语法

### 1. 任何起始标签都必须有一个结束标签；
```xml
<!--以下代码错误，XML必须是封闭的，它没有闭合-->
<?xml version="1.0" encoding="UTF-8"?> 
<name>zhangsan
```

### 2. 可以采用另一种简化语法，即在一个标签中同时表示起始和结束标签。
这种语法是：`<tag/>`。在`XML`解析器中会将其翻译成`<tag></tag>`。

(ps:很像`html`中的单标签是不？`^ ^`)

### 3. 标签必须按照合理的顺序进行嵌套，因此结束标签必须按镜像顺序匹配起始标签。
```xml
<!--以下代码错误，因为在没有关闭所有内部括号之前，不能关闭外面的括号-->
<?xml version="1.0" encoding="UTF-8"?> 
<name>zhangsan<i>sample</name>haha</i>
```
### 4. 所有的属性都要有值，并且需要在值的周围加上双引号。

### 5. `XML`文档只能有一个顶层元素。
```xml
<!--以下代码错误，因为它有多个顶层元素-->
<?xml version="1.0" encoding="UTF-8"?> 
<name>zhangsan</name>
<id>1</id>
<name>wangwu</name>
<id>2</id>
```

### 6. XML可以使用自定义标签。

因为`XML`中没有预定义标签，所以`XML`允许创作者定义自己的标签和自己的文档结构。

## 正确的XML格式范例
```xml
<?xml version="1.0" encoding="UTF-8"?> 
<stulist>
      <student email="123456@qq.com">
              <name>xiaoming</name>
              <age>20</age>
      </student>
      <student email="234567@qq.com">
              <name>xiaogang</name>
               <age>21</age>
      </student>
</stulist>
```

## 加载XML
### Content-Type设置 
加载`XML`的时候，如果`Content-Type`本身就是一个`XML`文件则是不需要设置；如果是后台程序动态生成，那么就需要设置`Content-Type`为`"text/xml"`，否则`jQuery`就会以默认的`"text/html"`方式处理，导致解析失败。

以下是几种常见语言中设置`Content-Type`的方式。

#### PHP
> header("Content-Type:text/xml");
#### ASP
> response.ContentType="text/xml";
#### JSP
> response.setContentType("text/xml");

## 获取XML
如果有了正确的`XML`结构的文件，那么就可以通过`jQuery`的`Ajax`函数进行读取了，`jQuery`代码如下：
```javascript
$.ajax({
  url:'ajax.xml',
  type:'GET',
  dataType:'xml',
  timeout:1000,       // 设定超时
  cache:false,         // 禁用缓存
  error:function(xml){
    alert("加载XML文档出错");
  },
  success:function(xml){
    // 这里用于解析XML
  }
})

```
这样就可以读取`XML`，当然也可以用简单的`$.get()`方法和`$.post()`方法
```javascript
$.get('ajax.xml',function(xml){
    //这里用于解析XML
    console.log(xml);
});
```

![console1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc30d42e6a8240f381f1dc9a99eeea63~tplv-k3u1fbpfcp-zoom-1.image)


## 解析XML
解析`XML`文档和解析`DOM`一样，也可以用`find()`、`children()`等函数来解析和用`each()`方法来进行遍历，另外也可以用`text()`和`attr()`方法来获取节点文本和属性。例如在`success`回调里解析`XML`：

```js
success:function(xml){
  $(xml).find("student").each(function(i){ // 查找所有student节点并遍历
    var age = $(this).children("age"); // 取得子节点
    var age_value = age.text();  // 取节点文本
    console.log(age_value);  // id的值
    console.log($(this).attr("email"));  // 显示student的属性
  })
}

//下面这种写法也对哦
$.get("xml.xml",function(xml){
   $(xml).find("student").each(function(i,val){
     var age = $(val).children("age");
     var age_value = age.html();
     console.log(age_value);   
     console.log($(val).attr("email"));
   })
})
```

结果如图所示：

![console2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92564cddd9d048cdbd244e3f39b569c6~tplv-k3u1fbpfcp-zoom-1.image)


通过上面的代码，能成功获取到相应的数据，接下来就可以将解析出来的数据添加到已有的`HTML`文件中。

## 禁用缓存 —— 解决更新不及时的问题

这个问题在红宝书上看到，具体实践中也没有碰到过，所以就先记录下来把。

我们在项目中经常会遇到一个问题，就是数据已经更新了，但传递的还是以前的数据，要避免这种情况，就应该禁用缓存。
- 如果是使用`$.ajax`的方法，只需要在`cache`属性中设置`false`， **要注意`false`是布尔值不是字符串** 
- 如果是使用`$.post`的方法，默认就是禁用缓存的。
- 如果是使用`$.get`的方法，可以通过设置时间戳来避免缓存：
```javascript
 $.get('ajax.xml?'+(+new Date).function(xml){
   //...
});
//（+new Date）等价于 new Date().getTime()
```
> 注：之所以不用随机数，是因为随机数大量使用会出现重复的概率挺大，而用时间戳就不会出现这种情况。

## 加载不上or解析不成功？

- 检查一下`Content-Type`有没有设置好？（看文中的  **`Content-Type`设置** 部分）
- 检查一下`XML`结构是否正确（看文中 **`XML`语法** 部分）
- 用`ajax`加载的时候一定要起服务，不能在本地环境下使用，否则会报错

![error.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d42cf2c464c4e94850cde1106feda49~tplv-k3u1fbpfcp-zoom-1.image)

- 解析`xml`的`jq`语法有没有错误，提示的是，如果子节点有很多个，要使用`each`遍历，可以使用`$(this)`获取当前节点，也可以使用`$(val)`获取当前节点，为什么是`$(val)`，是因为`each`里面的第二个参数`val`出来的是`DOM`元素，所以要进行`DOM`元素和`JQ`元素的转化。

