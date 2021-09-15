---
title: ES6（八）—— RegExp
tags: 
  - JavaScript
  - ES6
prev: ./07ES6(setmap).md
next: ./09ES6(string).md
sidebarDepth: 5
---
## sticky —— y修饰符
y表示sticky（粘连），全局匹配，必须从第一个开始匹配，连续匹配
```js
const s = 'aaa_aa_a'
const r1 = /a+/g  //相当于^ $
const r2 = /a+/y
console.log(r1.exec(s))
// ["aaa",index: 0, input:"aaa_aa_a"]
// 匹配到的结果，匹配的起始索引，输入的值
console.log(r2.exec(s))
// ["aaa",index: 0, input:"aaa_aa_a"]

console.log(r1.exec(s))
// ["aa",index: 4, input:"aaa_aa_a"]
console.log(r2.exec(s))
// null
```
g修饰符是从aaa下一个开始匹配，开始可以不是a

y修饰符是从aaa下一个开始匹配，开始必须要是a，不是a就返回null


>例子：使用lastIndex属性，可以更好地说明y修饰符。
>```js
>const REGEX = /a/g
>// 指定从2号位置（y）开始匹配
>REGEX.lastIndex = 2
>// 匹配成功
>const match = REGEX.exec('xaya')
>// 在3号位置匹配成功
>console.log(match.index) // 3
>// 下一次匹配从4号位开始
>console.log(REGEX.lastIndex) // 4
>// 4号位开始匹配失败
>REGEX.exec('xaxa') // null
>```
>上面代码中，lastIndex属性指定每次搜索的开始位置，g修饰符从这个位置开始向后搜索，直到发现匹配为止。
>
>y修饰符同样遵守lastIndex属性，但是要求必须在lastIndex指定的位置发现匹配。
>```js
>const REGEX = /a/y
>
>// 指定从2号位置开始匹配
>REGEX.lastIndex = 2
>
>// 不是粘连，匹配失败
>REGEX.exec('xaya') // null
>
>// 指定从3号位置开始匹配
>REGEX.lastIndex = 3
>
>// 3号位置是粘连，匹配成功
>const match = REGEX.exec('xaxa')
>console.log(match.index) // 3
>console.log(REGEX.lastIndex) // 4
>```

## 关于正则处理中文问题 —— u修饰符
多个字节的字符，`unicode`中大于 `\uffff`，ES5中没有办法正确匹配。也就是说，使用u修饰符会正确处理四个字节的UTF-16编码。
> 𠮷U+20BB7
### 多字节中文字符匹配

```js
let s = '𠮷'
let s2 = '\uD842\uDFB7'

console.log(/^\uD842/.test(s2)) //true  只匹配了两个字符，是不对的
console.log(/^\uD842/u.test(s2)) //false
```

### 点字符
点字符含义是除了换行符以外的任意单个字符，但是大于0xFFFF的单个字符点字符无法识别
```js
console.log(/^.$/.test(s)) //false 匹配任意字符，是不对的
console.log(/^.$/u.test(s)) //true 匹配任意字符
```

### 新增unicode码点去匹配中文字符
```js
console.log(/\u{20BB7}/u.test(s)) //true
console.log(/\u{61}/u.test('a')) //true
console.log(/\u{61}/.test('a')) //false
```
### 量词
可以计数
```js
//𠮷{2} 表示要出现两次
console.log(/𠮷{2}/u.test('𠮷𠮷')) //true
console.log(/𠮷{2}/.test('𠮷𠮷')) //false 匹配不正确
```
另外，只有在使用u修饰符的情况下，Unicode表达式当中的大括号才会被正确解读，否则会被解读为量词。

```js
/^\u{3}$/.test('uuu') // true
```

上面代码中，由于正则表达式没有u修饰符，所以大括号被解读为量词。加上u修饰符，就会被解读为Unicode表达式。

```js
/\u{20BB7}{2}/u.test('𠮷𠮷') // true
```

使用 u 修饰符之后 Unicode 表达式+量词也是可以的。

### i修饰符
```js
console.log(/[a-z]/iu.test('\u212A')) // true
console.log(/[a-z]/i.test('\u212A')) // false 虽然i是忽略大小写的，但是还是匹配不正确
```

### 预定义模式
u修饰符也影响到预定义模式，能否正确识别码点大于0xFFFF的Unicode字符。

```js
/^\S$/.test('𠮷') // false
/^\S$/u.test('𠮷') // true
```

上面代码的`\S`是预定义模式，匹配所有不是空格的字符。只有加了u修饰符，它才能正确匹配码点大于`0xFFFF`的`Unicode`字符。

利用这一点，可以写出一个正确返回字符串长度的函数。

```js
function codePointLength(text) {
  const result = text.match(/[\s\S]/gu);
  return result ? result.length : 0;
}

const s = '𠮷𠮷';

console.log(s.length) // 4
const reals = codePointLength(s)
console.log(reals) // 2
```