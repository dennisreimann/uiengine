"use strict";(self.webpackChunk_uiengine_ui=self.webpackChunk_uiengine_ui||[]).push([[380],{6724:function(t,e,r){r.r(e),r.d(e,{default:function(){return f}});var n=r(5832),s=r(3348),i=r(5312),c=r(3320);function u(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function o(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?u(Object(r),!0).forEach((function(e){(0,n.c)(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var l={threshold:.2,keys:[{name:"title",weight:.7},{name:"keywords",weight:.5}]},a={components:{ContentHeader:c.c},props:{query:{type:String,required:!0}},data:function(){return{results:[]}},computed:o(o(o({},(0,i.gV)("state",["navigation"])),(0,i.gV)("preferences",["locale"])),{},{repo:function(){var t=Object.values(this.navigation).filter((function(t){return!t.isStructural}));return new s.c(t,l)},title:function(){return this.$options.filters.localize("search.title",{query:this.query})}}),watch:{$route:"search"},created:function(){this.search()},methods:{search:function(){this.results=this.repo.search(this.query).map((function(t){return t.item})),1===this.results.length&&this.$router.replace(this.results[0])}},metaInfo:function(){return{title:this.title}}},f=(0,r(4776).c)(a,(function(){var t=this,e=t._self._c;return e("section",{staticClass:"page"},[e("ContentHeader",{staticClass:"uie-sob-l",attrs:{title:t.title}}),t._v(" "),e("article",{staticClass:"content"},[0===t.results.length?e("p",[t._v("\n      "+t._s(t._f("localize")("search.no_results"))+"\n    ")]):e("ul",t._l(t.results,(function(r){return e("li",{key:r.id},[e("RouterLink",{attrs:{to:r}},[t._v("\n          "+t._s(r.title)+"\n        ")]),t._v("\n        ("+t._s(t._f("upcaseFirstChar")(r.type))+")\n      ")],1)})),0)])],1)}),[],!1,null,null,null).exports}}]);