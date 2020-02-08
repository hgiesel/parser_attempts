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
