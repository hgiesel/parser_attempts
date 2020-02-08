export const symbols = {
  e: 'e',
  f: 'f',
  g: 'g',
}

const eCol = []
eCol[0] = 3
eCol[5] = 6

const fCol = []
fCol[0] = 2
fCol[5] = 2
fCol[7] = 10

const gCol = []
gCol[0] = 1
gCol[5] = 1
gCol[7] = 1
gCol[8] = 9

const gotoTable = {
  e: eCol,
  f: fCol,
  g: gCol,
}

export const lookupGoto = function(
  symbol,
  state /* number */,
) {
  return gotoTable[symbol][state]
}
