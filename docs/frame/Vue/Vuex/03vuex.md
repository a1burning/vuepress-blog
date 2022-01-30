---
title: 分析源码并手写一个超简单的Vuex
tags: 
  - Vue
  - Vuex
  - Source Code
prev: ./02vuex.md
next: false
sidebarDepth: 5
---

## 分析源码

官网下载3.6版本。

最核心的代码就是store.js，起始的代码是src/index.js其导出了一个默认对象，还单独对函数进行导出。这样导出方式可以有两种。一种是加载默认对象，一种是按需加载。



- install方法：挂载Vue插件，给所有的组件分配了一个数据 $store。

- Vuex依赖了Vue，当注册插件之后才可以用。

- 给所有的Vue实例混入了一个 beforeCreate 钩子函数。获取$options，将store注入进去(判断如果有就是根实例)

- 一般是服务端渲染的时候，store会给一个function，目的是为了防止多请求数据交叉污染。

- 在子组件的时候，把其parent里注入了$store

### 核心
1. 初始化内部数据成员
2. 设置commit和dispatch的this指向
3. 初始化state响应式数据  
    -  Vuex内部就是使用的Vue来实现数据响应式功能，将用户传入的$$state挂载到了Vue实例的data中  
    -  给store设置了一个get访问器访问state属性的时候返回`this._vm._data.$$state`，所以我们使用的时候直接使用store.state就可以访问。  
4. 初始化getters数据(计算属性)  
    -  getter中的计算属性，依赖成员变化，计算属性重新计算，计算属性有缓存功能，数据没有变，不会重新获取。
    -  遍历用户传递的getters，然后将其通过Object.defineProperty方法设置get和enumerable，get方法返回`store._vm[key]`
    -  最后添加到Vue的计算属性computed上。访问store.getters就是返回vue实例上的computed。

## 手写一个简单的Vuex
### 分析Vuex的功能
- 首先导入`vuex`的是一个对象
- 使用`use`挂载到`Vue`的实例上，`use`方法调用`vuex`的`install`方法
- 调用`new Vuex.Store`方法初始化实例
- 传入参数是一个对象，里面有`state`、`getters`、`mutations`、`actions`等属性
- 使用的时候直接使用`$store.state`和`$store.getters`来访问`store`里面的状态和`getter`
- 修改状态可以直接使用`$store.commit`提交`mutation`
- 在执行异步操作可以使用`$store.dispatch`分发`action`

### 下载模板
- [vuex-myvuex-demo-temp](https://github.com/a1burning/demofiles/tree/master/vuex-myvuex-demo-temp)
- 里面使用了`vuex`进行简单的模拟操作，这里只是简单实现里面的`state`，`getter`，`mutations`，`actions`属性，其余的方法并不实现。

### 分析模块结构
需要一个`vuex`的模块，这个模块需要导出一个`install`方法和一个`Store`类

```js
let _Vue = null
class Store {}

// install接收一个参数，Vue构造函数，后面在Store类中还要使用构造函数,所以在全局定义一个_Vue
function install (Vue) {
  _Vue = Vue
}

export default {
  Store,
  install
}
```

### 实现install函数

```js
// install接收一个参数，Vue构造函数，后面在Store类中还要使用构造函数,所以在全局定义一个_Vue
function install (Vue) {
  _Vue = Vue
  // 1. 创建Vue实例传入的store对象注入到Vue原型上的$store，在所有组件中用this.$store都可以获取到Vuex的仓库，从而共享状态
  // 2. 这里我们获取不到Vue的实例，所以这里通过混入beforeCreate来获取Vue实例，从而拿到选项中的store对象
  _Vue.mixin({
    beforeCreate () {
      // 这里的this就是Vue的实例
      // 首先判断当前Vue的实例的options中是否有store，当创建根实例的时候，会把store注入到Vue的实例上，如果是组件实例，并没有store选项就不需要做这件事情
      if (this.$options.store) {
        // 给Vue的原型上挂载$store
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}
```

### 实现Store类

```js
class Store {
  // 构造函数接收一个参数是对象
  constructor (options) {
    // 这里对对象进行解构，并且赋默认值为空对象，避免没有传当前属性
    const {
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options
    // 将state属性进行响应式处理
    this.state = _Vue.observable(state)
    // 对getters属性进行处理
    // getters是一个对象，对象中有一些方法，这些方法都需要接收state参数，并且最终都有返回值，这些方法都是获取值，所以可以使用Object.defineProperty将这些方法转换成get访问器
    // 1. 先定义一个this.getters让外部可以直接访问，然后初始化成一个没有原型对象的空对象
    this.getters = Object.create(null)
    // 2. 遍历所有的getters的key，把对应的key注册到this.getters对象中，定义一个get属性，返回key对应的getters中方法的执行结果，并传入state
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state)
      })
    })
    // 内部属性是私有属性，标识下划线_，不希望外部访问
    // 对mutations属性进行处理
    this._mutations = mutations
    // 对actions属性进行处理
    this._actions = actions
  }

  // 在commit方法中获取_mutations
  // 接收两个参数，第一个参数是type，方法名称，第二个参数是payLoad，调用方法的参数
  commit (type, payload) {
    //通过type找到this._mutations中的方法并调用，传入参数payload
    this._mutations[type](this.state, payload)
  }

  // 在dispatch方法中获取_actions
  // 实现方式和commit一样
  dispatch (type, payload) {
    // 第一个参数是context，这里简单模拟就传入this，这个里面就有我们需要的state，commit等
    // 第二个参数是payload
    this._actions[type](this, payload)
  }
}
```

### 替换vuex

将`index.js`中的`vuex`的导入替换成`../myVuex`，打开浏览器，可以看到`mutation`和`actions`可以正常执行

```js
import Vuex from '../myVuex'
```

