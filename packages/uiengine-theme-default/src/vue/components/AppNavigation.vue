<template>
  <nav
    v-if="navigation"
    id="navigation"
    class="navigation"
    :class="{ 'navigation--collapsed': navigationCollapsed }"
  >
    <button
      class="navigation__menutoggle"
      type="button"
      :title="'navigation.toggle' | localize"
      @click.prevent="setNavigationCollapsed(!navigationCollapsed)"
    >
      <app-icon
        symbol="burger"
        class="navigation__icon"
      />
    </button>
    <router-link
      class="navigation__home"
      :to="navigation.index"
    >{{ config.name }}</router-link>
    <app-navigation-tree
      :navigation="navigation"
      :items="navigation.index.childIds"
      :level="0"
    />
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['config', 'navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed'])
  },

  methods: {
    ...mapMutations('preferences', ['setNavigationCollapsed'])
  }
}
</script>

<style lang="stylus">
.navigation
  color var(--color-navigation-text)
  background var(--color-navigation-bg)

  &--collapsed &__tree
    @media $mq-up_to_l
      display none

  &__home
    display block
    color inherit
    text-decoration none
    text-align center
    font-family var(--font-family-regular)
    &:focus,
    &:hover,
    &:active
      color var(--color-navigation-text-hover)
    @media $mq-up_to_l
      padding var(--space-m) var(--space-xxl)
    @media $mq-l_and_up
      font-size var(--font-size-l)
      margin-top var(--space-xxs)
      padding var(--space-xxl) var(--space-m)

  &__tree
    list-style none

  &__item
    position relative

    &--level-0
      font-size var(--font-size-s)

    @media $mq-l_and_up
      &:not(&--level-0)
        font-size var(--font-size-xs)

  &__item--collapsed &__tree
    display none

  &__item--collapsed &__icon
    transform rotate(-90deg)

  &__menutoggle,
  &__itemtoggle
    appearance none
    cursor pointer
    background transparent
    position absolute
    &:focus,
    &:hover,
    &:active
      .navigation__icon
        fill var(--color-navigation-text-hover)

  &__menutoggle
    width 40px
    height 40px
    padding 8px
    @media $mq-up_to_m
      top 1px
    @media $mq-m_to_l
      top 3px
    @media $mq-l_and_up
      display none

  &__itemtoggle
    width 36px
    height 36px
    padding 6px
    @media $mq-up_to_m
      top 2px
    @media $mq-m_to_l
      top 4px
    @media $mq-l_and_up
      top 0

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
      padding-left var(--space-xxl)
      color var(--color-navigation-text)
      background-color var(--color-navigation-bg)

    .navigation__item--level-1 &
      padding-left var(--space-xxl)
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
