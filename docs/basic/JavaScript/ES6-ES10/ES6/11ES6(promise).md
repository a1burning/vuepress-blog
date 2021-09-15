---
title: ES6（十一）—— Promise
tags: 
  - JavaScript
  - ES6
prev: ./10ES6(destructure).md
next: ./12ES6(reflect).md
sidebarDepth: 3
---
## 说到Promise就不得不说道说道这 —— 回调地狱
a => b => c => d

回调层数越深，那么回调的维护成本越高
```js
//异步加载函数
function loadScript (src, callback) {
    let script = document.createElement('script')
    script.src = src
    script.onload = () => {
        callback()
    }
    document.head.append(script)
}

function test () {
    console.log('test')
}
loadScript('./1.js', test)

// 1
// test
```

如果有三个这样的方式回调
```js
function loadScript (src, callback) {
    let script = document.createElement('script')
    script.src = src
    script.onload = () => {
        callback(src)
    }
    document.head.append(script)
}

function test (name) {
    console.log(name)
}
loadScript('./1.js', function (script) {
    console.log(script)
    loadScript('./2.js', function (script) {
        console.log(script)
        loadScript('./3.js', function (script) {
            console.log(script)
            //...
        })
    })
})

// 1
// ./1.js
// 2
// ./2.js
// 3
// ./3.js
```
## Promise —— 解决回调地狱
虽然回调函数是所有异步编程方案的根基。但是如果我们直接使用传统回调方式去完成复杂的异步流程，就会无法避免大量的回调函数嵌套。导致回调地狱的问题。

为了避免这个问题。`CommonJS`社区提出了`Promise`的规范，`ES6`中称为语言规范。

`Promise`是一个对象，用来表述一个异步任务执行之后是成功还是失败。
### Promise语法规范
> `new Promise( function(resolve, reject) {…} );`
> - `new Promise(fn)` 返回一个`Promise` 对象
> - 在`fn`中指定异步等处理
>   - 处理结果正常的话，调用`resolve`(处理结果值)
>   - 处理结果错误的话，调用`reject`(`Error`对象)

### Promise的状态
>  `Promise` 内部是有状态的 **(pending、fulfilled、rejected)** ，`Promise` 对象根据状态来确定执行哪个方法。`Promise` 在实例化的时候状态是默认 `pending` 的，
> - 当异步操作是完成的，状态会被修改为 `fulfilled`
> - 如果异步操作遇到异常，状态会被修改为 `rejected`。
> 无论修改为哪种状态，之后都是不可改变的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bb211cac8fc499293c5eeb4f27923b1~tplv-k3u1fbpfcp-zoom-1.image)
### Promise基本用法
返回`resolve`
```js
const promise = new Promise((resolve, reject) => {
  resolve(100)
})

promise.then((value) => {
  console.log('resolved', value) // resolve 100
},(error) => {
  console.log('rejected', error)
})
```
返回`reject`
```js
const promise = new Promise((resolve, reject) => {
  reject(new Error('promise rejected'))
})

promise.then((value) => {
  console.log('resolved', value)
},(error) => {
  console.log('rejected', error)
  // rejected Error: promise rejected
  //  at E:\professer\lagou\Promise\promise-example.js:4:10
  //  at new Promise (<anonymous>)
})
```

