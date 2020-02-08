import {
  choice,
} from './lexerCombinator.js'

import {
  number,
  add,
  multiply,
  spaces,
} from './lexerTokens.js'

export const algLex = choice(
  spaces,
  add,
  multiply,
  number,
)

// const str = '$expr( 23, 500 )'
