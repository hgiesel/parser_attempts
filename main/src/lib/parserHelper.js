const creator = function(cls) {
  const creat = function(...args) {
    return Object.freeze(new cls(...args))
  }

  return creat
}

const matcher = function(pred, crt, extract) {
  const mat = function(...args) {
    if (pred(...args)) {
      return crt(...extract(...args))
    }

    return null
  }

  return mat
}

export const construct = function(cls, pred, extract) {
  const crt = creator(cls)
  const mtch = matcher(pred, crt, extract)

  return mtch
}

export const id = (...xs) => xs
export const dropMid = (x1, x2, x3) => [x1, x3]

