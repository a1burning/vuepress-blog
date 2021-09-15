---
title: ES8(一) —— async&await
tags: 
  - JavaScript
  - ES6
prev: ../ES7/02ES7pow.md
next: ./02ES8object.md
sidebarDepth: 5
---
## async和普通函数的区别
```js
// 普通函数
function fuc() {
    return 27
}
console.log(fuc()); // 27

//async函数
async function firstAsync() {
  return 27
}

console.log(firstAsync())
// Promise {<resolved>: 27}
// 返回了一个promise对象，将27返回到resolve里面

// 相当于 -->

async function firstAsync() {
  return Promise.resolve(27)
}

firstAsync().then(val => {
  console.log(val) // 27
})

console.log(firstAsync() instanceof Promise)
// true 可以对async返回的对象进行判断
```

## await
下面函数如何可以按照顺序执行？
```js
async function firstAsync() {
  // 声明异步操作，执行完毕之后才能执行下面的函数
  let promise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve('now it is done')
    }, 1000)
  })
  // 执行异步操作
  promise.then(val => {
    console.log(val)
  })
  
  console.log(2)
  return 3
}

firstAsync().then(val => {
  console.log(val)
})

//2
//3
//now it is done  
```
使用`await`
```js
async function firstAsync() {
  // 声明异步操作，执行完毕之后才能执行下面的函数
  let promise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve('now it is done')
    }, 1000)
  })
  // 执行异步操作
  let result = await promise
  console.log(result)
  
  console.log(2)
  return 3
}

firstAsync().then(val => {
  console.log(val)
})

//now it is done
//2
//3
```
`await promise` 是一个表达式，后面必须要跟`promise`对象，如果不是会自动处理成`promise`对象
```js
console.log(await promise) 
//now it is done  ---有返回值
console.log(await 40) //40
console.log(await promise.resolve(40)) //40 
```
## async/await处理多回调异步
`ES2017`提供的`Async/Await`是标准的异步编程语法

如果遇到多回调的`promise`，简化可以使用`async`
```js
// Promise chain
ajax('/api/url1')
    .then(value => {
        return ajax('ajax/url2')
    })
    .then(value => {
        return ajax('ajax/url3')
    })
    .then(value => {
        return ajax('ajax/url4')
    })
    .catch(error => {
        console.error(error)
    })
```
上面的代码可以这么写，效果和语法都是和`generator`是一样的，不用定义执行器，简单便捷，推荐使用。
```js
async function main () {
    try{
        const users = await ajax('/api/users.json')
        console.log(users)
        
        const posts = await ajax('/api/posts.json')
        console.log(posts)
        
        const urls = await ajax('/api/urls.json')
        console.log(urls)
    } catch (e) {
        //捕获异常
        console.log(e)
    }
}

main()
```
## async和await必须配合使用
否则会报错
## 关于await使用中错误的处理
如果不对`await`进行错误处理，则会阻断程序执行。

`await`使用中，如果`promise`对象返回`resolve`，则返回什么值就是什么值，包括`undefined`。

但是如果返回`reject`，则返回值返回`undefined`，从`catch`函数中可以接收到。
### 第一种处理方法：try-catch
- 优点：简洁明了，所有报错都到`catch`里面处理，不需要对`await`返回值进行判断
- 缺点：本身`try-catch`是处理同步报错的问题，如果`await`函数之后有报错，则无法判断报错来源

```js
// 定义一个函数，返回promise对象
function firstAsync() {
  return new Promise((resolve,reject) => {
    const a = 0;
    if(a){
      resolve(1)
    }else{
      reject(2)
    }
  })
}


async function hello () {
  // 判断是否有报错
  try{
    const res = await firstAsync()
    console.log(res)
  }catch(err){
    console.log("err")
    console.log(err)
  }
}
```

### 第二种处理方法：.catch
- 优点：代码优雅，适合对`await`函数进行异步错误处理
- 缺点：需要对返回值再进行一次判断。

```js
// 定义一个函数，返回promise对象
function firstAsync() {
  return new Promise((resolve,reject) => {
    const a = 0;
    if(a){
      resolve(1)
    }else{
      reject(2)
    }
  })
}


async function hello () {
  // 判断是否有报错
  const res = await firstAsync().catch(err =>{
    console.log("err")
    console.log(err)
  })
  if(res){
      //TODO
  }
}

hello();
```

### 第三种处理方法，两个返回值
- 优点：统一错误处理可以在定义的函数内执行，`await`调用只需要对返回值进行判断即可，不需要单独进行`catch`处理
- 缺点：返回值是两个，不容易管理

```js
const awaitWrap = () => {
  let promise = new Promise((resolve,reject) => {
    const a = 0;
    if(a){
      resolve(1)
    }else{
      reject(2)
    }
  })
  return promise
  .then(data => [data, null])
  .catch(err => {
    // 通用错误处理写这里 TODO
    return [null,err]
  })
}

async function he() {
  const [data, err] = await awaitWrap();
  if(data){
    //如果是resolve走这里
    console.log(data)
  }else{
    //如果是reject走这里
    console.log("error")
    console.log(err)
    //特殊错误处理写这里 TODO
  }
}

he();
```

