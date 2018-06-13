<template>
  <nav
    v-if="navigation"
    id="navigation"
    :hidden="navigationCollapsed"
    class="navigation"
  >
    <app-navigation-tree
      v-if="navigation.index.childIds"
      id="navigation-root"
      :items="navigation.index.childIds"
      :navigation="navigation"
      :level="0"
    >
      <li
        :class="{ 'navigation__item--current': this.$route.path === '/_settings' }"
        class="navigation__item navigation__item--level-0"
      >
        <router-link
          :to="{ name: 'settings' }"
          class="navigation__link"
        >{{ 'settings.title' | localize }}</router-link>
      </li>
    </app-navigation-tree>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import AppNavigationItem from './AppNavigationItem'

export default {
  components: {
    AppNavigationItem
  },

  computed: {
    ...mapGetters('state', ['navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed'])
  }
}
</script>

<style lang="stylus">
.navigation
  color var(--uie-color-navigation-text)
  background var(--uie-color-navigation-bg)

  @media $mq-up_to_l
    padding-top var(--uie-space-s)
    padding-bottom var(--uie-space-s)
  @media $mq-l_and_up
    // align it with the content heading
    padding-top calc(var(--uie-space-xxl) - var(--uie-space-xs))
    padding-bottom var(--uie-space-xl)

  &__tree
    list-style none

  &__item
    position relative

    &--level-0
      font-size var(--uie-font-size-s)

    &--level-0 + &--level-0
      margin-top var(--uie-space-xs)

    &--level-0:not(&--collapsed) + &--level-0
      margin-top var(--uie-space-l)

    @media $mq-l_and_up
      &:not(&--level-0)
        font-size var(--uie-font-size-xs)

  &__item--collapsed &__tree
    display none

  &__item--collapsed &__icon
    transform rotate(-90deg)

  &__itemtoggle
    appearance none
    cursor pointer
    background transparent
    position absolute
    width 30px
    height 30px
    padding 6px

    @media $mq-up_to_m
      top 4px
    @media $mq-m_to_l
      top 5px
    @media $mq-l_and_up
      top 1px
      .navigation__item--level-0 > &
        top 2px

    &:focus,
    &:hover,
    &:active
      .navigation__icon
        fill var(--uie-color-navigation-text-hover)

    .navigation__icon
      icon-size(18px)

    .navigation__item--level-0 > &,
    .navigation__item--level-1 > &
      left var(--uie-space-s)

    .navigation__item--level-2 > &,
    .navigation__item--level-3 > &,
    .navigation__item--level-4 > &,
    .navigation__item--level-5 > &
      left calc(var(--uie-space-s) + var(--uie-space-xl))

  &__icon
    icon-size(24px)
    fill var(--uie-color-navigation-text)
    transition-property transform
    transition-duration var(--uie-transition-duration-fast)

  &__link
    display block
    color inherit
    text-decoration none
    border-left var(--uie-space-xs) solid transparent
    padding-right var(--uie-space-m)
    &[href]
      &:focus,
      &:hover,
      &:active
        color var(--uie-color-navigation-text-hover)
    @media $mq-up_to_l
      padding-top var(--uie-space-m)
      padding-bottom var(--uie-space-m)
    @media $mq-l_and_up
      padding-top var(--uie-space-s)
      padding-bottom var(--uie-space-s)

    .navigation__item--level-0 &
      padding-left calc(var(--uie-space-xxl) + var(--uie-space-xs))
      color var(--uie-color-navigation-text)
      background-color var(--uie-color-navigation-bg)

    .navigation__item--level-1 &
      padding-left calc(var(--uie-space-xxl) + var(--uie-space-xs))
      color var(--uie-color-navigation-text-subnav)
      background-color var(--uie-color-navigation-bg-subnav)

    .navigation__item--level-2 &,
    .navigation__item--level-3 &,
    .navigation__item--level-4 &,
    .navigation__item--level-5 &
      padding-left calc(var(--uie-space-xxl) + var(--uie-space-xl))
      color var(--uie-color-navigation-text-subnav)
      background-color var(--uie-color-navigation-bg-subnav)

  &__item--current > &__link
    font-family var(--uie-font-family-bold)
    color var(--uie-color-navigation-text-current) !important
    background-color var(--uie-color-navigation-bg-current) !important
    border-left-color var(--uie-color-navigation-border-current)

  &__item--current > &__itemtoggle &__icon
    fill var(--uie-color-navigation-text-current) !important
</style>
