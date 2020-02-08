import {
  construct,

  id,
} from './parserHelper.js'

const VInt = function(value) {
  this.value = Math.floor(Math.random() * 50)
}

export const createInt = construct(VInt, -1, 1)

////

const VAddOp = function(val1, val2) {
  this.operand1 = val1
  this.operand2 = val2
}

export const createAddOp = construct(VAddOp, 2, 3)

////

const VMultOp = function(val1, val2) {
  this.operand1 = val1
  this.operand2 = val2
}

export const createMultOp = construct(VMultOp, 2, 3)

export const nullop1 = {
  extr: id,
  arityState: 1,
  arity: 0,
}

export const nullop = function(n) {
  return {
    crt: () => null,
    arityState: n,
    arity: 0,
  }
}
