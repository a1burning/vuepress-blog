// solution("This is a test") => "This is a test" 
// solution("This is another test") => "This is rehtona test"


function solution(str) {
  const arr = str.split(' ')
  for(let i = 0; i< arr.length; i++) {
     if (arr[i].length >= 5) {
       const res = arr[i].split('')
       let left = 0
       let right = res.length - 1
       while(left < right) {
         [res[left], res[right]] = [res[right], res[left]]
         left++
         right--
       }
       arr[i] = res.join('')
     }
  }
  return arr.join(' ')
}

console.log(solution("This is  another test"))