<template>
  <section class="page">
    <content-header :title="page.title" class="sob-m" />
    <article class="content" v-if="page.content" v-html="renderedContent" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import { decoratePageContent } from '../util'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    ContentHeader
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
