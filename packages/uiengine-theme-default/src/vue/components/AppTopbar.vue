<template>
  <div class="topbar">
    <button
      type="button"
      class="topbar__toggle topbar__toggle--menu"
      :title="'navigation.toggle' | localize"
      aria-controls="navigation-root"
      :aria-expanded="!navigationCollapsed | bool2string"
      @click.prevent="setNavigationCollapsed(!navigationCollapsed)"
    >
      <app-icon
        class="topbar__icon"
        symbol="burger"
      />
    </button>

    <router-link
      class="topbar__home"
      :to="navigation.index"
    >{{ config.name }}</router-link>

    <button
      type="button"
      class="topbar__toggle topbar__toggle--search"
      :title="'search.toggle' | localize"
      @click.prevent="toggleSearch"
    >
      <app-icon
        class="topbar__icon"
        symbol="search"
      />
    </button>

    <form
      class="topbar__search"
      :class="{'topbar__search--collapsed': searchCollapsed}"
      @submit.prevent="search"
    >
      <input
        type="search"
        class="topbar__searchfield"
        ref="searchfield"
        name="query"
        v-model="query"
      >
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      query: ''
    }
  },

  computed: {
    ...mapGetters('state', ['config', 'navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed', 'searchCollapsed'])
  },

  methods: {
    ...mapMutations('preferences', ['setNavigationCollapsed', 'setSearchCollapsed']),

    search () {
      this.$router.push({
        name: 'search',
        params: { query: this.query }
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

<style lang="stylus">
.topbar
  --button-size 40px
  display flex
  flex-wrap wrap
  align-items center
  justify-content space-between
  color var(--color-topbar-text)
  background var(--color-topbar-bg)

  a
    color var(--color-topbar-text)

  &__home
    display block
    text-decoration none
    font-family var(--font-family-regular)
    &:focus,
    &:hover,
    &:active
      color var(--color-topbar-text-hover)
    @media $mq-up_to_l
      flex 1
      margin-left var(--space-s)
      margin-right var(--space-s)
      text-align center
    @media $mq-l_and_up
      font-size var(--font-size-l)
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
        fill var(--color-topbar-text-hover)

    &--menu
      margin-left calc(var(--space-s) * -1)
      margin-right var(--space-xs)
    &--search
      margin-left var(--space-xs)
      margin-right calc(var(--space-s) * -1)

    @media $mq-l_and_up
      &--search
        display none

  &__icon
    icon-size(24px)
    fill var(--color-topbar-text)
    transition-property transform
    transition-duration var(--transition-duration-fast)

  &__search
    @media $mq-up_to_l
      flex 1 1 100%
      padding-top var(--space-xs)
      padding-bottom var(--space-m)
      &--collapsed
        display none

    @media $mq-l_and_up
      width 300px
      margin-left var(--space-l)
      // nudge it a little to the right so that it looks visually aligned
      // with the content. this is because of the fields border-radius.
      margin-right calc(var(--space-xs) * -1)

  &__searchfield
    --icon-size 16px
    width 100%
    background-image embedurl('../../icons/magnifying-glass.svg')
    background-size var(--icon-size)
    background-repeat no-repeat
    background-position top 50% left var(--space-s)
    border-radius var(--space-xs)
    padding-top var(--space-xs)
    padding-right var(--space-s)
    padding-bottom var(--space-xs)
    padding-left calc(var(--icon-size) + var(--space-m))
    font-family var(--font-family-light)
    font-size var(--font-size-m)
</style>
