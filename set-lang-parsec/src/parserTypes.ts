export type Maybe<T> = T | null

type SourceName = string
type Line = number
type Column = number

interface SourcePos {
  readonly sourceName: SourceName
  line: Line
  column: Column
}

export interface ParseError {
  message: string[],
  errorPosition: SourcePos,
}

export interface State<S,U> {
  readonly input: S,
  position: SourcePos
  userState: U,
}

export enum ReplyStatus {
  OK,
  Error,
}

export enum ConsumeStatus {
  Consumed,
  Empty,
}

export interface ReplySuccess<S,U,A> {
  kind: ReplyStatus.OK,
  consumed: ConsumeStatus,
  state: State<S,U>
  value: A,
}

export interface ReplyError {
  kind: ReplyStatus.Error,
  consumed: ConsumeStatus,
  error: ParseError,
}

export type Reply<S,U,A> = ReplySuccess<S,U,A> | ReplyError

export interface Parsec<S,U,A> {
  (s: State<S,U>): Reply<S,U,A>
}

export const unReply = <S,U,A,B>(
  cok: (s: State<S,U>, a: A) => B,
  eok: (s: State<S,U>, a: A) => B,
  cerr: (err: ParseError) => B,
  eerr: (err: ParseError) => B,
): (r: Reply<S,U,A>) => B => (
  reply: Reply<S,U,A>,
): B => {
  if (isSuccessful(reply)) {
    if (hasConsumed(reply)) {
      return cok(reply.state, reply.value)
    }

    return eok(reply.state, reply.value)
  }

  if (hasConsumed(reply)) {
    return cerr(reply.error)
  }

  return eerr(reply.error)
}

export const unReply11 = <S,U,A,B>(
  ok: (s: State<S,U>, a: A) => B,
  err: (err: ParseError) => B,
) => (
  reply: Reply<S,U,A>,
): B => unReply(ok, ok, err, err)(reply)

export const unReply21 = <S,U,A,B>(
  cok: (s: State<S,U>, a: A) => B,
  eok: (s: State<S,U>, a: A) => B,
  err: (err: ParseError) => B,
) => (
  reply: Reply<S,U,A>,
): B => unReply(cok, eok, err, err)(reply)

export const unReply12 = <S,U,A,B>(
  ok: (s: State<S,U>, a: A) => B,
  cerr: (err: ParseError) => B,
  eerr: (err: ParseError) => B,
) => (
  reply: Reply<S,U,A>,
): B => unReply(ok, ok, cerr, eerr)(reply)

export const isSuccessful = <S,U,A>(reply: Reply<S,U,A>): reply is ReplySuccess<S,U,A> => {
  return reply.kind === ReplyStatus.OK
}

export const hasConsumed = <S,U,A>(reply: Reply<S,U,A>): boolean => {
  return reply.consumed === ConsumeStatus.Consumed
}

const boolToConsumed = (b: boolean): ConsumeStatus => b
  ? ConsumeStatus.Consumed
  : ConsumeStatus.Empty

export const setSourcePos = <S,U>(state: State<S,U>, i: number): State<S,U> => {
  const newState = state
  newState.position.column = i

  return newState
}

export const successWithVal = <S,U,A>(state: State<S,U>, consumed: boolean, value: A): ReplySuccess<S,U,A> => ({
  kind: ReplyStatus.OK,
  consumed: boolToConsumed(consumed),
  state: state,
  value: value,
})

export const failWithMsg = <S,U,A>(oldState: State<S,U>, consumed: boolean, msg: string): Reply<S,U,A> => ({
  kind: ReplyStatus.Error,
  consumed: boolToConsumed(consumed),
  error: {
    message: [msg],
    errorPosition: oldState.position,
  }
})
