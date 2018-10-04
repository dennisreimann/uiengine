<template>
  <tbody>
    <tr
      v-for="(theme, index) in themes"
      :key="theme.id"
    >
      <td
        v-if="index === 0"
        :rowspan="themes.length"
        class="themeProperty__property uie-rowspan-right"
      >
        <div class="themeProperty__name">
          {{ themeProperty.name }}
        </div>
        <code
          v-if="themeProperty.variable"
          class="themeProperty__variablename"
        >{{ themeProperty.variable }}</code>
      </td>
      <td
        class="themeProperty__theme uie-rowspan-left"
      >{{ theme.title }}</td>
      <td class="themeProperty__value">{{ lookup(themeProperty.themes, theme.id, 'value') }}</td>
      <td class="themeProperty__visualization">
        <template v-if="lookup(themeProperty.themes, theme.id, 'value')">
          <span
            v-if="themeProperty.type === 'color'"
            class="themeProperty__swatch"
          >
            <span
              :style="{ backgroundColor: lookup(themeProperty.themes, theme.id, 'value') }"
              class="themeProperty__swatch__inner"
            />
          </span>

          <span
            v-else-if="themeProperty.type === 'size'"
            :style="{ width: lookup(themeProperty.themes, theme.id, 'value') }"
            class="themeProperty__size"
          />
        </template>
      </td>
      <td class="themeProperty__variable">{{ lookup(themeProperty.themes, theme.id, 'variable') }}</td>
      <td class="themeProperty__default">{{ isDefault(themeProperty.themes, theme.id) }}</td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: {
    themes: {
      type: Array,
      required: true
    },

    themeProperty: {
      type: Object,
      required: true
    }
  },

  methods: {
    lookup (themes, themeId, key) {
      return themes[themeId][key]
    },

    isDefault (themes, themeId) {
      if (!this.themeProperty.default) return false

      const { value: defaultValue, variable: defaultVariable } = this.themeProperty.default
      const { value, variable } = themes[themeId]
      const valMatches = (typeof defaultValue !== 'undefined' && defaultValue === value)
      const varMatches = (typeof defaultVariable !== 'undefined' && defaultVariable === variable)

      return valMatches || varMatches ? '*' : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.themeProperty
  &__variablename
    display inline-block
    margin-top var(--uie-space-xs)

  &__value,
  &__variable
    font-family var(--uie-font-family-code)

  &__default
    text-align center

  &__swatch
    display inline-block
    width 1.2em
    height 1.2em
    margin-right var(--uie-space-xs)
    border-radius 50%
    border-bottom-right-radius 0 !important
    border 1px solid var(--uie-color-border-medium)
    padding 2px

    &__inner
      display block
      width 100%
      height 100%
      border-radius 50%
      border-bottom-right-radius 0 !important

  &__size
    position relative
    bottom -.15em
    display inline-block
    height 1.2em
    border 1px solid var(--uie-color-accent-medium)
    background-color var(--uie-color-accent-extralight)

.themeProperty__property,
tbody tr:last-child td
  border-bottom-color var(--uie-color-border-medium)
</style>
