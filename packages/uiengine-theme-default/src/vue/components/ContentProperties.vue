<template>
  <table :id="title">
    <caption>{{ title }}</caption>
    <thead>
      <tr>
        <th class="property__name">{{ 'entities.property_name' | localize }}</th>
        <th class="property__type">{{ 'entities.property_type' | localize }}</th>
        <th class="property__description">{{ 'entities.property_description' | localize }}</th>
        <th class="property__required">{{ 'entities.property_required' | localize }}</th>
        <th class="property__default">{{ 'entities.property_default' | localize }}</th>
      </tr>
    </thead>
    <tbody>
      <content-property
        v-for="(property, propertyId) in properties"
        :key="propertyId"
        :id="propertyId"
        :property="property"
        :entities="entities"
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
    },

    entities: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
}
</style>
