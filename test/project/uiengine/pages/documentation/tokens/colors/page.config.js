const { resolve } = require('path')
const convert = require('@uiengine/bridge-theo')

const filePath = resolve(__dirname, '../../../../../lib/colors.yml')
const titleize = string => string.replace(/([A-Z\d]+)/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/^Color /, '')
const variablize = string => `$${string.replace(/([a-z])([A-Z\d]+)/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()}`
const modify = prop => {
  const { name, reference } = prop
  prop.name = titleize(name)
  prop.variable = variablize(name)
  if (reference) prop.reference = titleize(reference)
  return prop
}

module.exports = {
  tokens: convert(filePath, modify),
  tags: ['Token']
}
