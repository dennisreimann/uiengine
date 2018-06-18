<template>
  <main class="main">
    <router-view />
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

// common functionality for all main components
export default {
  computed: mapGetters('state', ['navigation']),

  metaInfo () {
    const { navItemId, navItemTitle } = this.$route.meta

    // prefer the navItem.title as is is reactive
    const navItem = this.navigation[navItemId]
    const title = navItem ? navItem.title : navItemTitle

    return { title }
  }
}
</script>

<style lang="stylus">
.main
  color var(--uie-color-main-text)
  background var(--uie-color-main-bg)

.content
  max-width 55rem

  // remove bottom margin of last item, because the container cares for the spacing
  > :last-child
    margin-bottom 0 !important

  // markdown element styles, mostly spacings
  a:not([class]),
  a[class=""] // router-link can attach empty class
    link-with-hover(var(--uie-color-main-link), var(--uie-color-main-link-hover))

  p:not([class])
    margin-bottom var(--uie-space-m)

  img:not([class])
    max-width 100%

  ol:not([class]),
  ul:not([class])
    margin-left var(--uie-space-l)
    margin-bottom var(--uie-space-m)

  li:not([class]) + li:not([class])
    margin-top var(--uie-space-xs)

  table:not([class])
    margin-top var(--uie-space-m)
    margin-bottom var(--uie-space-xl)

    td:not([class])
      > :last-child
        margin-bottom 0

  pre
    margin-top var(--uie-space-m)
    margin-bottom var(--uie-space-l)

  pre,
  mark:not([class]),
  code:not([class])
    border-radius var(--uie-space-xs)

  h1,
  h2,
  h3,
  h4,
  h5,
  h6
    &:not([class])
      margin-bottom var(--uie-space-xs)

  p:not([class]),
  ul:not([class]),
  ol:not([class]),
  table:not([class]),
  pre:not([class])
    +
      h2,
      h3
        &:not([class])
          margin-top calc(var(--uie-space-xl) + var(--uie-space-s))
    +
      h4,
      h5
        &:not([class])
          margin-top var(--uie-space-xl)

    +
      h6
        &:not([class])
          margin-top var(--uie-space-l)
</style>
