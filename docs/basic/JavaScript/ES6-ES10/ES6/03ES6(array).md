---
title: ES6（三）—— 数组
tags: 
  - JavaScript
  - ES6
prev: ./02ES6(let).md  
next: ./04ES6(class).md
sidebarDepth: 5
displayAllHeaders: true
---
## 数据的重要功能【遍历、转换、生成、查找】

## 数组遍历
### ES5中遍历有多少种方法？
```js
const arr = [1,2,3,4,5]
```
#### for循环
```js
for (let i = 0;i < arr.length; i++) {
    console.log(arr[i]) // 1 2 3 4 5
}
```
#### forEach
数组遍历方法
```js
arr.forEach(function(item){
    console.log(item) //1 2 3 4 5
})
```
代码简洁上看，`forEach`比`for循环`写法要简洁。

但是`forEach`不支持`reak`和`continue`，每个元素必须遍历到

```js
// for循环可以使用break控制遍历停止
for (let i = 0;i < arr.length; i++) {
    if(arr[i] === 2){
        break
    }
    console.log(arr[i]) // 1
}

// for循环可以使用continue控制遍历跳过
for (let i = 0;i < arr.length; i++) {
    if(arr[i] === 2){
        continue
    }
    console.log(arr[i]) // 1 3 4 5
}

//forEach不支持break和continue
arr.forEach(function(item){
    if(item === 2) {
        break // or continue 都会报错 Unsyntactic break 语法不支持
    }
    console.log(item)
})

arr.forEach(function(item){
    if(item === 2) {
        return false //跳过本此循环 类似continue
    }
    console.log(item) // 1 3 4 5
})
```
#### every
数组遍历方法
```js
arr.every(function(item){
    console.log(item) // 1
})
// every继不继续遍历取决于返回值，为true则继续遍历，false退出。默认是false
// 如果要全部遍历完成 需要返回true
arr.every(function(item){
    console.log(item)  // 1 2 3 4 5
    return true
})

// 可以通过返回的true or false 来控制循环
arr.every(function(item){
    if(item === 2) {
        return false //相当于for循环中的break
    }
    console.log(item)  // 1
    return true
})
```

#### for-in
for-in本身是未object遍历的，而不是为数组。虽然可以遍历数组，但是有瑕疵。

for-in中可以使用`continue`和`break`，但是不支持写`return`，会报错`Illegal return statement`

```js
// 之所以数组可以用for-in取遍历
// 是因为1.数组是对象的一种 2.数组是可遍历的
for (let index in arr) {
    console.log(index, arr[index])
}
// 0 1
// 1 2
// 2 3
// 3 4
// 4 5


//瑕疵一：
// 因为arr是一个对象，所以可以定义属性并赋值
arr.a = 8
for (let index in arr) {
    console.log(index, arr[index])
}
// 再次进行遍历
// 0 1
// 1 2
// 2 3
// 3 4
// 4 5
// a 8  这个时候a不是索引，而是字符串，如果这里我们还是以为遍历之后只是返回索引就容易出现bug


//瑕疵二：
for(let index in arr) {
    if(index === 2) {
        continue
    }
    console.log(index, arr[index])
}
// 0 1
// 1 2
// 2 3
// 3 4
// 4 5
//为什么可以使用continue但是continue却没有起作用
//因为这个时候index是字符串而不是索引

//解决方法一：只判断值，不判断类型
for(let index in arr) {
    if(index == 2) {
        continue
    }
    console.log(index, arr[index])
}
// 0 1
// 1 2
// 3 4
// 4 5
//解决方法二：将index隐式转化成数字类型
for(let index in arr) {
    if(index * 1 === 2) {
        continue
    }
    console.log(index, arr[index])
}
// 0 1
// 1 2
// 3 4
// 4 5

```

### for-of(ES6新增)
```js
// item不是下标，直接是值，且可以使用break终止循环
for(let item of arr) {
    console.log(item) // 1 2 3 4 5
}
```
#### 为什么es6要新增一个for-of？
> 要判断一个对象是不是可遍历的，不能说其是不是一个数组 or Object。
>
> ES6允许用户自定义数据结构，这种数据结构既不是数组，也不是Object，但是都是可遍历的。这种数据结构进行遍历，不能用数组的也不能用for-in，就需要新增一种for-of去遍历

