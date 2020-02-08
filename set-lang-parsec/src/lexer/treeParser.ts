import {
  simpleRegexToken,
  openParen,
  closeParen,
} from './lexerTokens'

import {
  fmapParsec,
} from '../parserMonad'

import {
  Parsec
} from '../parserTypes'

import {
  between,
  choice,
} from '../combinators/combinators'

enum TreeType {
  Branch = 'branch',
    Leaf = 'leaf',
}

type Tree = Branch | Leaf

interface Branch {
  kind: 'branch'
  nodes: Tree[]
}

interface Leaf {
  kind: 'leaf'
  value: string
}

const mkLeaf = (s: string) => ({
  kind: TreeType.Leaf,
  value: s,
})

const mkBranch = (...trees: Tree[]) => ({
  kind: TreeType.Branch,
  nodes: trees,
})

export const leaf: Parsec<string,U,Leaf> = simpleRegexToken((val: RegExpExecArray) => mkLeaf(val[0]), /[a-zA-Z]+/yu)

export const branch = fmapParsec(
  (trees: Tree[]) => mkBranch(...trees),
  choice(leaf, between(openParen, closeParen, leaf)),
)



const a: Tree = {
  kind: TreeType.Branch,
  nodes: [{

    kind: TreeType.Branch,
    nodes: [{
      kind: TreeType.Leaf,
      value: 'hi'
    }]

  }]


}

