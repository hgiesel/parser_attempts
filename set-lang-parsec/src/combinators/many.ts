import {
  Parsec,
  State,
  Reply,

  isSuccessful,
  hasConsumed,

  successWithVal,
  failWithMsg,

  unReply12,
} from '../parserTypes'

// IMPORTANT
// `many`, `skipMany`, `many1`, and `many1` do not go along
// with parsers that accept empty strings

const manyAccum = <S,U,A>(pr: Parsec<S,U,A>, lastState: State<S,U>): [A[], Reply<S,U,A>] => {
  const result: A[] = []

  let reply = pr(lastState)

  if (isSuccessful(reply) && hasConsumed(reply)) {
    let innerReply: Reply<S,U,A> = reply

    while (isSuccessful(innerReply) && hasConsumed(innerReply)) {
      reply = innerReply
      result.push(innerReply.value)

      lastState = innerReply.state
      innerReply = pr(lastState)
    }
  }


  return [result, reply]
}

export const many = <S,U,A>(pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,A[]> => {
  const [
    result,
    reply,
  ] = manyAccum(pr, state)

  const cmatch: (r: Reply<S,U,A>) => Reply<S,U,A[]> = unReply12(
    (s, _v) => successWithVal(s, hasConsumed(reply), result),
    (_e) => failWithMsg(state, true, 'Unexpected input'),
    (_e) => successWithVal(state, false, result),
  )

  return cmatch(reply)
}

export const many1 = <S,U,A>(pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,A[]> => {
  const reply = many(pr)(state)

  return isSuccessful(reply) && !hasConsumed(reply)
    ? failWithMsg(state, false, `Token failed to match`)
    : reply
}

export const skipMany = <S,U,A>(pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,null> => {
  const reply = manyAccum(pr, state)[1]

  const cmatch: (r: Reply<S,U,A>) => Reply<S,U,null> = unReply12(
    (s, _v) => successWithVal(s, hasConsumed(reply), null),
    (_e) => failWithMsg(state, true, 'Unexpected input'),
    (_e) => successWithVal(state, false, null),
  )

  return cmatch(reply)
}

export const skipMany1 = <S,U,A>(pr: Parsec<S,U,A>) => (state: State<S,U>): Reply<S,U,null> => {
  const reply = skipMany(pr)(state)

  return isSuccessful(reply) && !hasConsumed(reply)
    ? failWithMsg(state, false, `Token failed to match`)
    : reply
}
