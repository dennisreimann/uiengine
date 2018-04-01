<template>
  <section class="page">
    <content-header
      class="sob-m"
      :title="'not_found.title' | localize"
    />
    <article class="content">{{ 'not_found.content' | localize }}</article>
  </section>
</template>

<script>
import ContentHeader from './ContentHeader'

export default {
  components: {
    ContentHeader
  }
}
</script>
