<template>
  <tr>
    <td class="property__name">
      {{ id }}
    </td>
    <td class="property__type">
      {{ propertyType }}
    </td>
    <td
      v-if="displayDescription"
      class="property__description"
    >
      {{ description }}
    </td>
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

    displayDescription: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    propertyType () {
      const { value, type } = this.property
      return ['Array', 'Object'].includes(type) && value
        ? `${this.property.type}[${value.type || value}]`
        : this.property.type
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
  &__name,
  &__type,
  &__description code,
  &__default,
  &__required
    font-family var(--uie-font-family-code)

  &__type
    white-space nowrap

  &__required
    text-align center
</style>
