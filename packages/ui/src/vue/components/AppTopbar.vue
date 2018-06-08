<template>
  <div class="topbar">
    <button
      :title="'navigation.toggle' | localize"
      :aria-expanded="!navigationCollapsed | bool2string"
      type="button"
      class="topbar__toggle topbar__toggle--menu"
      aria-controls="navigation-root"
      @click.prevent="setNavigationCollapsed(!navigationCollapsed)"
    >
      <app-icon
        class="topbar__icon"
        symbol="burger"
      />
    </button>

    <router-link
      :to="navigation.index"
      class="topbar__home"
    >{{ config.name }}</router-link>

    <div
      v-if="themes"
      class="topbar__theme"
    >
      <button
        :title="'options.toggle' | localize"
        class="topbar__theme-toggle"
        type="button"
        @click.stop="isThemesActive = !isThemesActive"
      >{{ currentTheme.title }}</button>

      <div
        :class="{ 'topbar__theme-options--active': isThemesActive }"
        class="topbar__theme-options"
      >
        <div class="topbar__theme-options-inner">
          <button
            v-for="theme in themes"
            :key="theme.id"
            class="topbar__theme-option"
            type="button"
            @click="setCurrentTheme(theme)"
          >{{ theme.title }}</button>
        </div>
      </div>
    </div>

    <span class="topbar__spacer" />

    <button
      :title="'search.toggle' | localize"
      class="topbar__toggle topbar__toggle--search"
      type="button"
      @click.prevent="toggleSearch"
    >
      <app-icon
        class="topbar__icon"
        symbol="search"
      />
    </button>

    <form
      :class="{'topbar__search--collapsed': searchCollapsed}"
      class="topbar__search"
      @submit.prevent="search"
    >
      <input
        ref="searchfield"
        v-model="query"
        type="search"
        class="topbar__searchfield"
        name="query"
      >
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      query: '',
      isThemesActive: false
    }
  },

  computed: {
    ...mapGetters('state', ['config', 'navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed', 'searchCollapsed', 'currentTheme']),

    themes () {
      return this.config.ui.themes
    }
  },

  created () {
    this.$root.$on('modal:close', () => {
      this.isThemesActive = false
    })
  },

  methods: {
    ...mapMutations('preferences', ['setNavigationCollapsed', 'setSearchCollapsed', 'setCurrentTheme']),

    search () {
      const query = this.query.trim()

      if (query.length) {
        this.$router.push({
          name: 'search',
          params: { query }
        })
      }
    },

    toggleSearch () {
      this.setSearchCollapsed(!this.searchCollapsed)

      if (!this.searchCollapsed) {
        window.requestAnimationFrame(() => {
          this.$refs.searchfield.focus()
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.topbar
  --button-size 40px
  display flex
  flex-wrap wrap
  align-items center
  justify-content space-between
  color var(--uie-color-topbar-text)
  background var(--uie-color-topbar-bg)

  a
    color var(--uie-color-topbar-text)

  &__home
    display block
    text-decoration none
    font-family var(--uie-font-family-regular)
    margin-right var(--uie-space-m)
    &:focus,
    &:hover,
    &:active
      color var(--uie-color-topbar-text-hover)
    @media $mq-up_to_l
      font-size var(--uie-font-size-m)
    @media $mq-l_and_up
      font-size var(--uie-font-size-l)

  &__theme
    position relative

    &-toggle
      appearance none
      cursor pointer
      background transparent
      display inline-block
      padding-top var(--uie-space-xs)
      font-family var(--uie-font-family-light)
      color var(--uie-color-topbar-text)
      &:focus,
      &:hover,
      &:active
        color var(--uie-color-topbar-text-hover)
      @media $mq-up_to_l
        font-size var(--uie-font-size-s)
      @media $mq-l_and_up
        font-size var(--uie-font-size-m)

    &-options
      position absolute
      z-index 5
      top 2.35rem
      left calc(var(--uie-space-m) * -1)

      max-height 0
      transition-duration var(--uie-transition-duration-medium)
      transition-property max-height
      transition-timing-function ease-out
      overflow hidden

      &--active
        max-height 30rem
        transition-timing-function ease-in

      &-inner
        border 1px solid var(--uie-color-modal-border-outer)

    &-option
      modal-option()

    &-option + &-option
      border-top 1px solid var(--uie-color-modal-border-inner)

  &__spacer
    margin-right auto

  &__toggle
    flex 0 0 var(--button-size)
    appearance none
    cursor pointer
    background transparent
    width var(--button-size)
    height var(--button-size)
    padding 8px
    &:focus,
    &:hover,
    &:active
      .topbar__icon
        fill var(--uie-color-topbar-text-hover)

    &--menu
      margin-left calc(var(--uie-space-s) * -1)
      margin-right var(--uie-space-xs)
    &--search
      margin-left var(--uie-space-xs)
      margin-right calc(var(--uie-space-s) * -1)

    @media $mq-l_and_up
      &--search
        display none

  &__icon
    icon-size(24px)
    fill var(--uie-color-topbar-text)
    transition-property transform
    transition-duration var(--uie-transition-duration-fast)

  &__search
    @media $mq-up_to_l
      flex 1 1 100%
      padding-top var(--uie-space-xs)
      padding-bottom var(--uie-space-m)
      &--collapsed
        display none

    @media $mq-l_and_up
      width 300px
      margin-left var(--uie-space-l)
      // nudge it a little to the right so that it looks visually aligned
      // with the content. this is because of the fields border-radius.
      margin-right calc(var(--uie-space-xs) * -1)

  &__searchfield
    --icon-size 16px
    width 100%
    background-image embedurl('../../icons/magnifying-glass.svg')
    background-size var(--icon-size)
    background-repeat no-repeat
    background-position top 50% left var(--uie-space-s)
    border-radius var(--uie-space-xs)
    padding-top var(--uie-space-xs)
    padding-right var(--uie-space-s)
    padding-bottom var(--uie-space-xs)
    padding-left calc(var(--icon-size) + var(--uie-space-m))
    font-family var(--uie-font-family-light)
    font-size var(--uie-font-size-m)
</style>
