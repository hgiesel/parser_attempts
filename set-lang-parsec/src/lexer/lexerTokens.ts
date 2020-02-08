import {
  Reply,
  State,

  successWithVal,
  setSourcePos,
  failWithMsg,
} from '../parserTypes'

import {
  constant,
} from '../parserHelper'

import {
  skipMany,
} from '../combinators/combinators'

enum TokenType {
  EOF = 'eof',
  Add = 'add',
  Mult = 'mult',
  OpenParen = 'openParen',
  CloseParen = 'closeParen',
  For = 'for',
  While = 'while',
  Whitespace = 'whiteSpace',
  Identifier = 'identifier',
}

interface Token {
  kind: TokenType
}

const mkToken = (tt: TokenType) => ({
  kind: tt,
})

const mkTokenWithValue = <A>(tt: TokenType, val: A) => ({
  kind: tt,
  value: val,
})

const regexp = (text: string) => new RegExp(text, 'yu')

export const simpleRegexToken = <U,A>(conv: (r: RegExpExecArray) => A , pattern: RegExp) => (state: State<string,U>): Reply<string,U,A> => {
  pattern.lastIndex = state.position.column
  const m = pattern.exec(state.input)

  return m
    ? successWithVal(setSourcePos(state, pattern.lastIndex), true, conv(m))
    : failWithMsg(state, false, `Could not fulfill regular expression: ${pattern}`)
}

export const space = simpleRegexToken(constant(mkToken(TokenType.Whitespace)), /(?: )/yu)
export const spaces = simpleRegexToken(constant(mkToken(TokenType.Whitespace)), /(?: )+/yu)
export const ws = simpleRegexToken(constant(null), /(?: )+/yu)

export const letter = simpleRegexToken(val => (mkTokenWithValue(TokenType.Identifier, val[1])), /([a-zA-Z])/yu)
export const letters = simpleRegexToken(val => (mkTokenWithValue(TokenType.Identifier, val[1])), /([a-zA-Z]+)/yu)

export const eof = simpleRegexToken(constant(mkToken(TokenType.EOF)), /$/yu)

const simpleStringToken = <U>(tt: TokenType | null, pattern: string) => (state: State<string,U>): Reply<string, U, Token | null> => {
  const b = state.input
    .substring(state.position.column)
    .startsWith(pattern)

  return b
    ? successWithVal(setSourcePos(state, state.position.column + pattern.length), true, tt ? mkToken(tt) : null)
    : failWithMsg(state, false, `Could not fulfill regular expression: ${pattern}`)
}

export const add = simpleStringToken(TokenType.Add, '+')
export const multiply = simpleStringToken(TokenType.Mult, '*')

export const comma = simpleStringToken(TokenType.Mult, ',')

export const openParen = simpleStringToken(TokenType.OpenParen, '(')
export const closeParen = simpleStringToken(TokenType.CloseParen, ')')

export const forKw = simpleStringToken(TokenType.For, 'for')
export const whileKw = simpleStringToken(TokenType.While, 'while')

/* export const number = (str) => { */
/*   const numberRe = /^\d+/gu */
/*   const m = numberRe.exec(str) */

/*   if (m) { */
/*     return gen({ */
/*       type: 'number', */
/*       value: Number(m[0]), */
/*     }, str.substr(numberRe.lastIndex)) */
/*   } */

/*   return null */
/* } */
