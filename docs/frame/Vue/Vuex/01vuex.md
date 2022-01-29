---
title: Vuex —— 集中式的状态管理仓库
tags: 
  - Vue
  - Vuex
date: 2020-12-31
prev: false
next: ./02vuex.md
sidebarDepth: 5
---

当项目比较复杂，多个组件共享状态的时候，使用组件间通信的方式比较麻烦，而且需要维护。这个时候我们可以使用集中式的状态解决方案 —— Vuex

## 组件内的状态管理流程
Vue最核心的两个功能：**数据驱动** 和 **组件化**

使用基于组件化的开发，可以提高开发效率，带来更好的可维护性。

```js
new Vue({
    // state 组件内部都可以管理自己的内部状态
    data () {
        return {
            count: 0
        }
    },
    // view 视图，每个组件都有自己的视图，把状态绑定到视图上，当用户和视图交互的时候，可能会更改状态
    template: `<div>{{ count }}</div>`,
    // actions 行为，这里描述的是单个组件内部的状态管理，实际开发中可能多个组件可以共享状态
    methods: {
        increment () {
            this.count++
        }
    }
})
```

这里说的状态管理 —— 是通过状态，集中管理和分发，解决多个组件共享状态的问题。

- `state`：状态，数据源。
- `view`：视图。通过把状态绑定到视图呈现给用户
- `actions`：用户和视图交互改变状态的方式

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0941321564c040fbad89273d5f9bd9bd~tplv-k3u1fbpfcp-watermark.image)

图中表明，状态绑定到视图上呈现给用户，用户通过与视图交互改变状态，之后改变了的状态再绑定到视图会后呈现给用户。  
单向的数据流程很简单清晰，但是多个组件共享数据会破坏这种简单的结构。

## 简易的状态管理方案

### 普通组件间通信方式的问题

如果多个组件之间需要共享状态，使用之前演示的方式虽然都可以实现，但是比较麻烦，而且多个组件之间进行传值，很难跟踪到数据的变化。如果出现问题的话，很难定位问题。当遇到多个组件需要共享状态的时候，典型的场景如购物车，我们使用之前介绍的方案都不合适，可能会遇到以下的问题：
- **多个视图依赖同一状态**，如果多层嵌套的组件依赖同一状态，使用父子组件传值可以实现，但是非常麻烦而且不易管理。
- **来自不同视图的行为需要变更同一状态**，我们可以通过父子组件的方式对状态进行修改，或者通过事件机制来改变，或者同步状态的变化，以上这些方式非常的脆弱，通常会导致产生无法维护的代码。

### 集中式的状态管理方案
为了解决这些问题，我们把不同组件的共享状态抽取出来，存储到一个全局对象中并且将来使用的时候保证其实响应式的。这个对象创建好之后里面有全局的状态和修改状态的方法，我们的任何组件都可以获取和通过调用对象中的方法修改全局对象中的状态 **(组件中不允许直接修改对象的`state`状态属性)。** 

把多个组件的状态放到一个集中的地方存储，并且可以检测到数据的更改，这里先不使用`Vuex`，我们自己先进行一个简单的实现。

1. 创建一个全局的`store.js`

> 集中式的状态管理，所有的状态都在这里。这个模块中导出了一个对象，这对象就是状态仓库且全局唯一的对象，任何组件都可以导入这个模块使用  
> 
> 这里面有`state`，还有`actions`，`state`是用来存储状态，`actions`是用户交互更改视图用的。还有一个`debug`的属性，方便开发调试。  

```js
// store.js
export default {
  debug: true,
  state: {
    user: {
      name: 'xiaomao',
      age: 18,
      sex: '男'
    }
  },
  setUserNameAction (name) {
    if (this.debug) {
      console.log('setUserNameAction triggered：', name)
    }
    this.state.user.name = name
  }
}
```

2. 在组件中导入

```html
<!--组件A-->
<template>
  <div>
    <h1>componentA</h1>
    <!--3. 可以在视图中直接用点的方式显示数据-->
    user name: {{ sharedState.user.name }}
    <button @click="change">Change Info</button>
  </div>
</template>

<script>
// 1. 在组件中导入store
import store from './store'
export default {
  methods: {
    // 4. 当点击按钮的时候，调用store的方法，将值改为componentA
    change () {
      store.setUserNameAction('componentA')
    }
  },
  data () {
    return {
      // 当前组件还可以有自己的私有状态，存在privateState中
      privateState: {},
      // 2. 将store的state属性赋值给shareState
      sharedState: store.state
    }
  }
}
</script>

<style></style>
```

