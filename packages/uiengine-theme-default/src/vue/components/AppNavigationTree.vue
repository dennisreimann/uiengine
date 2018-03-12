<template>
  <ul
    class="navigation__tree"
    :class="levelClass"
  >
    <app-navigation-item
      v-for="itemId in items"
      v-if="navigation[itemId]"
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
    }
  }
}
</script>
