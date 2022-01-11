---
title: call的用法
tags: 
  - JavaScript
prev: false
next: false
sidebarDepth: 5
---

## 一、Call
```js
function fn1 () {
  console.log(1)
}

function fn2 () {
  console.log(2)
}

fn1.call(fn2)   // 1
// call方法的第一个参数改变的是fn1的this指向，所以执行fn1，输出1
fn1.call.call(fn2)	 // 2 

// 上面的输出2要解释可以这么看
// fn1的构造函数是Function，给所有的function注册一个方法mycall
// 参数：第一个参数是this指向，上下文context
// 之后的参数是传递的参数，不固定个数，这里用rest符号接收
Function.prototype.mycall = function (context, ...args) {
  // 因为fn1.call(null)可能传null，在非严格模式下，传undefined和null都默认指向window，这里进行一下判断
  context = context || window
  // fn1.mycall(obj)，我们之后在调用mycall的时候，把fn1内部的this指向传入的obj
  // 先给context设置一个属性fn来记录this
  // this指的是fn1，执行的那个函数
  // context指的是传入的obj，我们希望的指向
  context.fn = this
  // 通过上面的赋值可以知道context.fn = fn1
  // context.fn()实际上就是相当于调用fn1()
  // 谁调用 fn，函数内部的this就指向谁
  // fn是context的一个方法，内部的指向指的是context
  // 将返回值赋值到result上面
  const result = context.fn(...args)
  // context是传进来的参数，我们不能随意修改，之前加了一个fn，现在讲这个属性删除
  delete context.fn
  return result
}

fn1.mycall(fn2)  // 1
fn1.mycall.mycall(fn2)  // 2

// ----------------------执行过程------------------------------
// fn1.mycall.mycall(fn2)，执行过程 
// 从右向左执行，所以一开始执行的是右边的mycall
Function.prototype.mycall = function (context, ...args) {
  // context ---> fn2
  context = context || window
  // context.fn ---> this ----> mycall
  // fn2.mycall
  context.fn = this
  // 暂停，等待执行 fn2.mycall(没有参数)
  const result = context.fn(...args)
  delete context.fn
  return result
}

// 调用 fn2.mycall(没传参数)
Function.prototype.mycall = function (context, ...args) {
  // context ---> Window
  context = context || window
  // context.fn ---> this ---> fn2
  // Window.fn2
  context.fn = this
  // Window.fn2(没有参数)
  const result = context.fn(...args)
  delete context.fn
  return result
}
```