// Fun([2,3,4,5,1], 4, 10)  3+2+5 = 10     3：个数 10：结果

function Fun(arr, length, sum) {
    if (arr.length < length) return -1
    if (arr.length === 1) {
        if (arr[0] === sum) {
            return arr
        } else {
            return []
        }
    }
    for(var i = 0; i < arr.length; i++) {
        const arr1 = arr.slice(0,i).concat(arr.slice(i+1, arr.length))
        const res = Fun(arr1, length - 1, sum - arr[i])
        if (Array.isArray(res) && res.length !== 0) {
            const result = [arr[i]].concat(res)
            return result
        }
    }
    return []
}

console.log(Fun([2,3,4,5,1], 3, 6))