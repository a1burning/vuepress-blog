---
title: ES6（七）—— Set & Map
tags: 
  - JavaScript
  - ES6
prev: ./06ES6(object).md
next: ./08ES6(regexp).md
sidebarDepth: 5
---
## Set数据结构
ES6除了可以使用Object存储数据，还可以使用Set存储数据
1. Set存储的成员是唯一的，不是重复的，如果有重复会自动过滤掉（用于数组去重，下面有解释）
2. 可以链式调用 add、forEach、delete、clear、has、size、for-of

### 声明Set
```js
// 声明了一个Set
let s = new Set()
// 声明并初始化数据，传入的参数是可遍历的对象，不只是数组
let s = new Set([1, 2, 3, 4])
```
### Set方法
#### 存储数据
add API
```js
let s = new Set()
s.add('hello')
s.add('goodbye')
console.log(s)
// Set(2) {"hello", "goodbye"}

//可以使用简写形式，因为其返回的是当前对象
s.add('hello').add('goodbye')
console.log(s)
// Set(2) {"hello", "goodbye"}

// 遇到重复数据会进行过滤
s.add('hello').add('goodbye').add('hello')
console.log(s)
// Set(2) {"hello", "goodbye"}
```

#### 删除数据
delete API
```js
let s = new Set()
s.add('hello').add('goodbye')
console.log(s)
// Set(2) {"hello", "goodbye"}
s.delete('goodbye') // 删除成功会返回一个true
console.log(s)
// Set(1) {"hello"}
```

#### 清空数据
clear API
```js
let s = new Set()
s.add('hello').add('goodbye')
console.log(s)
// Set(2) {"hello", "goodbye"}
s.clear()
console.log(s)
// Set(0) {}
```

#### 查找数据
has API
```js
let s = new Set()
s.add('hello').add('goodbye')
console.log(s.has('hello'))
// true
```

#### size长度
size Property
```js
let s = new Set()
s.add('hello').add('goodbye')
console.log(s.size)
// 2
```

#### 读取数据
##### keys API & values API & entries API
```js
let s = new Set()
s.add('hello').add('goodbye')
// 返回键集合，SetIterator是遍历器
console.log(s.keys())
// SetIterator {"hello", "goodbye"}

// 返回值集合
console.log(s.values())
// SetIterator {"hello", "goodbye"}

// 返回键值对集合
console.log(s.entries())
// SetIterator{"hello" => "hello", "goodbye" => "goodbye"}
// Set本质还是Object，还是以键值对的形式存在。
```
##### forEach API
```js
let s = new Set()
s.add('hello').add('goodbye')
s.forEach(item => {
    console.log(item)
})
```
##### for-of API
```js
let s = new Set()
s.add('hello').add('goodbye')
for(let item if s) {
    console.log(item)
}
```

#### 修改数据
目前没有提供修改的API，关于修改需要先删除再添加

### 数组去重ES6可以用Set处理
```js
const arr = [1,2,1,3,4,1]
const result = Array.from(new Set(arr)]
// [ 1, 2, 3, 4 ]
// or
const result = [... new Set(arr)]
// [ 1, 2, 3, 4 ]
```

## Map数据结构（字典类型）
### 之前对象的键都是字符串，会出错？
ES6之前对象的键是一个字符串，会遇到下面的问题。键被直接toString了，那么我们里面随便传一个对象都可以访问到值

