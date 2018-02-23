const { relative, resolve } = require('path')

export const testTmpPath = resolve(__dirname, '..', 'tmp')
export const testProjectPath = resolve(__dirname, '..', 'project')
export const testProjectTargetPath = testTmpPath
export const testProjectRelativePath = relative(process.cwd(), testProjectPath)
