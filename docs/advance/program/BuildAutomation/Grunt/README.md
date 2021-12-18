---
title: Grunt
tags: 
  - 前端工程化
  - Grunt
date: 2020-12-26
sidebarDepth: 5
---
[Grunt官网](https://www.gruntjs.net/)

## 特点
`Grunt`是最早的前端构建系统，插件生态非常的完善。由于其工作过程是基于临时文件实现的，每一步都要读写磁盘，所以构建速度相对较慢。
### Grunt的基本使用
#### 安装
```bash
npm i -g grunt
```
#### 起步
1. 添加一个`gruntfile.js`的文件，进行配置

> `gruntfile.js`是 `Grunt` 的入口文件  
> 用于定义一些需要 `Grunt` 自动执行的任务，需要导出一个函数  
> 此函数接收一个 `grunt` 形参，内部提供一些创建任务是可以用到的`API`

```js
module.exports = grunt => {
  // 注册任务，第一个参数是任务名称，第二个参数是任务函数（当任务发生时自动执行此函数）
  grunt.registerTask('foo', () => {
    console.log('hello grunt')
  })
}
```
2. 命令行中执行`grunt foo`就可以看到执行了`foo`任务

```bash
grunt foo

# Running "foo" task
# hello grunt

# Done.      
```
#### 添加任务描述
如果第二个参数是字符串，那么默认是任务描述
```js
module.exports = grunt => {
  grunt.registerTask('foo', '任务描述', () => {
    console.log('hello grunt')
  })
}
```
使用`grunt -h`可以看到

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05fd67fb76d54d6ab43c05ea5b98c4ab~tplv-k3u1fbpfcp-watermark.image)

#### 默认任务
如果任务的名称叫`default`那么为默认任务
```js
module.exports = grunt => {
  grunt.registerTask('default', '任务描述', () => {
    console.log('default grunt')
  })
}
```
执行的时候不用添加任务名称就可以直接执行
```bash
grunt

# Running "default" task
# default grunt

# Done.
```

#### 添加执行任务列表
`default`任务后面可以是一个数组，数组里面的元素是任务名称

```js
module.exports = grunt => {
  grunt.registerTask('foo', () => {
    console.log('foo grunt')
  })

  grunt.registerTask('bar',() => {
    console.log('bar grunt')
  })

  grunt.registerTask('default', ['foo', 'bar'])
}
```
执行的时候会按照顺序依次执行任务
```bash
grunt

# Running "foo" task
# foo grunt

# Running "bar" task
# bar grunt

# Done.
```
#### 异步任务
如果在任务中写异步代码，可能会出不来
```js
grunt.registerTask('async-task', () => {
    setTimeout(() => {
      console.log('async task working~')
    },1000)
})
```
这里的运行结果为空，如果要解决这个问题，需要这样写
```js
grunt.registerTask('async-task', function() {
    // 通过this的async方法得到一个异步方法
    const done = this.async()
    setTimeout(() => {
      console.log('async task working~')
      // 完成过后调用异步函数表示该任务已经被完成，知道done被执行，grunt才会结束
      done()
    },1000)
 })
```
### Grunt标记任务失败
#### 如果任务失败如何表示？
如果在运行的时候，文件找不到了，可以标记任务为失败任务。失败任务只要返回false即可
```js
grunt.registerTask('bad', () => {
    console.log('bad grunt')
    return false
})
```
运行之后，就会抛出错误，然后后面的任务就会中断。
```bash
grunt bad

# Running "bad" task
# bad grunt
# Warning: Task "bad" failed. Use --force to continue.

# Aborted due to warnings.
```
#### 如何让后面的任务继续执行呢？
```js
grunt.registerTask('foo', () => {
    console.log('foo grunt')
})

grunt.registerTask('bad', () => {
    console.log('bad grunt')
    return false
})

grunt.registerTask('bar',() => {
    console.log('bar grunt')
})

grunt.registerTask('default', ['foo', 'bad', 'bar'])
```
如果在后面添加`--force`参数，那么后面的任务就会继续执行
```bash
grunt --force
# Running "foo" task
# foo grunt

# Running "bad" task
# bad grunt
# Warning: Task "bad" failed. Used --force, continuing.

# Running "bar" task
# bar grunt

# Done, but with warnings.
```

