<template>
  <section class="page">
    <content-header
      :title="title"
      class="uie-sob-l"
    />
    <article class="content">
      <content-properties
        v-for="(properties, entityId) in entities"
        :key="entityId"
        :title="entityId"
        :entities="entities"
        :properties="properties"
        class="uie-sob-xxl"
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
    ...mapGetters('state', ['entities']),

    title () {
      return this.$options.filters.localize('entities.title')
    }
  },

  metaInfo () {
    return {
      title: this.title
    }
  }
}
</script>
