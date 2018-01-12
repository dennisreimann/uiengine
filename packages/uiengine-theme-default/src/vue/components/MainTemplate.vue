<template>
  <div>
    <section class="page">
      <content-header class="sob-m">
        <content-heading class="contentheader__title">{{ page.title }}</content-heading>

        <div
          v-if="hasInfo && hasSchema"
          class="contentheader__options"
        >
          <a
            href="#info"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isInfoActive }"
            @click.prevent="activeSection = 'info'"
          >{{ 'template.info' | localize }}</a>
          <a
            href="#schema"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isSchemaActive }"
            @click.prevent="activeSection = 'schema'"
          >{{ 'template.schema' | localize }}</a>
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
        v-if="hasInfo || hasSchema"
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
          v-if="hasSchema"
          class="contentsection"
          :class="{ 'contentsection--active': isSchemaActive }"
        >
          <div class="content">
            <content-scheme
              v-for="(properties, schemeId) in page.schema"
              :key="schemeId"
              :schema="schema"
              :title="schemeId"
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
import ContentScheme from './ContentScheme'
import ComponentLabel from './ComponentLabel'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentPreview,
    ContentScheme,
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
