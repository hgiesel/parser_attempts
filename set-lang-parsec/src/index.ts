import {
  runParsec,
  runParser,
} from './parserRunner'

import {
  sepBy,
  optional,
  between,
  choice,
  many1,
} from './combinators/combinators'

import {
  letters,
  ws,
  openParen,
  closeParen,
} from './lexer/lexerTokens'

import {
  fmapParsec,
  thenParsec,
  bindParsec,
  pureParsec,
} from './parserMonad'


const meh = {
  inParens: null
}






const letters1 = fmapParsec(x => [x], letters)

let i = 0
Object.defineProperty(meh, 'inParens', {
  get() {
    i++

    return i > 5
      ?  letters
      : between(
        thenParsec(openParen, optional(ws)),
        thenParsec(optional(ws), closeParen),
        sepBy(choice(letters1, meh.inParens as any), ws),
      )
  }
})


console.log(runParser(
  meh.inParens as any,
  {},
  'foo.file',
  '((aaa) (xxx))'
))
