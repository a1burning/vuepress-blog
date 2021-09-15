---
title: 手写一个Promise源码
tags: 
  - JavaScript
  - ES6
  - Source Code
sidebarDepth: 5
---
> 这里只是对Promise源码的实现做一个剖析，如果想对Promise整体有个了解，<br/>
请看 [ES6（十一）—— Promise（更优的异步编程解决方案）](/basic/JavaScript/ES6-ES10/ES6/11ES6(promise).md)

## 一、Promise核心逻辑实现
首先分析其原理

> 1. `promise`就是一个类<br/>
> 在执行类的时候需要传递一个执行器进去，执行器会立即执行
> 2. `Promise`中有三种状态，分别为成功-`fulfilled` 失败-`rejected` 等待-`pending`<br/>
>   `pending -> fulfilled`<br/>
>   `pending -> rejected`<br/>
>   一旦状态确定就不可更改
> 3. `resolve` 和 `reject`函数是用来更改状态的<br/>
>`resolve：fulfilled`<br/>
>`reject：rejected`
> 4. `then`方法内部做的事情就是判断状态 
>如果状态是成功，调用成功回调函数<br/>
>如果状态是失败，就调用失败回调函数<br/>
>`then`方法是被定义在原型对象中的
> 5. `then`成功回调有一个参数，表示成功之后的值；`then`失败回调有一个参数，表示失败后的原因

**<PS:本文myPromise.js是源码文件，promise.js是使用promise文件>** 
```js
// myPromise.js
// 定义成常量是为了复用且代码有提示
const PENDING = 'pending' // 等待
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected' // 失败
// 定义一个构造函数
class MyPromise {
  constructor (exector) {
    // exector是一个执行器，进入会立即执行，并传入resolve和reject方法
    exector(this.resolve, this.reject)
  }

  // 实例对象的一个属性，初始为等待
  status = PENDING
  // 成功之后的值
  value = undefined
  // 失败之后的原因
  reason = undefined

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  resolve = value => {
    // 判断状态是不是等待，阻止程序向下执行
    if(this.status !== PENDING) return
    // 将状态改成成功
    this.status = FULFILLED
    // 保存成功之后的值
    this.value = value
  }

  reject = reason => {
    if(this.status !== PENDING) return
    // 将状态改为失败
    this.status = REJECTED
    // 保存失败之后的原因
    this.reason = reason
  }

  then (successCallback, failCallback) {
    //判断状态
    if(this.status === FULFILLED) {
      // 调用成功回调，并且把值返回
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      failCallback(this.reason)
    }
  }
}

module.exports = MyPromise
```
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
   resolve('success')
   reject('err')
 })

 promise.then(value => {
   console.log('resolve', value)
 }, reason => {
   console.log('reject', reason)
 })
```

## 二、在 Promise 类中加入异步逻辑

上面是没有经过异步处理的，如果有异步逻辑加进来，会有一些问题
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  // 主线程代码立即执行，setTimeout是异步代码，then会马上执行，
  // 这个时候判断promise状态，状态是pending，然而之前并没有判断等待这个状态
  setTimeout(() => {
    resolve('success')
  }, 2000); 
 })

 promise.then(value => {
   console.log('resolve', value)
 }, reason => {
   console.log('reject', reason)
 })
```

下面修改这个代码
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }


  status = PENDING
  value = undefined
  reason = undefined
  // 定义一个成功回调参数
  successCallback = undefined
  // 定义一个失败回调参数
  failCallback = undefined

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 判断成功回调是否存在，如果存在就调用
    this.successCallback && this.successCallback(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 判断失败回调是否存在，如果存在就调用
    this.failCallback && this.failCallback(this.reason)
  }

  then (successCallback, failCallback) {
    if(this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
      // 等待
      // 因为并不知道状态，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.successCallback = successCallback
      this.failCallback = failCallback
    }
  }
}

module.exports = MyPromise
```

## 三、实现 then 方法多次调用添加多个处理函数
`promise`的`then`方法是可以被多次调用的。

这里如果有三个`then`的调用，
- 如果是同步回调，那么直接返回当前的值就行；
- 如果是异步回调，那么保存的成功失败的回调，需要用不同的值保存，因为都互不相同。

之前的代码需要改进。
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
 })

 promise.then(value => {
   console.log(1)
   console.log('resolve', value)
 })
 
 promise.then(value => {
  console.log(2)
  console.log('resolve', value)
})

promise.then(value => {
  console.log(3)
  console.log('resolve', value)
})
```
保存到数组中，最后统一执行
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }


  status = PENDING
  value = undefined
  reason = undefined
  // 定义一个成功回调参数，初始化一个空数组
  successCallback = []
  // 定义一个失败回调参数，初始化一个空数组
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 判断成功回调是否存在，如果存在就调用
    // 循环回调数组. 把数组前面的方法弹出来并且直接调用
    // shift方法是在数组中删除值，每执行一个就删除一个，最终变为0
    while(this.successCallback.length) this.successCallback.shift()(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 判断失败回调是否存在，如果存在就调用
    // 循环回调数组. 把数组前面的方法弹出来并且直接调用
    while(this.failCallback.length) this.failCallback.shift()(this.reason)
  }

  then (successCallback, failCallback) {
    if(this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
      // 等待
      // 将成功回调和失败回调都保存在数组中
      this.successCallback.push(successCallback)
      this.failCallback.push(failCallback)
    }
  }
}

