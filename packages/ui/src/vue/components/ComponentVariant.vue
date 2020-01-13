<template>
  <article
    :id="variant.id | dasherize"
    class="variant"
  >
    <ContentHeader>
      <ContentHeading :level="2">
        {{ variant.title }}
      </ContentHeading>
      <ContentLabel
        v-if="variant.label"
      >
        {{ variant.label }}
      </ContentLabel>
      <ContentTag
        v-for="tag in variant.tags"
        :key="tag"
        :tag="tag"
      />
      <div
        v-if="hasPreview && hasCode"
        role="tablist"
        class="contentheader__options"
      >
        <button
          v-for="plugin in pluginActions"
          ref="plugin-action"
          :key="plugin.id"
          :title="plugin.title"
          :aria-label="plugin.title"
          type="button"
          class="contentheader__action"
          @click.prevent="dispatchPluginEvent('click', plugin, $event)"
        >
          <AppIcon
            v-if="plugin.icon"
            :symbol="plugin.icon"
          />
          <span v-else>
            {{ plugin.title }}
          </span>
        </button>
        <a
          v-if="!displayAllThemes"
          :href="href"
          :target="variant.id | dasherize"
          :title="'options.open_in_window' | localize"
          :aria-label="'options.open_in_window' | localize"
          class="contentheader__action"
          data-test-openinwindow-link
          @click.stop
        >
          <AppIcon symbol="open-in-window" />
        </a>
        <a
          :href="permalinkUrl"
          :data-clipboard-text="permalinkUrl"
          :title="'options.copy_permalink' | localize"
          :aria-label="'options.copy_permalink' | localize"
          class="permalink contentheader__action"
          @click.prevent
        >
          <AppIcon
            symbol="link-45"
            class="permalink__icon"
          />
        </a>

        <a
          :id="tabId('preview')"
          ref="preview-tab"
          :aria-selected="isTabActive('preview')"
          :tabindex="isTabActive('preview') ? false : '-1'"
          href="#"
          role="tab"
          class="contentheader__option"
          data-test-variant-tab-link="preview"
          @click.prevent="activeSection = 'preview'"
        >
          {{ 'options.preview' | localize }}
        </a>
        <a
          :id="tabId('code')"
          ref="code-tab"
          :aria-selected="isTabActive('code')"
          :tabindex="isTabActive('code') ? false : '-1'"
          href="#"
          role="tab"
          class="contentheader__option"
          data-test-variant-tab-link="code"
          @click.prevent="activeSection = 'code'"
        >
          {{ 'options.code' | localize }}
        </a>
        <a
          v-for="plugin in pluginTabs"
          :id="tabId(plugin.id)"
          :key="plugin.id"
          ref="plugin-tab"
          :aria-selected="isTabActive(plugin.id)"
          :tabindex="isTabActive(plugin.id) ? false : '-1'"
          :data-test-variant-tab-link="plugin.id"
          href="#"
          role="tab"
          class="contentheader__option"
          @click.prevent="activeSection = plugin.id"
        >
          {{ plugin.title }}
        </a>
      </div>
    </ContentHeader>

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
        :hidden="!isTabActive('preview')"
        class="contentsection"
        role="tabpanel"
      >
        <ContentPreview
          :id="variant.id | dasherize"
          ref="preview"
          :title="variant.title"
          :path-postfix="variant.id"
          path-prefix="_variants"
        />
      </div>

      <div
        v-if="hasCode"
        :aria-labelledby="tabId('code')"
        :hidden="!isTabActive('code')"
        class="contentsection"
        role="tabpanel"
      >
        <ContentCode
          :extension="variant.extension"
          :raw="variant.raw"
          :context="variant.context"
        />
      </div>

      <div
        v-for="tab in pluginTabs"
        :key="tab.id"
        ref="plugin-tab-content"
        :aria-labelledby="tabId(tab.id)"
        :hidden="!isTabActive(tab.id)"
        class="contentsection content"
        role="tabpanel"
      >
        {{ tab.id }}
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '@uiengine/util/src/string'
import Plugins from '../mixins/plugins'
import Themes from '../mixins/themes'
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
    Plugins,
    Themes
  ],

  props: {
    variant: {
      type: Object,
      required: true
    },
    component: {
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

    parts () {
      return this.displayAllThemes
        ? []
        : this.variant.themes[this.currentTheme.id].parts
    },

    hasPreview () {
      return !this.variant.themeIds || this.displayedThemes.some(theme => this.variant.themeIds.includes(theme.id))
    },

    hasCode () {
      return !!(this.variant.raw || this.variant.context)
    },

    permalinkUrl () {
      const loc = window.location
      const anchor = dasherize(this.variant.id)

      return `${loc.protocol}//${loc.host}${loc.pathname}#${anchor}`
    },

    href () {
      return `${window.UIengine.base}_variants/${this.currentTheme.id}/${this.variant.id}.html`
    }
  },

  methods: {
    tabId (section) {
      return `${dasherize(this.variant.id)}-${section}`
    },

    isTabActive (id) {
      return this.activeSection === id || (
        !this.activeSection && (
          (id === 'preview' && this.hasPreview) ||
          (id === 'code' && !this.hasPreview && this.hasCode)
        )
      )
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
  margin-top var(--uie-space-xxxl)
  padding-top var(--uie-space-xl)
  border-top 1px solid var(--uie-color-border-light)
</style>
