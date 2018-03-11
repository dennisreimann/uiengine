<template>
  <nav
    v-if="navigation"
    id="navigation"
    class="navigation"
    :hidden="navigationCollapsed"
  >
    <app-navigation-tree
      v-if="navigation.index.childIds"
      :items="navigation.index.childIds"
      :navigation="navigation"
      :level="0"
    />
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed'])
  }
}
</script>

<style lang="stylus">
.navigation
  color var(--color-navigation-text)
  background var(--color-navigation-bg)

  @media $mq-up_to_l
    padding-top var(--space-s)
    padding-bottom var(--space-s)
  @media $mq-l_and_up
    // align it with the content heading
    padding-top calc(var(--space-xxl) - var(--space-xs))
    padding-bottom var(--space-xl)

  &__tree
    list-style none

  &__item
    position relative

    &--level-0
      font-size var(--font-size-s)

    &--level-0 + &--level-0
      margin-top var(--space-xs)

    &--level-0:not(&--collapsed) + &--level-0
      margin-top var(--space-l)

    @media $mq-l_and_up
      &:not(&--level-0)
        font-size var(--font-size-xs)

  &__item--collapsed &__tree
    display none

  &__item--collapsed &__icon
    transform rotate(-90deg)

  &__itemtoggle
    appearance none
    cursor pointer
    background transparent
    position absolute
    left 4px
    width 30px
    height 30px
    padding 6px
    &:focus,
    &:hover,
    &:active
      .navigation__icon
        fill var(--color-navigation-text-hover)
    @media $mq-up_to_m
      top 5px
    @media $mq-m_to_l
      top 7px
    @media $mq-l_and_up
      top 3px

    .navigation__icon
      icon-size(.75)

    .navigation__item--level-0 &,
    .navigation__item--level-1 &
      left var(--space-s)

    .navigation__item--level-2 &,
    .navigation__item--level-3 &,
    .navigation__item--level-4 &,
    .navigation__item--level-5 &
      left calc(var(--space-s) + var(--space-xl))

  &__icon
    icon-size(1)
    fill var(--color-navigation-text)
    transition-property transform
    transition-duration var(--transition-duration-fast)

  &__link
    display block
    color inherit
    text-decoration none
    border-left var(--space-xs) solid transparent
    padding-right var(--space-m)
    &[href]
      &:focus,
      &:hover,
      &:active
        color var(--color-navigation-text-hover)
    @media $mq-up_to_l
      padding-top var(--space-m)
      padding-bottom var(--space-m)
    @media $mq-l_and_up
      padding-top var(--space-s)
      padding-bottom var(--space-s)

    .navigation__item--level-0 &
      padding-left calc(var(--space-xxl) + var(--space-xs))
      color var(--color-navigation-text)
      background-color var(--color-navigation-bg)

    .navigation__item--level-1 &
      padding-left calc(var(--space-xxl) + var(--space-xs))
      color var(--color-navigation-text-subnav)
      background-color var(--color-navigation-bg-subnav)

    .navigation__item--level-2 &,
    .navigation__item--level-3 &,
    .navigation__item--level-4 &,
    .navigation__item--level-5 &
      padding-left calc(var(--space-xxl) + var(--space-xl))
      color var(--color-navigation-text-subnav)
      background-color var(--color-navigation-bg-subnav)

  &__item--current > &__link
    font-family var(--font-family-bold)
    color var(--color-navigation-text-current) !important
    background-color var(--color-navigation-bg-current) !important
    border-left-color var(--color-navigation-border-current)

  &__item--current > &__itemtoggle &__icon
    fill var(--color-navigation-text-current) !important
</style>
