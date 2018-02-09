<template>
  <div>
    <section class="page">
      <content-header class="sob-m">
        <content-heading class="contentheader__title">{{ page.title }}</content-heading>

        <div
          v-if="hasInfo && hasProperties"
          class="contentheader__options"
        >
          <a
            href="#info"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isInfoActive }"
            @click.prevent="activeSection = 'info'"
          >{{ 'template.info' | localize }}</a>
          <a
            href="#properties"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isPropertiesActive }"
            @click.prevent="activeSection = 'properties'"
          >{{ 'template.properties' | localize }}</a>
        </div>

        <div class="contentheader__actions">
          <button
            class="contentheader__actiontoggle"
            type="button"
            @click.stop="isActionlistActive = !isActionlistActive"
          >
            <app-icon symbol="tools" />
          </button>
          <ul
            class="contentheader__actionlist"
            :class="{ 'contentheader__actionlist--active': isActionlistActive }"
          >
            <li class="contentheader__action">
              <a
                class="contentheader__actionlink"
                :href="previewPath"
                :target="page.id | dasherize"
                @click.stop
              >
                <app-icon symbol="open-in-window" />
                {{ 'template.open_in_window' | localize }}
              </a>
            </li>
          </ul>
        </div>
      </content-header>

      <div
        v-if="hasInfo || hasProperties"
        class="sot-xs"
      >
        <div
          v-if="hasInfo"
          class="contentsection"
          :class="{ 'contentsection--active': isInfoActive }"
        >
          <div
            v-if="page.content"
            class="content"
            v-html="page.content"
          />
        </div>

        <div
          v-if="hasProperties"
          class="contentsection"
          :class="{ 'contentsection--active': isPropertiesActive }"
        >
          <div class="content">
            <content-properties
              v-for="(properties, templateId) in page.properties"
              :key="templateId"
              :title="templateId"
              :entities="entities"
              :properties="properties"
              class="sob-xl"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="sot-xl">
      <content-preview
        :src="previewPath"
        :title="page.title"
        :breakpoints="config.breakpoints"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentPreview from './ContentPreview'
import ContentProperties from './ContentProperties'
import ComponentLabel from './ComponentLabel'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentPreview,
    ContentProperties,
    ComponentLabel,
    ComponentVariant
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      activeSection: null,
      isActionlistActive: false
    }
  },

  computed: {
    ...mapGetters('state', ['config', 'pages', 'entities']),

    page () {
      return this.pages[this.id]
    },

    hasProperties () {
      const { properties } = this.page
      return properties && Object.keys(properties).length > 0
    },

    hasInfo () {
      return !!this.page.content
    },

    isInfoActive () {
      return this.activeSection === 'info' || (!this.activeSection && this.hasInfo)
    },

    isPropertiesActive () {
      return this.activeSection === 'properties' || (!this.activeSection && !this.hasInfo && this.hasProperties)
    },

    previewPath () {
      return `/_pages/${this.page.id}.html`
    }
  },

  created () {
    this.$root.$on('modal:close', () => {
      this.isActionlistActive = false
    })
  }
}
</script>
