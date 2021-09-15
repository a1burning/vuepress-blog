---
title: ES9(五) —— Unicode Property Escapes
tags: 
  - JavaScript
  - ES6
prev: ./04ES9regexp.md
next: ../ES10/01ES10.md
sidebarDepth: 5
---
它按照字符的功能对字符进行分类，一个字符只能属于一个 `Unicode Property`。也就是说 `Property` 并不关心字符所属的语言，只关心字符的功能。
​
可以将`Unicode property` 理解为字符组，将小写 `p` 改成大写，就是该字符组的排除型字符组。想想看 `\d` 匹配 `0-9` 这个字符组，而 `\D` 匹配 `0-9` 以外的字符组。
​
```js
let input = 'abcdAeCd中国'
console.log(input.match(/\p{L}/ug))
// ["a", "b", "c", "d", "A", "e", "C", "d", "中", "国"]
```
​
这段代码的含义是在输入中匹配所有的字符（不限语言），这里使用的是 `Unicode Property：{L}`，这个属性的含义是任何语言的任何字母。它有点等同于
​
```js
let input = 'abcdAeCd中国'
console.log(input.match(/./sg))
```
​
- `{Ll}` [任何具有大写字母的小写字母]
​
- `{N}` [任何语言下的数字]
​
更多的 `Unicode Property` 请查阅 [官网](https://www.regular-expressions.info/unicode.html)
​
## Unicode Script
​
按照字符所属的书写系统来划分字符，它一般对应某种语言。比如 `\p{Script=Greek}` 表示希腊语，`\p{Script=Han}` 表示汉语。
​
匹配下列字符串中的中文
```js
let input = `I'm chinese!我是中国人`
console.log(input.match(/\p{Script=Han}+/u))
// ["我是中国人", index: 12, input: "I'm chinese!我是中国人", groups: undefined]
```
如果不适用这个新功能点，在 `ES9` 之前大概只能这样做：
```js
let input = `I'm chinese!我是中国人`
console.log(input.match(/[\u4e00-\u9fa5]+/))
// ["我是中国人", index: 12, input: "I'm chinese!我是中国人", groups: undefined]
```
> 虽然不同的写法看上去结果一样，然而时光飞逝，`Unicode` 在2017年6月发布了`10.0.0`版本。在这20年间，`Unicode` 添加了许多汉字。比如 `Unicode 8.0` 添加的 109 号化学元素「鿏（⿰⻐麦）」，其码点是 `9FCF`，不在这个正则表达式范围中。而如果我们期望程序里的`/[\u4e00-\u9fa5]/`可以与时俱进匹配最新的 `Unicode` 标准，显然是不现实的事情。现在只需要在 `Unicode Scripts` 找到对应的名称即可，而不需要自己去计算所有对应语言字符的的 `Unicode` 范围。
​
## Unicode Block
​
将 `Unicode` 字符按照编码区间进行划分，所以每一个字符都只属于一个 `Unicode Block`，举例说明：
​
- `\p{InBasic_Latin}: U+0000–U+007F`
- `\p{InLatin-1_Supplement}: U+0080–U+00FF`
- `\p{InLatin_Extended-A}: U+0100–U+017F`
- `\p{InLatin_Extended-B}: U+0180–U+024F`
​
**目前 `JavaScript RegExp` 还不支持 `Unicode Block`**

