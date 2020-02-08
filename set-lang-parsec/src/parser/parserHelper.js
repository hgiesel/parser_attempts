const creator = function(cls) {
  const creat = function(...args) {
    return Object.freeze(new cls(...args))
  }

  return creat
}

const extractor = function(crt) {
  const extr = function(...args) {
    return crt(...args)
  }

  return extr
}

export const construct = function(cls, arityForArgs, arityForStates) {
  const crt = creator(cls)
  const wrappedCrt = extractor(crt)

  return {
    crt: wrappedCrt,
    arity: arityForArgs,
    arityState: arityForStates
  }
}

export const id = (...xs) => xs
export const dropMid = (x1, x2, x3) => [x1, x3]
