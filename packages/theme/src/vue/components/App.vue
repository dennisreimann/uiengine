<template>
  <div
    id="app"
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

  created () {
    this.$root.$on('setting:hljs', this.setHljs)

    const theme = this.$store.getters['preferences/hljs']
    if (theme) this.setHljs(theme)
  },

  methods: {
    closeModals () {
      this.$root.$emit('modal:close')
    },

    setHljs (theme) {
      $hljs.setAttribute('href', HLJS_TMPL.replace('%s', theme))
    }
  },

  metaInfo () {
    const config = this.$store.getters['state/config']
    const siteTitle = config ? `${config.name} (${config.version})` : ''

    return {
      titleTemplate (pageTitle) {
        return pageTitle ? `${pageTitle} • ${siteTitle}` : siteTitle
      }
    }
  }
}
</script>

<style lang="stylus">
@require "settings"
@require "global"
@require "utilities"

html
  height 100%
  line-height 1.5
  font-family var(--font-family-light)
  @media print
    font-size 10pt
  @media $mq-up_to_m
    font-size 14px
  @media $mq-m_to_l
    font-size 15px
  @media $mq-l_and_up
    font-size 16px

body
  height 100%

h1
h2
h3
  font-family var(--font-family-bold)
  font-weight 400

h1
  font-size var(--font-size-xl)
  line-height 1.25

h2
  font-size var(--font-size-l)
  line-height 1.35

h3
  font-size var(--font-size-m)

h4
h5
h6
  font-family var(--font-family-regular)
  font-size var(--font-size-m)
  font-weight normal

b,
em,
i,
strong
  font-style normal
  font-weight normal

i,
em
  font-family var(--font-family-lightitalic)

b,
strong
  font-family var(--font-family-bold)

b em,
b i,
em b,
em strong,
i b,
i strong,
strong em,
strong i
  font-family var(--font-family-bolditalic)

table
  border-collapse collapse

  caption
    font-family var(--font-family-regular)
    font-size var(--font-size-m)
    text-align left
    margin-bottom var(--space-s)

  th
    color var(--color-secondary-text)
    text-align left
    border-bottom 1px solid var(--color-border-medium)
    font-family var(--font-family-light)
    font-size var(--font-size-xs)
    font-weight normal

  td
    border-bottom 1px solid var(--color-border-light)
    font-size var(--font-size-s)

  th,
  td
    padding var(--space-xs) var(--space-m)
    &:first-child
      padding-left 0
    &:last-child
      padding-right 0

mark
  padding var(--space-xxs) var(--space-xs)
  border-radius var(--space-xs)
  background-color var(--color-accent-light)

code
  code-inline()

pre
  code-block()

// general layout
@media $mq-up_to_l
  .navigation
    position relative

  .main
    padding-top var(--space-xl)
    padding-bottom var(--space-xl)

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
    overflow-y scroll

  .main
    flex 1
    margin-top var(--topbar-height)
    margin-left var(--navigation-width)
    padding-top var(--space-xxl)
    padding-bottom var(--space-xxl)

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
    padding-left var(--space-m)
    padding-right var(--space-m)

  @media $mq-m_to_l
    padding-left var(--space-l)
    padding-right var(--space-l)

.topbar
  @media $mq-l_to_xl
    padding-left var(--space-m)
    padding-right var(--space-xl)
  @media $mq-xl_and_up
    padding-left var(--space-m)
    padding-right var(--space-xxl)
  @media $mq-xxl_and_up
    padding-left var(--space-m)
    padding-right var(--space-xxxl)

.main,
.main + .footer
  @media $mq-l_and_up
    .navigation[hidden] + &
      padding-left calc(var(--space-xxl) + var(--space-s))
  @media $mq-l_to_xl
    padding-left var(--space-xl)
    padding-right var(--space-xl)
  @media $mq-xl_to_xxl
    padding-left var(--space-xxl)
    padding-right var(--space-xxl)
  @media $mq-xxl_and_up
    padding-left var(--space-xxxl)
    padding-right var(--space-xxxl)
</style>
