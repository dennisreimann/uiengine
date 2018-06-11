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
    <content-text :item="page" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentText from './ContentText'
import ContentTag from './ContentTag'

export default {
  components: {
    ContentHeader,
    ContentText,
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
    }
  }
}
</script>
