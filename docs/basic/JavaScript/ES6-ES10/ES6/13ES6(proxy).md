---
title: ES6（十三）—— Proxy
tags: 
  - JavaScript
  - ES6
prev: ./12ES6(reflect).md
next: ./14ES6(generator).md
sidebarDepth: 5
---
## Proxy
在 `ES6` 标准中新增的一个非常强大的功能是 `Proxy`，它可以自定义一些常用行为如**查找、赋值、枚举、函数调用**等。通过 `Proxy` 这个名称也可以看出来它包含了“代理”的含义，只要有“代理”的诉求都可以考虑使用 `Proxy` 来实现。

> PS: 类似租房找中介，中介可以屏蔽原始信息。

## Basic Syntax
> let p = new Proxy(target, handler)

|参数|含义|必选|
---|---|---
|target|用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）|Y|
|handler|一个对象，其属性是当执行一个操作时定义代理的行为的函数|Y|

第一个参数 `target` 就是用来代理的“对象”，被代理之后它是不能直接被访问的，而 `handler` 就是实现代理的过程。

```js
//o是房东的角色，被代理的对象
let o = {
  name: 'xiaoming',
  price: 190
}

// d是一个中介的角色，代理
let d = new Proxy(o, {})

console.log(d.price, d.name) // 190 'xiaoming'
// 因为传的是空对象，所以是透传


let d = new Proxy(o, {
  get(target, key) { //target是指o，代理的对象，key指的是属性
    if(key === 'price') { // 如果等于价格的时候进行加20的操作
      return target[key] + 20
    } else {
      return target[key]
    }
  }
})
console.log(d.price, d.name) //210 "xiaoming"
```

```js
let o = {
  name: 'xiaoming',
  age: 20
}

console.log(o.name) // xiaoming
console.log(o.age) // 20
console.log(o.from) // undefined
// 当我们读取from的时候，因为o里面没有这个属性，所以返回undefined，如果我们不想在调用的时候出现undefined

// ES5方式处理
// console.log(o.from || '')

// ES6方式处理
let o = {
  name: 'xiaoming',
  age: 20
}

let handler = {
  get(obj, key) {
    return Reflect.has(obj, key) ? obj[key] : ''
  }
}

let p = new Proxy(o, handler)

console.log(p.from) // ''
```
## Schema Validation —— 只读
拿走备份，不影响原始数据

在ES5中的应用
```js
let o = {
  name: 'xiaoming',
  price: 190
}

for(let [key] of Object.entries(o)) {
  Object.defineProperty(o, key, {
    writable: false
  })
}

console.log(o.name, o.price)// xiaoming 190
o.price = 300
console.log(o.name, o.price)// xiaoming 190
```
ES6
```js
let o = {
  name: 'xiaoming',
  price: 190
}

let d = new Proxy(o, {
  get (target, key) {
      return target[key]
  },
  set (target, key, value) {
      return false
  }
})
//只读不能写
d.price = 300
console.log(d.price, d.name)
// 190 "xiaoming"
```
和代理的区别，在于这个全部锁死，但是`ES6`中用户只读，但是代理可以做操作
## Schema Validation —— 校验
判断如果价格 `>300` 就不让修改，如果没有这个属性就返回空字符串
```js
let o = {
  name: 'xiaoming',
  price: 190
}

let d = new Proxy(o, {
  get (target, key) {
    return target[key] || ''
  },
  set (target, key, value) {
    if (Reflect.has(target, key)) {
      if (key === 'price') {
        if(value > 300){
          return false
        } else {
          target[key] = value
        } 
      } else {
        target[key] = value
      }
    } else {
      return false
    }
  }
})

d.price = 280
console.log(d.price, d.name)// 280 "xiaoming"
d.price = 301 // 没有生效，因为校验没有通过
d.name = 'xiaohong'
console.log(d.price, d.name)// 280 "xiaohong"
d.age = 40 // 没有这个属性，set时候返回，get的时候赋值为空字符串
console.log(d.price, d.name, d.age)// 280 "xiaohong" ""
```
去掉耦合，将验证函数抽离成一个验证函数
```js
let o = {
  name: 'xiaoming',
  price: 190
}
let validator = (target, key, value) => {
  if (Reflect.has(target, key)) {
    if (key === 'price') {
      if(value > 300){
        return false
      } else {
        target[key] = value
      } 
    } else {
      target[key] = value
    }
  } else {
    return false
  }
}
let d = new Proxy(o, {
  get (target, key) {
    return target[key] || ''
  },
  set: validator
})

d.price = 280
console.log(d.price, d.name)// 280 "xiaoming"
d.price = 301
d.name = 'xiaohong'
console.log(d.price, d.name)// 280 "xiaohong"
d.age = 40
console.log(d.price, d.name, d.age)// 280 "xiaohong" ""
```
整理成一个组件
```js
// Validator.js
export default (obj, key, value) => {
  if (Reflect.has(key) && value > 20) {
    obj[key] = value
  }
}

import Validator from './Validator'
let data = new Proxy(response.data, {
  set: Validator
})
```

## Schema Validation —— 监控上报
```js
window.addEventListener('error', (e) => {
  console.log(e.message)
  // 上报
  // report('...')
}, true) //捕获
let o = {
  name: 'xiaoming',
  price: 190
}
let validator = (target, key, value) => {
  if (Reflect.has(target, key)) {
    if (key === 'price') {
      if(value > 300){
        //不满足要触发错误
        throw new TypeError('price exceed 300')
      } else {
        target[key] = value
      } 
    } else {
      target[key] = value
    }
  } else {
    return false
  }
}
let d = new Proxy(o, {
  get (target, key) {
    return target[key] || ''
  },
  set: validator
})

d.price = 280
console.log(d.price, d.name)// 280 "xiaoming"
d.price = 301
d.name = 'xiaohong'
console.log(d.price, d.name)// 280 "xiaohong"
d.age = 40
console.log(d.price, d.name, d.age)// 280 "xiaohong" ""
```
## Schema Validation —— 唯一只读id
1. 每次生成一个id
2. 不可修改
3. 每个实例的id互不相同

