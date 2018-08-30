const { readFile } = require('fs')
const { basename, extname, join } = require('path')
const glob = require('globby')
const Handlebars = require('handlebars')

async function setup (options) {
  const { components, ext } = options

  if (!components) return

  // register all components files, but no variants!
  const pattern = join(components, '*', `*.${ext}`)
  const paths = await glob(pattern, { onlyFiles: true })
  const registers = []

  paths.forEach(filePath => {
    registers.push(registerComponentFile(options, filePath))
  })

  await Promise.all(registers)
}

async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (error, raw) => {
      if (error) {
        reject(error)
      } else {
        const name = basename(filePath, extname(filePath))
        const id = options.namespace ? `${options.namespace}/${name}` : name

        Handlebars.registerPartial(id, raw)

        resolve()
      }
    })
  })
}

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (error, raw) => {
      if (error) {
        reject(error)
      } else {
        const template = Handlebars.compile(raw)
        const rendered = template(data)

        resolve(rendered)
      }
    })
  })
}

module.exports = {
  setup,
  render,
  registerComponentFile
}
