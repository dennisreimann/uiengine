<template>
  <span
    :class="{ 'label--inverted': inverted }"
    class="label"
  >
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    inverted: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.label
  padding var(--uie-space-xxs) var(--uie-space-s)
  border 1px solid var(--uie-color-contentheader-label-bg)
  border-radius 20rem
  color var(--uie-color-contentheader-label-text)
  background var(--uie-color-contentheader-label-bg)
  font-size var(--uie-font-size-xs)
  font-weight var(--uie-font-weight-bold)

  &--inverted
    color var(--uie-color-contentheader-label-bg)
    background var(--uie-color-contentheader-label-text)
    border-color var(--uie-color-contentheader-label-bg)
</style>
