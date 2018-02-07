<template>
  <tr>
    <td class="property__name">{{ id }}</td>
    <td class="property__type">
      <component
        :is="propertyType"
        v-bind="$props"
      />
    </td>
    <td
      class="property__description"
      v-html="description"
    />
    <td class="property__required">{{ required }}</td>
    <td class="property__default">{{ defaultValue }}</td>
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

    entities: {
      type: Object,
      required: true
    }
  },

  computed: {
    // https://forum.vuejs.org/t/dynamically-compile-router-link/7410
    propertyType () {
      const [displayName, normalizedType] = this.property.type.match(/^\[?([\w\s|]+)\]?$/i)
      const customPropertyTypes = Object.keys(this.entities)
      let template = `<span>${displayName}</span>`

      if (customPropertyTypes.includes(normalizedType)) {
        const to = JSON.stringify({ path: '/_entities/', hash: normalizedType })
        template = `<router-link :to='${to}' class="" active-class="" exact-active-class="" exact>${displayName}</router-link>`
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
