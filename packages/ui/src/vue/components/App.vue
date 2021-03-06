<template>
  <div
    id="app"
    class="layout"
    @click="closeModals"
  >
    <AppTopbar />
    <AppNavigation />
    <AppMain />
    <AppFooter />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppTopbar from './AppTopbar'
import AppNavigation from './AppNavigation'
import AppFooter from './AppFooter'
import AppMain from './AppMain'

const $html = document.documentElement
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
    this.$root.$on('setting-hljs', this.setHljs)
    this.$store.watch(() => this.$store.getters['preferences/currentTheme'], this.setCurrentTheme)

    const hljs = this.$store.getters['preferences/hljs']
    if (hljs) this.setHljs(hljs)
    this.setCurrentTheme(this.currentTheme)
  },

  methods: {
    closeModals () {
      this.$root.$emit('modal-close')
    },

    setHljs (hljs) {
      $hljs.setAttribute('href', HLJS_TMPL.replace('%s', hljs))
    },

    setCurrentTheme (theme) {
      $html.setAttribute('data-theme', theme.id)
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
@require "base/elements"
@require "base/utilities"

// general layout
@media $mq-up_to_l
  .navigation
    position relative

  .main
    padding-top var(--uie-space-xl)
    padding-bottom var(--uie-space-xl)

@media $mq-l_and_up
  .layout
    --topbar-height 4rem
    --navigation-width 264px
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
.footer
  @media $mq-up_to_m
    padding-left var(--uie-space-m)
    padding-right var(--uie-space-m)
  @media $mq-m_to_l
    padding-left var(--uie-space-l)
    padding-right var(--uie-space-l)

.topbar
  padding-left var(--uie-space-l)
  padding-right var(--uie-space-l)

.main,
.main + .footer
  @media $mq-l_to_xl
    padding-left var(--uie-space-xl)
    padding-right var(--uie-space-xl)
  @media $mq-xl_to_xxl
    padding-left var(--uie-space-xxl)
    padding-right var(--uie-space-xxl)
  @media $mq-xxl_and_up
    padding-left var(--uie-space-xxxl)
    padding-right var(--uie-space-xxxl)

.main
  @media $mq-xl_and_up
    padding-right calc(var(--uie-space-xxl) * 3 + 140px)

.in-page-nav
  margin-top var(--uie-space-xxl)
  @media $mq-xl_and_up
    display block
    position fixed
    top calc(var(--topbar-height) + var(--uie-space-xxl))
    right var(--uie-space-xxl)
    width 140px
    margin-top 0

@media print
  .topbar,
  .navigation,
  .footer
    display none !important
</style>
