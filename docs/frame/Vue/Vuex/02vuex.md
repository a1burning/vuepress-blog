---
title: 用Vuex完成购物车案例
tags: 
  - Vue
  - Vuex
  - Example
prev: ./01vuex.md
next: ./03vuex.md
sidebarDepth: 5
---
<Badge text="案例"/>
上一节介绍了`Vuex`的核心原理及简单使用，这里来一个实际案例

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2bfd39c42124bd39d7c21a5358f95e0~tplv-k3u1fbpfcp-watermark.image)

## 需求
- 商品列表展示商品、价格和【加入购物车】按钮
    + 点击【加入购物车】按钮加入购物车，【我的购物车】提示数量增加
- 【我的购物车】按钮
    + 鼠标悬停出现`popover`，展示购物车里面的商品，价格数量，【删除】按钮，还有总数量和总价格，还有【去购物车】按钮
    + 【删除】按钮可以删除整个商品，总价和数量都会改变
    + 点击【去购物车】按钮可以跳到购物车界面
- 展示多选框，商品，单价，数量及【加减按钮车】，小计，【删除】按钮，总量和总价，【结算】按钮
    + 数量加减改变数量，小计，总数量和总价
    + 【删除】按钮删除整个商品
    + 多选框不选中的不计入总数量和总价格。
+ 刷新页面，状态还在，存在本地存储中

## 需求分析
### 组件分析
- 路由组件
    + 商品列表(①)
    + 购物车列表(②)
- 我的购物车弹框组件(③)

### 组件通信
②和③都依赖购物车的数据，①中点击添加购物车，主要把数据传递给②和③，②和③之间的数据修改也互相依赖，如果没有`Vuex`需要花时间精力在如何在组件中传值上。

## 开发
### 准备环境
1. 下载模板[vuex-cart-demo-template](https://github.com/goddlts/vuex-cart-demo-template)，里面已经将路由组件、样式组件和数据都写好了，我们只要负责实现功能即可。项目中还有一个`server.js`的文件，这个是`node`用来模拟接口的。

```js
const _products = [
  { id: 1, title: 'iPad Pro', price: 500.01 },
  { id: 2, title: 'H&M T-Shirt White', price: 10.99 },
  { id: 3, title: 'Charli XCX - Sucker CD', price: 19.99 }
]

app.use(express.json())
// 模拟商品数据
app.get('/products', (req, res) => {
  res.status(200).json(_products)
})
// 模拟支付
app.post('/checkout', (req, res) => {
  res.status(200).json({
    success: Math.random() > 0.5
  })
})
```

2. 首先`npm install`安装依赖，之后`node server`将接口跑起来，然后再添加终端输入`npm run serve`让项目跑起来，这个时候访问`http://127.0.0.1:3000/products`可以访问到数据，访问`http://localhost:8080/`可以访问到页面

### 准备模块结构

1. 在`store`文件夹中创建`modules`文件夹，创建两个模块`products.js`和`cart.js`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e75b82f059d147e9a6eead558cbf71d2~tplv-k3u1fbpfcp-watermark.image)

2. 在`products.js`和`cart.js`文件中搭建基本结构

