<template>
  <div class="topbar">
    <button
      :title="'navigation.toggle' | localize"
      :aria-expanded="!navigationCollapsed | bool2string"
      type="button"
      class="topbar__toggle topbar__toggle--menu"
      aria-controls="navigation-root"
      data-test-navtoggle
      @click.prevent="setNavigationCollapsed(!navigationCollapsed)"
    >
      <AppIcon
        class="topbar__icon"
        symbol="burger"
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
        placeholder="Search"
        class="topbar__searchfield"
        name="query"
        :aria-label="'search.label' | localize"
        data-test-searchfield
      >
    </form>

    <div
      v-if="themes && themes.length > 1"
      class="topbar__theme"
      data-test-theme-switch
    >
      <button
        :title="'options.toggle' | localize"
        class="topbar__theme-toggle"
        type="button"
        data-test-theme-switch-current
        @click.stop="isThemesActive = !isThemesActive"
      >
        {{ currentTheme.title }}

        <AppIcon
          class="topbar__theme-toggle-icon"
          symbol="caret-down"
        />
      </button>

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
            :data-test-theme-switch-id="theme.id"
            @click="setCurrentTheme(theme)"
          >
            {{ theme.title }}
          </button>
          <button
            class="topbar__theme-option topbar__theme-option--all"
            type="button"
            data-test-theme-switch-all
            @click="setCurrentThemeAll()"
          >
            {{ 'options.all_themes' | localize }}
          </button>
        </div>
      </div>
    </div>

    <button
      :title="'search.toggle' | localize"
      class="topbar__toggle topbar__toggle--search"
      type="button"
      @click.prevent="toggleSearch"
    >
      <AppIcon
        class="topbar__icon"
        symbol="search"
      />
    </button>
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
      return this.config.themes
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

    setCurrentThemeAll () {
      this.setCurrentTheme({
        id: '_all',
        title: this.$options.filters.localize('options.all_themes')
      })
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

<style lang="stylus" scoped>
.topbar
  --button-size 40px
  display flex
  flex-wrap wrap
  align-items center
  justify-content space-between
  color var(--uie-color-topbar-text)
  background var(--uie-color-topbar-bg)
  border-bottom: 1px solid var(--uie-color-neutral-30)

  a
    color var(--uie-color-topbar-text)

  &__home
    display block
    text-decoration none
    font-family var(--uie-font-family-regular)
    font-weight var(--uie-font-weight-regular)
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
    @media $mq-up_to_l
      margin-left auto

    &-toggle
      appearance none
      cursor pointer
      background transparent
      display inline-flex
      align-items center
      margin-left var(--uie-space-s)
      padding var(--uie-space-s)
      font-size var(--uie-font-size-s)
      font-weight var(--uie-font-weight-regular)
      color var(--uie-color-topbar-text)
      &:focus,
      &:hover,
      &:active
        color var(--uie-color-topbar-text-hover)
      &-icon
        icon-size(16px)
        margin-left var(--uie-space-m)
        fill var(--uie-color-topbar-text)

    &-options
      position absolute
      z-index 5
      top 2.35rem
      right 0

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
        border-radius var(--uie-base-border-radius)
        overflow hidden

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
    flex-grow 1
    max-width 600px
    margin-right var(--uie-space-m)
    padding-top var(--uie-space-m)
    padding-bottom var(--uie-space-m)
    @media $mq-up_to_l
      width 100%
      margin-right 0
      order 4
      &--collapsed
        display none

  &__searchfield
    --icon-size 16px
    width 100%
    background-color var(--uie-color-neutral-20)
    background-image embedurl('../../icons/magnifying-glass.svg')
    background-size var(--icon-size)
    background-repeat no-repeat
    background-position top 50% left var(--uie-space-s)
    border 1px solid transparent
    border-radius var(--uie-base-border-radius)
    padding-top var(--uie-space-s)
    padding-right var(--uie-space-s)
    padding-bottom var(--uie-space-s)
    padding-left calc(var(--icon-size) + var(--uie-space-l))
    font-family var(--uie-font-family-light)
    font-size var(--uie-font-size-m)

    &:focus
      border-color var(--uie-color-neutral-30)
      background-color var(--uie-color-neutral-0)
      outline none

    &::placeholder
      opacity 0.5
</style>
