import {
  createInt,
  createAddOp,
  createMultOp,
  nullop,
} from './parserTypes.js'

import {
  symbols,
  lookupGoto,
} from './gotoTable.js'

const shifter = function(newState) {
  const action = function(_output, ss) {
    ss.push(newState)

    return true
  }

  return action
}

const accept = function(_output, ss) {
  ss.accept()
}

const reducer = function(constr, symbol) {
  const action = function(output, ss, tokens, tokenIdx) {
    const op = constr.arity > 0
    // consumes output tokens
      ? Array(constr.arity).fill().map(() => output.pop())
    // uses lookbehind tokens
      : tokens.slice(tokenIdx + constr.arity, tokenIdx)

    const result = constr.crt(...op)
    if (result) {
      output.push(result)
    }

    ss.pop(constr.arityState)
    ss.push(lookupGoto(symbol, ss.peek()))

    return false
  }

  return action
}

const eof = []
eof[1] = reducer(nullop(1), symbols.f)
eof[2] = reducer(nullop(1), symbols.e)
eof[3] = accept
eof[4] = reducer(createInt, symbols.g)
eof[9] = reducer(createMultOp, symbols.f)
eof[10] = reducer(createAddOp, symbols.e)
eof[11] = reducer(nullop(3), symbols.g)

const closeParen = []
closeParen[1] = reducer(nullop(1), symbols.f)
closeParen[2] = reducer(nullop(1), symbols.e)
closeParen[4] = reducer(createInt, symbols.g)
closeParen[6] = shifter(11)
closeParen[9] = reducer(createMultOp, symbols.f)
closeParen[10] = reducer(createAddOp, symbols.e)
closeParen[11] = reducer(nullop(3), symbols.g)

const openParen = []
openParen[0] = shifter(5)
openParen[5] = shifter(5)
openParen[7] = shifter(5)
openParen[8] = shifter(5)

const int = []
int[0] = shifter(4)
int[5] = shifter(4)
int[7] = shifter(4)
int[8] = shifter(4)

const multOp = []
multOp[1] = reducer(nullop(1), symbols.f)
multOp[2] = shifter(8)
multOp[4] = reducer(createInt, symbols.g)
multOp[9] = reducer(createMultOp, symbols.f)
multOp[10] = shifter(8)
multOp[11] = reducer(nullop(3), symbols.g)

const addOp = []
addOp[1] = reducer(nullop(1), symbols.f)
addOp[2] = reducer(nullop(1), symbols.e)
addOp[3] = shifter(7)
addOp[4] = reducer(createInt, symbols.e)
addOp[6] = shifter(7)
addOp[9] = reducer(createMultOp, symbols.f)
addOp[10] = reducer(createAddOp, symbols.e)
addOp[11] = reducer(nullop(3), symbols.g)

const actionTable = {
  'number': int,
  'multiply': multOp,
  'add': addOp,
  'openParen': openParen,
  'closeParen': closeParen,
  'eof': eof,
}

export const lookupAction = function(
  token,
  state /* number */,
) {
  const result = actionTable[token.type][state]

  if (!result) {
    console.info(`Action ${token.type} + ${state} does not exist`)
  }
  else {
    console.info(`Next Action: ${token.type} + ${state}`)
  }

  return result
}
