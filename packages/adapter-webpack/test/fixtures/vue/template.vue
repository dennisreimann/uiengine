<template>
  <p>{{ myData }}</p>
</template>

<script>
export default {
  name: 'TestTemplate',

  props: {
    myData: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
p { font-size: 2rem; }
</style>
