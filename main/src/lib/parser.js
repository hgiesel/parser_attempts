// expr ∷= term
// expr ∷= expr '+' term
// term ∷= term '*' term2

// term2 ∷= 'int'
// term2 ∷=  '(' expr ')'
//
import {
  retrieveMatchers,
} from './matchers.js'

const takeFromEnd = function(arr, n) {
  return arr.slice(-n)
}

const matchInput = function(ws) {
  for (let i = 1; i <= ws.length; i++) {
    const matchers = retrieveMatchers(0, i)

    for (const m of matchers) {
      const result = m(...takeFromEnd(ws, i))

      if (result) {
        return [result, i]
      }
    }
  }

  return null
}

export const parse = function(tokens) {
  const innerTokens = [...tokens]
  const workstack = []

  while (innerTokens.length > 0 || workstack.length > 1) {
    if (innerTokens.length > 0) {
      workstack.push(innerTokens.shift())
    }

    const r = matchInput(workstack)

    if (r) {
      const [
        redux,
        reduxLength,
      ] = r

      workstack.splice(-reduxLength)
      workstack.push(redux)
      debugger
    }
  }
}
