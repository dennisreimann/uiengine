<template>
  <tr>
    <td class="schema__propertyname">{{ id }}</td>
    <td class="schema__propertytype"><component v-bind:is="propertyType" v-bind="$props" /></td>
    <td class="schema__propertydescription" v-html="description" />
    <td class="schema__propertyrequired">{{ required }}</td>
    <td class="schema__propertydefault">{{ defaultValue }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },

    property: {
      type: Object,
      required: true
    },

    schema: {
      type: Object,
      required: true
    }
  },

  computed: {
    // https://forum.vuejs.org/t/dynamically-compile-router-link/7410
    propertyType () {
      const [displayName, normalizedType] = this.property.type.match(/^\[?([\w\s|]+)\]?$/i)
      const customPropertyTypes = Object.keys(this.schema)
      let template = `<span>${displayName}</span>`

      if (customPropertyTypes.includes(normalizedType)) {
        const to = JSON.stringify({ path: '/_schema', hash: normalizedType })
        template = `<router-link :to='${to}' exact>${displayName}</router-link>`
      }

      return {
        template,
        props: this.$options.props
      }
    },

    description () {
      return this.property.description
    },

    required () {
      return this.property.required ? '*' : ''
    },

    defaultValue () {
      return this.property.default
    }
  }
}
</script>
