<template>
  <span class="label">
    <slot />
  </span>
</template>

<style lang="stylus" scoped>
.label
  padding var(--uie-space-xxs) var(--uie-space-s)
  border 1px solid var(--uie-color-label-border)
  border-radius 20rem
  color var(--uie-color-label-text)
  background var(--uie-color-label-bg)
  font-size var(--uie-font-size-xs)
  font-weight var(--uie-font-weight-bold)
</style>
