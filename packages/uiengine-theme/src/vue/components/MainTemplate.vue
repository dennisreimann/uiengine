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
            @click.prevent="activeSectionTop = 'info'"
            @keydown.right="switchTabTop('properties')"
          >{{ 'options.info' | localize }}</a>
          <a
            role="tab"
            ref="properties-tab"
            href="#properties"
            class="contentheader__option"
            :id="tabId('properties')"
            :aria-selected="isPropertiesActive"
            :tabindex="isPropertiesActive ? false : '-1'"
            @click.prevent="activeSectionTop = 'properties'"
            @keydown.left="switchTabTop('info')"
          >{{ 'options.properties' | localize }}</a>
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

      <content-header class="sob-m">
        <div
          v-if="hasPreview && hasCode"
          role="tablist"
          class="contentheader__options"
        >
          <a
            class="contentheader__action"
            :href="previewPath"
            :target="page.id | dasherize"
            :title="'options.open_in_window' | localize"
            @click.stop
          >
            <app-icon symbol="open-in-window" />
          </a>
          <a
            href="#"
            ref="preview-tab"
            role="tab"
            class="contentheader__option"
            :id="tabId('preview')"
            :aria-selected="isPreviewActive"
            :tabindex="isPreviewActive ? false : '-1'"
            @click.prevent="activeSectionBottom = 'preview'"
            @keydown.right="switchTabBottom('code')"
          >{{ 'options.preview' | localize }}</a>
          <a
            href="#"
            ref="code-tab"
            role="tab"
            class="contentheader__option"
            :id="tabId('code')"
            :aria-selected="isCodeActive"
            :tabindex="isCodeActive ? false : '-1'"
            @click.prevent="activeSectionBottom = 'code'"
            @keydown.left="switchTabBottom('preview')"
          > {{ 'options.code' | localize }}</a>
        </div>
      </content-header>
    </section>

    <div
      v-if="hasPreview || hasCode"
      class="sot-xl"
    >
      <div
        v-if="hasPreview"
        class="contentsection"
        role="tabpanel"
        :aria-labelledby="tabId('preview')"
        :hidden="!isPreviewActive"
      >
        <content-preview
          :id="id"
          :src="previewPath"
          :title="page.title"
          :breakpoints="config.breakpoints"
        />
      </div>

      <div
        v-if="hasCode"
        class="contentsection"
        role="tabpanel"
        :aria-labelledby="tabId('code')"
        :hidden="!isCodeActive"
      >
        <content-code
          :extension="page.extension"
          :raw="page.raw"
          :context="page.context"
          :rendered="page.rendered"
        />
      </div>
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
    ContentCode
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      activeSectionTop: null,
      activeSectionBottom: null
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
      return this.activeSectionTop === 'info' || (!this.activeSectionTop && this.hasInfo)
    },

    isPropertiesActive () {
      return this.activeSectionTop === 'properties' || (!this.activeSectionTop && !this.hasInfo && this.hasProperties)
    },

    hasPreview () {
      return !!this.page.template
    },

    hasCode () {
      return !!this.page.context
    },

    isPreviewActive () {
      return this.activeSectionBottom === 'preview' || (!this.activeSectionBottom && this.hasPreview)
    },

    isCodeActive () {
      return this.activeSectionBottom === 'code' || (!this.activeSectionBottom && !this.hasPreview && this.hasCode)
    },

    previewPath () {
      return `/_pages/${this.page.id}.html`
    }
  },

  methods: {
    dasherize,

    tabId (section) {
      return `${dasherize(this.page.id)}-${section}`
    },

    switchTabTop (section) {
      this.activeSectionTop = section
      this.$refs[`${section}-tab`].focus()
    },

    switchTabBottom (section) {
      this.activeSectionBottom = section
      this.$refs[`${section}-tab`].focus()
    }
  }
}
</script>
