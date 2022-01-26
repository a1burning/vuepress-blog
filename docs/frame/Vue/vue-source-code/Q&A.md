---
title: Vue源码相关的Q&A
tags: 
  - Vue
prev: false
next: false
sidebarDepth: 5
---

## Vue初始化过程
### 一、同时传递render和template，那么先调用哪个？

```js
const vm = new Vue({ 
    el: '#app', 
    template: '<h3>Hello template</h3>', 
    render (h) { 
        return h('h4', 'Hello render') 
    } 
})
```
> 问：如果创建Vue实例的时候，同时传递了render和template，那么先调用哪个？
>
> 看源码可以看到，如果有render的优先级高于template，如果两者同时存在就调用render函数，不对template进行调用。

```js
const mount = Vue.prototype.$mount
// 这个方法是挂载，把DOM挂载到页面上
Vue.prototype.$mount = function (
  el?: string | Element,
  // 非 ssr 情况下为 false，ssr 时候为 true
  hydrating?: boolean
): Component {
  // 获取 el 对象，如果el存在就获取其DOM元素
  el = el && query(el)

  /* istanbul ignore if */
  // 判断el不能是body或者html DOM元素，只能是普通元素进行挂载，并返回这个元素
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  // 判断选项中是否有render，如果没有render，就取template选项，进行转化
  if (!options.render) {
    let template = options.template
    if (template) {
      ...
    } else if (el) {
      template = getOuterHTML(el)
    }
    ...
  }
  // 如果有render选项就调用mount方法
  return mount.call(this, el, hydrating)
}
```
### 二、$mount在哪里调用的？
通过例子在调试台中演示，在开启sourcemap的情况下，在下面的位置中打断点

![image](~@public/assets/images/vue/vue-source-code/vue1.png)

刷新页面发现右边的Call Stack中可以看到函数栈，我们在初始化的时候，Vue构造函数中调用了`_.init`方法，`_.init`方法末尾判断是否有el，有就调用mount方法。

![image](~@public/assets/images/vue/vue-source-code/vue2.png)

> 阅读源码记录
> - el 不能是 body 或者 html 标签
> - 如果没有 render，把 template 转换成 render 函数
> - 如果有 render 方法，直接调用 mount 挂载 DOM

这个entry-runtime-with-compiler.js的作用就是添加编译器，将原来的$mount函数存到一个变量中，对原来的$mount方法进行template转化成render函数的操作，之后定义了一个新的静态方法compile，将html字符串编译成render函数，最终导出Vue构造函数。
```js
// 将原来的$mount函数存到一个变量中，对原来的$mount方法进行template转化成render函数的操作
const mount = Vue.prototype.$mount
// 这个方法是挂载，把DOM挂载到页面上
Vue.prototype.$mount = function (){...}

// 定义了一个新的静态方法compile，将html字符串编译成render函数
Vue.compile = compileToFunctions
// 最终将其导出
export default Vue
```

详情见`entry-runtime-with-compiler.js`的注释

### 三、请简述 Vue 首次渲染的过程

1. 在调试Vue初始化的过程中，首先是对Vue的静态成员以及原型成员进行初始化。

   1.1 可以看到首先进入的是 core/instance/index.js文件

   - 首先执行initMixin方法，结束之后在Vue的原型上添加了`_init`方法
   - 执行stateMixin方法，结束之后在Vue的原型上增加了`$data`，`$props`，`$delete`，`$set`，`$watch`方法
   - 执行eventsMixin方法，结束之后在Vue的原型上增加了`$emit`，`$off`，`$on`，`$once`方法
   - 执行lifecycleMixin方法，结束之后在Vue原型上增加了`$destroy`，`$forceUpdate`方法
   - 执行renderMixin方法，可以看到原型上挂载了很多下划线开头的单字母方法，当把模板转换成render函数，在render函数中要调用这些方法，上面还挂载了`$nextTick`和`_render`方法

   1.2 执行完毕之后又跳到了core/index.js的initGlobalAPI函数中

   - 里面给Vue添加了`config`属性并初始化了一些值
   - 给Vue原型添加了静态方法`delete`，`nextTick`，`observable`，`set`，`util`
   - 给Vue添加了options静态属性，然后将`component`，`directive`，`filter`，`_base`添加进去
   - 给options.component中添加组件`keepAlive`
   - 给Vue原型添加了静态方法`use`，`mixin`和`extend`
   - 给Vue原型添加了静态方法注册全局指令`Vue.directive()`，注册全局组件`Vue.component()`，注册全局过滤器`Vue.filter()`

   1.3 执行完毕之后又跳到了web/runtime/index.js中

   - 注册全局组件`Transition`和`TransitionGroup`，注册全局指令`model`和`show`
   - 给Vue原型上添加方法`__patch__`和`$mount`，这两个方法只是定义并没有调用，是在`init`方法中调用的

   1.4 执行完毕之后进入web/entry-runtime-with-compile.js中

   - 首先对`$mount`进行重写，添加了模板编译的功能，并给Vue添加了静态方法`compile`