```js
const state = {}
const getters = {}
const mutations = {}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

3. 在`index.js`中导入并且引用模块

```js
import Vue from 'vue'
import Vuex from 'vuex'
// 1. 导入模块
import products from './modules/products'
import cart from './modules/cart'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  // 2. 引用模块
  modules: {
    products,
    cart
  }
})
```

### 商品列表组件
- 展示商品列表
- 添加购物车

#### 展示商品列表
1. 在`products.js`中要实现下面的方法

> - 在`state`中定义一个属性记录所有的商品数据
> - 在`mutations`中添加方法去修改商品数据
> - 在`actions`中添加方法异步向接口请求数据

```js
// 导入axios
import axios from 'axios'
const state = {
  // 记录所有商品
  products: []
}
const getters = {}
const mutations = {
  // 给products赋值
  setProducts (state, payLoad) {
    state.products = payLoad
  }

}
const actions = {
  // 异步获取商品，第一个是context上下文，解构出来要commit
  async getProducts ({ commit }) {
    // 请求接口
    const { data } = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/products'
    })
    // 将获取的数据将结果存储到state中
    commit('setProducts', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

```

2. 在`products.vue`中将原来的`data`删除，导入模块并使用

```html
<script>
// 导入需要的模块
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ProductList',
  // 创建计算属性，映射products数据，因为开启了命名空间，这里添加了命名空间的写法，后面是映射的属性products
  computed: {
    ...mapState('products', ['products'])
  },
  // 把actions里面的方法映射进来，第一个依旧是命名空间的写法
  methods: {
    ...mapActions('products', ['getProducts'])
  },
  // 组件创建之后调用getProducts获取数据
  created () {
    this.getProducts()
  }
}
</script>
```

3. 打开浏览器，可以看到商品界面已经出现了三个商品。

#### 添加购物车
把当前点击的商品存储到一个位置，将来在购物车列表组件中可以访问到，所以需要一个位置记录所有的购物车数据，这个数据在多个组件中可以共享，所以将这个数据放在`cart`模块中

 1. 在模块`cart.js`中写数据
 
```js
const state = {
  // 记录购物车商品数据
  cartProducts: []
}
const getters = {}
const mutations = {
  // 第二个是payLoad，传过来的商品对象
  addToCart (state, product) {
    // 1. 没有商品时把该商品添加到数组中，并增加count，isChecked，totalPrice
    // 2. 有该商品时把商品数量加1，选中，计算小计
    // 判断有没有该商品，返回该商品
    const prod = state.cartProducts.find(item => item.id === product.id)

    if (prod) {
      // 该商品数量+1
      prod.count++
      // 选中
      prod.isChecked = true
      // 小计 = 数量 * 单价
      prod.totalPrice = prod.count * prod.price
    } else {
      // 给商品列表添加一个新商品
      state.cartProducts.push({
        // 原来products的内容
        ...product,
        // 数量
        count: 1,
        // 选中
        isChecked: true,
        // 小计为当前单价
        totalPrice: product.price
      })
    }
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

2. 在`products.vue`中导入`cart`的添加购物车`mutation`

```html
<template>
  <div>
    ...
    <el-table
      :data="products"
      style="width: 100%">
      ...
      <el-table-column
        prop="address"
        label="操作">
        <!-- 这一行可以通过插槽获取作用域数据 -->
        <!-- <template slot-scope="scope"> 这是2.6之前的写法，2.6之后已经过时了换成下里面的写法了-->
        <template v-slot="scope">
          <!--添加点击事件，传入当前列表-->
          <el-button @click="addToCart(scope.row)">加入购物车</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'ProductList',
  computed: {
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapActions('products', ['getProducts']),
    // 将添加购物商品的数据映射到methods中
    ...mapMutations('cart', ['addToCart'])
  },
  created () {
    this.getProducts()
  }
}
</script>

<style></style>

```

3. 点开浏览器，可以点击加入购物车按钮，点开调试台可以看到数据的变化

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f383c4f39975438db623b9f97ce30c01~tplv-k3u1fbpfcp-watermark.image)

### 我的购物车组件
- 购买商品列表
- 统计购物车总数和总价
- 删除按钮

#### 购物车列表

1. 在`component/pop-cart.vue`中导入购物车数据

```html
<template>
  <el-popover
    width="350"
    trigger="hover"
  >
  <!-- 这里是cartProducts的数据，不需要修改 -->
    <el-table :data="cartProducts" size="mini">
      <el-table-column property="title" width="130" label="商品"></el-table-column>
      ...
    </el-table>
    ...
  </el-popover>
</template>

<script>
// 导入vuex模块
import { mapState } from 'vuex'
export default {
  name: 'PopCart',
  computed: {
    // 把cart模块中的cartProducts导入
    ...mapState('cart', ['cartProducts'])
  }
}
</script>

<style></style>

```

2. 打开浏览器，点击商品添加购物车，可以看到弹窗里有新加的商品

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fda69ee95e14562a7e4e9d58194250e~tplv-k3u1fbpfcp-watermark.image)

#### 商品数量和统计功能

1. 因为总数和总量可以用`store`中的`getters`来写，因为是对数据的简单修改，在`cart.js`的`getters`中这么写：

```js
const getters = {
  // 接收state为参数，返回结果
  totalCount (state) {
    // 返回数组中某个元素的和，用reduce方法
    // reduce方法接收两个参数，第一个参数是函数，第二个参数是起始数(这里从0开始)
    // 函数内部接收两个参数，第一个参数是求和变量，第二个数组的元素
    return state.cartProducts.reduce((sum, prod) => sum + prod.count, 0)
  },
  // 与上面同样写法
  totalPrice () {
    return state.cartProducts.reduce((sum, prod) => sum + prod.totalPrice, 0)
  }
}
```

2. 在`components/pop-cart.vue`中引用

