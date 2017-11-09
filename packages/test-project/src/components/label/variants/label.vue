<template>
  <my-label :id="id" :title="title" />
</template>

<script>
import MyLabel from '../label'

export default {
  name: 'MyVariant',
  props: {
    id: String,
    title: String
  },
  components: {
    MyLabel
  }
}
</script>