举例子：
```js
// 定义一个数据结构，想要遍历拿到类别中的最低值
const Price = {
    A: [1.5, 2.3, 4.5],
    B: [3, 4, 5],
    C: [0.5, 0.8, 1.2]
}

for (let key in Price) {
    console.log(key, Price[key])
    // [1.5, 2.3, 4.5]
    // [3, 4, 5]
    // [0.5, 0.8, 1.2]
}
// 使用for-in只能返回数组，无法直接把三个最低值遍历出来
```

#### for-of不能直接遍历对象? —— 关于可迭代接口
for-of可以用来遍历Set结构和Map结构，但是不可以直接遍历object，因为其不是可遍历的对象，Iterable接口没有实现。

下面看一下：数组、Set和Map的原型对象上有迭代器

![数组.png](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91855269d7474db89154cca2512a288c~tplv-k3u1fbpfcp-zoom-1.image)

![Set对象.png](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b48c1bb4e5c4de4bfb9a6c6afcf3326~tplv-k3u1fbpfcp-zoom-1.image)

![Map对象.png](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f6ba5630dcb41feb3b12e49a90b074f~tplv-k3u1fbpfcp-zoom-1.image)
![Object.png](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23a1b64f38aa42e08a52cc031fa18b50~tplv-k3u1fbpfcp-zoom-1.image)
对象方法上面没有

![Object.png](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec5045d6f1d24ca49fb16378b1bd424e~tplv-k3u1fbpfcp-zoom-1.image)

那么我们调用一下数组上面的iterator方法
```js
const arr = ['foo', 'bar', 'baz']
console.log(arr[Symbol.iterator]())
// 返回一个iterator的对象，其原型对象上面有next方法
// Array Iterator {}  
//  __proto__: Array Iterator
//    next: ƒ next()   
//    Symbol(Symbol.toStringTag): "Array Iterator"
//    __proto__: Object
const iterator = arr[Symbol.iterator]()

console.log(iterator.next()) // { value: 'foo', done: false }
console.log(iterator.next()) // { value: 'bar', done: false }
console.log(iterator.next()) // { value: 'baz', done: false }
console.log(iterator.next()) // { value: undefined, done: true }


```
可以看到for-of内部的循环规则，里面有一个迭代器。只要对象可以实现Iterable接口就可以使用for-of进行循环。下面对一个对象进行可迭代改造。

### 优势和缺点
循环方式 | 优势 | 缺点 | 特点
---|---|---|---
for循环 | 支持break和continue | |不支持return
forEach | 写法比for简洁明了 | 全部遍历，不支持break和continue | return false相当于continue
every | 可以支持类似for的break和continue | |
for-in | 可以遍历object | 遍历数组的时候存在瑕疵| 不支持return
for-of(ES6新增) | 可以遍历除数组和object之外可遍历的数据结构，支持break和continue | |不支持return

* return只能用在函数体内，出现在代码的任何地方都会报错
## 将伪数组转换成数组
### 什么是伪数组？

简单理解：
具备一些数组的特性：可遍历、有长度。但是不能直接调用数组的API，类似于 `arguments` 和 `DOM nodeList`。

严格理解：
1. 按照索引方式存储数据
2. 具备length属性
> {0:'2',1:'b',length:2}  这种类型都可以称之为伪数组



**为什么要将伪数组转换成数组？**

如果想要使用数组的API，就需要将伪数组转换为数组
### ES5的转换
```js
let args = [].slice.call(arguments) //collection
// arguments 只能在函数体内使用
// ES6已经废弃arguments的使用
let imgs = [].slice.call(document.querySelectorAll('img')) // NodeList
```
### ES6的转换
Array.from
```js
let args = Array.from(arguments)
let imgs = Array.from(document.querySelectorAll('img'))
```

大致说一下Array.from这个函数

> **Array.from(arrayLike,mapFn,thisArg)**<br/>
> 第一个参数：伪数组，必须<br/>
> 第二个参数：遍历函数，非必须<br/>
> 第三个函数：this对象，非必须

