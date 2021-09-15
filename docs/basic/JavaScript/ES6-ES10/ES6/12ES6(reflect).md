---
title: ES6（十二）—— Reflect
tags: 
  - JavaScript
  - ES6
prev: ./11ES6(promise).md
next: ./13ES6(proxy).md
sidebarDepth: 5
---
## 反射，什么是反射机制？
【`java`的反射机制】是在编译阶段不知道是哪个类被加载，而是在运行的时候才加载、执行。
`js`中的`apply`就是反射机制。

## Reflect简介
`Reflect` 是一个内置的对象，它提供拦截 `JavaScript` 操作的方法，这些方法与处理器对象的方法相同。`Reflect`不是一个函数对象，因此它是不可构造的。

与大多数全局对象不同，`Reflect`没有构造函数。你不能将其与一个`new`运算符一起使用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（ **就像Math对象** ）
## 为什么要用Reflect？
`Reflect`内部封装了一系列对对象的底层操作,`Reflect`成员方法就是`Proxy`处理对象的默认实现

```js
const proxy = new Proxy(obj, {
    get(target, property) {
        // 如果没有定义get方法，那么默认返回的就是Reflect的get方法
        return Reflect.get(target, property)
    }
})
```
为什么要用`Reflect`？ <br/>因为`Reflect`提供了一套用于操作对象的`API`，我们之前操作对象可以用`Object`上面的一些方法，也可以用`in、delete`这种操作符，使用`Reflect`就统一了操作方式。
## Reflect API
handler ⽅法 | 默认调⽤ | 功能
---|---|---
get | Reflect.get() | 获取对象身上某个属性的值
set | Reflect.set() | 在对象上设置属性
has | Reflect.has() | 判断一个对象是否存在某个属性
deleteProperty | Reflect.deleteProperty() | 删除对象上的属性
getProperty | Reflect.getPrototypeOf() | 获取指定对象原型的函数
setProperty | Reflect.setPrototypeOf() | 设置或改变对象原型的函数
isExtensible | Reflect.isExtensible() | 判断一个对象是否可扩展 （即是否能够添加新的属性）
preventExtensions | Reflect.preventExtensions() | 阻止新属性添加到对象
getOwnPropertyDescriptor | Reflect.getOwnPropertyDescriptor() | 获取给定属性的属性描述符
defineProperty | Reflect.defineProperty() | 定义或修改一个对象的属性
ownKeys | Reflect.ownKeys() | 返回由目标对象自身的属性键组成的数组
apply | Reflect.apply() | 对一个函数进行调用操作，同时可以传入一个数组作为调用参数
construct | Reflect.construct() | 对构造函数进行 new 操作，实现创建类的实例
.preventExtensions | Reflect.preventExtensions() | 阻止新属性添加到对象
### .apply()
> Reflect.apply(target, thisArgument, argumentsList)

> target：目标函数，必传<br/>
> thisArgument：target函数调用时绑定的this对象，不必须<br/>
> argumentsList：target函数调用时传入的实参列表，该参数应该是一个类数组的对象，不必须

```js
//ES5
console.log(Math.floor.apply(null,[1.72]))
// 1
// 必须先指定方法，再去调用apply。
```

```js
//Reflect是一个对象，但是不能使用new
// 先传递apply，再指定是哪个方法
// 静态扫描的时候，Math.floor是没有被执行的，运行的时候，是动态的将Math.floor作为参数传进来的。
Reflect.apply(Math.floor,null,[4.72])
// 4
```
实际应用
```js
// ES5
let price = 101.5
if (price > 100) {
  price = Math.floor.apply(null, [price])
} else {
  price = Math.ceil.apply(null, [price])
}
console.log(price)
// 101

//ES6
let price = 101.5
console.log(Reflect.apply(price > 100 ? Math.floor : Math.ceil, null, [price]))
// 101
```

### .construct()
使用反射的方式去实现创建类的实例，类似于`new target(…args)`.

