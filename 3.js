const spu = 'AB1234567'
const specList = [
    ["red", "yellow"],
    ["XL", "S"],
    ['a1', 'a2'],
    ['b1', 'b2'],
];
function fun(spu, specList, result = []) {
    if (specList.length === 1) {
        specList[0].forEach(item => {
            result.push(spu + '-' + item)
        })
    } else {
        specList[0].forEach(item => {
            fun(spu + '-' + item, specList.slice(1), result)
        })
    }
    return result
}
console.log(fun(spu, specList))