<template>
  <section class="page">
    <content-header
      :title="page.title"
      class="uie-sob-m"
    >
      <content-tag
        v-for="tag in page.tags"
        :key="tag"
        :tag="tag"
        class="uie-sob-m"
      />
    </content-header>
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
import ContentTag from './ContentTag'
import { decorateContent } from '../../util'

export default {
  components: {
    ContentHeader,
    ContentTag
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
        ? decorateContent(this.page)
        : null
    }
  }
}
</script>
