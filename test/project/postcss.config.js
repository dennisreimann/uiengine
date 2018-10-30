const { basename, dirname } = require('path')
const modules = require('postcss-modules')

module.exports = ctx => ({
  plugins: [
    modules({
      getJSON: ctx.extractModules || (() => {}),

      // use a custom scope name, which does not dependent on the file path.
      // that is because the component root class defined in both the theme
      // and component css file need to have the same scope name – i.e.:
      // label/label.css -> .label -> .label_label
      // label/themes/funky.css -> .label -> .label_label
      generateScopedName (name, filepath) {
        const dir = basename(dirname(filepath))
        const componentId = dir === 'themes'
          ? basename(dirname(dirname(filepath)))
          : dir

        return `${componentId}_${name}`
      }
    })
  ]
})
