---
title: ES6（六）—— Object
tags: 
  - JavaScript
  - ES6
prev: ./05ES6(function).md
next: ./07ES6(setmap).md
sidebarDepth: 5
---
## Object属性可以简写吗？
### 声明一个object，key和value一样可以省略
```js
//ES5 声明一个变量
let x = 1
let y = 3
let obj = {
    x: x,
    y: y
}

//ES6
let obj = {
    x,
    y
}
```
### 上面的key必须是字符串，如果key里面要加动态变量（计算属性名）
```js
//ES5
let x = 1
let y = 3
let obj = {
    x: x
}
obj[y] = 5
console.log(obj)
//{3: 5, x: 1}

//ES6
let x = 1
let y = 3
let z = 2
let obj = {
    x: x
    [y]: 6,
    [z + y]: 8
}
console.log(obj)
//{3: 6, x: 1, 5: 8}
```
### 方法的简写
```js
//ES5
let obj = {
    x: 1,
    hello: function () {
        console.log('hello')
    }
}

//ES6
let obj = {
    x: 1,
    hello () { // 简写
        console.log('hello')
    }
}
obj.hello()
```
### ES6可以添加异步函数
```js
let obj = {
    x: 1,
    * hello () { // 等同于function * functionName() {}
        console.log('hello')
    }
}
obj.hello() // （输出为空）

```

## 怎么把一个对象复制到另一个对象中？—— Object.assign()
> **Object.assign(target, ...sources)**<br/>
>
><br/>
> target 是目标对象 必选<br/>
> sources 是源对象 非必选<br/>
> 此方法用域将所有可枚举属性的值从一个或多个源对象复制到目标对象，它将返回目标对象 **(浅复制)** 
> 

### 如果source和target有相同属性
如果是0个源对象，则直接返回目标对象，如果对象有相同的属性，那么源对象的属性会覆盖掉目标对象中的属性
```js
const source1 = {
  a: 123,
  b: 123
}

const target = {
  a: 456,
  c: 456
}

const result = Object.assign(target, source1)
console.log(target)
// { a: 123, c: 456, b: 123 }
console.log(target === result)
// true
```

### 如果target不是对象
如果target不是对象，则自动转换为对象

```js
let t = Object.assign(2)
// Number {2}
let s = Object.assign(2, {a: 2})
// Number {2, a: 2}
```

### 如何使用？
如何将下面的source对象拷贝到target对象中呢？
```js
const target = {}
const source = {b: 4, c: 5}

// ES5 把souce遍历一下，把里面的数据逐个拷贝到target中
// 虽然原理简单，但是实际操作出来还是比较麻烦的
// ES6
Object.assign(target, source)
console.log(source, 'source')
```

### 解决什么问题？
拷贝之后，如果要修改里面name的值，外界也会跟着修改
```js
function func(obj) {
  obj.name = 'func obj'
  console.log(obj) // { name: 'func obj' }
}

const obj = {
  name: 'global obj'
}

func(obj)
console.log(obj) // { name: 'func obj' }
```
避免这种情况，使用assign复制到一个新对象上面
```js
function func(obj) {
  const funcObj = Object.assign({}, obj)
  funcObj.name = 'func obj'
  console.log(funcObj)  // { name: 'func obj' }
}

const obj = {
  name: 'global obj'
}

func(obj)
console.log(obj) //   { name: 'global obj' }
```
### 有点缺陷？
上面那个方法是有缺陷的:<br/>
**当赋值引用类型的值的时候，直接替换地址而不管里面的值** 
```js
const target = {
    a: {
        b: {
            c: {
                d: 4
            }
        }
    },
    e: 5,
    f: 6,
    h: 10
}
const source = {
    a: {
        b: {
            c: {
                d: 1
            }
        }
    },
    e: 2,
    f: 3
}
Object.assign(target, source)
console.log(target)
/*
{
    a: {
        b: {
            c: {
                d: 1
            }
        }
    },
    e: 2,
    f: 3
}
*/
// 如果target是空对象或者和source对象严格格式相同时进行了替换感觉没啥问题，但是上面的式子可以看出来，Object.assign进行的是浅拷贝，当复制的是引用类型，那么会将地址整体进行替换。所以h并没有保留。
```

解决方式 ——> **Object.assign + 递归** 

## 对象扩展方法 —— Object.is()

ES5之前我们判断两个变量相等使用的是`==`和`===`，两个等号在运算的时候，会先转换数据类型，所以会遇到`0 == false`为true的情况，而三等号除了比较数值，还会比较类型。

但是下面三个等号，也会出现一些情况，使用is方法可以得到正确的结果。不过一般情况还是建议使用三个等号。
```js
console.log(-0 === +0) // true
console.log(Object.is(-0, +0)) // false
console.log(NaN === NaN) // false
console.log(Object.is(NaN, NaN)) // true
```