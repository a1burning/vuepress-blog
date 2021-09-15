---
title: ES7(一) —— includes
tags: 
  - JavaScript
  - ES6
prev: ../ES6/17ES6(symbol).md
next: ./02ES7pow.md
sidebarDepth: 5
---
## 数组如何判断元素是否存在？
### ES5 indexOf
数组中有的返回下标，没有的返回-1，但是其无法查找数组中的NaN
```js
const arr = ['foo', 1, NaN, false]
console.log(arr.indexOf('foo'))  // 0
console.log(arr.indexOf('bar'))  // -1
console.log(arr.indexOf(NaN))  // -1
```
### ES5 filter
```js
array1.filter(function (item) { return item === 2 }).length > 0
```
### ES6 用find
```js
array1.find(function (item) { return item === 2 })
```
### ES7 includes
## Array.prototype.includes
Array.prototype.includes()

方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。
```js
const arr = [1,2,3,4,5,7]

console.log(arr.includes(4)) // true
console.log(arr.includes(40)) // false
```
> PS:indexOf无法查找NaN，使用includes可以查找NaN


