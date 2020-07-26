<template>
  <RouterLink
    :to="target"
    class="tag"
  >
    {{ tag }}
  </RouterLink>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: true
    }
  },

  computed: {
    target () {
      return {
        name: 'search',
        params: { query: this.tag }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.tag
  position relative
  padding var(--uie-space-xxs) var(--uie-space-s)
  border 1px solid var(--uie-color-tag-border)
  border-radius 20rem
  color var(--uie-color-tag-text)
  font-size var(--uie-font-size-xs)
  font-weight var(--uie-font-weight-bold)
  text-decoration none
</style>
