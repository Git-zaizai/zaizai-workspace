/**
 * Safe decodeURIComponent, won't throw any error.
 * If `decodeURIComponent` error happen, just return the original value.
 *
 * @param {String} text
 * @returns {String} URL decode original string.
 * @private
 */

export function safeDecodeURIComponent(text) {
  try {
    // TODO: take a look on `safeDecodeURIComponent` if we use it only with route params let's remove the `replace` method otherwise make it flexible.
    // @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent#decoding_query_parameters_from_a_url
    return decodeURIComponent(text.replace(/\+/g, ' '))
  } catch {
    return text
  }
}
