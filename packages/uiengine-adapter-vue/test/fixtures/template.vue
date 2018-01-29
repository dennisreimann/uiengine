<template>
  <p>{{ myData }}</p>
</template>

<script>
import props from './props'

export default {
  name: 'TestTemplate',

  props
}
</script>

<style scoped>
p { font-size: 2rem; }
</style>
