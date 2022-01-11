---
title: Vue源码相关的Q&A
tags: 
  - Vue
prev: false
next: false
sidebarDepth: 5
---

## Vue初始化过程
### 问答题

#### 一、同时传递render和template，那么先调用哪个？

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

#### 二、$mount在哪里调用的？
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

## 响应式原理
### 问答题

#### 一、`arr.push` 和 `arr[0] = 1` 这两种那个是响应式的？
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


#### 二、为什么不去处理数组的属性呢?

因为数组的内容可能会非常多，都处理会导致性能的问题.

#### 三、如果要修改数组中的某一个元素怎么做呢?

使用splice实现，这个可以删除元素，也可以修改某个元素

![image](~@public/assets/images/vue/vue-source-code/vue-console2.png)

![image](~@public/assets/images/vue/vue-source-code/vue-console3.png)