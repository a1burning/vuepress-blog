---
title: ES6（二）—— let 与 const
tags: 
  - JavaScript
  - ES6
prev: ./01ES6.md  
next: ./03ES6(array).md
sidebarDepth: 5
---
## let
### 解决var存在的问题
let的出现是为了解决一些var存在的问题
1. 同名变量，不在一个作用域，互不影响
```js
// 下面两个i，虽然名字一样，但是不在一个作用域，所以互不影响
for (let i = 0; i < 3; i++) {
	let i = 'foo'
    console.log(i) // foo
}
```
2. 解决循环嵌套计数器命名相同混乱的问题
```js
const arr = [1, 2, 3, 4]
for(let i = 0; i < 3; i++) {
	for(let i = 0; i < 4 ; i++) {
    	console.log(arr[i])
    }
}
// 1 2 3 4 1 2 3 4 1 2 3 4
```
3. 解决计数器循环中有异步变量被改变的问题（解决原理：闭包）
```js
for (var i = 0; i < 3; i++) {
	setTimeout(() => {
    	console.log(i)
    }, 0)
}
// 输出三个3
```

### 特点
#### 1.有块级作用域
```js
{
    let a = 1
    console.log(a)
}
console.log(a) //a is not defined
```
#### 2.全局变量不能用过window（全局对象）访问
```js
var b = 3
let c = 4
console.log(b, c) // 3,4
console.log(window.b, window.c) //3,undefined
```
#### 3.不能重复声明变量
```js
var b = 3
let c = 4
console.log(b, c) // 3,4

var b = 4
console.log(b) //4

let c = 5  // Identifier 'c' has already been declared c已经被声明
console.log(c)
```

#### 4.不会进行变量提升
```js
function test() {
    console.log(a)
    let a = 1
}
test() // Cannot access 'a' before initialization 不能在初始化之前调用
```
## const
### 特点
#### 1.所有let的属性都有
#### 2.只能定义常量，不能被修改
```js
cosnt a = 2
a = 3 //Assignment to constant variable 类型错误
```

#### 3.声明时必须初始化
```js
const a //Missing initializer in const declaration  声明的时候缺少初始化
a = 2
```

### 为什么const定义对象，其属性可以改变，但是常量不可以?
const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动，对于简单类型的数据（数值，字符串，布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。

但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指针，const只能保证这个指针指向的内存地址是固定的，至于它指向的内存地址中保存的数据结构是不是可变的，就完全不能控制了。因此将一个对象声明为常量要小心。


## 最佳实践
不用var，主用const，遇到可变的使用let
