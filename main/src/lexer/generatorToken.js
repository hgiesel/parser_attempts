const GeneratorToken = function(token, text) {
  this.token = token
  this.text = text
}

export const gen = (token, text) => new GeneratorToken(
  token,
  text,
)
