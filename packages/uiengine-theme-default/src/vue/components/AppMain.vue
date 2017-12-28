<template>
  <main class="main">
    <router-view />
    <pre>{{ data }}</pre>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['config', 'components', 'navigation', 'pages', 'schema', 'variants']),

    pageId () {
      const path = this.$router.currentRoute.path.substring(1)
      const id = path.length === 0 ? 'index' : path

      return id
    },

    navItem () {
      return this.navigation[this.pageId]
    },

    page () {
      return this.pages[this.pageId]
    },

    data () {
      const d =  {
        // navigation: this.navigation,
        // pages: this.pages,
        // components: this.components,
        // schema: this.schema
      }

      return JSON.stringify(d, null, '  ')
    }
  },

  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  }
}
</script>
