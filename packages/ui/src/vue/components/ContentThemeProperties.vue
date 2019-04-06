<template>
  <table :id="title">
    <caption>{{ title }}</caption>
    <thead>
      <tr>
        <th class="themeProperty__property">
          {{ 'token.property' | localize }}
        </th>
        <th
          v-if="displayAllThemes"
          class="themeProperty__theme"
        >
          {{ 'token.theme' | localize }}
        </th>
        <th class="themeProperty__value">
          {{ 'token.value' | localize }}
        </th>
        <th class="themeProperty__visualization" />
        <th class="themeProperty__variable">
          {{ 'token.variable' | localize }}
        </th>
        <th class="themeProperty__default">
          {{ 'token.default' | localize }}
        </th>
      </tr>
    </thead>
    <ContentThemeProperty
      v-for="themeProperty in themeProperties"
      :key="themeProperty.name"
      :themes="themes"
      :theme-property="themeProperty"
      :current-theme="currentTheme"
      :display-all-themes="displayAllThemes"
    />
  </table>
</template>

<script>
import { mapGetters } from 'vuex'
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

    themeProperties: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters('state', ['config']),
    ...mapGetters('preferences', ['currentTheme']),

    themes () {
      return this.config.themes
    },

    displayAllThemes () {
      return this.currentTheme.id === '_all'
    }
  }
}
</script>

<style lang="stylus" scoped>
table
  margin-bottom var(--uie-space-xl)

.themeProperty__default
  width 6em
  text-align center
</style>
