---
title: ES6（十四）—— Generator
tags: 
  - JavaScript
  - ES6
prev: ./13ES6(proxy).md
next: ./15ES6(iterator).md
sidebarDepth: 5
---
## Generator是做什么的
1. 控制循环流程用的
2. 最重要的作用是解决异步编程嵌套层级较深的问题。
## ES6如何让遍历“停”下来
`ES5`循环一旦执行，无法停下来的
```js
function loop() {
  for(let i = 0; i < 5; i++) {
    console.log(i)
  }
}

loop()
// 0
// 1
// 2
// 3
// 5

```
使用`Generator`，怎么改造？
```js
// 修改一，在loop前面加一个星号
function * loop() {
  for(let i = 0; i < 5; i++) {
  // 修改二：在输出前面加yield
    yield console.log(i)
  }
}
// 修改三：定义一个变量将loop赋值给l
const l = loop()

// 这个时候并没有输出，若要输出调用next方法
l.next() // 0
l.next() // 1
l.next() // 2
l.next() // 3
l.next() // 4
l.next() // 之后不会输出任何东西

//应用场景：年会抽奖、自定义遍历器
```

## Basic Syntax —— 基础语法
1. 遍历器就是一个函数，但是与普通的函数不同，形式上多了一个`*`。
2. 函数内部可以使用`yield`停下来
3. 调用的时候不会立即执行而是返回一个生成器对象
4. 返回的生成器对象调用`next`控制循环
5. `Generator`函数的定义不能使用箭头函数，否则会出发报错`SyntaxError`

```js
function * gen() {
  let val
  val = yield 1
  console.log(val)
}

const l = gen()
// "Generator { }"

l.next() // 没有任何输出
l.next() // undefined  yield表达式没有返回值，所以返回undefined
```
6. `next()`的返回值

- 第一个参数是返回的值，

- 第二个参数：`done`属性，表示是否遍历完成，`false`是没有遍历完，`true`是遍历完成
7. 再执行一次`next()`方法会继续执行

```js
function * gen() {
  let val
  val = yield [1, 2, 3]
  console.log(val) // undefined
}

const l = gen()

console.log(l.next()) // {value: Array(3), done: false}
console.log(l.next()) // {value: undefined, done: true}
```
```js
function * gen() {
  let val
  // yield 后面加了一个星号，后面是一个遍历的对象，所以可以嵌套一个Generator对象
  val = yield * [1, 2, 3]
  console.log(val) // undefined
}

const l = gen()

console.log(l.next()) // {value: 1, done: false}
console.log(l.next()) // {value: 2, done: false}
```

> 学到这里要明白：
>
> 1. `yield`有没有返回值？<br/>
> 没有，但是遍历器对象的`next`方法可以修改这个默认值
>
> 2. 和`ES5`相比，是如何控制程序的停止和启动的？<br/>
> 使用`yield`去控制停止，使用`next`去控制启动


## Senior Syntax —— 高级语法
如何在函数外部控制函数内部的运行？
### next添加参数
`next`函数写参数，作为`yield`的返回值
```js
function * gen() {
  let val
  val = yield [1, 2, 3]
  console.log(val) // 20
}

const l = gen()

console.log(l.next(10))// {value: Array(3), done: false}
// 此时yield没有赋值，所以10并没有用
console.log(l.next(20))// {value: undefined, done: true}
// 此时yield对val进行赋值操作，yield表达式的值是20
```
讲义的例子可以理解更深刻
```js
function * gen() {
  var val = 100
  while(true){
    console.log(`before${val}`)
    val = yield val
    console.log(`return ${val}`)
  }
}

let g = gen()
console.log(g.next(20).value)
// before 100
// 100
console.log(g.next(30).value)
// return 30
// before 30
// 30
console.log(g.next(40).value)
// return 40
// before 40
// 40
```

> 1.`g.next(20)` 这句代码会执行 `gen` 内部的代码，遇到第一个 `yield` 暂停。所以 `console.log("before "+val)` 执行输出了 `before 100`，此时的 `val` 是 `100`，所以执行到 `yield val` 返回了 `100`，注意 `yield val` 并没有赋值给 `val`。
>
> 2.`g.next(30)` 这句代码会继续执行 `gen` 内部的代码，也就是 `val = yield val` 这句，因为 `next` 传入了 `30`，所以 `yield val` 这个返回值就是 `30`，因此 `val` 被赋值 `30`，执行到`console.log("return "+val)`输出了 `30`，此时没有遇到 `yield` 代码继续执行，也就是 `while` 的判断，继续执行`console.log("before "+val)` 输出了 `before 30`，再执行遇到了`yield val`程序暂停。
>
> 3.`g.next(40)` 重复步骤 `2`。

### return控制结束
```js
function * gen() {
  let val
  val = yield [1, 2, 3]
  console.log(val) // 没有执行
}

const l = gen()

console.log(l.next(10))// {value: Array(3), done: false}
console.log(l.return())// {value: undefined, done: true}
//返回操作，函数终止
console.log(l.next(20))// {value: undefined, done: true}
```

添加返回值的参数
```js
function * gen() {
  let val
  val = yield [1, 2, 3]
  console.log(val) // 没有执行
}

const l = gen()

console.log(l.next(10))// {value: Array(3), done: false}
console.log(l.return(100))// {value: 100, done: true}
//返回操作，函数终止
console.log(l.next(20))// {value: undefined, done: true}
```

