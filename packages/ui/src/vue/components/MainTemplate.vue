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
              :entities="entities"
              :properties="properties"
            />
          </div>
        </div>
      </div>

      <ContentHeader class="uie-sob-m">
        <div
          v-if="hasPreview && hasCode"
          role="tablist"
          class="contentheader__options"
        >
          <a
            v-for="action in customActions"
            :key="action.title"
            :title="action.title"
            href="#"
            class="contentheader__action"
            @click.prevent="handleCustomAction(action)"
          >
            <AppIcon
              v-if="action.icon"
              :symbol="action.icon"
            />
            <span v-else>
              {{ action.title }}
            </span>
          </a>
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
          <a
            :id="tabId('preview')"
            ref="preview-tab"
            :aria-selected="isPreviewActive"
            :tabindex="isPreviewActive ? false : '-1'"
            href="#"
            role="tab"
            class="contentheader__option"
            @click.prevent="activeSectionBottom = 'preview'"
            @keydown.right="switchTabBottom('code')"
          >
            {{ 'options.preview' | localize }}
          </a>
          <a
            :id="tabId('code')"
            ref="code-tab"
            :aria-selected="isCodeActive"
            :tabindex="isCodeActive ? false : '-1'"
            href="#"
            role="tab"
            class="contentheader__option"
            @click.prevent="activeSectionBottom = 'code'"
            @keydown.left="switchTabBottom('preview')"
          >
            {{ 'options.code' | localize }}
          </a>
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
        :hidden="!isPreviewActive"
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
        :hidden="!isCodeActive"
        class="contentsection"
        role="tabpanel"
      >
        <ContentCode
          :extension="page.extension"
          :context="page.context"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '@uiengine/util/src/string'
import Preview from '../mixins/preview'
import ContentHeader from './ContentHeader'
import ContentText from './ContentText'
import ContentPreview from './ContentPreview'
import ContentProperties from './ContentProperties'
import ContentTag from './ContentTag'
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
    Preview
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
    ...mapGetters('state', ['config', 'pages', 'entities']),

    page () {
      return this.pages[this.id]
    },

    customActions () {
      return this.config.ui.customActions
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

    href () {
      return `${window.UIengine.base}_pages/${this.currentTheme.id}/${this.page.id}.html`
    }
  },

  methods: {
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
    },

    handleCustomAction (action) {
      this.$refs.preview.forEach(preview => preview.handleCustomAction(action))
    }
  }
}
</script>
