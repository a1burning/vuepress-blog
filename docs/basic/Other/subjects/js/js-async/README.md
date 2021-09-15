---
title: JavaScript异步编程
tags: 
  - JavaScript
  - ES6
date: 2020-11-19
sidebarDepth: 5
---
## JavaScript采用单线程模式工作的原因
最早`JavaScript`语言就是运行在浏览器端的语言，目的是**为了实现页面上的动态交互**。实现页面交互的核心就是`DOM`操作，这就决定了它必须使用单线程模型，否则就会出现很复杂的线程同步问题。

> 假设在`js`中有多个线程一起工作，其中一个线程修改了这个`DOM`元素，同时另一个线程又删除了这个元素，此时浏览器就无法明确该以哪个工作线程为准。所以为了避免线程同步的问题，从一开始，`js`就设计成了单线程的工作模式。

所以，js是单线程工作模式，如果有多个任务，任务需要排队，一个一个依次去执行。
## 单线程的优势和弊端
- 优势：更安全，更简单
- 弊端：效率低，有些可以同时执行的任务必须等待。如果中间有一个特别耗时的任务，其他的任务就要等待很长的时间，会出现假死的情况。

为了解决这种问题，js有两种任务的执行模式：

**同步模式（Synchronous）** 和 **异步模式（Asynchronous）**。

## 同步模式与异步模式
### 同步模式
指的是代码的任务依次执行，后一个任务必须等待前一个任务结束才能开始执行。程序的执行顺序和代码的编写顺序是完全一致的。在单线程模式下，大多数任务都会以同步模式执行。

```js
console.log('global begin')
function bar () {
    console.log('bar task') 
}
function foo () {
    console.log('foo task')
    bar()
}
foo()
console.log('global end')

// global begin
// foo task
// bar task
//global end

// 使用调用栈的逻辑
```
为了避免耗时函数让页面卡顿和假死，所以还有异步模式。

### 异步模式
该模式不会去等待这个任务的结束才开始下一个任务，都是开启过后就立即往后执行下一个任务，此时异步线程会单独执行异步任务，耗时函数的后续逻辑会通过回调函数的方式定义，执行过后会将回调放到消息队列中，js主线程执行完任务过后会依次执行消息队列中的任务。**这里要强调，js是单线程的，浏览器不是单线程的，有一些API是有单独的线程去做的。**

下面看一个简单的异步模式的例子：

```js
console.log('global begin')
// 延时器
setTimeout(function timer1 () {
    console.log('timer1 invoke')
}, 1800)
// 延时器中又嵌套了一个延时器
setTimeout(function timer2 () {
    console.log('timer2 invoke')
    setTimeout(function inner () {
        console.log('inner invoke')
    }, 1000)
}, 1000)
console.log('global end')

// global begin
// global end
// timer2 invoke
// timer1 invoke
// inner invoke

//除了调用栈，还用到了消息队列和事件循环
```
异步模式对于`JavaScript`语言非常重要，没有它就无法同时处理大量的耗时任务。对于开发者而言。单线程下面的异步最大的难点就是**代码执行的顺序混乱** ，所以面试题里面百分百会考这里的内容 `- -|||`。

### 同步模式API和异步模式API的特点
**同步模式的API的特点**：任务执行完代码才会继续往下走，例如：`console.log`

**异步模式的API的特点**：下达这个任务开启的指令之后代码就会继续执行，代码不会等待任务的结束
## 实现JavaScript异步编程的几种方式
### 回调函数 —— 所有异步编程方案的根基
**回调函数**：由调用者定义，交给执行者执行的函数

```js
// callback就是回调函数
// 就是把函数作为参数传递，缺点是不利于阅读，执行顺序混乱。
function foo(callback) {
    setTimeout(function(){
        callback()
    }, 3000)
}

foo(function() {
    console.log('这就是一个回调函数')
    console.log('调用者定义这个函数，执行者执行这个函数')
    console.log('其实就是调用者告诉执行者异步任务结束后应该做什么')
})
```

还有其他的一些实现异步的方式，例如：**事件机制和发布订阅**。这些也都是基于回调函数之上的变体。
### Promise —— 更优的异步编程解决方案
主要为了解决回调地狱问题，详细了解参考 [Promise（更优的异步编程解决方案）](../../ES6-ES10/ES6/11ES6(promise).md)
### Generator
详细了解参考 [Generator -> Generator异步方案](../../ES6-ES10/ES6/14ES6(generator).md)
### async/await —— 异步操作的终极解决方案
详细了解参考 [async&await -> async/await处理多回调异步](../../ES6-ES10/ES8/01ES8async.md)

