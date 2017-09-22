const path = require('path')

export const testTmpPath = path.resolve(__dirname, '..', 'tmp')
export const testProjectPath = path.resolve(__dirname, '..', '..', 'packages', 'test-project')
export const testProjectTargetPath = testTmpPath
export const testProjectRelativePath = path.relative(process.cwd(), testProjectPath)
