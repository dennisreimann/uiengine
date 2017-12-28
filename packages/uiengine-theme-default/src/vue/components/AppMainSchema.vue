<template>
  <section class="page">
    <content-header :title="page.title" class="sob-l" />
    <article class="content">
      <content-scheme v-for="(properties, schemeId) in schema"
        class="sob-xxl"
        :key="schemeId"
        :schema="schema"
        :title="schemeId"
        :properties="properties" />
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentScheme from './ContentScheme'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    ContentHeader,
    ContentScheme
  },

  computed: {
    ...mapGetters('state', ['pages', 'schema']),

    page () {
      return this.pages[this.id]
    }
  }
}
</script>
