---
title: ES6（十六）—— Modules
tags: 
  - JavaScript
  - ES6
prev: ./15ES6(iterator).md
next: ./17ES6(symbol).md
sidebarDepth: 5
---
## 模块这里，先简简单单讲些语法吧
## export、import
使用export、import语法，记得要进行babel编译
### 导出单个变量
```js
// A.js
export const name = 'hello'
// B.js
import {name} from './A'
console.log(name) // hello
```
### 导出多个变量
```js
// A.js
export const name = 'hello'
export let addr = 'beijing'
// B.js
import { name, addr } from './A'
console.log(name, addr)
// hello beijing
```
### 导出数组
```js
// A.js
export const list = [1, 2, 3]
// B.js
import { list } from './A'
console.log(list)
// [1, 2, 3]
```

### 整合导出
```js
// A.js
const name = 'hello'
let addr = 'beijing'
const list = [1, 2, 3]

export {
    name,
    addr,
    list
}
// B.js
import { name, addr, list } from './A'
console.log(name, addr, list)
// hello beijing [1, 2, 3]
```

### 默认导出
只能有一个默认导出，其他的都要放如对象后面去
```js
// A.js
const name = 'hello'
let addr = 'beijing'
const list = [1, 2, 3]

export default name
export {
    addr,
    list
}
// B.js
import name, { addr, list } from './A'
console.log(name, addr, list)
// hello beijing [1, 2, 3]
// C.js
// 如果想要直接改名字，需要默认导出的变量才行
import name2 from './A'
console.log(name2)
// hello
// D.js
// 不是默认导出的变量，修改名字就需要用as
import { addr as addr2 } from './A'
console.log(addr2)
// beijing
```
### 导出函数
```js
// A.js
export function say (content) {
  console.log(content)
}

// B.js
import {say} from './A'
say("helloword")
// helloword
```

### 导出对象
默认导出
```js
// A.js
export default  {
  code: 1,
  message: 'success'
}

// B.js
import obj from './A'
console.log(obj)
```

变量形式
```js
// A.js
const data = {
    code: 1,
    message: 'success'
}
const info = {
    name: 'xm',
    age: 16
}
export default {
  data,
  info
}

// B.js
import { data, info } from './A' // 报错，引入冲突
// 只能整体导入再结垢赋值
import obj from './A'
let { data, info } = obj
console.log(data, info)
// {code: 1, message: "success"} {name: "xm", age: 16}
```
### 导出类
```js
// A.js
class Test {
  constructor () {
    this.id = 2
  }
}

export {
  Test
}

// B.js
import {Test} from './A'
let test = new Test()
console.log(test.id) // 2
```
or
```js
export class Test {
  constructor () {
    this.id = 4
  }
}
```
默认导出类
```js
// A.js
class Test {
  constructor () {
    this.id = 3
  }
}

export default Test

// B.js
import Test from './A'
let test = new Test()
console.log(test.id)  // 3
```
or
```js
export default class Test {
  constructor () {
    this.id = 4
  }
}
```
or
```js
// 如果是default就不用写类名了，没有default必须写类名
export default class {
  constructor () {
    this.id = 5
  }
}
```
### 多变量多类导出
```js
// A.js
class Test {
  constructor () {
    this.id = 3
  }
}
class Ani {
  constructor () {
    this.name = 'animal'
  }
}

export {
  Test,
  Ani
}

export default class People{
  constructor () {
    this.id = 123
  }
}

// B.js
import * as Mod from './A'
let test = new Mod.Test()
console.log(test.id) // 3
let ani = new Mod.Ani()
console.log(ani.name) // animal
// 只能用default来获取默认的类，不能使用People
let people = new Mod.default()
console.log(people.id) // 123
```

