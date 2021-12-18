---
title: Gulp(4.0之前旧版本)
tags: 
  - 前端工程化
  - Gulp
date: 2018-04-26
prev: false
next: false
sidebarDepth: 5
---
## gulp的功能

+ 主要用在项目上线的时候：所有文件的压缩处理和合并处理（html,css,js）
+ 运用less写的样式，可以自动转化为css文件
+ 可以多窗口同步刷新（需引入插件）
+ 还有更多如压缩图片的功能可以通过下载插件来使用

## 其他常用的构建工具：

**grunt / webpack** 

gulp相较于grunt来说是轻量级的，webpack会有模块化的处理

## 常用的5个API

* watch() 监视变化，第一个参数是文件的路径，第二个参数是执行的任务名

* task() 创建任务，第一个参数是任务名

  ​                 第二个参数是依赖任务（数组形式，可选）

  ​                 第三个参数是执行任务的函数

* src()  获取文件，括号里是获取文件地址

* dest() 输出文件，括号里是输出地址

* pipe() 管道，括号可以加插件方法，也可以加glup方法

## gulp的下载和安装

####  **1、先将node安装好（gulp 是基于node，再通过 node 安装 gulp）**

//window+R运行 --> cmd --> node -v --> 如果安装了node会有版本号出现

//使用淘宝镜像（国外翻墙访问仓库地址）

```cmd命令
npm config set registry https://registry.npm.taobao.org --global

npm config set desturl https://npm.taobao.org/dist --global

```

也可以下载一个 **cnpm** 使用，和npm的功能是一样的

```cmd命令
$ cnpm install[name]
//直接去淘宝镜像里面拿东西
```



_[课外扩展]_

