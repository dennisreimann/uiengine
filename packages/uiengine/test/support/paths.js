const path = require('path')

export const testProjectPath = path.resolve(__dirname, '..', '..', '..', 'uiengine-test-project')
export const testProjectRelativePath = path.relative(process.cwd(), testProjectPath)
