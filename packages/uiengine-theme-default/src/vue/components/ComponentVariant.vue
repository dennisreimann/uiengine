<template>
  <article
    class="variant"
    :id="variant.id | dasherize"
  >
    <content-header class="sob-m">
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
          class="permalink contentheader__action"
          :href="permalinkUrl"
          :data-clipboard-text="permalinkUrl"
          :title="'options.copy_permalink' | localize"
          @click.prevent
        >
          <app-icon
            symbol="link-45"
            class="permalink__icon"
          />
        </a>
        <a
          class="contentheader__action"
          :href="previewPath"
          :target="variant.id | dasherize"
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
          @click.prevent="activeSection = 'preview'"
          @keydown.right="switchTab('code')"
        >{{ 'options.preview' | localize }}</a>
        <a
          href="#"
          ref="code-tab"
          role="tab"
          class="contentheader__option"
          :id="tabId('code')"
          :aria-selected="isCodeActive"
          :tabindex="isCodeActive ? false : '-1'"
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
          :id="variant.id | dasherize"
          :src="previewPath"
          :title="variant.title"
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
          :extension="variant.extension"
          :raw="variant.raw"
          :context="variant.context"
          :rendered="variant.rendered"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '../../util'
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

    hasPreview () {
      return !!this.variant.rendered
    },

    hasCode () {
      return !!(this.variant.raw || this.variant.context || this.variant.rendered)
    },

    isPreviewActive () {
      return this.activeSection === 'preview' || (!this.activeSection && this.hasPreview)
    },

    isCodeActive () {
      return this.activeSection === 'code' || (!this.activeSection && !this.hasPreview && this.hasCode)
    },

    previewPath () {
      return `/_variants/${this.variant.id}.html`
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
  margin-top var(--space-xxl)
  padding-top var(--space-xxl)
  border-top 1px solid var(--color-neutral-60)
</style>
