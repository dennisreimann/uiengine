require('mocha-sinon')()

const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')
const babel = require('../babel.config')

const defaultOptions = { babel }

const basePath = resolve(__dirname, 'fixtures')
const elementsPath = resolve(basePath, 'elements')
const modulesPath = resolve(basePath, 'modules')
const atomFilePath = resolve(elementsPath, 'Atom/index.jsx')
const moleculeFilePath = resolve(modulesPath, 'Molecule/Molecule.jsx')
const moleculeIndexFilePath = resolve(modulesPath, 'Molecule/index.js')
const moleculeCssFilePath = resolve(modulesPath, 'Molecule/Molecule.css')
const organismFilePath = resolve(modulesPath, 'Organism/index.jsx')
const templatePath = resolve(basePath, 'template.jsx')
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
    it('should invalidate the module cache', async () => {
      // is set by previous render test
      assert(require.cache[require.resolve(templatePath)])

      await Adapter.registerComponentFile(adapterOptions, templatePath)

      assert(!require.cache[require.resolve(templatePath)])
    })

    it('should extract the component properties', async () => {
      const componentPath = resolve(__dirname, 'fixtures', 'component-with-props.jsx')
      const { properties } = await Adapter.registerComponentFile(adapterOptions, componentPath)
      assert(properties)

      const props = properties['<ComponentWithProps>']
      assert(props)

      assert(props.optionalArray)
      assert.strictEqual(props.optionalArray.type, 'Array', 'Wrong optionalArray format')
      assert.strictEqual(props.optionalArray.description, 'Optional JS Array')
      assert.strictEqual(props.optionalArray.required, false)

      assert(props.optionalBool)
      assert.strictEqual(props.optionalBool.type, 'Bool', 'Wrong optionalBool format')
      assert.strictEqual(props.optionalBool.description, 'Optional JS Boolean')
      assert.strictEqual(props.optionalBool.required, false)
      assert.strictEqual(props.optionalBool.default, 'false')

      assert(props.optionalFunc)
      assert.strictEqual(props.optionalFunc.type, 'Func', 'Wrong optionalFunc format')
      assert.strictEqual(props.optionalFunc.description, 'Optional JS Function')
      assert.strictEqual(props.optionalFunc.required, false)

      assert(props.optionalNumber)
      assert.strictEqual(props.optionalNumber.type, 'Number', 'Wrong optionalNumber format')
      assert.strictEqual(props.optionalNumber.description, 'Optional JS Number')
      assert.strictEqual(props.optionalNumber.required, false)

      assert(props.optionalObject)
      assert.strictEqual(props.optionalObject.type, 'Object', 'Wrong optionalObject format')
      assert.strictEqual(props.optionalObject.required, false)

      assert(props.optionalString)
      assert.strictEqual(props.optionalString.type, 'String', 'Wrong optionalString format')
      assert.strictEqual(props.optionalString.required, false)
      assert.strictEqual(props.optionalString.default, 'This is the default string')

      assert(props.optionalSymbol)
      assert.strictEqual(props.optionalSymbol.type, 'Symbol', 'Wrong optionalSymbol format')
      assert.strictEqual(props.optionalSymbol.required, false)

      assert(props.optionalNode)
      assert.strictEqual(props.optionalNode.type, 'Node', 'Wrong optionalNode format')
      assert.strictEqual(props.optionalNode.required, false)

      assert(props.optionalElement)
      assert.strictEqual(props.optionalElement.type, 'Element', 'Wrong optionalElement format')
      assert.strictEqual(props.optionalElement.required, false)

      assert(props.optionalMessage)
      assert.strictEqual(props.optionalMessage.type, 'Message', 'Wrong optionalMessage format')
      assert.strictEqual(props.optionalMessage.required, false)

      assert(props.optionalEnum)
      assert.strictEqual(props.optionalEnum.type, 'News|Photos', 'Wrong optionalEnum format')
      assert.strictEqual(props.optionalEnum.required, false)

      assert(props.optionalUnion)
      assert.strictEqual(props.optionalUnion.type, 'String|Number|Message', 'Wrong optionalUnion format')
      assert.strictEqual(props.optionalUnion.required, false)

      assert(props.optionalArrayOf)
      assert.strictEqual(props.optionalArrayOf.type, '[Number]', 'Wrong optionalArrayOf format')
      assert.strictEqual(props.optionalArrayOf.required, false)

      assert(props.optionalObjectOf)
      assert.strictEqual(props.optionalObjectOf.type, 'Number', 'Wrong optionalObjectOf format')
      assert.strictEqual(props.optionalObjectOf.required, false)

      assert(props.optionalObjectWithShape)
      assert.strictEqual(props.optionalObjectWithShape.type, '{color:String, fontSize:Number}', 'Wrong optionalObjectWithShape format')
      assert.strictEqual(props.optionalObjectWithShape.required, false)

      assert(props.requiredFunc)
      assert.strictEqual(props.requiredFunc.type, 'Func')
      assert.strictEqual(props.requiredFunc.required, true)

      assert(props.requiredAny)
      assert.strictEqual(props.requiredAny.type, 'Any')
      assert.strictEqual(props.requiredAny.required, true)

      assert(props.customType)
      assert.strictEqual(props.customType.type, 'Message')
      assert.strictEqual(props.customType.required, false)

      assert(props.customProp)
      assert.strictEqual(props.customProp.type, 'Custom')
      assert.strictEqual(props.customProp.required, false)

      assert(props.customArrayProp)
      assert.strictEqual(props.customArrayProp.type, '[Custom]')
      assert.strictEqual(props.customArrayProp.required, false)
    })

    it('should return undefined properties if there are no component properties', async () => {
      const { properties } = await Adapter.registerComponentFile(adapterOptions, templatePath)
      assert.strictEqual(properties, undefined)
    })

    it('should extract the component dependencies and dependents', async () => {
      const { dependentFiles, dependencyFiles } = await Adapter.registerComponentFile(adapterOptions, moleculeFilePath)

      assert.strictEqual(dependentFiles.length, 2)
      assert(dependentFiles.includes(moleculeIndexFilePath))
      assert(dependentFiles.includes(organismFilePath))

      assert.strictEqual(dependencyFiles.length, 3)
      assert(dependencyFiles.includes(reactPath))
      assert(dependencyFiles.includes(atomFilePath))
      assert(dependencyFiles.includes(moleculeCssFilePath))
    })

    it('should return undefined dependentFiles if there are no component dependents', async () => {
      const { dependentFiles } = await Adapter.registerComponentFile(adapterOptions, organismFilePath)

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
