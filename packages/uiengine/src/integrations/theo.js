module.exports = (theo, options) => {
  return {
    convert (file) {
      const jsonString = theo.convertSync({
        transform: { file },
        format: { type: 'raw.json' }
      })

      const { props } = JSON.parse(jsonString) || {}
      const result = {}

      for (let propId in props) {
        const { type, name, value, comment, category } = props[propId]
        result[category] = result[category] || {}
        result[category][name] = { type, name, value, description: comment }
      }

      return result
    }
  }
}
