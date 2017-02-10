/**
 * Variation Data Structure
 *
 * @module data/variation
 * @param {String} id the variation id, i.e. `"input/text.pug"`
 * @param {String} id the component id, i.e. `"input"`
 * @param {String} path the variation template file path
 * @param {String} content the variation docs
 * @param {Object} context the context the template gets rendered with
 * @param {Object} attributes additional information from the variation files frontmater
 * @returns {Function} factory for creating the data structure
 */
const R = require('ramda')

module.exports = (id, componentId, path, content, context = {}, attributes) => {
  const baseData = {
    id,
    componentId,
    path,
    content,
    context
  }

  return R.mergeAll([attributes, baseData])
}
