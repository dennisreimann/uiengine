import path from 'path'
import theo from 'theo'
import { integrations as UIintegrations } from 'uiengine'

const filePath = path.resolve(__dirname, '../../tokens/colors.yml')
const titleize = string => string.replace(/^color/, '').replace(/([A-Z\d]+)/g, ' $1').replace(/^./, str => str.toUpperCase())
const kebabCase = string => `$${string.replace(/([a-z])([A-Z\d]+)/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()}`
const modify = prop => {
  const { name } = prop
  prop.name = titleize(name)
  prop.variable = kebabCase(name)
  return prop
}
const colors = UIintegrations.theo(theo).convert(filePath, modify)

module.exports = colors
