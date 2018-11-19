<template>
  <div>
    <section class="component">
      <content-header :title="component.title">
        <content-label
          v-if="component.label"
          inverted
        >{{ component.label }}</content-label>
        <content-tag
          v-for="tag in component.tags"
          :key="tag"
          :tag="tag"
        />
        <div
          role="tablist"
          class="contentheader__options"
        >
          <a
            v-if="repoLink"
            :href="repoLink"
            class="contentheader__action"
          >
            <app-icon
              :title="'options.edit' | localize"
              symbol="pencil"
            />
          </a>
          <a
            v-if="hasInfo"
            ref="info-tab"
            :id="tabId('info')"
            :aria-selected="isInfoActive"
            :tabindex="isInfoActive ? false : '-1'"
            role="tab"
            href="#info"
            class="contentheader__option"
            @click.prevent="activeSection = 'info'"
            @keydown.right="switchTab('properties')"
          >{{ 'options.info' | localize }}</a>
          <a
            v-if="hasProperties"
            ref="properties-tab"
            :id="tabId('properties')"
            :aria-selected="isPropertiesActive"
            :tabindex="isPropertiesActive ? false : '-1'"
            role="tab"
            href="#properties"
            class="contentheader__option"
            @click.prevent="activeSection = 'properties'"
            @keydown.left="switchTab('info')"
            @keydown.right="switchTab('theme-properties')"
          > {{ 'options.properties' | localize }}</a>
          <a
            v-if="hasThemeProperties"
            ref="theme-properties-tab"
            :id="tabId('theme-properties')"
            :aria-selected="isThemePropertiesActive"
            :tabindex="isThemePropertiesActive ? false : '-1'"
            role="tab"
            href="#theme-properties"
            class="contentheader__option"
            @click.prevent="activeSection = 'theme-properties'"
            @keydown.left="switchTab('properties')"
          > {{ 'options.theme_properties' | localize }}</a>
        </div>
      </content-header>

      <div
        v-if="hasInfo || hasProperties || hasThemeProperties"
        class="uie-sot-xs"
      >
        <div
          v-if="hasInfo"
          :aria-labelledby="tabId('info')"
          :hidden="!isInfoActive"
          class="contentsection"
          role="tabpanel"
        >
          <content-text :item="component" />

          <div
            v-if="hasSecondaryInfo"
            class="content uie-sot-l"
          >
            <hr>

            <template v-if="hasDependencies">
              <p>
                {{ 'component.dependencies' | localize }}
                <span
                  v-for="(dependency, index) in component.dependencies"
                  v-if="componentById(dependency)"
                  :key="dependency"
                >
                  <router-link
                    v-if="componentLink(dependency)"
                    :to="componentLink(dependency)"
                    class=""
                    active-class=""
                    exact-active-class=""
                  >{{ componentById(dependency).title }}</router-link>
                  <template v-else>{{ componentById(dependency).title }}</template>
                  <span class="divider">{{ (index != component.dependencies.length - 1) ? ',' : '.' }}</span>
                </span>
              </p>
            </template>

            <template v-if="hasDependentComponents">
              <p>
                {{ 'component.dependents' | localize }}
                <span
                  v-for="(dependent, index) in component.dependentComponents"
                  v-if="componentById(dependent)"
                  :key="dependent"
                >
                  <router-link
                    v-if="componentLink(dependent)"
                    :to="componentLink(dependent)"
                    class=""
                    active-class=""
                    exact-active-class=""
                  >{{ componentById(dependent).title }}</router-link>
                  <template v-else>{{ componentById(dependent).title }}</template>
                  <span class="divider">{{ (index != component.dependentComponents.length - 1) ? ',' : '.' }}</span>
                </span>
              </p>
            </template>

            <template v-if="hasManyVariants">
              <ul>
                <li
                  v-for="variant in component.variants"
                  :key="variant.id"
                >
                  <router-link
                    :to="{ hash: dasherize(variant.id) }"
                    class=""
                    active-class=""
                    exact-active-class=""
                  >{{ variant.title }}</router-link>
                </li>
              </ul>
            </template>
          </div>
        </div>

        <div
          v-if="hasProperties"
          :aria-labelledby="tabId('properties')"
          :hidden="!isPropertiesActive"
          class="contentsection"
          role="tabpanel"
        >
          <div class="content">
            <content-properties
              v-for="(properties, componentId) in component.properties"
              :key="componentId"
              :title="componentId"
              :entities="entities"
              :properties="properties"
              class="uie-sob-xl"
            />
          </div>
        </div>

        <div
          v-if="hasThemeProperties"
          :aria-labelledby="tabId('theme-properties')"
          :hidden="!isThemePropertiesActive"
          class="contentsection"
          role="tabpanel"
        >
          <content-theme-properties
            :title="'options.theme_properties' | localize"
            :themes="themes"
            :theme-properties="component.themeProperties"
            class="uie-sob-xl"
          />
        </div>
      </div>
    </section>

    <section
      v-if="hasVariants"
      class="variants"
    >
      <component-variant
        v-for="variant in component.variants"
        :key="variant.id"
        :variant="variant"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '@uiengine/util/src/string'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentText from './ContentText'
import ContentProperties from './ContentProperties'
import ContentThemeProperties from './ContentThemeProperties'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentText,
    ContentProperties,
    ContentThemeProperties,
    ContentLabel,
    ContentTag,
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
      activeSection: null
    }
  },

  computed: {
    ...mapGetters('state', ['components', 'config', 'entities', 'navigation']),

    component () {
      return this.components[this.id]
    },

    hasDependencies () {
      return this.component.dependencies &&
        this.component.dependencies.filter(this.componentById).length > 0
    },

    hasDependentComponents () {
      return !!this.component.dependentComponents &&
        this.component.dependentComponents.filter(this.componentById).length > 0
    },

    hasVariants () {
      return this.component.variants.length > 0
    },

    hasManyVariants () {
      return this.component.variants.length > 1
    },

    hasProperties () {
      const { properties } = this.component
      return properties && Object.keys(properties).length > 0
    },

    themes () {
      const { themes } = this.config.ui
      return themes || []
    },

    hasThemeProperties () {
      const { themeProperties } = this.component
      return this.themes.length > 0 && themeProperties && themeProperties.length > 0
    },

    hasInfo () {
      return !!(this.component.content || this.hasSecondaryInfo)
    },

    hasSecondaryInfo () {
      return this.hasManyVariants || this.hasDependencies || this.hasDependentComponents
    },

    isInfoActive () {
      return this.activeSection === 'info' || (!this.activeSection && this.hasInfo)
    },

    isPropertiesActive () {
      return this.activeSection === 'properties' || (!this.activeSection && !this.hasInfo && this.hasProperties)
    },

    isThemePropertiesActive () {
      return this.activeSection === 'theme-properties' || (!this.activeSection && !this.hasInfo && !this.hasProperties && this.hasThemeProperties)
    },

    repoLink () {
      const { repoBaseUrl } = this.config.ui
      if (!repoBaseUrl) return null

      const { sourceFile, sourcePath } = this.component

      return `${repoBaseUrl}${sourceFile || sourcePath}`
    }
  },

  methods: {
    dasherize,

    componentLink (componentId) {
      return Object.values(this.navigation).find(item => item.type === 'component' && item.itemId === componentId)
    },

    componentById (componentId) {
      return this.components[componentId]
    },

    tabId (section) {
      return `${dasherize(this.component.id)}-${section}`
    },

    switchTab (section) {
      this.activeSection = section
      this.$refs[`${section}-tab`].focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
.divider
  margin-left -.45ch
  margin-right .45ch
</style>