即便`promise`中没有任何的异步操作，`then`方法的回调函数仍然会进入到事件队列中排队。
### Promise初体验
使用`Promise`去封装一个`ajax`的案例
```js
function ajax (url) {
  return new Promise((resolve, rejects) => {
    // 创建一个XMLHttpRequest对象去发送一个请求
    const xhr = new XMLHttpRequest()
    // 先设置一下xhr对象的请求方式是GET，请求的地址就是参数传递的url
    xhr.open('GET', url)
    // 设置返回的类型是json，是HTML5的新特性
    // 我们在请求之后拿到的是json对象，而不是字符串
    xhr.responseType = 'json'
    // html5中提供的新事件,请求完成之后（readyState为4）才会执行
    xhr.onload = () => {
      if(this.status === 200) {
        // 请求成功将请求结果返回
        resolve(this.response)
      } else {
        // 请求失败，创建一个错误对象，返回错误文本
        rejects(new Error(this.statusText))
      }
    }
    // 开始执行异步请求
    xhr.send()
  })
}

ajax('/api/user.json').then((res) => {
  console.log(res)
}, (error) => {
  console.log(error)
})
```
### Promise的本质
本质上也是使用回调函数的方式去定义异步任务结束后所需要执行的任务。这里的回调函数是通过`then`方法传递过去的
### Promise链式调用
#### 常见误区
- 嵌套使用的方式是使用`Promise`最常见的误区。要使用`promise`的链式调用的方法尽可能保证异步任务的扁平化。

#### 链式调用的理解
- `promise`对象`then`方法，返回了全新的`promise`对象。可以再继续调用`then`方法，如果`return`的不是`promise`对象，而是一个值，那么这个值会作为`resolve`的值传递，如果没有值，默认是`undefined`
- 后面的`then`方法就是在为上一个`then`返回的`Promise`注册回调
- 前面`then`方法中回调函数的返回值会作为后面`then`方法回调的参数
- 如果回调中返回的是`Promise`，那后面`then`方法的回调会等待它的结束


## Promise.prototype.then()
`promise`对象就可以调用`.then()`，是`promise`原型对象上的方法

> `promise.then(onFulfilled,onRejected);`
>
> `onFulfilled` 参数对应 `resolve`，处理结果值，必选
>
> `onRejected` 参数对应 `reject，Error`对象，可选
>
> `Promise` 对象会在变为 `resolve` 或者 `reject` 的时候分别调用相应注册的回调函数。
> - 当 `handler` 返回一个正常值的时候，这个值会传递给 `Promise` 对象的 `onFulfilled` 方法。
> - 定义的 `handler` 中产生异常的时候，这个值则会传递给 `Promise` 对象的 `onRejected` 方法。

> 这两个参数都是两个函数类型，如果这两个参数是非函数或者被遗漏，就忽略掉这两个参数了，返回一个空的`promise`对象。

```js
// 普通的写法会导致有不稳定输出
function loadScript (src) {
    //resolve, reject是可以改变Promise状态的，Promise的状态是不可逆的
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(src) //fulfilled,result
        script.onerror = (err) => reject(err) //rejected,error
        document.head.append(script)
    })
}

loadScript('./1.js')
    .then(loadScript('./2.js'))
    .then(loadScript('./3.js'))
    
//不稳定输出    
// 1
// 2
// 3
----------------------------------------------------------------------------
// 如果把加载2和3的放在1的then方法中
function loadScript (src) {
    //resolve, reject是可以改变Promise状态的，Promise的状态是不可逆的
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(src) //fulfilled,result
        script.onerror = (err) => reject(err) //rejected,error
        document.head.append(script)
    })
}

loadScript('./1.js')
    .then(() => {
        loadScript('./2.js')
    }, (err) => {
        console.log(err)
    }).then( () => {
        loadScript('./3.js')
    }, (err) => {
        console.log(err)
    })
    
// 稳定输出
// 1
// 不稳定输出
// 2
// 3
// ----------------------------------------------
//但是如果中间有错误的时候，下面的3还是会执行。
loadScript('./1.js')
    .then(() => {
        loadScript('./4.js')
    }, (err) => {
        console.log(err)
    }).then( () => {
        loadScript('./3.js')
    }, (err) => {
        console.log(err)
    })

// 1
// 报错
// 3
// 不符合题意，如果是报错之后，3不应该执行
// -------------------------------------------------------
loadScript('./1.js')
    .then(() => {
        return loadScript('./2.js')
    }, (err) => {
        console.log(err)
    }).then(() => {
        return loadScript('./3.js')
    }, (err) => {
        console.log(err)
    })
// 不加返回值，依旧是一个空的promise对象，无法用resolve, reject影响下一步.then()的执行
// 添加返回值之后就可以稳定输出
// 1
// 2
// 3
```
## Promise异常处理
异常处理有以下几种方法：
### then中回调的onRejected方法
### Promise.prototype.catch()（推荐）
`catc`h是`promise`原型链上的方法，用来捕获`reject`抛出的一场，进行统一的错误处理，**使用`.catch`方法更为常见，因为更加符合链式调用**。
> p.catch(onRejected);

