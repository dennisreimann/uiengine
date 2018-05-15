<template>
  <div>
    <section class="page">
      <content-header
        :title="page.title"
        class="sob-m"
      >
        <content-tag
          v-for="tag in page.tags"
          :key="tag"
          :tag="tag"
          class="sob-m"
        />
      </content-header>

      <div class="sot-xs">
        <div
          v-if="page.content"
          class="content"
          v-html="renderedContent"
        />
      </div>
    </section>

    <div class="sot-xl">
      <content-preview
        :id="id"
        :path="previewPath"
        :title="page.title"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize, decorateContent } from '../../util'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentPreview from './ContentPreview'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'

export default {
  components: {
    ContentHeader,
    ContentHeading,
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
    },

    renderedContent () {
      return this.page.content
        ? decorateContent(this.page)
        : null
    }
  },

  methods: {
    dasherize
  }
}
</script>
