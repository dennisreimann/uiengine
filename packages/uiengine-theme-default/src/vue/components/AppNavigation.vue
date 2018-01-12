<template>
  <nav
    v-if="navigation"
    id="navigation"
    class="navigation"
    :class="{ 'navigation--collapsed': navigationCollapsed }"
  >
    <button
      class="navigation__menutoggle"
      data-target="navigation"
      @click.prevent="setNavigationCollapsed(!navigationCollapsed)"
    >
      <app-icon
        symbol="burger"
        class="navigation__icon"
      />
    </button>
    <router-link
      class="navigation__home"
      :to="navigation.index"
    >{{ config.name }}</router-link>
    <app-navigation-tree
      :navigation="navigation"
      :items="navigation.index.childIds"
      :level="0"
    />
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['config', 'navigation']),
    ...mapGetters('preferences', ['locale', 'navigationCollapsed'])
  },

  methods: {
    ...mapMutations('preferences', ['setNavigationCollapsed'])
  }
}
</script>
