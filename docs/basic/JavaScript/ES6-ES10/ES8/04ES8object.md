---
title: ES8(四) —— Object.getOwnPropertyDescriptor()
tags: 
  - JavaScript
  - ES6
prev: ./03ES8string.md
next: ./05ES8.md
sidebarDepth: 5
---
## ES8如何获取Object的描述符
`Object.getOwnPropertyDescriptor()`只能获取对象属性的描述符但是不能对其进行修改
### 设置描述符使用defineProperty()
- 第一个参数目标对象
- 第二个参数目标属性（可以是`Symbol`）
- 第三个参数是对描述符进行配置，`true`是开启，`false`是关闭
- 返回传递的目标对象
```js
const data = {
  Portland: '78/50',
  Dublin: '88/52',
  Lima: '58/40'
}

Object.defineProperty(data, 'Lima', {
  enumerable: false, // 不可枚举
  writable: false // 不可改写
})

// 不可枚举的对象不会在里面
console.log(Object.keys(data))
// ["Portland", "Dublin"]
```
### 获取单个属性的描述符 —— Object.getOwnPropertyDescriptor()
获取对象属性的描述符
- 第一个参数目标对象
- 第二个参数目标属性
- 返回值是对象及其所有描述符，找不到属性返回`undefined`

```js
//可以看到单个属性的描述符
console.log(Object.getOwnPropertyDescriptor(data, 'Lima'))
// {value: "58/40", writable: false, enumerable: false, configurable: true}
```
### 获取所有属性里面的数据描述符 —— Object.getOwnPropertyDescriptors()
只接受一个参数，目标对象。
```js
// 可以看到所有属性里面的数据描述符
console.log(Object.getOwnPropertyDescriptors(data))
// Portland: {value: "78/50", writable: true, enumerable: true, configurable: true}
// Dublin: {value: "88/52", writable: true, enumerable: true, configurable: true}
// Lima: {value: "58/40", writable: false, enumerable: false, configurable: true}
```
## 描述符
关于数据描述符集合与其含义。
描述符 | 备注
---|---
value | [属性的值]
writable | [属性的值是否可被改变]
enumerable | [属性的值是否可被枚举]
configurable | [描述符本身是否可被修改，属性是否可被删除]
get | [获取该属性的访问器函数（getter）。如果没有访问器， 该值为undefined。]
set | [获取该属性的设置器函数（setter）。 如果没有设置器， 该值为undefined]

### 描述符参考
- [Object.defineProperty MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [Object.getOwnPropertyDescriptor MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

## 可以拷贝getter和setter属性
使用Object.assign无法对getter和setter的内容进行拷贝
```js
const p1 = {
  firstName: 'Lei',
  lastName: 'Wang',
  get fullName () {
    return this.firstName + ' ' + this.lastName
  }
}

const p2 = Object.assign({}, p1)
p2.firstName = 'Xiao'
console.log(p2)
// { firstName: 'Xiao', lastName: 'Wang', fullName: 'Lei Wang' }

// 这里面get的东西没有进行改变，因为Object.assign只是把fullName当成普通变量获取了
```
如果要获取全部的，那么需要这样做
```js
const descriptors = Object.getOwnPropertyDescriptors(p1)
console.log(descriptors)
/**  获取了全部的描述信息，然后再一个新对象上定义过去，这样才能全部拷贝过去
{
  firstName: {
    value: 'Lei',
    writable: true,
    enumerable: true,
    configurable: true
  },
  lastName: {
    value: 'Wang',
    writable: true,
    enumerable: true,
    configurable: true
  },
  fullName: {
    get: [Function: get fullName],
    set: undefined,
    enumerable: true,
    configurable: true
  }
}
*/
const p3 = Object.defineProperties({}, descriptors)
p3.firstName = 'Hu'
console.log(p3.fullName) // Hu Wang
```

