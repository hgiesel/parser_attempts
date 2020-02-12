import {
  terser,
} from 'rollup-plugin-terser'

import {
  terserOptions,
} from './rollup.config.js'

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/Main.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    name: 'SetLang',
    // sourcemap: true
  },
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    production && terser(terserOptions),
  ]
}
