<template>
  <span
    class="label"
    :class="{ 'label--inverted': inverted }"
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
  padding var(--space-xxs) var(--space-s)
  border 1px solid var(--color-contentheader-label-bg)
  border-radius var(--space-m)
  border-bottom-left-radius 0
  color var(--color-contentheader-label-text)
  background var(--color-contentheader-label-bg)
  font-size var(--font-size-s)

  &--inverted
    color var(--color-contentheader-label-bg)
    background var(--color-contentheader-label-text)
    border-color var(--color-contentheader-label-bg)
</style>
