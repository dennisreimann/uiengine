<template>
  <tr>
    <td class="property__name">
      {{ id }}
    </td>
    <td class="property__type">
      <Component
        :is="propertyType"
        v-bind="$props"
      />
    </td>
    <td
      class="property__description"
      v-html="description"
    />
    <td class="property__required">
      {{ required }}
    </td>
    <td class="property__default">
      {{ defaultValue }}
    </td>
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
    propertyType () {
      const regexp = new RegExp(
        // before: either the start of the string or a bounding character,
        // this is optional to make it non-greedy
        `(^|([[|:]))?` +
        // the type name match options
        `(${Object.keys(this.entities).join('|')})` +
        // after: either the end of the string or a bounding character
        `(([\\]|,}])|$)`, 'g')

      const output = this.property.type.replace(regexp, (match, before, unused, typeName, after) => {
        // https://forum.vuejs.org/t/dynamically-compile-router-link/7410
        const to = JSON.stringify({ path: '/_entities/', hash: typeName })
        return `${before || ''}<router-link :to='${to}' class="" active-class="" exact-active-class="" exact>${typeName}</router-link>${after || ''}`
      })

      return {
        template: `<span>${output}</span>`,
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

<style lang="stylus" scoped>
.property
  &__name
    width 10em

  &__type
    width 6em

  &__description
    width auto

  &__name,
  &__type,
  &__description code,
  &__default,
  &__required
    td&
      font-family var(--uie-font-family-code)

  &__required
    width 4em
    th&,
    td&
      text-align center

  &__default
    width 6em
</style>
