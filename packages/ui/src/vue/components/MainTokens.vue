<template>
  <div>
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

      <div class="uie-sot-xs">
        <content-text :item="page" />
      </div>
    </section>

    <div class="uie-sot-xl">
      <content-preview
        :id="id"
        :path="previewPath"
        :title="page.title"
        type="tokens"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '../../util'
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
      return `${window.UIengine.base}_tokens/${this.page.id}.html`
    }
  },

  methods: {
    dasherize
  }
}
</script>
