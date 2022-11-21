const num = 100
const map = new Map()
function fib(num) {
    if (num === 1) return 1
    if (num === 2) return 2
    const result = map.get(num)
    if (result) return result
    const res = fib(num - 1) + fib(num - 2)
    map.set(num, res)
    return res
}

console.log(fib(num))