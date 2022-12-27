(self.webpackChunk_uiengine_ui=self.webpackChunk_uiengine_ui||[]).push([[179],{6931:function(t){t.exports=function(t,e,n){var r=e.split(".").reduce((function(t,e){return t&&t[e]}),t);return r&&n?r.replace(/%\{(.+?)\}/g,(function(t,r){var i=n[r];return i||(console.warn("[UIengine]",'Missing interpolation "'.concat(r,'" for key "').concat(e,'"!')),"[".concat(r,"]"))})):r||(console.warn("[UIengine]",'Missing localization for key "'.concat(e,'"!')),"[".concat(e,"]"))}},4593:function(t,e,n){"use strict";var r=n(6421),i=n(4236),o=n(6354),a=n.n(o),s=n(2008),c=n.n(s),l=n(2653),u=n(5026),p=n(2640);function f(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function d(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?f(Object(n),!0).forEach((function(e){(0,u.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var v={mixins:[n(9106).Z],data:function(){return{query:"",isThemesActive:!1}},computed:d(d({},(0,p.Se)("state",["navigation"])),(0,p.Se)("preferences",["locale","navigationCollapsed","searchCollapsed"])),created:function(){var t=this;this.$root.$on("modal-close",(function(){t.isThemesActive=!1}))},methods:d(d({},(0,p.OI)("preferences",["setNavigationCollapsed","setSearchCollapsed","setCurrentTheme"])),{},{search:function(){var t=this.query.trim();t.length&&this.$router.push({name:"search",params:{query:t}})},setCurrentThemeAll:function(){this.setCurrentTheme({id:"_all",title:this.$options.filters.localize("options.all_themes")})},toggleSearch:function(){var t=this;this.setSearchCollapsed(!this.searchCollapsed),this.searchCollapsed||window.requestAnimationFrame((function(){t.$refs.searchfield.focus()}))}})},h=n(7314),g=(0,h.Z)(v,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"topbar"},[e("button",{staticClass:"topbar__toggle topbar__toggle--menu",attrs:{title:t._f("localize")("navigation.toggle"),"aria-expanded":t._f("bool2string")(!t.navigationCollapsed),type:"button","aria-controls":"navigation-root","data-test-navtoggle":""},on:{click:function(e){return e.preventDefault(),t.setNavigationCollapsed(!t.navigationCollapsed)}}},[e("AppIcon",{staticClass:"topbar__icon",attrs:{symbol:"burger"}})],1),t._v(" "),e("form",{staticClass:"topbar__search",class:{"topbar__search--collapsed":t.searchCollapsed},on:{submit:function(e){return e.preventDefault(),t.search.apply(null,arguments)}}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.query,expression:"query"}],ref:"searchfield",staticClass:"topbar__searchfield",attrs:{type:"search",placeholder:"Search",name:"query","aria-label":t._f("localize")("search.label"),"data-test-searchfield":""},domProps:{value:t.query},on:{input:function(e){e.target.composing||(t.query=e.target.value)}}})]),t._v(" "),t.themes&&t.themes.length>1?e("div",{staticClass:"topbar__theme",attrs:{"data-test-theme-switch":""}},[e("button",{staticClass:"topbar__theme-toggle",attrs:{title:t._f("localize")("options.toggle"),"aria-expanded":t._f("bool2string")(t.isThemesActive),type:"button","data-test-theme-switch-current":""},on:{click:function(e){e.stopPropagation(),t.isThemesActive=!t.isThemesActive}}},[t._v("\n      "+t._s(t.currentTheme.title)+"\n\n      "),e("AppIcon",{staticClass:"topbar__theme-toggle-icon",attrs:{symbol:"caret-down"}})],1),t._v(" "),e("div",{staticClass:"topbar__theme-options",class:{"topbar__theme-options--active":t.isThemesActive}},[e("div",{staticClass:"topbar__theme-options-inner"},[t._l(t.themes,(function(n){return e("button",{key:n.id,staticClass:"topbar__theme-option",attrs:{type:"button","aria-selected":t.currentTheme.id===n.id,"data-test-theme-switch-id":n.id},on:{click:function(e){return t.setCurrentTheme(n)}}},[t._v("\n          "+t._s(n.title)+"\n        ")])})),t._v(" "),e("button",{staticClass:"topbar__theme-option topbar__theme-option--all",attrs:{type:"button","aria-selected":t.displayAllThemes,"data-test-theme-switch-all":""},on:{click:function(e){return t.setCurrentThemeAll()}}},[t._v("\n          "+t._s(t._f("localize")("options.all_themes"))+"\n        ")])],2)])]):t._e(),t._v(" "),e("button",{staticClass:"topbar__toggle topbar__toggle--search",attrs:{title:t._f("localize")("search.toggle"),type:"button"},on:{click:function(e){return e.preventDefault(),t.toggleSearch.apply(null,arguments)}}},[e("AppIcon",{staticClass:"topbar__icon",attrs:{symbol:"search"}})],1)])}),[],!1,null,"0778ce28",null),m=g.exports;function _(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function b(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?_(Object(n),!0).forEach((function(e){(0,u.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var y={computed:b(b({},(0,p.Se)("state",["config","navigation"])),(0,p.Se)("preferences",["locale","navigationCollapsed"]))},O=(0,h.Z)(y,(function(){var t=this,e=t._self._c;return t.navigation?e("nav",{staticClass:"navigation",attrs:{id:"navigation",hidden:t.navigationCollapsed,"data-test-navigation":""}},[e("RouterLink",{staticClass:"navigation__project-details",attrs:{to:t.navigation.index,"active-class":"","exact-active-class":""}},[t.config.logo?e("img",{staticClass:"navigation__project-logo",attrs:{src:t.config.logo}}):t._e(),t._v(" "),e("h1",{staticClass:"navigation__project-name"},[t._v("\n      "+t._s(t.config.name)+"\n    ")])]),t._v(" "),t.navigation.index.childIds?e("AppNavigationTree",{attrs:{id:"navigation-root",items:t.navigation.index.childIds,navigation:t.navigation,level:0}}):t._e()],1):t._e()}),[],!1,null,"6937a9e1",null).exports;function C(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function P(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?C(Object(n),!0).forEach((function(e){(0,u.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):C(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var w={computed:P(P(P({},(0,p.Se)("state",["config","navigation"])),(0,p.Se)("preferences",["locale"])),{},{lastUpdate:function(){return new Date(this.config.update).toLocaleString(this.locale)},navItem:function(){var t=this.$route.meta.navItemId;return this.navigation[t]},prevPage:function(){return this.findPrevPage(this.$route.meta.navItemId,!0)},nextPage:function(){return this.findNextPage(this.$route.meta.navItemId,!0)}}),methods:{findPrevPage:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(t){var r=this.navigation[t];if(r){var i=r.childIds,o=r.prevSiblingId,a=r.parentId;return!n&&i?this.findPrevPage(i[i.length-1],!1,!1):e||r.isStructural?o?this.findPrevPage(o,!1,!1):a?this.findPrevPage(a,!1,!0):void 0:r}}},findNextPage:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t){var r=this.navigation[t];if(r){var i=r.childIds,o=r.nextSiblingId,a=r.parentId;return e||r.isStructural?!n&&i?this.findNextPage(i[0]):o?this.findNextPage(o):a?this.findNextPage(a,!0,!0):void 0:r}}}}},j=w,I=n(2390),k=n.n(I),S=(0,h.Z)(j,(function(){var t=this,e=t._self._c;return e("footer",{staticClass:"footer"},[t.prevPage||t.nextPage?e("p",{staticClass:"footer__nav"},[t.prevPage?e("RouterLink",{staticClass:"footer__prevlink",attrs:{to:t.prevPage,"data-test-footer-prevlink":""}},[e("AppIcon",{attrs:{symbol:"caret-left"}}),t._v("\n      "+t._s(t.prevPage.title)+"\n    ")],1):t._e(),t._v(" "),t.nextPage?e("RouterLink",{staticClass:"footer__nextlink",attrs:{to:t.nextPage,"data-test-footer-nextlink":""}},[t._v("\n      "+t._s(t.nextPage.title)+"\n      "),e("AppIcon",{attrs:{symbol:"caret-right"}})],1):t._e()],1):t._e(),t._v(" "),e("div",[t.config.copyright?e("p",{staticClass:"footer__copyright",attrs:{"data-test-footer-copyright":""},domProps:{innerHTML:t._s(t.config.copyright)}}):t._e(),t._v(" "),t.config.version?e("p",{staticClass:"footer__version",attrs:{"data-test-footer-version":""}},[t._v("\n      "+t._s(t._f("localize")("footer.version"))+" "+t._s(t.config.version)+" –\n      "+t._s(t._f("localize")("footer.last_update"))+" "+t._s(t.lastUpdate)+".\n    ")]):t._e()])])}),[],!1,null,"cdcd25a2",null);"function"==typeof k()&&k()(S);var T=S.exports,Z={computed:(0,p.Se)("state",["navigation"]),metaInfo:function(){var t=this.$route.meta,e=t.navItemId,n=t.navItemTitle,r=this.navigation[e];return{title:r?r.title:n}}},x=(0,h.Z)(Z,(function(){var t=this._self._c;return t("main",{staticClass:"main"},[t("RouterView")],1)}),[],!1,null,null,null).exports;function A(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function D(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?A(Object(n),!0).forEach((function(e){(0,u.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):A(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var N=document.documentElement,q=document.getElementById("hljs"),M=q.getAttribute("data-tmpl"),$={components:{AppTopbar:m,AppNavigation:O,AppFooter:T,AppMain:x},computed:D(D({},(0,p.Se)("preferences",["currentTheme"])),{},{themeId:function(){return this.currentTheme&&this.currentTheme.id}}),created:function(){var t=this;this.$root.$on("setting-hljs",this.setHljs),this.$store.watch((function(){return t.$store.getters["preferences/currentTheme"]}),this.setCurrentTheme);var e=this.$store.getters["preferences/hljs"];e&&this.setHljs(e),this.setCurrentTheme(this.currentTheme)},methods:{closeModals:function(){this.$root.$emit("modal-close")},setHljs:function(t){q.setAttribute("href",M.replace("%s",t))},setCurrentTheme:function(t){N.setAttribute("data-theme",t.id)}},metaInfo:function(){var t=this.$store.getters["state/config"],e=t?t.name:"";return t&&t.version&&(e+=" (".concat(t.version,")")),{titleTemplate:function(t){return t?"".concat(t," • ").concat(e):e}}}},E=(0,h.Z)($,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"layout",attrs:{id:"app"},on:{click:t.closeModals}},[e("AppTopbar"),t._v(" "),e("AppNavigation"),t._v(" "),e("AppMain"),t._v(" "),e("AppFooter")],1)}),[],!1,null,null,null).exports,z=n(4426),U=n(9334),F=n(6500);r.ZP.use(z.ZP);var L=function(t){if("documentation"===t)return U.default;var e=(0,F.upcaseFirstChar)(t);return function(){return n(1393)("./Main"+e)}},H=window.UIengine.state.config.ui,R=H.base,B=H.mode,K=new z.ZP({mode:B||"history",base:R||"/",scrollBehavior:function(t,e,n){return t.hash?{selector:t.hash}:n||{x:0,y:0}},routes:[{name:"search",path:"/_search/:query",props:!0,component:L("search"),meta:{navItemId:"_search"}},{name:"settings",path:"/_settings/",component:L("settings"),meta:{navItemId:"_settings"}},{path:"*",component:L("notFound")}]}),V=K,W=function(t){var e=Object.keys(t).map((function(e){var n=t[e];return{path:n.path,component:L(n.type),meta:{navItemId:n.id,navItemTitle:n.title},props:{id:n.itemId}}}));K.addRoutes(e)};W(window.UIengine.state.navigation);var J=function(t){var e,n,r=t.navigation;return n="Settings",r[e="settings"]={id:e,itemId:e,parentId:"index",path:"/_".concat(e,"/"),type:e,localizedTitleKey:"".concat(e,".title"),title:n},r.index.childIds.push(e),t},G={setState:function(t,e){for(var n in e=J(e))t[n]=e[n];var r=e.navigation;r&&W(r)}},Q={namespaced:!0,state:J(window.UIengine.state),getters:{pages:function(t){return t.pages},config:function(t){return t.config},plugins:function(t){return t.plugins},components:function(t){return t.components},navigation:function(t){return t.navigation}},mutations:G,actions:{}},X=n(6726),Y=window.UIengine.state.config,tt=Y.ui,et=Y.themes,nt={hljs:document.getElementById("hljs").getAttribute("data-default"),locale:document.documentElement.getAttribute("lang"),currentTheme:et&&et[0],navigationCollapsed:!1,navigationItemsCollapsed:{},searchCollapsed:!0,previewWidths:{},previewMode:tt&&tt.defaultPreviewMode||"breakpoints"},rt=Object.keys(nt).reduce((function(t,e){var n=nt[e];return t[e]=function(t,e){var n=window.sessionStorage.getItem("uiengine/".concat(t));return n?JSON.parse(n):e}(e,n),t}),{}),it=Object.keys(nt).reduce((function(t,e){return t[e]=function(t){return t[e]},t}),{}),ot=Object.keys(nt).reduce((function(t,e){var n=(0,F.upcaseFirstChar)(e);return t["set".concat(n)]=function(t,n){!function(t,e){e||"boolean"==typeof e?window.sessionStorage.setItem("uiengine/".concat(t),JSON.stringify(e)):window.sessionStorage.removeItem("uiengine/".concat(t))}(e,n),t[e]=function(t){return"object"===(0,X.Z)(t)?t instanceof Array?t:Object.assign({},t):t}(n)},t}),{}),at={namespaced:!0,state:rt,getters:it,mutations:ot,actions:{}};r.ZP.use(p.ZP);var st={state:Q,preferences:at},ct=new p.ZP.Store({modules:st}),lt=n(6931),ut=n.n(lt),pt=n(3990);r.ZP.filter("dasherize",F.dasherize),r.ZP.filter("upcaseFirstChar",F.upcaseFirstChar),r.ZP.filter("titleize",F.titleize),r.ZP.filter("bool2string",(function(t){return t?"true":"false"})),r.ZP.filter("localize",(function(t,e){var n=ct.getters["preferences/locale"],r=pt.l[n];return ut()(r,t,e)}));var ft={props:{title:{type:String,default:""},symbol:{type:String,required:!0}},computed:{symbolHref:function(){return"#".concat(this.symbol)}}},dt=(0,h.Z)(ft,(function(){var t=this,e=t._self._c;return e("svg",{staticClass:"icon",attrs:{title:t.title,role:"presentation","aria-hidden":"true",focusable:"false"}},[e("use",{attrs:{"xlink:href":t.symbolHref}})])}),[],!1,null,"498522e7",null).exports,vt={props:{navigation:{type:Object,required:!0},items:{type:Array,required:!0},level:{type:Number,required:!0}},computed:{levelClass:function(){return"navigation__tree--level-".concat(this.level)},navigationItems:function(){var t=this;return this.items.filter((function(e){return void 0!==t.navigation[e]}))}}},ht=(0,h.Z)(vt,(function(){var t=this,e=t._self._c;return e("ul",{staticClass:"navigation__tree",class:t.levelClass},[t._l(t.navigationItems,(function(n){return e("AppNavigationItem",{key:n,attrs:{navigation:t.navigation,item:t.navigation[n],level:t.level}})})),t._v(" "),t._t("default")],2)}),[],!1,null,"e330ca40",null).exports;function gt(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function mt(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?gt(Object(n),!0).forEach((function(e){(0,u.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):gt(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var _t={props:{navigation:{type:Object,required:!0},item:{type:Object,required:!0},level:{type:Number,required:!0}},computed:mt(mt({},(0,p.Se)("preferences",["navigationItemsCollapsed"])),{},{children:function(){return this.item.childIds},isCurrentPage:function(){return this.$route.path===this.item.path},isCollapsed:function(){return void 0!==this.navigationItemsCollapsed[this.item.id]?this.navigationItemsCollapsed[this.item.id]:this.item.collapsed||!1},title:function(){var t=this.item,e=t.title,n=t.localizedTitleKey;return n?this.$options.filters.localize(n):e},classes:function(){var t=["navigation__item--level-".concat(this.level)];return this.children&&t.push("navigation__item--children"),this.isCollapsed&&t.push("navigation__item--collapsed"),this.isCurrentPage&&t.push("navigation__item--current"),t}}),methods:mt(mt({},(0,p.OI)("preferences",["setNavigationItemsCollapsed"])),{},{setCollapsed:function(t){var e=this.navigationItemsCollapsed;e[this.item.id]=t,this.setNavigationItemsCollapsed(e),t||this.$refs.children.$el.querySelector("a.navigation__link").focus()}})},bt=(0,h.Z)(_t,(function(){var t=this,e=t._self._c;return e("li",{staticClass:"navigation__item",class:t.classes,attrs:{"data-test-navitem-id":t.item.id}},[t.item.isStructural?e("span",{staticClass:"navigation__link"},[t._v("\n    "+t._s(t.title)+"\n  ")]):e("RouterLink",{staticClass:"navigation__link",attrs:{to:t.item}},[t._v("\n    "+t._s(t.title)+"\n  ")]),t._v(" "),t.children?e("button",{staticClass:"navigation__itemtoggle",attrs:{"aria-expanded":t._f("bool2string")(!t.isCollapsed),title:t._f("localize")("navigation.toggle"),type:"button","aria-haspopup":"true"},on:{click:function(e){return e.preventDefault(),t.setCollapsed(!t.isCollapsed)}}},[e("AppIcon",{staticClass:"navigation__icon",attrs:{symbol:"caret-down"}})],1):t._e(),t._v(" "),t.children?e("AppNavigationTree",{ref:"children",attrs:{navigation:t.navigation,items:t.children,level:t.level+1,"data-test-navtree-id":t.item.id}}):t._e()],1)}),[],!1,null,"0325e07b",null).exports,yt=n(5497);r.ZP.component("AppIcon",dt),r.ZP.component("AppNavigationTree",ht),r.ZP.component("AppNavigationItem",bt),r.ZP.component("ContentProperty",yt.Z);var Ot=(window.UIengine.state.config.ui||{}).analyticsId;if(n.p=window.UIengine.base,r.ZP.config.productionTip=!1,r.ZP.use(i.Z),Ot&&r.ZP.use(a(),{id:Ot,router:V,autoTracking:{exception:!0,exceptionLogs:!1},debug:{sendHitTask:!0}}),new r.ZP({el:"#app",router:V,store:ct,components:{App:E},mounted:function(){this.$nextTick((function(){(0,l.Z)({observeChanges:!0,observeRootSelector:"main.main"})}))},template:"<App/>"}),new(c())("[data-clipboard-text]").on("error",(function(t){console.error("[UIengine]","Clipboard error:",t)})),document.getElementById("__bs_script__")){var Ct=0;!function t(){var e=(window.___browserSync___||{}).socket;e?(e.on("uiengine:state:update",(function(t){ct.commit("state/setState",t)})),console.debug("[UIengine]","Connection to browser-sync socket established.")):Ct<=10?(setTimeout(t,100),Ct++):console.warn("[UIengine]","Could not connect to browser-sync socket.")}()}},4264:function(t,e){"use strict";e.Z={methods:{findFileLink:function(t){var e=!!window.___browserSync___,n=t.readmeFile,r=t.sourceFile,i=t.sourcePath,o=n||r||i;if(e){var a=this.config.source.base;return"vscode://file/".concat(a,"/").concat(o)}var s=this.config.ui.repoBaseUrl;return s?"".concat(s).concat(o):null}}}},9106:function(t,e,n){"use strict";var r=n(5026),i=n(2640);function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){(0,r.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}e.Z={computed:a(a(a({},(0,i.Se)("state",["config"])),(0,i.Se)("preferences",["currentTheme"])),{},{displayAllThemes:function(){return"_all"===this.currentTheme.id},displayedThemes:function(){return this.displayAllThemes?this.themes:[this.currentTheme]},themes:function(){return this.config.themes}})}},3990:function(t,e,n){"use strict";n.d(e,{l:function(){return l}});var r=n(653),i=n.n(r),o=window.UIengine,a=o.state.config.ui,s=o.locales,c=a&&a.locales?a.locales:{},l=i()(s,c)},2141:function(t,e,n){"use strict";n.d(e,{Z:function(){return i}});var r={components:{ContentHeading:n(2637).Z},props:{title:{type:String,default:null},level:{type:Number,default:1}}},i=(0,n(7314).Z)(r,(function(){var t=this,e=t._self._c;return e("header",{staticClass:"contentheader"},[t.title?e("ContentHeading",[t._v("\n    "+t._s(t.title)+"\n  ")]):t._e(),t._v(" "),t._t("default")],2)}),[],!1,null,"eaea4294",null).exports},2637:function(t,e,n){"use strict";n.d(e,{Z:function(){return i}});var r={props:{level:{type:Number,default:1}},render:function(t){return t("h".concat(this.level),{class:"contentheader__title"},this.$slots.default)}},i=(0,n(7314).Z)(r,undefined,undefined,!1,null,null,null).exports},5497:function(t,e,n){"use strict";n.d(e,{Z:function(){return i}});var r={props:{id:{type:String,required:!0},property:{type:Object,required:!0},displayDescription:{type:Boolean,required:!0}},computed:{propertyType:function(){var t=this.property,e=t.value,n=t.type;return["Array","Object"].includes(n)&&e?"".concat(this.property.type,"[").concat(e.type||e,"]"):this.property.type},description:function(){return this.property.description},required:function(){return this.property.required?"*":""},defaultValue:function(){return this.property.default}}},i=(0,n(7314).Z)(r,(function(){var t=this,e=t._self._c;return e("tr",[e("td",{staticClass:"property__name"},[t._v("\n    "+t._s(t.id)+"\n  ")]),t._v(" "),e("td",{staticClass:"property__type"},[t._v("\n    "+t._s(t.propertyType)+"\n  ")]),t._v(" "),t.displayDescription?e("td",{staticClass:"property__description"},[t._v("\n    "+t._s(t.description)+"\n  ")]):t._e(),t._v(" "),e("td",{staticClass:"property__required"},[t._v("\n    "+t._s(t.required)+"\n  ")]),t._v(" "),e("td",{staticClass:"property__default"},[t._v("\n    "+t._s(t.defaultValue)+"\n  ")])])}),[],!1,null,"d4d827e4",null).exports},3291:function(t,e,n){"use strict";n.d(e,{Z:function(){return i}});var r={props:{tag:{type:String,required:!0}},computed:{target:function(){return{name:"search",params:{query:this.tag}}}}},i=(0,n(7314).Z)(r,(function(){var t=this;return(0,t._self._c)("RouterLink",{staticClass:"tag",attrs:{to:t.target}},[t._v("\n  "+t._s(t.tag)+"\n")])}),[],!1,null,"372e3e56",null).exports},1457:function(t,e,n){"use strict";n.d(e,{Z:function(){return o}});var r=/^<h1.*?>.*<\/h1>/,i={props:{item:{type:Object,default:null}},computed:{renderedContent:function(){var t=this.item,e=t.content,n=t.isTitleFromHeading;return e?n?e.replace(r,"").trim():e:null}},methods:{handleLinkClicks:function(t){for(var e=t.target;e&&"A"!==e.tagName;)e=e.parentNode;if(e&&e.matches(".content a:not([href*='://'])")&&e.href){var n=t.altKey,r=t.ctrlKey,i=t.metaKey,o=t.shiftKey,a=t.button,s=t.defaultPrevented;if(i||n||r||o)return;if(s)return;if(void 0!==a&&0!==a)return;if(e&&e.getAttribute){var c=e.getAttribute("target");if(/\b_blank\b/i.test(c))return}var l=window.UIengine.state.config.ui.base,u=new RegExp("^".concat(l)),p=new URL(e.href).pathname,f=window.location.pathname,d=p.replace(u,"/"),v=f.replace(u,"/");void 0!==this.$router.resolve(d).resolved.meta.navItemId&&!(v===d)&&t.preventDefault&&(t.preventDefault(),this.$router.push(d))}}}},o=(0,n(7314).Z)(i,(function(){var t=this,e=t._self._c;return t.item.content?e("article",{staticClass:"content",domProps:{innerHTML:t._s(t.renderedContent)},on:{click:t.handleLinkClicks}}):t._e()}),[],!1,null,null,null).exports},9334:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return f}});var r=n(5026),i=n(2640),o=n(4264),a=n(2141),s=n(1457),c=n(3291);function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){(0,r.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var p={components:{ContentHeader:a.Z,ContentText:s.Z,ContentTag:c.Z},mixins:[o.Z],props:{id:{type:String,required:!0}},computed:u(u({},(0,i.Se)("state",["pages","config"])),{},{page:function(){return this.pages[this.id]},fileLink:function(){return this.findFileLink(this.page)}})},f=(0,n(7314).Z)(p,(function(){var t=this,e=t._self._c;return e("section",{staticClass:"page"},[e("ContentHeader",{attrs:{title:t.page.title}},[t._l(t.page.tags,(function(t){return e("ContentTag",{key:t,staticClass:"uie-sob-m",attrs:{tag:t}})})),t._v(" "),t.fileLink?e("div",{staticClass:"contentheader__options"},[e("a",{staticClass:"contentheader__action",attrs:{href:t.fileLink,"aria-label":t._f("localize")("options.edit")}},[e("AppIcon",{attrs:{symbol:"pencil"}})],1)]):t._e()],2),t._v(" "),e("ContentText",{attrs:{item:t.page}})],1)}),[],!1,null,null,null).exports},2390:function(){},1393:function(t,e,n){var r={"./MainComponent":[2368,556,941,477,478,674],"./MainComponent.vue":[2368,556,941,477,478,674],"./MainDocumentation":[9334],"./MainDocumentation.vue":[9334],"./MainNotFound":[6238,233],"./MainNotFound.vue":[6238,233],"./MainSearch":[4047,556,372],"./MainSearch.vue":[4047,556,372],"./MainSettings":[6495,466],"./MainSettings.vue":[6495,466],"./MainTemplate":[4338,556,941,477,478,773],"./MainTemplate.vue":[4338,556,941,477,478,773],"./MainTokens":[7283,556,477,262],"./MainTokens.vue":[7283,556,477,262]};function i(t){if(!n.o(r,t))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=r[t],i=e[0];return Promise.all(e.slice(1).map(n.e)).then((function(){return n(i)}))}i.keys=function(){return Object.keys(r)},i.id=1393,t.exports=i},6500:function(t,e,n){const r=n(1001),i=/^<h1.*?>(.*?)<\/h1>/;t.exports={crossPlatformPath:t=>t.replace(/\\/g,"/"),dasherize:t=>String(t).replace(/\W+/gi,"-"),titleize:t=>t.split(/\W+/gi).map((t=>t.charAt(0).toUpperCase()+t.slice(1))).join(" "),upcaseFirstChar:t=>t.charAt(0).toUpperCase()+t.slice(1),lowercaseFirstChar:t=>t.charAt(0).toLowerCase()+t.slice(1),hasContent:t=>!!t&&t.replace(i,"").trim().length>0,replaceTemplateComments:(t,e)=>Object.keys(e).reduce(((t,n)=>{const r=new RegExp(`\x3c!--\\s?uiengine:${n}\\s?--\x3e`,"gi"),i=e[n];return t.replace(r,i||"")}),t),titleFromContentHeading:t=>{const[,e]=t&&t.match(i)||[];return e&&r(e,"all")}}}},function(t){t.O(0,[179],(function(){[556,941,477,478,674,233,372,466,773,262].map(t.E)}),5);t.O(0,[556,418],(function(){return e=4593,t(t.s=e);var e}));t.O()}]);