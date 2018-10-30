<template>
  <li
    :class="classes"
    class="navigation__item"
  >
    <span
      v-if="item.isStructural"
      class="navigation__link"
    >{{ title }}</span>
    <router-link
      v-else
      :to="item"
      class="navigation__link"
    >{{ title }}</router-link>
    <button
      v-if="children"
      :aria-expanded="!isCollapsed | bool2string"
      :title="'navigation.toggle' | localize"
      type="button"
      class="navigation__itemtoggle"
      aria-haspopup="true"
      @click.prevent="setCollapsed(!isCollapsed)"
    >
      <app-icon
        class="navigation__icon"
        symbol="caret-down"
      />
    </button>
    <app-navigation-tree
      v-if="children"
      ref="children"
      :navigation="navigation"
      :items="children"
      :level="level + 1"
    />
  </li>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    navigation: {
      type: Object,
      required: true
    },

    item: {
      type: Object,
      required: true
    },

    level: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters('preferences', ['navigationItemsCollapsed']),

    children () {
      return this.item.childIds
    },

    isCurrentPage () {
      return this.$route.path === this.item.path
    },

    isCollapsed () {
      return this.navigationItemsCollapsed[this.item.id] || false
    },

    title () {
      const { title, localizedTitleKey } = this.item
      return localizedTitleKey
        ? this.$options.filters.localize(localizedTitleKey)
        : title
    },

    classes () {
      const classes = [`navigation__item--level-${this.level}`]

      if (this.children) classes.push('navigation__item--children')
      if (this.isCollapsed) classes.push('navigation__item--collapsed')
      if (this.isCurrentPage) classes.push('navigation__item--current')

      return classes
    }
  },

  methods: {
    ...mapMutations('preferences', ['setNavigationItemsCollapsed']),

    setCollapsed (collapsed) {
      const itemsCollapsed = this.navigationItemsCollapsed
      itemsCollapsed[this.item.id] = collapsed
      this.setNavigationItemsCollapsed(itemsCollapsed)

      if (!collapsed) {
        this.$refs.children.$el.querySelector('a.navigation__link').focus()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.navigation
  &__item
    position relative

    &--level-0
      font-size var(--uie-font-size-s)

    &--level-0 + &--level-0
      margin-top var(--uie-space-xs)

    &--level-0&--children:not(&--collapsed) + &--level-0
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
    font-weight var(--uie-font-weight-bold)
    color var(--uie-color-navigation-text-current) !important
    background-color var(--uie-color-navigation-bg-current) !important
    border-left-color var(--uie-color-navigation-border-current)

  &__item--current > &__itemtoggle &__icon
    fill var(--uie-color-navigation-text-current) !important
</style>
