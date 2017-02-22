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
