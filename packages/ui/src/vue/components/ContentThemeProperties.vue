<template>
  <table :id="title">
    <caption>{{ title }}</caption>
    <thead>
      <tr>
        <th class="themeProperty__property">{{ 'theme_properties.property' | localize }}</th>
        <th class="themeProperty__theme">{{ 'theme_properties.theme' | localize }}</th>
        <th class="themeProperty__value">{{ 'theme_properties.value' | localize }}</th>
        <th class="themeProperty__visualization" />
        <th class="themeProperty__variable">{{ 'theme_properties.variable' | localize }}</th>
        <th class="themeProperty__default">{{ 'theme_properties.default' | localize }}</th>
      </tr>
    </thead>
    <content-theme-property
      v-for="themeProperty in themeProperties"
      :key="themeProperty.name"
      :themes="themes"
      :theme-property="themeProperty"
    />
  </table>
</template>

<script>
import ContentThemeProperty from './ContentThemeProperty'

export default {
  components: {
    ContentThemeProperty
  },

  props: {
    title: {
      type: String,
      required: true
    },

    themes: {
      type: Array,
      required: true
    },

    themeProperties: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.themeProperty__default
  width 6em
  text-align center
</style>
