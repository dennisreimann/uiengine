<template>
  <my-label v-bind="$props" />
</template>

<script>
import MyLabel from '../label.vue'

export default {
  components: {
    MyLabel
  },

  props: {
    id: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    }
  }
}
</script>
