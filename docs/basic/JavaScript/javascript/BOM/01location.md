---
title: Location对象
tags: 
  - JavaScript
  - BOM
date: 2018-04-16
prev: false
next: false
sidebarDepth: 5
---
location——BOM对象之一，既是window对象的属性，又是document对象的属性，即：
`window.location == document.location   结果为true`

## 功能
- 提供与当前窗口中加载的文档有关的信息
- 提供导航功能

## 属性

### 属性说明

| 属性名      | 说明                                       |
| -------- | ---------------------------------------- |
| hash     | 返回URL中的#号后的多个字符，如果URL中不包含散列 ，则返回空字符串     |
| host     | 返回服务器名称+端口号                              |
| hostname | 返回不带端口号的服务器名称                            |
| href     | 返回当前加载页面的完整URL （`location.toString() == location.href  结果为true`） |
| pathname | 返回URL中的目录+文件名                            |
| port     | 返回端口号，如果没有端口号返回空字符串                      |
| protocol | 返回使用的协议`http  or https`                  |
| search   | 返回URL中的查询字符串，这个字符串以问号开头                  |
| **origin** | 返回URL协议+服务器名称+端口号  （`location.origin ==  location.protocol + '//' + location.host`）                  |


![location.png](https://user-gold-cdn.xitu.io/2018/4/16/162ca2b6758f6379?w=540&h=323&f=png&s=4705)

![location1.png](https://user-gold-cdn.xitu.io/2018/4/16/162ca2b6756465c2?w=1227&h=515&f=png&s=17212)

![location2.png](https://user-gold-cdn.xitu.io/2018/4/24/162f6a9b02e57902?w=524&h=79&f=png&s=1437)

#### origin的兼容性说明
origin不兼容IE8，所以要使用这个属性就要进行兼容性处理
```js
var baseUrl;
if (typeof location.origin === ‘undefined‘)
{
   baseUrl = location.protocol + '//' + location.host;
}
else
{
   baseUrl = window.location.origin;
}
```
### 属性使用
#### 1. 获取地址栏传来的参数数据
**定义函数**获取根据参数的键获得参数的值
```javascript
function getQueryStringArgs(){
          //取得查询字符串并去掉开头的问号
          var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
          //保存数据的对象
              args = {},
          //取得每一项
              items = qs.length ? qs.split("&") : [],
              item = null,
              name = null,
              value = null,
              
          //在for循环中使用
              i = 0,
              len = items.length;
        
          //逐个将每一项添加到args对象中
            for(i = 0 ; i < len ; i++){
                item = items[i].split("=");
                name = decodeURIComponent(item[0]);
                value = decodeURIComponent(item[1]);
                if(name.length){
                    args[name] = value;
                }
            }
            return args;
      }
```
**调用函数**获取值
```javascript
  //假设字符串是?name=xiaoming&age=18
var args = getQueryStringArgs();
console.log(args.name)   //xiaoming
console.log(args.age)    //18
```
试验一下百度搜索简书的连接
![baidu.png](https://user-gold-cdn.xitu.io/2018/4/16/162ca2b67560fef1?w=463&h=213&f=png&s=2616)

#### 2. 跳转页面(除了修改hash，其余都会跳转页面)
以下的方式修改URL以后，浏览器的历史记录中就会生成一条新纪录，因此**用户通过单击‘后退’按钮都会导航到前一个页面**。
```javascript
//修改location对象的属性都可以改变当前加载的页面，
location.href = 'https://www.baidu,com';
window.location = 'https://www.baidu.com';
//上面的两种效果都是一样的
// 假设域名为https://www.baidu.com/abcd

location.hash = '#section1';
// URL 为  https://www.baidu.com/abcd/#section1

location.search = '?q=javascript';
// URL 为 https://www.baidu.com/?q=javascript#section1

location.hostname = 'www.google.com';
// URL 为 https://www.google.com/abcd/?q=javascript#section1

location.pathname = 'mydir';
// URL 为 https://www.google.com/mydir/?q=javascript#section1

location.port = 8080';
// URL 为 https://www.google.com:8080/mydir/?q=javascript#section1


```
## 方法
### 方法说明
| 方法名       | 说明                                       |
| --------- | ---------------------------------------- |
| assign()  | 跳转链接，立即打开新的URL并在浏览器的历史记录中生成一条记录，**回退可返回**    |
| replace() | 跳转链接，立即打开新的URL，不会在历史记录中生成一条记录，**回退不可返回**       |
| reload()  | **重新加载**当前显示的页面：<br/>参数：无 —— 就会使用最有效的方式重新加载页面，可能从浏览器缓存中重新加载。<br/>参数：true —— 那么就会强制从服务器重新加载。 |

### 方法使用
#### assign()
```javascript
  location.assign('http://www.baidu.com')；
```
注：如果是修改window.location和location.href，也会以修改的值去调用assign()，效果是完全一样的。

#### replace()不可跳转
```javascript
  location.replace('http://www.baidu.com');
```

#### reload()
```javascript
  location.reload();  //有可能从缓存中加载
  location.reload(true);  //从服务器重新加载
```

