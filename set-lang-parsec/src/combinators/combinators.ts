import {
  Maybe,
  Parsec,
  State,
  Reply,
  unReply11,
  unReply12,

  isSuccessful,
  hasConsumed,
  failWithMsg,
  successWithVal,
} from '../parserTypes'

import {
  pureParsec,
  bindParsec,
  thenParsec,
} from '../parserMonad'

export const choice = <S,U,A>(...prs: Parsec<S,U,A>[]) => (state: State<S,U>): Reply<S,U,A> => {
  let reply: Reply<S,U,A> = failWithMsg(state, true, `Unexpected Token`)

  for (const pr of prs) {
    reply = pr(state)

    if (isSuccessful(reply) || hasConsumed(reply)) {
      break
    }
  }

  const cmatch: (r: Reply<S,U,A>) => Reply<S,U,A> = unReply11(
    (s, v) => successWithVal(s, hasConsumed(reply), v),
    (_e) => failWithMsg(state, hasConsumed(reply), 'Unexpected input'),
  )

  return cmatch(reply)
}

export const optional = <S,U,A>(pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,null> => {
  const reply = pr(state)

  const cmatch: (r: Reply<S,U,A>) => Reply<S,U,null> = unReply12(
    (s, _v) => successWithVal(s, hasConsumed(reply), null),
    (_e) => failWithMsg(state, true, 'Unexpected input'),
    (_e) => successWithVal(state, false, null),
  )

  return cmatch(reply)
}

export const option = <S,U,A>(x: A) => (pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,A> => {
  const reply = pr(state)

  const cmatch: (r: Reply<S,U,A>) => Reply<S,U,A> = unReply12(
    (_s, _v) => reply,
    (_e) => failWithMsg(state, true, 'Unexpected input'),
    (_e) => successWithVal(state, false, x),
  )

  return cmatch(reply)
}

export const optionMaybe = <S,U,A>(pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,Maybe<A>> => {
  const reply = pr(state)

  const cmatch: (r: Reply<S,U,A>) => Reply<S,U,Maybe<A>> = unReply12(
    (s, v) => successWithVal(s, hasConsumed(reply), v),
    (_e) => failWithMsg(state, true, 'Unexpected input'),
    (_e) => successWithVal(state, false, null) as Reply<S,U,Maybe<A>>,
  )

  return cmatch(reply)
}

export const count = <S,U,A>(i: number) => (pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,A[]> => {
  const result = []

  let lastState = state
  let reply = pr(lastState)

  // i must be an integer
  for (let j = 0; j <= i && isSuccessful(reply); j++) {
    result.push(reply.value)

    lastState = reply.state
    reply = pr(lastState)
  }

  return isSuccessful(reply)
    ? successWithVal(lastState, true, result)
    : failWithMsg(state, true, `Could not match ${i} times`)
}

export const between = <S,U,A,Open,Close>(open: Parsec<S,U,Open>, close: Parsec<S,U,Close>, pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,A> => {
  const modPr = thenParsec(open, bindParsec(pr, val => thenParsec(close, pureParsec(val))))
  const result = modPr(state)
  return result
}


//// convenient exports

import {
  many,
  many1,
  skipMany,
  skipMany1,
} from './many'

export {
  many,
  many1,
  skipMany,
  skipMany1,
}

import {
  sepBy,
  sepBy1,
  // endBy,
  // endBy1,
  // sepEndBy,
  // sepEndBy1,
} from './sepAndEnd'

export {
  sepBy,
  sepBy1,
  // endBy,
  // endBy1,
  // sepEndBy,
  // sepEndBy1,
}
