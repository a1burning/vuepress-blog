---
title: fis3-smarty系统函数语法总结
tags: 
  - 前端工程化
  - FIS
prev: ./02smarty.md
next: false
sidebarDepth: 5
---
## php方法
所有的smarty里面，都可以直接使用php函数。如果有些逻辑使用smarty找不到，直接使用php函数也是可以解决的。
### json_enCode——对变量进行 JSON 编码
```js
var result = {%json_enCode($result)%};
console.log(result);
//{"errNo":0,"errstr":"succerr",data":{"isLogin":1}};

var result1 = {%$result%};
console.log(result1);
//Array
```
## 系统方法
### 获取访问当前时间
```js
{%$smarty.now%}
// 1571731051
{%$smarty.now|date_format:"%Y-%m-%d %H:%M:%S"%}
// 2019-10-22 09:57:31
```

### 获取当前模板的名称
```js
{%$smarty.template%}
//activity.tpl
```

### 获取当前smarty版本
```js
{%$smarty.version%}
//Smarty-3.1.13
```

### 显示分割符
具体显示什么，是根据注册时候指定模板的符号决定
```js
{%$smarty.ldelim%}
// {%

{%$smarty.rdelim%}
// %}
```

### 获取url的query参数
```js
// 链接 http://xxx.com?code=123
{%$smarty.get.code%}
// 123
```

### server相关

#### $smarty.server.HTTP_ACCEPT_LANGUAGE 支持语言
```js
{%$smarty.server.HTTP_ACCEPT_LANGUAGE%}
// zh-CN,zh;q=0.9
```

#### $smarty.server.HTTP_ACCEPT_ENCODING 支持编码格式
```js
{%$smarty.server.HTTP_ACCEPT_LANGUAGE%}
// gzip, deflate
```

#### $smarty.server.HTTP_CONNECTION 
```js
{%$smarty.server.HTTP_CONNECTION%}
//close
```

#### $smarty.server.HTTP_HOST http主机名
相当于前端`location.hostname`
```js
{%$smarty.server.HTTP_HOST%}
// www.xxx.com
```

#### $smarty.server.SERVER_SOFTWARE
```js
{%$smarty.server.SERVER_SOFTWARE%}
// nginx/1.9.12
```

#### $smarty.server.SERVER_NAME 服务器名称
```js
{%$smarty.server.SERVER_NAME%}
// www.xxx.com
```

#### $smarty.server.SERVER_ADDR 服务器地址
```js
{%$smarty.server.SERVER_ADDR%}
// www.xxx.com
```

#### $smarty.server.SERVER_PORT 服务器端口
```js
{%$smarty.server.SERVER_PORT%}
// 8080
```

#### $smarty.server.REMOTE_ADDR 远程/客户端 IP
```js
{%$smarty.server.REMOTE_ADDR%}
// 192.168.220.192
```

#### $smarty.server.DOCUMENT_ROOT 网站主目录
```js
{%$smarty.server.DOCUMENT_ROOT%}
// /index/home
```

#### $smarty.server.SCRIPT_FILENAME 当前网页的绝对路径
```js
{%$smarty.server.SCRIPT_FILENAME%}
// /index/home/helloworld/index.php
```

#### $smarty.server.SCRIPT_NAME 包含当前脚本的路径
```js
{%$smarty.server.SCRIPT_NAME%}
// /helloworld/index.php
```

#### $smarty.server.PHP_SELF 当前正在执行脚本的文件名
```js
{%$smarty.server.PHP_SELF%}
// /helloworld/index.php/activity
```

#### $smarty.server.REQUEST_TIME 请求时间
单位为十万分之一毫秒
```js
{%$smarty.server.REQUEST_TIME%}
// 1571734996
{%$smarty.server.REQUEST_TIME|date_format:"%Y-%m-%d %H:%M:%S"%}
// 2019-10-22 17:03:16
```

#### $smarty.server.REMOTE_PORT 远程/客户端 端口
```js
{%$smarty.server.REMOTE_PORT%}
// 8560
```

#### $smarty.server.GATEWAY_INTERFACE 通用网关接口
```js
{%$smarty.server.GATEWAY_INTERFACE%}
// CGI/1.1
```

#### $smarty.server.SERVER_PROTOCOL 协议
```js
{%$smarty.server.SERVER_PROTOCOL%}
// HTTP/1.0
```

#### $smarty.server.REQUEST_METHOD 请求方法类型
```js
{%$smarty.server.REQUEST_METHOD%}
// GET/POST
```

#### $smarty.server.QUERY_STRING ?后面的东西
```js
{%$smarty.server.QUERY_STRING%}
// os=ios
```

#### $smarty.server.REQUEST_URI 请求URL
```js
{%$smarty.server.REQUEST_URI%}
// /helloworld/activity?os=ios
```

#### $smarty.server.HTTP_USER_AGENT 用户端信息
相当于前端`vigator.userAgent`
```js
{%$smarty.server.HTTP_USER_AGENT%}
// Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1
```

