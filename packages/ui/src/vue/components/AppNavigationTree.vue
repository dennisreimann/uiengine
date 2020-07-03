<template>
  <ul
    :class="levelClass"
    class="navigation__tree"
  >
    <AppNavigationItem
      v-for="itemId in navigationItems"
      :key="itemId"
      :navigation="navigation"
      :item="navigation[itemId]"
      :level="level"
    />
    <slot />
  </ul>
</template>

<script>
export default {
  props: {
    navigation: {
      type: Object,
      required: true
    },

    items: {
      type: Array,
      required: true
    },

    level: {
      type: Number,
      required: true
    }
  },

  computed: {
    levelClass () {
      return `navigation__tree--level-${this.level}`
    },

    navigationItems () {
      return this.items.filter(itemId => this.navigation[itemId] !== undefined)
    }
  }
}
</script>

<style lang="stylus" scoped>
.navigation
  &__tree
    list-style none
    &--level-0
      @media $mq-l_and_up
        margin-top var(--uie-space-xxl)
</style>
