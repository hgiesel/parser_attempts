(function () {
  'use strict';

  const creator = function(cls) {
    const creat = function(...args) {
      return Object.freeze(new cls(...args))
    };

    return creat
  };

  const matcher = function(pred, crt, extract) {
    const mat = function(...args) {
      if (pred(...args)) {
        return crt(...extract(...args))
      }

      return null
    };

    return mat
  };

  const construct = function(cls, pred, extract) {
    const crt = creator(cls);
    const mtch = matcher(pred, crt, extract);

    return mtch
  };

  const id = (...xs) => xs;
  const dropMid = (x1, x2, x3) => [x1, x3];

  const VInt = function(value) {
    this.value = value;
  };

  const matchInt = construct(
    VInt,
    i => i === 'int',
    id,
  );

  ////

  const VAddOp = function(val1, val2) {
    this.operand1 = val1;
    this.operand2 = val2;
  };

  const matchAddOp = construct(
    VAddOp,
    (op1, addop, op2) => (op1 instanceof VInt && addop === '+' && op2 instanceof VInt),
    dropMid,
  );

  const theMatchers = {
    0: {},
    1: {
      0: [],
      1: [
        matchInt,
      ],
      2: [],
      3: [
        matchAddOp
      ],
    }
  };


  const retrieveMatchers = function(s, n) {
    return theMatchers[s][n]
  };

  // expr ∷= term

  const takeFromEnd = function(arr, n) {
    return arr.slice(-n)
  };

  const matchInput = function(ws) {
    for (let i = 1; i <= ws.length; i++) {
      const matchers = retrieveMatchers(0, i);

      for (const m of matchers) {
        const result = m(...takeFromEnd(ws, i));

        if (result) {
          return [result, i]
        }
      }
    }

    return null
  };

  const parse = function(tokens) {
    const innerTokens = [...tokens];
    const workstack = [];

    while (innerTokens.length > 0 || workstack.length > 1) {
      if (innerTokens.length > 0) {
        workstack.push(innerTokens.shift());
      }

      const r = matchInput(workstack);

      if (r) {
        const [
          redux,
          reduxLength,
        ] = r;

        workstack.splice(-reduxLength);
        workstack.push(redux);
        debugger
      }
    }
  };

  const main = function() {
    const tokens = [
      'int',
      '+',
      'int',
    ];

    parse(tokens);
  };

  main();

}());