```js
ajax('/api/user.json')
  .then(function onFulfilled(res) {
    console.log('onFulfilled', res)
  }).catch(function onRejected(error) {
    console.log('onRejected', error)
  })
  
// 相当于
ajax('/api/user.json')
  .then(function onFulfilled(res) {
    console.log('onFulfilled', res)
  })
  .then(undefined, function onRejected(error) {
    console.log('onRejected', error)
  })
```
#### .catch形式和前面then里面的第二个参数的形式，两者异常捕获的区别：

- `.catch()`是对上一个`.then()`返回的`promise`进行处理，不过第一个`promise`的报错也顺延到了`catch`中
- 而`then`的第二个参数形式，只能捕获第一个`promise`的报错，如果当前`then`的`resolve`函数处理中有报错是捕获不到的。

**所以`.catch`是给整个`promise`链条注册的一个失败回调。推荐使用！！！！** 

```js
function loadScript (src) {
    //resolve, reject是可以改变Promise状态的，Promise的状态是不可逆的
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(src) //fulfilled,result
        script.onerror = (err) => reject(err) //rejected,error
        document.head.append(script)
    })
}


loadScript('./1.js')
    .then(() => {
        return loadScript('./2.js')
    }).then(() => {
        return loadScript('./3.js')
    })
    .catch(err => {
        console.log(err)
    })
// throw new Error 不要用这个方法，要用catch和reject，去改变promise的状态的方式    
```
### 全局对象上的unhandledrejection事件
还可以在全局对象上注册一个`unhandledrejection`事件，处理那些代码中没有被手动捕获的`promise`异常，当然**并不推荐使用**。

更合理的是：在代码中明确捕获每一个可能的异常，而不是丢给全局处理
```js
// 浏览器
window.addEventListener('unhandledrejection', event => {
  const { reason, promise } = event
  console.log(reason, promise)

  //reason => Promise 失败原因，一般是一个错误对象
  //promise => 出现异常的Promise对象

  event.preventDefault()
}, false)

// node
process.on('unhandledRejection', (reason, promise) => {
  console.log(reason, promise)

  //reason => Promise 失败原因，一般是一个错误对象
  //promise => 出现异常的Promise对象
})
```
## Promise静态方法
### 类型转换 —— Promise.resolve()
静态方法 `Promise.resolve(value)` 可以认为是 `new Promise()` 方法的快捷方式。

```js
Promise.resolve(42)
//等同于
new Promise(function (resolve) {
  resolve(42)
})
```
如果接受的是一个`promise`对象，那么这个对象会原样返回
```js
const promise2 = Promise.resolve(promise)
console.log(promise === promise2) // true
```
如果传入的是一个对象，且这个对象也有一个`then`方法，传入成功和失败的回调，那么在后面执行的时候，也是可以按照`promise`的`then`来拿到。

**（这个then方法，实现了一个thenable的接口，即可以被then的对象）**

#### 使用场景
1. 可以是把第三方模拟`promise`库转化成`promise`对象
```js
Promise.reslove({
    then: function(onFulfilled, onRejected) {
        onFulfilled('foo')
    }
})
.then(function (value) {
    console.log(value) // foo
})
```
2. 直接将数值转换成`promise`对象返回
```js
function test (bool) {
    if (bool) {
        return new Promise((resolve,reject) => {
            resolve(30) 
        })
    } else {
        return Promise.resolve(42)
    }
}
test(1).then((value) => {
    console.log(value)
})
```
### Promise.reject()
`Promise.reject(error)` 是和 `Promise.resolve(value)` 类似的静态方法，是 `new Promise()` 方法的快捷方式。

