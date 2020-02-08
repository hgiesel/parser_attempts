import {
  construct,
} from './parserHelper.js'

export const VInt = function(v) {
  this.type = 'VInt'
  this.value = Math.floor(v.value)
}

export const createInt = construct(VInt, -1, 1)

////

export const VAddOp = function(val1, val2) {
  this.type = 'VAddOp'
  this.operand1 = val1
  this.operand2 = val2
}

export const createAddOp = construct(VAddOp, 2, 3)

////

export const VMultOp = function(val1, val2) {
  this.type = 'VMultOp'
  this.operand1 = val1
  this.operand2 = val2
}

export const createMultOp = construct(VMultOp, 2, 3)

export const nullop = function(n) {
  return {
    crt: () => null,
    arityState: n,
    arity: 0,
  }
}