```html
<template>
  <el-popover
    width="350"
    trigger="hover"
  >
    ...
    <div>
      <!-- 总数和总量也改成插值表达式 -->
      <p>共 {{ totalCount }} 件商品 共计¥{{ totalPrice }}</p>
      <el-button size="mini" type="danger" @click="$router.push({ name: 'cart' })">去购物车</el-button>
    </div>
    <!-- 徽章这里，将value修改成totalCount -->
    <el-badge :value="totalCount" class="item" slot="reference">
      <el-button type="primary">我的购物车</el-button>
    </el-badge>
  </el-popover>
</template>

<script>
// 把mapGetters导入
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PopCart',
  computed: {
    ...mapState('cart', ['cartProducts']),
    // 把cart模块中的totalCount和totalPrice导入
    ...mapGetters('cart', ['totalCount', 'totalPrice'])
  }
}
</script>

<style>

</style>

```

3. 打开浏览器，添加两个商品，可以看到徽章和总计都发生了变化

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21ec55d660794963abc336accdaca6c1~tplv-k3u1fbpfcp-watermark.image)

#### 删除购物车商品
删除商品要修改`cart`模块中的`state`，所以要在`cart`模块中添加一个`mutation`

1. 在`card`的`mutation`中添加

```js
const mutations = {
  addToCart (state, product) {
    ...
  },
  // 删除购物车商品，第二个参数是商品id
  deleteFromCart (state, prodId) {
    // 使用数组的findIndex获取索引
    const index = state.cartProducts.findIndex(item => item.id === prodId)
    // 判断这个是不是等于-1，如果不是说明有这个商品，就执行后面的删除该元素
    // splice接收删除元素的索引，第二个元素是删除几个元素，这里写1
    index !== -1 && state.cartProducts.splice(index, 1)
  }
}
```

2. 在`components/pop-cart.vue`中引用

```html
<template>
  <el-popover
    width="350"
    trigger="hover"
  >
    <el-table :data="cartProducts" size="mini">
      ...
      <el-table-column label="操作">
        <!-- 获取当前元素的id，添加slot插槽 -->
        <template v-slot="scope">
          <el-button size="mini" @click="deleteFromCart(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    ...
  </el-popover>
</template>

<script>
// 导入mapMutations模块
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'PopCart',
  computed: {
    ...
  },
  methods: {
    // 把cart模块中的deleteFromCart映射到methods中
    ...mapMutations('cart', ['deleteFromCart'])
  }
}
</script>

<style></style>

```

3. 在浏览器中预览，添加商品之后点击删除按钮当前商品删除成功

### 购物车列表组件
- 购物车列表
- 全选操作
- 数字加减并统计小计
- 删除功能
- 统计选中商品价格数量

#### 购物车列表

1. 在views/cart.vue中引入vuex

```html
<template>
  <div>
    ...
    <!-- 这里也要写成cartProducts -->
    <el-table
      :data="cartProducts"
      style="width: 100%"
    >
      ...
    </el-table>
    ...
  </div>
</template>

<script>
// 导入vuex
import { mapState } from 'vuex'
export default {
  name: 'Cart',
  computed: {
    // 将cartProducts映射到computed中
    ...mapState('cart', ['cartProducts'])
  }
}
</script>

<style></style>

```

2. 在浏览器中看，添加商品到我的购物车，购物车列表中有了对应的数据

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3752e0553ba485b8d693c0c8577e29e~tplv-k3u1fbpfcp-watermark.image)

#### 全选操作
- 点击子`checkbox`，选中变不选中，不选中变选中
    + 子`checkbox`的状态是其商品的`isChecked`的值决定
    + 使用`mutation`
- 点击父`checkbox`的时候，子`checkbox`与父保持一致，并且会重新进行计算值。全部点中子`checkbox`，父`checkbox`也会选中
    + 父`checkbox`的状态，是购物车页面单独显示的，不需要写到`store`中， 直接写到当前组件。
    + 其依赖子`checkbox`的`isChecked`状态，所以使用计算属性
    + 改变父`checkbox`的状态，`store`的子状态也需要改变，不需要定义方法，设置其`set`方法即可


1. 先写改变子`checkbox`状态的`mutation`

