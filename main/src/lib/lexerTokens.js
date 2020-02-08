import {
  gen,
} from './generatorToken.js'

export const spaces = (str) => {
  let m = null

  if (m = str.match(/^[ ]+/u)) {
    return gen(null, str.substr(m[0]))
  }

  return gen(null, str)
}

export const number = (str) => {
  const numberRe = /^\d+/u
  const m = numberRe.exec(str)

  return gen(
    numberRe
    ? {
      type: 'number',
      value: Integer(m[0]),
    }
    : null,
    str.substr(numberRe.lastIndex),
  )
}

export const add = (str) => {
  const addRe = /^\+/u
  const m = addRe.exec(str)

  return gen(
    addRe
    ? {
      type: 'add',
    }
    : null,
    str.substr(addRe.lastIndex),
  )
}

export const multiply = (str) => {
  const multiplyRe = /^\d+/u
  const m = multiplyRe.exec(str)

  return gen(
    multiplyRe
    ? {
      type: 'multiply',
    }
    : null,
    str.substr(multiplyRe.lastIndex),
  )
}

// const dollarWord = (str) => {
//   const dollarWordRe = /^\$(\w*)/g
//   const m = dollarWordRe.exec(str)

//   return gen(
//     dollarWordRe
//     ? {
//       type: 'dollarWorld',
//       value: m[1],
//     }
//     : null,
//     str.substr(dollarWordRe.lastIndex),
//   )
// }