module.exports = MyPromise
```

## 四、实现then方法的链式调用
- `then`方法要链式调用那么就需要返回一个`promise`对象，
- `then`方法的`return`返回值作为下一个`then`方法的参数

- `then`方法还一个`return`一个`promise`对象，那么如果是一个`promise`对象，那么就需要判断它的状态

```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
// 目前这里只处理同步的问题
    resolve('success')
})

function other () {
   return new MyPromise((resolve, reject) =>{
        resolve('other')
   })
}
promise.then(value => {
   console.log(1)
   console.log('resolve', value)
   return other()
}).then(value => {
  console.log(2)
  console.log('resolve', value)
})
```

```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }

  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length) this.successCallback.shift()(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length) this.failCallback.shift()(this.reason)
  }

  then (successCallback, failCallback) {
    // then方法返回第一个promise对象
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        // x是上一个promise回调函数的return返回值
        // 判断 x 的值时普通值还是promise对象
        // 如果是普通纸 直接调用resolve
        // 如果是promise对象 查看promise对象返回的结果
        // 再根据promise对象返回的结果 决定调用resolve还是reject
        let x = successCallback(this.value)
        resolvePromise(x, resolve, reject)
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    });
    return promise2
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是其实例对象
  if(x instanceof MyPromise) {
    // promise 对象
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise
```

## 五、then方法链式调用识别 Promise 对象自返回
如果`then`方法返回的是自己的`promise`对象，则会发生`promise`的嵌套，这个时候程序会报错
```js
var promise = new Promise((resolve, reject) => {
  resolve(100)
})
var p1 = promise.then(value => {
  console.log(value)
  return p1
})

// 100
// Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```
所以为了避免这种情况，我们需要改造一下`then`方法
```js
// myPromise.js
const { rejects } = require("assert")

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    exector(this.resolve, this.reject)
  }


  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length) this.successCallback.shift()(this.value)
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length) this.failCallback.shift()(this.reason)
  }

  then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        // 因为new Promise需要执行完成之后才有promise2，同步代码中没有pormise2，
        // 所以这部分代码需要异步执行
        setTimeout(() => {
          let x = successCallback(this.value)
          //需要判断then之后return的promise对象和原来的是不是一样的，
          //判断x和promise2是否相等，所以给resolvePromise中传递promise2过去
          resolvePromise(promise2, x, resolve, reject)
        }, 0);
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    });
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}

module.exports = MyPromise
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    resolve('success')
})
 
// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
let p1 = promise.then(value => {
   console.log(1)
   console.log('resolve', value)
   return p1
})
 
// 运行的时候会走reject
p1.then(value => {
  console.log(2)
  console.log('resolve', value)
}, reason => {
  console.log(3)
  console.log(reason.message)
})

// 1
// resolve success
// 3
// Chaining cycle detected for promise #<Promise>
```

## 六、捕获错误及 then 链式调用其他状态代码补充

目前我们在`Promise`类中没有进行任何处理，所以我们需要捕获和处理错误。

### 1. 捕获执行器的错误
捕获执行器中的代码，如果执行器中有代码错误，那么`promise`的状态要弄成错误状态

```js
// myPromise.js
constructor (exector) {
    // 捕获错误，如果有错误就执行reject
    try {
        exector(this.resolve, this.reject)
    } catch (e) {
        this.reject(e)
    }
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
})
 
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
})

//2
//执行器错误
```
### 2. then执行的时候报错捕获
```js
// myPromise.js
then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
        if(this.status === FULFILLED) {
            setTimeout(() => {
                // 如果回调中报错的话就执行reject
                try {
                    let x = successCallback(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0);
        } else if (this.status === REJECTED) {
            failCallback(this.reason)
        } else {
            this.successCallback.push(successCallback)
            this.failCallback.push(failCallback)
        }
    });
    return promise2
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    resolve('success')
    // throw new Error('执行器错误')
 })
 
// 第一个then方法中的错误要在第二个then方法中捕获到
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  throw new Error('then error')
}, reason => {
  console.log(2)
  console.log(reason.message)
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})

// 1
// resolve success
// 4
// then error
```

### 3. 错误之后的链式调用
```js
// myPromise.js
then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
        if(this.status === FULFILLED) {
            setTimeout(() => {
                try {
                    let x = successCallback(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        // 在状态是reject的时候对返回的promise进行处理
        } else if (this.status === REJECTED) {
            setTimeout(() => {
                // 如果回调中报错的话就执行reject
                try {
                    let x = failCallback(this.reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        } else {
            this.successCallback.push(successCallback)
            this.failCallback.push(failCallback)
        }
    });
    return promise2
}
```
```js
//promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
 })
 
 // 第一个then方法中的错误要在第二个then方法中捕获到
 promise.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
  return 100
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})

// 2
// 执行器错误
// 3
// 100
```
### 4. 异步状态下链式调用
还是要处理一下如果`promise`里面有异步的时候，`then`的链式调用的问题。
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    // 捕获错误，如果有错误就执行reject
    try {
      exector(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }


  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 异步回调传值
    // 调用的时候不需要传值，因为下面push到里面的时候已经处理好了
    while(this.successCallback.length) this.successCallback.shift()()
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 异步回调传值
    // 调用的时候不需要传值，因为下面push到里面的时候已经处理好了
    while(this.failCallback.length) this.failCallback.shift()()
  }

  then (successCallback, failCallback) {
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        setTimeout(() => {
          // 如果回调中报错的话就执行reject
          try {
            let x = successCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          // 如果回调中报错的话就执行reject
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        // 处理异步的成功错误情况
        this.successCallback.push(() => {
          setTimeout(() => {
            // 如果回调中报错的话就执行reject
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            // 如果回调中报错的话就执行reject
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    });
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}

module.exports = MyPromise
```
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  // 一个异步方法
  setTimeout(() =>{
    resolve('succ')
  },2000)
})
 
 promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  return 'aaa'
}, reason => {
  console.log(2)
  console.log(reason.message)
  return 100
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})

// 1
// resolve succ
// 3
// aaa
```

## 七、将then方法的参数变成可选参数
then方法的两个参数都是可选参数，我们可以不传参数。
下面的参数可以传递到最后进行返回
```js
var promise = new Promise((resolve, reject) => {
      resolve(100)
    })
    promise
      .then()
      .then()
      .then()
      .then(value => console.log(value))
// 在控制台最后一个then中输出了100

// 这个相当于
promise
  .then(value => value)
  .then(value => value)
  .then(value => value)
  .then(value => console.log(value))
```
所以我们修改一下`then`方法
```js
// myPromise.js
then (successCallback, failCallback) {
    // 这里进行判断，如果有回调就选择回调，如果没有回调就传一个函数，把参数传递
    successCallback = successCallback ? successCallback : value => value
    // 错误函数也是进行赋值，把错误信息抛出
    failCallback = failCallback ? failCallback : reason => {throw reason}
    let promise2 = new Promise((resolve, reject) => {
        ...
    })
    ...
}


// 简化也可以这样写
then (successCallback = value => value, failCallback = reason => {throw reason}) {
    ···
}
```
`resolve`之后
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  resolve('succ')
})
 
promise.then().then().then(value => console.log(value))

// succ
```
`reject`之后
```js
// promise.js
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
  reject('err')
})
 
 promise.then().then().then(value => console.log(value), reason => console.log(reason))

// err
```

## 八、promise.all方法的实现
`promise.all`方法是解决异步并发问题的
```js
// 如果p1是两秒之后执行的，p2是立即执行的，那么根据正常的是p2在p1的前面。
// 如果我们在all中指定了执行顺序，那么会根据我们传递的顺序进行执行。
function p1 () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}

function p2 () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2')
    },0)
  })
}

