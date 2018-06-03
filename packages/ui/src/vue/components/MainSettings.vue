<template>
  <section class="page">
    <content-header
      :title="title"
      class="uie-sob-l"
    />
    <article class="content">
      <div class="row">
        <label for="locale">{{ 'settings.locale' | localize }}</label>
        <select
          id="locale"
          v-model="locale"
        >
          <option
            v-for="(title, value) in localeOptions"
            :key="value"
            :value="value"
            :selected="locale === value">
            {{ title }}
          </option>
        </select>
      </div>
      <div class="row">
        <label for="hljs">{{ 'settings.hljs' | localize }}</label>
        <select
          id="hljs"
          v-model="hljs"
        >
          <option
            v-for="value in hljsOptions"
            :key="value"
            :value="value"
            :selected="hljs === value">
            {{ value | titleize }}
          </option>
        </select>
      </div>

      <pre
        class="hljs"
        lang="html"
      ><span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">for</span>=<span class="hljs-string">"name"</span>&gt;</span>Name<span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span></pre>
    </article>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ContentHeader from './ContentHeader'

export default {
  components: {
    ContentHeader
  },

  data () {
    return {
      localeOptions: {
        en: 'English',
        de: 'Deutsch'
      },

      hljsOptions: [
        'agate',
        'androidstudio',
        'arduino-light',
        'arta',
        'ascetic',
        'atelier-cave-dark',
        'atelier-cave-light',
        'atelier-dune-dark',
        'atelier-dune-light',
        'atelier-estuary-dark',
        'atelier-estuary-light',
        'atelier-forest-dark',
        'atelier-forest-light',
        'atelier-heath-dark',
        'atelier-heath-light',
        'atelier-lakeside-dark',
        'atelier-lakeside-light',
        'atelier-plateau-dark',
        'atelier-plateau-light',
        'atelier-savanna-dark',
        'atelier-savanna-light',
        'atelier-seaside-dark',
        'atelier-seaside-light',
        'atelier-sulphurpool-dark',
        'atelier-sulphurpool-light',
        'atom-one-dark',
        'atom-one-light',
        'brown-paper',
        'codepen-embed',
        'color-brewer',
        'darcula',
        'dark',
        'darkula',
        'default',
        'docco',
        'dracula',
        'far',
        'foundation',
        'github-gist',
        'github',
        'googlecode',
        'grayscale',
        'gruvbox-dark',
        'gruvbox-light',
        'hopscotch',
        'hybrid',
        'idea',
        'ir-black',
        'kimbie.dark',
        'kimbie.light',
        'magula',
        'mono-blue',
        'monokai-sublime',
        'monokai',
        'obsidian',
        'ocean',
        'paraiso-dark',
        'paraiso-light',
        'pojoaque',
        'purebasic',
        'qtcreator_dark',
        'qtcreator_light',
        'railscasts',
        'rainbow',
        'routeros',
        'school-book',
        'solarized-dark',
        'solarized-light',
        'sunburst',
        'tomorrow-night-blue',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'tomorrow-night',
        'tomorrow',
        'vs',
        'vs2015',
        'xcode',
        'xt256',
        'zenburn'
      ]
    }
  },

  computed: {
    locale: {
      get: mapGetters('preferences', ['locale']).locale,

      set (newValue) {
        this.setLocale(newValue)
      }
    },

    hljs: {
      get: mapGetters('preferences', ['hljs']).hljs,

      set (newValue) {
        this.setHljs(newValue)
        this.$root.$emit('setting:hljs', newValue)
      }
    },

    title () {
      return this.$options.filters.localize('settings.title')
    }
  },

  methods: {
    ...mapMutations('preferences', ['setLocale', 'setHljs'])
  },

  metaInfo () {
    return {
      title: this.title
    }
  }
}
</script>

<style lang="stylus" scoped>
.row + .row
  margin-top var(--uie-space-xl)

select
  display block
  width 260px
  margin-top var(--uie-space-xs)
  padding var(--uie-space-s) var(--uie-space-m)
  font-family var(--uie-font-family-light)
  font-size var(--uie-font-size-m)
</style>