创建一个一定是失败的`promise`对象
```js
Promise.reject(new Error('出错了'))
//等同于
new Promise(function (resolve) {
  reject(new Error('出错了'))
})
```

### 数据聚合 —— Promise.all()
如果需要同时进行多个异步任务，使用`promise`静态方法中的all方法，可以把多个`promise`合并成一个`promise`统一去管理。

> `Promise.all(promiseArray);`
>
> - `Promise.all` 生成并返回一个新的 `Promise` 对象，所以它可以使用 `Promise` 实例的所有方法。参数传递`promise`数组中所有的 `Promise` 对象都变为`resolve`的时候，该方法才会返回， 新创建的 `Promise` 则会使用这些 `promise` 的值。
>
> - 参数是一个数组，元素可以是普通值，也可以是一个`promise`对象，输出顺序和执行顺序有关，
> - 该函数生成并返回一个新的 `Promise` 对象，所以它可以使用 `Promise` 实例的所有方法。参数传递`promise`数组中所有的 `Promise` 对象都变为`resolve`的时候，该方法才会返回完成。**只要有一个失败，就会走`catch`。**
>
> - 由于参数数组中的每个元素都是由 `Promise.resolve` 包装（`wrap`）的，所以`Paomise.all` 可以处理不同类型的 `promose` 对象。

```js
var promise = Promise.all([
    // ajax函数是一个异步函数并返回promise，不需要关心哪个结果先回来，因为是都完成之后整合操作
    ajax('/api/users.json'),
    ajax('/api/posts.json')
])

Promise.then(function(values) {
    console.log(values) //返回的是一个数组，每个数组元素对应的是其promise的返回结果
}).catch(function(error) {
    console.log(error) // 只要有一个失败，那么就会整体失败走到catch里面
})
```

### 竞争 —— Promise.race()

> `Promise.race(promiseArray);`
>
> 和`all`一样会接收一个数组，元素可以是普通值也可以是`promise`对象，和`all`不同的是，**它只会等待第一个结束的任务** 。


```js
// 下面的例子如果request超过了500ms，那么就会报超时错诶，如果小于500ms，则正常返回。
const request = ajax('/api/posts.json')
const timeout = new Promise((resovle, reject) => {
    setTimeout(() => reject(new Error('timeout')), 500)
})

Promise.race([
    request,
    timeout
])
.then(value => {
    console.log(value)
})
.catch(error => {
    console.log(error)
})
```
## Promise执行时序 —— 宏任务 vs 微任务

**执行顺序** ： 宏任务 => 微任务 => 宏任务


**微任务** 是`promise`之后才加入进去的，目的是为了提高整体的响应能力

 > 我们目前绝大多数异步调用都是作为宏任务执行，`promise`的回调 & `MutationObserver` & `node`中的`process.nextTick`会作为微任务执行

下面的例子，当前宏任务立即执行，`then`是微任务会延后执行，`setTImeout`是异步的一个宏任务也会延后执行。当前宏任务执行完毕之后，微任务会先执行完毕之后下一个宏任务才会执行。

```js
console.log('global start')

setTimeout(() => {
    console.log('setTimeout')
}, 0)
Promise.resolve()
    .then(( => {
        console.log('promise')
    }))
    .then(( => {
        console.log('promise2')
    }))
    .then(( => {
        console.log('promise3')
    }))

console.log('global end')

// global start
// global end
// promise
// promise2
// promise3
// setTimeout
```
具体的牵扯到`eventLoop`的东西之后再进一步探讨。

## 深度剖析：手写一个Promise源码
[手写一个Promise源码](/code/promise/)
