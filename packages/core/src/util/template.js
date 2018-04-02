const { basename, dirname, join, relative } = require('path')

const templateFilePathToTemplateId = (templatesPath, templateFilePath) => {
  if (!templateFilePath.startsWith(templatesPath)) return null

  const relativePath = relative(templatesPath, templateFilePath)
  const dir = dirname(relativePath)
  const name = basename(relativePath)
  const id = join(dir, name)

  return id
}

module.exports = {
  templateFilePathToTemplateId
}
