<template>
  <article
    v-if="item.content"
    class="content"
    @click="handleLinkClicks"
    v-html="renderedContent"
  />
</template>

<script>
import { decorateContent } from '../../util'

export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },

  computed: {
    renderedContent () {
      return this.item.content
        ? decorateContent(this.item)
        : null
    }
  },

  methods: {
    handleLinkClicks ($event) {
      const { target } = $event

      if (target && target.matches(".content a:not([href*='://'])") && target.href) {
        // some sanity checks taken from vue-router:
        // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
        const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = $event
        // don't handle with control keys
        if (metaKey || altKey || ctrlKey || shiftKey) return
        // don't handle when preventDefault called
        if (defaultPrevented) return
        // don't handle right clicks
        if (button !== undefined && button !== 0) return
        // don't handle if `target="_blank"`
        if (target && target.getAttribute) {
          const linkTarget = target.getAttribute('target')
          if (/\b_blank\b/i.test(linkTarget)) return
        }
        // try to resolve url and see if it is internal
        const { base } = window.UIengine.state.config.ui
        const baseRegex = new RegExp(`^${base}`)
        const url = new URL(target.href)
        const targetPath = url.pathname
        const windowPath = window.location.pathname
        const to = targetPath.replace(baseRegex, '/')
        const from = windowPath.replace(baseRegex, '/')
        const route = this.$router.resolve(to)
        const isInNavigation = route.resolved.meta.navItemId !== undefined
        const isSamePage = from === to
        // don't handle same page links/anchors or non-internal urls
        if (isInNavigation && !isSamePage && $event.preventDefault) {
          $event.preventDefault()
          this.$router.push(to)
        }
      }
    }
  }
}
</script>
