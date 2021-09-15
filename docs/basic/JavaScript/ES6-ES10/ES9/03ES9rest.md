---
title: ES9(三) —— Object.rest.spread
tags: 
  - JavaScript
  - ES6
prev: ./02ES9finally.md
next: ./04ES9regexp.md
sidebarDepth: 5
---
之前的`rest`只是应用于数组中，`ES9`给`Object`也新增了`rest`和`spread`方法。

巧了，这两个方法的符号都是 —— `...` （俗称三个点）
## Spread
展开操作符
### 属于浅拷贝，但是并不是引用，修改值原对象不会改变。
将两个对象合并到一起
```js
const input = {
  a: 1,
  b: 2
}

const output = {
  c: 3
}
```

可以使用...的方式
```js
const input = {
  a: 1,
  b: 2
}

const output = {
  ...input,   // 打散到output中，浅拷贝
  c: 3
}

console.log(input, output)
// {a: 1, b: 2} {a: 1, b: 2, c: 3}
input.a = 4
console.log(input, output)
// 拷贝的形式用的，不是引用，所以原对象没有进行改变
// {a: 4, b: 2} {a: 1, b: 2, c: 3}
```
### 如果有相同的元素就进行替换
```js
const input = {
  a: 1,
  b: 2
}

const output = {
  ...input,
  a: 3
}

console.log(input, output)
// {a: 1, b: 2} {a: 3, b: 2}
input.a = 4
console.log(input, output)
// {a: 4, b: 2} {a: 4, b: 2}
```
### 可以合并多个对象
再加一个对象
```js
const input = {
  a: 1,
  b: 2
}
const test = {
  d: 5
}
// 将两种对象都直接放到目标对象中
const output = {
  ...input,
  ...test,
  c: 3
}

console.log(input, output)
// {a: 1, b: 2} {a: 1, b: 2, d: 5, c: 3}
input.a = 4
console.log(input, output)
// {a: 4, b: 2} {a: 1, b: 2, d: 5, c: 3}
```

### 解决了Object.assign()的整体替换丢失元素的缺陷
之前说过`Object.assign()`也可以合并元素，但是它有一些缺陷，如果不太清楚的可以看 [ES6（六）—— Object](https://juejin.im/post/6872724241477795848)

使用`spread`会将重复元素替换且因为是合并，所以不会丢失元素，**推荐使用**
```js
const target = {
  a: {
      b: {
          c: 2
      }
  },
  e: 5,
  f: 6,
  h: 10
}
const source = {
  ...target,
  a: {
      b: {
          c: 3
      }
  },
  e: 2,
  f: 3
}
console.log(source)
// { a: { b: { c: 3 } }, e: 2, f: 3, h: 10 }
```

## rest
剩余操作符，这个可以将对象的剩余元素和成一个新的对象，原理和`spread`正好相反。
```js
const input = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
}

const { a, b, ...rest } = input
console.log(a, b, rest)
// 1 2 {c: 3, d: 4, e: 5}
```


