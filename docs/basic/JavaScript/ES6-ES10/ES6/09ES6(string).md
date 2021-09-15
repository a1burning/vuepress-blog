---
title: ES6（九）—— String
tags: 
  - JavaScript
  - ES6
prev: ./08ES6(regexp).md
next: ./10ES6(destructure).md
sidebarDepth: 5
displayAllHeaders: true
---
## Template
### String Literals（字符串字面量）
用来解决字符串拼接问题，从 ES6 开始可以这样定义字符串了。

```js
`string text`

`string text line 1
 string text line 2`

`string text ${expression} string text`
```

在这里你可以任意插入变量或者表达式，只要用 `${}` 包起来就好。
#### 字符串换行
ES5
```js
let html
html = '<div>'+
    '<p>你好啊</p>'+
'</div>'
console.log(html)
//<div><p>你好啊</p></div>
```
ES6
```js
html = `<div>
    <p>你好啊</p>
</div>`
console.log(html)  
//<div>
//    <p>你好啊</p>
//</div>
```
#### 包含变量或者表达式
ES5
```js
const a = 20
const b = 10
const c = 'javascript'
const str = 'my age is' + (a + b) + ' i love' + c
console.log(str)
//my age is 30 i love javascript
```
ES6
```js
const str = `my age is ${a + b} i love ${c}`
console.log(str)
//my age is 30 i love javascript
```
### Tag Literals（标签字面值）
前面的字符串字面量解决了字符串拼接的问题，对于包含复杂逻辑的字符串并不是简单的表达式能搞定的。所以需要另一种解决方案：Tag Literals
#### 有逻辑运算
ES5
```js
const retailPrice = 20
const wholeSalePrice = 16
let showText = ''
if (type === 'retail') {
    showText = '您此次购买的单价是：' + retailPrice
} else {
    showText = '您此次购买的批发价是：' + wholeSalePrice
}
console.log(showText)
```
ES6
- 第一个参数拿到的数组，空格为分隔符
- 后面的参数可以根据模板字符串里有的变量获取
- 可以解决很多的变量输出问题，更安全
- 可以制作很多模板引擎
```js
const name  = 'tom'
const gender = true
function myTagFuc (string) {
  console.log(string)
  // ["hey, ", " is a ", "", raw: Array(3)]
}

const result = myTagFuc`hey, ${name} is a ${gender}`
// 拿到的结果是模板字符串分割过之后的结果，因为里面可能掺这表达式，所以是个数组
```
除了数组之外，还可以拿到在模板字符串中所有拿到的表达式返回值 ，上面可以拿到name和gender
```js
const name  = 'tom'
const gender = true
function myTagFuc (string, name, gender) {
  console.log(string) // ["hey, ", " is a ", "", raw: Array(3)]
  console.log(name) // tom
  console.log(gender) // true
}

const result = myTagFuc`hey, ${name} is a ${gender}` 
```
如果我们函数有返回值，那么会作为整体的模板字符串返回值返回
```js
const name  = 'tom'
const gender = true
function myTagFuc (string, name, gender) {
  return 123
}

const result = myTagFuc`hey, ${name} is a ${gender}`
console.log(result)  // 123
```
想要原样返回那么在函数内部进行拼装
```js
const name  = 'tom'
const gender = true
function myTagFuc (string, name, gender) {
  const sex = gender ? 'man' : 'woman'
  return string[0] + name + string[1] + sex + string[2]
}

const result = myTagFuc`hey, ${name} is a ${gender}`
console.log(result)
// hey, tom is a man
```
## 字符串的扩展方法
- includes() —— 包含
- startsWith() —— 起始
- endsWidth() —— 结尾

相比较正则和indexOf，这种会便捷有很多，这三个都是
- 第一个参数是字符串str，必传
- 第二个参数是可选，传起始位置
- 返回值是boolean，找到了是true，没有找到是false
- 区分大小写

```js
const message = `Error: foo is not defined.`

console.log(message.startsWith('Error')) // true
console.log(message.endsWith('.')) // true
console.log(message.includes('foo')) // true
console.log(message.includes('foo', 8)) // false
```
