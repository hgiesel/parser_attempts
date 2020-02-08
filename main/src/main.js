import {
  parse,
} from './lib/parser.js'

const main = function() {
  const tokens = [
    'int',
    '+',
    'int',
  ]

  parse(tokens)
}

main()
