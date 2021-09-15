---
title: ES6（十七）—— Symbol
tags: 
  - JavaScript
  - ES6
prev: ./16ES6(modules).md
next: ../ES7/01ES7includes.md
sidebarDepth: 5
---
## 简介
一种全新的原始数据类型，js的基本数据类型。**不那么深入，就先简单记个笔记

## 为什么要有这个数据类型
之前当不一样的文件中，对同一个变量进行操作的时候，会有污染的情况，所以为了解决这种问题，约定俗称会在属性名中添加文件名。

## 作用
### 如果想用toString方法，又怕和原生的冲突，可以用Symbol
```js
const obj = {
  [Symbol.toStringTag]: 'XObject'
}

console.log(obj.toString()) // [object XObject] 
```

### 更适合做私有属性，因为普通的遍历是访问不到的
```js
const obj1 = {
  [Symbol()]: 'symbol value',
  foo: 'normal value'
}

for(let key in obj1) {
  console.log(key)  // foo
}
console.log(Object.keys(obj1)) // [ 'foo' ]

console.log(JSON.stringify(obj1)) // {"foo":"normal value"}

// 使用下面的方法，可以获取到symbol的属性名
console.log(Object.getOwnPropertySymbols(obj1)) // [ Symbol() ]
```
### 目前最主要的作用就是**为对象添加独一无二的属性名**
```js
// shared.js
const cache = {}
// a.js
cache['foo'] = 123
// b.js
cache['foo'] = 234

console.log(cache) // {foo: 234}
// ==============================================
// a.js
cache['a_foo'] = 123
// b.js
cache['b_foo'] = 234

console.log(cache) // {a_foo: 123, b_foo: 234}
```
## 使用symbol
```js
// 通过symbol函数创建一个symbol类型的数据
const s = Symbol()
console.log(s) // Symbol()
console.log(typeof s) // symbol
console.log(Symbol() === Symbol()) // false 独一无二的数据

// 我们可以添加描述文本
console.log(Symbol('foo')) // Symbol(foo)
console.log(Symbol('bar')) // Symbol(bar)

// 对象的属性名可以是symbol类型也可以是string类型
// a.js
const name = Symbol()

const person = {
  [name] : 'xm',
  say () {
    console.log(this[name])
  }
}

// b.js
person.say() // xm
```
## 取值
有for方法可以获取到那个值
```js
const s1 = Symbol.for('foo')
const s2 = Symbol.for('foo')

console.log(s1 === s2) // true

// 需要注意的是，那个for对应的是字符串，所以true和'true'的效果是一样的
console.log(Symbol.for(true) === Symbol.for('true')) // true
```

- JS八种数据类型：Number、String、Boolean、Null、undefined、object、symbol、bigInt
- JS七种基本数据类型：Number、String、Boolean、Null、undefined、symbol、bigInt

