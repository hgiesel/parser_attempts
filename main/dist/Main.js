(function () {
  'use strict';

  const GeneratorToken = function(token, text) {
    this.token = token;
    this.text = text;
  };

  const gen = (token, text) => new GeneratorToken(
    token,
    text,
  );

  const choice = (...prs) => (str) => {
    for (const pr of prs) {
      const result = pr(str);

      if (result) {
        return gen(result.token, result.text)
      }
    }

    return null
  };

  const many1 = pr => (str) => {
    const result = [];
    let tentativeStr = str;
    let tentativeResult = null;

    do {
      tentativeResult = pr(tentativeStr);

      if (tentativeResult) {
        if (tentativeResult.token) {
          result.push(tentativeResult.token);
        }

        tentativeStr = tentativeResult.text;
      }
    } while (tentativeResult)

    return gen(
      result,
      tentativeStr,
    )
  };

  const simpleToken = (name, regex) => (str) => {
    const m = regex.exec(str);

    if (m) {
      return gen({
        type: name,
      }, str.substr(regex.lastIndex))
    }

    return null
  };

  const eof = (str) => {
    const eofRegex = /^$/gu;
    const m = eofRegex.exec(str);

    if (m) {
      return gen({
        type: 'eof',
      }, null)
    }

    return null
  };

  const space = (str) => {
    const spaceRegex = /^[ ]+/gu;
    const m = spaceRegex.exec(str);

    if (m) {
      return gen(null, str.substr(spaceRegex.lastIndex))
    }

    return null
  };

  const number = (str) => {
    const numberRe = /^\d+/gu;
    const m = numberRe.exec(str);

    if (m) {
      return gen({
        type: 'number',
        value: Number(m[0]),
      }, str.substr(numberRe.lastIndex))
    }

    return null
  };

  const add = (str) => {
    const addRe = /^\+/gu;
    const m = addRe.exec(str);

    if (m) {
      return gen({
        type: 'add',
      }, str.substr(addRe.lastIndex))
    }

    return null
  };

  const multiply = (str) => {
    const multiplyRe = /^\*/gu;
    const m = multiplyRe.exec(str);

    if (m) {
      return gen({
        type: 'multiply',
      }, str.substr(multiplyRe.lastIndex))
    }

    return null
  };

  const openParen = simpleToken('openParen', /^\(/gu);
  const closeParen = simpleToken('closeParen', /^\)/gu);

  const algLex = many1(choice(
    eof,
    space,
    add,
    multiply,
    number,
    openParen,
    closeParen,
  ));

  // const str = '$expr( 23, 500 )'

  const SetStack = function() {
    this.states = [0];
    this.acc = false;
  };

  SetStack.prototype.peek = function() {
    return this.states[this.states.length - 1]
  };

  SetStack.prototype.push = function(s) {
    return this.states.push(s)
  };

  SetStack.prototype.pop = function(n) {
    const result = [];
    for (let i = 0; i < n; i++) {
      result.push(this.states.pop());
    }

    return result
  };

  SetStack.prototype.accept = function() {
    this.acc = true;
  };

  SetStack.prototype.accepted = function() {
    return this.acc
  };

  const creator = function(cls) {
    const creat = function(...args) {
      return Object.freeze(new cls(...args))
    };

    return creat
  };

  const extractor = function(crt) {
    const extr = function(...args) {
      return crt(...args)
    };

    return extr
  };

  const construct = function(cls, arityForArgs, arityForStates) {
    const crt = creator(cls);
    const wrappedCrt = extractor(crt);

    return {
      crt: wrappedCrt,
      arity: arityForArgs,
      arityState: arityForStates
    }
  };

  const VInt = function(v) {
    this.type = 'VInt';
    this.value = Math.floor(v.value);
  };

  const createInt = construct(VInt, -1, 1);

  ////

  const VAddOp = function(val1, val2) {
    this.type = 'VAddOp';
    this.operand1 = val1;
    this.operand2 = val2;
  };

  const createAddOp = construct(VAddOp, 2, 3);

  ////

  const VMultOp = function(val1, val2) {
    this.type = 'VMultOp';
    this.operand1 = val1;
    this.operand2 = val2;
  };

  const createMultOp = construct(VMultOp, 2, 3);

  const nullop = function(n) {
    return {
      crt: () => null,
      arityState: n,
      arity: 0,
    }
  };

  const symbols = {
    e: 'e',
    f: 'f',
    g: 'g',
  };

  const eCol = [];
  eCol[0] = 3;
  eCol[5] = 6;

  const fCol = [];
  fCol[0] = 2;
  fCol[5] = 2;
  fCol[7] = 10;

  const gCol = [];
  gCol[0] = 1;
  gCol[5] = 1;
  gCol[7] = 1;
  gCol[8] = 9;

  const gotoTable = {
    e: eCol,
    f: fCol,
    g: gCol,
  };

  const lookupGoto = function(
    symbol,
    state /* number */,
  ) {
    return gotoTable[symbol][state]
  };

  const shifter = function(newState) {
    const action = function(_output, ss) {
      ss.push(newState);

      return true
    };

    return action
  };

  const accept = function(_output, ss) {
    ss.accept();
  };

  const reducer = function(constr, symbol) {
    const action = function(output, ss, tokens, tokenIdx) {
      const op = constr.arity > 0
      // consumes output tokens
        ? Array(constr.arity).fill().map(() => output.pop())
      // uses lookbehind tokens
        : tokens.slice(tokenIdx + constr.arity, tokenIdx);

      const result = constr.crt(...op);
      if (result) {
        output.push(result);
      }

      ss.pop(constr.arityState);
      ss.push(lookupGoto(symbol, ss.peek()));

      return false
    };

    return action
  };

  const eof$1 = [];
  eof$1[1] = reducer(nullop(1), symbols.f);
  eof$1[2] = reducer(nullop(1), symbols.e);
  eof$1[3] = accept;
  eof$1[4] = reducer(createInt, symbols.g);
  eof$1[9] = reducer(createMultOp, symbols.f);
  eof$1[10] = reducer(createAddOp, symbols.e);
  eof$1[11] = reducer(nullop(3), symbols.g);

  const closeParen$1 = [];
  closeParen$1[1] = reducer(nullop(1), symbols.f);
  closeParen$1[2] = reducer(nullop(1), symbols.e);
  closeParen$1[4] = reducer(createInt, symbols.g);
  closeParen$1[6] = shifter(11);
  closeParen$1[9] = reducer(createMultOp, symbols.f);
  closeParen$1[10] = reducer(createAddOp, symbols.e);
  closeParen$1[11] = reducer(nullop(3), symbols.g);

  const openParen$1 = [];
  openParen$1[0] = shifter(5);
  openParen$1[5] = shifter(5);
  openParen$1[7] = shifter(5);
  openParen$1[8] = shifter(5);

  const int = [];
  int[0] = shifter(4);
  int[5] = shifter(4);
  int[7] = shifter(4);
  int[8] = shifter(4);

  const multOp = [];
  multOp[1] = reducer(nullop(1), symbols.f);
  multOp[2] = shifter(8);
  multOp[4] = reducer(createInt, symbols.g);
  multOp[9] = reducer(createMultOp, symbols.f);
  multOp[10] = shifter(8);
  multOp[11] = reducer(nullop(3), symbols.g);

  const addOp = [];
  addOp[1] = reducer(nullop(1), symbols.f);
  addOp[2] = reducer(nullop(1), symbols.e);
  addOp[3] = shifter(7);
  addOp[4] = reducer(createInt, symbols.e);
  addOp[6] = shifter(7);
  addOp[9] = reducer(createMultOp, symbols.f);
  addOp[10] = reducer(createAddOp, symbols.e);
  addOp[11] = reducer(nullop(3), symbols.g);

  const actionTable = {
    'number': int,
    'multiply': multOp,
    'add': addOp,
    'openParen': openParen$1,
    'closeParen': closeParen$1,
    'eof': eof$1,
  };

  const lookupAction = function(
    token,
    state /* number */,
  ) {
    const result = actionTable[token.type][state];

    if (!result) {
      console.info(`Action ${token.type} + ${state} does not exist`);
    }
    else {
      console.info(`Next Action: ${token.type} + ${state}`);
    }

    return result
  };

  const parse = function(tokens) {
    const ss = new SetStack();
    const output = [];
    let tokenIdx = 0;

    while (!ss.accepted()) {
      const action = lookupAction(tokens[tokenIdx], ss.peek());
      const progress = action(output, ss, tokens, tokenIdx);

      if (progress) {
        tokenIdx++;
      }
    }

    console.log('outp', output);
    return output
  };

  const execAst = function(ast) {
    if (ast instanceof VInt) {
      return ast.value
    }
    else if (ast instanceof VAddOp) {
      return execAst(ast.operand1) + execAst(ast.operand2)
    }
    else if (ast instanceof VMultOp) {
      return execAst(ast.operand1) * execAst(ast.operand2)
    }

    return null
  };

  const execute = function(ast) {
    console.log('meh', ast);
    return ast.map(execAst)
  };

  const mainLex = function(
    input = '23 + 38 * 99',
  ) {
    return algLex(input)
  };

  const mainParse = function(
    input,
  ) {
    return parse(input)
  };

  const mainExec = function(
    input,
  ) {
    return execute(input)
  };

  window.mainLex = mainLex;
  window.mainParse = mainParse;
  window.mainExec = mainExec;

}());