```js
const obj = {}
obj[true] = 'value'
obj[123] = 'value'
obj[{a: 1, b: 2}] = 'haha'

console.log(Reflect.ownKeys(obj)) // [ '123', 'true', '[object Object]' ]

console.log(obj[{}]) // haha
console.log(obj['[object Object]']) // haha
```
### map的key可以是任意类型
下面的key是对象
```js
const m = new Map()

const tom = {name: 'xm'}

m.set(tom, 90)

console.log(m) // Map { { name: 'xm' } => 90 }
console.log(m.get(tom)) // 90
```
下面的key是数字，也可以是函数
```js
let map = new Map()
map.set(1, 'value-2')
let o = function () {
    console.log('o')
}
map.set(o, 4)
console.log(map)
// Map(2) {1 => "value-2", ƒ => 4} ƒ表示一个函数function
console.log(map.get(o))
// 4
```
### 如果实例化一个map对象
```js
// 声明了一个Map
let map = new Map()
// 声明并初始化数据，传入的参数是可遍历的对象
// 但是对其可遍历的元素有条件限制，必须要用key
let map = new Map([1, 2, 3])
// 报错 Iterator value 1 is not an entry object 不是一个字典形式

// 正确写法
// 对于外层数据满足可遍历对象，内层数组是外层对象的一个元素，前面1是key，后面2是value，同样前面的3是key，后面的4是value
let map = new Map([[1, 2]], [3, 4])
console.log(map)
// Map(2) {1 => 2, 3 => 4}
// 区别：map里面的key可以是任意值，set里面的元素可以是任意值
```
### Map方法
map方法有set、delete、has、clear、size、forEach、for-of
#### 添加/编辑数据
set API ——（添加的是可以修改的）
```js
let map = new Map()
map.set(1, 2)
map.set(3, 4)
console.log(map)
// Map(2) {1 => 2, 3 => 4}
map.set(1, 2).set(3, 4)
console.log(map)
// Map(2) {1 => 2, 3 => 4}
map.set(1, 3)
console.log(map)
// Map(2) {1 => 3, 3 => 4}
```

#### 删除数据
delete API —— （删除索引值）
```js
let map = new Map()
map.set(1, 2).set(3, 4)
// Map(2) {1 => 2, 3 => 4}
map.delete(1)
console.log(map)
// Map(1) {3 => 4}
```

#### 清空数据
clear API
```js
let map = new Map()
map.set(1, 2).set(3, 4)
// Map(2) {1 => 2, 3 => 4}
map.clear()
console.log(map)
// Map(0) {}
```

#### 查找数据
has API —— （查找索引值）
```js
let map = new Map()
map.set(1, 2).set(3, 4)
console.log(map.has(1))
// true
```

#### Size长度
size Property
```js
let map = new Map()
map.set(1, 2).set(3, 4)
console.log(map.size)
// 2
```

#### 读取数据
数据的顺序是根据初始化的顺序一致的

##### get API & keys API & values API & entries API
```js
let map = new Map()
map.set(1, 2).set(3, 4)
console.log(map.get(1))
// 2
console.log(map.keys())
// MapIterator {1, 3}
console.log(map.values())
// MapIterator {2, 4}
console.log(map.entries())
// MapIterator {1 => 2, 3 => 4}
```
##### forEach API
```js
let map = new Map()
map.set(1, 'value-2').set(3, 'value-4')
map.forEach((value, key) => {
    console.log(value, key)
})
// value-2 1
// value-4 3
```
##### for-of API
```js
let map = new Map()
map.set(1, 'value-2').set(3, 'value-4')
// map是一个可遍历对象，[key, value]和之前定义的数据结构是一致的
for (let [key, value] of map) {
    console.log(key, value)
}
// 1 "value-2"
// 3 "value-4"
```
### Map和Object的区别
上面的区别之外：

Map和Object的区别 | Map | Object
:---:|---|---
键的类型 | Map的键可以是任意值，包括函数、对象、基本类型 | Object的键只能是字符串和Symbols
键的顺序 | Map中的键值是**有序**的 | 对象的键是无序的，<br/>- Object如果是整数或者整数类型的字符串，则按照从小到大的顺序进行排列，其余的数据结构按照输入的顺序排列。<br/>- Object如果里面有整数还有其他数据类型，整数放在最前面
键值对的统计| 你可以通过size属性直接获取一个Map的键值对个数 | Object只能进行手动计算
键值对的遍历| Map可直接进行迭代，而Object的迭代需要获取它的键数组 | Object的遍历方法没有Map多
性能| Map在涉及频繁增删键值对的场景下会有性能优势

## WeakSet和WeakMap
不常用、API都一样

WeakSet和Set的区别：
- 存储的数据只能是对象

WeakMap和Map的区别：
- 只能接受对象类型的key
