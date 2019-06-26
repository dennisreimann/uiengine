<template>
  <p>Props as an object with full description.</p>
</template>

<script>
export default {
  name: 'FullProps',

  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: 'This is the default title',
      description: 'An optional description'
    }
  }
}
</script>
