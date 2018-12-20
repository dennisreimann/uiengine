require('mocha-sinon')()

const assert = require('assert')
const { join, resolve } = require('path')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')

const Adapter = require('../src/index')
const babel = require('../babel.config')

const defaultOptions = { babel }

const basePath = join(__dirname, 'fixtures')
const elementsPath = join(basePath, 'elements')
const modulesPath = join(basePath, 'modules')
const atomFilePath = join(elementsPath, 'Atom', 'index.jsx')
const moleculeFilePath = join(modulesPath, 'Molecule', 'Molecule.jsx')
const moleculeIndexPath = join(modulesPath, 'Molecule', 'index.js')
const moleculeVariantPath = join(modulesPath, 'Molecule', 'variants', 'Molecule.jsx')
const organismFilePath = join(modulesPath, 'Organism', 'index.jsx')
const organismVariantPath = join(modulesPath, 'Organism', 'variants', 'Organism.jsx')
const templatePath = join(basePath, 'template.jsx')
const reactPath = require.resolve('react')

const adapterOptions = {
  components: [elementsPath, modulesPath]
}

describe('React adapter', () => {
  before(() => Adapter.setup(defaultOptions))
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#setup', () => {
    it('should not invoke the @babel/register hook function if no options are given', async function () {
      // sinon cannot stub modules which export only a function,
      // hence we have to jump through hoops, see the details:
      // https://github.com/sinonjs/sinon/issues/562
      const babelRegisterStub = this.sinon.stub()
      delete require.cache[require.resolve('@babel/register')]
      require.cache[require.resolve('@babel/register')] = {
        default: babelRegisterStub,
        exports: babelRegisterStub
      }
      await Adapter.setup({})

      this.sinon.assert.notCalled(babelRegisterStub)
    })

    it('should invoke the @babel/register hook function with the given options', async function () {
      // sinon cannot stub modules which export only a function,
      // hence we have to jump through hoops, see the details:
      // https://github.com/sinonjs/sinon/issues/562
      const babelRegisterStub = this.sinon.stub()
      require.cache[require.resolve('@babel/register')] = {
        default: babelRegisterStub,
        exports: babelRegisterStub
      }
      const options = { babel: { presets: ['@babel/preset-react'] } }
      await Adapter.setup(options)

      this.sinon.assert.calledOnce(babelRegisterStub)
      this.sinon.assert.calledWith(babelRegisterStub, options.babel)
    })
  })

  describe('#render', () => {
    it('should render the export default template with the given data', async () => {
      const data = { myData: 1 }
      const rendered = await Adapter.render(adapterOptions, templatePath, data)

      assert(rendered.match(/<p data-react(.*?)>1<\/p>/))
    })

    it('should render the module.export template with the given data', async () => {
      const data = { myData: 1 }
      const moduleExportsTemplatePath = resolve(__dirname, 'fixtures', 'template-module-exports.jsx')
      const rendered = await Adapter.render(adapterOptions, moduleExportsTemplatePath, data)

      assert(rendered.match(/<p data-react(.*?)>1<\/p>/))
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render(adapterOptions, 'does-not-exist.jsx')
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#registerComponentFile', () => {
    it('should extract the component properties', async () => {
      const componentPath = resolve(__dirname, 'fixtures', 'component-with-props.jsx')
      const { properties } = await Adapter.registerComponentFile(adapterOptions, componentPath)
      assert(properties)

      // see if OneMoreComponent is present
      assert.strictEqual(Object.keys(properties).length, 2)
      assert.strictEqual(typeof properties['<OneMoreComponent>'], 'object')

      // deep check props on ComponentWithProps
      const props = properties['<ComponentWithProps>']
      assert.strictEqual(typeof props, 'object')

      assert.strictEqual(typeof props.optionalArray, 'object')
      assert.strictEqual(props.optionalArray.type, 'Array')
      assert.strictEqual(props.optionalArray.required, false)

      assert.strictEqual(typeof props.optionalBool, 'object')
      assert.strictEqual(props.optionalBool.type, 'Bool')
      assert.strictEqual(props.optionalBool.required, false)
      assert.strictEqual(props.optionalBool.default, false)

      assert.strictEqual(typeof props.optionalFunc, 'object')
      assert.strictEqual(props.optionalFunc.type, 'Func')
      assert.strictEqual(props.optionalFunc.required, false)

      assert.strictEqual(typeof props.optionalNumber, 'object')
      assert.strictEqual(props.optionalNumber.type, 'Number')
      assert.strictEqual(props.optionalNumber.required, false)

      assert.strictEqual(typeof props.optionalObject, 'object')
      assert.strictEqual(props.optionalObject.type, 'Object')
      assert.strictEqual(props.optionalObject.required, false)

      assert.strictEqual(typeof props.optionalString, 'object')
      assert.strictEqual(props.optionalString.type, 'String')
      assert.strictEqual(props.optionalString.required, false)
      assert.strictEqual(props.optionalString.default, 'This is the default string')

      assert.strictEqual(typeof props.optionalSymbol, 'object')
      assert.strictEqual(props.optionalSymbol.type, 'Symbol')
      assert.strictEqual(props.optionalSymbol.required, false)

      assert.strictEqual(typeof props.optionalNode, 'object')
      assert.strictEqual(props.optionalNode.type, 'Node')
      assert.strictEqual(props.optionalNode.required, false)

      assert.strictEqual(typeof props.optionalElement, 'object')
      assert.strictEqual(props.optionalElement.type, 'Element')
      assert.strictEqual(props.optionalElement.required, false)

      assert.strictEqual(typeof props.optionalInstance, 'object')
      assert.strictEqual(props.optionalInstance.type, 'MyClass')
      assert.strictEqual(props.optionalInstance.required, false)

      assert.strictEqual(typeof props.optionalEnum, 'object')
      assert.strictEqual(props.optionalEnum.type, '"News"|"Photos"')
      assert.strictEqual(props.optionalEnum.required, false)

      assert.strictEqual(typeof props.optionalUnion, 'object')
      assert.strictEqual(props.optionalUnion.type, 'String|Number')
      assert.strictEqual(props.optionalUnion.required, false)

      assert.strictEqual(typeof props.optionalShape, 'object')
      assert.strictEqual(props.optionalShape.type, 'Shape')
      assert.strictEqual(props.optionalShape.required, false)
      assert.strictEqual(typeof props.optionalShape.value, 'object')
      assert.strictEqual(props.optionalShape.value.firstName.type, 'String')
      assert.strictEqual(props.optionalShape.value.firstName.required, false)
      assert.strictEqual(props.optionalShape.value.lastName.type, 'String')
      assert.strictEqual(props.optionalShape.value.lastName.required, false)

      assert.strictEqual(typeof props.externalComponent, 'object')
      assert.strictEqual(props.externalComponent.type, 'Shape')
      assert.strictEqual(props.externalComponent.required, false)
      assert.strictEqual(typeof props.externalComponent.value, 'object')
      assert.strictEqual(props.externalComponent.value.str.type, 'String')
      assert.strictEqual(props.externalComponent.value.str.required, false)
      assert.strictEqual(props.externalComponent.value.num.type, 'Number')
      assert.strictEqual(props.externalComponent.value.num.required, false)

      assert.strictEqual(typeof props.optionalArrayOfPrimitives, 'object')
      assert.strictEqual(props.optionalArrayOfPrimitives.type, 'Array')
      assert.strictEqual(props.optionalArrayOfPrimitives.required, false)
      assert.strictEqual(props.optionalArrayOfPrimitives.value, 'Number')

      assert.strictEqual(typeof props.optionalArrayOfShapes, 'object')
      assert.strictEqual(props.optionalArrayOfShapes.type, 'Array')
      assert.strictEqual(props.optionalArrayOfShapes.required, false)
      assert.strictEqual(props.optionalArrayOfShapes.value.type, 'Shape')
      assert.strictEqual(typeof props.optionalArrayOfShapes.value.value, 'object')
      assert.strictEqual(props.optionalArrayOfShapes.value.value.firstName.type, 'String')
      assert.strictEqual(props.optionalArrayOfShapes.value.value.firstName.required, false)
      assert.strictEqual(props.optionalArrayOfShapes.value.value.lastName.type, 'String')
      assert.strictEqual(props.optionalArrayOfShapes.value.value.lastName.required, false)

      assert.strictEqual(typeof props.optionalArrayOfAnotherComponent, 'object')
      assert.strictEqual(props.optionalArrayOfAnotherComponent.type, 'Array')
      assert.strictEqual(props.optionalArrayOfAnotherComponent.required, false)
      assert.strictEqual(props.optionalArrayOfAnotherComponent.value.type, 'Shape')
      assert.strictEqual(typeof props.optionalArrayOfAnotherComponent.value.value, 'object')
      assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.str.type, 'String')
      assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.str.required, false)
      assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.num.type, 'Number')
      assert.strictEqual(props.optionalArrayOfAnotherComponent.value.value.num.required, false)

      assert.strictEqual(typeof props.optionalObjectOfPrimitive, 'object')
      assert.strictEqual(props.optionalObjectOfPrimitive.type, 'Object')
      assert.strictEqual(props.optionalObjectOfPrimitive.required, false)
      assert.strictEqual(props.optionalObjectOfPrimitive.value, 'Number')

      assert.strictEqual(typeof props.optionalObjectOfShape, 'object')
      assert.strictEqual(props.optionalObjectOfShape.type, 'Object')
      assert.strictEqual(props.optionalObjectOfShape.required, false)
      assert.strictEqual(typeof props.optionalObjectOfShape.value.value, 'object')
      assert.strictEqual(props.optionalObjectOfShape.value.value.firstName.type, 'String')
      assert.strictEqual(props.optionalObjectOfShape.value.value.firstName.required, false)
      assert.strictEqual(props.optionalObjectOfShape.value.value.lastName.type, 'String')
      assert.strictEqual(props.optionalObjectOfShape.value.value.lastName.required, false)

      assert.strictEqual(typeof props.requiredFunc, 'object')
      assert.strictEqual(props.requiredFunc.type, 'Func')
      assert.strictEqual(props.requiredFunc.required, true)

      assert.strictEqual(typeof props.requiredAny, 'object')
      assert.strictEqual(props.requiredAny.type, 'Any')
      assert.strictEqual(props.requiredAny.required, true)

      assert.strictEqual(typeof props.customProp, 'object')
      assert.strictEqual(props.customProp.type, 'Custom')
      assert.strictEqual(props.customProp.required, false)

      assert.strictEqual(typeof props.customArrayProp, 'object')
      assert.strictEqual(props.customArrayProp.type, 'Array')
      assert.strictEqual(props.customArrayProp.required, false)
      assert.strictEqual(props.customArrayProp.value, 'Custom')
    })

    it('should return undefined properties if there are no component properties', async () => {
      const { properties } = await Adapter.registerComponentFile(adapterOptions, templatePath)
      assert.strictEqual(properties, undefined)
    })

    it('should extract the component dependencies and dependents', async () => {
      const { dependentFiles, dependencyFiles } = await Adapter.registerComponentFile(adapterOptions, moleculeFilePath)

      assert.strictEqual(dependentFiles.length, 4)
      assert(dependentFiles.includes(crossPlatformPath(moleculeIndexPath)))
      assert(dependentFiles.includes(crossPlatformPath(moleculeVariantPath)))
      assert(dependentFiles.includes(crossPlatformPath(organismFilePath)))
      assert(dependentFiles.includes(crossPlatformPath(organismVariantPath)))

      assert.strictEqual(dependencyFiles.length, 2)
      assert(dependencyFiles.includes(crossPlatformPath(reactPath)))
      assert(dependencyFiles.includes(crossPlatformPath(atomFilePath)))
    })

    it('should return undefined dependentFiles if there are no component dependents', async () => {
      const { dependentFiles } = await Adapter.registerComponentFile(adapterOptions, templatePath)

      assert.strictEqual(dependentFiles, undefined)
    })

    it('should return undefined dependencyFiles if there are no component dependents', async () => {
      const { dependencyFiles } = await Adapter.registerComponentFile(adapterOptions, atomFilePath)

      assert.strictEqual(dependencyFiles, undefined)
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent({}, 'button')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'Button.jsx')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant({}, 'button', 'primary')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'Primary.jsx')
    })
  })
})
