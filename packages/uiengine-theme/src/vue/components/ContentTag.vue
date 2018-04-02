<template>
  <router-link
    :to="target"
    class="tag"
  >{{ tag }}</router-link>
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
  padding var(--space-xxs) var(--space-s)
  border 1px solid var(--color-contentheader-tag-text)
  border-radius var(--space-m)
  border-bottom-left-radius 0
  color var(--color-contentheader-tag-text)
  font-size var(--font-size-s)
  text-decoration none
</style>
