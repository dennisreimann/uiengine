<template>
  <div>
    <section class="page">
      <content-header
        class="sob-m"
        :title="page.title"
      >
        <content-tag
          v-for="tag in page.tags"
          :key="tag"
          :tag="tag"
          class="sob-m"
        />
        <div
          v-if="hasInfo && hasProperties"
          role="tablist"
          class="contentheader__options"
        >
          <a
            role="tab"
            ref="info-tab"
            href="#info"
            class="contentheader__option"
            :id="tabId('info')"
            :aria-selected="isInfoActive"
            :tabindex="isInfoActive ? false : '-1'"
            @click.prevent="activeSection = 'info'"
            @keydown.right="switchTab('properties')"
          >{{ 'template.info' | localize }}</a>
          <a
            role="tab"
            ref="properties-tab"
            href="#properties"
            class="contentheader__option"
            :id="tabId('properties')"
            :aria-selected="isPropertiesActive"
            :tabindex="isPropertiesActive ? false : '-1'"
            @click.prevent="activeSection = 'properties'"
            @keydown.left="switchTab('info')"
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
          role="tabpanel"
          :aria-labelledby="tabId('info')"
          :hidden="!isInfoActive"
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
          role="tabpanel"
          :aria-labelledby="tabId('properties')"
          :hidden="!isPropertiesActive"
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
        :id="id"
        :src="previewPath"
        :title="page.title"
        :breakpoints="config.breakpoints"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '../../util'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentPreview from './ContentPreview'
import ContentProperties from './ContentProperties'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'
import ContentCode from './ContentCode'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentLabel,
    ContentTag,
    ContentProperties,
    ContentPreview,
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
  },

  methods: {
    dasherize,

    tabId (section) {
      return `${dasherize(this.page.id)}-${section}`
    },

    switchTab (section) {
      this.activeSection = section
      this.$refs[`${section}-tab`].focus()
    }
  }
}
</script>
