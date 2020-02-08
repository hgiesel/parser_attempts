import {
  State,
  Parsec,
  Reply,
  ReplySuccess,

  isSuccessful,
  hasConsumed,
  successWithVal,
} from './parserTypes'

import {
  constant,
} from './parserHelper'

export const fmapParsec = <S,U,A,B>(f: (a0: A) => B, p: Parsec<S,U,A>): Parsec<S,U,B> => {
  const mapped = (state: State<S,U>): Reply<S,U,B> => {
    const reply = p(state)


    if (isSuccessful(reply)) {
      return successWithVal(reply.state, hasConsumed(reply), f(reply.value))
    }

    return reply
  }

  return mapped
}

export const joinParsec = <S,U,A>(pr: Parsec<S,U,Parsec<S,U,A>>): Parsec<S,U,A> => (state: State<S,U>): Reply<S,U,A> => {
  const firstPass = pr(state)

  if (isSuccessful(firstPass)) {
    return firstPass.value(firstPass.state)
  }

  return firstPass
}

export const pureParsec = <S,U,A>(x: A) => (s: State<S,U>): ReplySuccess<S,U,A> => {
  return successWithVal(s, false /* false */, x)
}

export const thenParsec = <S,U,A,B>(pr: Parsec<S,U,A>, qr: Parsec<S,U,B>): Parsec<S,U,B> => {
  return bindParsec(pr, constant(qr))
}

export const bindParsec = <S,U,A,B>(pr: Parsec<S,U,A>, fx: (a0: A) => Parsec<S,U,B>): Parsec<S,U,B> => {
  // extra step is necessary for type checking
  const mapped: Parsec<S,U,Parsec<S,U,B>> = fmapParsec(fx, pr)

  return joinParsec(mapped)
}
