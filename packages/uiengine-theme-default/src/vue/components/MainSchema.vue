<template>
  <section class="page">
    <content-header
      class="sob-l"
      :title="page.title"
    />
    <article class="content">
      <content-scheme
        v-for="(properties, schemeId) in schema"
        :key="schemeId"
        :schema="schema"
        :title="schemeId"
        :properties="properties"
        class="sob-xxl"
      />
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentScheme from './ContentScheme'

export default {
  components: {
    ContentHeader,
    ContentScheme
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('state', ['pages', 'schema']),

    page () {
      return this.pages[this.id]
    }
  }
}
</script>
