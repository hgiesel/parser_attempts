import {
  gen,
} from './generatorToken.js'

export const choice = (...prs) => (str) => {
  for (const pr of prs) {
    const result = pr(str)

    if (result) {
      return gen(result.token, result.text)
    }
  }

  return null
}

export const many1 = pr => (str) => {
  const result = []
  let tentativeStr = str
  let tentativeResult = null

  do {
    tentativeResult = pr(tentativeStr)

    if (tentativeResult) {
      if (tentativeResult.token) {
        result.push(tentativeResult.token)
      }

      tentativeStr = tentativeResult.text
    }
  } while (tentativeResult)

  return gen(
    result,
    tentativeStr,
  )
}

