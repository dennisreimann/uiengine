<template>
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
      <div
        v-if="fileLink"
        class="contentheader__options"
      >
        <a
          :href="fileLink"
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
