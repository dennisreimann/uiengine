<template>
  <footer class="footer">
    <p
      v-if="prevPage || nextPage"
      class="footer__nav"
    >
      <router-link
        v-if="prevPage"
        :to="prevPage"
        class="footer__prevlink"
      >
        <app-icon symbol="caret-left" />
        {{ prevPage.title }}
      </router-link>
      <router-link
        v-if="nextPage"
        :to="nextPage"
        class="footer__nextlink"
      >
        {{ nextPage.title }}
        <app-icon symbol="caret-right" />
      </router-link>
    </p>
    <div>
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
    </div>
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
      const { childIds, prevSiblingId, parentId } = navItem
      if (!skipChildren && childIds) {
        return this.findPrevPage(childIds[childIds.length - 1], false, false)
      } else if (!skipSelf && !navItem.isStructural) {
        return navItem
      } else if (prevSiblingId) {
        return this.findPrevPage(prevSiblingId, false, false)
      } else if (parentId) {
        return this.findPrevPage(parentId, false, true)
      }
    },

    findNextPage (navItemId, skipSelf = false, skipChildren = false) {
      if (!navItemId) return
      const navItem = this.navigation[navItemId]
      const { childIds, nextSiblingId, parentId } = navItem
      if (!skipSelf && !navItem.isStructural) {
        return navItem
      } else if (!skipChildren && childIds) {
        return this.findNextPage(childIds[0])
      } else if (nextSiblingId) {
        return this.findNextPage(nextSiblingId)
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
    link-with-hover(var(--color-footer-link), var(--color-footer-link-hover), false)
    .icon
      icon-size(18px)
      position relative
      top .4em
      margin 0 -.3rem

  &__nav
    display flex
    justify-content space-between
    margin-bottom var(--space-m)

    a + a
      margin-left var(--space-l)
</style>

<docs>
Appears at the bottom of each page.
Contains the copyright and version information, as well as the date of the last update.
</docs>
