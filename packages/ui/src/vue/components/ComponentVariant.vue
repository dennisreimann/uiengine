<template>
  <article
    :id="variant.id | dasherize"
    class="variant"
  >
    <content-header class="uie-sob-m">
      <content-heading :level="2">{{ variant.title }}</content-heading>
      <content-label
        v-if="variant.label"
      >{{ variant.label }}</content-label>
      <content-tag
        v-for="tag in variant.tags"
        :key="tag"
        :tag="tag"
      />
      <div
        v-if="hasPreview && hasCode"
        role="tablist"
        class="contentheader__options"
      >
        <a
          :href="permalinkUrl"
          :data-clipboard-text="permalinkUrl"
          :title="'options.copy_permalink' | localize"
          class="permalink contentheader__action"
          @click.prevent
        >
          <app-icon
            symbol="link-45"
            class="permalink__icon"
          />
        </a>
        <a
          :href="previewPath"
          :target="variant.id | dasherize"
          :title="'options.open_in_window' | localize"
          class="contentheader__action"
          @click.stop
        >
          <app-icon symbol="open-in-window" />
        </a>

        <a
          ref="preview-tab"
          :id="tabId('preview')"
          :aria-selected="isPreviewActive"
          :tabindex="isPreviewActive ? false : '-1'"
          href="#"
          role="tab"
          class="contentheader__option"
          @click.prevent="activeSection = 'preview'"
          @keydown.right="switchTab('code')"
        >{{ 'options.preview' | localize }}</a>
        <a
          ref="code-tab"
          :id="tabId('code')"
          :aria-selected="isCodeActive"
          :tabindex="isCodeActive ? false : '-1'"
          href="#"
          role="tab"
          class="contentheader__option"
          @click.prevent="activeSection = 'code'"
          @keydown.left="switchTab('preview')"
        > {{ 'options.code' | localize }}</a>
      </div>
    </content-header>

    <div
      v-if="variant.description"
      class="content"
      v-html="variant.description"
    />

    <div
      v-if="hasPreview || hasCode"
      class="uie-sot-xl"
    >
      <div
        v-if="hasPreview"
        :aria-labelledby="tabId('preview')"
        :hidden="!isPreviewActive"
        class="contentsection"
        role="tabpanel"
      >
        <content-preview
          :id="variant.id | dasherize"
          :path="previewPath"
          :title="variant.title"
          :viewports="config.ui.viewports"
          :breakpoints="config.ui.breakpoints"
          type="variant"
        />
      </div>

      <div
        v-if="hasCode"
        :aria-labelledby="tabId('code')"
        :hidden="!isCodeActive"
        class="contentsection"
        role="tabpanel"
      >
        <content-code
          :extension="variant.extension"
          :raw="variant.raw"
          :context="variant.context"
          :parts="variant.parts"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '@uiengine/util/src/string'
import Preview from '../mixins/preview'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'
import ContentPreview from './ContentPreview'
import ContentCode from './ContentCode'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentLabel,
    ContentTag,
    ContentPreview,
    ContentCode
  },

  mixins: [
    Preview
  ],

  props: {
    variant: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      activeSection: null
    }
  },

  computed: {
    ...mapGetters('state', ['config']),
    ...mapGetters('preferences', ['currentTheme']),

    hasPreview () {
      return !!this.variant.rendered
    },

    hasCode () {
      return !!(this.variant.raw || this.variant.context || this.variant.parts)
    },

    isPreviewActive () {
      return this.activeSection === 'preview' || (!this.activeSection && this.hasPreview)
    },

    isCodeActive () {
      return this.activeSection === 'code' || (!this.activeSection && !this.hasPreview && this.hasCode)
    },

    previewPath () {
      return this.expandPreviewPath(`_variants/${this.variant.id}.html`)
    },

    permalinkUrl () {
      const loc = window.location
      const anchor = dasherize(this.variant.id)

      return `${loc.protocol}//${loc.host}${loc.pathname}#${anchor}`
    }
  },

  methods: {
    tabId (section) {
      return `${dasherize(this.variant.id)}-${section}`
    },

    switchTab (section) {
      this.activeSection = section
      this.$refs[`${section}-tab`].focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
.variant
  margin-top var(--uie-space-xxl)
  padding-top var(--uie-space-xxl)
  border-top 1px solid var(--uie-color-neutral-60)
</style>
