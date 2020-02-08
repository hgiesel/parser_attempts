const log = console.log

function AType(v, w) {
  this.v = v
  this.w = w
}

const a = new AType(2, 3)

const t = AType

log(new t(3, 2))
