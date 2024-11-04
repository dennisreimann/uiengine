"use strict";(self.webpackChunk_uiengine_ui=self.webpackChunk_uiengine_ui||[]).push([[813],{6517:function(t,e,n){n.r(e),n.d(e,{default:function(){return x}});var i=n(3225),r=n(569),a=n(938),s=n(6222),o=n(4815),c=n(5311),l=n(8906),p=n(393),h={props:{themes:{type:Array,required:!0},themeProperty:{type:Object,required:!0},currentTheme:{type:Object,required:!0},displayAllThemes:{type:Boolean,required:!0}},computed:{displayedThemes:function(){return this.displayAllThemes?this.themeProperty.themes:(0,i.A)({},this.currentTheme.id,this.themeProperty.themes[this.currentTheme.id])}},methods:{themeTitle:function(t){var e=this.themes.find((function(e){return e.id===t}));return e&&e.title?e.title:t},isDefault:function(t){var e=t.value,n=t.variable;if(!this.themeProperty.default)return!1;var i=this.themeProperty.default,r=i.value,a=i.variable;return void 0!==r&&r===e||void 0!==a&&a===n?"*":""}}},d=n(9524);function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function _(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(Object(n),!0).forEach((function(e){(0,i.A)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var v={components:{ContentThemeProperty:(0,d.A)(h,(function(){var t=this,e=t._self._c;return e("tbody",t._l(t.displayedThemes,(function(n,i,r){return e("tr",{key:i},[0===r?e("td",{staticClass:"themeProperty__property uie-rowspan-right",attrs:{rowspan:Object.keys(t.displayedThemes).length}},[e("div",{staticClass:"themeProperty__name"},[t._v("\n        "+t._s(t.themeProperty.name)+"\n      ")]),t._v(" "),t.themeProperty.variable?e("code",{staticClass:"themeProperty__variablename"},[t._v("\n        "+t._s(t.themeProperty.variable)+"\n      ")]):t._e()]):t._e(),t._v(" "),t.displayAllThemes?e("td",{staticClass:"themeProperty__theme uie-rowspan-left"},[t._v("\n      "+t._s(t.themeTitle(i))+"\n    ")]):t._e(),t._v(" "),e("td",{staticClass:"themeProperty__value"},[t._v("\n      "+t._s(n.value)+"\n    ")]),t._v(" "),e("td",{staticClass:"themeProperty__visualization"},[n.value?["color"===t.themeProperty.type?e("span",{staticClass:"themeProperty__swatch"},[e("span",{staticClass:"themeProperty__swatch__inner",style:{backgroundColor:n.value}})]):"size"===t.themeProperty.type?e("span",{staticClass:"themeProperty__size",style:{width:n.value}}):t._e()]:t._e()],2),t._v(" "),e("td",{staticClass:"themeProperty__variable"},[e("code",[t._v(t._s(n.variable))])]),t._v(" "),e("td",{staticClass:"themeProperty__default"},[t._v("\n      "+t._s(t.isDefault(n))+"\n    ")])])})),0)}),[],!1,null,"48e81794",null).exports},props:{title:{type:String,required:!0},themeProperties:{type:Array,required:!0}},computed:_(_(_({},(0,r.L8)("state",["config"])),(0,r.L8)("preferences",["currentTheme"])),{},{themes:function(){return this.config.themes},displayAllThemes:function(){return"_all"===this.currentTheme.id}})},f=(0,d.A)(v,(function(){var t=this,e=t._self._c;return e("table",{attrs:{id:t.title}},[e("caption",[t._v(t._s(t.title))]),t._v(" "),e("thead",[e("tr",[e("th",{staticClass:"themeProperty__property"},[t._v("\n        "+t._s(t._f("localize")("token.property"))+"\n      ")]),t._v(" "),t.displayAllThemes?e("th",{staticClass:"themeProperty__theme"},[t._v("\n        "+t._s(t._f("localize")("token.theme"))+"\n      ")]):t._e(),t._v(" "),e("th",{staticClass:"themeProperty__value"},[t._v("\n        "+t._s(t._f("localize")("token.value"))+"\n      ")]),t._v(" "),e("th",{staticClass:"themeProperty__visualization"}),t._v(" "),e("th",{staticClass:"themeProperty__variable"},[t._v("\n        "+t._s(t._f("localize")("token.variable"))+"\n      ")]),t._v(" "),e("th",{staticClass:"themeProperty__default"},[t._v("\n        "+t._s(t._f("localize")("token.default"))+"\n      ")])])]),t._v(" "),t._l(t.themeProperties,(function(n){return e("ContentThemeProperty",{key:n.name,attrs:{themes:t.themes,"theme-property":n,"current-theme":t.currentTheme,"display-all-themes":t.displayAllThemes}})}))],2)}),[],!1,null,"0e05aaa0",null).exports,m=(0,d.A)({},(function(){return(0,this._self._c)("span",{staticClass:"label"},[this._t("default")],2)}),[],!1,null,"cb9b92c0",null).exports,b=n(1819),y=n(8165),C=n(281),P=n(1545),k=n(7453);function g(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function w(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?g(Object(n),!0).forEach((function(e){(0,i.A)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var A={components:{ContentHeader:c.A,ContentHeading:C.A,ContentLabel:m,ContentTag:b.A,ContentPreview:P.A,ContentCode:k.A},mixins:[y.A,o.A],props:{variant:{type:Object,required:!0},component:{type:Object,required:!0}},data:function(){return{activeSection:null}},computed:w(w(w({},(0,r.L8)("state",["config"])),(0,r.L8)("preferences",["currentTheme"])),{},{parts:function(){return this.displayAllThemes?[]:this.variant.themes[this.currentTheme.id].parts},hasPreview:function(){var t=this;return!this.variant.themeIds||this.displayedThemes.some((function(e){return t.variant.themeIds.includes(e.id)}))},hasCode:function(){return!(!this.variant.raw&&!this.variant.context)},permalinkUrl:function(){var t=window.location,e=(0,a.dasherize)(this.variant.id);return"".concat(t.protocol,"//").concat(t.host).concat(t.pathname,"#").concat(e)},href:function(){return"".concat(window.UIengine.base,"_variants/").concat(this.currentTheme.id,"/").concat(this.variant.id,".html")}}),methods:{tabId:function(t){return"".concat((0,a.dasherize)(this.variant.id),"-").concat(t)},isTabActive:function(t){return this.activeSection===t||!this.activeSection&&("preview"===t&&this.hasPreview||"code"===t&&!this.hasPreview&&this.hasCode)},switchTab:function(t){this.activeSection=t,this.$refs["".concat(t,"-tab")].focus()}}},O=(0,d.A)(A,(function(){var t=this,e=t._self._c;return e("article",{staticClass:"variant",attrs:{id:t._f("dasherize")(t.variant.id)}},[e("ContentHeader",[e("ContentHeading",{attrs:{level:2}},[t._v("\n      "+t._s(t.variant.title)+"\n    ")]),t._v(" "),t.variant.label?e("ContentLabel",[t._v("\n      "+t._s(t.variant.label)+"\n    ")]):t._e(),t._v(" "),t._l(t.variant.tags,(function(t){return e("ContentTag",{key:t,attrs:{tag:t}})})),t._v(" "),e("div",{staticClass:"contentheader__right"},[t.hasPreview&&t.hasCode?e("div",{staticClass:"contentheader__options",attrs:{role:"tablist"}},[t._l(t.pluginActions,(function(n){return e("button",{key:n.id,ref:"plugin-action",refInFor:!0,staticClass:"contentheader__action",attrs:{title:n.title,"aria-label":n.title,type:"button"},on:{click:function(e){return e.preventDefault(),t.dispatchPluginEvent("click",n,e)}}},[n.icon?e("AppIcon",{attrs:{symbol:n.icon}}):e("span",[t._v("\n            "+t._s(n.title)+"\n          ")])],1)})),t._v(" "),t.displayAllThemes?t._e():e("a",{staticClass:"contentheader__action",attrs:{href:t.href,target:t._f("dasherize")(t.variant.id),title:t._f("localize")("options.open_in_window"),"aria-label":t._f("localize")("options.open_in_window"),"data-test-openinwindow-link":""},on:{click:function(t){t.stopPropagation()}}},[e("AppIcon",{attrs:{symbol:"open-in-window"}})],1),t._v(" "),e("a",{staticClass:"permalink contentheader__action",attrs:{href:t.permalinkUrl,"data-clipboard-text":t.permalinkUrl,title:t._f("localize")("options.copy_permalink"),"aria-label":t._f("localize")("options.copy_permalink")},on:{click:function(t){t.preventDefault()}}},[e("AppIcon",{staticClass:"permalink__icon",attrs:{symbol:"link"}})],1),t._v(" "),e("div",{staticClass:"contentheader__buttons"},[e("a",{ref:"preview-tab",staticClass:"contentheader__option",attrs:{id:t.tabId("preview"),"aria-selected":t.isTabActive("preview"),tabindex:!t.isTabActive("preview")&&"-1",href:"#",role:"tab","data-test-variant-tab-link":"preview"},on:{click:function(e){e.preventDefault(),t.activeSection="preview"}}},[e("AppIcon",{staticClass:"contentheader__option-icon",attrs:{symbol:"preview"}})],1),t._v(" "),e("a",{ref:"code-tab",staticClass:"contentheader__option",attrs:{id:t.tabId("code"),"aria-selected":t.isTabActive("code"),tabindex:!t.isTabActive("code")&&"-1",href:"#",role:"tab","data-test-variant-tab-link":"code"},on:{click:function(e){e.preventDefault(),t.activeSection="code"}}},[e("AppIcon",{staticClass:"contentheader__option-icon",attrs:{symbol:"code"}})],1),t._v(" "),t._l(t.pluginTabs,(function(n){return e("a",{key:n.id,ref:"plugin-tab",refInFor:!0,staticClass:"contentheader__option",attrs:{id:t.tabId(n.id),"aria-selected":t.isTabActive(n.id),tabindex:!t.isTabActive(n.id)&&"-1","data-test-variant-tab-link":n.id,href:"#",role:"tab"},on:{click:function(e){e.preventDefault(),t.activeSection=n.id}}},[t._v("\n            "+t._s(n.title)+"\n          ")])}))],2)],2):t._e()])],2),t._v(" "),t.variant.description?e("div",{staticClass:"content",domProps:{innerHTML:t._s(t.variant.description)}}):t._e(),t._v(" "),t.hasPreview||t.hasCode?e("div",{staticClass:"uie-sot-xl"},[t.hasPreview?e("div",{staticClass:"contentsection",attrs:{"aria-labelledby":t.tabId("preview"),hidden:!t.isTabActive("preview"),role:"tabpanel"}},[e("ContentPreview",{ref:"preview",attrs:{id:t._f("dasherize")(t.variant.id),title:t.variant.title,"path-postfix":t.variant.id,"path-prefix":"_variants"}})],1):t._e(),t._v(" "),t.hasCode?e("div",{staticClass:"contentsection",attrs:{"aria-labelledby":t.tabId("code"),hidden:!t.isTabActive("code"),role:"tabpanel"}},[e("ContentCode",{attrs:{extension:t.variant.extension,raw:t.variant.raw,context:t.variant.context,"path-postfix":t.variant.id,"path-prefix":"_variants"}})],1):t._e(),t._v(" "),t._l(t.pluginTabs,(function(n){return e("div",{key:n.id,ref:"plugin-tab-content",refInFor:!0,staticClass:"contentsection content",attrs:{"aria-labelledby":t.tabId(n.id),hidden:!t.isTabActive(n.id),role:"tabpanel"}},[t._v("\n      "+t._s(n.id)+"\n    ")])}))],2):t._e()],1)}),[],!1,null,"1ea424fa",null).exports;function T(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function I(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?T(Object(n),!0).forEach((function(e){(0,i.A)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):T(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var j={components:{ContentHeader:c.A,ContentText:l.A,ContentProperties:p.A,ContentThemeProperties:f,ContentLabel:m,ContentTag:b.A,ComponentVariant:O},mixins:[s.A,o.A],props:{id:{type:String,required:!0}},data:function(){return{activeSection:null}},computed:I(I({},(0,r.L8)("state",["components","config","navigation"])),{},{dependencies:function(){var t=this;return this.component.dependencies.filter((function(e){return t.componentById(e)}))},dependentComponents:function(){var t=this;return this.component.dependentComponents.filter((function(e){return t.componentById(e)}))},component:function(){return this.components[this.id]},variants:function(){return this.displayAllThemes?this.component.variants:this.component.variants.filter(this.displayVariant)},hasDependencies:function(){return this.component.dependencies&&this.component.dependencies.filter(this.componentById).length>0},hasDependentComponents:function(){return!!this.component.dependentComponents&&this.component.dependentComponents.filter(this.componentById).length>0},hasVariants:function(){return this.variants.length>0},hasManyVariants:function(){return this.variants.length>1},hasProperties:function(){var t=this.component.properties;return t&&Object.keys(t).length>0},hasThemeProperties:function(){var t=this.component.themeProperties;return t&&t.length>0},hasInfo:function(){return!(!this.component.content&&!this.hasSecondaryInfo)},hasSecondaryInfo:function(){return this.hasManyVariants||this.hasDependencies||this.hasDependentComponents},isInfoActive:function(){return"info"===this.activeSection||!this.activeSection&&this.hasInfo},isPropertiesActive:function(){return"properties"===this.activeSection||!this.activeSection&&!this.hasInfo&&this.hasProperties},isThemePropertiesActive:function(){return"theme-properties"===this.activeSection||!this.activeSection&&!this.hasInfo&&!this.hasProperties&&this.hasThemeProperties},fileLink:function(){return this.findFileLink(this.component)}}),methods:{dasherize:a.dasherize,componentLink:function(t){return Object.values(this.navigation).find((function(e){return"component"===e.type&&e.itemId===t}))},componentById:function(t){return this.components[t]},displayVariant:function(t){return!(t.themeIds&&!t.themeIds.includes(this.currentTheme.id))},tabId:function(t){return"".concat((0,a.dasherize)(this.component.id),"-").concat(t)},switchTab:function(t){this.activeSection=t,this.$refs["".concat(t,"-tab")].focus()}}},x=(0,d.A)(j,(function(){var t=this,e=t._self._c;return e("div",[e("section",{staticClass:"component"},[e("ContentHeader",{attrs:{title:t.component.title}},[t.component.label?e("ContentLabel",[t._v("\n        "+t._s(t.component.label)+"\n      ")]):t._e(),t._v(" "),t._l(t.component.tags,(function(t){return e("ContentTag",{key:t,attrs:{tag:t}})})),t._v(" "),e("div",{staticClass:"contentheader__right"},[t.fileLink?e("a",{staticClass:"contentheader__action",attrs:{href:t.fileLink,"aria-label":t._f("localize")("options.edit")}},[e("AppIcon",{attrs:{symbol:"edit"}})],1):t._e(),t._v(" "),e("div",{staticClass:"contentheader__options",attrs:{role:"tablist"}},[t.hasInfo?e("a",{ref:"info-tab",staticClass:"contentheader__option",attrs:{id:t.tabId("info"),"aria-selected":t.isInfoActive,tabindex:!t.isInfoActive&&"-1",role:"tab",href:"#info"},on:{click:function(e){e.preventDefault(),t.activeSection="info"},keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"right",39,e.key,["Right","ArrowRight"])||"button"in e&&2!==e.button?null:t.switchTab("properties")}}},[t._v("\n            "+t._s(t._f("localize")("options.info"))+"\n          ")]):t._e(),t._v(" "),t.hasProperties?e("a",{ref:"properties-tab",staticClass:"contentheader__option",attrs:{id:t.tabId("properties"),"aria-selected":t.isPropertiesActive,tabindex:!t.isPropertiesActive&&"-1",role:"tab",href:"#properties"},on:{click:function(e){e.preventDefault(),t.activeSection="properties"},keydown:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])||"button"in e&&0!==e.button?null:t.switchTab("info")},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"right",39,e.key,["Right","ArrowRight"])||"button"in e&&2!==e.button?null:t.switchTab("theme-properties")}]}},[t._v("\n            "+t._s(t._f("localize")("options.properties"))+"\n          ")]):t._e(),t._v(" "),t.hasThemeProperties?e("a",{ref:"theme-properties-tab",staticClass:"contentheader__option",attrs:{id:t.tabId("theme-properties"),"aria-selected":t.isThemePropertiesActive,tabindex:!t.isThemePropertiesActive&&"-1",role:"tab",href:"#theme-properties"},on:{click:function(e){e.preventDefault(),t.activeSection="theme-properties"},keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])||"button"in e&&0!==e.button?null:t.switchTab("properties")}}},[t._v("\n            "+t._s(t._f("localize")("options.theme_properties"))+"\n          ")]):t._e()])])],2),t._v(" "),t.hasInfo||t.hasProperties||t.hasThemeProperties?e("div",{staticClass:"uie-sot-xxl"},[t.hasInfo?e("div",{staticClass:"contentsection",attrs:{"aria-labelledby":t.tabId("info"),hidden:!t.isInfoActive,role:"tabpanel"}},[e("ContentText",{attrs:{item:t.component}}),t._v(" "),t.hasSecondaryInfo?e("div",{staticClass:"content uie-sot-l"},[t.hasDependencies?[e("p",{staticClass:"content__smallprint"},[t._v("\n              "+t._s(t._f("localize")("component.dependencies"))+"\n              "),t._l(t.dependencies,(function(n,i){return e("span",{key:n},[t.componentLink(n)?e("RouterLink",{staticClass:"contentsection__list-item",attrs:{to:t.componentLink(n),"active-class":"","exact-active-class":""}},[t._v("\n                  "+t._s(t.componentById(n).title)+"\n                ")]):[t._v("\n                  "+t._s(t.componentById(n).title)+"\n                ")],t._v(" "),e("span",{staticClass:"divider"},[t._v("\n                  "+t._s(i!=t.dependencies.length-1?",":".")+"\n                ")])],2)}))],2)]:t._e(),t._v(" "),t.hasDependentComponents?[e("p",{staticClass:"content__smallprint"},[t._v("\n              "+t._s(t._f("localize")("component.dependents"))+"\n              "),t._l(t.dependentComponents,(function(n,i){return e("span",{key:n},[t.componentLink(n)?e("RouterLink",{staticClass:"contentsection__list-item",attrs:{to:t.componentLink(n),"active-class":"","exact-active-class":""}},[t._v("\n                  "+t._s(t.componentById(n).title)+"\n                ")]):[t._v("\n                  "+t._s(t.componentById(n).title)+"\n                ")],t._v(" "),e("span",{staticClass:"divider"},[t._v("\n                  "+t._s(i!=t.dependentComponents.length-1?",":".")+"\n                ")])],2)}))],2)]:t._e(),t._v(" "),t.hasManyVariants?[e("div",{staticClass:"in-page-nav"},[e("span",{staticClass:"in-page-nav__heading"},[t._v("On this page")]),t._v(" "),e("ul",{staticClass:"in-page-nav__list"},t._l(t.variants,(function(n){return e("li",{key:n.id},[e("RouterLink",{staticClass:"in-page-nav__link",attrs:{to:{hash:t.dasherize(n.id)},"active-class":"","exact-active-class":""}},[t._v("\n                    "+t._s(n.title)+"\n                  ")])],1)})),0)])]:t._e()],2):t._e()],1):t._e(),t._v(" "),t.hasProperties?e("div",{staticClass:"contentsection",attrs:{"aria-labelledby":t.tabId("properties"),hidden:!t.isPropertiesActive,role:"tabpanel"}},[e("div",{staticClass:"content"},t._l(t.component.properties,(function(t,n){return e("ContentProperties",{key:n,attrs:{title:n,properties:t}})})),1)]):t._e(),t._v(" "),t.hasThemeProperties?e("div",{staticClass:"contentsection",attrs:{"aria-labelledby":t.tabId("theme-properties"),hidden:!t.isThemePropertiesActive,role:"tabpanel"}},[e("ContentThemeProperties",{attrs:{title:t._f("localize")("options.theme_properties"),"theme-properties":t.component.themeProperties}})],1):t._e()]):t._e()],1),t._v(" "),e("hr",{staticClass:"sections-divider"}),t._v(" "),t.hasVariants?e("section",{staticClass:"variants"},t._l(t.variants,(function(n){return e("ComponentVariant",{key:n.id,attrs:{variant:n,component:t.component}})})),1):t._e()])}),[],!1,null,"3ac5cfd6",null).exports}}]);