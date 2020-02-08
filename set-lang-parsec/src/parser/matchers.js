import {
  matchAddOp,
  matchMultOp,
  matchInt,
} from './parserTypes.js'

const theMatchers = {
  0: {},
  1: {
    0: [],
    1: [
      matchInt,
    ],
    2: [],
    3: [
      matchAddOp
    ],
  }
}


export const retrieveMatchers = function(s, n) {
  return theMatchers[s][n]
}

