import {
  SetStack,
} from './setStack.js'

import {
  lookupAction,
} from './setTables.js'

export const parse = function(tokens) {
  const ss = new SetStack()
  const output = []
  let tokenIdx = 0

  while (!ss.accepted()) {
    const action = lookupAction(tokens[tokenIdx], ss.peek())
    const progress = action(output, ss, tokens, tokenIdx)

    if (progress) {
      tokenIdx++
    }
  }

  return output
}


// if (r) {
//   const [
//     redux,
//     reduxLength,
//   ] = r

//   workstack.splice(-reduxLength)
//   workstack.push(redux)
//   debugger
// }
