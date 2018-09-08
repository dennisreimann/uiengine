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
      <div
        v-if="repoLink"
        class="contentheader__options"
      >
        <a
          :href="repoLink"
          class="contentheader__action"
        >
          <app-icon
            :title="'options.edit' | localize"
            symbol="pencil"
          />
        </a>
      </div>
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
    ...mapGetters('state', ['pages', 'config']),

    page () {
      return this.pages[this.id]
    },

    repoLink () {
      const { repoBaseUrl } = this.config.ui
      if (!repoBaseUrl) return null

      const { sourceFile, sourcePath } = this.page

      return `${repoBaseUrl}${sourceFile || sourcePath}`
    }
  }
}
</script>