```html
<!--组件B，用法与上面一样，就是修改名字的时候值为componentB-->
<template>
  <div>
    <h1>componentB</h1>
    user name: {{ sharedState.user.name }}
    <button @click="change">Change Info</button>
  </div>
</template>

<script>
import store from './store'
export default {
  methods: {
    change () {
      // 修改名字的时候改成了componentB
      store.setUserNameAction('componentB')
    }
  },
  data () {
    return {
      privateState: {},
      sharedState: store.state
    }
  }
}
</script>

<style></style>
```


上面组件`A`和组件`B`都共享了全局的状态，并且用户都可以更改状态。调试的时候，按`A`组件的按钮两者都变成了`componentA`，点`B`组件的按钮两者都变成了`componentB`。

我们不在组件中直接修改状态的值而是通过调用`store`的`actions`来修改值，这样记录的好处是： **能够记录`store`中所以`state`的变更，当可以实现记录`store`的`state`的变更时候，就可以实现高级的调试功能。例如：`timeTravel`(时光旅行)和历史回滚功能。** 

刚才使用的`store`，其实就类似于`Vuex`的仓库。

当项目比较复杂，多个组件共享状态的时候，使用组件间通信的方式比较麻烦，而且需要维护。这个时候我们可以使用集中式的状态解决方案 —— `Vuex`

## Vuex
好的终于进入了主题~~
### 什么是Vuex?

