export const SetStack = function() {
  this.states = [0]
  this.acc = false
}

SetStack.prototype.peek = function() {
  return this.states[this.states.length - 1]
}

SetStack.prototype.push = function(s) {
  return this.states.push(s)
}

SetStack.prototype.pop = function(n) {
  const result = []
  for (let i = 0; i < n; i++) {
    result.push(this.states.pop())
  }

  return result
}

SetStack.prototype.accept = function() {
  this.acc = true
}

SetStack.prototype.accepted = function() {
  return this.acc
}

