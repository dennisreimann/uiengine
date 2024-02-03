<template>
  <header class="contentheader">
    <ContentHeading v-if="title">
      {{ title }}
    </ContentHeading>
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
  align-items center
  margin-bottom var(--uie-space-l)

  &__right
    display flex
    align-items center
    margin-left auto

  &__title
    margin-right var(--uie-space-s)
    margin-bottom var(--uie-space-s)
    @media $mq-xl_and_up
      margin-bottom 0

  .label,
  .tag
    margin-left var(--uie-space-s)
    margin-bottom calc(var(--uie-space-l) - var(--uie-space-xxs))
    @media $mq-xl_and_up
      margin-bottom 0

    .variant &
      margin-bottom var(--uie-space-m)
      @media $mq-xl_and_up
        margin-bottom 0

  &__edit
    display inline-flex
    align-items center

  &__edit-icon
    icon-size(16px)
    margin-left var(--uie-space-m)
    fill currentColor

  &__buttons
    display inline-flex
    align-items center

  &__options
    display flex
    align-items center
    margin-left auto
    margin-bottom var(--uie-space-s)
    font-size var(--uie-font-size-s)
    @media $mq-xl_and_up
      margin-bottom 0

  &__option
    display inline-flex
    align-items center
    height 32px
    padding var(--uie-space-s) var(--uie-space-m)
    border 1px solid var(--uie-color-contentheader-border)
    color var(--uie-color-contentheader-text)
    line-height 1.2
    text-decoration none
    transition-property color
    transition-duration var(--uie-transition-duration-fast)
    background-color var(--uie-color-contentheader-bg)

    &:first-child
      margin-left var(--uie-space-l)
      border-top-left-radius var(--uie-base-border-radius)
      border-bottom-left-radius var(--uie-base-border-radius)

    &:last-child
      border-top-right-radius var(--uie-base-border-radius)
      border-bottom-right-radius var(--uie-base-border-radius)

    &:not([aria-selected]):hover
      color var(--uie-color-contentheader-text-hover)
      background-color var(--uie-color-contentheader-bg-hover)

    &[aria-selected]:not(:only-child)
      color var(--uie-color-contentheader-text-current)
      background-color var(--uie-color-contentheader-bg-current)

    .icon
      fill currentColor
      transition-duration var(--uie-transition-duration-fast)
      icon-size(16px)

    &:focus,
    &:hover,
    &:active
      color var(--uie-color-contentheader-text-hover)

  &__option + &__option
    border-left-width 0

  &__action:not(&__option)
    display inline-flex
    align-items center
    margin-left var(--uie-space-l)
    color var(--uie-color-contentheader-text)
    cursor pointer
    background transparent
    font-family var(--uie-font-family-light)
    font-size var(--uie-font-size-s)
    font-weight var(--uie-font-weight-light)
    transition-duration var(--uie-transition-duration-fast)
    text-decoration none

    .icon
      fill currentColor
      transition-duration var(--uie-transition-duration-fast)
      icon-size(16px)

    &:focus,
    &:hover,
    &:active
      color var(--uie-color-contentheader-text-hover)
</style>
