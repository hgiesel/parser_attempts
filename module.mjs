// node es module entrypoint compiled to commonjs and esm at dist/main.js and dist/module.js respectively

import ow from 'ow'

/**
 * Computes the dimensions of an input image.
 *
 * @name getImageDimensions
 * @function
 *
 * @param {string} input - Input image to process (can be a local path, http url, or data url)
 * @return {Promise}
 */
export default async (input) => {
  console.log('hi')

  // ow(input, ow.string.nonEmpty.label('input'))

  // const image = await loadImage(input)

  // return {
  //   width: image.shape[0],
  //   height: image.shape[1]
  // }
}
