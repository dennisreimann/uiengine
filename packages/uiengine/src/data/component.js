const R = require('ramda')

module.exports = (id, path, variantIds = [], attributes) => {
  const baseData = {
    id,
    path
  }

  // allow variantIds to be set via attributes 'variants' property,
  // which gets transformed into variantIds property
  return R.mergeAll([{ variantIds }, attributes, baseData])
}
