(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"9voe":function(t,e,n){"use strict";n.d(e,"a",function(){return s});var r=n("lJxs"),o=n("hxEh"),a=n("fXoL"),i=n("aqeI");let s=(()=>{class t{constructor(t){this.github=t}getSortedBlogList(){return this.github.getBlogFiles().pipe(Object(r.a)(t=>Object(o.d)(t)))}getPaginatedBlogLists(){return this.github.getBlogFiles().pipe(Object(r.a)(t=>Object(o.c)(t)))}getGroupedByDateBlogs(){return this.github.getBlogFiles().pipe(Object(r.a)(t=>Object(o.b)(t)))}}return t.\u0275fac=function(e){return new(e||t)(a.Kb(i.a))},t.\u0275prov=a.zb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},Cmh5:function(t,e,n){"use strict";n.d(e,"a",function(){return a});var r=n("ofXK"),o=n("fXoL");let a=(()=>{class t{}return t.\u0275mod=o.Bb({type:t}),t.\u0275inj=o.Ab({factory:function(e){return new(e||t)},imports:[[r.c]]}),t})()},a8BA:function(t,e,n){"use strict";n.d(e,"a",function(){return m});var r=n("ofXK"),o=n("QmfV"),a=n("sS2b");function i(t){const[e,n]=t.split("/");return e===n}function s(t){return`https://github.com/${t}/blob/main/`}function c(t){return`https://github.com/${t}/raw/main/`}function l(t,e,n){if(Object(a.b)(t))return t;const r=new o.a(t,e);return new o.a(`${n}${r.href.replace(/^\/*/,"")}`).href}var u=n("fXoL"),d=n("EdIQ"),h=n("tyNb"),f=n("Fsdv");const p=["template"];let m=(()=>{class t{constructor(t,e,n,r,o,a,i,s){this.config=t,this.location=e,this.route=n,this.router=r,this.toc=o,this.el=a,this.renderer=i,this.document=s}ngOnInit(){this.renderMarkdown(this.markdownMeta)}ngOnDestroy(){this.toc.updateTocData([])}handleClick(t){if(t.target instanceof Element){let e=null;for(let n of t.composedPath())n instanceof HTMLAnchorElement&&(e=n);if((null==e?void 0:e.classList.contains("on-site-link"))&&(t.preventDefault(),""!==e.href))if(Object(a.a)(this.document.location.href,e.href)){let t=new o.a(e.href).hash;if(""!==t){t=`user-content-${t.slice(1)}`;let n=this.document.getElementById(decodeURIComponent(t));null!==n&&(history.pushState(null,"",e.href),n.scrollIntoView())}}else this.router.navigateByUrl(`${decodeURI(e.getAttribute("href"))}`)}}renderMarkdown(t){this.template=this.templateElementRef.nativeElement,this.template.innerHTML=t.source,this.markdown=this.template.content.firstElementChild,function(t,e){!function(t,{path:e,repo:n}){const r=t.getElementsByTagName("img");for(const o of r){const t=o.getAttribute("src");if(t){const r=l(t,e,c(n));o.setAttribute("src",r)}}}(t,e),function(t,{path:e,repo:n}){const r=t.getElementsByTagName("a");for(const l of r){const t=l.getAttribute("href");if(t){if(Object(a.b)(t))continue;let r=new o.a(t,e);if(!i(n)&&((c=r.pathname).startsWith("blog/README.md")||c.startsWith("blog/blogs")&&c.match(/\/\d{4}-\d{1,2}-\d{1,2}(?:-\d+)?-.+\.md$/)))r.pathname.startsWith("blog/README.md")?r.pathname="/about":(r.pathname=r.pathname.replace(/\.md$/,""),r.pathname=r.pathname.replace(/^blog\/blogs\//,"/blog/"),l.classList.add("on-site-link"));else{const t=s(n);r=new o.a(`${t}${r.href.replace(/^\/*/,"")}`)}l.setAttribute("href",r.href)}}var c}(t,e)}(this.markdown,t),setTimeout(()=>{this.toc.updateTocData(this.generateTocData())},0),this.renderer.appendChild(this.el.nativeElement,this.template.content),this.route.fragment.subscribe(t=>{setTimeout(()=>{var e;null===(e=this.document.getElementById(decodeURIComponent(`user-content-${t}`)))||void 0===e||e.scrollIntoView()},0)})}generateTocData(){return[...this.markdown.querySelectorAll("h2, h3")].filter(t=>null!==t.querySelector("a:first-child")).map(t=>{var e;const n={level:0,href:new o.a,innerHTML:""},r=t.cloneNode(!0);return n.level=parseInt(t.tagName.slice(1)),n.href.href=null!==(e=r.firstElementChild.getAttribute("href"))&&void 0!==e?e:"",r.removeChild(r.firstElementChild),n.innerHTML=r.innerHTML,n}).reduce((t,e)=>{let n=t;for(let r=e.level;r>2;r-=1)void 0===n[n.length-1].subTocData&&(n[n.length-1].subTocData=[]),n=n[n.length-1].subTocData;return n.push(e),t},[])}}return t.\u0275fac=function(e){return new(e||t)(u.Db(d.a),u.Db(r.i),u.Db(h.a),u.Db(h.d),u.Db(f.a),u.Db(u.l),u.Db(u.D),u.Db(r.d))},t.\u0275cmp=u.xb({type:t,selectors:[["app-markdown"]],viewQuery:function(t,e){if(1&t&&u.bc(p,!0),2&t){let t;u.Wb(t=u.Ob())&&(e.templateElementRef=t.first)}},hostBindings:function(t,e){1&t&&u.Nb("click",function(t){return e.handleClick(t)})},inputs:{markdownMeta:"markdownMeta"},decls:2,vars:0,consts:[["template",""]],template:function(t,e){1&t&&u.Eb(0,"template",null,0)},styles:["[_nghost-%COMP%]{display:block;padding-top:32px;padding-bottom:32px}"]}),t})()},hxEh:function(t,e,n){"use strict";n.d(e,"a",function(){return a}),n.d(e,"d",function(){return i}),n.d(e,"b",function(){return s}),n.d(e,"e",function(){return c}),n.d(e,"c",function(){return l});var r=n("Li0R"),o=n("GK9D");function a(t){const e=t.match(/^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:-(?<no>\d+))?-(?<rawTitle>.+)$/).groups;return`[${e.year}-${e.month}-${e.day}${e.no?" "+e.no:""}] ${(n=e.rawTitle,decodeURIComponent(n)).replace(/-/g," ")}`;var n}function i(t){return f(u(t))}function s(t){return f(u(t)).reduce((t,e)=>{const n=e.created_at.slice(0,10);return t.has(n)?t.get(n).push(e):t.set(n,[e]),t},new Map)}function c(t){return t.reduce((t,e)=>{const n=e.created_at.slice(0,7);return t.has(n)?t.get(n).push(e):t.set(n,[e]),t},new Map)}function l(t){return e=f(u(t)),n=+(o.a.BLOGS_PER_PAGE||15),e.reduce((t,e,r)=>{const o=Math.floor(r/n);return t[o]||(t[o]=[]),t[o].push(e),t},[]);var e,n}function u(t){return t.map(d)}function d(t){const e=t.name.match(/^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:-(?<no>\d+))?-(?<rawTitle>.+)\.md$/).groups;return{name:t.name,rawTitle:e.rawTitle,title:e.rawTitle.replace(/-/g," "),path:t.path,html_url:t.html_url,edit_url:t.html_url.replace(new RegExp(`(?<=^${r.c}/(?:[^/]+/){2})blob`),"edit"),routerLink:`/blog/${t.name.replace(/\.md$/,"")}`,created_at:h(e.year,e.month,e.day),no:e.no}}function h(t,e,n){const r=`T12:00${o.a.BLOG_TIME_ZONE||"Z"}`;return`${t}-${e.padStart(2,"0")}-${n.padStart(2,"0")}${r}`}function f(t){return t.sort((t,e)=>{var n,r;const o=Date.parse(e.created_at)-Date.parse(t.created_at);if(0!==o)return o;const a=Number(null!==(n=t.no)&&void 0!==n?n:0),i=Number(null!==(r=e.no)&&void 0!==r?r:0);return a!==i?i-a:(new Intl.Collator).compare(t.title,e.title)})}},o7am:function(t,e,n){"use strict";n.d(e,"a",function(){return i});var r=n("fXoL"),o=n("ofXK");function a(t,e){1&t&&(r.Ib(0,"p"),r.fc(1,"loading"),r.Eb(2,"span",1),r.Hb())}let i=(()=>{class t{constructor(){this.loading=!1}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=r.xb({type:t,selectors:[["app-loader"]],inputs:{loading:"loading"},decls:1,vars:1,consts:[[4,"ngIf"],[1,"AnimatedEllipsis"]],template:function(t,e){1&t&&r.dc(0,a,3,0,"p",0),2&t&&r.Vb("ngIf",e.loading)},directives:[o.l],styles:[""]}),t})()}}]);