- [Vuex官网](https://vuex.vuejs.org/zh/)
- `Vuex` 是专门为 `Vue.js` 设计的状态管理库，从使用的角度其实就是一个`JavaScript`库
- 它采用集中式的方式存储需要共享的数据，如果状态特别多的话不易管理，所以`Vuex`还提供了一种模块的机制，按照模块管理不同的状态
- 它的作用是进行状态管理，解决复杂组件通信，数据共享
- `Vuex` 也集成到 `Vue` 的官方调试工具 `devtools extension`，提供了`time-travel`时光旅行、历史回滚、状态快照、导入导出等高级调试功能

### 什么情况下使用Vuex?

#### 非必要的情况不要使用Vuex

`Vuex` 可以帮助我们管理组件间共享的状态，但是在项目中使用`Vuex`的话，我们需要了解`Vuex`中带来的新的概念和一些`API`，如果项目不大，并且组件间共享状态不多的情况下，这个时候使用`Vuex`给我们带来的益处并没有付出的时间多。此时使用简单的 [store 模式](https://cn.vuejs.org/v2/guide/state-management.html#%E7%AE%80%E5%8D%95%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E8%B5%B7%E6%AD%A5%E4%BD%BF%E7%94%A8) 或者其他方式就能满足我们的需求。

#### 中大型单页应用程序使用更好
中大型单页应用程序中，使用`Vuex`可以帮我们解决**多个视图依赖同一状态**、**来自不同视图的行为需要变更同一状态**的问题。建议符合这些情况的业务，使用`Vuex`进行状态管理，会给我们提供更好的处理组件的状态，带来的收益会更好些。例如典型案例：购物车。

> 注意：不要滥用`Vuex`，否则会让业务变得更复杂。

### Vuex核心概念回顾
下面这张图展示了`Vuex`的核心概念并且展示了`Vuex`的整个工作流程

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f29d03d72da14ab69ac695d7fd96425e~tplv-k3u1fbpfcp-watermark.image)

- **Store**：仓库，`Store`是使用`Vuex`应用程序的核心，每个应用仅有一个`Store`，它是一个容器，包含着应用中的大部分状态，当然我们不能直接改变`Store`中的状态，我们要通过提交`Mutations`的方式改变状态。
- **State**：状态，保存在`Store`中，因为`Store`是唯一的，所以`State`也是唯一的，称为单一状态树，这里的状态是响应式的。
- **Getter**：相当于`Vuex`中的计算属性，方便从一个属性派生出其他的值，它内部可以对计算的结果进行缓存，只有当依赖的状态发生改变的时候，才会重新计算。
- **Mutation**：状态的变化必须要通过提交`Mutation`来完成。
- **Actions**：与`Mutation`类似，不同的是可以进行异步的操作，内部改变状态的时候都需要改变`Mutation`。
- **Module**：模块，由于使用的单一状态树让所有的状态都会集中到一个比较大的对象中，应用变得很复杂的时候，`Store`对象就会变得相当臃肿，为了解决这些问题`Vuex`允许我们将`Store`分割成模块，每个模块拥有自己的`State`，`Mutation`，`Actions`，`Getter`，甚至是嵌套的子模块。

### Vuex基本结构
使用`vue-cli`创建项目的时候，如果选择了`Vuex`，会自动生成`Vuex`的基本结构。

```js
// store.js
import Vue from 'vue'
// 导入Vuex插件
import Vuex from 'vuex'
// 通过use方法注册插件
// 插件内部把Vuex的Store注入到了Vue的实例上
Vue.use(Vuex)
// 创建了Vuex的Store对象并且导出
export default new Vuex.Store({
    state: {
        ...
    },
    mutations: {
        ...
    },
    actions: {
        ...
    },
    modules: {
        ...
    }
    // 如果有需要还可以有getters
})
```

```js
//App.js
// 导入store对象
import store from './store'
new Vue({
    router,
    // 在初始化Vue的时候传入store选项，这个选项会被注入到Vue实例中
    // 我们在组件中使用的this.$store就是在这个地方注入的
    store,
    render: h => h(App)
}).$mount('#app')
```

### State的使用

1. 下载项目模板[vuex-sample-temp](https://github.com/a1burning/demofiles/tree/master/vuex-sample-temp) ，`npm install`下载依赖，在`store/index.js`中定义两个`state`

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'hello vue'
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```
2. 在`App.vue`中使用`state`，然后使用`npm run serve`查看结果

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ $store.state.count}} <br/>
    msg: {{ $store.state.ms }}
  </div>
</template>
<script>
```

3. 每次使用变量都要前面写 `$store.state 很是麻烦，所以这里使用``Vuex`内部提供的`myState`的函数，会帮我们生成状态对应的计算属性

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!--4. 在使用的时候直接用计算属性count和msg即可-->
    count: {{ count }} <br/>
    msg: {{ msg }}
  </div>
</template>
<script>
  // 1. 引入vuex的mapState模块
  import { mapState } from 'vuex'
  export default {
    // 2. 在计算属性中调用mapState函数
    computed: {
      // 3. mapState需要接收数组作为参数，数组的元素是需要映射的状态属性
      // 会返回一个对象，包含两个对应属性计算的方法
      // { count: state => state.count, msg: state => state.msg }
      // 然后这里使用扩展运算符展开对象，完成之后我们就有了count和msg两个计算属性
      ...mapState(['count', 'msg'])
    }
  }
</script>
```

4. 上面的方法比较简洁但是如果这个组件中本身就有`count`或者`msg`属性，就会造成名称冲突，这个时候需要设置别名。

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <!-- 使用的时候直接使用别名即可 -->
    count: {{ num }} <br/>
    msg: {{ message }}
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    // mapState可以传对象，键是别名，值是映射的状态属性
    ...mapState({ num: 'count', message: 'msg' })
  }
}
</script>
```

### Getter的使用
`Vuex`中的`getter`就相当于组件中的计算属性，如果想要对`state`的数据进行简单的处理在展示，可以使用`getter`

> 这里用`Vuex`的`getter`处理而不是用组件中的计算属性是因为状态本身属于`Vuex`，应该在其内部处理

1. 在`store.js`中设置`getters`

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'hello vue'
  },
  // 与计算属性的写法一致
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

```

2. 在`App.vue`中使用

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <h2>reverseMsg: {{ $store.getters.reverseMsg }}</h2>
    <br/>
  </div>
</template>
```

3. 同样那样引用过于麻烦，那么和`mapState`一样，使用内部的`mapGetters`，也是将其映射到组件的计算属性，其用法和`mapState`一样，也可以为了避免冲突使用对象设置别名。

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <h2>reverseMsg: {{ reverseMsg }}</h2>
    <br/>
  </div>
</template>
<script>
// 1. 引入vuex的mapGetters模块
import { mapGetters } from 'vuex'
export default {
  // 2. 在计算属性中调用mapGetters函数
  computed: {
    // 3. 用法与mapState一致，这里也可以使用对象设置别名
    ...mapGetters(['reverseMsg'])
  }
}
</script>
```

### Mutation的使用
状态的修改必须提交`Mutation`，`Mutation`必须是同步执行的。

1. 当用户点击按钮的时候，`count`值进行增加，先在`store.js`中写`Mutation`函数

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'hello vue'
  },
  mutations: {
    // 增加函数，接收两个参数
    // 第一个state状态
    // 第二个是payload载荷，payload是mutations的时候提交的额外参数，可以是对象，这里传递的是数字
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
  },
  modules: {
  }
})

```

2. 在`App.vue`中设置按钮，并注册事件

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ $store.state.count }} <br/>
    <h2>Mutation</h2>
    <!-- 给按钮注册点击事件，点击的时候调用commit提交Mutation，第一个参数是调用的方法名，第二个参数是payload，传递的数据 -->
    <button @click="$store.commit('increate', 2)">Mutation</button>
  </div>
