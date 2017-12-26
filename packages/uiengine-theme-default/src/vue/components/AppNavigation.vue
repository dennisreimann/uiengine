<template>
  <nav id="navigation" class="navigation" v-if="navigation">
    <button class="navigation__menutoggle" data-target='navigation'>
      <!-- +icon('burger').navigation__icon -->
    </button>
    <router-link class="navigation__home" :to="navigation.index">{{ config.name }}</router-link>
    <app-navigation-tree :navigation="navigation" :items="navigation.index" :level="0" />
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import AppNavigationTree from './AppNavigationTree'

export default {
  components: {
    AppNavigationTree
  },

  computed: {
    ...mapGetters(['config', 'locale', 'navigation'])
  }
}
</script>
