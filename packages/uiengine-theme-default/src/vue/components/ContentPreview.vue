<template>
  <div class="preview">
    <div class="preview__container" :style="containerStyle">
      <div v-if="breakpoints" class="preview__size">
        <button class="preview__sizer" type="button" @click="isBreakpointsActive = !isBreakpointsActive"></button>
      </div>
      <div v-if="breakpoints" class="preview__breakpoints" :class="{ 'preview__breakpoints--active': isBreakpointsActive }">
        <div class="preview__breakpoints-inner">
          <button class="preview__breakpoint" type="button" v-for="(width, breakpoint) in breakpoints" :key="breakpoint" :data-width="width">
            {{ breakpoint }}: {{width}}px
          </button>
          <button class="preview__breakpoint" type="button">{{ 'breakpoints.reset' | localize }}</button>
        </div>
      </div>
      <iframe class="preview__iframe" :src="src" frameborder="0" scrolling="no" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { iframeResizer } from 'iframe-resizer'

export default {
  props: {
    id: {
      type: String,
      required: true
    },

    src: {
      type: String,
      required: true
    },

    breakpoints: {
      type: Object
    }
  },

  data () {
    return {
      isBreakpointsActive: false
    }
  },

  computed: {
    ...mapGetters('preferences', ['previewWidths']),

    breakpointNames () {
      return Object.keys(this.breakpoints)
    },

    breakpointWidths () {
      return Object.values
        ? Object.values(this.breakpoints)
        : Object.keys(this.breakpoints).map(k => this.breakpoints[k])
    },

    containerStyle () {
      const width = this.previewWidths[this.id]

      return width ? { width:  width + 'px' } : {}
    }
  },

  methods: {
    ...mapMutations('preferences', ['setPreviewWidths']),

    setPreviewWidth (width) {
      const previewWidths = this.previewWidths
      previewWidths[this.id] = width
      this.setPreviewWidths(previewWidths)
    }
  }
}


// if (breakpoints) {

//   on('click', '.preview__breakpoint', e => {
//     const breakpoint = e.target
//     const containerSelector = e.target.getAttribute('data-container-target')
//     const container = document.getElementById(containerSelector)
//     const width = breakpoint.getAttribute('data-width')
//     const bpId = breakpoint.getAttribute('data-breakpoint')
//     const id = container.getAttribute('data-preview-id')

//     if (bpId) {
//       // animate resizes
//       const resizedHandler = e => {
//         container.style.width = `${width}px`
//         container.removeAttribute('data-breakpoint')
//         container.removeEventListener('transitionend', resizedHandler)
//       }
//       container.addEventListener('transitionend', resizedHandler)
//       container.setAttribute('data-breakpoint', bpId)
//       container.style.width = null
//       window.sessionStorage.setItem(`preview:width:${id}`, width)
//     } else {
//       // reset
//       container.removeAttribute('data-breakpoint')
//       container.style.width = null
//       window.sessionStorage.removeItem(`preview:width:${id}`)
//     }
//   })
// }

// // iframe resizing, see https://github.com/davidjbradshaw/iframe-resizer
// const iframeResizerOpts = { resizeFrom: 'child' }

// const sizerTextForWidth = innerWidth => {
//   let text = `${innerWidth}px`

//   if (breakpoints) {
//     const bps = breakpointWidths.filter(width => width <= innerWidth)
//     const name = bps.length ? breakpointNames[bps.length - 1] : `< ${breakpointNames[0]}`
//     text = `${name} @ ${text}`
//   }

//   return text
// }

// document.querySelectorAll('.preview__iframe').forEach(iframe => {
//   const container = iframe.parentNode
//   const sizer = container.firstElementChild.firstElementChild

//   iframe.onload = e => {
//     const { contentDocument, contentWindow } = iframe
//     const head = contentDocument.getElementsByTagName('head')[0]
//     const previewScript = document.createElement('script')

//     previewScript.src = relativePath(iframe.getAttribute('src'), window.UIengine.previewScriptPath)

//     head.appendChild(previewScript)

//     iframeResizer(iframeResizerOpts, iframe)

//     sizer.textContent = sizerTextForWidth(contentWindow.innerWidth)

//     contentWindow.onresize = e => {
//       debounce(`${iframe.id}-resize`, () => {
//         sizer.textContent = sizerTextForWidth(e.target.innerWidth)
//       }, 10)
//     }
//   }
// })

</script>
