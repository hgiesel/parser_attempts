import {
  VInt,
  VAddOp,
  VMultOp,
} from '../parser/parserTypes.js'

const execAst = function(ast) {
  if (ast instanceof VInt) {
    return ast.value
  }
  else if (ast instanceof VAddOp) {
    return execAst(ast.operand1) + execAst(ast.operand2)
  }
  else if (ast instanceof VMultOp) {
    return execAst(ast.operand1) * execAst(ast.operand2)
  }

  return null
}

export const execute = function(ast) {
  console.log('meh', ast)
  return ast.map(execAst)
}
