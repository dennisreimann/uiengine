const { StringUtil: { lowercaseFirstChar, upcaseFirstChar } } = require('@uiengine/util')

const filesForComponent = (options, componentName) => {
  const upcasedComponentName = upcaseFirstChar(componentName)
  const lowercasedComponentName = lowercaseFirstChar(componentName)

  return [
    {
      basename: `${upcasedComponentName}.vue`,
      data: `
<template>
  <div class="${lowercasedComponentName}">
  </div>
</template>

<script>
export default {

}
</script>

<style>
.${lowercasedComponentName} {
}
</style>`
    },
    {
      basename: 'index.js',
      data: `
import ${upcasedComponentName} from './${upcasedComponentName}.vue'

export default ${upcasedComponentName}`
    }
  ]
}

const filesForVariant = (options, componentName, variantName) => {
  const upcasedComponentName = upcaseFirstChar(componentName)
  const upcasedVariantName = upcaseFirstChar(variantName)

  return [
    {
      basename: `${upcasedVariantName}.vue`,
      data: `
<template>
  <${upcasedComponentName} v-bind="$props" />
</template>

<script>
import ${upcasedComponentName} from '../${upcasedComponentName}.vue'

export default {
  components: {
    ${upcasedComponentName}
  },

  props: ${upcasedComponentName}.props
}
</script>`
    }
  ]
}

module.exports = {
  filesForComponent,
  filesForVariant
}
