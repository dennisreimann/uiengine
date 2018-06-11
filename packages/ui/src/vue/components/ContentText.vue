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
        const url = new URL(target.href)
        const to = url.pathname

        // do not handle same page links/anchors
        if (window.location.pathname !== to) {
          $event.preventDefault()
          this.$router.push(to)
        }
      }
    }
  }
}
</script>
