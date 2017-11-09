const fs = require('fs')
const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')
const templateCompiler = require('vue-template-compiler')
const renderer = createRenderer()

require('babel-register')({})

// invalidate require cache so we get template updates as well
const invalidateModuleCache = filePath => delete require.cache[require.resolve(filePath)]
const kebabcase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
const dataToProps = data => Object.keys(data).map(name => `:${kebabcase(name)}="$data.${name}"`).join(' ')

export async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    invalidateModuleCache(filePath)
    resolve()
  })
}

export async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    invalidateModuleCache(filePath)
    const vmOpts = { data, components: {} }

    if (filePath.endsWith('.vue')) {
      const sfc = fs.readFileSync(filePath).toString()
      const descriptor = templateCompiler.parseComponent(sfc)

      vmOpts.template = descriptor.template.content

      // TODO: descriptor.script.content needs to be handled too

      console.log(filePath, JSON.stringify(vmOpts, null, '  '))
    } else {
      let element = require(filePath)
      if (element.default) {
        element = element.default
      }

      if (element && element.options && element.options.name) { // defined via global register (Vue.component)
        const { name } = element.options
        vmOpts.template = `<${name} ${dataToProps(data)} />`
      } else if (element) { // defined via export
        if (!element.name) element.name = 'UiengineVueAdapter-PleaseSpecifyComponentName'
        const { name } = element
        vmOpts.components[name] = element // register component locally
        vmOpts.template = `<${kebabcase(name)} ${dataToProps(data)} />`
      } else { // no export, throw error with explanation
        throw new Error(`The file "${filePath}" does not export a Vue component. Please expose the component via "module.exports" or "export default".`)
      }
    }

    const vm = new Vue(vmOpts)

    renderer.renderToString(vm, (err, html) => {
      if (err) {
        const message = [`Vue could not render "${filePath}"!`, err]

        if (options.debug) {
          message.push(JSON.stringify(data, null, '  '))
          message.push(JSON.stringify(vmOpts, null, '  '))
        }

        reject(message.join('\n\n'))
      } else {
        resolve(html)
      }
    })
  })
}
