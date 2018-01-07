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
