---
title: ES6（十）—— Destructure（解构）
tags: 
  - JavaScript
  - ES6
prev: ./09ES6(string).md
next: ./11ES6(promise).md
sidebarDepth: 5
---
解构赋值：
使用数组索引去使用变量，不如直接赋值一个变量，但是也不适合用let声明很多变量

## Array-Destructure
### 基本用法
```js
let arr = ['hello', 'world']
// 通过索引访问值
let firstName = arr[0]
let surName = arr[1]
console.log(firstName, surName)
// hello world
```
ES6
```js
let arr = ['hello', 'world']
let [firstName, surName] = arr
console.log(firstName, surName)
//hello world
```
### 跳过赋值变量、可以是任意可遍历的对象
```js
//跳过某个值
//Array
let arr = ['a', 'b', 'c', 'd']
let [firstName,, thirdName] = arr 
// 左边是变量，右边是一个可遍历的对象，包括Set和Map
console.log(firstName, thirdName) // a c

//String
let str = 'abcd'
let [,, thirdName] = str
console.log(thirdName) // c

//Set
let [firstName,, thirdName] = new Set([a, b, c, d])
console.log(firstName, thirdName) // a c
```

### 左边可以是对象属性
给对象属性重新命名
```js
let user = { name: 's', surname: 't' };
[user.name,user.surname] = [1,2]
//花括号和中括号之间必须要有分号
console.log(user)
// { name: 1,surname: 2}
```

### rest变量
```js
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let [firstName,, thirdName,...last] = arr
console.log(firstName, thirdName, last)
// 1 2 [3, 4, 5, 6, 7, 8, 9]

// 上面如果只赋值firstName和thirdName，那么剩下的参数arr会被回收掉，如果不想3-9的元素被删掉，那么可以用[...rest]
// rest只能在最后一个元素中使用
```
### 默认值 & 当解构赋值值不够的情况
从前往后没有取到为undefined
```js
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let [firstName,, thirdName,...last] = arr
console.log(firstName, thirdName, last)
// 1 2 [3, 4, 5, 6, 7, 8, 9]
let arr = [1, 2, 3]
let [firstName,, thirdName,...last] = arr
// 1 2 [3]
let arr = [1, 2]
let [firstName,, thirdName,...last] = arr
// 1 2 []
let arr = [1]
let [firstName,, thirdName,...last] = arr
// 1 undefined []
let arr = []
let [firstName,, thirdName,...last] = arr
// undefined undefined []

//默认没有参数，会为undefined，如果这个时候进行数字运算的时候，就会有问题
//如果避免这种情况，就要进行默认值的赋值
let arr = []
let [firstName = 'hello',, thirdName,...last] = arr
// hello undefined []
```
## Object-Destructure
### 基本用法
```js
let options = {
    title: 'menu',
    width: 100,
    height: 200
}

let { title, width, height } = options
console.log(title, width, height)
// menu 100 200
```
### 可以换变量名
如果有变量冲突怎么办？不能用简写形式
```js
// 下面title是匹配属性名提取变量名称
// title2是新的变量名
let {title: title2, width, height} = options
console.log(title2, width, height)
//  menu 100 200
```

### 默认值
```js
let options = {
    title: 'menu',
    height: 200
}
let {title: title2, width = 130, height} = options
console.log(title2, width, height)
//  menu 130 200
```

### rest运算符
```js
let options = {
    title: 'menu',
    width: 100,
    height: 200
}

let { title, ...last } = options
console.log(title, last)
//menu {width: 100, height: 200}
```
### 嵌套对象
```js
let options = {
    size: {
        width: 100,
        height: 200
    },
    item: ['Cake', 'Donut'],
    extra: true
}
let { size: { width: width2, height }, item: [item1] } = options
console.log(width2, height, item1)
//100 200 "Cake"
```
