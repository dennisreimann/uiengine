<template>
  <div
    id="app"
    :data-theme="themeId"
    class="layout"
    @click="closeModals"
  >
    <app-topbar />
    <app-navigation />
    <app-main />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppTopbar from './AppTopbar'
import AppNavigation from './AppNavigation'
import AppFooter from './AppFooter'
import AppMain from './AppMain'

const $hljs = document.getElementById('hljs')
const HLJS_TMPL = $hljs.getAttribute('data-tmpl')

export default {
  components: {
    AppTopbar,
    AppNavigation,
    AppFooter,
    AppMain
  },

  computed: {
    ...mapGetters('preferences', ['currentTheme']),

    themeId () {
      return this.currentTheme && this.currentTheme.id
    }
  },

  created () {
    this.$root.$on('setting:hljs', this.setHljs)

    const hljs = this.$store.getters['preferences/hljs']
    if (hljs) this.setHljs(hljs)
  },

  methods: {
    closeModals () {
      this.$root.$emit('modal:close')
    },

    setHljs (hljs) {
      $hljs.setAttribute('href', HLJS_TMPL.replace('%s', hljs))
    }
  },

  metaInfo () {
    const config = this.$store.getters['state/config']
    let siteTitle = config ? config.name : ''
    if (config && config.version) siteTitle += ` (${config.version})`

    return {
      titleTemplate (pageTitle) {
        return pageTitle ? `${pageTitle} • ${siteTitle}` : siteTitle
      }
    }
  }
}
</script>

<style lang="stylus">
@require "base/settings"
@require "base/fonts"
@require "base/utilities"
@require "base/elements"

// general layout
@media $mq-up_to_l
  .navigation
    position relative

  .main
    padding-top var(--uie-space-xl)
    padding-bottom var(--uie-space-xl)

@media $mq-l_and_up
  .layout
    --topbar-height 3rem
    --navigation-width 300px
    display flex
    flex-direction column
    height 100%

  .topbar
    position fixed
    z-index 1
    top 0
    left 0
    right 0
    height var(--topbar-height)

  .navigation
    position fixed
    top var(--topbar-height)
    left 0
    bottom 0
    width var(--navigation-width)
    overflow-y auto

  .main
    flex 1
    margin-top var(--topbar-height)
    margin-left var(--navigation-width)
    padding-top var(--uie-space-xxl)
    padding-bottom var(--uie-space-xxl)

  .footer
    margin-left var(--navigation-width)

  .navigation[hidden] + .main,
  .navigation[hidden] + .main + .footer
    margin-left 0

// aligned container paddings
.topbar,
.main,
.footer,
.sih--main
  @media $mq-up_to_m
    padding-left var(--uie-space-m)
    padding-right var(--uie-space-m)
  @media $mq-m_to_l
    padding-left var(--uie-space-l)
    padding-right var(--uie-space-l)

.topbar
  @media $mq-l_to_xl
    padding-left var(--uie-space-m)
    padding-right var(--uie-space-xl)
  @media $mq-xl_and_up
    padding-left var(--uie-space-m)
    padding-right var(--uie-space-xxl)
  @media $mq-xxl_and_up
    padding-left var(--uie-space-m)
    padding-right var(--uie-space-xxxl)

.main,
.main + .footer,
.sih--main
  @media $mq-l_and_up
    .navigation[hidden] + &
      padding-left calc(var(--uie-space-xxl) + var(--uie-space-s))
  @media $mq-l_to_xl
    padding-left var(--uie-space-xl)
    padding-right var(--uie-space-xl)
  @media $mq-xl_to_xxl
    padding-left var(--uie-space-xxl)
    padding-right var(--uie-space-xxl)
  @media $mq-xxl_and_up
    padding-left var(--uie-space-xxxl)
    padding-right var(--uie-space-xxxl)

.soh--main-escape
  @media $mq-up_to_m
    margin-left calc(var(--uie-space-m) * -1)
    margin-right calc(var(--uie-space-m) * -1)
  @media $mq-m_to_l
    margin-left calc(var(--uie-space-l) * -1)
    margin-right calc(var(--uie-space-l) * -1)
  @media $mq-l_and_up
    .navigation[hidden] + &
      margin-left calc((var(--uie-space-xxl) + var(--uie-space-s)) * -1)
  @media $mq-l_to_xl
    margin-left calc(var(--uie-space-xl) * -1)
    margin-right calc(var(--uie-space-xl) * -1)
  @media $mq-xl_to_xxl
    margin-left calc(var(--uie-space-xxl) * -1)
    margin-right calc(var(--uie-space-xxl) * -1)
  @media $mq-xxl_and_up
    margin-left calc(var(--uie-space-xxxl) * -1)
    margin-right calc(var(--uie-space-xxxl) * -1)
</style>
