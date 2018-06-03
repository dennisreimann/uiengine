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
  padding var(--uie-space-xxs) var(--uie-space-s)
  border 1px solid var(--uie-color-contentheader-tag-text)
  border-radius var(--uie-space-m)
  border-bottom-left-radius 0
  color var(--uie-color-contentheader-tag-text)
  font-size var(--uie-font-size-s)
  text-decoration none
</style>
