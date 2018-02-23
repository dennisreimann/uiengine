import path from 'path'
import theo from 'theo'
import { theo as UItheo } from 'uiengine'

const filePath = path.resolve(__dirname, '../../tokens/colors.yml')
const titleize = string => string.replace(/([A-Z\d]+)/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/^Color /, '')
const variablize = string => `$${string.replace(/([a-z])([A-Z\d]+)/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()}`
const modify = prop => {
  const { name, reference } = prop
  prop.name = titleize(name)
  prop.variable = variablize(name)
  if (reference) prop.reference = titleize(reference)
  return prop
}

module.exports = UItheo(theo).convert(filePath, modify)
