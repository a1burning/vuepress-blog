---
title: Rollup —— 适合框架和类库使用的模块打包器
tags: 
  - 前端工程化
  - Rollup
date: 2020-11-26
sidebarDepth: 5
---
这篇文章目前旨在简单了解`Rollup`是什么并且如何上手操作，之后会再进行深入分析。
## Rollup概述

- [rollup.js 中文网](https://www.rollupjs.com/) 、[rollup.js官网](http://rollupjs.org/guide/en/)

`Rollup`仅仅是一款`JavaScript` 模块打包器，也称为`ESM`打包器，并没有像`webpack`那样有很多其他额外的功能，它可以将项目中散落的细小模块打包成整块的代码，可以让他们更好的运行在**浏览器环境** or **Node.js环境** ，目前`Vue2.0`源码使用的打包器就是`Rollup`。

### Rollup vs Webpack
`Rollup`与`Webpack`作用类似，但是`Rollup`更为小巧，`webpack`可以在前端开发中完成前端工程化的绝大多数功能，而`Rollup`仅仅是一款`ESM`打包器，并没有其他额外的功能。

`Rollup`中并不支持类似`HMR`这种高级特性。但是`Rollup`诞生的目的并不是要与`webpack`全面竞争，**其初衷只是提供一个高效的`ES Modules`的打包器，充分利用`ESM`的各项特性构建出结构比较扁平，性能比较出众的类库。**


## 快速上手

1. 下载模板 [Rollup-firstdemo-temp](https://github.com/a1burning/demofiles/tree/master/Rollup-firstdemo-temp)

2. 安装模块`npm i rollup -g`
3. 在命令行中执行`rollup ./src/index.js --format iife --file dist/bundle.js`可以看到在输出目录中有了一个文件夹，里面的文件输出的文件很干净整洁，并且没有引用的模块并没有打包进去（自带`Tree-shaking`）

> - `--format` —— 指定输出文件打包格式，例如：`iife`是自调用函数
> - `--file` —— 输出文件，后面跟打印路径，不写会打印到控制台

## 配置文件
创建名称为`rollup.config.js`文件，同样运行在`node.js`环境中，因为`Rollup`会单独处理这个文件，所以我们可以直接使用`ES Module`。

1. 在文件中编辑

```js
// rollup.config.js
// 这个文件中会导出一个配置对象
export default {
  // input 是打包入口文件路径
  input: 'src/index.js',
  // 输出配置
  output: {、
    // 输出路径及文件名
    file: 'dist/bundle.js',
    // 输出格式
    format: 'iife'
  }
}
```

2. 使用命令行要添加`--config`说要使用配置文件`rollup --config`，默认是不使用配置文件的。

3. `rollup --config <filename>`后面可以指定配置文件的名称，默认是`rollup.config.js`，也可以自己指定别的文件名。 

## 插件
如果要加载其他类型的资源文件，或者是导入`CommonJS`模块，或者编译`ES6`新特性，`Rollup`同样支持使用插件的方式扩展。

**插件是`Rollup`唯一扩展途径**，这个与`webpack`有所不同，`webpack`有`plugins`、`module`、`optimization`三种途径。

### rollup-plugin-json
`rollup-plugin-json`是一个导入`JSON`文件的插件。

1. 安装插件 `npm i rollup-plugin-josn --save-dev`
2. 在`rollup-plugin.js`中配置插件

```js
// 默认导出是一个插件函数
import json from 'rollup-plugin-json'
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    // 是调用结果放在数组中，而不是函数放进去
    json()
  ]
}
```
3. 在`src/index.js`中调用，打包之后可以看到`json`里面的变量已经打包进来了。

```js
// 导入模块成员
import { log } from './logger'
import { name, version} from '../package.json'

log(name) // var name = "first";
log(version) // var version = "1.0.0";
```

### rollup-plugin-node-resolve（加载npm模块）

`rollup`默认只能按照路径的方式加载本地模块，对于第三方模块并不能想`webpack`一样通过名称导入，所以需要通过插件处理。

1. 安装插件 `npm i rollup-plugin-node-resolve --save-dev`
2. 在`rollup-plugin.js`中配置插件

```js
// 默认导出是一个插件函数
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
export default {
  ...
  plugins: [
    // 是调用结果放在数组中，而不是函数放进去
    json(),
    resolve()
  ]
}
```

3. 准备一个第三方模块进行安装`npm i lodash-es`
4. 在`src/index.js`中调用，可以看到`lodash-es`的相关代码也导入进去了

```js
// 导入模块成员，这里可以使用node名称来导入而不是路径
import _ from 'lodash-es'
import { log } from './logger'

log(_.camelCase('hello world'))
```

> PS:
> 这里使用`lodash`的`ES Modules`版本而不是其他版本的原因是因为`rollup`默认只能处理`ES Modules`模块，如果要引用其他版本我们需要做额外的处理。

### rollup-plugin-commonjs
加载`CommonJS`模块，目前还是有大量的`npm`模块使用`CommonJS`的方式导入成员，为了兼容就有了这个官方插件。

1. 安装插件`npm i rollup-plugin-commonjs --save-dev`
2. 在`rollup-plugin.js`中配置插件

```js
import commonjs from 'rollup-plugin-commonjs'
export default {
  ...
  plugins: [
    commonjs()
  ]
}
```

3. 在src中新建文件`cjs.module.js`，编写文件

```js
module.exports = {
  foo: bar
}
```

4. 在`src/index.js`中引入，可以看到变量已经打包进去。

```js
// 导入模块成员
import { log } from './logger'
import cjs from './cjs.module'

log(cjs)

/* var cjs_module = {
    foo: bar
  };
*/  
```

## Code Splitting（代码拆分）
### Dynamic Imports（动态导入）
动态导入，`rollup`内部会自动处理代码分包，
代码拆分

1. 在`src/index.js`中引入

```js
// import函数返回一个promise对象
// then方法参数是module，由于模块导出的成员都会放在module对象中，所以可以通过解构的方式提取log
import('./logger').then(({ log }) => {
  log('code splitting~')
})  
```

2. 修改`roll.config.js`中`output`里面的配置

```js
export default {
  // input 是打包入口文件路径
  input: 'src/index.js',
  // 输出配置
  output: {
    // 输出目录名称
    dir: 'dist',
    // 输出格式
    format: 'amd'
  }
}
```

> 不修改配置文件直接运行`rollup --config`会报错
>
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e4008b0d0914b9ab881188b85afea9a~tplv-k3u1fbpfcp-watermark.image)
>
> `UMD` 和 `iife` 是不支持代码拆分方式格式，因为自执行函数会把所有的模块都放到一个函数中，并没有像`webpack`一样有一些引导代码，所以没有办法做到代码拆分
> 
> 如果要使用代码拆分，就需要使用`AMD` or `CommonJS`等方式。在浏览器中只能使用`AMD`的方式，所以这里改用输出格式为`AMD`
>
> 况且我们拆分代码输出不同的文件，`file`属性只是针对一个文件，所以我们需要改用`dir`去指定文件夹名称，不然还是会报错
>
> ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bda1773091843c8b5abdeacfa37bf19~tplv-k3u1fbpfcp-watermark.image)
> 

