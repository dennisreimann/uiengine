import path from 'path'
import theo from 'theo'
import { integrations as UIintegrations } from 'uiengine'

const filePath = path.resolve(__dirname, '../../tokens/colors.yml')

module.exports = UIintegrations.theo(theo).convert(filePath)
