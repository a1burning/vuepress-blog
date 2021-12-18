---
title: fis3-smarty语法总结
tags: 
  - 前端工程化
  - FIS
prev: ./01fis.md
next: ./03smarty.md
sidebarDepth: 5
---
## 什么是smarty
Smarty是一个使用**PHP**写出来的**模板引擎**，一说模板引擎，其实就是再html中插入可以直接渲染的数据。这个是为了让前端和后台分离的一种管理模式。

**优点：**
代码由服务端直接渲染，可以避免js后期插入的延迟，页面渲染速度也很快。而服务端只需要给数据，至于怎么用或者修改页面的时候，不用后台动逻辑，多人项目合作显得很重要。


## fis3-smarty模板语法
*   FIS 2.0 时期支持 Smarty 开发的成套解决方案是 [fis-plus](https://github.com/fex-team/fis-plus)
*   FIS 3.0 时期支持 Smarty 开发的成套解决方案由 [fis3-smarty](https://github.com/fex-team/fis3-smarty) 提供
所以[fis3-smarty](https://github.com/fex-team/fis3-smarty) 集成了 [fis-plus](https://github.com/fex-team/fis-plus) 的目录规范以及处理插件。实现对 Smarty 模板解决方案的工程构建工具支持。

### 基础模板框架语法
fis3-smarty默认的分届符为`{%、%}`，这个可以修改。
#### 🔹html
- 功能：代替`<html>`标签，设置页面运行的前端框架，以及控制住整体页面输出
- 属性值：framework及html标签原生属性值
```php
{%html framework="home:static/lib/[mod.js](http://wiki.afpai.com/pages/mod.js)"%}
{%/html%}
```
页面输出
```html
<html>
    <body>
        <script src="/static/lib/mod.js"/></script>
    </body>
</html>
```
#### 🔹head
- 功能：代替`<head>`标签，控制CSS资源加载输出。
- 属性值：head标签原生属性值
```php
{%html framework="home:static/lib/mod.js"%}
    {%head%}
        <meta charset="utf-8"/>
    {%/head%}
{%/html%}
```
页面输出
```html
<html>
    <head>
        <meta charset="utf-8"/>
    </head>
    <body>
        <script src="/static/lib/mod.js"/></script>
    </body>
</html>
```
#### 🔹body
- 功能：代替`<body>`标签，控制JS资源加载输出。
- 属性值：body标签原生属性值
```php
{%html framework="home:static/lib/mod.js"%}
    {%head%}
        <meta charset="utf-8"/>
    {%/head%}
    {%body%}
        ....
    {%/body%}
{%/html%}
```
#### 🔹script
- 功能：代替`<script>`标签，收集使用JS组件的代码块，控制输出至页面底部。
- 属性值：无
- 是否必须：在模板中使用异步JS组件的JS代码块，必须通过插件包裹
```php
{%html%}
    {%head%}
       <meta charset="utf-8"/>
       {*通过script插件收集加载组件化JS代码*}
       {%script%}
           console.log("aa");
       {%/script%}
    {%/head%}
    {%body%}
        ...
    {%/body%}
{%/html%}
```
解析结果(无论是放在head里面还是body里面，最后都会在body最后面输出)：
```html
<html>
    <head>
        <meta charset="utf-8"/>
    </head>
    <body>
        <script type="text/javascript">
            !function(){
                console.log("aa");	
            }();
        </script>
    </body>
</html>
```
#### 🔹style
- 功能：代替`<style>`标签，收集使用css内嵌资源的代码块。
- 属性值：无
```php
{%html%}
    {%head%}
       <meta charset="utf-8"/>
       {*通过script插件收集加载组件化JS代码*}
       {%style%}
           body{
               background-color:pink;
           }
       {%/style%}l
    {%/head%}
    {%body%}
        ...
    {%/body%}
{%/html%}
```
解析结果
```html
<html>
    <head>
        <meta charset="utf-8"/>
        <style>
            body{
               background-color:pink;
            }
        </style>
    </head>
    <body>
    </body>
</html>
```
#### 🔹require
- 功能：通过静态资源管理框架加载静态资源。
- 插件类型：compiler
- 属性值：name(调用文件目录路径)
- 用法：在模板中如果需要加载模块内某个静态资源，可以通过require插件加载，便于管理输出静态资源
- name后面跟着<模块名>:<资源相对于模块根目录的路径>
```php
{%html framework="home:static/lib/mod.js"%}
    {%head%}
       <meta charset="utf-8"/>
    {%/head%}
    {%body%}
        {%require name="home:static/index/index.css"%}
        {%require name="home:static/index/index.js"%}
        ...
    {%/body%}
{%/html%}
```
编译之后解析结果（测试之后src的属性不能用）：
```html
<html>
    <head>
        <meta charset="utf-8"/>
        <link rel="stylesheet" type="text/css" href="/static/home/index/index.css">
    </head>
    <body>
        <script type="text/javascript" src="/static/home/index/index.js"></script>
    </body>
</html>
```
#### 🔹widget
- 功能：调用模板组件，渲染输出模板片段。
- 插件类型：compiler
- 属性值：name(调用文件目录路径，一定是widget文件夹下)
- 可以添加局部变量
```php
页面数据
{
	"result":{
		"addStr":"html of b"
	}
}
----home.tpl
{%body%}
    {%widget name="home:widget/A/B.tpl" info=$result%}
{%/body%}
<!--$info的改变不会对$data.header.info有任何影响-->

----B.tpl
<div>{%$info.addStr%}</div>
```
编译之后:
```html
<body>
    <div>html of b</div>
</body>
```
#### 🔹block
- 功能: 根据位置填写不同的东西
- 属性值：name。进行区分不用的区块。
```php
<!--A.tpl-->
<title>{%block name="head_title"%}{%/block%}</title>
<!--B.tpl-->
{%block name="head_title"%}title show{%/block%}
```
编译之后在页面你上可以得到
```html
<title>title show</title>
```
#### 🔹extend
- 功能: 继承制定模块的tpl模板
- 属性值：file。写所继承的模块的文件地址
```php
{%extends file="common/page/layout/m-base.tpl"%}
```
### 模板专用语法
#### 🔶url
- 功能：动态获得某个路径的最终 url
- 由于 FIS 构建时会根据配置给资源添加 cdn、md5戳，这个给编码带来了一些麻烦。uri 接口可以动态获取资源的最终 url
```php
{%$logo_url="{%uri name="common:static/a.js"%}"%}
```
#### 🔶capture
- 功能：将标签中间的内容捕获到一个变量中，可以被嵌套
- 属性：name，捕获的变量名
```php
//framework中举例
//定义变量html_ext_attr
{%capture name="html_ext_attr"%}{%block name="html_ext_attr"%}{%/block%}{%/capture%}

//使用变量
{%$html_ext_attr%}
```
### 模板框架引用逻辑
`frameworkTpl  --> productTpl`

首先有一个最基础的tpl模板,定义了**最基础**的东西，然后后面继承的可以根据这个东西进行修改。
- 要求是一定要扩展性特别强，很多head前和后，body前和后，都可以进行添加和修改
- 如果要去掉默认的，直接写标签，什么都不写就覆盖了
- 如果是追加，再标签后面加`append`就可以

```html
<!--定义一个html标签自定义属性的变量，名字叫html_ext_attr-->
{%capture name="html_ext_attr"%}{%block name="html_ext_attr"%}{%/block%}{%/capture%}
<!--fis必须要引用mod.js-->
{%html framework="common:js/mod.js" {%$smarty.capture.html_ext_attr%}%}
<!--head标签-->
{%head%}
    <meta charset="{%block name='head_charset'%}UTF-8{%/block%}">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <!-- 添加 meta 配置，引导 360 浏览器优先使用 webkit 内核渲染页面 -->
    <meta name="renderer" content="webkit">
    <meta name="description" content="{%block name='head_desc'%}网页描述{%/block%}">
    <meta name="keywords" content="{%block name='head_keywords'%}网页keywords{%/block%}">
    <!--页面title-->
    <title>{%block name="head_title"%}{%/block%}</title>
    <!--页面icon-->
    {%block name="head_favicon"%}
      <link rel="shortcut icon" href="">
    {%/block%}

    <!-- <head> 标签开始位置，title 之后，所有 CSS/JavaScript 引用之前 -->
    {%block name="head_start"%}{%/block%}

    <!-- 基础样式 -->
    {%require name="common:css/base.css"%}

    <!-- 为 IE8 及更低版本 IE 浏览器添加 HTML5 新增元素支持 -->
    <link rel="import" href="../../static/html/html5-hack.html?__inline">

    <!-- <head> 标签结束位置 -->
    {%block name="head_end"%}{%/block%}
  {%/head%}

  <!-- <head> 标签末端 -->
  {%block name="after_head"%}{%/block%}

  <!-- 全局 js 基础库，默认引用 jQuery -->
  {%block name="global_js"%}
    {%require name="common:js/jquery.js"%}
  {%/block%}

  <!-- block "body_ext_attr" 用于向 <body> 标签中添加自定义属性 -->
  {%capture name="body_ext_attr"%}{%block name="body_ext_attr"%}{%/block%}{%/capture%}

  <!-- block "body_page_class" 用于向 <body> 标签中添加样式名 -->
  {%body class="{%block name='body_page_class'%}{%/block%}" {%$smarty.capture.body_ext_attr%}%}

   <!-- <body> 标签开始位置，页面主体内容前 -->
   {%block name="body_start"%}{%/block%}

    <!-- 页面主体内容 -->
    {%block name="body"%}
          <!-- 页面内容的 header 区域 -->
          {%block name="body_header"%}{%/block%}

          <!-- 页面内容主体 -->
          {%block name="body_main"%}{%/block%}

          <!-- 页面内容的 footer 区域 -->
          {%block name="body_footer"%}{%/block%}
    {%/block%}

    <!-- <body> 标签结束位置，页面主体内容后 -->
    {%block name="body_end"%}{%/block%}
  {%/body%}

  <!-- <body> 标签之后 -->
  {%block name="after_body"%}{%/block%}
{%/html%}
```

然后是一个个性化的Tpl模板，用于不同的项目组
```html
{%extends file='./framework.tpl'%}
{%block name='head_keywords'%}项目keywords{%/block%}
{%block name="head_title"%}项目html{%/block%}
{%block name='head_desc'%}项目desc{%/block%}

<!--需要html渲染之前执行的css和js-->
{%block name="head_end" append%}
<script type="text/javascript">
  console.log("TODO");
</script>
<style>
  .hide{
      display:none;
  }
</style>
{%require name="product:product.css"%}
{%/block%}

  <!-- 修改全局 js 基础库，默认引用 zepto-->
{%block name="global_js"%}
  {%require name="common:js/zepto.js"%}
{%/block%}

<!--body_ext-attr，body额外的属性-->
{%block name="body_ext_attr"%}time=true{%/block%}
{%block name="body_main"%}
  <div>------所有html标签都写在这里------</div>
  <div>------这里面也可以直接使用smarty语法------</div>
{%/block%}
{%block name="body_end"%}
	<script>
		var finished = "{%$result.finished%}";
		console.log(finished);	
	</script>
	{%require name="product:product.js"%}
{%/block%}
```

