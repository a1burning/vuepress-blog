---
title: ES6（十五）—— Iterator
tags: 
  - JavaScript
  - ES6
prev: ./14ES6(generator).md
next: ./16ES6(modules).md
sidebarDepth: 5
---
## ES6如何让不支持遍历的结构可遍历？
```js
let authors = {
  allAuthors: {
    fiction: [
      'Agatha Christie',
      'J. K. Rowling',
      'Dr. Seuss'
    ],
    scienceFiction: [
      'Neal Stephenson',
      'Arthur Clarke',
      'Isaac Asimov',
      'Robert Heinlein'
    ],
    fantasy: [
      'J. R. R. Tolkien',
      'J. K. Rowling',
      'Terry Pratchett'
    ]
  }
}
```
### 将所有的作者名称取出来

ES5的做法

对`allAuthors`进行遍历，看看取值情况
```js
for(let [k,v] of Object.entries(authors.allAuthors)){
  console.log(k,v)
}
//fiction (3) ["Agatha Christie", "J. K. Rowling", "Dr. Seuss"]
//scienceFiction (4) ["Neal Stephenson", "Arthur Clarke", "Isaac Asimov", "Robert Heinlein"]
// fantasy (3) ["J. R. R. Tolkien", "J. K. Rowling", "Terry Pratchett"]

// 所以正确的写法是：
let r = []
for(let [k,v] of Object.entries(authors.allAuthors)){
  r = r.concat(v)
}
console.log(r)
//["Agatha Christie", "J. K. Rowling", "Dr. Seuss", "Neal Stephenson", "Arthur Clarke", "Isaac Asimov", "Robert Heinlein", "J. R. R. Tolkien", "J. K. Rowling", "Terry Pratchett"]
```
每次都需要遍历，而且还要对obj不支持遍历的对象进行改造。
而且还需要知道authors的内部结构。

**我们的目标是：**

- 写法优雅
- 数据结构种的内置逻辑不需要关心
```js
let r = []
for(let v of authors){
    console.log(v)
    r.push(v)
}
```
所以ES6的写法
```js
//固定写法
authors[Symbol.iterator] = function () {
  // 输入 this，对象本身
  let allAuthors = this.allAuthors
  let keys = Reflect.ownKeys(allAuthors)
  console.log(keys) // ["fiction", "scienceFiction", "fantasy"]
  let values = [] // 是key的值
  return {
    // 必须返回一个方法
    next () {
      console.log(values)
      //一开始values.length是0，如果是0就进入循环过程
      if (!values.length) {
        if (keys.length) { 
          values = allAuthors[keys[0]]
          keys.shift() //永远取第一个元素，用完之后进行弹出
        }
      }
      // 必须返回两个值
      return {
        done: !values.length,
        value: values.shift()
      }
    }
  }
}

let r = []
for(let v of authors){
  r.push(v)
}
console.log(r)
//["Agatha Christie", "J. K. Rowling", "Dr. Seuss", "Neal Stephenson", "Arthur Clarke", "Isaac Asimov", "Robert Heinlein", "J. R. R. Tolkien", "J. K. Rowling", "Terry Pratchett"]
```

### for-of需要`Object.entries`进行转化
```js
let obj = {
    1: "hello",
    "a":"hi"
};

for(let i of obj){console.log(i,obj[i]);}
//报错：Uncaught TypeError: obj is not iterable

let obj1 = Object.entries(obj);
console.log(obj1) //[Array(2), Array(2)]

for(let [k,v] of obj1){
    console.log(k,v)
}
//1 hello
//a hi
```

## 规定
### **可迭代协议** —— 去找对象上面有没有Symbol.iterator属性

> - 可迭代协议允许 JavaScript 对象去定义或定制它们的迭代行为, 例如（定义）在一个 for…of 结构中什么值可以被循环（得到）。一些内置类型都是内置的可迭代类型并且有默认的迭代行为, 比如 Array or Map, 另一些类型则不是 (比如Object) 。
>
> - 为了变成可迭代对象， 一个对象必须实现 @@iterator 方法, 意思是这个对象（或者它原型链 prototype chain 上的某个对象）必须有一个名字是 Symbol.iterator 的属性
>
> - 这里参考 [遍历 —— for-of(ES6新增)](https://juejin.im/post/6870811293986029582)

### **迭代器协议** —— 怎么个迭代方式？返回无参函数`next`，`next`返回一个对象包含`done`和`value`属性

> PS: 这个结构是不是和`Generator`特别像？

> 如果 `next` 函数返回一个非对象值（比如`false`和`undefined`) 会展示一个 `TypeError (“iterator.next() returned a non-object value”)` 的错误

```js
//固定写法
authors[Symbol.iterator] = function () {
  // 输入 this，对象本身
  // 输出 返回值(格式要求)
  return {
    // 必须返回一个next方法
    next () {
      // 必须返回两个值
      return {
        done: false, // boolean false-遍历没有结束 true-遍历结束
        value: 1 // 当前遍历的项目的值
      }
    }
  }
}
```
## Generator 和 lterator 结合使用
想了解`Generator`，参考文章 [ES6（十四）—— Generator](https://juejin.im/post/6876697109202993165)
```js
//可迭代协议 加*就是Generator了
authors[Symbol.iterator] = function * () {
  // 输入 this，对象本身
  let allAuthors = this.allAuthors
  let keys = Reflect.ownKeys(allAuthors)
  console.log(keys) // ["fiction", "scienceFiction", "fantasy"]
  let values = [] // 是key的值
  // 无线循环，如果退出之后，会自动中止退出的
  while(1){
    if(!values.length){
      if(keys.length){
        values = allAuthors[keys[0]]
        keys.shift()
        yield values.shift()
      }else{
        // 退出循环
        return false
      }
    }else{
      yield values.shift()
    }
  }
}
```

## 案例
- 场景：你我协同开发一个任务清单应用
- 迭代器的意义: 外部不用去关心内部的结构，直接进行遍历就可以拿到全部数据。

```js
// each方法，是todos内部暴露的方法
// 更好的是把todos直接变成一个可迭代的对象
const todos = {
  life: ['吃饭', '睡觉', '打豆豆'],
  learn: ['语文', '数学', '外语'],
  work: ['喝茶'],

  each: function (callback) {
    const all = [].concat(this.life, this.learn, this.work)
    for( const item of all) {
      callback(item)
    }
  },
  [Symbol.iterator]: function() {
    const all = [...this.life, ...this.learn, ...this.work]
    let index = 0
    return {
      next: function () {
        return {
          value: all[index],
          done: index++ >= all.length
        }
      }
    }
  }
}

todos.each(function(item){
  console.log(item)
})
// 吃饭
// 睡觉
// 打豆豆
// 语文
// 数学
// 外语
// 喝茶

for(const item of todos){
  console.log("for-of: " +item)
}
```

使用`Generator`函数实现`Iterator`方法，对上面的案例进行改进

```js
const todos = {
  life: ['吃饭', '睡觉', '打豆豆'],
  learn: ['语文', '数学', '外语'],
  work: ['喝茶'],

  each: function (callback) {
    const all = [].concat(this.life, this.learn, this.work)
    for( const item of all) {
      callback(item)
    }
  },
  [Symbol.iterator]: function * () {
    const all = [...this.life, ...this.learn, ...this.work]
    for(const item of all) {
      yield item
    }
  }
}

for(const item of todos){
  console.log(item)
}
// 吃饭
// 睡觉
// 打豆豆
// 语文
// 数学
// 外语
// 喝茶
```