```js
// 探索一
class Component {
  constructor() {
    this.id = Math.random().toString(36).slice(-8)
  }
}

let com = new Component()
let com2 = new Component()
for (let i = 0 ; i < 10 ; i++) {
  console.log(com.id)
}
for (let i = 0 ; i < 10 ; i++) {
  console.log(com2.id)
}
com.id = 'abc'
console.log(com.id,com2.id)
// 这种方式可以每次生成一个id，但是可以修改，不符合要求
// (10) 4robfncs
// (13) 93ukz26i
// 可以修改
// abc 93ukz26i
```
```js
// 探索二
class Component {
  get id () {
    return Math.random().toString(36).slice(-8)
  }
}

let com = new Component()
let com2 = new Component()
for (let i = 0 ; i < 10 ; i++) {
  console.log(com.id)
}
for (let i = 0 ; i < 10 ; i++) {
  console.log(com2.id)
}
com.id = 'abc'
console.log(com.id,com2.id)
// 这种方式不可以修改，但是每此都生成了一个新的，不符合要求
// nqwlamib
// l9ojsjiq
// gad3vm2a
// i1jew3bd
// owquntob
// rcpce268
// va6mry5v
// lvqxv0m4
// a900358x
// jahi7079
// vukusf5k
// rg8hyzf3
// 50vxv0hk
// tjeyes1v
// 4g8zwsxz
// 5r1cbx1k
// v9k2v7hd
// 0mgn3heb
// n0zc9v66
// rdjevl2i
// 9rjmwrd9 kxdxtywe
```

```js
// 探索三
class Component {
  constructor() {
    this.proxy = new Proxy({
      id: Math.random().toString(36).slice(-8)
    }, {})
  }
  get id () {
    return this.proxy.id
  }
}

let com = new Component()
let com2 = new Component()
for (let i = 0 ; i < 10 ; i++) {
  console.log(com.id)
}
for (let i = 0 ; i < 10 ; i++) {
  console.log(com2.id)
}
com.id = 'abc'
console.log(com.id,com2.id)
// 满足要求
// (10)e9e8jsks
// (10)tfs2rrvg
// e9e8jsks tfs2rrvg
```
## Revocable Proxies —— 撤销代理
除了常规代理，还可以创建临时代理，临时代理可以撤销。

一旦`revoke`被调用，`proxy`就失效了，就起到了临时代理的作用。
```js
let o = {
  name: 'xiaoming',
  price: 190
}

// 这里不能使用new，只能使用Proxy.revocable去声明代理
let d = Proxy.revocable(o, {
  get(target, key) {
    if(key === 'price') {
      return target[key] + 20
    } else {
      return target[key]
    }
  }
})
// d里面包含了代理数据和撤销操作
console.log(d.proxy.price) // 210
console.log(d) // {proxy: Proxy, revoke: ƒ}

setTimeout(function(){
  // 对代理进行撤销操作
  d.revoke()
  setTimeout(function(){
    console.log(d.proxy.price)
    // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
  },100)
},1000)
```

## Proxy VS Object.defineProperty()
如果想要监听某个对象属性的改变，可以使用`Object.defineProperty`这个方法去添加属性，那么就可以捕捉到对象中属性的读写过程， `VUE3.0`之前的版本就是通过这个实现的数据双向绑定。从`VUE3.0`开始就使用`proxy`来实现内部响应了。

`proxy`是专门为对象设置代理器的，那么`proxy`就可以轻松监视到对象的读写过程。相比较`defineProperty`，`proxy`的功能更加强大，使用起来也更为方便。

### 1. proxy监视的操作更广

`defineProperty`只能监视属性的读写，`proxy`能够监视到更多对象的操作，例如删除属性操作
```js
const person = {
  name: 'xm',
  age: 20
}

const personProxy = new Proxy(person, {
  deleteProperty (target, property) {
    console.log('delete ' + property) // delete age
    delete target[property]
  }
}) 

delete personProxy.age

console.log(person) // { name: 'xm' }
```

handler ⽅法 | 触发⽅式
---|---
get | 读取某个属性
set | 写⼊某个属性
has | in 操作符
deleteProperty | delete 操作符
getProperty | Object.getPropertypeOf()
setProperty | Object.setPrototypeOf()
isExtensible | Object.isExtensible()
preventExtensions | Object.preventExtensions()
getOwnPropertyDescriptor | Object.getOwnPropertyDescriptor()
defineProperty | Object.defineProperty()
ownKeys | Object.keys() 、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()
apply | 调⽤⼀个函数
construct | ⽤ new 调⽤⼀个函数

### 2. Proxy更好的支持数组对象的监视

以往`Object.defineProperty()`使用的是重写数组的操作方法

#### **如何使用Proxy对数组进行监视？**
```js
const list = []

const listProxy = new Proxy(list, {
  set(target, property, value) {
    console.log('set', property, value)
    target[property] = value
    return true // 表示设置成功
  }
})

listProxy.push(100)
// set 0 100
// set length 1

listProxy.push(200)
// set 1 200
// set length 2
```

### 3. Proxy是以非侵入的方式监管了对象的读写
