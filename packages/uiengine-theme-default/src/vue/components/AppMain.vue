<template>
  <main class="main">
    <router-view />
  </main>
</template>

<script>
// common functionality for all main components
export default {
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  }
}
</script>
