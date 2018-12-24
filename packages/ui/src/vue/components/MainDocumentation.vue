<template>
  <section class="page">
    <ContentHeader
      :title="page.title"
    >
      <ContentTag
        v-for="tag in page.tags"
        :key="tag"
        :tag="tag"
        class="uie-sob-m"
      />
      <div
        v-if="fileLink"
        class="contentheader__options"
      >
        <a
          :href="fileLink"
          class="contentheader__action"
          :aria-label="'options.edit' | localize"
        >
          <AppIcon symbol="pencil" />
        </a>
      </div>
    </ContentHeader>
    <ContentText :item="page" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Docs from '../mixins/docs'
import ContentHeader from './ContentHeader'
import ContentText from './ContentText'
import ContentTag from './ContentTag'

export default {
  components: {
    ContentHeader,
    ContentText,
    ContentTag
  },

  mixins: [
    Docs
  ],

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('state', ['pages', 'config']),

    page () {
      return this.pages[this.id]
    },

    fileLink () {
      return this.findFileLink(this.page)
    }
  }
}
</script>