>node.js 
>
>​	是一个javascript的运行时的运行环境，通过node可以执行js代码，就和在浏览器中能够执行js代码一样。浏览器也是一个 javascript的运行时的运行环境
>
>npm _(node package manager)_  node的包管理工具
>
>- [npm官网](https://npmjs.com)
>- [淘宝镜像](http://npm.taobao.org/)
>- [cnpm](https://github.com/cnpm/cnpm)
>
>  ​在安装了node之后，会自动给安装一个npm，我们可以通过npm来下载或更新各种项目中要使用的包文件，具体使用如下：
>
>  ​找到当前文件夹（- 进去的时候是默认在C:Users/name --> cd d 进入到文件夹中
>
>  ​		- 在当前文件夹中shift + 右键 --> 命令框）
>
>```cmd命令（在当前文件夹）
>1 先使用npm进行初始化
>	npm init
>	
>2 写一个名称，一路回车到 is this ok?(yes)
>
>3 初始化好以后，在目录中会创建一个package.json 的文件
>
>4 在通过命名来下载文件
>	npm install jquery(默认下载最新版本的jquery)
>	npm install bootstrap
>	npm install jquery@3.2.1（下载指定版本的jquery）
>	npm install bootstrap--save （项目在上线和运行的时候都要使用的，再进行下载的时候也会进行版本的替换）
>	
>```
>
>​	'npm install bootstrap--save' （项目在上线和运行的时候都要使用的依赖文件）这时会在json文件中新加一个配置属性
>
![dependencies.png](https://user-gold-cdn.xitu.io/2018/4/26/16300a39e644fa98?w=220&h=62&f=png&s=1006)


#### **2、使用npm进行初始化 `npm init`**

#### **3、安装Glup命令行**

- 全局安装 gulp
  +  `npm install --global gulp` 进行全局安装（全局安装命令只执行一次，比较慢，在国外下载）
- 在本地安装gulp
  +  `npm install --save-dev gulp` 会在json文件中会加一个配置属性(项目上线的时候仍然需要使用的依赖文件)
![devgulp.png](https://user-gold-cdn.xitu.io/2018/4/26/16300a39e6452a25?w=213&h=63&f=png&s=1028)


#### **4、就可以在本地使用gulp了**

_[注意：]_

- 项目的文件夹名称不要叫：gulp
- 只对当前文件夹起作用，要是换了新的文件夹，npm init 和 npm install --save-dev gulp 需要重新执行
- 安装glup的时候，是可以不用初始化的，也就是说直接用 npm install gulp(一般还是推荐用上面的做法)
- 在新项目的时候，先将json文件拷贝，然后在cmd中执行命令 `npm install` 后面什么也不加，就会将原来文件中下载的依赖文件都拷贝过来

## gulp的基本使用

- 几乎所有的功能都是通过插件来实现的，本身只提供了一些基本的功能
- gulp中所有的操作都是基于任务的，创建任务才能够执行某个操作
- gulp内部是通过 **管道机制** 来实现，流动到不同的位置，可以进行不同的操作

### 使用gulp构建任务的步骤

1、在项目的根目录中手动创建一个gulpfile.js的文件

2、在gulpfile.js中开始写任务

3、任务写好了以后，通过命令： `gulp 任务名称` 来执行相关的任务

### gulp初体验

在gulpfile.js中

```javascript
   //将gulp 这个模块引入到当前js文件中
   //接下来写代码的时候，需要用到gulp这个模块
   //require node 里面加载模块的方式
var gulp = require('gulp');

//写gulp任务
//task 方法，用于创建一个任务
//第一个参数表示：当前任务的名称
//第二个参数表示：执行当前任务要执行的代码
gulp.task('js',function(){
    //js这个任务执行的时候，这里面的代码就会被执行
    console.log('js 任务执行了')
})
```

然后去当前文件夹中的cmd中执行


![gulpjs.png](https://user-gold-cdn.xitu.io/2018/4/26/16300a39e622b7b8?w=524&h=85&f=png&s=2984)


### gulp自身方法——文件拷贝任务

原理图


![pipe.png](https://user-gold-cdn.xitu.io/2018/4/26/16300a39e67b289a?w=638&h=338&f=png&s=2840)


```javascript
//写gulp任务
//将gulp 这个模块引入到当前js文件中
var gulp = require('gulp');
//task 方法，用于创建一个任务
//第一个参数表示：当前任务的名称
//第二个参数表示：执行当前任务要执行的代码
gulp.task('js',function(){
    //js这个任务执行的时候，这里面的代码就会被执行
    //src方法用于找到一个文件
    //第一个参数表示：要查找的文件路径
    gulp
        .src('./test/index.js')
        //pipe()管道开始流动
        //dest方法用于指定一个输出目录
        //拿到src中的文件，顺着管道把这个文件放到dist目录中来，如果目录不存在，会自动创建目录，然后将文件拷贝到当前目录中
        //相当于完成了文件拷贝
        .pipe( gulp.dest('./dist'))
})

//在cmd中执行的时候，会创建一个dist文件夹，会把test文件夹中的index.js文件拷贝到dist文件夹中。
```



### 插件完成的任务——强大

**以下插件都使用：`npm install --save-dev gulp-[名称]` 安装** 

网络不好的情况下最好是一个一个安装

#### `gulp-uglify`:压缩和混淆js代码

```javascript
//压缩js
//1、需要单独安装gulp-uglify 插件，用于压缩js
// npm install --save-dev gulp-uglify
//2、将压缩插件模块 引入到当前插件中
// var uglify = require('gulp-uglify')
var gulp = require('gulp');
//引入压缩js的插件模块
var uglify = require('gulp-uglify')
//创建任务
gulp.task('js',function(){
    gulp
        //拿到文件
        .src('./test/index.js')
        //压缩
        .pipe(uglify())
        //将压缩以后的js文件输出到指定文件夹
        .pipe(gulp.dest('./dist'))
});


//在cmd中运行   gulp js
//会在./dist中生成一个压缩的js文件
```

#### `gulp-less`:将less转化为css

#### `gulp-cssnano`:压缩css代码

原理图


![pipeless.png](https://user-gold-cdn.xitu.io/2018/4/26/16300a39e650aa1c?w=638&h=338&f=png&s=3231)


```javascript
//less转css,压缩css
//1、需要单独安装gulp-less/gulp-cssnano 插件
// npm install --save-dev gulp-less
// npm install --save-dev gulp-cssnano
var gulp = require('gulp');
// 引入转化css模块
var less = require('gulp-less')
// 引入压缩css模块
var sccnano = require('gulp-cssnano')
gulp.task('less',function(){
    gulp.src('./test/index.less')
    //转化成css
        .pipe(less())
    //对css文件进行压缩
        .pipe(cssnano())
    //将压缩以后的js文件输出到指定文件夹
        .pipe(gulp.dest('./dist/'))
});

//在cmd中运行   gulp less
//会在./dist 中创建一个压缩过的css文件
```
#### `gulp-htmlmin`:压缩html代码

+ [htmlmin文档](http://github.com/kangax/html-minifier)
+ 因为html文件不能被压缩，所以要去gitHub中去查找一些属性，通过对象参数进行设置
  * 要去空格的话就找 `collapseWhitespace` 默认为false,转化为true
  * 要压缩css的话就找 `minifyCSS` 默认是`false` (could be `true`, `Object`, `Function(text)`)
  * 要压缩js的话就找 `minifyJS` 默认是 `false` (could be `true`, `Object`, `Function(text, inline)`)
+ 也可以去npm官网去查gulp的常用插件，查htmlmin 里面的文档

```javascript
//压缩html
//1、需要单独安装gulp-htmlmin 插件
// npm install --save-dev gulp-htmlmin
var gulp = require('gulp');
//引入模块
var htmlmin = require('gulp-htmlmin')
//创建任务
gulp.task('html',function(){
    gulp
        .src('./test/index.html')
          //对html文件进行压缩
        .pipe(htmlmin({
          //压缩空白部分
      		collapseWhitespace:true,
      	  //压缩页面中通过style设置的css
      		minifyCSS:true,
          //压缩页面中通过script设置的js
      		minifyJS:true
        }))
       //将压缩以后的js文件输出到指定文件夹
        .pipe(gulp.dest('./dist'));
});

//在cmd中运行   gulp html
//会在 ./dist 中创建一个没有压缩过的html文件
```

#### `gulp-concat`:合并js/css文件

```javascript
//js文件的合并
//1、需要单独安装gulp-concat 插件
// npm install --save-dev gulp-concat
var gulp = require('gulp');
//引入模块
var concat = require('gulp-concat');
//创建任务
gulp.task('abc',function(){
    gulp
    //src中可以传数组元素
        .src(['test/index.js','test/test.js'])
    //合并文件，参数是合成之后的文件名
        .pipe(concat('c.js'))
    //对合成之后的文件进行压缩
        .pipe(uglify())
    //将压缩以后的js文件输出到指定文件夹
        .pipe(gulp.dest('dist'));
})

//在cmd中运行   gulp abc
//会在 ./dist 中创建一个名为c的压缩过的js文件
//js文件中，前面是index中的js，后面是test中的js
```

#### `browser-sync`:同步刷新浏览器

修改的内容可以再浏览器中同步，可以多个浏览器同步，刷新的不是整个页面，是内容动态刷新（最能说明这个的例子是使用display）

> 如果默认display:none，点击按钮之后display:block，如果是刷新页面的话，就会改变之后盒子隐藏，但是实际情况盒子并没有隐藏，说明不是刷新整个页面。

```javascript
//前面的所有任务最后都要加这个
//当文件发生变化以后让浏览器自动刷新
    .pipe(browserSync.reload({stream:true}));


//浏览器同步  browser-sync
var browserSync = require('browser-sync').create()

// 配置静态服务器
gulp.task('bs',function(){
    //初始化
    browserSync.init({
        server:{
            //指定根目录，将来根目录中的内容发生变化以后我们会执行当前任务
            baseDir:'./test'
        }
    })
})

//此时在cmd命令中执行  gulp bs ，会自动打开浏览器
//但是修改文件的时候并没有自动刷新

```

- 上面的问题存在的原因


  + 在cmd命令中执行  gulp bs 得到以下图，因为一直在监视中，但是前面的任务并没有执行，所以browserSync.reload方法并没有调用，所以无法通知浏览器自动刷新


![bs.png](https://user-gold-cdn.xitu.io/2018/4/26/16300a39e6338d55?w=437&h=205&f=png&s=5340)


- 解决办法，当文件发生改变以后，需要重新执行相应的任务。需要监视文件的变化

  + ```javascript
    //监视文件的变化

    //第一个参数表示任务的名称（可以是任意的字符串）
    //第二个参数是当前任务依赖的任务，bs任务先执行，再执行当前任务（因为监视的任务必须要浏览器跑起来）
    //第三个参数，表示一个回调函数，当前任务执行的时候会执行回调函数中的代码
    gulp.task('watch',['bs'],function(){
    	//监视到 ./test/index.html文件，变化后执行html任务
    	gulp.watch('./test/index.html',['html']);

    })

    //再cmd命令窗口输入命令 gulp watch 运行之后，可以看到以下的运行窗口，先执行bs，再执行watch。修改test/index.html中文件的代码，保存后会自动改变
    ```



![watch.png](https://user-gold-cdn.xitu.io/2018/4/26/16300a39fed2a89e?w=546&h=238&f=png&s=5606)



## 参考文章
- [gulp官网](http://www.gulpjs.com)

- [gulp中文网 - 文档](http://www.gulpjs.com.cn)

- [Gulp+BrowserSunc](http://www.browsersync.cn/docs/gulp/)
​
​
