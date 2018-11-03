const theo = require('theo')

module.exports = (file, modify) => {
  // use theo raw json output as it contains the most information
  const jsonString = theo.convertSync({
    transform: { file },
    format: { type: 'raw.json' }
  })

  const { props } = JSON.parse(jsonString) || {}
  const result = []
  const categories = {}

  for (let propId in props) {
    const { type, name, value, originalValue, comment, category } = props[propId]

    // rename and modify theo input
    const description = comment
    const reference = originalValue === value ? null : originalValue.replace(/{!(.*)}/, '$1')
    const original = { type, name, value, description, reference }
    const token = typeof modify === 'function' ? modify(original) : original

    // build category structure
    if (categories[category]) {
      categories[category].tokens.push(token)
    } else {
      const cat = { name: category, type: 'category', tokens: [token] }
      categories[category] = cat
      result.push(cat)
    }
  }

  return result
}
