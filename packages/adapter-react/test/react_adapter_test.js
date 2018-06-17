require('mocha-sinon')()

const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { resolve } = require('path')
const Adapter = require('../src/index')

const templatePath = resolve(__dirname, 'fixtures', 'template.jsx')
const componentPath = resolve(__dirname, 'fixtures', 'component-with-props.jsx')
const defaultOptions = {
  babel: {}
}

describe('React adapter', () => {
  before(() => Adapter.setup(defaultOptions))
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#setup', () => {
    it('should invoke the babel-register hook function with the given options', async function () {
      // sinon cannot stub modules which export only a function,
      // hence we have to jump through hoops, see the details:
      // https://github.com/sinonjs/sinon/issues/562
      const babelRegisterStub = this.sinon.stub()
      require.cache[require.resolve('babel-register')] = {
        default: babelRegisterStub,
        exports: babelRegisterStub
      }
      await Adapter.setup(defaultOptions)

      this.sinon.assert.calledOnce(babelRegisterStub)
      this.sinon.assert.calledWith(babelRegisterStub, defaultOptions.babel)
    })
  })

  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const options = {}
      const data = { myData: 1 }
      const rendered = await Adapter.render(options, templatePath, data)

      assert(rendered.match(/<p data-react(.*?)>1<\/p>/))
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render({}, 'does-not-exist.jsx')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'React DOM could not render "does-not-exist.jsx"')
      }
    })

    it('should throw detailed error if the debug option is set', async () => {
      try {
        const templatePath = resolve(__dirname, 'fixtures', 'invalid-template.jsx')
        const data = { myData: 1 }
        await Adapter.render({ debug: true }, templatePath, data)
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'invalid-template.jsx')
        assertMatches(error.message, '"myData": 1')
      }
    })
  })

  describe('#registerComponentFile', () => {
    it('should invalidate the module cache', async () => {
      // is set by previous render test
      assert(require.cache[require.resolve(templatePath)])

      await Adapter.registerComponentFile({}, templatePath)

      assert(!require.cache[require.resolve(templatePath)])
    })

    it('should extract the component properties', async () => {
      const { properties } = await Adapter.registerComponentFile({}, componentPath)
      assert(properties)

      const props = properties['<ComponentWithProps>']
      assert(props)

      assert(props.optionalArray)
      assert.equal(props.optionalArray.type, 'Array', 'Wrong optionalArray format')
      assert.equal(props.optionalArray.description, 'Optional JS Array')
      assert.equal(props.optionalArray.required, false)

      assert(props.optionalBool)
      assert.equal(props.optionalBool.type, 'Bool', 'Wrong optionalBool format')
      assert.equal(props.optionalBool.description, 'Optional JS Boolean')
      assert.equal(props.optionalBool.required, false)
      assert.equal(props.optionalBool.default, 'false')

      assert(props.optionalFunc)
      assert.equal(props.optionalFunc.type, 'Func', 'Wrong optionalFunc format')
      assert.equal(props.optionalFunc.description, 'Optional JS Function')
      assert.equal(props.optionalFunc.required, false)

      assert(props.optionalNumber)
      assert.equal(props.optionalNumber.type, 'Number', 'Wrong optionalNumber format')
      assert.equal(props.optionalNumber.description, 'Optional JS Number')
      assert.equal(props.optionalNumber.required, false)

      assert(props.optionalObject)
      assert.equal(props.optionalObject.type, 'Object', 'Wrong optionalObject format')
      assert.equal(props.optionalObject.required, false)

      assert(props.optionalString)
      assert.equal(props.optionalString.type, 'String', 'Wrong optionalString format')
      assert.equal(props.optionalString.required, false)
      assert.equal(props.optionalString.default, 'This is the default string')

      assert(props.optionalSymbol)
      assert.equal(props.optionalSymbol.type, 'Symbol', 'Wrong optionalSymbol format')
      assert.equal(props.optionalSymbol.required, false)

      assert(props.optionalNode)
      assert.equal(props.optionalNode.type, 'Node', 'Wrong optionalNode format')
      assert.equal(props.optionalNode.required, false)

      assert(props.optionalElement)
      assert.equal(props.optionalElement.type, 'Element', 'Wrong optionalElement format')
      assert.equal(props.optionalElement.required, false)

      assert(props.optionalMessage)
      assert.equal(props.optionalMessage.type, 'Message', 'Wrong optionalMessage format')
      assert.equal(props.optionalMessage.required, false)

      assert(props.optionalEnum)
      assert.equal(props.optionalEnum.type, 'News|Photos', 'Wrong optionalEnum format')
      assert.equal(props.optionalEnum.required, false)

      assert(props.optionalUnion)
      assert.equal(props.optionalUnion.type, 'String|Number|Message', 'Wrong optionalUnion format')
      assert.equal(props.optionalUnion.required, false)

      assert(props.optionalArrayOf)
      assert.equal(props.optionalArrayOf.type, '[Number]', 'Wrong optionalArrayOf format')
      assert.equal(props.optionalArrayOf.required, false)

      assert(props.optionalObjectOf)
      assert.equal(props.optionalObjectOf.type, 'Number', 'Wrong optionalObjectOf format')
      assert.equal(props.optionalObjectOf.required, false)

      assert(props.optionalObjectWithShape)
      assert.equal(props.optionalObjectWithShape.type, '{color:String, fontSize:Number}', 'Wrong optionalObjectWithShape format')
      assert.equal(props.optionalObjectWithShape.required, false)

      assert(props.requiredFunc)
      assert.equal(props.requiredFunc.type, 'Func')
      assert.equal(props.requiredFunc.required, true)

      assert(props.requiredAny)
      assert.equal(props.requiredAny.type, 'Any')
      assert.equal(props.requiredAny.required, true)

      assert(props.customProp)
      assert.equal(props.customProp.type, 'Custom')
      assert.equal(props.customProp.required, false)

      assert(props.customArrayProp)
      assert.equal(props.customArrayProp.type, '[Custom]')
      assert.equal(props.customArrayProp.required, false)
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent('button')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'Button.jsx')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant('button', 'primary')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'Primary.jsx')
    })
  })
})
