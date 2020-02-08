import {
  State,
  Reply,
  Parsec,
} from '../parserTypes'

import {
  choice,
} from './combinators'

import {
  many,
} from './many'

import {
  bindParsec,
  thenParsec,
  pureParsec,
} from '../parserMonad'

export const sepBy = <S,U,A,P>(pr: Parsec<S,U,A>, sep: Parsec<S,U,P>) => (state: State<S,U>): Reply<S,U,A[]> => {
  // console.log(state)
  const modPr = choice(sepBy1(pr, sep), pureParsec([]))

  const result = modPr(state)
  // console.log(result.value)

  return result
}

export const sepBy1 = <S,U,A,P>(pr: Parsec<S,U,A>, sep: Parsec<S,U,P>) => (state: State<S,U>): Reply<S,U,A[]> => {
  const modPr = bindParsec(pr, (x: A): Parsec<S,U,A[]> =>
    bindParsec(many(thenParsec(sep, pr)), (xs: A[]): Parsec<S,U,A[]> => {
      const result = [x, ...xs]
      return pureParsec(result)
    })
  )

  return modPr(state)
}

// export const endBy = <S,U,A,P>(pr: Parsec<S,U,A>) => (sep: Parsec<S,U,P>) => (state: State<S,U>): Reply<S,U,A[]> => {
//   const result: A[] = []

//   let lastState = state

//   do {
//     let reply = pr(lastState)

//     if (isSuccessful(reply)) {
//       result.push(reply.value)
//       lastState = reply.state
//     }
//     else {
//       return successWithVal(lastState, true, result)
//     }

//     lastState = reply.state
//     let sepReply = sep(lastState)

//     if (isSuccessful(sepReply)) {
//         lastState = sepReply.state
//     }
//     else {
//       return failWithMsg(lastState, true, `Unexpected end of input`)
//     }
//   } while (true)
// }

// export const endBy1 = <S,U,A,P>(pr: Parsec<S,U,A>) => (sep: Parsec<S,U,P>) => (state: State<S,U>): Reply<S,U,A[]> => {
//   const reply: Reply<S,U,A[]> = sepBy(pr)(sep)(state)

//   return isSuccessful(reply) && reply.value.length === 0
//     ? failWithMsg(state, true, `Token failed to match`)
//     : reply
// }

// export const sepEndBy = <S,U,A,P>(pr: Parsec<S,U,A>) => (sep: Parsec<S,U,P>) => (state: State<S,U>): Reply<S,U,A[]> => {
//   const result: A[] = []

//   let lastState = state

//   do {
//     let reply = pr(lastState)

//     if (isSuccessful(reply)) {
//         result.push(reply.value)
//         lastState = reply.state
//     }
//     else {
//       return successWithVal(lastState, true, result)
//     }

//     lastState = reply.state
//     let sepReply = sep(lastState)

//     if (isSuccessful(sepReply)) {
//       lastState = sepReply.state
//     }
//     else {
//       return successWithVal(lastState, true, result)
//     }

//   } while (true)
// }

// export const sepEndBy1 = <S,U,A,P>(pr: Parsec<S,U,A>) => (sep: Parsec<S,U,P>) => (state: State<S,U>): Reply<S,U,A[]> => {
//   const reply: Reply<S,U,A[]> = sepEndBy(pr)(sep)(state)

//   return isSuccessful(reply) && reply.value.length === 0
//     ? failWithMsg(state, true, `Token failed to match`)
//     : reply
// }