3. 运行代码`rollup --config`可以看到`dist`文件夹里面有两个拆分打包的文件。

## 多入口打包
`rollup`支持多入口打包，对于不同文件的公共部分也会自动提取到单个文件中作为独立的`bundle.js`

1. 模板中将多入口打包的代码开启，可以看到`album`和`index`都引用了`fetch.js`和`logger.js`的代码，我们对`rollup.config.js`进行修改

```js
export default {
  // 这里input要改成数组形式或者对象形式，对象形式可以修改打包的文件名，键对应的就是打包的文件名
  // input: ['src/index.js', 'src/album.js'],
  input: {
    indexjs: 'src/index.js',
    albumjs: 'src/album.js'
  },
  // 输出配置要改成拆分包的配置，以为多入口打包默认会执行打包拆分的特性。所以输出格式要改成amd
  output: {
    dir: 'dist',
    format: 'amd'
  }
}
```
2. 命令行执行`rollup --config` 可以看到`dist`里面生成了三个文件，其中两个文件打包和一个公共模块的打包，里面包含了`logger`和`fetch`模块

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea4b228c6b3f4dbfa73c52030e6ea5d9~tplv-k3u1fbpfcp-watermark.image)

### amd输出格式要注意什么？
对于`amd`输出格式的打包文件是不能直接引用到页面上，必须通过实现`AMD`标准的库去加载。

尝试使用一下

1. 在`dist`下面生成一个`HTML`文件，尝试引入`requirejs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
 <!--requirejs的cdn地址，data-main是入口文件的名称-->
  <script src="https://unpkg.com/requirejs@2.3.6/bin/r.js" data-main="albumjs.js"></script>
</body>
</html>
```
2. 浏览器打开可以看到内容正常引入，控制台也正常工作。

## 指令参数参考大全
- `--format` —— 指定输出文件打包格式，例如：`iife`是自调用函数
- `--file` —— 输出文件，后面跟打印路径，不写会打印到控制台
- `--config` —— 指定使用配置文件，后面可以加指定配置文件的名称，`rollup --config <filename>`，默认是`rollup.config.js`。

