---
title: ES9(一) —— For await of
tags: 
  - JavaScript
  - ES6
prev: ../ES8/05ES8.md
next: ./02ES9finally.md
sidebarDepth: 5
---
## 问：ES9中异步操作集合是如何遍历的?
数组中的元素都是`promise`对象，那么是没有办法遍历的。

```javascript
function Gen(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(time)
    },time)
  })
}

function test() {
  let arr = [Gen(2000), Gen(1000), Gen(3000)]
  for(let item of arr) {
    console.log(Date.now(), item.then(console.log))
  }
}

test()
// 1597047404040 Promise {<pending>}
// 1597047404040 Promise {<pending>}
// 1597047404040 Promise {<pending>}
// 1000
// 2000
// 3000

```
这种遍历就是不管三七二十一，首先遍历出来，然后挂起的`promise`再执行。
## 如何可以解决这种问题？
将test函数前面添加async，并在for-of遍历的时候给每个元素前面添加await，每个对象等待结束之后再执行下一个。
```js
function Gen(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(time)
    },time)
  })
}

async function test() {
  let arr = [Gen(2000), Gen(1000), Gen(3000)]
  for(let item of arr) {
    console.log(Date.now(), await item.then(console.log))
  }
}

test()

// 2000
// 1597047766221 undefined
// 1000
// 1597047768223 undefined
// 3000
// 1597047768224 undefined
```

> 分析输出结果：先执行了`await`后面的`then`，返回`2000`之后
> 执行`console.log`返回时间戳
> 然后`await`的返回值是空，所以返回`undefined`
> 虽然因为`await`让`for-of`暂停了，但是执行的顺序和我们想要的还是不一样


## 最终的解决方式 —— For await of
test函数前面还要添加`async`关键字，对`for-of`进行改进
```js
function Gen(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(time)
    },time)
  })
}

async function test() {
  let arr = [Gen(2000), Gen(100), Gen(3000)]
  for await(let item of arr) {
    console.log(Date.now(), item)
  }
}

test()

// 1597048677429 2000
// 1597048677429 100
// 1597048678429 3000
```
## for-of和for await of的区别

> `for-of`是用来遍历同步操作的
> `for-of`里面用`await`，如果有其他操作，也会有输出顺序错误
> `for await of` 是可以对异步集合进行操作

## 自定义数据结构的异步遍历如何实现？
- 定义一个对象，里面有基础数据类型，还有`promise`类型
- 自定义一个`[Symbol.asyncIterator]`方法让其变成可遍历的对象
- 使用`for await of`方法进行遍历

```js
const obj = {
  count: 0,
  Gen(time) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve({ done: false, value:time })
      }, time)
    })
  },
  [Symbol.asyncIterator] () {
    let self = this
    return {
      next() {
        self.count++
        if(self.count < 4) {
          return self.Gen(Math.random() * 1000) //retuen的返回值是Gen函数的resolve返回的对象
        }else{
          return Promise.resolve({
            done: true,
            value: ''
          })
        }
      }
    }
  }
}

async function test () {
  for await (let item of obj) {
    console.log(Date.now(), item)
  }
}

test()

// 1597049702437 292.73328473812523
// 1597049702574 136.72074104961163
// 1597049703250 675.518962144079
```


