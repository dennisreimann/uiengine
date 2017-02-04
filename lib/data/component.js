/**
 * Component Data Structure
 *
 * @module data/component
 * @param {String} id the component id, i.e. `"input"`
 * @param {String} path the component path
 * @param {Array} variationIds the variation ids of the component
 * @param {Object} attributes additional information from the component files frontmater
 * @returns {Function} factory for creating the data structure
 */
const R = require('ramda')

module.exports = (id, path, variationIds = [], attributes) => {
  const baseData = {
    id,
    path
  }

  // allow variationIds to be set via attributes 'variations' property,
  // which gets transformed into variationIds property
  return R.mergeAll([{ variationIds }, attributes, baseData])
}
