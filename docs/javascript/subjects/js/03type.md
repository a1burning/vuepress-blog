---
title: JavaScript类型系统
tags: 
  - javascript
prev: ./02.md
next: false
sidebarDepth: 5
---
# JavaScript类型系统

这篇文章要先讨论一些概念，这些概念我们在开始学习JavaScript的时候就知道了，**`JavaScript是一个弱类型且动态类型的语言`**，那么这些概念具体这里做了整理。之后还要重点讨论的是 **`JavaScript自有类型系统的问题`**，以及如何借助一些优秀的技术方案，解决这些问题。

## 类型系统
我们经常用两个维度去描述一个编程语言的特性，这两个维度不要混淆，强类型并不是动态类型...
- 强类型与弱类型，这是从**类型安全**的维度分类
- 静态类型与动态类型，这是从**类型检查**的维度分类

### 类型安全 —— 强类型 VS. 弱类型
> **强类型** ：要求语言层面限制函数的实参类型必须与形参类型相同。
>
> **弱类型** : 语言层面不会限制实参的类型。

下面举个例子：
```Java
// Java
class Main {
    // 这里定义了传入的参数是int类型，那么实际的时候也应该是int类型
    static void foo(int num) {
        System.out.printIn(num);
    }
    
    public static void main(Sting[] args) {
        // 下面的如果int类型就通过，如果不是int类型就会报错
        Main.foo(100); // ok
        Main.foo('100'); // error "100" is a string
        Main.foo(Integer.parseInt("100")); // ok
    }
}
// ---------------------------------------------------
// JavaScript
// 传的时候没有规定是什么类型，那么实参是什么类型都不会报错
function foo(num) {
    console.log(num)
}

foo(100) // ok
foo('100') // ok
foo(parseInt('100')) // ok
```

> 由于这种强弱类型之分根本不是某一个权威机构的定义，所以之后的人们对制定的细节出现了不一样的理解。大致也就是说强类型有更强的类型约束，而弱类型中几乎没有什么约束。

#### 两者之间的区别
**`强类型语言中不允许有任何的隐式类型转换，而弱类型语言则允许任意的数据隐式类型转换。`**

```js
// JavaScript
// js报的错误都是在代码层面，运行的时候通过逻辑判断手动抛出的，并不是语法层面的类型限制
// 下面'100'是字符串，在做减法的时候进行了隐式类型转换，转换成了Number类型，最后得到的结果是50，Number类型。
> '100' - 50
50
// 下面字符串进行隐式类型转换，不是数字的成为NaN（不是数字）
> Math.floor('foo')
NaN
// 布尔值进行隐式类型转换，转成了数字1
> Math.floor(true)
1
```

```python
# python
# 这里无法进行隐式类型转换，会在语法层面上报类型错误
> '100' - 50
TypeError: unsupported operand type(s) for -: 'str' and 'int'
> abs('foo')
TypeError: bad operand type for abs(): 'str'
```

### 类型检查 —— 静态类型 VS. 动态类型
都比较统一，没什么争议
> **静态类型** ：一个变量声明时它的类型就是明确的，声明过后，类型不能修改。
>
> **动态类型** ：运行阶段才可以明确变量的类型，而且变量的类型随时可以改变。所以动态类型语言中的变量没有类型，变量中存放的值时有类型的。

```java
// Java
class Main {
    public static void main(String[] args) {
        // 一开始就定了num的类型是int，如果修改也只能修改成int类型，如果修改成string就会报错
        int num = 100;
        num = 50; // ok
        num = '100' // error
        System.out.printInt(num);
    }
}

// JavaScript
// 可以随意修改num的类型
var num = 100
num = 50 // ok
num = '100' // ok
num = true // ok
console.log(num)
```
#### 两者之间的区别
**`静态类型不能修改变量的类型，动态类型可以随时去修改变量的类型。`**

## JavaScript类型系统的特征
JavaScript是弱类型且动态类型的语言，灵活多变，可以进行 **隐式转换** ，也可以进行 **类型推断** ，但是缺失了类型系统的可靠性。

## 为什么JS是弱类型且动态类型呢？
- 早前的`JavaScript`应用简单，所以并没有复杂的类型系统
- `JavaScript`是脚本语言，没有编译环节，所以设计成静态语言是没有意义的

### 为什么需要类型检查呢？
- 因为现在的`JavaScript`应用越来越复杂，开发周期也越来越长，越来越大的项目几百行代码已经不满足现状了，所以现在弱类型已经成为了`JavaScript`的短板。
- 这些东西只能通过约定去规避问题，但是在大型项目中通过人为约定存在隐患。

### 弱类型的不足
1. 只有在运行阶段才能发现代码的异常，代码没有执行的时候也无法发现代码异常，在隐藏比较深的情况下，测试不能百分百覆盖。

```js
const obj = {}
obj.foo()  // TypeError: obj.foo is not a function

// 下面这个延时器，在时间到了之后才会运行，给测试带来麻烦
setTimeout(() => {
    obj.foo()
}, 100000)
```

2. 函数参数类型不确定，输入的结果有偏差 

```js
// 不明确是数字，所以结果不一样
function sum (a, b) {
    return a + b
}

console.log(sum(100, 100)) // 200
console.log(sum(100, '100')) // 100100
```

3. 隐式类型转换在对象属性名转化成字符串，里面的内容会有很多的问题

```js
// 定义一个字符串，对象的属性名不能是对象，会自动转换成字符串，如果不满足就会有问题
const obj = {}
obj[true] = 100
obj[{name:1}] = 1
console.log(obj) // {true: 100, [object Object]: 1}
console.log(obj['true']) // 100
console.log(obj["[object Object]"]) // 1
```
### 强类型的优势
1. 错误在开发阶段就会暴露，越早发现越好
2. 代码更智能，编码更准确（开发工具的智能提示因为有变量类型才有提示）
3. 重构更牢靠（如果项目中很多地方用到的成员，需要删除成员或者修改成员名称的时候，弱类型语言会有隐患）
4. 减少不必要的类型判断

```js
function sum (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('arguments must be a number')
    }
    return a + b
}
```

## JavaScript自由类型系统问题的解决方案
这里之后会进行内容补充
- [Flow（一）—— JavaScript静态类型检查器](https://juejin.cn/post/6900912350640275470/)
- [TypeScript(一) —— 了解并快速入门](https://juejin.cn/post/6901255219691454472)

## 关于查资料对于编译型语言和解释型语言的知识点补充
### 编译型语言
> 使用专门的编译器，针对特定的平台，将高级语言源代码一次性的编译成可被该平台硬件执行的机器码，并包装成该平台所能识别的可执行性程序的格式。
>
> **`编译型语言一次性的编译成平台相关的机器语言`** 文件，运行时脱离开发环境，与特定平台相关，一般无法移植到其他平台，现有的C、C++、Objective等都属于编译型语言。
### 解释型语言
> 使用专门的解释器对源程序逐行解释成特定平台的机器码并立即执行。是 **`代码在执行时才被解释器一行行动态翻译成机器语言和执行`**，而不是在执行之前就完成翻译。
>
> 解释型语言每次运行都需要将源代码解释称机器码并执行，只要平台提供相应的解释器，就可以运行源代码，Python、Java、`JavaScript`等属于解释型语言。

