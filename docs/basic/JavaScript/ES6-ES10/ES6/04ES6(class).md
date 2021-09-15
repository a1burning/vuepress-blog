---
title: ES6（四）—— Class
tags: 
  - JavaScript
  - ES6
prev: ./03ES6(array).md
next: ./05ES6(function).md
sidebarDepth: 5
---
## 类的使用【声明、属性、方法、继承】

## Basic Syntax —— 怎么声明一个类？

### ES5

```js
let Animal = function (type) {
    this.type = type
    this.eat = function () {
        console.log('i am eat food')
    }
}

let dog = new Animal('dog')
let monkey = new Animal('monkey')

console.log(dog.eat()) //i am eat food
console.log(monkey.eat()) //i am eat food

monkey.eat = function () {
    console.log('error')
}
console.log(dog.eat()) //i am eat food
console.log(monkey.eat()) //error
// eat如果实例化之后进行修改，修改了dog的，那么monkey的不会改变，这样就失去了继承的概念。如果是公共方法那么不要写在类的私有方法里面。

```

所以要把公共方法放在原型对象上面

```js
let Animal = function (type) {
    this.type = type
}
Animal.prototype.eat = function () {
    console.log('i am eat food')
}

let dog = new Animal('dog')
let monkey = new Animal('monkey')
console.log(dog.eat()) //i am eat food
console.log(monkey.eat()) //i am eat food
monkey.constructor.prototype.eat = function () {
    console.log('error')
}
console.log(dog.eat()) //error
console.log(monkey.eat()) //error

```

### ES6

```js
class Animal {
    constructor (type) {
        this.type = type
    }
    eat() {
        console.log('i am eat food')
    }
}

let dog = new Animal('dog')
let monkey = new Animal('monkey')

console.log(dog.eat())
console.log(monkey.eat())

```

### 类和构造函有什么区别？

> 没有区别，class只是ES5用原型链声明构造函数的**语法糖**
> `console.log(typeof Animal) //function`

## Setters & Getters —— 如何读写属性？

### ES5

无法实现读写属性的拦截操作，只读属性等不好实现

### ES6

#### getter / setter 是读写属性

读属性

```js
class Animal {
    constructor (type) {
        this.type = type
    }
    //age 前面加一个get / set，就变成了属性，es6支持属性提升到函数体最顶层，可以不全部写到constructor里面
    //get是只读属性
    get age () {
        return 4
    }
    eat () {
        console.log('i am eat food')
    }
}

let dog = new Animal('dog')
console.log(dog.age) // 4
dog.age = 5
console.log(dog.age) // 4 对age的赋值并没有生效

```

写属性

```js
let _age = 4
class Animal {
    constructor (type) {
        this.type = type
    }
    // 读取
    get age () {
        return _age //返回值和属性名age不要一样
    }
    // 写入
    set age (val) {
        if (val < 7 && val > 4) {
            _age = val //返回值和属性名age不要一样
        }
    }
    eat () {
        console.log('i am eat food')
    }
}

let dog = new Animal('dog')
console.log(dog.age) // 4
dog.age = 5 // 符合条件，修改了age属性的值
console.log(dog.age) // 5
dog.age = 8 // 不符合条件，没有修改age属性的值
console.log(dog.age) // 5

```

## Static Methods —— 如何操作一个方法？

*   对象实例方法
*   类的静态方法

### ES5

```js
let Animal = function (type) {
    this.type = type
}

// 对象实例方法
Animal.prototype.eat = function () {
    Animal.walk() //这里不用this，是因为这里的this，指的是实例对象，而walk方法是在构造函数上，不在实例对象上
    console.log('i am eat food')
}

// 添加静态方法，通过类是可以访问的，但是无法通过实例对象访问
Animal.walk = function () {
    console.log('i am walking')
}

let dog = new Animal('dog')
dog.eat()
//i am walking
//i am eat food
dog.walk() // dog.walk is not a function 报错

```

### ES6

static标识符可以实现

```js
class Animal {
    constructor (type) {
        this.type = type
    }
    // 对象实例方法，类中直接定义方法就是实例对象的方法
    eat () {
        Animal.walk() 
        console.log(this) // 这里的类指的是Animal,不能在这里使用this.type，因为Animal上面没有type属性，其原型对象上有type属性
        console.log('i am eat food')
    }
    // 添加静态方法，是通过static标识符进行区分的
    static walk () {
        console.log('i am walking')
    }
}

let dog = new Animal('dog')
dog.eat()
//i am walking
//i am eat food

```

### 开发中什么时候用对象实例方法，什么时候用静态方法？

> 如果此函数内部有要使用实例对象的属性和方法的时候，那么必须定义为**类的实例对象方法**。
> 如果此函数内部不需要实例对象的内容，就使用**类的静态方法**。

## Sub Classes —— 怎么继承另一个类？

面向对象之所以强大，就是因为继承。

### ES5

1.  先继承Animal构造函数内部的属性和方法
2.  再继承原型链上的属性和方法

```js
let Animal = function (type) {
    this.type = type
}

Animal.prototype.eat = function () {
    Animal.walk()
    console.log('i am eat food')
}

Animal.walk = function () {
    console.log('i am walking')
}
// 声明一个Dog构造函数，其继承Animal构造函数的，将Animal构造函数运行一下，并将其this指向Dog构造函数
let Dog = function () {
    // 1.初始化父类的构造函数，使用call是改变this的指向Dog的实例，后面是传入的参数，有多少依此往后排即可
    // 这里只能继承Animal构造函数内部的属性和方法
    Animal.call(this, 'dog')
}
// 2.剩下一部分挂载在原型链上的继承，需要把Dog的原型链指向Animal的原型链--引用类型
Dog.prototype = Animal.prototype
let dog = new Dog('dog')
dog.eat()
//i am walking
//i am eat food

```

### ES6

extends可以实现

```js
class Animal {
    constructor (type) {
        this.type = type
    }
    eat () {
        Animal.walk()
        console.log(this.type + ' eat food')
    }
    static walk () {
        console.log('i am walking')
    }
}

// 用extends实现了继承，用其来表示Dog是Animal的子类
class Monkey extends Animal {
    // 默认执行了下面的语句，如果构造函数没有新增属性这样写，那么可以不用写
    // constructor (type) {
        // super(type) //继承父类要执行父类的构造函数，专用方法
    // }
}
class Dog extends Animal {
    constructor (type) {
        // super必须在构造函数第一行，否则报错，而且必须传参数
        super(type) 
        this.age = 2
    }
    hello () {
        // super对象始终指向父类，调用它就是调用了父类的构造函数
        super.eat()
        console.log('and say hello')  
    }
}

let dog = new Dog('dog')
let monkey = new Monkey('monkey')
dog.eat()
monkey.eat()
// i am walking
// dog eat food
// i am walking
// monkey eat food
dog.hello()
// i am walking
// dog eat food
// and say hello
```