</template>
```

3. 点击按钮的时候，`count`的值每次`+2`
4. 下面进行写法优化，使用`map`方法将当前的`mutation`映射到`methods`中，其依旧会返回一个对象，这个对象中存储的是`mutation`中映射的方法

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ $store.state.count }} <br/>
    <h2>Mutation</h2>
    <!-- 这里直接写方法，，第一个参数state不需要传递，后面传payload参数为3 -->
    <button @click="increate(3)">Mutation</button>
  </div>
</template>
<script>
// 1. 引入vuex的mapMutations模块
import { mapMutations } from 'vuex'
export default {
  // 2. methods中调用mapMutations方法
  methods: {
    ...mapMutations(['increate'])
  }
}
</script>
```

#### Mutation的调试
运行到`4`之后，这时看一下`devtools`看一下时光旅行和历史回滚，下面是初始状态

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d94827e64e91466f90ceaa908f5ccd46~tplv-k3u1fbpfcp-watermark.image)

点一下按钮之后就增加了一个记录，还显示了改变之后的数据

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8295943e58b84b55a30bd911c35540ee~tplv-k3u1fbpfcp-watermark.image)

如果数据不对，可以进行调试。

##### 时光旅行
然后多点几下，进行时光旅行。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5c10d50868c4d8e9f0dba1c0b8454a3~tplv-k3u1fbpfcp-watermark.image)

点击按钮之后，状态就变成了之前那个状态，这个功能也是为了方便调试

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4d983a547184cada554241a80fd7473~tplv-k3u1fbpfcp-watermark.image)

##### 状态回滚
这个图标就是状态回滚

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9658fa6735464f55b9f8bfefe3bdee62~tplv-k3u1fbpfcp-watermark.image)

点击之后，代码就回到了没有执行这一步的状态

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ee64e60392940bbab21b3b5fb9c1266~tplv-k3u1fbpfcp-watermark.image)


##### 提交改变
下面那个按钮的意思是将这次提交作为最后一次提交

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9a74882b0e740d29afa33743964888b~tplv-k3u1fbpfcp-watermark.image)

点击之后，`base State`变成了那次的状态，其他的状态以这个作为起始点

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39a8739db98c45969d5f6f2a25066728~tplv-k3u1fbpfcp-watermark.image)

### Actions的使用
如果有异步的修改，需要使用`actions`，在`actions`中可以执行异步操作，当异步操作结束后，如果需要更改状态，还需要提交`Mutation`。

1. 在`actions`中添加方法`increateAsync`

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: 'hello vue'
  },
  mutations: {
    increate (state, payload) {
      state.count += payload
    }
  },
  actions: {
    // actions中的方法有两个参数：第一个参数是context上下文，这个对象中有state，commit，getters等成员，第二个参数是payLoad
    increateAsync (context, payLoad) {
      setTimeout(() => {
        context.commit('increate', payLoad)
      }, 2000)
    }
  },
  modules: {
  }
})
```
2. 在`App.vue`中使用`dispatch`，`actions`的方法都要用这个

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ $store.state.count }} <br/>
    <h2>Actions</h2>
    <!--这里使用了dispatch-->
    <button @click="$store.dispatch('increateAsync',5)">Action</button>
  </div>
</template>
```

3. 进行优化，这个时候引入`mapActions`

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count: {{ $store.state.count }} <br/>
    <h2>Actions</h2>
    <button @click="increateAsync(5)">Action</button>
  </div>
</template>
<script>
// 1. 引入vuex的mapActions模块
import { mapActions } from 'vuex'
export default {
  methods: {
    // 这个是对Actions的方法的映射，把this.increateAsync映射到this.$store.dispatch
    ...mapActions(['increateAsync'])
  }
}
</script>
```

### Modules的使用
模块可以让我们把单一状态树拆分成多个模块，每个模块都可以拥有自己的`state`，`mutation`，`action`，`getter`甚至嵌套子模块。

#### 模块定义
在`store`文件夹中，创建一个`modules`文件夹，里面每一个`js`文件就是一个模块，下面是每一个模块的定义格式

```js
const state = {
  products: [
    { id: 1, title: 'iPhone 11', price: 8000 },
    { id: 2, title: 'iPhone 12', price: 10000 }
  ]
}
const getters = {}
const mutations = {
  setProducts (state, payload) {
    state.products = payload
  }
}
const actions = {}

