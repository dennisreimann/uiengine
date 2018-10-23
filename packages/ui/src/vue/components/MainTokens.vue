<template>
  <div>
    <section class="page">
      <content-header
        :title="page.title"
      >
        <content-tag
          v-for="tag in page.tags"
          :key="tag"
          :tag="tag"
          class="uie-sob-m"
        />
      </content-header>

      <content-text
        :item="page"
        class="uie-sot-xs uie-sob-xxxl"
      />
    </section>

    <content-preview
      :id="id"
      :path="previewPath"
      :title="page.title"
      class="uie-sot-xl"
      type="tokens"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Preview from '../mixins/preview'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentText from './ContentText'
import ContentPreview from './ContentPreview'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentText,
    ContentLabel,
    ContentTag,
    ContentPreview
  },

  mixins: [
    Preview
  ],

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('state', ['config', 'pages']),

    page () {
      return this.pages[this.id]
    },

    previewPath () {
      return this.expandPreviewPath(`_tokens/${this.page.id}.html`)
    }
  }
}
</script>
