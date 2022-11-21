// 模版字符串 test = '`hello, ${key}`'
// context {key: 'world'}

function parse (str, context) {
    let arr = str.split('')
    let left = 0
    let right = 0
    let index = 0
    while(right < arr.length && index < arr.length) {
        if (arr[index] === '{') {
            left = index
        } else if (arr[index] === '}') {
            right = index
            const key = arr.slice(left+1, right).join('')
            arr = arr.slice(0, left - 1).concat(context[key], arr.slice(right+1))
        }
        index++
    }
    return arr.join('')
}
const test = '`hello, ${key}`'
const context = {
    key: 'world'
}

console.log(parse(test, context))