import {
  choice,
  many1,
} from './lexerCombinator.js'

import {
  number,
  add,
  multiply,
  openParen,
  closeParen,
  space,
  eof,
} from './lexerTokens.js'

export const algLex = many1(choice(
  eof,
  space,
  add,
  multiply,
  number,
  openParen,
  closeParen,
))

// const str = '$expr( 23, 500 )'
