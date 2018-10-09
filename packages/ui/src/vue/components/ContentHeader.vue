
<template>
  <header class="contentheader">
    <content-heading v-if="title">{{ title }}</content-heading>
    <slot />
  </header>
</template>

<script>
import ContentHeading from './ContentHeading'

export default {
  components: {
    ContentHeading
  },

  props: {
    title: {
      type: String,
      default: null
    },

    level: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="stylus" scoped>
.contentheader
  position relative
  display flex
  flex-wrap wrap
  align-items flex-end
  margin-bottom var(--uie-space-l)

  &__title
    margin-right var(--uie-space-s)
    margin-bottom var(--uie-space-s)

  .label,
  .tag
    margin-left var(--uie-space-s)
    margin-bottom calc(var(--uie-space-l) - var(--uie-space-xxs))

    .variant &
      margin-bottom var(--uie-space-m)

  &__options
    display flex
    align-items center
    margin-left auto
    margin-bottom var(--uie-space-s)
    font-size var(--uie-font-size-s)

  &__option
    display inline-block
    color var(--uie-color-contentheader-link)
    text-decoration none
    transition-property color
    transition-duration var(--uie-transition-duration-fast)

    &:not([aria-selected]):hover
      color var(--uie-color-contentheader-link-hover)

    &[aria-selected]
      color var(--uie-color-contentheader-link-current)
      font-family var(--uie-font-family-bold)

  &__option + &__option,
  &__action + &__option,
  &__action + &__action
    margin-left var(--uie-space-l)

  &__action
    color var(--uie-color-contentheader-link)
    transition-duration var(--uie-transition-duration-fast)
    text-decoration none

    &:focus,
    &:hover,
    &:active
      color var(--uie-color-contentheader-link-hover)
      .icon
        fill var(--uie-color-contentheader-link-hover)

    .icon
      transition-duration var(--uie-transition-duration-fast)
      fill var(--uie-color-contentheader-link)
      icon-size(24px)
</style>
