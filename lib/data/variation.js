/**
 * Variation Data Structure
 *
 * @module data/variation
 * @param {String} id the variation id, i.e. `"input/text"`
 * @param {String} id the component id, i.e. `"input"`
 * @param {String} path the variation file path
 * @param {String} raw the raw template
 * @param {Object} context the context the template gets rendered with
 * @param {Object} attributes additional information from the variation files frontmater
 * @returns {Function} factory for creating the data structure
 */
const R = require('ramda')

module.exports = (id, componentId, path, raw, context = {}, attributes) => {
  const baseData = {
    id,
    componentId,
    path,
    raw,
    context
  }

  return R.mergeAll([attributes, baseData])
}
