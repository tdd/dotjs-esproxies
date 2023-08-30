import{d as _,a3 as u,z as f,f as n,g as t,t as s,J as c,F as h,ai as g,o as i,i as v,e as x,ac as b}from"../modules/vue-CY3OsIzI.js";import{a as y,u as N}from"../index-DtGzsKi4.js";import{a as m}from"../monaco/bundled-types-GyhiB4uL.js";import{_ as k}from"./NoteDisplay.vue_vue_type_style_index_0_lang-BIYc7cHC.js";import"../modules/shiki-Bsyf5hhV.js";import"../modules/file-saver-BzOOqXCn.js";const w={id:"page-root"},L={class:"m-4"},T={class:"mb-10"},V={class:"text-4xl font-bold mt-2"},B={class:"opacity-50"},H={class:"text-lg"},S={class:"font-bold flex gap-2"},z={class:"opacity-50"},C={key:0,class:"border-main mb-8"},J=_({__name:"print",setup(D){const{slides:p,total:d}=y();u(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),N({title:`Notes - ${m.title}`});const l=f(()=>p.value.map(e=>{var a;return(a=e.meta)==null?void 0:a.slide}).filter(e=>e!==void 0&&e.noteHTML!==""));return(e,a)=>(i(),n("div",w,[t("div",L,[t("div",T,[t("h1",V,s(c(m).title),1),t("div",B,s(new Date().toLocaleString()),1)]),(i(!0),n(h,null,g(l.value,(o,r)=>(i(),n("div",{key:r,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",H,[t("div",S,[t("div",z,s(o==null?void 0:o.no)+"/"+s(c(d)),1),b(" "+s(o==null?void 0:o.title)+" ",1),a[0]||(a[0]=t("div",{class:"flex-auto"},null,-1))])]),x(k,{"note-html":o.noteHTML,class:"max-w-full"},null,8,["note-html"])]),r<l.value.length-1?(i(),n("hr",C)):v("v-if",!0)]))),128))])]))}});export{J as default};
