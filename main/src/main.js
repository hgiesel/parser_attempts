import {
  algLex,
} from './lexer/lexer.js'

import {
  parse,
} from './parser/parser.js'

import {
  execute,
} from './execute/execute.js'

const mainLex = function(
  input = '23 + 38 * 99',
) {
  return algLex(input)
}

const mainParse = function(
  input,
) {
  return parse(input)
}

const mainExec = function(
  input,
) {
  return execute(input)
}

window.mainLex = mainLex
window.mainParse = mainParse
window.mainExec = mainExec
