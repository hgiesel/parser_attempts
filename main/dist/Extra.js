const getText = function() {
  return document
    .querySelector('textarea#sr-test')
    .value
}

const setMessage = function(txt) {
  document
    .querySelector('#sr-output')
    .innerHTML = JSON.stringify(txt, null, '\t')
      .replace(/ /gu, '&nbsp;')
      .replace(/\n/gu, '<br/>')
}

const testLex = function(mouseEvent) {
  const lexed = mainLex(getText())

  setMessage(lexed)
}

const testParse = function(mouseEvent) {
  const lexed = mainLex(getText())
  const parsed = mainParse(lexed.token)

  setMessage(parsed)
}

const testExec = function(mouseEvent) {
  const lexed = mainLex(getText())
  const parsed = mainParse(lexed.token)
  const execed = mainExec(parsed)

  setMessage(execed)
}

document.querySelector('#btn-lex')
  .addEventListener('click', testLex)

document.querySelector('#btn-parse')
  .addEventListener('click', testParse)

document.querySelector('#btn-exec')
  .addEventListener('click', testExec)
