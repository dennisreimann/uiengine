<template>
  <section class="page">
    <content-header
      class="sob-l"
      :title="title"
    />
    <article class="content">
      <p v-if="results.length === 0">{{ 'search.no_results' | localize }}</p>
      <ul v-else>
        <li
          v-for="result in results"
          :key="result.id"
          class="sob-l"
        >
          <h2>
            <router-link :to="result">{{ result.title }}</router-link>
          </h2>
          <div
            v-if="result.excerpt"
            v-html="result.excerpt"
          />
        </li>
      </ul>
    </article>
  </section>
</template>

<script>
import Fuse from 'fuse.js'
import { mapGetters } from 'vuex'
import { decorateContent } from '../../util'
import ContentHeader from './ContentHeader'
import ContentProperties from './ContentProperties'

// For details on the options see http://fusejs.io/
const searchOptions = {
  threshold: 0.2,
  keys: [
    {
      name: 'title',
      weight: 0.7
    }, {
      name: 'tags',
      weight: 0.5
    }, {
      name: 'excerpt',
      weight: 0.3
    }
  ]
}

export default {
  components: {
    ContentHeader,
    ContentProperties
  },

  filters: {
    renderedContent (item) {
      return item.content
        ? decorateContent(item)
        : null
    }
  },

  props: {
    query: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      results: []
    }
  },

  computed: {
    ...mapGetters('state', ['navigation', 'components', 'pages']),
    ...mapGetters('preferences', ['locale']),

    repo () {
      const items = Object.values(this.navigation).filter(item => !item.isStructural)

      return new Fuse(items, searchOptions)
    },

    title () {
      return this.$options.filters.localize('search.title', { query: this.query })
    }
  },

  watch: {
    $route: 'search'
  },

  created () {
    this.search()
  },

  methods: {
    search () {
      this.results = this.repo.search(this.query)

      // jump to single search results directly
      if (this.results.length === 1) {
        this.$router.replace(this.results[0])
      }
    }
  },

  metaInfo () {
    return {
      title: this.title
    }
  }
}
</script>
