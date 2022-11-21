const str = 'adfafwefffdasdcx'

function maxLen(str) {
    if (str === '') return 0
    const arr = str.split('')
    let max = 1
    let result = 1
    let left = 0
    let right = 1
    while(right < arr.length) {
        const res = arr.slice(left, right)
        if (!res.includes(arr[right])) {
            right++
            result++
            max = max > result ? max : result
        } else {
            const index = res.findIndex(item => item === arr[right])
            left = left + index + 1
            result = right - left + 1
            right++
        }
    }
    return max
}

console.log(maxLen(str))