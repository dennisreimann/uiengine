<template>
  <section class="page">
    <content-header
      class="sob-l"
      :title="page.title"
    />
    <article class="content">
      <content-properties
        v-for="(properties, entityId) in entities"
        :key="entityId"
        :title="entityId"
        :entities="entities"
        :properties="properties"
        class="sob-xxl"
      />
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentProperties from './ContentProperties'

export default {
  components: {
    ContentHeader,
    ContentProperties
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('state', ['pages', 'entities']),

    page () {
      return this.pages[this.id]
    }
  }
}
</script>
