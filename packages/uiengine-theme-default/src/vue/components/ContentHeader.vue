<template>
  <header class="contentheader">
    <content-heading class="contentheader__title" v-if="title">{{ title }}</content-heading>
    <slot />
  </header>
</template>

<script>
import ContentHeading from './ContentHeading'

export default {
  components: {
    ContentHeading
  },

  props: {
    title: {
      type: String
    },

    level: {
      type: Number,
      default: 1
    }
  }
}
</script>