### throw抛出异常控制
```js
function * gen() {
  while (true) {
    try {
      yield 1
    } catch (e) {
      console.log(e.message) // ss
    }
  }
}

const l = gen()

console.log(l.next())//{value: 1, done: false}
console.log(l.next())//{value: 1, done: false}
console.log(l.next())//{value: 1, done: false}

l.throw(new Error('ss')) 
// 抛出错误，执行catch
console.log(l.next()) //{value: 1, done: false}
```
## Generator异步方案
之前说过最重要的作用是**解决异步编程嵌套层级较深的问题**，那我们来看一下，即使使用了Promise没有了大量的嵌套代码，但是依然有大量的回调函数，可读性依然不好。

```js
// Promise chain
ajax('/api/url1')
	.then(value => {
    	return ajax('ajax/url2')
    })
    .then(value => {
    	return ajax('ajax/url3')
    })
    .then(value => {
    	return ajax('ajax/url4')
    })
    .catch(error => {
    	console.error(error)
    })
```
解决上面的问题，就要用到Generator生成器函数，有一个更加完善的库是co库，可以看看 [阮一峰对co函数库的解释](http://www.ruanyifeng.com/blog/2015/05/co.html) ，不过后来有了async和await之后，就很少使用了。下面来看一个例子：

```js
// 定义一个generator函数，ajax返回一个promise对象
function * main () {
    try{
        const users = yield ajax('/api/users.json')
        console.log(users)
        
        const posts = yield ajax('/api/posts.json')
        console.log(posts)
        
        const urls = yield ajax('/api/urls.json')
        console.log(urls)
    } catch (e) {
        //捕获异常
        console.log(e)
    }
}

const g = main()

// 定义一个递归函数
function handlerResult(result) {
    if(result.done) return ///如果为true，退出递归调用
    // result.value返回是一个promise对象，使用then可以执行其结果
    result.value.then(data => {
        //g.next(data)可以作为yield返回值，再进入下一次递归
        handlerResult(g.next(data))
    // 异常逻辑
    }, error => {
        g.throw(error)
    })
}

handleResult(g.next())
```

## 案例
### 抽奖
ES5
```js
function draw (first = 1, second = 3, third = 5) {
  // 三个奖的候选人，一个结果，一个随机数
  let firstPrize = ['1A', '1B', '1C', '1D', '1E']
  let secondPrize = ['2A', '2B', '2C', '2D', '2E', '2F', '2G', '2H', '2I', '2J', '2K', '2L']
  let thirdPrize = ['3A', '3B', '3C', '3D', '3E', '3F', '3G', '3H', '3I', '3J', '3K', '3L', '3M', '3N', '3O', '3P', '3Q', '3R', '3S', '3T', '3U', '3V', '3W', '3X', '3Y', '3Z']
  let result = []
  let random
  // 抽一等奖
  for(let i = 0; i < first; i++){
    random = Math.floor(Math.random() * firstPrize.length)
    result = result.concat(firstPrize.splice(random, 1))
  }
  // 抽二等奖
  for(let i = 0; i < second; i++){
    random = Math.floor(Math.random() * secondPrize.length)
    result = result.concat(secondPrize.splice(random, 1))
  }
  // 抽三等奖
  for(let i = 0; i < third; i++){
    random = Math.floor(Math.random() * thirdPrize.length)
    result = result.concat(thirdPrize.splice(random, 1))
  }
  return result
}

console.log(draw())
// ["1A", "2D", "2K", "2A", "3A", "3G", "3Y", "3W", "3P"]
```

ES6
```js
function * draw (first = 1, second = 3, third = 5) {
  // 三个奖的候选人，一个结果，一个随机数
  let firstPrize = ['1A', '1B', '1C', '1D', '1E']
  let secondPrize = ['2A', '2B', '2C', '2D', '2E', '2F', '2G', '2H', '2I', '2J', '2K', '2L']
  let thirdPrize = ['3A', '3B', '3C', '3D', '3E', '3F', '3G', '3H', '3I', '3J', '3K', '3L', '3M', '3N', '3O', '3P', '3Q', '3R', '3S', '3T', '3U', '3V', '3W', '3X', '3Y', '3Z']
  let count = 0
  let random
  while(1){
    if (count < first) {
      random = Math.floor(Math.random() * firstPrize.length)
      yield firstPrize[random]
      count ++
      firstPrize.splice(random, 1)
    } else if (count < first + second) {
      random = Math.floor(Math.random() * secondPrize.length)
      yield secondPrize[random]
      count ++
      secondPrize.splice(random, 1)
    } else if (count < first + second + third) {
      random = Math.floor(Math.random() * thirdPrize.length)
      yield thirdPrize[random]
      count ++
      thirdPrize.splice(random, 1)
    } else {
      return false
    }
  }
  
}

let d = draw()
console.log(d.next().value) // 1C
console.log(d.next().value) // 2E
console.log(d.next().value) // 2H
console.log(d.next().value) // 2C
console.log(d.next().value) // 3H
console.log(d.next().value) // 3V
console.log(d.next().value) // 3A
console.log(d.next().value) // 3J
console.log(d.next().value) // 3N
console.log(d.next().value) // false
console.log(d.next().value) // undefined
console.log(d.next().value) // undefined
```

### 数3的倍数小游戏
如果是ES5，是无限死循环，程序崩溃

ES6
```js
function * count (x = 1) {
  while (1) {
    if (x % 3 === 0) {
      yield x
    }
    x++
  }
}

let num = count()
console.log(num.next().value) // 3
console.log(num.next().value) // 6
console.log(num.next().value) // 9
console.log(num.next().value) // 12
console.log(num.next().value) // 15
console.log(num.next().value) // 18
...
```

### 使用Generator函数实现Iterator方法
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

