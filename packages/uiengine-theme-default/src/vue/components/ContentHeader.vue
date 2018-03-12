<template>
  <header class="contentheader">
    <content-heading
      v-if="title"
      class="contentheader__title"
    >{{ title }}</content-heading>
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

  &__title
    margin-right var(--space-s)
    margin-bottom var(--space-s)

  .label,
  .tag
    margin-left var(--space-s)

  &__options
    display flex
    margin-left auto
    margin-bottom var(--space-s)
    font-size var(--font-size-s)

  &__option
    display inline-block
    color var(--color-contentheader-link)
    text-decoration none
    transition-property color
    transition-duration var(--transition-duration-fast)

    &:not(&[aria-selected]):hover
      color var(--color-contentheader-link-hover)

    &[aria-selected]
      color var(--color-contentheader-link-current)
      font-family var(--font-family-bold)

  &__option + &__option
    margin-left var(--space-l)

  &__actions
    margin-left auto
    margin-bottom var(--space-xxs)

  &__options + &__actions
    margin-left 0

  &__actiontoggle
    appearance none
    margin-left var(--space-xl)
    transition-duration var(--transition-duration-fast)
    color var(--color-contentheader-link)
    background transparent
    cursor pointer
    icon-size(21px)

    &:focus,
    &:hover,
    &:active
      .icon
        fill var(--color-contentheader-link-hover)

    .icon
      transition-duration var(--transition-duration-fast)
      fill var(--color-contentheader-link)
      icon-size(21px)

  &__actionlist
    display none
    list-style none
    position absolute
    z-index 10
    right 0
    width 280px
    border 1px solid var(--color-modal-border-outer)

    &--active
      display block

  &__actionlink
    modal-option()

  &__action + &__action
    border-top 1px solid var(--color-modal-border-inner)
</style>