2. 当成员定义好之后就是Vue的渲染过程，Vue构造函数内部首先其调用了`_init` 方法，这个方法里面，触发了beforeCreate和created钩子函数，还触发了$mount渲染整个页面

3. 进入entry-runtime-with-compile.js的$mount中，先将模板编译成render函数，然后进入web/runtime/index.js中的$mount方法

4. $mount方法中调用了mountComponent渲染DOM并挂载到DOM树上，

   - 4.1 里面先触发了钩子函数beforeMount
   - 4.2 然后定义了updateComponent方法，里面`vm._render()`的功能将render函数转化成虚拟DOM，`vm._update`的功能将虚拟DOM转化成真实DOM更新到页面上
   - 4.3 创建了Watcher对象，并把updateComponent传入，在Watcher中调用updateComponent，将render函数最终转化成真实DOM更新到界面上，并且注册了依赖，以后监听更新数据变化执行更新
   - 4.4 触发钩子函数mounted，界面渲染完毕

## 响应式原理
### 一、`arr.push` 和 `arr[0] = 1` 这两种那个是响应式的？
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Vue.js 01 component example</title>
  </head>
  <body>
    <div id="app">
      {{ arr }}
    </div>

    <script src="../../dist/vue.js"></script>
    <script>
      const vm = new Vue({
        el: '#app',
        data: {
          arr: [1, 2, 3]
        }
      })
    </script>
  </body>
</html>
```

- `vm.arr.push(100)`

在控制台中输入`vm.arr.push(100)`，可以看到数组立刻更新到了视图上.

为什么会立刻更新呢?

如果调用原生数组的的push方法是不会将视图更新的，在vue内部修补了可以改变数组的方法，通过`vm.arr`可以找到修补过的方法

![image](~@public/assets/images/vue/vue-source-code/vue-console.png)

- `vm.arr[0] = 100`

控制台中输入 `vm.arr[0] = 100`，可以看到数组的第一个元素并没有更新，但是数组中的元素已经变化了，这个方法并没有触发Dep.notify，因为我们在源码中可以看到，并没有监听数组中的每一个属性，包括length也一样，我们只是把数组中是对象的元素转化成了响应式的对象.

![image](~@public/assets/images/vue/vue-source-code/vue-console1.png)


### 二、为什么不去处理数组的属性呢?

因为数组的内容可能会非常多，都处理会导致性能的问题.

### 三、如果要修改数组中的某一个元素怎么做呢?

使用splice实现，这个可以删除元素，也可以修改某个元素

![image](~@public/assets/images/vue/vue-source-code/vue-console2.png)

![image](~@public/assets/images/vue/vue-source-code/vue-console3.png)

## 模板编译

### 一、请简述 Vue 中模板编译的过程。

答：模板编译的主要目的是将template转换为渲染函数render

先放一个总结的图：

![image](~@public/assets/images/vue/vue-source-code/vue-temp.png)

下面详细讲解一下：

这个过程是在入口文件`entry-runtime-with-compile.js`中完成的，在这个文件中对`$mount`方法进行了重写，内部调用了`compileToFunctions`函数，传入了`template`模板和一些用户定义的`options`，这个函数执行完毕之后就返回了`render`函数和`staticRenderFns`静态根节点数组并将其挂载到`options`上。

所以从`compileToFunctions`出发，可以知道编译的过程。

1. 现在先认识一个函数baseCompile，这个函数的作用是接收template模板和合并之后的options，其内部进行以下处理，是核心函数
   - 第一：将把模板转换成 ast 抽象语法树对象
   - 第二：优化抽象语法树(标记静态根节点)
   - 第三：把 ast 抽象语法树对象生成字符串形式的js代码
2. 然后认识一下函数compile，这个函数的作用是将用户传入的options和平台相关的options进行合并，然后把template模板和合并后的options在调用上面的函数baseCompile的时候传入，之后得到字符串形式的js代码，添加一些错误和信息返回
3.  最后回到函数compileToFunctions，这个函数是由高阶函数createCompileToFunctionFn返回，里面接收template模板和用户传入的options
   - 一、先去缓存中查看是否有编译结果，如果有就直接返回，没有就下一步
   - 二、调用compile函数进行编译，完成得到字符串形式的js代码render和静态跟节点js代码的数组：{ render, staticRenderFns }
   - 三、那字符串形式的js代码通过createFunction函数，转换成js函数，同样静态根节点数组中的每一个元素也转换成js函数
   - 四、缓存对象并返回

总结一下就是，用户把template和options传入，compile函数内部将options进行合并，调用baseCompile将模板转换成字符串形式的js代码，并标记好静态根节点、静态节点之类的信息，之后调用createFunction函数将js字符串转换成render函数的js代码返回，模板编译结束。