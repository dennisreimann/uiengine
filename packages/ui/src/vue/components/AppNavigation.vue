<template>
  <nav
    v-if="navigation"
    id="navigation"
    :hidden="navigationCollapsed"
    class="navigation"
    data-test-navigation
  >
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
    ...mapGetters('state', ['navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed'])
  }
}
</script>

<style lang="stylus" scoped>
.navigation
  color var(--uie-color-navigation-text)
  background var(--uie-color-navigation-bg)

  @media $mq-up_to_l
    padding-top var(--uie-space-s)
    padding-bottom var(--uie-space-s)
  @media $mq-l_and_up
    // align it with the content heading
    padding-top calc(var(--uie-space-xxl) + var(--uie-space-m))
    padding-bottom var(--uie-space-xl)
</style>
