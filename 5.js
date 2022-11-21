// 给定两个数组，写一个方法计算两数组补集升叙数组
// 例如 ary1 = [5, 8, [1, 6], 2, 10] ary2 = [10, 9, 1, [2, 17], 3]
// result = [3, 5, 6, 8, 9, 17]
// function fun(arr1, arr2) {
//     // [5, 8, 1, 6, 2, 10]
//     const array1 = arr1.flat()
//     // [10, 9, 1, 2, 17, 3]
//     const array2 = arr2.flat()
//     // 交集
//     // [1,2,10]
//     const res = array1.filter(item => array2.includes(item))
//     // [5, 8, 6]
//     const res1 = array1.filter(item => !res.includes(item))
//     // [9, 17, 3]
//     const res2 = array2.filter(item => !res.includes(item))
//     const result = res1.concat(res2)
//     // 排序
//     result.sort((a,b) => a - b)
//     return result
// }

// console.log(fun([5, 8, [1, 6], 2, 10], [10, 9, 1, [2, 17], 3]))

// 输入n = 234 
// 输出：15 
// 解释：各位数之积：2 * 3 * 4 = 24；
// 各位数之和： 2 + 3 + 4 = 9； 结果： 24 - 9 = 15； 提示： -1 <= n <= 10^5

function fun(num) {
    let sum = 0
    let c = 1
    while(num > 0) {
        const number = num % 10
        sum+=number
        c*=number
        num = Math.floor(num / 10)
    }
    return c - sum
}

console.log(fun(234))

/*
输入：二叉树的根节点
输出：按顺序输出二叉树中的各节点，顺序规定如下：按照每层从左到右输出
样例：

     1
  2    3
4  5  6  7

1 2 3 4 5 6 7
*/

interface Node {
    left: Node;
    right: Node;
    value: any;
  }
  
  function iterate(root: Node) {
    const queue = []
    queue.push(root)
    while(queue.length) {
      const curr = queue.shift()
      console.log(curr.value)
      if(curr.left !== null) queue.push(curr.left)
      if(curr.right !== null) queue.push(curr.right)
    }
  }
  
  
  /*
  输入：一个数字数组
  输出：数组中第二大的数
  */
  
  function maxNum(arr) {
    let max = -Infinity
    let sec = max
    for(let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i]
        sec = max
      } else if (arr[i] > sec) {
        sec = arr[i]
      }
    }
    return sec
  }