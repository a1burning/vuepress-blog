---
title: ES9(四) —— RegExp-dotAll...
tags: 
  - JavaScript
  - ES6
prev: ./03ES9rest.md
next: ./05ES9unicode.md
sidebarDepth: 5
---
## RegExp 在ES9中新增
- dotAll
- 命名分组捕获
- 后行断言


## dotAll（点匹配）
正则中的点就是`dotAll`，都是**匹配任意字符**，但是很多字符是无法匹配的。例如：
- 四个字节的`UTF-16`的字符
- 行终止符 `\n` `\r` 换行 回车

```js
console.log(/foo.bar/.test('foo\nbar'))
//false
console.log(/foo.bar/.test('fooabar'))
// true
```

加上`s`可以匹配换行符
```js
console.log(/foo.bar/s.test('foo\nbar'))
// true
```
加上`s`可以匹配换行符，加上`u`就可以匹配4位的`UTF-16`字符，点的功能就全能了
```js
console.log(/foo.bar/us.test('foo\nbar'))
```

### 判断有没有开启dotAll
使用`flags`属性判断，如果没有开启就是`false`
```js
const r = /foo.bar/
console.log(r.dotAll)
// false
console.log(r.flags)
// 空
const re = /foo.bar/s
console.log(re.dotAll)
// true
console.log(re.flags)
// s
```

## named captured groups（命名分组捕获）
之前分组捕获有，但是命名的分组捕获刚有
### ES5
如何取到字符串中匹配的年月日？

```js
// 先看一下match匹配出来的值有哪些?
console.log("2019-06-07".match(/(\d{4})-(\d{2})-(\d{2})/))
// ["2019-06-07", "2019-06-07", "2019", "06", "07", index: 0, input: "2019-06-07", groups: undefined]

// 完整匹配
// 第一个括号分组
// 第二个括号分组
// 第三个括号分组
// index 从第几个字符开始匹配到的
// input 完整的输入字符串
// groups 目前位空，一会就知道用法了

const t = "2019-06-07".match(/(\d{4})-(\d{2})-(\d{2})/)
console.log(t[1]) //2019
console.log(t[2]) //06
console.log(t[3]) //07
```
上面的方法，如果数据复杂的时候不好写，况且数组还要数第几个，那么加一个名字会比较好
### ES9
```js
// 在括号里面写 ?<命名key>

const T = "2019-06-07".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/)

console.log(T)
// ["2019-06-07", "2019", "06", "07", index: 0, input: "2019-06-07", 
// groups: {day: "07", month: "06", year: "2019"}]
// 这个时候groups里面有值了，而且用命名的key可以取到

console.log(T.groups.year)  //2019
console.log(T.groups.month)  //06
console.log(T.groups.day)  //07
```

## loodbehind assert（后行断言）
先行断言都有，`ES9`刚有的后行断言
### 先行断言
`js`一直是先行断言的
```js
let test = 'hello world'
console.log(test.match(/hello(?=\sworld)/))
// 后面的括号不是分组匹配，是先行断言
// 先遇到一个条件
```

### 后行断言
但是我要知道`world`之前的那个是`hello`，就是后行断言

`ES9`这个能力补齐了
```js
console.log(test.match(/(?<=hello\s)world/))
// (?<=hello\s) 是判断world前面是hello加空格
console.log(test.match(/(?<!hell2\s)world/))
// ! 表示不等于
// \1表示捕获匹配
```


