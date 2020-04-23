const { relative, resolve } = require('path')

const testProjectPath = resolve(__dirname, '..', 'project')
const testProjectTargetPath = resolve(testProjectPath, 'dist', 'test-project')
const testProjectRelativePath = relative(process.cwd(), testProjectPath)

module.exports = {
  testProjectPath,
  testProjectTargetPath,
  testProjectRelativePath
}
