<template>
  <table class="schema" :id="title">
    <caption class="schema__title">{{ title }}</caption>
    <thead>
      <tr>
        <th class="schema__propertyname">{{ 'schema.property_name' | localize }}</th>
        <th class="schema__propertytype">{{ 'schema.property_type' | localize }}</th>
        <th class="schema__propertydescription">{{ 'schema.property_description' | localize }}</th>
        <th class="schema__propertyrequired">{{ 'schema.property_required' | localize }}</th>
        <th class="schema__propertydefault">{{ 'schema.property_default' | localize }}</th>
      </tr>
    </thead>
    <tbody>
      <content-scheme-property v-for="(property, propertyId) in properties"
        :key="propertyId"
        :id="propertyId"
        :property="property"
        :schema="schema" />
    </tbody>
  </table>
</template>

<script>
import ContentSchemeProperty from './ContentSchemeProperty'

export default {
  components: {
    ContentSchemeProperty
  },

  props: {
    title: {
      type: String
    },

    properties: {
      type: Object,
      required: true
    },

    schema: {
      type: Object,
      required: true
    }
  }
}
</script>
