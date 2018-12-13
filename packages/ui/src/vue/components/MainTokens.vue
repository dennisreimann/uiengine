<template>
  <div>
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
      </ContentHeader>

      <ContentText
        :item="page"
        class="uie-sot-xs uie-sob-xxxl"
      />
    </section>

    <iframe
      ref="iframe"
      :src="iframeSrc"
      :title="page.title"
      frameborder="0"
      scrolling="no"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentText from './ContentText'
import ContentTag from './ContentTag'
import Iframe from '../mixins/iframe'

export default {
  components: {
    ContentHeader,
    ContentText,
    ContentTag
  },

  mixins: [
    Iframe
  ],

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('state', ['config', 'pages']),
    ...mapGetters('preferences', ['currentTheme']),

    page () {
      return this.pages[this.id]
    },

    iframeSrc () {
      return `${window.UIengine.base}_tokens/${this.currentTheme.id}/${this.page.id}.html`
    }
  },

  mounted () {
    this.resizableIframe(this.$refs.iframe)
  }
}
</script>

<style lang="stylus" scoped>
iframe
  display block
  width 100%
</style>
