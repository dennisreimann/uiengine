const Vue = require('vue')
const { readFileSync } = require('fs')
const { createRenderer } = require('vue-server-renderer')
const {
  FileUtil: { invalidateRequireCache }
} = require('@uiengine/util')
// const templateCompiler = require('vue-template-compiler')
// const compiler = require('vue-component-compiler')
// const defaultsdeep = require('lodash.defaultsdeep')

const requireModule = filePath => {
  // invalidate require cache so we get updates as well
  invalidateRequireCache(filePath)

  let module = require(filePath)
  if (module.default) {
    module = module.default
  }

  return module
}

const kebabcase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
const dataToProps = data => Object.keys(data).map(name => `:${kebabcase(name)}="$data.${name}"`).join(' ')

// export async function registerComponentFile (options, filePath) {
//   return new Promise((resolve, reject) => {
//     invalidateModuleCache(filePath)
//     resolve()
//   })
// }

// see https://github.com/vuejs/vue-component-compiler/blob/master/test/setup/utils.js
// const compileSFC = (filename, source, options = {}) => {
//   source = source || readFileSync(filename).toString()
//   const descriptor = compiler.parse(source, filename, { needMap: true })
//   const scopeId = compiler.generateScopeId(filename, source)
//   const render = descriptor.template ? compiler.compileTemplate(
//     { code: descriptor.template.content, descriptor: descriptor.template }, filename, defaultsdeep({ scopeId }, options.template)
//   ) : null
//   const styles = descriptor.styles.map(it => compiler.compileStyle(
//     { code: it.content, descriptor: it }, filename, defaultsdeep({ scopeId }, options.style)
//   )).map((style, i) => ({ descriptor: descriptor.styles[i], code: style.code, map: style.map, modules: style.modules }))
//   return compiler.assemble({
//     styles,
//     render: {
//       code: render && render.code,
//       descriptor: descriptor.template
//     },
//     script: {
//       code: descriptor.script && descriptor.script.content,
//       descriptor: descriptor.script
//     },
//     customBlocks: []
//   }, filename, defaultsdeep({
//     scopeId,
//     require: {
//       normalizeComponent: resolve(__dirname, '../../src/runtime/normalize-component.js'),
//       injectStyleClient: resolve(__dirname, '../../src/runtime/inject-style-client.js'),
//       injectStyleServer: resolve(__dirname, '../../src/runtime/inject-style-server.js')
//     }
//   }), options.assemble)
// }

async function renderJS (options, filePath, data) {
  const vmOpts = { data, components: {} }
  const element = requireModule(filePath)

  if (element && element.options && element.options.name) { // defined via global register (Vue.component)
    const { name } = element.options
    vmOpts.template = `<${name} ${dataToProps(data)} />`
  } else if (element && element.name) { // defined via export
    const { name } = element
    vmOpts.components[name] = element // register component locally
    vmOpts.template = `<${kebabcase(name)} ${dataToProps(data)} />`
  } else { // no export, throw error with explanation
    throw new Error(`The file "${filePath}" does not export a Vue component. Please expose the component via "module.exports" or "export default".`)
  }

  const vm = new Vue(vmOpts)

  const rendered = await renderVm(options, filePath, data, vm)

  return rendered
}

async function renderVue (options, filePath, data) {
  return new Promise((resolve, reject) => {
    // const descriptor = templateCompiler.parseComponent(sfc)

    // const descriptor = compileSFC(filePath)

    // vmOpts.template = descriptor.template ? descriptor.template.content : ''

    // TODO: descriptor.script.content needs to be handled too

    reject(new Error('Rendering .vue files is not implemented yet.'))
  })
}

async function renderHTML (options, filePath, data) {
  // use the factory function provided by the bundle
  // or fall back to instantiating a plain vm.
  const { bundle } = options
  const createVm = bundle ? requireModule(bundle) : opts => new Vue(opts)

  const template = readFileSync(filePath).toString()
  const vm = createVm({ data, template })
  const rendered = await renderVm(options, filePath, data, vm)

  return rendered
}

async function renderVm (options, filePath, data, vm) {
  return new Promise((resolve, reject) => {
    const renderer = createRenderer()

    renderer.renderToString(vm, (err, html) => {
      if (err) {
        const message = [`Vue could not render "${filePath}"!`, err]

        if (options.debug) {
          message.push(JSON.stringify(data, null, 2))
          message.push(JSON.stringify(vm.$options, null, 2))
        }

        reject(message.join('\n\n'))
      } else {
        resolve(html)
      }
    })
  })
}

export async function render (options, filePath, data = {}) {
  const isJS = filePath.endsWith('.js')
  const isVue = filePath.endsWith('.vue')
  const renderFn = isJS ? renderJS : (isVue ? renderVue : renderHTML)
  const rendered = await renderFn(options, filePath, data)

  return rendered
}
