<template>
  <article
    class="variant"
    :id="variant.id | dasherize"
  >
    <content-header class="sob-m">
      <component-label
        v-if="variant.label"
        class="sob-s sor-s"
      >{{ variant.label }}</component-label>
      <content-heading :level="2">{{ variant.title }}</content-heading>

      <div
        v-if="hasPreview && hasCode"
        class="contentheader__options"
      >
        <a
          href="#"
          class="contentheader__option"
          :class="{ 'contentheader__option--active': isPreviewActive }"
          @click.prevent="activeSection = 'preview'"
        >{{ 'variant.preview' | localize }}</a>
        <a
          href="#"
          class="contentheader__option"
          :class="{ 'contentheader__option--active': isCodeActive }"
          @click.prevent="activeSection = 'code'"
        > {{ 'variant.code' | localize }}</a>
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
              class="permalink contentheader__actionlink"
              :href="permalinkUrl"
              :data-clipboard-text="permalinkUrl"
              @click.prevent
            >
              <app-icon
                symbol="link-45"
                class="permalink__icon"
              />
              <span class="permalink__text">{{ 'variant.copy_permalink' | localize }}</span>
            </a>
          </li>
          <li class="contentheader__action">
            <a
              class="contentheader__actionlink"
              :href="previewPath"
              :target="variant.id | dasherize"
              @click.stop
            >
              <app-icon symbol="open-in-window" />
              {{ 'variant.open_in_window' | localize }}
            </a>
          </li>
        </ul>
      </div>
    </content-header>

    <div
      v-if="variant.content"
      class="content"
      v-html="variant.content"
    />

    <div
      v-if="hasPreview || hasCode"
      class="sot-xl"
    >
      <div
        v-if="hasPreview"
        class="contentsection"
        :class="{ 'contentsection--active': isPreviewActive }"
      >
        <content-preview
          :id="variant.id | dasherize"
          :src="previewPath"
          :breakpoints="config.breakpoints"
        />
      </div>

      <div
        v-if="hasCode"
        class="contentsection"
        :class="{ 'contentsection--active': isCodeActive }"
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
import ComponentLabel from './ComponentLabel'
import ContentPreview from './ContentPreview'
import ContentCode from './ContentCode'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ComponentLabel,
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
      activeSection: null,
      isActionlistActive: false
    }
  },

  computed: {
    ...mapGetters('state', ['config', 'pages', 'schema']),

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

  created () {
    this.$root.$on('modal:close', () => {
      this.isActionlistActive = false
    })
  }
}

// CodePen API documentation:
// https://blog.codepen.io/documentation/api/prefill/
// on('click', '.contentheader__actionlink--codepen', e => {
//   e.preventDefault()

//   const link = e.target
//   const variantId = link.getAttribute('data-variant-target')
//   const variantNode = document.getElementById(variantId)
//   const iframeDocument = variantNode.querySelector('iframe').contentDocument
//   const { styleSheets, scripts } = iframeDocument
//   const form = link.parentNode
//   const input = link.previousSibling
//   const value = JSON.parse(input.dataset.value)

//   let css = ''
//   let cssExt = ''
//   let js = ''
//   let jsExt = ''

//   for (let i = 0; i < styleSheets.length; i++) {
//     const styleSheet = styleSheets[i]
//     if (styleSheet.href) {
//       cssExt += `${styleSheet.href};`
//     } else {
//       css += [].slice.call(styleSheet.cssRules).reduce((prev, cssRule) => prev + cssRule.cssText, '')
//     }
//   }

//   for (let i = 0; i < scripts.length; i++) {
//     const script = scripts[i]
//     if (script.src) {
//       jsExt += `${script.src};`
//     } else if (script.id !== '__bs_script__') {
//       js += script.innerHTML
//     }
//   }

//   const data = Object.assign({}, value, { css, css_external: cssExt, js, js_external: jsExt })

//   input.setAttribute('value', JSON.stringify(data))

//   form.submit()
// })
</script>
