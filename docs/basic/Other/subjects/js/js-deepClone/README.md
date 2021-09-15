---
title: 如何深浅拷贝数组
tags: 
  - JavaScript
date: 2018-03-06
sidebarDepth: 5
---
## 浅拷贝数组
首先第一个复制数组我们都想到的是定义一个数组直接相等就可以了：
```javascript
  var arr1 = [1,2,3];
  var arr2 = arr1;
  arr1[0] = 2;
  console.log(arr1[0]);  //2
```
出现这个的原因就是因为，数组是用堆去保存的，栈中保存的是真正存储数据的内存地址，相等的时候只是拷贝了存放内存地址的栈，两个栈还是同时指向了同一个内存地址，所以在改变其中一个的值，其他的也跟着改变了，这就是所谓的浅拷贝。

**所以如何深拷贝一个数组呢？**

## 深拷贝数组
### 1.使用数组遍历赋值
#### 原理
这个是最原始的办法，就是把每个值取出来到另一个数组中。
#### 代码实现
```javascript
  var arr1 = [1,2,3];
  var arr2 = [];
  arr1.forEach(function(value,index){
    arr2[index] = value;
  }) 
  console.log(arr2);
//这个时候改变arr1[0]  = 3;那么输出arr2[0]还是等于1

```
### 2. 返回新数组方法
#### 2.1 使用slice方法
##### 原理
数组的slice方法是截取数组的意思，在之前的数组总结中也有提过。
slice(0)指的是从0开始到末尾截取数组，然后返回一个新的数组，这样就不会影响到原来的数组了。
##### 代码实现
```javascript
  var arr1 = [1,2,3];
  var arr2 = arr1.slice(0);
  console.log(arr2); //[1,2,3]
//这个时候改变arr1[2] = 5,那么输出arr2[2]还是等于3
```

**顺着这种方法是不是得到了思维的开阔，来看看还有哪些是返回新数组的？**
#### 2.2使用数组map方法
使用map方法遍历数组然后返回新的数组，里面的值不变
```javascript
  var arr1 = [2,3,4];
  var arr2 = arr1.map(function(value){
    return value;  
  })
  console.log(arr2);  //[2,3,4]
```
#### 2.3使用concat方法
连接数组，如果连接的是一个空，那么也是返回了新的本身的数组
```javascript  
  var arr1 = [3,4,5];
  var arr2 = arr1.concat();
  console.log(arr2);   //[3,4,5]
```

### 3.ES6语法实现深拷贝
ES6扩展运算符实现数组的深拷贝，目前是最简单的。
```javascript
  var arr = [1,2,3,4,5];
  var [ ... arr2 ] = arr;
  console.log(arr); //[1,2,3,4,5]
  console.log(arr2); //[1,2,3,4,5]
```
### 4.for-in连原型链也一并复制的方法
这种办法，不仅复制的值，还会把属性也进行拷贝。
```javascript
var arr = [1,2,3,4,5];
arr.prototype = 5;
var arr2 = [];
for(var a in arr){
  arr2[a] = arr[a];
}
console.log(arr2); // [1,2,3,4,5]
console.log(arr2.prototype); // 5
//之前的方法中新数组的prototype都是undefined

```

### 5.多维数组的复制
#### 原理
多维数组转化为字符串会成为一维数组。
```javascript
  var arr = [[1,2],3,4,[5,6]];
  var arr1 = arr.toString().split(",")
  var arr2 = arr.join().split(",")
  console.log(arr1) //[1,2,3,4,5,6]
  console.log(arr2) //[1,2,3,4,5,6]
```
但是怎么可以保持那种二维数组的状态呢？需要下面的代码
#### 代码实现
```javascript
  var arr = [[1,2],3,4,[5,6]];
  var arr3 = JSON.parse(JSON.stringify(arr));  
  console.log(arr3) // [[1,2],3,4,[5,6]]
```

