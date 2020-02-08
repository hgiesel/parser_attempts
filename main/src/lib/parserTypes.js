import {
  construct,
  id,
  dropMid,
} from './parserHelper.js'

const VInt = function(value) {
  this.value = value
}

export const matchInt = construct(
  VInt,
  i => i === 'int',
  id,
)

////

const VAddOp = function(val1, val2) {
  this.operand1 = val1
  this.operand2 = val2
}

export const matchAddOp = construct(
  VAddOp,
  (op1, addop, op2) => (op1 instanceof VInt && addop === '+' && op2 instanceof VInt),
  dropMid,
)

////

const VMultOp = function(val1, val2) {
  this.operand1 = val1
  this.operand2 = val2
}

export const matchMultOp = construct(
  VMultOp,
  (op1, addop, op2) => (op1 instanceof VInt && addop === '*' && op2 instanceof VInt),
  dropMid,
)