#### 异步任务如何标记失败?
```js
grunt.registerTask('async-task-fail', function() {
    const done = this.async()
    setTimeout(() => {
      console.log('async task fail~')
      // 执行done函数的时候，参数传false，就会标记为失败任务
      done(false)
    },1000)
})
```

### Grunt配置选项方法 —— initConfig
`Grunt`的`task`配置都是在`Gruntfile` 中的 `grunt.initConfig` 方法中指定的。此配置主要是以任务名称命名的属性，也可以包含其他任意数据。
```js
// 接收一个对象，键一般与任务名保持一致
grunt.initConfig({
    foo: 'bar'
})

grunt.registerTask('foo', () => {
    // 根据config方法获取配置，接收字符串参数，参数是配置的键
    console.log(grunt.config('foo')) //bar
})
```
`foo`也可以是个对象
```js
grunt.initConfig({
    foo: {
        bar: 123
    }
})

grunt.registerTask('foo', () => {
    console.log(grunt.config('foo.bar')) // 123
})
```
### Grunt 多目标任务
除了普通任务，`Grunt`还支持多目标任务，也可以理解为子任务。之后在我们实现`Grunt`构建任务时非常有用。

> PS: 使用`registerMultiTask`方法要搭配`config`，不然会报错
>
> ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1484d33d0b1a4469807780dc58055084~tplv-k3u1fbpfcp-watermark.image)

#### 如何配置多目标任务？
多目标模式，可以让任务根据配置形成多个子任务
```js
module.exports = grunt => {
  grunt.initConfig({
  // build有两个目标任务，一个css和一个js，执行的时候两个都会执行
    build: {
    // options作为配置选项，不作为目标任务
      options: {
        foo: 'bar'
      },
      css: '1',
      js: '2'
    }
  })
  // 多目标模式有对应函数，第一个参数是任务名称，第二个参数是任务函数
  grunt.registerMultiTask('build', function() {
    console.log('build task')
  })
}
```
执行一下，可以看到`css`和`js`的目标任务都执行了
```bash
grunt build

# Running "build:css" (build) task
# build task

# Running "build:js" (build) task
# build task

# Done.
```
也可以直接运行单个目标任务
```bash
grunt build:css

# Running "build:css" (build) task
# build task

# Done.
```
#### 如果在函数中拿到配置、目标和值？
- `options`中的东西通过`this.options()`方法去拿
- 目标任务名通过`this.target`去拿
- 目标任务对应的值通过`this.data`去拿
```js
grunt.registerMultiTask('build', function() {
    console.log(this.options())
    console.log(`target: ${this.target}, data: ${this.data}`)
})
```
执行得到
```bash
grunt build:css

# Running "build:css" (build) task
# { foo: 'bar' }
# target: css, data: 1

# Done.
```
如果目标任务本身也有`options`，则会对外面的`options`进行覆盖
```js
grunt.initConfig({
    build: {
        options: {
            foo: 'bar'
        },
        css: {
            options: {
                foo: 'baz'
            }
        },
        js: '2'
    }
})
```
执行得到`css`目标任务的`target`进行了覆盖
```bash
grunt build

# Running "build:css" (build) task
# { foo: 'baz' }
# target: css, data: [object Object]

# Running "build:js" (build) task
# { foo: 'bar' }
# target: js, data: 2

# Done.
```

### Grunt插件的使用
**插件机制是`Grunt`的核心**，因为很多构建任务是通用的，例如：压缩代码。  
一般我们都是通过通用的构建任务构成的。  
插件的命名规则都是`grunt-contrib-<taskName>`
#### 步骤
- 安装插件
- 去`Grunt`中导入插件
- 去插件文档中配置相关的选项

