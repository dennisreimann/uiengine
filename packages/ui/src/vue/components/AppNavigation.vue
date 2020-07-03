<template>
  <nav
    v-if="navigation"
    id="navigation"
    :hidden="navigationCollapsed"
    class="navigation"
    data-test-navigation
  >
    <RouterLink
      :to="navigation.index"
      class="navigation__project-details"
      active-class=""
      exact-active-class=""
    >
      <img
        v-if="config.logo"
        :src="config.logo"
        class="navigation__project-logo"
      >
      <h1
        class="navigation__project-name"
      >
        {{ config.name }}
      </h1>
    </RouterLink>
    <AppNavigationTree
      v-if="navigation.index.childIds"
      id="navigation-root"
      :items="navigation.index.childIds"
      :navigation="navigation"
      :level="0"
    />
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['config', 'navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed'])
  }
}
</script>

<style lang="stylus" scoped>
.navigation
  padding-right var(--uie-space-m)
  padding-left var(--uie-space-m)
  color var(--uie-color-navigation-text)
  background var(--uie-color-navigation-bg)

  @media $mq-up_to_l
    padding-top var(--uie-space-s)
    padding-bottom var(--uie-space-s)
  @media $mq-l_and_up
    // align it with the content heading
    padding-top var(--uie-space-xl)
    padding-bottom var(--uie-space-xl)

.navigation__project-details
  text-decoration none

.navigation__project-logo
  display block
  max-width 90%
  max-height 120px
  margin-right auto
  margin-bottom var(--uie-space-l)
  margin-left auto

.navigation__project-name
  padding-right var(--uie-space-s)
  padding-left var(--uie-space-s)
  margin-bottom var(--uie-space-m)
  text-align center
  color var(--uie-color-main-text)
  font-family var(--uie-font-family-bold)
  font-size var(--uie-font-size-l)
  font-weight var(--uie-font-weight-bold)
  text-decoration none
</style>