```js
const mutations = {
  addToCart (state, product) {
    ...
  },
  deleteFromCart (state, prodId) {
    ...
  },
  // 改变所有商品的isChecked属性
  // 需要两个参数，第二个是checkbox的状态
  updateAllProductChecked (state, checked) {
    // 给每个商品的isChecked属性为checkbox状态
    state.cartProducts.forEach(prod => {
      prod.isChecked = checked
    })
  },
  // 改变某个商品的isChecked属性
  // 需要两个属性，第二个是商品对象，这里是解构，一个是checked，一个是id
  updateProductChecked (state, {
    checked,
    prodId
  }) {
    // 找到对应id的商品对象
    const prod = state.cartProducts.find(item => item.id === prodId)
    // 如果商品对象存在就给其isChecked进行赋值
    prod && (prod.isChecked = checked)
  }
}
```

2. 在`views/cart.vue`中进行引入修改

- 引入`mutation`
- 找到父`checkbox`绑定计算属性
- 定义`checkbox`计算属性，完成`get`和`set`
- 子`checkbox`中使用

```html
<template>
  <div>
    ...
    <el-table
      :data="cartProducts"
      style="width: 100%"
    >
      <el-table-column
        width="55">
        <template v-slot:header>
          <!-- 2. 这里绑定一个v-model，计算属性 -->
          <el-checkbox size="mini" v-model="checkedAll">
          </el-checkbox>
        </template>
         <!-- 4. 这里不能直接绑定v-model，因为我们绑定的是vuex的状态，不能直接更改状态
            4.1 先绑定其isChecked属性
            4.2 注册改变事件change，当checkbox改变的时候调用change，接收两个参数，id就通过scope.row获取，checked状态就通过$event获取 -->
        <template v-slot="scope">
          <el-checkbox
            size="mini"
            :value="scope.row.isChecked"
            @change="updateProductChecked({
              prodId: scope.row.id,
              checked: $event
            })"
          >
          </el-checkbox>
        </template>
      </el-table-column>
      ...
    </el-table>
    ...
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Cart',
  computed: {
    ...mapState('cart', ['cartProducts']),
    // 3. 父checkbox的状态，因为有get和set所以直接写成对象形式
    checkedAll: {
      // 返回当前购物车的商品是否都是选中状态，如果有一个没有选中直接返回false
      get () {
        return this.cartProducts.every(prod => prod.isChecked)
      },
      // 状态改变的时候触发的方法，需要一个参数，checkbox的状态
      set (value) {
        this.updateAllProductChecked(value)
      }
    }
  },
  methods: {
    // 1. 将cart模块的mutations映射到methods
    ...mapMutations('cart', ['updateAllProductChecked', 'updateProductChecked'])
  }
}
</script>

<style></style>

```

3. 打开浏览器，选中商品进入购物车，可以对全选框进行点击

#### 数字加减并统计小计

1. 在`cart`模块中，定义一个`mutation`方法，更新商品

```js
const mutations = {
  ...
  // 更新商品，把商品id和count进行解构
  updateProduct (state, { prodId, count }) {
    // 找到当前商品
    const prod = state.cartProducts.find(prod => prod.id === prodId)
    // 如果找到了就更新数量和总价
    if (prod) {
      prod.count = count
      prod.totalPrice = count * prod.price
    }
  }
}
```

2. 去`cart.vue`中添加一个`mapMutations`

```html
<script>
...
export default {
  ...
  methods: {
    // 将cart模块的mutations映射到methods
    ...mapMutations('cart', [
      'updateAllProductChecked',
      'updateProductChecked',
      'updateProduct'
    ])
  }
}
</script>
```

3. 在数字框中进行方法绑定

```html
<el-table-column
    prop="count"
    label="数量">
    <!-- 这里先定义一个插槽，绑定value是count，定义一个改变的change方法，将updateProduct传入两个参数，一个是id，一个是当前input的值$event -->
    <template v-slot="scope">
      <el-input-number :value="scope.row.count" @change="updateProduct({
        prodId: scope.row.id,
        count: $event
      })" size="mini"></el-input-number>
    </template>
  </el-table-column>
```

4. 在浏览器中查看，添加商品之后，修改数字，会有对应的商品数量和小计

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4235079dce3d410dac142a182db5ba95~tplv-k3u1fbpfcp-watermark.image)

#### 删除功能

1. 之前已经在`cart.js`的模块中有了删除商品的`mutation`，这里直接使用，在`cart.vue`中添加

```html
<script>
...
export default {
  ...
  methods: {
    // 将cart模块的mutations映射到methods
    ...mapMutations('cart', [
      'updateAllProductChecked',
      'updateProductChecked',
      'updateProduct',
      'deleteFromCart'
    ])
  }
}
</script>
```
2. 在上面的删除按钮中定义方法

