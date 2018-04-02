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
  color var(--color-main-text)
  background var(--color-main-bg)

.content
  max-width 55rem

  // remove bottom margin of last item, because the container cares for the spacing
  > :last-child
    margin-bottom 0 !important

  // markdown element styles, mostly spacings
  a:not([class]),
  a[class=""] // router-link can attach empty class
    link-with-hover(var(--color-main-link), var(--color-main-link-hover))

  p:not([class])
    margin-bottom var(--space-m)

  img:not([class])
    max-width 100%

  ol:not([class]),
  ul:not([class])
    margin-left var(--space-l)
    margin-bottom var(--space-m)

  li:not([class]) + li:not([class])
    margin-top var(--space-xs)

  table:not([class])
    margin-top var(--space-m)
    margin-bottom var(--space-xl)

    td:not([class])
      > :last-child
        margin-bottom 0

  pre.hljs
    margin-top var(--space-m)
    margin-bottom var(--space-m)

  pre.hljs,
  mark:not([class]),
  code:not([class])
    border-radius var(--space-xs)

  h1,
  h2,
  h3,
  h4,
  h5,
  h6
    &:not([class])
      margin-bottom var(--space-xs)

  p:not([class]),
  ul:not([class]),
  ol:not([class]),
  table:not([class]),
  pre.hljs
    +
      h2,
      h3
        &:not([class])
          margin-top var(--space-xl)
    +
      h4,
      h5
        &:not([class])
          margin-top var(--space-l)

    +
      h6
        &:not([class])
          margin-top var(--space-m)
</style>