export default {
  namespaced: false,
  state,
  getters,
  mutations,
  actions
}

```

#### 模块注册
1. 先导入这个模块

```js
import products from './modules/products'
import cart from './modules/cart'
```

2. 后来在`modules`选项中注册，注册之后这里会把模块挂载到`store`的`state`中，这里可以通过`store.state.products`访问到`products`模块中的成员，还把的模块中的`mutation`成员记录到了`store`的内部属性`_mutation`中，可以通过`commit`直接提交`mutation`。

```js
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    products,
    cart
  }
})
```

#### 模块使用
1. 在`App.vue`中使用，`state`就点出来，`mutation`还是用`commit`方法

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <h2>Modules</h2>
    <!--第一个products是products模块，第二个products是模块的state的products属性-->
    products: {{ $store.state.products.products }} <br/>
    <button @click="store.commit('setProducts',[])">Mutation</button>
  </div>
</template>
```


#### 添加命名空间
因为每个模块中的`mutation`是可以重名的，所以推荐使用命名空间的用法，方便管理。

1. 在开启命名空间的时候，在模块的导出部分添加`namespaced`

```js
const state = {}
const getters = {}
const mutations = {}
const actions = {}

export default {
  // true就是开启，false或者不写就是关闭
  namespaced: false,
  state,
  getters,
  mutations,
  actions
}

```

2. 使用的时候在`App.vue`中要设置`state`是模块中出来的，如果没有命名空间，就是全局的`state`的。

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    products: {{ products }} <br/>
    <button @click="setProducts([])">Mutation</button>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    // 模块中的state，第一个参数写模块名称，第二个参数写数组或者对象
    ...mapState('products', ['products'])
  },
  methods: {
    // 模块中的mutations，第一个写模块名称，第二个写数组或者对象
    ...mapMutations('products', ['setProducts'])
  }
}
</script>
```

### Vuex严格模式
所有的状态变更必须提交`mutation`，但是如果在组件中获取到`$store.state.msg`进行修改，语法层面没有问题，却破坏了`Vuex`的约定，且`devTools`也无法跟踪到状态的修改，开启严格模式之后，如果在组件中直接修改`state`，会报错。

1. 在`index.js`，初始化`Store`的时候开启严格模式

```js
export default new Vuex.Store({
  strict: true,
  state: {
    ...
  },
  ...
}
```

2. 在`App.vue`中使用直接赋值的语句

```html
<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    <h2>strict</h2>
    <button @click="$store.state.msg = 'hello world~'">strict</button>
  </div>
</template>
```

3. 点击按钮内容改变，但是控制台会抛出错误

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33acf0eb758a44ad8494a4688a0906b5~tplv-k3u1fbpfcp-watermark.image)

> 注意：不要在生产环境开启严格模式，因为严格模式会深度检测状态树，会影响性能。在开发模式中开启严格模式，在生产环境中关闭严格模式
>
> ```js
> export default new Vuex.Store({
>  strict: process.env.NODE_ENV !== 'production',
>  state: {
>   ...
> }
>```

### Vuex插件
- `Vuex`插件就是一个函数，接收一个`store`的参数
- 在这个函数中可以注册函数让其在所有的`mutations`结束之后再执行

#### 插件的使用
- 插件应该在创建`Store`之前去创建
- `subscribe`函数
    + 作用是去订阅`store`中的`mutation`
    + 他的回调函数会在每个`mutation`之后调用
    + `subscribe`会接收两个参数，第一个是`mutation`，还可以区分模块的命名空间，第二个参数是`state`，里面是存储的状态

1. 定义插件

```js
// 这个函数接收store参数
const myPlugin = store => {
    // 当store初始化后调用
    store.subscribe((mutation, state) => {
        // 每次 mutation 之后调用
        // mutation 的格式为 { type, payload }
        // type里面的格式是 "模块名/state属性"
        // state 的格式为 { 模块一, 模块二 }
    })
}
```
2. 在`Store`中注册插件

```js
const store = new Vuex.Store({
    //...
    plugins: [myPlugin]
})
```