```html
<el-table-column
    label="操作">
    <!-- 定义一个插槽，删除按钮绑定事件，传入商品id -->
    <template v-slot="scope">
    <el-button size="mini"
        @click="deleteFromCart(scope.row.id)">删除</el-button>
    </template>
</el-table-column>
```

3. 浏览器中，添加商品之后进入购物车页面，点击删除按钮可以删除整个商品。

#### 统计总数量和总钱数

统计的过程中需要添加条件，判断当前商品是否是选中状态。

1. 在`cart.js`的`getters`中添加商品数量和总价的方法，并且对选中状态进行判断

```js
const getters = {
  totalCount (state) {
    ...
  },
  totalPrice () {
    ...
  },
  // 选中的商品数量
  checkedCount (state) {
    // 返回前判断是否是选中状态，如果是就进行添加，并且返回sum
    return state.cartProducts.reduce((sum, prod) => {
      if (prod.isChecked) {
        sum += prod.count
      }
      return sum
    }, 0)
  },
  // 选中的商品价格，同理上面
  checkedPrice () {
    return state.cartProducts.reduce((sum, prod) => {
      if (prod.isChecked) {
        sum += prod.totalPrice
      }
      return sum
    }, 0)
  }
}
```

2. 在`cart.vue`中导入`mapGetters`

```html
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'Cart',
  computed: {
    ...mapState('cart', ['cartProducts']),
    // 将cart模块中的getters映射到computed中
    ...mapGetters('cart', ['checkedCount', 'checkedPrice']),
    ...
  },
  ...
}
</script>
```

3. 在总价格处引用

```html
<div>
  <p>已选 <span>{{ checkedCount }}</span> 件商品，总价：<span>{{ checkedPrice }}</span></p>
  <el-button type="danger">结算</el-button>
</div>
```

#### 处理金额小数的问题

多添加商品的时候发现商品金额会出现很多位小数的问题，所以这里进行处理

1. `mutations`中会价格的乘积进行保留两位小数的操作

```js
const mutations = {
  // 添加商品
  addToCart (state, product) {
    const prod = state.cartProducts.find(item => item.id === product.id)
    if (prod) {
      prod.count++
      prod.isChecked = true
      // 小计 = 数量 * 单价
      prod.totalPrice = (prod.count * prod.price).toFixed(2)
      console.log(prod.totalPrice)
    } else {
      ...
    }
  },
  // 更新商品
  updateProduct (state, { prodId, count }) {
    const prod = state.cartProducts.find(prod => prod.id === prodId)
    if (prod) {
      prod.count = count
      // 保留两位小数
      prod.totalPrice = (count * prod.price).toFixed(2)
    }
  }
}

```

2. 在`getters`中将总价进行保留两位小数，记得转化成数字

```js
const getters = {
  // 价格总计
  totalPrice () {
    return state.cartProducts.reduce((sum, prod) => sum + Number(prod.totalPrice), 0).toFixed(2)
  },
  // 选中的商品价格
  checkedPrice () {
    return state.cartProducts.reduce((sum, prod) => {
      if (prod.isChecked) {
        sum += Number(prod.totalPrice)
      }
      return sum
    }, 0).toFixed(2)
  }
}
```

### 本地存储

刷新页面，购物车的数据就会消失，因为我们把数据添加到了内存中存储，而实际购物的时候，有两种存储方式：
- 如果用户登录，购物车的数据是在服务器中
- 如果用户没有登录，购物车的数据是存在本地存储中

现在实现本地存储的功能

1. 首先在`cart.js`中，首次进入界面的时候，从本地获取数据

```js
const state = {
  // 从本地获取购物车商品数据，如果没有初始化为空数组
  cartProducts: JSON.parse(window.localStorage.getItem('cart-products')) || []
}
```

2. 在`mutations`中更改数据，所以每次更改过的数据，都需要记录到本地存储中，这里使用`vuex`的插件，在`index.js`中

```js
...
Vue.use(Vuex)

const myPlugin = store => {
  store.subscribe((mutation, state) => {
    // mutation 的格式为 { type, payload }
    // type里面的格式是cart/cartProducts
    // state 的格式为 { cart, products }
    if (mutation.type.startsWith('cart/')) {
      // 本地存储cartProducts
      window.localStorage.setItem('cart-products', JSON.stringify(state.cart.cartProducts))
    }
  })
}
export default new Vuex.Store({
  ...
  // 将myPlugin挂载到Store上
  plugins: [myPlugin]
})

```


3. 刷新浏览器可以看到购物车的商品列表的数据还存在。

## 完整案例
[vuex-cart-temp](https://github.com/a1burning/vuex-cart-temp)

