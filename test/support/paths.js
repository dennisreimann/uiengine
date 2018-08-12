const { relative, resolve } = require('path')

const testTmpPath = resolve(__dirname, '..', 'tmp')
const testProjectPath = resolve(__dirname, '..', 'project')
const testProjectTargetPath = testTmpPath
const testProjectRelativePath = relative(process.cwd(), testProjectPath)

module.exports = {
  testTmpPath,
  testProjectPath,
  testProjectTargetPath,
  testProjectRelativePath
}
