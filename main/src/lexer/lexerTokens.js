import {
  gen,
} from './generatorToken.js'

const simpleToken = (name, regex) => (str) => {
  const m = regex.exec(str)

  if (m) {
    return gen({
      type: name,
    }, str.substr(regex.lastIndex))
  }

  return null
}

const keywordToken = (name) => simpleToken(name, new RegExp(`^${name}`, 'gu'))

export const eof = (str) => {
  const eofRegex = /^$/gu
  const m = eofRegex.exec(str)

  if (m) {
    return gen({
      type: 'eof',
    }, null)
  }

  return null
}

export const space = (str) => {
  const spaceRegex = /^[ ]+/gu
  const m = spaceRegex.exec(str)

  if (m) {
    return gen(null, str.substr(spaceRegex.lastIndex))
  }

  return null
}

export const number = (str) => {
  const numberRe = /^\d+/gu
  const m = numberRe.exec(str)

  if (m) {
    return gen({
      type: 'number',
      value: Number(m[0]),
    }, str.substr(numberRe.lastIndex))
  }

  return null
}

export const add = simpleToken('add', /^\+/gu)
export const multiply = simpleToken('multiply', /^\*/gu)

export const openParen = simpleToken('openParen', /^\(/gu)
export const closeParen = simpleToken('closeParen', /^\)/gu)

export const forKw = keywordToken('for')
