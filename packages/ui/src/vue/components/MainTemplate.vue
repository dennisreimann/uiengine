<template>
  <div>
    <section class="page">
      <ContentHeader
        :title="page.title"
      >
        <ContentTag
          v-for="tag in page.tags"
          :key="tag"
          :tag="tag"
          class="uie-sob-m"
        />
        <div class="contentheader__right">
          <div
            v-if="hasInfo && hasProperties"
            role="tablist"
            class="contentheader__options"
          >
            <a
              :id="tabId('info')"
              ref="info-tab"
              :aria-selected="isInfoActive"
              :tabindex="isInfoActive ? false : '-1'"
              role="tab"
              href="#info"
              class="contentheader__option"
              @click.prevent="activeSectionTop = 'info'"
              @keydown.right="switchTabTop('properties')"
            >
              {{ 'options.info' | localize }}
            </a>
            <a
              :id="tabId('properties')"
              ref="properties-tab"
              :aria-selected="isPropertiesActive"
              :tabindex="isPropertiesActive ? false : '-1'"
              role="tab"
              href="#properties"
              class="contentheader__option"
              @click.prevent="activeSectionTop = 'properties'"
              @keydown.left="switchTabTop('info')"
            >
              {{ 'options.properties' | localize }}
            </a>
          </div>
        </div>
      </ContentHeader>

      <div
        v-if="hasInfo || hasProperties"
        class="uie-sot-xs"
      >
        <div
          v-if="hasInfo"
          :aria-labelledby="tabId('info')"
          :hidden="!isInfoActive"
          class="contentsection"
          role="tabpanel"
        >
          <ContentText :item="page" />
        </div>

        <div
          v-if="hasProperties"
          :aria-labelledby="tabId('properties')"
          :hidden="!isPropertiesActive"
          class="contentsection"
          role="tabpanel"
        >
          <div class="content">
            <ContentProperties
              v-for="(properties, templateId) in page.properties"
              :key="templateId"
              :title="templateId"
              :properties="properties"
            />
          </div>
        </div>
      </div>

      <hr class="sections-divider">

      <ContentHeader class="uie-sob-m">
        <div class="contentheader__right">
          <div
            v-if="hasPreview && hasCode"
            role="tablist"
            class="contentheader__options"
          >
            <button
              v-for="plugin in pluginActions"
              ref="plugin-action"
              :key="plugin.title"
              :title="plugin.title"
              :aria-label="plugin.title"
              href="#"
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
              :target="page.id | dasherize"
              :title="'options.open_in_window' | localize"
              :href="href"
              class="contentheader__action"
              @click.stop
            >
              <AppIcon symbol="open-in-window" />
            </a>
            <div class="contentheader__buttons">
              <a
                :id="tabId('preview')"
                ref="preview-tab"
                :aria-selected="isTabActive('preview')"
                :tabindex="isTabActive('preview') ? false : '-1'"
                href="#"
                role="tab"
                class="contentheader__option"
                @click.prevent="activeSectionBottom = 'preview'"
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
                @click.prevent="activeSectionBottom = 'code'"
              >
                {{ 'options.code' | localize }}
              </a>
              <a
                v-for="tab in pluginTabs"
                :id="tabId(tab.id)"
                :key="tab.id"
                ref="plugin-tab"
                :aria-selected="isTabActive(tab.id)"
                :tabindex="isTabActive(tab.id) ? false : '-1'"
                :data-test-variant-tab-link="tab.id"
                href="#"
                role="tab"
                class="contentheader__option"
                @click.prevent="activeSectionBottom = tab.id"
              >
                {{ tab.title }}
              </a>
            </div>
          </div>
        </div>
      </ContentHeader>
    </section>

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
          :id="id"
          ref="preview"
          :title="page.title"
          :path-postfix="page.id"
          path-prefix="_pages"
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
          :extension="page.extension"
          :context="page.context"
          :path-postfix="page.id"
          path-prefix="_pages"
        />
      </div>

      <div
        v-for="plugin in pluginTabs"
        :key="plugin.id"
        ref="plugin-tab-content"
        :aria-labelledby="tabId(plugin.id)"
        :hidden="!isTabActive(plugin.id)"
        class="contentsection content"
        role="tabpanel"
      >
        {{ plugin.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '@uiengine/util/src/string'
import Plugins from '../mixins/plugins'
import Themes from '../mixins/themes'
import ContentHeader from './ContentHeader'
import ContentText from './ContentText'
import ContentProperties from './ContentProperties'
import ContentTag from './ContentTag'
import ContentPreview from './ContentPreview'
import ContentCode from './ContentCode'

export default {
  components: {
    ContentHeader,
    ContentText,
    ContentTag,
    ContentProperties,
    ContentPreview,
    ContentCode
  },

  mixins: [
    Plugins,
    Themes
  ],

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
    ...mapGetters('state', ['config', 'pages']),

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
      return !!(this.page.template || this.page.fragment)
    },

    hasCode () {
      return !!this.page.context
    },

    href () {
      return `${window.UIengine.base}_pages/${this.currentTheme.id}/${this.page.id}.html`
    }
  },

  methods: {
    tabId (section) {
      return `${dasherize(this.page.id)}-${section}`
    },

    isTabActive (id) {
      return this.activeSectionBottom === id || (
        !this.activeSectionBottom && (
          (id === 'preview' && this.hasPreview) ||
          (id === 'code' && !this.hasPreview && this.hasCode)
        )
      )
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

<style lang="stylus" scoped>
  .sections-divider
    margin-top var(--uie-space-xxxl)
    margin-bottom var(--uie-space-xxxl)
    border-width 1px
    @media $mq-l_and_up
      margin-left calc(var(--uie-space-xl) * -1)
      margin-right calc(var(--uie-space-xl) * -1)
    @media $mq-xl_and_up
      margin-left calc(var(--uie-space-xxl) * -1)
      margin-right calc(var(--uie-space-xxl) * -1)
</style>
