<template>
  <my-label :title="title" :for="for" />
</template>

<script>
import MyLabel from '../label'

export default {
  name: 'MyVariant',
  components: {
    MyLabel
  }
}
</script>
