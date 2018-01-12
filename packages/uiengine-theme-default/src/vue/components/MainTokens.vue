<template>
  <section class="page">
    <content-header
      :title="page.title"
      class="sob-m"
    />
    <article
      v-if="page.content"
      class="content"
      v-html="renderedContent"
    />
    <template v-for="category in categories">
      <template v-if="isCategoryList(category.tokens)">
        <content-heading
          v-if="category.name"
          :key="category.name"
          :title="category.name"
          :level="1" />
        <template v-for="cat in category.tokens">
          <content-tokens
            :key="cat.name"
            :title="cat.name"
            :tokens="cat.tokens"
          />
        </template>
      </template>
      <template v-else>
        <content-tokens
          :key="category.name"
          :title="category.name"
          :tokens="category.tokens"
        />
      </template>
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentTokens from './ContentTokens'
import { decoratePageContent } from '../../util'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentTokens
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

    tokens () {
      return this.page.tokens
    },

    categories () {
      return this.isCategoryList(this.tokens)
        ? this.tokens
        : [{ tokens: this.tokens }]
    },

    renderedContent () {
      return this.page.content
        ? decoratePageContent(this.page)
        : null
    }
  },

  methods: {
    isCategoryList (tokens) {
      return tokens && tokens[0].type === 'category'
    }
  }
}
</script>
