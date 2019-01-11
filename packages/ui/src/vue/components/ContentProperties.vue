<template>
  <table
    :id="title"
    :class="{ 'withDescription': displayDescription }"
  >
    <caption>{{ title }}</caption>
    <thead>
      <tr>
        <th class="property__name">
          {{ 'properties.name' | localize }}
        </th>
        <th class="property__type">
          {{ 'properties.type' | localize }}
        </th>
        <th
          v-if="displayDescription"
          class="property__description"
        >
          {{ 'properties.description' | localize }}
        </th>
        <th class="property__required">
          {{ 'properties.required' | localize }}
        </th>
        <th class="property__default">
          {{ 'properties.default' | localize }}
        </th>
      </tr>
    </thead>
    <tbody>
      <ContentProperty
        v-for="(property, propertyId) in properties"
        :id="propertyId"
        :key="propertyId"
        :property="property"
        :display-description="displayDescription"
      />
    </tbody>
  </table>
</template>

<script>
import ContentProperty from './ContentProperty'

export default {
  components: {
    ContentProperty
  },

  props: {
    title: {
      type: String,
      default: null
    },

    properties: {
      type: Object,
      required: true
    }
  },

  computed: {
    displayDescription () {
      return Object.values(this.properties).some(prop => prop.description)
    }
  }
}
</script>

<style lang="stylus" scoped>
table
  width 100%

table + table
  margin-top var(--uie-space-xxl)

.property
  &__name
    .withDescription &
      width 10em

  &__type
    width 12em

  &__description
    width auto

  &__required
    width 4em
    text-align center

  &__default
    width 6em
</style>
