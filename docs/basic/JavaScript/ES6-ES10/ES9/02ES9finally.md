---
title: ES9(二) —— Promise.finally
tags: 
  - JavaScript
  - ES6
prev: ./01ES9forawaitof.md
next: ./03ES9rest.md
sidebarDepth: 5
---
## Promise是如何“兜底”操作的?
使用`Promise.finally`，无论执行`then`还是`catch`，都会执行`finally`里面的函数体。
​
例如一个弹窗：可以用`resolve`和`reject`分别保存变量的值，
但是最后用`finally`去控制弹窗的弹出。
​
下面看代码的例子：
```js
const Gen = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(time < 500) {
        reject(time)
      } else {
        resolve(time)
      }
    }, time);
  })
}
​
Gen(Math.random() * 1000)
  .then(val => console.log(val))
  .catch(err => console.log(err))
  .finally(() => {console.log('finish') })
```