**举一个例子：**
初始化一个长度为5的数组
```js
//ES5 
let array = Array(5)

array.forEach(function (item) {
    item = 1
})
console.log(array) // [empty × 5] forEach只会遍历存在的元素

//使用for循环可以遍历，但是依旧是先声明，后赋值
for (let i = 0, len = array.length; i < len; i++) {
    array[i] = 1
}
console.log(array) // [1,1,1,1,1]

// 先将数组转化为5个空字符串数组，然后每个遍历赋值
let arr = Array(6).join(' ').split('').map(item => 1)
console.log(array) // [1,1,1,1,1]

// ES6
//使用Array.from可以达到初始化并填充的效果
let array = Array.from({ length: 5 }, function () { return 1 })
console.log(array) // [1,1,1,1,1]
// 上面之所以第一个参数可以传{ length: 5 }，是因为第一个参数应该传伪数组

//使用Array.fill可以快速实现初始化并填充
let array = Array(5).fill(1)
console.log(array) //[1,1,1,1,1]
```

## 创建新数组
### ES5
```js
let array = Array(5)
let array = ['', ''] //无法定义长度，只能每个都初始化为空字符串
```

### ES6
#### Array.from
```js
let array = Array.from({ length: 5 })
```
#### Array.of
```js
let array = Array.of(1,2,3,4,5) //参数是依此放进去的元素，可以一个参数可以多个
console.log(array) //[1,2,3,4,5]
```
#### Array.prototype.fill
```js
let array = Array(5).fill(1) //参数是依此放进去的元素，可以一个参数可以多个
console.log(array) //[1,1,1,1,1]
```

> **Array.fill(value,start,end)**<br/>
> 第一个参数：填充值<br/>
> 第二个参数：起始位置，默认为数组的开始<br/>
> 第三个函数：结束位置，默认为数组的结束<br/>
> [start,end)

```js
let array = [1, 2, 3, 4, 5]
console.log(array.fill(8, 2, 4)) // [1,2,8,8,5]
```

## 数组中查找元素
### ES5
查找元素包括看元素在不在数组中，也包括根据某个条件去筛选。
```js
// 一
let array = [1, 2, 3, 4, 5]
let find = array.filter(function (item) {
    return item === 3
})
console.log(find) // [3]
// 能找到没找到都返回一个数组，根据数组的长度判断数组中有或者没有元素

let find = array.filter(function (item) {
    return item % 2 === 0
})
console.log(find) // [2,4]
// 如果数组中数据特别大，只是要有还是没有，并不要所有的数据

// 二
// 使用every也可以进行判断但是我们需要额外定义变量
let isExt
array.every(function (item) {
    if (item === 3) {
        isExt = item
        return false
    }
    return true
})
console.log(isExt) // 3
```

### ES6
#### Array.prototype.find
找到查找元素返回其值，找不到返回undefined
```js
let array = [1, 2, 3, 4, 5]
let find = array.find(function(item){
    return item === 3
})
console.log(find)  // 3---当前值

let find1 = array.find(function(item){
    return item === 6
})
console.log(find1)  // undefined---没有找到

let find2 = array.find(function(item){
    return item % 2 === 0
})
console.log(find2)  // 2---找到2就不再继续找了
```
#### Array.prototype.findIndex
找到查找元素返回其索引位置，找不到返回-1
```js
let find = array.findIndex(function(item){
    return item % 2 === 0
})
console.log(find)  // 1---索引位置
```

## 函数参数
### Array.from(arrayLike,mapFn,thisArg)
> 第一个参数：伪数组，必须<br/>
> 第二个参数：遍历函数，非必须<br/>
> 第三个函数：this对象，非必须

### Array.of(element0[,element1...])
> 参数：任意个参数，依此成为数组的元素

### Array.fill(value,start,end)
> 第一个参数：填充值<br/>
> 第二个参数：起始位置，默认为0<br/>
> 第三个函数：结束位置，默认为this.length<br/>
> [start,end)

### Array.find(callback[, thisArg])
> 第一个参数：回调函数，接收三个参数，element、index、array<br/>
> 第二个参数：this对象

### Array.findIndex(callback[, thisArg])
> 第一个参数：回调函数，接收三个参数，element、index、array<br/>
> 第二个参数：this对象