Promise.all(['a', 'b', p1(), p2(), 'c']).then(result => {
  console.log(result)
  // ["a", "b", "p1", "p2", "c"]
})
```
分析一下：
- `all`方法接收一个数组，数组中可以是普通值也可以是`promise`对象
- 数组中值得顺序一定是我们得到的结果的顺序
- `promise`返回值也是一个`promise`对象，可以调用`then`方法
- 如果数组中所有值是成功的，那么`then`里面就是成功回调，如果有一个值是失败的，那么`then`里面就是失败的
- 使用`all`方法是用类直接调用，那么`all`一定是一个静态方法

```js
//myPromise.js
static all (array) {
    //  结果数组
    let result = []
    // 计数器
    let index = 0
    return new Promise((resolve, reject) => {
      let addData = (key, value) => {
        result[key] = value
        index ++
        // 如果计数器和数组长度相同，那说明所有的元素都执行完毕了，就可以输出了
        if(index === array.length) {
          resolve(result)
        }
      }
      // 对传递的数组进行遍历
      for (let i = 0; i < array.lengt; i++) {
        let current = array[i]
        if (current instanceof MyPromise) {
          // promise对象就执行then，如果是resolve就把值添加到数组中去，如果是错误就执行reject返回
          current.then(value => addData(i, value), reason => reject(reason))
        } else {
          // 普通值就加到对应的数组中去
          addData(i, array[i])
        }
      }
    })
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
function p1 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}

