<template>
  <section class="page">
    <article class="content">
      COMPONENT
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    ContentHeader
  },

  computed: {
    ...mapGetters('state', ['components']),

    component () {
      return this.components[this.id]
    }
  }
}
</script>