> Reflect.construct(target, argumentsList[, newTarget])

> target:被运行的目标函数，必选<br/>
> argumentsList	调用构造函数的数组或者伪数组，不必选<br/>
> newTarget	该参数为构造函数， 参考 new.target 操作符，如果没有newTarget参数， 默认和target一样，不必选
```js
let d = new Date()
console.log(d.getTime())
```

```js
let d1 = Reflect.construct(Date, [])
console.log(d1.getTime())
```
### .defineProperty()
静态方法 `Reflect.defineProperty()` 基本等同于 `Object.defineProperty()` 方法

> Reflect.defineProperty(target, propertyKey, attributes)

> target:目标对象，必填<br/>
> propertyKey:要定义或修改的属性的名称，不必填<br/>
> attributes:要定义或修改的属性的描述，不必填

```js
const student = {}
const r = Object.defineProperty(student, 'name', { value:'Mike' })
console.log(student, r)
// {name: "Mike"} {name: "Mike"}
```

```js
const student = {}
const r = Reflect.defineProperty(student, 'name', { value:'Mike' })
console.log(student, r)
// {name: "Mike"} true
```
这两个方法效果上来看是一摸一样的，都可以改变一个对象的值，他们的区别在于返回值不同。`Object`是返回这个值，`Reflect`是返回`true`

> PS: 在`W3C`中，以后所有的`Object`上面的方法，都会慢慢迁移到`Reflect`对象，可能以后会在`Object`上面移除这些方法。

### .deleteProperty()

`Reflect.deleteProperty` 允许你删除一个对象上的属性。返回一个 `Boolean` 值表示该属性是否被成功删除。它几乎与非严格的 `delete operator` 相同。

> Reflect.deleteProperty(target, propertyKey)

> target:删除属性的目标对象<br/>
> propertyKey:将被删除的属性的名称

```js
const obj = { x: 1, y: 2 }
delete obj.x
console.log(obj)
// {y: 2}
```
```js
const obj = { x: 1, y: 2 }
const d = Reflect.deleteProperty(obj, 'x')
console.log(obj, d)
// {y: 2} true
```

### .get()
`Reflect.get()` 方法的工作方式，就像从 `object (target[propertyKey])` 中获取属性，但它是作为一个函数执行的。

> Reflect.get(target, propertyKey[, receiver])

```js
const obj = { x: 1, y: 2 }
console.log(obj.x)
// 1
console.log(obj['x'])
// 1
```
```js
const obj = { x: 1, y: 2 }
console.log(Reflect.get(obj, 'x'))
// 1
console.log(Reflect.get([3, 4], 1))
// 4
```

### .getOwnPropertyDescriptor()
静态方法 `Reflect.getOwnPropertyDescriptor()` 与 `Object.getOwnPropertyDescriptor()` 方法相似。如果在对象中存在，则返回给定的属性的属性描述符，否则返回 `undefined`。

> Reflect.getOwnPropertyDescriptor(target, propertyKey)

```js
const obj = { x: 1, y: 2 }
console.log(Object.getOwnPropertyDescriptor(obj, 'x'))
// {value: 1, writable: true, enumerable: true, configurable: true}
console.log(Reflect.getOwnPropertyDescriptor(obj, 'x'))
// {value: 1, writable: true, enumerable: true, configurable: true}
console.log(Reflect.getOwnPropertyDescriptor({ x: 'hello' }, 'y'))
// undefined
console.log(Reflect.getOwnPropertyDescriptor([], 'length'))
// {value: 0, writable: true, enumerable: false, configurable: false}
```

对比

如果该方法的第一个参数不是一个对象（一个原始值），那么将造成 `TypeError` 错误。而对于`Object.getOwnPropertyDescriptor`，非对象的第一个参数将被强制转换为一个对象处理。
```js
Reflect.getOwnPropertyDescriptor("foo", 0);
// TypeError: "foo" is not non-null object

Object.getOwnPropertyDescriptor("foo", 0);
// { value: "f", writable: false, enumerable: true, configurable: false }
```

