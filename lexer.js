// const parseParens(v1, v2, v3) {
//   if (
//     v1 === '(' &&
//     v2.type === 'expr' &&
//     v3 === ')'
//   ) {
//     return Term(

// const parseInt(v) {
//   if (v === 'int') {
//     return {
//       val





// const gen = (token, text) => {
//   return {
//     token: token,
//     text: text,
//   }
// }

// const spaces = (str) => {
//   let m

//   if (m = str.match(/^[ ]+/)) {
//     return gen(null, str.substr(m[0]))
//   }

//   return gen(null, str)
// }

// const number = (str) => {
//   const numberRe = /^\d+/g
//   const m = numberRe.exec(str)

//   return gen(
//     numberRe
//     ? {
//       type: 'number',
//       value: Integer(m[0]),
//     }
//     : null,
//     str.substr(numberRe.lastIndex),
//   )
// }

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

// const choice = (prs1, prs2) => (str) => {
//   const result = prs1(str)
//   if (result.token) {
//     return gen(result.token, result.text)
//   }

//   else {
//     return prs2(str)
//   }
// }

// const lex = (str) => {
//   // return number(str)
//     // ||
//   return  dollarWord(str)
// }

// const str = '$expr( 23, 500 )'
