<template>
  <section class="page">
    <content-header
      class="sob-m"
      :title="page.title"
    />
    <article
      v-if="page.content"
      class="content"
      v-html="renderedContent"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import { decoratePageContent } from '../../util'

export default {
  components: {
    ContentHeader
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('state', ['pages']),

    page () {
      return this.pages[this.id]
    },

    renderedContent () {
      return this.page.content
        ? decoratePageContent(this.page)
        : null
    }
  }
}
</script>
