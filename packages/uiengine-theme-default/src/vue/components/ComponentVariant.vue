<template>
  <article :id="variant.id | dasherize" class="variant">
    <content-header class="sob-m">
      <component-label v-if="variant.label" class="sob-s sor-s">{{ variant.label }}</component-label>
      <content-heading :level="2">{{ variant.title }}</content-heading>
    </content-header>
  </article>
</template>

<script>
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'

  // - const actionlistId = `${h.dasherize(variant.id)}-actionlist`
  // article.(id=h.dasherize(variant.id))&attributes(attributes)
  //   +contentheader().
  //     if
  //       +label().

  //     h2.contentheader__title= variant.title

  //     if hasPreview && hasCode
  //       .contentheader__options
  //         +contentheaderOption(`${variantId}-preview`, h.t('variant.preview'), true)
  //         +contentheaderOption(`${variantId}-code`, h.t('variant.code'), false)

  //     .contentheader__actions
  //       button.contentheader__actiontoggle(type="button" data-actionlist-target=actionlistId)
  //         +icon('tools')
  //       ul.contentheader__actionlist(id=actionlistId)
  //         li.contentheader__action
  //           +permalink(`#${variantId}`, h.t('variant.copy_permalink')).contentheader__actionlink
  //         li.contentheader__action
  //           a.contentheader__actionlink(href=h.variantPreviewPath(variant.id) target=variantId)
  //             +icon('open-in-window')
  //             = h.t('variant.open_in_window')
  //         li.contentheader__action
  //           form(action="https://codepen.io/pen/define" method="POST" target="_blank")
  //             input(type="hidden" name="data" data-value=JSON.stringify({ title: variant.title, html: variant.rendered, language: variant.extension, raw: variant.raw }))
  //             a.contentheader__actionlink.contentheader__actionlink--codepen(href="#" data-variant-target=variantId)
  //               +icon('globe')
  //               = h.t('variant.edit_on_codepen')

  //   if variant.content
  //     .content
  //       != variant.content

  //   if hasPreview || hasCode
  //     .contentsections.sot-xl
  //       if hasPreview
  //         - const classes = 'contentsection--active'
  //         - const previewId = h.dasherize(variant.id)
  //         - const src = h.variantPreviewPath(variant.id)
  //         +preview(previewId, src).contentsection(id=`${variantId}-preview` class=classes)

  //       if hasCode
  //         - const classes = !hasPreview ? 'contentsection--active' : null
  //         +code(variant.extension, variant.raw, variant.context, variant.rendered).contentsection(id=`${variantId}-code` class=classes)

export default {
  props: {
    variant: {
      type: Object,
      required: true
    }
  },

  components: {
    ContentHeader,
    ContentHeading
  },

  computed: {
    hasPreview () {
      return !!variant.rendered
    },

    hasCode () {
      return !!(variant.raw || variant.context || variant.rendered)
    }
  }
}
</script>
