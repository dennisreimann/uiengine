<template>
  <Fragment>
    <tr :class="levelClass">
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
    <template v-if="displayNestedProps">
      <ContentProperty
        v-for="(prop, propertyId) in nestedProps"
        :id="propertyId"
        :key="propertyId"
        :level="level + 1"
        :property="prop"
        :entities="entities"
        :display-description="displayDescription"
      />
    </template>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  components: {
    Fragment
  },

  props: {
    id: {
      type: String,
      required: true
    },

    level: {
      type: Number,
      default: 0
    },

    property: {
      type: Object,
      required: true
    },

    entities: {
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
      return ['Array', 'Object'].includes(type)
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
    },

    displayNestedProps () {
      return !!this.nestedProps
    },

    nestedProps () {
      const { value } = this.property

      if (value && typeof value === 'object') {
        return value.type && value.value ? value.value : value
      }

      return undefined
    },

    levelClass () {
      return `property--level-${this.level}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.property
  &--level-1 &__name
    padding-left var(--uie-space-xl) !important
  &--level-2 &__name
    padding-left calc(var(--uie-space-xl) * 2) !important
  &--level-3 &__name
    padding-left calc(var(--uie-space-xl) * 3) !important
  &--level-4 &__name
    padding-left calc(var(--uie-space-xl) * 4) !important
  &--level-5 &__name
    padding-left calc(var(--uie-space-xl) * 5) !important

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
