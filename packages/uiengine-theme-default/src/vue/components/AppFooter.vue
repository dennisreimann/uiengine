<template>
  <footer class="footer">
    <router-link
      :to="prevPage"
      v-if="prevPage"
    >&lt; {{ prevPage.title }}</router-link>
    <router-link
      :to="nextPage"
      v-if="nextPage"
    >{{ nextPage.title }} &gt;</router-link>
    <p
      v-if="config.copyright"
      class="footer__copyright"
      v-html="config.copyright"
    />
    <p
      v-if="config.version"
      class="footer__version"
    >
      {{ 'footer.version' | localize }} {{ config.version }} –
      {{ 'footer.last_update' | localize }} {{ lastUpdate }}.
    </p>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['config', 'navigation']),
    ...mapGetters('preferences', ['locale']),

    lastUpdate () {
      return new Date(this.config.update).toLocaleString(this.locale)
    },

    navItem () {
      const { navItemId } = this.$route.meta
      return this.navigation[navItemId]
    },

    prevPage () {
      return this.findPrevPage(this.$route.meta.navItemId, true)
    },

    nextPage () {
      return this.findNextPage(this.$route.meta.navItemId, true)
    }
  },

  methods: {
    findPrevPage (navItemId, skipSelf = false, skipChildren = true) {
      if (!navItemId) return
      const navItem = this.navigation[navItemId]
      const { childIds, siblingBeforeId, parentId } = navItem
      if (!skipChildren && childIds.length) {
        return this.findPrevPage(childIds[childIds.length - 1], false, false)
      } else if (!skipSelf && !navItem.isStructural) {
        return navItem
      } else if (siblingBeforeId) {
        return this.findPrevPage(siblingBeforeId, false, false)
      } else if (parentId) {
        return this.findPrevPage(parentId, false, true)
      }
    },

    findNextPage (navItemId, skipSelf = false, skipChildren = false) {
      if (!navItemId) return
      const navItem = this.navigation[navItemId]
      const { childIds, siblingAfterId, parentId } = navItem
      if (!skipSelf && !navItem.isStructural) {
        return navItem
      } else if (!skipChildren && childIds.length) {
        return this.findNextPage(childIds[0])
      } else if (siblingAfterId) {
        return this.findNextPage(siblingAfterId)
      } else if (parentId) {
        return this.findNextPage(parentId, true, true)
      }
    }
  }
}
</script>

<style lang="stylus">
.footer
  color var(--color-footer-text)
  background var(--color-footer-bg)
  font-size var(--font-size-xs)
  padding-top var(--space-l)
  padding-bottom var(--space-l)

  a
    color var(--color-footer-text)
</style>

<docs>
Appears at the bottom of each page.
Contains the copyright and version information, as well as the date of the last update.
</docs>
