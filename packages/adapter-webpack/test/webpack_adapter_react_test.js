require('mocha-sinon')()

const assert = require('assert')
const { join } = require('path')
const { removeSync } = require('fs-extra')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')
const { assertMatches, assertIncludes } = require('../../../test/support/asserts')
const { testTmpPath } = require('../../../test/support/paths')

const Adapter = require('../src/index')

const basePath = join(__dirname, 'fixtures/react')
const elementsPath = join(basePath, 'elements')
const modulesPath = join(basePath, 'modules')
const atomFilePath = join(elementsPath, 'Atom', 'index.jsx')
const moleculeFilePath = join(modulesPath, 'Molecule', 'Molecule.jsx')
const moleculeIndexPath = join(modulesPath, 'Molecule', 'index.jsx')
const organismFilePath = join(modulesPath, 'Organism', 'index.jsx')
const templatePath = join(basePath, 'template.jsx')
const outputPath = join(testTmpPath, '_webpack')
const reactPath = require.resolve('react')

const options = {
  ...require(join(basePath, 'adapter_options')),
  components: [elementsPath, modulesPath],
  target: testTmpPath,
  ext: 'jsx',
  uiBase: '/'
}

describe('Webpack adapter with React templates', function () {
  this.timeout(5000)

  afterEach(function () {
    removeSync(outputPath)
    this.sinon.restore()
  })

  describe('#setup', () => {
    it('should warn if config is incorrect', async function () {
      this.sinon.stub(console, 'warn')

      let incorrectOptions

      incorrectOptions = Object.assign({}, options)
      delete incorrectOptions.serverRenderPath
      delete incorrectOptions.clientRenderPath

      await Adapter.setup(incorrectOptions)

      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both serverConfig and serverRenderPath')
      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both clientConfig and clientRenderPath')

      incorrectOptions = Object.assign({}, options)
      delete incorrectOptions.serverConfig
      delete incorrectOptions.clientConfig

      await Adapter.setup(incorrectOptions)

      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both serverConfig and serverRenderPath')
      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both clientConfig and clientRenderPath')
    })
  })

  describe('#render', () => {
    before(async () => { await Adapter.setup(options) })

    it('should throw error if the file does not exist', async function () {
      this.sinon.stub(console, 'error')

      try {
        await Adapter.render(options, 'does-not-exist.jsx')
      } catch (error) {
        assert(error)
      }
    })

    it('should render the template with the given data', async () => {
      const templatePath = join(basePath, 'template.jsx')
      const data = { myData: 'this is my data' }
      const { rendered, foot } = await Adapter.render(options, templatePath, data, 'test-template')
      const html = '<p data-reactroot="">this is my data</p>'

      assertMatches(rendered, html)
      assertMatches(foot, /<script/)
      assertMatches(foot, /<\/script>/)
    })
  })

  describe('#registerComponentFile', () => {
    it('should extract the component dependencies and dependents', async () => {
      const { dependentFiles, dependencyFiles } = await Adapter.registerComponentFile(options, moleculeFilePath)

      assert.strictEqual(dependencyFiles.length, 2, JSON.stringify(dependencyFiles, null, 2))
      assertIncludes(dependencyFiles, crossPlatformPath(reactPath))
      assertIncludes(dependencyFiles, crossPlatformPath(atomFilePath))

      assert.strictEqual(dependentFiles.length, 2, JSON.stringify(dependentFiles, null, 2))
      assertIncludes(dependentFiles, crossPlatformPath(moleculeIndexPath))
      assertIncludes(dependentFiles, crossPlatformPath(organismFilePath))
    })

    it('should return undefined dependentFiles if there are no component dependents', async () => {
      const { dependentFiles } = await Adapter.registerComponentFile(options, templatePath)

      assert.strictEqual(dependentFiles, undefined)
    })

    it('should return undefined dependencyFiles if there are no component dependents', async () => {
      const { dependencyFiles } = await Adapter.registerComponentFile(options, atomFilePath)

      assert.strictEqual(dependencyFiles, undefined)
    })

    it('should extract the component properties', async () => {
      const componentPath = join(basePath, 'component-with-props.jsx')
      const { properties } = await Adapter.registerComponentFile(options, componentPath)
      assert(properties)

      // see if OneMoreComponent is present
      assert.strictEqual(Object.keys(properties).length, 2)
      assert.strictEqual(typeof properties['<OneMoreComponent>'], 'object')

      // deep check props on ComponentWithProps
      const props = properties['<ComponentWithProps>']
      assert.strictEqual(typeof props, 'object')

      assert.strictEqual(typeof props.optionalArray, 'object')
      // assert.strictEqual(props.optionalArray.type, 'Array')
      assert.strictEqual(props.optionalArray.required, false)

      assert.strictEqual(typeof props.optionalBool, 'object')
      // assert.strictEqual(props.optionalBool.type, 'Bool')
      assert.strictEqual(props.optionalBool.required, false)
      assert.strictEqual(props.optionalBool.default, false)

      assert.strictEqual(typeof props.optionalFunc, 'object')
      // assert.strictEqual(props.optionalFunc.type, 'Func')
      assert.strictEqual(props.optionalFunc.required, false)

      assert.strictEqual(typeof props.optionalNumber, 'object')
      // assert.strictEqual(props.optionalNumber.type, 'Number')
      assert.strictEqual(props.optionalNumber.required, false)

      assert.strictEqual(typeof props.optionalObject, 'object')
      // assert.strictEqual(props.optionalObject.type, 'Object')
      assert.strictEqual(props.optionalObject.required, false)

      assert.strictEqual(typeof props.optionalString, 'object')
      // assert.strictEqual(props.optionalString.type, 'String')
      assert.strictEqual(props.optionalString.required, false)
      assert.strictEqual(props.optionalString.default, 'This is the default string')

      assert.strictEqual(typeof props.optionalSymbol, 'object')
      // assert.strictEqual(props.optionalSymbol.type, 'Symbol')
      assert.strictEqual(props.optionalSymbol.required, false)

      assert.strictEqual(typeof props.optionalNode, 'object')
      // assert.strictEqual(props.optionalNode.type, 'Node')
      assert.strictEqual(props.optionalNode.required, false)

      assert.strictEqual(typeof props.optionalElement, 'object')
      // assert.strictEqual(props.optionalElement.type, 'Element')
      assert.strictEqual(props.optionalElement.required, false)

      assert.strictEqual(typeof props.optionalInstance, 'object')
      // assert.strictEqual(props.optionalInstance.type, 'MyClass')
      assert.strictEqual(props.optionalInstance.required, false)

      assert.strictEqual(typeof props.optionalEnum, 'object')
      // assert.strictEqual(props.optionalEnum.type, '"News"|"Photos"')
      assert.strictEqual(props.optionalEnum.required, false)

      assert.strictEqual(typeof props.optionalUnion, 'object')
      // assert.strictEqual(props.optionalUnion.type, 'String|Number')
      assert.strictEqual(props.optionalUnion.required, false)

      assert.strictEqual(typeof props.optionalShape, 'object')
      // assert.strictEqual(props.optionalShape.type, 'Shape')
      assert.strictEqual(props.optionalShape.required, false)
      // assert.strictEqual(typeof props.optionalShape.value, 'object')
      // assert.strictEqual(props.optionalShape.value.firstName.type, 'String')
      // assert.strictEqual(props.optionalShape.value.firstName.required, false)
      // assert.strictEqual(props.optionalShape.value.lastName.type, 'String')
      // assert.strictEqual(props.optionalShape.value.lastName.required, false)

      assert.strictEqual(typeof props.externalComponent, 'object')
      // assert.strictEqual(props.externalComponent.type, 'Shape')
      assert.strictEqual(props.externalComponent.required, false)
      // assert.strictEqual(typeof props.externalComponent.value, 'object')
      // assert.strictEqual(props.externalComponent.value.str.type, 'String')
      // assert.strictEqual(props.externalComponent.value.str.required, false)
      // assert.strictEqual(props.externalComponent.value.num.type, 'Number')
      // assert.strictEqual(props.externalComponent.value.num.required, false)

      assert.strictEqual(typeof props.optionalArrayOfPrimitives, 'object')
      // assert.strictEqual(props.optionalArrayOfPrimitives.type, 'Array')
      assert.strictEqual(props.optionalArrayOfPrimitives.required, false)
      // assert.strictEqual(props.optionalArrayOfPrimitives.value, 'Number')

      assert.strictEqual(typeof props.optionalArrayOfShapes, 'object')
      // assert.strictEqual(props.optionalArrayOfShapes.type, 'Array')
      assert.strictEqual(props.optionalArrayOfShapes.required, false)
      // assert.strictEqual(props.optionalArrayOfShapes.value.type, 'Shape')
      // assert.strictEqual(typeof props.optionalArrayOfShapes.value.value, 'object')
      // assert.strictEqual(props.optionalArrayOfShapes.value.value.firstName.type, 'String')
      // assert.strictEqual(props.optionalArrayOfShapes.value.value.firstName.required, false)
      // assert.strictEqual(props.optionalArrayOfShapes.value.value.lastName.type, 'String')
      // assert.strictEqual(props.optionalArrayOfShapes.value.value.lastName.required, false)

      assert.strictEqual(typeof props.optionalArrayOfAnotherComponent, 'object')
      // assert.strictEqual(props.optionalArrayOfAnotherComponent.type, 'Array')
      assert.strictEqual(props.optionalArrayOfAnotherComponent.required, false)
      // assert.strictEqual(props.optionalArrayOfAnotherComponent.value.type, 'Shape')
      // assert.strictEqual(typeof props.optionalArrayOfAnotherComponent.value.value, 'object')
      // assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.str.type, 'String')
      // assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.str.required, false)
      // assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.num.type, 'Number')
      // assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.num.required, false)

      assert.strictEqual(typeof props.optionalObjectOfPrimitive, 'object')
      // assert.strictEqual(props.optionalObjectOfPrimitive.type, 'Object')
      assert.strictEqual(props.optionalObjectOfPrimitive.required, false)
      // assert.strictEqual(props.optionalObjectOfPrimitive.value, 'Number')

      assert.strictEqual(typeof props.optionalObjectOfShape, 'object')
      // assert.strictEqual(props.optionalObjectOfShape.type, 'Object')
      assert.strictEqual(props.optionalObjectOfShape.required, false)
      // assert.strictEqual(typeof props.optionalObjectOfShape.value.value, 'object')
      // assert.strictEqual(props.optionalObjectOfShape.value.value.firstName.type, 'String')
      // assert.strictEqual(props.optionalObjectOfShape.value.value.firstName.required, false)
      // assert.strictEqual(props.optionalObjectOfShape.value.value.lastName.type, 'String')
      // assert.strictEqual(props.optionalObjectOfShape.value.value.lastName.required, false)

      assert.strictEqual(typeof props.requiredFunc, 'object')
      // assert.strictEqual(props.requiredFunc.type, 'Func')
      // assert.strictEqual(props.requiredFunc.required, true)

      assert.strictEqual(typeof props.requiredAny, 'object')
      // assert.strictEqual(props.requiredAny.type, 'Any')
      // assert.strictEqual(props.requiredAny.required, true)

      assert.strictEqual(typeof props.customProp, 'object')
      // assert.strictEqual(props.customProp.type, 'Custom')
      assert.strictEqual(props.customProp.required, false)

      assert.strictEqual(typeof props.customArrayProp, 'object')
      // assert.strictEqual(props.customArrayProp.type, 'Array')
      assert.strictEqual(props.customArrayProp.required, false)
      // assert.strictEqual(props.customArrayProp.value, 'Custom')
    })

    it('should return undefined properties if there are no component properties', async () => {
      const { properties } = await Adapter.registerComponentFile(options, templatePath)
      assert.strictEqual(properties, undefined)
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent(options, 'button')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'Button.jsx')

      const content = files[0].data

      assertMatches(content, "import React from 'react'")
      assertMatches(content, 'export default Button')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant(options, 'button', 'primary')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'Primary.jsx')

      const content = files[0].data

      assertMatches(content, "import React from 'react'")
      assertMatches(content, "import Button from '../Button.jsx'")
    })
  })
})
