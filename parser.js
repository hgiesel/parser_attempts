/*
expr ∷= term
expr ∷= expr '+' term

// term ∷= term2
// term ∷= term '*' term2

term2 ∷= 'int'
// term2 ∷=  '(' expr ')'
*/

const VAddOp = function(val1, val2) {
  this.operand1 = val1
  this.operand2 = val2
}

const createAddOp = function(operand1, operand2) {
  return Object.freeze(new VAddOp(operand1, operand2))
}

const VInt = function(value) {
  this.value = value
}

const createInt = function(value) {
  return Object.freeze(new VInt(value))
}


const takeFromEnd = function(arr, n) {
  return arr.slice(-n)
}

const matchAddOp = function(op1, addOp, op2) {
  return op1 instanceof VInt
    && addOp === '+'
    && op2 instanceof VInt
    ? createAddOp(op1, op2)
    : null

}

const matchInt = function(int) {
  return int === 'int'
    ? createInt(1)
    : null
}

const theMatchers = {
  0: [],
  1: [matchInt],
  2: [],
  3: [matchAddOp],
}

const retrieveMatchersOfLength = function(n) {
  return theMatchers[n]
}

const matchInput = function(ws) {
  for (let i = 1; i <= ws.length; i++) {
    const matchers = retrieveMatchersOfLength(i)

    for (m of matchers) {
      const result = m(...takeFromEnd(ws, i))

      if (result) {
        return [result, i]
      }
    }
  }

  return null
}

const main = function(tokens) {
  const innerTokens = [...tokens]
  const workstack = []

  while (tokens.length > 0 || workstack.length > 1) {
    if (tokens.length > 0) {
      workstack.push(tokens.shift())
    }

    const r = matchInput(workstack)

    if (r) {
      const [
        redux,
        reduxLength,
      ] = r

      workstack.splice(-reduxLength)
      workstack.push(redux)
      console.log(workstack)
    }
  }
}

const tokens = ["int", "+", "int"]
main(tokens)
