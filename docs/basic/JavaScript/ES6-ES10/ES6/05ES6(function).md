---
title: ES6（五）—— 函数
tags: 
  - JavaScript
  - ES6
prev: ./04ES6(class).md
next: ./06ES6(object).md
sidebarDepth: 5
---
**函数方法更新【默认值、不确定参数、箭头函数】** 

## Default Parameters —— 如何处理函数参数默认值？
判断函数有没有默认值不能使用a || b，只能判断其是否等于undefined
### ES5
```js
//x是必传值，y和z是不必传值
function f (x, y, z) {
    if ( y === undefined) {
        y = 7
    }
    if ( z === undefined) {
        z = 42
    }
    return x + y + z
}

console.log(f(1)) // 50
console.log(f(1, 8)) // 51
console.log(f(1, 8, 43)) // 52
```

### ES6
函数参数是从左到右解析，如果没有默认值会被解析成undefined
```js
//x是必传值，y和z是不必传值
function f (x, y = 7, z = 42) {
    return x + y + z
}
console.log(f(1)) // 50
console.log(f(1, 8)) // 51
console.log(f(1, 8, 43)) // 52
```
如何让y只取默认值
```js
//有默认值的放最后
//可以看出来原理和ES5是类似的
console.log(f(1, undefined, 43))
```
默认值除了常量，还可以是其他参数的运算表达式
```js
function f (x, y = 7, z = x + y) {
    return x * 10 + z
}
console.log(f(1, undefined, 2)) // 12--1 * 10 + 2
console.log(f(1))  // 18--1 * 10 + ( 1 + 7 )
console.log(f(1, undefined))  // 18--1 * 10 + ( 1 + 7 )
```

### 函数参数个数
ES5使用arguments表示函数参数的伪数组，arguments.length表示参数的个数
```js
function f (x, y, z) {
    return arguments.length
}
console.log(f(1))  // 1
console.log(f(1, undefined)) // 2
console.log(f(1, undefined, 2)) // 3
```
ES6中不支持arguments
```js
// length是函数没有默认值的参数的个数，并不是执行的时候传入参数的个数
function f (x, y = 7, z = x + y) {
    return f.length
}
console.log(f(1))  // 1
console.log(f(1, undefined)) // 1
console.log(f(1, undefined, 2)) // 1
```

## Rest Parameter —— 怎么处理不确定参数？
### ES5
使用arguments
```js
function sum () {
    let num = 0
    //两种方法进行遍历
    // Array.prototype.forEach.call(arguments, function (item) {
    //     num += item * 1
    // })
    
    Array.from(arguments).forEach( function (item) {
        num += item * 1
    })
    return num
}
console.log(sum(1, 2, 3)) // 6
```
### ES6
使用Rest
1. 数组
2. 表示所有参数
3. 可以拆开表示部分参数
4. 剩余参数只能使用一次，且放在最后的位置上

```js
function sum (...nums) {
    // ... —— Rest parameter 所有的参数都在三点后面的nums变量中
    let num = 0
    // 直接当作数组遍历
    nums.forEach( function (item) {
        num += item * 1
    })
    return num
}
console.log(sum(1, 2, 3)) // 6

//将第一个参数 × 2 + 剩余参数
function sum (base, ...nums) {
    let num = 0
    nums.forEach( function (item) {
        num += item * 1
    })
    return base * 2 + num
}
console.log(sum(1, 2, 3)) // 7 —— 1 * 2 + 5
```

## Spread Operator（rest参数的逆运算）
Spread Operator和Rest Parameter是形似但相反意义的操作符，简单来说Rest Parameter是把不定参数“收敛”成数组，而Spread Operator是把固定数组“打散”到对应的参数中

有一个数组，要整体当成参数
### ES5
```js
//计算三角形周长
function sum (x = 1, y = 2, z = 3) {
    return x + y + z
}
let data = [4, 5, 6]
console.log(sum(data[0], data[1],  data[2])) // 15
console.log(sum.apply(this, data)) // 15
// apply()方法：接受两个参数，一个是在其中运行函数的作用域，另一个是参数数组（可以是Array的实例，也可以是arguments对象），它将作为参数传给Function（data–>arguments）
// 定义：方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。
// call()方法与apply()方法的区别在于接受参数的方式不同，使用call方法是传递给函数的参数必须逐个例举出来
console.log(sum.apply(null, [4, 5, 6])) // 15
```
### ES6
```js
console.log(sum(...data)) // 15
```

## Arrow Functions(箭头函数)
() => {}
### 声明
> 左边括号里面是参数，后边括号里面是函数体

```js
// ES5声明函数
function hello () {}
let hello = function () {}

//ES6
let hello = () => {
    console.log('hello world')
}
hello() //hello world
```
### 参数情况
#### 可以加参数

```js
let hello = (name) => {
    console.log('hello world ' + name)
}
hello('beijing') //hello world beijing
```
#### 有且只有一个参数的时候，括号可以省略

```js
let hello = name => {
    console.log('hello world ' + name)
}
hello('beijing') //hello world beijing
```
#### 花括号什么情况下可以省略
1. 返回是一个表达式（没有花括号的时候，表达式的值会自动return，有了花括号，必须写return）

```js
let sum = (z, y, z) => x + y + z
console.log(sum(1, 2, 3)) // 6
//return 和花括号都可以省略
```

2. 返回是一个对象，要用小括号括住

```js
let sum = (x, y, z) => ({
    x: x,
    y: y,
    z: z
})
// 小括号是函数表达式的意思，这个时候的花括号表示对象
```

3. 如果中间有要操作的东西，可以使用逗号分隔，最后一个是返回的元素

```js
const add = (a, b, c) => (console.log(1), a+b+c)
console.log(add(1,2,3))
// 输出
// 1
// 6
```

3. 其他情况老老实实写

### this的指向，不是谁调用指向谁，是谁定义指向谁
换句简单的话说，箭头函数不改变this的指向
```js
// ES5
let test = {
    name: 'test',
    say: function () {
        console.log(this.name)
    }
}
test.say()   // test

// ES6
let test = {
    name: 'test',
    say: () => {
        console.log(this.name)
    }
}
test.say()   // undefined
// 因为箭头函数中对this的处理是定义时，this的指向也就是test外层所指向的window，而window没有name属性，所以是undefined
```

