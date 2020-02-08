import {
  Parsec,
  ParseError,
  Reply,

  isSuccessful,
} from './parserTypes'

export const runParsec = <S,U,A>(
    parser: Parsec<S,U,A>,
    userState: U,
    sourceName: string,
    stream: S,
): Reply<S,U,A> => {
  const reply = parser({
    input: stream,
    position: {
      sourceName: sourceName,
      line: 1,
      column: 0,
    },
    userState: userState,
  })

  return reply
}

export const runParser = <S,U,A>(
    parser: Parsec<S,U,A>,
    userState: U,
    sourceName: string,
    stream: S,
): ParseError | A => {
  const reply = runParsec(parser, userState, sourceName, stream)

  return isSuccessful(reply)
    ? reply.value
    : reply.error
}
