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
      const typesSeparator = '|'
      const propsSeparator = ', '
      const customPropertyTypes = Object.keys(this.entities)
      const [, wrapStart, normalizedType, wrapEnd] = this.property.type.match(/^([[\\{])?([\w\s|,:]+)([\]\\}])?$/i)
      const normalizedTypes = normalizedType.split(typesSeparator)
      const template = normalizedTypes.map(normalizedType => {
        const subTypes = normalizedType.split(propsSeparator)
        return subTypes.map(subType => {
          const [, propName, propType] = subType.match(/(\w*?:)?([\w]+)*/i)
          if (customPropertyTypes.includes(propType)) {
            const to = JSON.stringify({ path: '/_entities/', hash: normalizedType })
            return `${propName || ''}<router-link :to='${to}' class="" active-class="" exact-active-class="" exact>${propType}</router-link>`
          } else {
            return `${propName || ''}${propType}`
          }
        }).join(propsSeparator)
      }).join(typesSeparator)

      return {
        template: `<span>${wrapStart || ''}${template}${wrapEnd || ''}</span>`,
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
