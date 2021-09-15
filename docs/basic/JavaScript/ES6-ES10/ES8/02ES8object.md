---
title: ES8(二) —— Object （keys、values、entries）
tags: 
  - JavaScript
  - ES6
prev: ./01ES8async.md
next: ./03ES8string.md
sidebarDepth: 5
---
## ES8新增对对象快速遍历的方法
### Object.keys()
- 参数是目标对象
- 返回的是指定对象的键组成的数组
#### 返回一个数组
ES5
```js
let grade = {
  "lilei": 96,
  "hanmeimei": 99
}

let result = []

for (let k in grade) {
  result.push(k)
}

console.log(result) //["lilei", "hanmeimei"]
```
ES8
```js
let grade = {
  "lilei": 96,
  "hanmeimei": 99
}

console.log(Object.keys(grade)) //["lilei", "hanmeimei"]
```

#### 条件筛选
ES5
```js
let grade = {
  "lilei": 96,
  "hanmeimei": 99
}

let result = []

for (let k in grade) {
  if(k === 'lilei'){
    result.push(k)
  }
}

console.log(result) // ["lilei"]
```
ES8
```js
let grade = {
  "lilei": 96,
  "hanmeimei": 99
}

console.log(Object.keys(grade).filter(item => item === 'lilei')) // ["lilei"]
// 返回一个数组，之后可以对数组进行合并、替换、查找
```

### Object.values()
- 参数是目标对象
- 返回的是值组成的数组
```js
let grade = {
  "lilei": 96,
  "hanmeimei": 99
}

console.log(Object.values(grade)) // [96,99]
console.log(Object.values(grade).filter(item => item > 97)) //[99]
```

### Object.entries()
#### 可以把对象变成可遍历的对象
可以结合 [ES6（十五）—— lterator](./ES6/15ES6(iterator).md) 使用
```js
let grade = {
  "lilei": 96,
  "hanmeimei": 99
}


for(let [k, v] of Object.entries(grade)){
  console.log(k,v)
}
// lilei 96
// hanmeimei 99
```

#### 可以传到Map中变成一个map对象进行操作
本质依旧是把对象变成可遍历的，符合`lterator`结构的
```js
let grade = {
  "lilei": 96,
  "hanmeimei": 99
}
let map1 = new Map(Object.entries(grade))
map1.get("lilei") // 96
```

