<template>
  <div>
    <section class="page">
      <content-header class="sob-m">
        <content-heading class="contentheader__title">{{ page.title }}</content-heading>

        <div class="contentheader__options" v-if="hasInfo && hasSchema">
          <a href="#info" @click.prevent="activeSection = 'info'" class="contentheader__option" :class="{ 'contentheader__option--active': isInfoActive }">{{ 'template.info' | localize }}</a>
          <a href="#schema" @click.prevent="activeSection = 'schema'" class="contentheader__option" :class="{ 'contentheader__option--active': isSchemaActive }"> {{ 'template.schema' | localize }}</a>
        </div>

        <div class="contentheader__actions">
          <button @click.stop="isActionlistActive = !isActionlistActive" class="contentheader__actiontoggle" type="button">
            <app-icon symbol="tools" />
          </button>
          <ul class="contentheader__actionlist" :class="{ 'contentheader__actionlist--active': isActionlistActive }">
            <li class="contentheader__action">
              <a :href="previewPath" @click.stop class="contentheader__actionlink" :target="page.id | dasherize">
                <app-icon symbol="open-in-window" />
                {{ 'template.open_in_window' | localize }}
              </a>
            </li>
          </ul>
        </div>
      </content-header>

      <div v-if="hasInfo || hasSchema" class="sot-xs">
        <div v-if="hasInfo" class="contentsection" :class="{ 'contentsection--active': isInfoActive }">
          <div class="content" v-if="page.content" v-html="page.content" />
        </div>

        <div v-if="hasSchema" class="contentsection" :class="{ 'contentsection--active': isSchemaActive }">
          <div class="content">
            <content-scheme v-for="(properties, schemeId) in page.schema"
              class="sob-xl"
              :key="schemeId"
              :schema="schema"
              :title="schemeId"
              :properties="properties" />
          </div>
        </div>
      </div>
    </section>

    <div class="sot-xl">
      <content-preview :id="id" :src="previewPath" :breakpoints="config.breakpoints" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentPreview from './ContentPreview'
import ContentScheme from './ContentScheme'
import ComponentLabel from './ComponentLabel'
import ComponentVariant from './ComponentVariant'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    ContentHeader,
    ContentHeading,
    ContentPreview,
    ContentScheme,
    ComponentLabel,
    ComponentVariant
  },

  data () {
    return {
      activeSection: null,
      isActionlistActive: false
    }
  },

  computed: {
    ...mapGetters('state', ['config', 'pages', 'schema']),

    page () {
      return this.pages[this.id]
    },

    hasSchema () {
      const { schema } = this.page
      return schema && Object.keys(schema).length > 0
    },

    hasInfo () {
      return !!this.page.content
    },

    isInfoActive () {
      return this.activeSection === 'info' || (!this.activeSection && this.hasInfo)
    },

    isSchemaActive () {
      return this.activeSection === 'schema' || (!this.activeSection && !this.hasInfo && this.hasSchema)
    },

    previewPath () {
      return `_${this.page.template}.html`
    }
  },

  created () {
    this.$root.$on('modal:close', () => {
      this.isActionlistActive = false
    })
  }
}
</script>
