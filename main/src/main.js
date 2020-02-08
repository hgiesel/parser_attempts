import {
  parse,
} from './lib/parser.js'

import {
  algLex,
} from './lib/lexer.js'

const main = function() {
  const input = '23 + 38 * 99'

  console.log(algLex(input))
  // parse(tokens)
}

main()
