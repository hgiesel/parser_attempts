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

export const add = (str) => {
  const addRe = /^\+/gu
  const m = addRe.exec(str)

  if (m) {
    return gen({
      type: 'add',
    }, str.substr(addRe.lastIndex))
  }

  return null
}

export const multiply = (str) => {
  const multiplyRe = /^\*/gu
  const m = multiplyRe.exec(str)

  if (m) {
    return gen({
      type: 'multiply',
    }, str.substr(multiplyRe.lastIndex))
  }

  return null
}

export const openParen = simpleToken('openParen', /^\(/gu)
export const closeParen = simpleToken('closeParen', /^\)/gu)
