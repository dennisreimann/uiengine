<template>
  <main class="main">
    <RouterView />
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
  > :last-child,
  .intro > :last-child,
  td:not([class]) > :last-child,
  details:not([class]) > :last-child
    margin-bottom 0 !important

  summary + *
    margin-top var(--uie-space-m)

  // markdown element styles, mostly spacings
  a:not([class]),
  a[class=""] // router-link can attach empty class
    link-with-hover(var(--uie-color-main-link), var(--uie-color-main-link-hover))

  p:not([class]),
  ol:not([class]),
  ul:not([class])
    margin-bottom var(--uie-space-l)

  ol:not([class]),
  ul:not([class])
    margin-left var(--uie-space-l)

  li:not([class]) + li:not([class])
    margin-top var(--uie-space-xs)

  .intro,
  table:not([class])
    margin-bottom var(--uie-space-xxl)

  figure:not([class])
    border 1px solid var(--uie-color-border-light)
    padding var(--uie-space-m)

  img:not([class])
    max-width 100%

  hr,
  pre,
  figure:not([class]),
  details:not([class])
    margin-bottom var(--uie-space-xl)

  hr
    margin-top var(--uie-space-xl)
    margin-bottom var(--uie-space-xl)

  pre,
  mark:not([class]),
  code:not([class])
    border-radius var(--uie-space-xs)

  code:not([class])
    border 1px solid var(--uie-color-border-dark)

  pre code:not([class])
    border-width 0

  h1,
  h2,
  h3
    &:not([class])
      margin-bottom var(--uie-space-l)

  h4
    &:not([class])
      margin-bottom var(--uie-space-m)

  h5,
  h6
    &:not([class])
      margin-bottom var(--uie-space-s)

  h1,
  h2,
  h3,
  h4,
  h5,
  h6
    &:not([class])
      color var(--uie-color-main-text)
      font-weight var(--uie-font-weight-bold)
      a
        text-decoration none

  pre,
  .intro,
  p:not([class]),
  ul:not([class]),
  ol:not([class]),
  table:not([class]),
  figure:not([class])
    +
      h2
        &:not([class])
          margin-top var(--uie-space-xxxl)

      h3
        &:not([class])
          margin-top var(--uie-space-xxl)
    +
      h4,
      h5
        &:not([class])
          margin-top var(--uie-space-xl)

    +
      h6
        &:not([class])
          margin-top var(--uie-space-l)

  p:not([class])
    +
      figure:not([class])
        margin-top calc(var(--uie-space-s) * -1)
</style>
