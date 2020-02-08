/**
 *   1. E -> T
           | T + E
 *   3. T -> a
 *         | a * T
 *         | (E)
 *
 *
 *     E = E1 || E2;
 *
 *     E1 = T;
 *     E2 = T + E;
 */
var cursor = 0;
var savedCursor = cursor;

function E() {
  return (saveCursor(), E1()) || (backtrack(), saveCursor(), E2());
}

function E1() {
  return T();
}

function E2() {
  return T() && term('+') && E();
}

// OK, we're done with E! Now let's encode the rules for T.

/**
 * Implements T non-terminal.
 *
 *   T -> a
 *      | a * T
 *      | (E)
 *
 * The same as E, it has alternatives: T1, T2, and T3.
 */
function T() {
  return (saveCursor(), T1()) ||
    (backtrack(), saveCursor(), T2()) ||
    (backtrack(), saveCursor(), T3());
}
function T1() {
  return term('a');
}
function T2() {
  return term('a') && term('*') && T();
}
function T3() {
  return term('(') && E() && term(')');
}

function saveCursor() {
  savedCursor = cursor;
}

function backtrack() {
  cursor = savedCursor;
}

function term(expected) {
  return getNextToken() === expected;
}

function getNextToken() {
  // Skip whitespace.
  while (source[cursor] === ' ') cursor++;
  var nextToken = source[cursor];
  cursor++;
  return nextToken;
}

var source;

function parse(s) {
  source = s;
  cursor = 0;
  // We succeed if our main E symbol succeeds *and* we parse
  // all tokens (reached end of the source string).
  return E() && cursor == source.length;
}


console.log('(a)', parse('(a)')); // true
console.log('-a', parse('-a')); // false

// Seems legit so far. Now let's try parsing the:

// --- Simple backtracking limitation --

console.log('a * a', parse('a * a')); // false!

// Why is it false? It's clearly in the grammar of our language.
// Is it a bug in the parser? Not really.

// Here we encounter the first limitation of the recursive descent parsing.
// In fact, the backtracking algorithm we implemented here is kind of "naive":
// the parser succeeded when it found first "a" token (since it corresponds to
// the T1 alternative of T), and then it stopped parsing. However, we haven't
// yet reached the end of the string. Had we tried the T2 production first
// (a * T), the string would be parsed. So the conclusion which we can make
// here is:
//
//   - This implementation of the recursive descent is capable to parse
//     only productions with one alternative that starts with the same token
//     (it cannot parse "a" and "a * T" if tries just "a" first). So the
//     backtracking algorithm we have here is *not generic*.
//
//  - However, it's possible to implement a generic backtracking that would
//    consider as well the fact, that the cursor hasn't reached yet the
//    end of the source string, and that we should probably try another
//    alternative (even if the previous alternative succeeded!), T2 in our
//    case, that would parse the "a * a".
//
//  - Another approach to fix it, is to restructure our grammar. This
//    technique is called *left factoring*, which we wil cover in later
//    lectures.

// Additional info can be found in the "Dragon book", and in other lectures
// e.g from prof. Alex Aiken.

// Exercise: Implement generic backtracking that would parse "a + a".
