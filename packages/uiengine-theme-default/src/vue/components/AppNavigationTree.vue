<template>
  <ul class="navigation__tree" :class="levelClass">
    <app-navigation-item v-for="itemId in items.childIds"
      :key="itemId"
      :navigation="navigation"
      :item="navigation[itemId]"
      :level="level" />
  </ul>
</template>

<script>
import AppNavigationItem from './AppNavigationItem'

export default {
  components: {
    AppNavigationItem
  },

  props: {
    navigation: {
      type: Object,
      required: true
    },

    items: {
      type: Object,
      required: true
    },

    level: {
      type: Number,
      required: true
    }
  },

  computed: {
    levelClass () {
      return `navigation__tree--level-${ this.level }`
    }
  }
}
</script>