#### 实例 —— `clean`插件
`clean`插件用来清除我们在项目开发当中产生的临时文件
1. 安装插件`npm install grunt-contrib-clean`
2. 在文件中引用

```js
const { loadNpmTasks } = require("grunt")

module.exports = grunt => {
  grunt.initConfig({
    clean: {
      temp: 'temp/*.txt' //清空目录，可以是单个文件路径'temp/app.js'，也可以是通配符匹配路径 temp/**

    }
  })
  grunt.loadNpmTasks('grunt-contrib-clean')
}
```
3. 在命令行中执行`grunt clean`，就会看到`temp`目录下的所有`txt`文件被删除了。

#### 常用插件
##### grunt-sass
1. 安装`npm i grunt-sass sass --save-dev`
2. 使用
```js
const { loadNpmTasks } = require("grunt")
const sass = require('sass')
module.exports = grunt => {
  grunt.initConfig({
    sass: {
      // 不加配置会报错，这个配置选项使我们在处理的时候使用哪个模块去处理sass的编译
      // Fatal error: The implementation option must be passed to the Sass task
      options:{
        implementation: sass,
        // 可选参数，会生成对应的sourceMap文件
        sourceMap: true
      },
      main: {
        // 键是输出路径，值是原路径
        files: {
          'css/style.css': 'scss/main.scss'
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-sass')
}
```
3. 执行`grunt sass`，可以看到sass被成功编译。
4. 剩下的配置选项需要去官方文档中查找


##### grunt-babel
1. 安装`npm i grunt-babel @babel/core @babel/preset-env`
2. 为了减少`loadNpmTasks`的使用，可以安装`npm i load-grunt-tasks`
2. 使用

```js
const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
module.exports = grunt => {
  grunt.initConfig({
    babel: {
    // 最新的转换规则
      options: {
        presets: ['@babel/preset-env'],
        // 会生成对应的sourceMap文件
        sourceMap: true
      },
      main: {
        // 键是输出，值是输入
        files: {
          'dist/js/app.js': 'src/js/app.js'
        }
      }
    }
  })
  // 自动加载所有的grunt插件中的任务
  loadGruntTasks(grunt)
}
```
3. 执行`grunt babel`，可以看dist文件夹中es6的语法被成功编译。
4. 剩下的配置选项需要去官方文档中查找

##### grunt-contrib-watch
监听文件修改并自动编译

1. 安装`npm i grunt-contrib-watch`
2. 使用

```js
const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
module.exports = grunt => {
  grunt.initConfig({
    // sass插件
    sass: {
      options:{
        implementation: sass,
        sourceMap: true
      },
      main: {
        files: {
          'css/style.css': 'scss/main.scss'
        }
      }
    },
    // babel插件
    babel: {
      options: {
        presets: ['@babel/preset-env'],
        sourceMap: true
      },
      main: {
        files: {
          'dist/js/app.js': 'src/js/app.js'
        }
      }
    },
    // 监听插件
    watch: {
      // 对js的任务
      js: {
        // 监听的文件路径，还有监听修改之后执行的任务名称
        files: ['src/js/*.js'],
        tasks: ['babel']
      },
      // 对css的任务
      css: {
        files: ['scss/*.scss'],
        tasks: ['sass']
      }
    }
  })
  // 自动加载所有的grunt插件中的任务
  loadGruntTasks(grunt)
}
```
3. 执行`grunt watch`，然后修改对应的文件可以看到实时改变。

4. 由于`watch`执行的时候不会自动先执行`sass`和`babel`，所以需要定义一个`default`任务，先执行一遍之后再监听。
```js
//先执行sass和babel再执行watch
grunt.registerTask('default', ['sass', 'babel', 'watch'])
```
这个时候执行`grunt`即可。
```bash
grunt      

# Running "sass:main" (sass) task

# Running "babel:main" (babel) task

# Running "watch" task
# Waiting...
```