function p2 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2')
    },0)
  })
}

Promise.all(['a', 'b', p1(), p2(), 'c']).then(result => {
  console.log(result)
  // ["a", "b", "p1", "p2", "c"]
})
```

## 九、Promise.resolve方法的实现
- 如果参数就是一个`promise`对象，直接返回，如果是一个值，那么需要生成一个`promise`对象，把值进行返回
- 是`Promise`类的一个静态方法

```js
// myPromise.js
static resolve (value) {
    // 如果是promise对象，就直接返回
    if(value instanceof MyPromise) return value
    // 如果是值就返回一个promise对象，并返回值
    return new MyPromise(resolve => resolve(value))
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
function p1 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}


Promise.resolve(100).then(value => console.log(value))
Promise.resolve(p1()).then(value => console.log(value))
// 100
// 2s 之后输出 p1
```

## 十、finally 方法的实现
- 无论当前最终状态是成功还是失败，`finally`都会执行
- 我们可以在`finally`方法之后调用`then`方法拿到结果
- 这个函数是在原型对象上用的

```js
// myPromise.js
finally (callback) {
    // 如何拿到当前的promise的状态，使用then方法，而且不管怎样都返回callback
    // 而且then方法就是返回一个promise对象，那么我们直接返回then方法调用之后的结果即可
    // 我们需要在回调之后拿到成功的回调，所以需要把value也return
    // 失败的回调也抛出原因
    // 如果callback是一个异步的promise对象，我们还需要等待其执行完毕，所以需要用到静态方法resolve
    return this.then(value => {
      // 把callback调用之后返回的promise传递过去，并且执行promise，且在成功之后返回value
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      // 失败之后调用的then方法，然后把失败的原因返回出去。
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
}
```
```js
// promise.js
const MyPromise = require('./myPromise')
function p1 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}

function p2 () {
  return new MyPromise((resolve, reject) => {
    reject('p2 reject')
  })
}

p2().finally(() => {
  console.log('finallyp2')
  return p1()
}).then(value => {
  console.log(value)
}, reason => {
  console.log(reason)
})

// finallyp2
// 两秒之后执行p2 reject
```

## 十一、catch方法的实现
- `catch`方法是为了捕获`promise`对象的所有错误回调的
- 直接调用`then`方法，然后成功的地方传递`undefined`，错误的地方传递`reason`
- `catch`方法是作用在原型对象上的方法

```js
// myPromise.js
catch (failCallback) {
    return this.then(undefined, failCallback)
}
```
```js
// promise.js
const MyPromise = require('./myPromise')

function p2 () {
  return new MyPromise((resolve, reject) => {
    reject('p2 reject')
  })
}

p2()
  .then(value => {
    console.log(value)
  })
  .catch(reason => console.log(reason))

// p2 reject
```

## Promise全部代码整合
```js
// myPromise.js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor (exector) {
    try {
      exector(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }


  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if(this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length) this.successCallback.shift()()
  }

  reject = reason => {
    if(this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length) this.failCallback.shift()()
  }

  then (successCallback = value => value, failCallback = reason => {throw reason}) {
    let promise2 = new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    });
    return promise2
  }

  finally (callback) {
    // 如何拿到当前的promise的状态，使用then方法，而且不管怎样都返回callback
    // 而且then方法就是返回一个promise对象，那么我们直接返回then方法调用之后的结果即可
    // 我们需要在回调之后拿到成功的回调，所以需要把value也return
    // 失败的回调也抛出原因
    // 如果callback是一个异步的promise对象，我们还需要等待其执行完毕，所以需要用到静态方法resolve
    return this.then(value => {
      // 把callback调用之后返回的promise传递过去，并且执行promise，且在成功之后返回value
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      // 失败之后调用的then方法，然后把失败的原因返回出去。
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
  }

  catch (failCallback) {
    return this.then(undefined, failCallback)
  }

  static all (array) {
    let result = []
    let index = 0
    return new Promise((resolve, reject) => {
      let addData = (key, value) => {
        result[key] = value
        index ++
        if(index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.lengt; i++) {
        let current = array[i]
        if (current instanceof MyPromise) {
          current.then(value => addData(i, value), reason => reject(reason))
        } else {
          addData(i, array[i])
        }
      }
    })
  }

  static resolve (value) {
    if(value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}

module.exports = MyPromise
```