### .getPrototypeOf()
静态方法 `Reflect.getPrototypeOf()` 与 `Object.getPrototypeOf()` 方法是一样的。都是返回指定对象的原型（即，内部的 `[[Prototype]]` 属性的值）。

> Reflect.getPrototypeOf(target)

```js
const d = New Date()
console.log(Reflect.getPrototypeOf(d))
// {constructor: ƒ, toString: ƒ, toDateString: ƒ, toTimeString: ƒ, toISOString: ƒ, …}
console.log(Object.getPrototypeOf(d))
// {constructor: ƒ, toString: ƒ, toDateString: ƒ, toTimeString: ƒ, toISOString: ƒ, …}
```

### .has()
判断一个对象是否存在某个属性，和 `in` 运算符 的功能完全相同。

> Reflect.has(target, propertyKey)

```js
const obj = { x: 1, y: 2 }
console.log(Reflect.has(obj, 'x'))
// true
console.log(Reflect.has(obj, 'z'))
// false
```
### .isExtensible() —— 是否可扩展
`Reflect.isExtensible` 判断一个对象是否可扩展 （即是否能够添加新的属性），它与 `Object.isExtensible()` 方法一样。

> Reflect.isExtensible(target)

```js
const obj = { x: 1, y: 2 }
console.log(Reflect.isExtensible(obj))
// true
Object.freeze(obj)
obj.z = 3
console.log(Reflect.isExtensible(obj))
// false
console.log(obj)
// {x: 1, y: 2}
```

### .ownKeys() —— 判断对象自身属性
`Reflect.ownKeys` 方法返回一个由目标对象自身的属性键组成的数组。它的返回值等同于 `Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`

> Reflect.ownKeys(target)

```js
const obj = { x: 1, y: 2 }
console.log(Reflect.ownKeys(obj))
// ["x", "y"]
console.log(Reflect.ownKeys([]))
// ["length"]
console.log(Reflect.ownKeys([1,2]))
// ["0", "1", "length"]
```

### .preventExtensions() —— 是否可扩展
等同于`Object.freeze()`

`Reflect.preventExtensions` 方法阻止新属性添加到对象 例如：防止将来对对象的扩展被添加到对象中)。该方法与 `Object.preventExtensions()` 方法一致

> Reflect.preventExtensions(target)

```js
const obj = { x: 1, y: 2 }
console.log(Reflect.isExtensible(obj))
// true
Reflect.preventExtensions(obj)
obj.z = 3
console.log(Reflect.isExtensible(obj))
// false
console.log(obj)
// {x: 1, y: 2}
```
### .set() —— 写数据
`Reflect.set` 方法允许你在对象上设置属性。它的作用是给属性赋值并且就像 `property accessor` 语法一样，但是它是以函数的方式。

> Reflect.set(target, propertyKey, value[, receiver])

```js
const obj = { x: 1, y: 2 }
Reflect.set(obj, 'z', 4)
console.log(obj)
// {x: 1, y: 2, z: 4}
const arr = ['apple', 'pear']
Reflect.set(arr, 1, 'banana')
console.log(arr)
// ["apple", "banana"]
```

### .setPrototypeOf()
`Reflect.setPrototypeOf` 方法改变指定对象的原型 （即，内部的 `[[Prototype]]` 属性值）

> Reflect.setPrototypeOf(target, prototype)

```js
const arr = ['apple', 'pear']
console.log(Reflect.getPrototypeOf(arr))
// [constructor: ƒ, concat: ƒ, copyWithin: ƒ, fill: ƒ, find: ƒ,…]
Reflect.setPrototypeOf(arr, String.prototype)
console.log(Reflect.getPrototypeOf(arr))
// String {"", constructor: ƒ, anchor: ƒ, big: ƒ, blink: ƒ, …}
```
