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

    <hr class="sections-divider">

    <iframe
      ref="iframe"
      :src="iframeSrc"
      :title="page.title"
      frameborder="0"
      scrolling="no"
      data-test-tokens-iframe
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
    this.mountResizableIframe(this.$refs.iframe)
  },

  beforeDestroy () {
    this.unmountResizableIframe(this.$refs.iframe)
  }
}
</script>

<style lang="stylus" scoped>
.sections-divider
  margin-top var(--uie-space-xxxl)
  margin-bottom var(--uie-space-xxxl)
  border-width 1px
  @media $mq-l_and_up
    margin-left calc(var(--uie-space-xl) * -1)
    margin-right calc(var(--uie-space-xl) * -1)
  @media $mq-xl_and_up
    margin-left calc(var(--uie-space-xxl) * -1)
    margin-right calc(var(--uie-space-xxl) * -1)

iframe
  display block
  width 100%
</style>
