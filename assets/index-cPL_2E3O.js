const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CodePreviewPanel-BWcJgivw.js","assets/vendor-react-BMF5l2ym.js","assets/vendor-B3CQIlJd.js","assets/CodePreviewPanel-CL3Tw202.css"])))=>i.map(i=>d[i]);
import{r as m,j as n,C as K,_ as pe,B as Te,S as Ne,M as Ee,R as Me,a as Re}from"./vendor-react-BMF5l2ym.js";import{B as De,p as je}from"./vendor-utils-CyR-czae.js";import{r as Ce}from"./vendor-katex-iDcKSI6h.js";import"./vendor-B3CQIlJd.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const d of o)if(d.type==="childList")for(const r of d.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(o){const d={};return o.integrity&&(d.integrity=o.integrity),o.referrerPolicy&&(d.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?d.credentials="include":o.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function i(o){if(o.ep)return;o.ep=!0;const d=t(o);fetch(o.href,d)}})();function Be({chapters:s,currentChapter:e,bodyContent:t,onChapterSelect:i,currentScript:o,onScriptSelect:d,selectedTopicId:r,onTopicSelect:p,loading:y}){var w,b;const l=m.useMemo(()=>{const a=e==null?void 0:e.content;if(!a)return[];let c="";const u=a.intro;typeof u=="string"?c=u:u&&typeof u=="object"&&u.body&&(c+=typeof u.body=="string"?u.body:Object.values(u.body).join(`
`));const v=t||a.body;if(v&&(typeof v=="string"?c+=`
`+v:Array.isArray(v)?c+=`
`+v.join(`
`):typeof v=="object"&&(c+=`
`+Object.values(v).join(`
`))),!c)return[];const E=/^###\s+(.+)$/gm,j=[];let $;for(;($=E.exec(c))!==null;){const B=$[1].trim(),z="topic-"+B.replace(/\s+/g,"-").toLowerCase();j.push({id:z,title:B})}return j},[e,t]);return n.jsxs("div",{className:"top-nav-container",children:[n.jsx("div",{className:"nav-group",children:n.jsxs("div",{className:"custom-select-wrapper",children:[n.jsxs("select",{id:"chapter-select",name:"chapter-select",value:(e==null?void 0:e.id)||"",onChange:a=>{const c=s.find(u=>u.id===a.target.value);c&&i(c)},disabled:y||s.length===0,className:"custom-select",children:[n.jsx("option",{value:"",disabled:!0,children:y?"載入中...":"📖 章節選擇"}),s.map(a=>n.jsx("option",{value:a.id,children:a.title},a.id))]}),n.jsx(K,{className:"select-icon",size:16})]})}),n.jsx("div",{className:`nav-group ${!e||l.length===0?"disabled":""}`,children:n.jsxs("div",{className:"custom-select-wrapper",children:[n.jsxs("select",{id:"topic-select",name:"topic-select",value:r,onChange:a=>p(a.target.value),disabled:!e||l.length===0,className:"custom-select",children:[n.jsx("option",{value:"",children:"💡 重點導覽"}),l.map(a=>n.jsx("option",{value:a.id,children:a.title},a.id))]}),n.jsx(K,{className:"select-icon",size:16})]})}),n.jsx("div",{className:`nav-group ${e?"":"disabled"}`,children:n.jsxs("div",{className:"custom-select-wrapper",children:[n.jsxs("select",{id:"script-select",name:"script-select",value:(o==null?void 0:o.filename)||"",onChange:a=>{var u;const c=(e==null?void 0:e.examples)||((u=e==null?void 0:e.content)==null?void 0:u.examples);if(c){const v=c.find(E=>E.filename===a.target.value);v&&d(v)}},disabled:!e||!(e.examples||(w=e.content)!=null&&w.examples)||(e.examples||((b=e.content)==null?void 0:b.examples)||[]).length===0,className:"custom-select",children:[n.jsx("option",{value:"",disabled:!0,children:"💻 程式代碼"}),(()=>{var u;return[...(e==null?void 0:e.examples)||((u=e==null?void 0:e.content)==null?void 0:u.examples)||[]].sort((v,E)=>v.filename.localeCompare(E.filename,void 0,{numeric:!0,sensitivity:"base"})).map(v=>n.jsx("option",{value:v.filename,children:v.filename},v.filename))})()]}),n.jsx(K,{className:"select-icon",size:16})]})})]})}const $e=new De,Ie=m.memo(({chapter:s,bodyContent:e,onCodeClick:t,selectedTopicId:i,output:o,isRunning:d,plotImages:r})=>{const p=m.useRef(null),y=m.useMemo(()=>{var w,b;if(!s)return null;const l=(w=s.content)==null?void 0:w.intro;if(l){let a="";if(typeof l=="string")a=l;else if(typeof l=="object"){a=`# ${l.title||""}

`,l.roadmap&&(l.roadmap.guide&&(a+=`## 📌 章節導覽
${l.roadmap.guide}

`),l.roadmap.objectives&&(a+=`## 🎯 學習目標
${l.roadmap.objectives}

`),l.roadmap.topics&&(a+=`## 📋 章節重點分明
${l.roadmap.topics}

`)),l.value&&(l.value.practical&&(a+=`## 💼 FRM 考試與實務連結
${l.value.practical}

`),l.value.theory&&(a+=`## 🏛️ 財金理論深度解析
${l.value.theory}

`),l.value.further_reading&&(a+=`## 🚀 延伸閱讀與進階議題
${l.value.further_reading}

`)),l.implementation&&(l.implementation.python&&(a+=`## 🐍 Python 實踐價值
${l.implementation.python}

`),l.implementation.logic&&(a+=`## ⚙️ 代碼核心邏輯
${l.implementation.logic}

`),l.implementation.scenarios&&(a+=`## 💻 應用場景清單
${l.implementation.scenarios}

`));const g=e||((b=s.content)==null?void 0:b.body)||l.body;if(g)if(a+=`
## 📝 章節重點解說 ( 內容由AI產生，非原書本提供 )
`,typeof g=="string"){let x=null;try{g.trim().startsWith("{")&&(x=JSON.parse(g))}catch{}x&&typeof x=="object"?a+=Object.values(x).join(`

`):a+=g}else Array.isArray(g)?a+=g.join(`

`):typeof g=="object"&&(a+=Object.values(g).join(`

`))}a=a.replace(/##\s*💻\s*應用場景清單[\s\S]*?(?=##|$)/g,""),a=a.replace(/\x08(?![e\\])/g,"\\b").replace(/\x0c(?![r\\])/g,"\\f").replace(/\x0b/g,"\\v").replace(/\r(?![ \n])/g,"\\r").replace(/[\x08]egin\{/g,"\\begin{").replace(/[\x08]eta/g,"\\beta").replace(/[\x0c]rac\{/g,"\\frac{").replace(/[\x09]ext\{/g,"\\text{").replace(/[\x09]heta/g,"\\theta").replace(/[\x09]au(?=\s|$|[^a-z])/g,"\\tau"),a=a.replace(/\\n/g,`
`);const c=[];a=a.replace(/\$\$([\s\S]*?)\$\$/g,(g,x)=>{const k=c.length;return c.push({type:"display",content:x}),` @@MATH_BLOCK_${k}@@ `}),a=a.replace(/\\\[([\s\S]*?)\\\]/g,(g,x)=>{const k=c.length;return c.push({type:"display",content:x}),` @@MATH_BLOCK_${k}@@ `}),a=a.replace(/\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/g,(g,x)=>{const k=c.length;return c.push({type:"display",content:`\\begin{aligned}${x}\\end{aligned}`}),` @@MATH_BLOCK_${k}@@ `}),a=a.replace(new RegExp("(?<!\\\\)\\$([^$\\n]+?)\\$","g"),(g,x)=>{const k=c.length;return c.push({type:"inline",content:x}),` @@MATH_BLOCK_${k}@@ `}),a=a.replace(/\\\(([\s\S]*?)\\\)/g,(g,x)=>{const k=c.length;return c.push({type:"inline",content:x}),` @@MATH_BLOCK_${k}@@ `}),a=a.replace(/^[ \t]+(?=<)/gm,"");let v=$e.parse(a).replace(/<h3>(.*?)<\/h3>/g,(g,x)=>`<h3 id="${"topic-"+x.replace(/<[^>]*>/g,"").trim().replace(/\s+/g,"-").toLowerCase()}">${x}</h3>`);const E=je.sanitize(v,{USE_PROFILES:{html:!0,mathml:!0,svg:!0},ADD_TAGS:["math","annotation","semantics","mrow","msub","msup","msubsup","mover","munder","munderover","mmultiscripts","mprec","mnext","mtable","mtr","mtd","mfrac","msqrt","mroot","mstyle","merror","mpadded","mphantom","mfenced","menclose","ms","mglyph","maligngroup","malignmark","maction","svg","path","use","span","div","g","text","rect","circle","line","polyline","polygon","defs","marker","symbol"],ADD_ATTR:["id","target","xlink:href","class","style","aria-hidden","viewBox","d","fill","stroke","stroke-width","data-filename","encoding","display","x","y","cx","cy","r","width","height","text-anchor","font-size","font-family","font-weight","transform","marker-end","refX","refY","orient","stroke-dasharray","fill-opacity"]}),$=[...s.examples||[]].sort((g,x)=>x.filename.length-g.filename.length);let B=E;$.forEach(g=>{const x=g.filename.replace(".","\\."),k=new RegExp(`(?<!['".\\w])(${x})(?!['".\\w])`,"g");B=B.replace(k,`<span class="code-link" data-filename="${g.filename}">${g.filename}</span>`)});let M=B.replace(/@@MATH_BLOCK_(\d+)@@/g,(g,x)=>{const k=c[parseInt(x)];try{return katex.renderToString(k.content.trim(),{displayMode:k.type==="display",throwOnError:!1})}catch(I){return console.error("[KaTeX] Error rendering block:",I),k.type==="display"?`\\[ ${k.content} \\]`:`\\( ${k.content} \\)`}});const S={long_call:`
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker>
              </defs>
              <!-- Axes -->
              <line x1="20" y1="180" x2="380" y2="180" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="190" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <text x="360" y="195" font-size="12" fill="#666">S_T</text>
              <text x="15" y="35" font-size="12" fill="#666" transform="rotate(-90, 15, 35)">價值</text>
              <!-- Payoff Line -->
              <path d="M 40,180 L 180,180 L 340,60" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="180" r="4" fill="#3b82f6" />
              <text x="175" y="195" font-size="10" fill="#3b82f6" font-weight="bold">K</text>
              <!-- Label -->
              <text x="210" y="80" font-size="14" fill="#3b82f6" font-weight="bold">Long Call Payoff</text>
            </svg>
          </div>`,short_call:`
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker></defs>
              <line x1="20" y1="100" x2="380" y2="100" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="180" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <path d="M 40,100 L 180,100 L 340,195" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="100" r="4" fill="#ef4444" />
              <text x="360" y="115" font-size="12" fill="#666">S_T</text>
              <text x="210" y="160" font-size="14" fill="#ef4444" font-weight="bold">Short Call Payoff</text>
            </svg>
          </div>`,long_put:`
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker></defs>
              <line x1="20" y1="180" x2="380" y2="180" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="190" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <path d="M 40,60 L 180,180 L 360,180" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="180" r="4" fill="#10b981" />
              <text x="360" y="195" font-size="12" fill="#666">S_T</text>
              <text x="60" y="80" font-size="14" fill="#10b981" font-weight="bold">Long Put Payoff</text>
            </svg>
          </div>`,short_put:`
          <div class="payoff-diagram-container">
            <svg viewBox="0 0 400 200" class="payoff-svg">
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/></marker></defs>
              <line x1="20" y1="100" x2="380" y2="100" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="40" y1="180" x2="40" y2="20" stroke="#666" stroke-width="1.5" marker-end="url(#arrow)" />
              <path d="M 40,195 L 180,100 L 360,100" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
              <circle cx="180" cy="100" r="4" fill="#f59e0b" />
              <text x="360" y="115" font-size="12" fill="#666">S_T</text>
              <text x="60" y="160" font-size="14" fill="#f59e0b" font-weight="bold">Short Put Payoff</text>
            </svg>
          </div>`};return M=M.replace(/<strong>1\. 買入看漲選擇權 \(Long Call\)<\/strong>/g,g=>g+S.long_call),M=M.replace(/<strong>2\. 賣出看漲選擇權 \(Short Call\)<\/strong>/g,g=>g+S.short_call),M=M.replace(/<strong>3\. 買入看跌選擇權 \(Long Put\)<\/strong>/g,g=>g+S.long_put),M=M.replace(/<strong>4\. 賣出看跌選擇權 \(Short Put\)<\/strong>/g,g=>g+S.short_put),M}else{const a=s.examples||[];let c=`
        <div class="chapter-intro">
          <h2>${s.title}</h2>
          <p>本章包含 ${a.length} 個程式範例</p>
          <div class="example-grid">
      `;return a.forEach((u,v)=>{c+=`
          <div class="example-card">
            <div class="example-number">${v+1}</div>
            <div class="example-info">
              <h3>${u.title}</h3>
              <span class="code-link" data-filename="${u.filename}">${u.filename}</span>
            </div>
          </div>
        `}),c+=`
          </div>
        </div>
      `,c}},[s,e]);return m.useEffect(()=>{const l=w=>{if(w.target.classList.contains("code-link")){const b=w.target.dataset.filename;let a=null;s!=null&&s.examples&&(a=s.examples.find(c=>c.filename===b),a&&!a.metadata&&(a.metadata={description:a.title})),a&&t(a)}};return document.addEventListener("click",l),()=>document.removeEventListener("click",l)},[s,t]),m.useEffect(()=>{const l=document.querySelector(".content-scroll");l&&(l.scrollTop=0)},[s]),m.useEffect(()=>{p.current&&y&&Ce(p.current,{delimiters:[{left:"$$",right:"$$",display:!0},{left:"$",right:"$",display:!1},{left:"\\(",right:"\\)",display:!1},{left:"\\[",right:"\\]",display:!0}],throwOnError:!1})},[y]),m.useEffect(()=>{if(i){const l=document.getElementById(i);l&&l.scrollIntoView({behavior:"smooth",block:"start"})}},[i]),m.useEffect(()=>{if(o||r&&r.length>0||d){const l=document.querySelector(".content-scroll");l&&l.scrollTo({top:0,behavior:"instant"})}},[o,r,d]),n.jsx("div",{className:"content-panel",children:n.jsx("div",{className:"content-scroll",children:o||r&&r.length>0||d?n.jsxs("div",{id:"execution-output",className:"execution-output-section",children:[d&&n.jsxs("div",{className:"running-indicator",children:[n.jsx("div",{className:"spinner"}),n.jsx("span",{children:"程式執行中..."})]}),o&&n.jsx("pre",{className:"output-text",children:o}),r&&r.length>0&&n.jsx("div",{className:"output-images",children:r.map((l,w)=>n.jsx("div",{className:"output-image",children:n.jsx("img",{src:l,alt:`Plot ${w+1}`})},w))})]}):y?n.jsx("div",{ref:p,className:"markdown-body",dangerouslySetInnerHTML:{__html:y}}):n.jsx("div",{className:"welcome-screen",children:n.jsxs("div",{className:"welcome-card premium-welcome",children:[n.jsxs("div",{className:"welcome-brand",children:[n.jsx("img",{src:"welcome.jpg",alt:"FRM Python 理論與實戰",className:"welcome-book-img"}),n.jsx("a",{href:"https://deepwisdom.com.tw/product/%e6%89%8b%e8%a1%93%e5%88%80%e8%88%ac%e7%b2%be%e6%ba%96%e7%9a%84frm-%e7%94%a8python%e7%a7%91%e5%ad%b8%e7%ae%a1%e6%8e%a7%e8%b2%a1%e9%87%91%e9%a2%a8%e9%9a%aa%e5%af%a6%e6%88%b0%e7%af%87dm2308/",target:"_blank",rel:"noopener noreferrer",className:"welcome-purchase-btn",children:"[ 本書官網購買連結 ]"})]}),n.jsxs("div",{className:"welcome-content",children:[n.jsxs("h2",{className:"welcome-title",children:["Python 金融風險管理：",n.jsx("br",{}),"數學模型與應用 (實戰篇)"]}),n.jsx("div",{className:"welcome-slogan",children:"☆★☆★【有如手術刀般精準！利用Python幫你管控財金風險！】★☆★☆"}),n.jsxs("div",{className:"welcome-text-scroll",children:[n.jsx("p",{children:"在上一本基礎篇的學習完備，能善用Python程式語言及常用的工具套件之後，接下來就是開始對金融風險進行評估了。"}),n.jsx("p",{children:"本書接續介紹了各種數學模型，包括波動性、隨機過程及相當重要的馬可夫過程、馬丁格爾、隨機漫步、維納過程等，另外也包含蒙地卡羅等數學模型的應用。"}),n.jsx("p",{children:"而統計科學中最常用的回歸，本書也有涉獵。另外包括了二元樹、BSM選擇權、希臘字母，市場風險等，都有最完整的Python程式和數學公式供讀者計算、運用。"}),n.jsx("p",{children:"金融商品龐大且複雜，需要像使用手術刀般精準、細緻地切割每一個細節，畢竟賠錢事事小，沒辦法掌握到大盤的迅速波動與走勢，才是一大損失。"})]})]})]})})})})});function Ae(){return null}function Fe(s={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:i,onRegistered:o,onRegisteredSW:d,onRegisterError:r}=s;let p,y,l;const w=async(a=!0)=>{await y,l==null||l()};async function b(){if("serviceWorker"in navigator){if(p=await pe(async()=>{const{Workbox:a}=await import("./vendor-B3CQIlJd.js").then(c=>c.w);return{Workbox:a}},[]).then(({Workbox:a})=>new a("/pwa_FRM_Book2/sw.js",{scope:"/pwa_FRM_Book2/",type:"classic"})).catch(a=>{r==null||r(a)}),!p)return;l=()=>{p==null||p.messageSkipWaiting()};{let a=!1;const c=()=>{a=!0,p==null||p.addEventListener("controlling",u=>{u.isUpdate&&window.location.reload()}),t==null||t()};p.addEventListener("installed",u=>{typeof u.isUpdate>"u"?typeof u.isExternal<"u"&&u.isExternal?c():!a&&(i==null||i()):u.isUpdate||i==null||i()}),p.addEventListener("waiting",c)}p.register({immediate:e}).then(a=>{d?d("/pwa_FRM_Book2/sw.js",a):o==null||o(a)}).catch(a=>{r==null||r(a)})}}return y=b(),w}function Qe(s={}){const{immediate:e=!0,onNeedRefresh:t,onOfflineReady:i,onRegistered:o,onRegisteredSW:d,onRegisterError:r}=s,[p,y]=m.useState(!1),[l,w]=m.useState(!1),[b]=m.useState(()=>Fe({immediate:e,onOfflineReady(){w(!0),i==null||i()},onNeedRefresh(){y(!0),t==null||t()},onRegistered:o,onRegisteredSW:d,onRegisterError:r}));return{needRefresh:[p,y],offlineReady:[l,w],updateServiceWorker:b}}function ze(){const{offlineReady:[s,e],needRefresh:[t,i],updateServiceWorker:o}=Qe({onRegisteredSW(r,p){console.debug(`Service Worker at: ${r}`),p&&setInterval(()=>{p.update()},36e5)},onRegisterError(r){console.warn("SW registration error",r)}}),d=()=>{e(!1),i(!1)};return n.jsx("div",{className:"ReloadPrompt-container",children:(s||t)&&n.jsxs("div",{className:"ReloadPrompt-toast",children:[n.jsx("div",{className:"ReloadPrompt-message",children:s?"App ready to work offline":"New content available, click on reload button to update."}),t&&n.jsx("button",{className:"ReloadPrompt-toast-button",onClick:()=>o(!0),children:"Reload"}),n.jsx("button",{className:"ReloadPrompt-toast-button",onClick:d,children:"Close"})]})})}function Oe(s){const[e,t]=m.useState(null),[i,o]=m.useState(!1),d=m.useRef({});return m.useEffect(()=>{if(!s){t(null);return}const r=s.content,p=s.id;if(r!=null&&r.body&&!(r!=null&&r.bodyRef)){t(r.body);return}const y=r==null?void 0:r.bodyRef;if(!y||!Array.isArray(y)||y.length===0){t(null);return}let l=!1;return o(!0),(async()=>{const b=await Promise.all(y.map(async a=>{const c=`${p}/${a}`;if(d.current[c]!==void 0)return d.current[c];try{const u=`/pwa_FRM_Book2/data/modular/${p}/${a}.json`,v=await fetch(u);if(!v.ok)throw new Error(`HTTP ${v.status}`);const j=(await v.json()).content||"";return d.current[c]=j,j}catch(u){return console.warn(`[useBodyContent] Failed to load ${p}/${a}:`,u),""}}));if(!l){const a={};y.forEach((c,u)=>{a[c]=b[u]}),t(a),o(!1)}})(),()=>{l=!0}},[s]),{bodyContent:e,bodyLoading:i}}const He=`
# QuantLib (ql) 強大模擬層
# 由於 QuantLib 是 C++ 擴充套件，目前無法在瀏覽器原生執行。
# 我們提供一個高度相容的模擬層，以支援書中 Chapter 12 的債券與利率分析範例。
import sys
import datetime
from types import ModuleType
ql = ModuleType('QuantLib')
sys.modules['QuantLib'] = ql

class QLDate:
    def __init__(self, *args):
        try:
            if len(args) == 3: # (d, m, y)
                self.dt = datetime.date(args[2], args[1], args[0])
            elif len(args) == 2: # (str_val, fmt)
                py_fmt = args[1].replace('%d', '%d').replace('%m', '%m').replace('%Y', '%Y')
                self.dt = datetime.datetime.strptime(args[0], py_fmt).date()
            elif len(args) == 1 and isinstance(args[0], QLDate):
                self.dt = args[0].dt
            elif len(args) == 1 and isinstance(args[0], datetime.date):
                self.dt = args[0]
            else:
                self.dt = datetime.date(2020, 1, 1)
        except Exception:
            self.dt = datetime.date(2020, 1, 1)

    def __add__(self, other):
        if isinstance(other, int):
            new_dt = self.dt + datetime.timedelta(days=other)
            return QLDate(new_dt.day, new_dt.month, new_dt.year)
        elif hasattr(other, 'units'): # QLPeriod
            val = other.value
            if other.units == "Days":
                new_dt = self.dt + datetime.timedelta(days=val)
                return QLDate(new_dt)
            elif other.units == "Weeks":
                new_dt = self.dt + datetime.timedelta(weeks=val)
                return QLDate(new_dt)
            elif other.units == "Months":
                new_dt = self.dt + datetime.timedelta(days=val * 30)
                return QLDate(new_dt)
            elif other.units == "Years":
                new_dt = self.dt + datetime.timedelta(days=val * 365)
                return QLDate(new_dt)
        return self

    def __sub__(self, other):
        if isinstance(other, QLDate):
            return (self.dt - other.dt).days
        return 0

    def __lt__(self, other): return self.dt < (other.dt if hasattr(other, 'dt') else other)
    def __le__(self, other): return self.dt <= (other.dt if hasattr(other, 'dt') else other)
    def __gt__(self, other): return self.dt > (other.dt if hasattr(other, 'dt') else other)
    def __ge__(self, other): return self.dt >= (other.dt if hasattr(other, 'dt') else other)
    def __eq__(self, other): return self.dt == (other.dt if hasattr(other, 'dt') else other)
    def __ne__(self, other): return not self.__eq__(other)
    def __hash__(self): return hash(self.dt)
    def __str__(self): return self.dt.strftime('%B %d, %Y')
    def __repr__(self): return self.__str__()
    def date(self): return self

ql.Date = QLDate

class QLPeriod:
    _UNIT_MAP = {'d': 'Days', 'w': 'Weeks', 'm': 'Months', 'y': 'Years'}
    def __init__(self, value, units=None):
        if isinstance(value, str) and units is None:
            import re as _re
            m = _re.match(r'(\\d+)\\s*([dwmyDWMY])', value)
            if m:
                self.value = int(m.group(1))
                self.units = self._UNIT_MAP.get(m.group(2).lower(), 'Days')
            else:
                self.value = 0
                self.units = 'Days'
        else:
            self.value = value
            self.units = units
ql.Period = QLPeriod
ql.Months = "Months"
ql.Years = "Years"
ql.Days = "Days"
ql.Weeks = "Weeks"

# 月份常數
ql.January, ql.February, ql.March = 1, 2, 3
ql.April, ql.May, ql.June = 4, 5, 6
ql.July, ql.August, ql.September = 7, 8, 9
ql.October, ql.November, ql.December = 10, 11, 12

class Settings:
    _inst = None
    @classmethod
    def instance(cls):
        if cls._inst is None: cls._inst = cls()
        return cls._inst
    def __init__(self):
        object.__setattr__(self, '_evaluationDate', None)
    @property
    def evaluationDate(self):
        return self._evaluationDate
    @evaluationDate.setter
    def evaluationDate(self, val):
        object.__setattr__(self, '_evaluationDate', val)
    def setEvaluationDate(self, date):
        object.__setattr__(self, '_evaluationDate', date)
    def __setattr__(self, name, value):
        if name in ('evaluationDate', 'setEvaluationDate'):
            object.__setattr__(self, '_evaluationDate', value)
        else:
            object.__setattr__(self, name, value)
ql.Settings = Settings

class QLDayCount:
    def __init__(self, *args): pass
    def yearFraction(self, start, end):
        s = start.dt if hasattr(start, 'dt') else start
        e = end.dt if hasattr(end, 'dt') else end
        return (e - s).days / 365.0

ql.Thirty360 = QLDayCount
ql.ActualActual = QLDayCount
ql.ActualActual.Bond = "Bond"

class QLCalendar:
    def __init__(self, *args): pass
    def advance(self, date, value, units):
        if hasattr(units, 'units'): # It's a period
            return date + units
        return date + QLPeriod(value, units)

ql.NullCalendar = QLCalendar
ql.UnitedStates = QLCalendar
ql.UnitedStates.GovernmentBond = "GovernmentBond"
ql.Linear = lambda: "Linear"
ql.Compounded = "Compounded"
ql.Annual = 1
ql.Semiannual = 2
ql.Quarterly = 4
ql.Daily = 365
ql.Unadjusted = "Unadjusted"
ql.Following = "Following"

class DateGeneration: Backward = "Backward"
ql.DateGeneration = DateGeneration
ql.Schedule = lambda *args: "MockSchedule"
ql.MakeSchedule = lambda *args: "MockSchedule"
ql.FixedRateBondHelper = lambda *args: "MockHelper"

class CashFlow:
    def __init__(self, date, amount):
        self._date = date
        self._amount = amount
    def date(self): return self._date
    def amount(self): return self._amount

class QLZeroRate:
    def __init__(self, rate): self._rate = rate
    def rate(self): return self._rate
    def equivalentRate(self, *args): return self

class QLYieldCurve:
    def dates(self):
        d = ql.Settings.instance().evaluationDate or QLDate(15,1,2020)
        return [d + 90, d + 180, d + 365, d + 730, d + 1095]
    def zeroRate(self, yrs, compounding, freq): return QLZeroRate(0.05 + 0.005 * yrs)
    def enableExtrapolation(self): pass
    def discount(self, t):
        r = 0.05
        dt = float(t) if isinstance(t, (int, float)) else 1.0
        return np.exp(-r * dt)

ql.ZeroCurve = lambda *args: QLYieldCurve()
ql.PiecewiseLogCubicDiscount = lambda *args: QLYieldCurve()
ql.FlatForward = lambda *args: QLYieldCurve()

class QLQuote:
    def __init__(self, value=0.0): self._value = value
    def value(self): return self._value
    def setValue(self, value): self._value = value

class QLHandle:
    def __init__(self, link=None): self._link = link
    def linkTo(self, link): self._link = link
    def currentLink(self): return self._link
    def __getattr__(self, name): return getattr(self._link, name)

ql.QuoteHandle = QLHandle
ql.SimpleQuote = QLQuote
ql.YieldTermStructureHandle = QLHandle
ql.RelinkableYieldTermStructureHandle = QLHandle

class QLDuration:
    Modified = "Modified"
    Macaulay = "Macaulay"
ql.Duration = QLDuration

ql.BondFunctions = ModuleType('BondFunctions')
ql.BondFunctions.duration = lambda *args: 2.5
ql.BondFunctions.convexity = lambda *args: 10.0

class DiscountingBondEngine:
    def __init__(self, handle=None): self.handle = handle
ql.DiscountingBondEngine = DiscountingBondEngine

class FixedRateBond:
    def __init__(self, *args):
        self.faceValue = 100
        self.coupons = [0.05]
        self.engine = None
        if len(args) >= 2: self.faceValue = args[1]
        if len(args) >= 4: self.coupons = args[3]
    def dayCounter(self): return QLDayCount()
    def cashflows(self):
        d = ql.Settings.instance().evaluationDate or QLDate(15,1,2020)
        return [
            CashFlow(d + 180, self.faceValue * self.coupons[0] / 2),
            CashFlow(d + 360, self.faceValue + self.faceValue * self.coupons[0] / 2)
        ]
    def setPricingEngine(self, engine): self.engine = engine
    def cleanPrice(self, *args):
        rate = 0.05
        if self.engine and hasattr(self.engine, 'handle'):
            h = self.engine.handle
            while hasattr(h, 'currentLink') and h.currentLink() is not None:
                h = h.currentLink()
            if hasattr(h, 'zeroRate'):
                rate = h.zeroRate(10, 1, 1).rate() # 用 10 年期利率作為定價代理
        elif args: rate = args[0]
        return 100 / (1 + rate/2)**2
    def dirtyPrice(self, *args): return self.cleanPrice(*args) * 1.0125
    def NPV(self): return self.cleanPrice()
ql.FixedRateBond = FixedRateBond

class QLSpreadedCurve:
    def __init__(self, base_handle, spread_handles, dates):
        self._base = base_handle
        self._spreads = spread_handles
        self._dates = dates
    def zeroRate(self, yrs, compounding, freq):
        base = self._base
        while hasattr(base, 'currentLink') and base.currentLink() is not None:
            base = base.currentLink()
        br = base.zeroRate(yrs, compounding, freq).rate()
        # 簡單模擬：加總所有利差的平均值來體現敏感度
        total_spread = sum(s.value() if hasattr(s, 'value') else s for s in self._spreads)
        return QLZeroRate(br + total_spread / len(self._spreads))
    def dates(self): return self._dates

ql.SpreadedLinearZeroInterpolatedTermStructure = QLSpreadedCurve
class QLHullWhite:
    def __init__(self, handle, a, s): self.handle = handle
ql.HullWhite = QLHullWhite

class QLTreeEngine:
    def __init__(self, model, grid): self.handle = model.handle
ql.TreeCallableFixedRateBondEngine = QLTreeEngine

ql.CallabilitySchedule = list
ql.CallabilityPrice = lambda *args: "MockPrice"
ql.CallabilityPrice.Clean = "Clean"
ql.Callability = lambda *args: "MockCallability"
ql.Callability.Call = "Call"
ql.Callability.Put = "Put"
ql.CallableFixedRateBond = FixedRateBond

# ─── Ch10_5 extensions: CVA via GSR model + MC simulation ───

ql.Actual365Fixed = QLDayCount
ql.Thirty360.BondBasis = "BondBasis"
ql.ModifiedFollowing = "ModifiedFollowing"

class QLTarget:
    def advance(self, date, period):
        return date + period
ql.TARGET = QLTarget

class QLEuribor6M:
    def __init__(self, handle=None):
        self._handle = handle
        self._fixings = {}
    def tenor(self): return QLPeriod(6, "Months")
    def fixingCalendar(self): return QLTarget()
    def businessDayConvention(self): return "ModifiedFollowing"
    def dayCounter(self): return QLDayCount()
    def fixingDate(self, d): return d
    def isValidFixingDate(self, d): return True
    def fixing(self, d):
        k = str(d)
        return self._fixings.get(k, 0.025)
    def addFixing(self, d, v):
        self._fixings[str(d)] = v
ql.Euribor6M = QLEuribor6M

class QLSchedule:
    def __init__(self, start, end, tenor, calendar, bdc1, bdc2, dg, eomt):
        self._dates = []
        d = start
        while True:
            self._dates.append(d)
            nd = d + tenor
            if hasattr(nd, 'dt') and hasattr(end, 'dt') and nd.dt >= end.dt:
                break
            elif not hasattr(nd, 'dt'):
                break
            d = nd
        self._dates.append(end)
    def __iter__(self): return iter(self._dates)
    def __len__(self): return len(self._dates)
    def __getitem__(self, i): return self._dates[i]
ql.Schedule = QLSchedule

class QLVanillaSwap:
    Receiver = 1
    Payer = -1
    def __init__(self, typ, nominal, fixedSch, fixedRate, fixedDC, floatSch, index, spread, floatDC):
        self._typ = typ
        self._nominal = nominal
        self._fixed_sch = fixedSch
        self._fixed_rate = fixedRate
        self._float_sch = floatSch
        self._engine = None
    def setPricingEngine(self, engine): self._engine = engine
    def NPV(self):
        n = self._nominal
        r = self._fixed_rate
        years = 4
        if self._engine and hasattr(self._engine, 'handle'):
            h = self._engine.handle
            while hasattr(h, 'currentLink') and callable(h.currentLink) and h.currentLink() is not None:
                h = h.currentLink()
            if hasattr(h, 'discount'):
                total = 0.0
                for t in range(1, years+1):
                    total += n * r * h.discount(float(t))
                total += n * h.discount(float(years))
                total -= n * h.discount(0.0)
                return self._typ * total
        return self._typ * n * r * years * 0.01
ql.VanillaSwap = QLVanillaSwap

class QLGsrProcess:
    def expectation(self, t, x, dt): return x * np.exp(-0.04 * dt)
    def stdDeviation(self, t, x, dt): return 0.008 * np.sqrt(dt)

class QLGsr:
    def __init__(self, yts, stepDates, vols, meanRevs):
        self._yts = yts
        self._process = QLGsrProcess()
    def stateProcess(self): return self._process
    def zerobond(self, T, t, y):
        r = 0.025 + 0.005 * y if isinstance(y, (int, float)) else 0.025
        dt = T - t if T > t else 0.01
        return np.exp(-r * dt)
ql.Gsr = QLGsr

class QLDiscountCurve:
    def __init__(self, dates, discounts, dc):
        self._dates = dates
        self._discounts = list(discounts)
    def enableExtrapolation(self): pass
    def discount(self, t):
        if isinstance(t, (int, float)):
            idx = min(int(t), len(self._discounts)-1)
            idx = max(0, idx)
            return self._discounts[idx]
        return 1.0
ql.DiscountCurve = QLDiscountCurve

class QLDiscountingSwapEngine:
    def __init__(self, handle): self.handle = handle
ql.DiscountingSwapEngine = QLDiscountingSwapEngine

class QLHazardRateCurve:
    def __init__(self, dates, rates, dc):
        import numpy as _np
        self._times = []
        if len(dates) > 0 and hasattr(dates[0], 'dt'):
            base = dates[0].dt
            for d in dates:
                self._times.append((d.dt - base).days / 365.0)
        else:
            self._times = [float(i) for i in range(len(dates))]
        self._rates = list(rates)
    def enableExtrapolation(self): pass
    def _interp_rate(self, t):
        import numpy as _np
        return float(_np.interp(t, self._times, self._rates))
    def hazardRate(self, t):
        return self._interp_rate(float(t))
    def survivalProbability(self, t):
        import numpy as _np
        h = self._interp_rate(float(t))
        return float(_np.exp(-h * float(t)))
    def defaultProbability(self, *args):
        if len(args) == 2:
            return self.survivalProbability(args[0]) - self.survivalProbability(args[1])
        return 1.0 - self.survivalProbability(args[0])
    def defaultDensity(self, t):
        h = self._interp_rate(float(t))
        return h * self.survivalProbability(float(t))
ql.HazardRateCurve = QLHazardRateCurve

class QLIndexManager:
    _inst = None
    @classmethod
    def instance(cls):
        if cls._inst is None: cls._inst = cls()
        return cls._inst
    def clearHistories(self): pass
ql.IndexManager = QLIndexManager

class QLMersenneTwisterUniformRng:
    def __init__(self, seed=0):
        self._rng = __import__('random').Random(seed)
    def next(self):
        class Res:
            def __init__(self, v): self._v = v
            @property
            def value(self): return self._v
            def __call__(self): return self._v
        r = Res(self._rng.random())
        return r
ql.MersenneTwisterUniformRng = QLMersenneTwisterUniformRng

class _CallableList(list):
    def __call__(self): return list(self)

class QLMersenneTwisterUniformRsg:
    def __init__(self, dim, rng):
        self._dim = dim
        self._rng = rng
    def nextSequence(self):
        class Seq:
            def __init__(self, vals): self.value = _CallableList(vals)
        return Seq([self._rng.next().value for _ in range(self._dim)])
    def dimension(self): return self._dim
ql.MersenneTwisterUniformRsg = QLMersenneTwisterUniformRsg

class QLInvCumulativeGaussianRsg:
    def __init__(self, rsg):
        self._rsg = rsg
    def nextSequence(self):
        import scipy.stats as _st
        seq = self._rsg.nextSequence()
        vals = [float(_st.norm.ppf(max(1e-10, min(1-1e-10, u)))) for u in seq.value]
        class Seq:
            def __init__(self, v): self.value = _CallableList(v)
        return Seq(vals)
ql.InvCumulativeMersenneTwisterGaussianRsg = QLInvCumulativeGaussianRsg

print("✅ QuantLib (ql) 強大模擬層已啟動。")
`,We=`
# Pymoo 相容性與警告抑制
try:
    import pymoo
    # 0.4.x 原生包含 pymoo.model.problem 和 pymoo.factory
    # 只需抑制編譯提示
    try:
        from pymoo.configuration import Configuration
        Configuration.show_compile_hint = False
    except (ImportError, AttributeError):
        pass
    
    # 驗證關鍵模組可匯入
    import pymoo.model.problem
    import pymoo.algorithms.nsga2
    print("✅ Pymoo 0.4.1：舊版 API 原生可用，無需額外映射。")
except ImportError as e:
    # 如果是 0.6.x 或其他版本，嘗試建立向後相容映射
    try:
        import sys
        import pymoo.core.problem
        import pymoo.algorithms.moo.nsga2
        sys.modules['pymoo.model.problem'] = pymoo.core.problem
        sys.modules['pymoo.algorithms.nsga2'] = pymoo.algorithms.moo.nsga2
        
        from types import ModuleType
        if not hasattr(pymoo, 'factory'):
            factory = ModuleType('pymoo.factory')
            from pymoo.operators.sampling.rnd import FloatRandomSampling
            from pymoo.operators.crossover.sbx import SBX
            from pymoo.operators.mutation.pm import PM
            from pymoo.termination import get_termination as _get_termination
            def get_sampling(name, *args, **kwargs): return FloatRandomSampling()
            def get_crossover(name, *args, **kwargs): return SBX(prob=kwargs.get('prob', 0.9), eta=kwargs.get('eta', 15))
            def get_mutation(name, *args, **kwargs): return PM(eta=kwargs.get('eta', 20))
            factory.get_sampling = get_sampling
            factory.get_crossover = get_crossover
            factory.get_mutation = get_mutation
            factory.get_termination = _get_termination
            sys.modules['pymoo.factory'] = factory
        print("✅ Pymoo 相容性：舊版 API 映射已完成（0.6.x -> 0.4.x 路徑）。")
    except Exception as e2:
        if not isinstance(e2, ImportError):
            print(f"⚠️ Pymoo Shim Error: {e2}")
            print(f"Original Import Error (0.4.x): {e}")
except Exception as e:
    if not isinstance(e, ImportError):
        print(f"⚠️ Pymoo Shim Error: {e}")
    pass
`,me=`
# 模擬數據引擎：處理 DataReader 因 CORS 導致的 RemoteDataError
def simulated_data_reader(name, data_source=None, start=None, end=None, **kwargs):
    import pandas as pd
    import numpy as np
    
    # 預設行為：模擬 Yahoo Finance 結構 (High, Low, Open, Close, Volume, Adj Close)
    print(f"📡 模擬數據引擎：由於瀏覽器 CORS 限制，正在為 {name} 產生模擬股價數據 (Yahoo Finance Bypass)...")
    
    start_date = pd.to_datetime(start or '2020-01-01')
    end_date = pd.to_datetime(end or '2020-12-31')
    dates = pd.date_range(start_date, end_date)
    
    tickers = [name] if isinstance(name, str) else name
    
    # 支援多 Ticker 回傳
    result_dict = {}
    
    for ticker in tickers:
        ticker_lower = ticker.lower()
        
        # 定義不同股票的基礎特徵 (Base Price, Volatility)
        stock_map = {
            'goog': (1500, 0.015), 'amzn': (3200, 0.018), 'fb': (270, 0.02), 'meta': (270, 0.02),
            'nflx': (500, 0.025), 'gld': (180, 0.008), 'ge': (10, 0.012), 
            'nke': (140, 0.012), 'ford': (9, 0.015), 'dis': (170, 0.015), 
            'aapl': (130, 0.018), 'tsla': (700, 0.035), 'sp500': (3700, 0.01),
            '^gspc': (3700, 0.01), 'wti': (48, 0.025)
        }
        
        base_price, volatility = stock_map.get(ticker_lower, (100, 0.02))
        
        # 產生隨機漫步價格
        np.random.seed(sum(ord(c) for c in ticker) + len(dates)) # Deterministic random based on ticker
        returns = np.random.normal(0.0005, volatility, len(dates))
        price_path = base_price * np.exp(np.cumsum(returns))
        
        # 產生 OHLCV
        df_ticker = pd.DataFrame(index=dates)
        df_ticker['Adj Close'] = price_path
        df_ticker['Close'] = price_path
        df_ticker['Open'] = price_path * np.random.uniform(0.99, 1.01, len(dates))
        df_ticker['High'] = np.maximum(df_ticker['Open'], df_ticker['Close']) * np.random.uniform(1.0, 1.01, len(dates))
        df_ticker['Low'] = np.minimum(df_ticker['Open'], df_ticker['Close']) * np.random.uniform(0.99, 1.0, len(dates))
        df_ticker['Volume'] = np.random.randint(1000000, 10000000, len(dates))
        
        result_dict[ticker] = df_ticker

    # FRED 數據源處理 (Return single column per series)
    if data_source == 'fred':
        fred_data = {t: result_dict[t]['Adj Close'] for t in tickers}
        df = pd.DataFrame(fred_data)
        return df.astype(float) # Strict float casting
        
    # Yahoo 數據源處理
    if len(tickers) == 1:
        return result_dict[tickers[0]].astype(float)
    else:
        # Multi-index dataframe for multiple tickers
        reformed_data = {}
        for attr in ['High', 'Low', 'Open', 'Close', 'Volume', 'Adj Close']:
            reformed_data[attr] = pd.DataFrame({t: result_dict[t][attr] for t in tickers})
        
        # Concatenate significantly simplifies structure
        return pd.concat(reformed_data, axis=1).astype(float)

# 強制攔截 Patching
try:
    import sys
    import pandas_datareader
    import pandas_datareader.data as pdr_data
    
    # 替換核心函數
    pdr_data.DataReader = simulated_data_reader
    pdr_data.get_data_yahoo = simulated_data_reader
    pdr_data.get_data_fred = simulated_data_reader
    
    # 替換頂層
    pandas_datareader.DataReader = simulated_data_reader
    if hasattr(pandas_datareader, 'data'):
        pandas_datareader.data.DataReader = simulated_data_reader
        pandas_datareader.data.get_data_yahoo = simulated_data_reader
        
    print("✅ 模擬數據引擎：已成功攔截 pandas_datareader (Yahoo/FRED CORS Bypass)。")
    
except ImportError:
    # 即使尚未匯入，也要嘗試預先注入 sys.modules (為了稍後匯入時能生效? 難以做到，只能依靠 App.jsx 在匯入後觸發此墊片)
    pass
except Exception as e:
    print(f"⚠️ 模擬數據引擎啟動警告: {str(e)}")
`,Ue=`
# SciPy .rvs() 相容性墊片
try:
    import scipy.stats as _scipy_stats
    import numpy as _np
    _orig_rvs = _scipy_stats.rv_generic.rvs

    def _patched_rvs(self, *args, **kwargs):
        try:
            return _orig_rvs(self, *args, **kwargs)
        except (ImportError, AttributeError) as _e:
            if 'fblas' not in str(_e) and 'flapack' not in str(_e):
                raise
            _name = getattr(self, 'name', getattr(getattr(self, 'dist', None), 'name', ''))
            _size = kwargs.get('size', None)
            _loc = kwargs.get('loc', 0)
            _scale = kwargs.get('scale', 1)
            _fallback_map = {
                'bernoulli': lambda: _np.random.binomial(1, args[0] if args else kwargs.get('p', 0.5), size=_size),
                'binom': lambda: _np.random.binomial(args[0] if args else kwargs.get('n', 1), args[1] if len(args) > 1 else kwargs.get('p', 0.5), size=_size),
                'uniform': lambda: _np.random.uniform(_loc, _loc + _scale, size=_size),
                'norm': lambda: _np.random.normal(_loc, _scale, size=_size),
                'expon': lambda: _np.random.exponential(_scale, size=_size) + _loc,
                'poisson': lambda: _np.random.poisson(args[0] if args else kwargs.get('mu', 1), size=_size),
                'geom': lambda: _np.random.geometric(args[0] if args else kwargs.get('p', 0.5), size=_size),
                'randint': lambda: _np.random.randint(args[0] if args else kwargs.get('low', 0), args[1] if len(args) > 1 else kwargs.get('high', 2), size=_size),
            }
            if _name in _fallback_map:
                return _fallback_map[_name]()
            raise

    _scipy_stats.rv_generic.rvs = _patched_rvs
    print("✅ SciPy 相容性：.rvs() 安全墊片已啟動。")
except Exception:
    pass
`,Ge=`
# Lightweight SciPy stub
try:
    import scipy
except Exception:
    import types, sys
    import numpy as np
    import math

    scipy = types.ModuleType('scipy')
    stats = types.ModuleType('scipy.stats')

    def _scalar_or_array(func):
        def wrapper(self, x, *args, **kwargs):
            try:
                # If x is numpy array or list
                if hasattr(x, '__iter__') and not isinstance(x, (str, bytes)):
                    x_arr = np.array(x)
                else:
                    x_arr = np.array([x])
                    
                if x_arr.size == 1:
                    return func(self, float(x_arr.item()), *args, **kwargs)
                return np.array([func(self, float(xi), *args, **kwargs) for xi in x_arr.flat]).reshape(x_arr.shape)
            except Exception:
                 # Fallback for weird types
                 return func(self, x, *args, **kwargs)
        return wrapper

    def norm(loc=0.0, scale=1.0):
        class N:
            name = 'norm'
            def rvs(self, size=None, **kwargs): return np.random.normal(loc, scale, size=size)
            @_scalar_or_array
            def pdf(self, x): return math.exp(-0.5*((x-loc)/scale)**2)/(scale*math.sqrt(2*math.pi))
            @_scalar_or_array
            def cdf(self, x): return 0.5*(1+math.erf((x-loc)/(scale*math.sqrt(2))))
            def ppf(self, q):
                def cdf_fn(x): return 0.5*(1+math.erf((x-loc)/(scale*math.sqrt(2))))
                def scalar_ppf(qi):
                    a, b = loc - 10*scale, loc + 10*scale
                    for _ in range(60):
                        m = 0.5*(a+b)
                        if cdf_fn(m) < qi: a = m
                        else: b = m
                    return 0.5*(a+b)
                if hasattr(q, '__iter__'): return np.array([scalar_ppf(float(qi)) for qi in q])
                return scalar_ppf(float(q))
            def stats(self, moments='mvsk'): return loc, scale**2, None, None
        return N()

    stats.norm = norm()
    scipy.stats = stats
    sys.modules['scipy'] = scipy
    sys.modules['scipy.stats'] = stats
    print('✅ SciPy stub installed.')
`,ue=`
# qpsolvers fallback shim for browser environments without native solver backends
try:
    import numpy as _np
    from scipy.optimize import minimize as _minimize, LinearConstraint as _LinearConstraint

    def _fallback_solve_qp(P, q, G=None, h=None, A=None, b=None, solver=None, **kwargs):
        Pm = _np.asarray(P, dtype=float)
        qv = _np.asarray(q, dtype=float).reshape(-1)
        n = int(qv.shape[0])

        def _obj(x):
            return 0.5 * float(x @ Pm @ x) + float(qv @ x)

        def _jac(x):
            return Pm @ x + qv

        constraints = []

        if A is not None and b is not None:
            Am = _np.atleast_2d(_np.asarray(A, dtype=float))
            bv = _np.asarray(b, dtype=float).reshape(-1)
            constraints.append(_LinearConstraint(Am, bv, bv))

        if G is not None and h is not None:
            Gm = _np.atleast_2d(_np.asarray(G, dtype=float))
            hv = _np.asarray(h, dtype=float).reshape(-1)
            constraints.append(_LinearConstraint(Gm, -_np.inf * _np.ones_like(hv), hv))

        x0 = _np.ones(n, dtype=float) / max(1, n)
        res = _minimize(_obj, x0, jac=_jac, method='SLSQP', constraints=constraints, options={'maxiter': 1000, 'ftol': 1e-9})

        if not res.success:
            res = _minimize(_obj, x0, method='SLSQP', constraints=constraints, options={'maxiter': 2000, 'ftol': 1e-8})

        return _np.asarray(res.x, dtype=float) if res.success else None

    try:
        import qpsolvers as _qps
        _orig_solve_qp = getattr(_qps, 'solve_qp', None)

        def _patched_solve_qp(P, q, G=None, h=None, A=None, b=None, solver=None, **kwargs):
            if _orig_solve_qp is not None and solver is not None:
                try:
                    return _orig_solve_qp(P, q, G, h, A, b, solver=solver, **kwargs)
                except Exception:
                    pass
            return _fallback_solve_qp(P, q, G, h, A, b, solver=solver, **kwargs)

        _qps.solve_qp = _patched_solve_qp
        print('✅ qpsolvers shim: solve_qp fallback enabled.')
    except Exception:
        import sys
        from types import ModuleType

        qps = ModuleType('qpsolvers')

        def solve_qp(P, q, G=None, h=None, A=None, b=None, solver=None, **kwargs):
            return _fallback_solve_qp(P, q, G, h, A, b, solver=solver, **kwargs)

        qps.solve_qp = solve_qp
        sys.modules['qpsolvers'] = qps
        print('✅ qpsolvers shim: lightweight module injected.')
except Exception as _e:
    print(f'⚠️ qpsolvers shim failed: {_e}')
`,Ve=`
import warnings
warnings.simplefilter("ignore", DeprecationWarning)
warnings.simplefilter("ignore", FutureWarning)
warnings.simplefilter("ignore", SyntaxWarning)
warnings.filterwarnings("ignore", message=".*pyarrow.*")

import numpy as np
if not hasattr(np, 'int'): np.int = int
if not hasattr(np, 'float'): np.float = float
if not hasattr(np, 'bool'): np.bool = bool

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.rcParams['font.family'] = ['DejaVu Sans', 'sans-serif']
except Exception: pass

import builtins
import js
def custom_input(prompt=""):
    result = js.window.prompt(prompt)
    return result if result is not None else ""
builtins.input = custom_input

try:
    import numpy_financial as npf
    for func in ['irr', 'npv', 'pmt', 'pv', 'rate', 'nper', 'fv', 'ppmt', 'ipmt']:
        if not hasattr(np, func) and hasattr(npf, func): setattr(np, func, getattr(npf, func))
except ImportError: pass

import sys
from types import ModuleType

# 徹底解決 distutils 在 Python 3.12 缺失的問題
try:
    import distutils
    import distutils.version
except ImportError:
    d = ModuleType('distutils')
    dv = ModuleType('distutils.version')
    du = ModuleType('distutils.util')
    ds = ModuleType('distutils.spawn')
    
    # Stub LooseVersion for libraries like sklearn/statsmodels
    class LooseVersion:
        def __init__(self, vstring): self.v = vstring
        def __str__(self): return self.v
        def __repr__(self): return f"LooseVersion('{self.v}')"
        def __lt__(self, other): return False
        def __le__(self, other): return True
        def __gt__(self, other): return True
        def __ge__(self, other): return True
        def __eq__(self, other): return True
    
    dv.LooseVersion = LooseVersion
    d.version = dv
    d.util = du
    d.spawn = ds
    
    sys.modules['distutils'] = d
    sys.modules['distutils.version'] = dv
    sys.modules['distutils.util'] = du
    sys.modules['distutils.spawn'] = ds
    print("✅ distutils 相容性：已建立虛擬子模組與 LooseVersion 樁。")

try:
    import pyodide_http
    pyodide_http.patch_all()
except ImportError: pass

try:
    import scipy.stats
    if not hasattr(scipy.stats, 'binom_test') and hasattr(scipy.stats, 'binomtest'):
        scipy.stats.binom_test = lambda k, n=None, p=0.5, alt='two-sided': scipy.stats.binomtest(k, n, p, alt).pvalue
except ImportError: pass
except Exception:
    pass

# Provide a lightweight fallback for scipy.stats.binom when SciPy's binom is missing
try:
    import scipy
    import numpy as _np
    import math
    if hasattr(scipy, 'stats'):
        _ss = scipy.stats
        if not hasattr(_ss, 'binom'):
            class _BinomFactory:
                def __call__(self, n, p):
                    nn = int(n)
                    pp = float(p)
                    class Dist:
                        def __init__(self, nn, pp):
                            self.n = nn
                            self.p = pp
                        def pmf(self, k):
                            k_int = int(k)
                            try:
                                return math.comb(self.n, k_int) * (self.p ** k_int) * ((1 - self.p) ** (self.n - k_int))
                            except Exception:
                                # fallback for older Python without comb
                                from math import factorial
                                return factorial(self.n) // (factorial(k_int) * factorial(self.n - k_int)) * (self.p ** k_int) * ((1 - self.p) ** (self.n - k_int))
                        def rvs(self, size=None):
                            return _np.random.binomial(self.n, self.p, size=size)
                    return Dist(nn, pp)
            _ss.binom = _BinomFactory()
except Exception:
    pass

# Expand lightweight fallbacks for common discrete SciPy distributions
try:
    import scipy
    import numpy as _np
    import math
    if hasattr(scipy, 'stats'):
        _ss = scipy.stats

        def _comb(n, k):
            try:
                return math.comb(n, k)
            except Exception:
                from math import factorial
                return factorial(n) // (factorial(k) * factorial(n - k))

        # Bernoulli
        if not hasattr(_ss, 'bernoulli'):
            class _BernFactory:
                def __call__(self, p):
                    pp = float(p)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            return pp if ki == 1 else (1.0 - pp)
                        def rvs(self, size=None):
                            return _np.random.binomial(1, pp, size=size)
                    return Dist()
            _ss.bernoulli = _BernFactory()

        # Poisson
        if not hasattr(_ss, 'poisson'):
            class _PoisFactory:
                def __call__(self, mu):
                    mm = float(mu)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            return math.exp(-mm) * (mm ** ki) / math.factorial(ki)
                        def rvs(self, size=None):
                            return _np.random.poisson(mm, size=size)
                    return Dist()
            _ss.poisson = _PoisFactory()

        # Geometric (SciPy uses support 1,2,3...)
        if not hasattr(_ss, 'geom'):
            class _GeomFactory:
                def __call__(self, p):
                    pp = float(p)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            if ki < 1: return 0.0
                            return (1 - pp) ** (ki - 1) * pp
                        def rvs(self, size=None):
                            return _np.random.geometric(pp, size=size)
                    return Dist()
            _ss.geom = _GeomFactory()

        # RandInt (discrete uniform [low, high))
        if not hasattr(_ss, 'randint'):
            class _RandIntFactory:
                def __call__(self, low, high=None):
                    lo = int(low)
                    hi = int(high) if high is not None else lo
                    # numpy randint semantics: low (inclusive), high (exclusive)
                    def _pmf(k):
                        ki = int(k)
                        if hi <= lo:
                            return 0.0
                        return 1.0 / (hi - lo) if (lo <= ki < hi) else 0.0
                    class Dist:
                        def pmf(self, k): return _pmf(k)
                        def rvs(self, size=None): return _np.random.randint(lo, hi, size=size)
                    return Dist()
            _ss.randint = _RandIntFactory()

        # Hypergeometric (ngood, nbad, nsample)
        if not hasattr(_ss, 'hypergeom'):
            class _HyperFactory:
                def __call__(self, M, n, N):
                    M_i = int(M)
                    n_i = int(n)
                    N_i = int(N)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            if ki < 0 or ki > n_i: return 0.0
                            # C(M, k) * C(M - k, N - k) / C(M, N) but use safe combinatorics
                            try:
                                num = _comb(n_i, ki) * _comb(M_i - n_i, N_i - ki)
                                den = _comb(M_i, N_i)
                                return num / den if den != 0 else 0.0
                            except Exception:
                                return 0.0
                        def rvs(self, size=None):
                            # Use numpy hypergeometric: numpy.hypergeometric(ngood, nbad, nsample)
                            return _np.random.hypergeometric(n_i, M_i - n_i, N_i, size=size)
                    return Dist()
            _ss.hypergeom = _HyperFactory()
except Exception:
    pass
`,Ke=`
# Dataset path redirection: intercept hardcoded absolute paths and redirect to virtual /data directory
import os
import sys

def check_and_redirect(path):
    if not isinstance(path, str):
        return path
    
    # Debug: Print intercepted path
    # print(f"🔍 Checking path: {path}")

    # Robust check for Windows/Unix absolute paths
    is_absolute = False
    _bs = chr(92)  # backslash, avoids escaping issues in generated code
    # Windows drive path example: C:\\path or Unix style: /path
    if len(path) >= 3 and path[1] == ':' and (path[2] == _bs or path[2] == '/'): is_absolute = True
    if path.startswith('/'): is_absolute = True # Unix
    
    if is_absolute:
        filename = os.path.basename(path)
        # Search virtual /data directory recursively
        for root, dirs, files in os.walk('/data'):
            if filename in files:
                target = os.path.join(root, filename)
                print(f"📂 Dataset Redirect: Intercepted {path} -> Using virtual path {target}")
                return target
    return path

try:
    import pandas as pd
    _orig_read_csv = pd.read_csv
    _orig_read_excel = pd.read_excel
    def patched_read_csv(filepath_or_buffer, *args, **kwargs):
        return _orig_read_csv(check_and_redirect(filepath_or_buffer), *args, **kwargs)
    def patched_read_excel(io, *args, **kwargs):
        return _orig_read_excel(check_and_redirect(io), *args, **kwargs)
    pd.read_csv = patched_read_csv
    pd.read_excel = patched_read_excel
    print("✅ Dataset Redirect: Successfully hooked pandas read functions.")
except ImportError: pass
except Exception as e: print(f"⚠️ Dataset Redirect Patch Error: {str(e)}")
`,_e=`
# mcint (Monte Carlo Integration) stub for browser environments
import sys
from types import ModuleType

mcint = ModuleType('mcint')
sys.modules['mcint'] = mcint

def mcint_integrate(integrand, sampler, measure, n):
    total = 0.0
    total_sq = 0.0
    # Process in chunks to maintain UI responsiveness if needed, but for now simple loop
    for _ in range(n):
        point = next(sampler)
        val = integrand(point)
        total += val
        total_sq += val * val
    
    mean = total / n
    var = (total_sq / n) - (mean ** 2)
    result = mean * measure
    error = (max(0, var) ** 0.5) * measure / (n ** 0.5)
    return result, error

mcint.integrate = mcint_integrate
print("✅ mcint (Monte Carlo) shim installed.")
`,Ye=`
# arch (Autoregressive Conditional Heteroskedasticity) stub
import sys
from types import ModuleType
import numpy as np

arch = ModuleType('arch')
arch_univariate = ModuleType('arch.univariate')

class ConstantMean:
    def __init__(self, y=None, *args, **kwargs): 
        self.y = y if y is not None else np.array([])
        
    def fit(self, *args, **kwargs):
        y_in = self.y
        n = len(y_in)
        class FitRes:
            def __init__(self, n, y_in): 
                self.n = n
                # Preserve the original index (DatetimeIndex) if y is a pandas Series/DataFrame.
                idx = None
                try:
                    if hasattr(y_in, 'index'):
                        idx = y_in.index
                except Exception:
                    idx = None

                try:
                    import pandas as pd
                    if idx is None:
                        idx = pd.RangeIndex(start=0, stop=n, step=1)
                    self._conditional_volatility = pd.Series(np.zeros(n), index=idx, name='conditional_volatility')
                    self._resid = pd.Series(np.zeros(n), index=idx, name='resid')
                except Exception:
                    self._conditional_volatility = np.zeros(n)
                    self._resid = np.zeros(n)
                # arch.fit() returns an object with many numeric attributes (params/aic/bic/etc).
                # Provide safe defaults so book examples don't crash when casting/printing.
                try:
                    import pandas as pd
                    self.params = pd.Series([0.0], index=['mu'])
                except Exception:
                    self.params = np.array([0.0])

                self.aic = 0.0
                self.bic = 0.0
                self.loglikelihood = 0.0
                self.convergence_flag = 0

                def _summary():
                    return "ARCH Stub: 'arch' is not supported in the browser; returning dummy fit results."
                self.summary = _summary
            
            @property
            def conditional_volatility(self):
                return self._conditional_volatility
            
            @property
            def resid(self):
                return self._resid
                
            def plot(self, *args, **kwargs):
                print("ARCH Stub: Plot called.")
                return None
                
            def __getattr__(self, name):
                # Common numeric attributes used in examples
                if name in ('nobs', 'num_params', 'scale'):
                    return 0.0
                if name in ('tvalues', 'pvalues', 'std_err'):
                    try:
                        import pandas as pd
                        return pd.Series([0.0], index=['mu'])
                    except Exception:
                        return np.array([0.0])
                return lambda *args, **kwargs: None
                
        return FitRes(n, y_in)

arch_univariate.ConstantMean = ConstantMean
arch_univariate.arch_model = lambda y, *args, **kwargs: ConstantMean(y)
arch.arch_model = arch_univariate.arch_model

sys.modules['arch'] = arch
sys.modules['arch.univariate'] = arch_univariate
print("✅ arch stub installed (browser fallback) with dummy data support.")
`,Xe=`
# mibian (Options Pricing) stub with Black-Scholes pricing
import sys
import math
from types import ModuleType

mibian = ModuleType('mibian')

def _norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def _norm_pdf(x):
    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)

class BS:
    """Black-Scholes pricing: BS([S, K, r, T], volatility=sigma) or BS([S, K, r, T], callPrice=c)"""
    def __init__(self, params=None, volatility=None, callPrice=None, putPrice=None, *args, **kwargs):
        if params is None:
            params = args[0] if args else [100, 100, 5, 30]
        S = float(params[0])
        K = float(params[1])
        r = float(params[2]) / 100.0  # mibian uses % for rate
        T = float(params[3]) / 365.0  # mibian uses days

        if volatility is not None:
            sigma = float(volatility) / 100.0  # mibian uses %
            sqrtT = math.sqrt(max(T, 1e-10))
            d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrtT)
            d2 = d1 - sigma * sqrtT
            self.callPrice = S * _norm_cdf(d1) - K * math.exp(-r * T) * _norm_cdf(d2)
            self.putPrice = K * math.exp(-r * T) * _norm_cdf(-d2) - S * _norm_cdf(-d1)
            self.callDelta = _norm_cdf(d1)
            self.putDelta = self.callDelta - 1.0
            self.callGamma = self.putGamma = _norm_pdf(d1) / (S * sigma * sqrtT)
            self.vega = S * _norm_pdf(d1) * sqrtT / 100.0
            self.callTheta = (-(S * _norm_pdf(d1) * sigma) / (2 * sqrtT) - r * K * math.exp(-r * T) * _norm_cdf(d2)) / 365.0
            self.putTheta = (-(S * _norm_pdf(d1) * sigma) / (2 * sqrtT) + r * K * math.exp(-r * T) * _norm_cdf(-d2)) / 365.0
            self.callRho = K * T * math.exp(-r * T) * _norm_cdf(d2) / 100.0
            self.putRho = -K * T * math.exp(-r * T) * _norm_cdf(-d2) / 100.0
            self.impliedVolatility = sigma * 100.0
        elif callPrice is not None or putPrice is not None:
            target = float(callPrice) if callPrice is not None else float(putPrice)
            is_call = callPrice is not None
            # Newton's method for implied vol
            sigma = 0.3
            for _ in range(100):
                sqrtT = math.sqrt(max(T, 1e-10))
                d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrtT)
                d2 = d1 - sigma * sqrtT
                if is_call:
                    price = S * _norm_cdf(d1) - K * math.exp(-r * T) * _norm_cdf(d2)
                else:
                    price = K * math.exp(-r * T) * _norm_cdf(-d2) - S * _norm_cdf(-d1)
                vega = S * _norm_pdf(d1) * sqrtT
                if abs(vega) < 1e-12: break
                sigma = sigma - (price - target) / vega
                if sigma <= 0: sigma = 0.001
                if abs(price - target) < 1e-8: break
            self.impliedVolatility = sigma * 100.0
            # Fill Greeks at solved vol
            sqrtT = math.sqrt(max(T, 1e-10))
            d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrtT)
            d2 = d1 - sigma * sqrtT
            self.callPrice = S * _norm_cdf(d1) - K * math.exp(-r * T) * _norm_cdf(d2)
            self.putPrice = K * math.exp(-r * T) * _norm_cdf(-d2) - S * _norm_cdf(-d1)
            self.callDelta = _norm_cdf(d1)
            self.putDelta = self.callDelta - 1.0
            self.callGamma = self.putGamma = _norm_pdf(d1) / (S * sigma * sqrtT)
            self.vega = S * _norm_pdf(d1) * sqrtT / 100.0
            self.callTheta = 0.0
            self.putTheta = 0.0
            self.callRho = 0.0
            self.putRho = 0.0
        else:
            self.callPrice = self.putPrice = 0.0
            self.callDelta = self.putDelta = 0.0
            self.callTheta = self.putTheta = 0.0
            self.callGamma = self.putGamma = 0.0
            self.vega = 0.0
            self.impliedVolatility = 0.0
            self.callRho = self.putRho = 0.0

mibian.BS = BS
mibian.Me = BS
mibian.GK = BS

sys.modules['mibian'] = mibian
print("✅ mibian Black-Scholes stub installed (browser fallback).")
`;let Y=null,F=null;class Je{constructor(e){this.onProgress=e,this.current=0,this.target=0,this.message="",this.interval=null}start(){this.interval||(this.interval=setInterval(()=>{if(this.current<this.target){const e=this.target-this.current,t=e>20?3.5:e>5?1.5:.5;this.current=Math.min(this.current+t,this.target),this.onProgress(Math.floor(this.current),this.message)}else this.target<99&&(this.current=Math.min(this.current+.08,99.9),this.onProgress(Math.floor(this.current),this.message))},100))}update(e,t){this.target=e,t&&(this.message=t)}async yieldToUI(){return new Promise(e=>setTimeout(e,30))}finish(e="Ready!"){this.interval&&clearInterval(this.interval),this.current=100,this.onProgress(100,e)}}async function Ze(){if(!window.loadPyodide)return new Promise((s,e)=>{const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js",t.onload=()=>s(),t.onerror=()=>e(new Error("Failed to load Pyodide script")),document.head.appendChild(t)})}const et={b2_ch1:[{filename:"SPX_Option.csv",displayPath:"datasets/b2_ch1/SPX_Option.csv"}],b2_ch4:[{filename:"BankTeleCompaign.csv",displayPath:"B2_Ch4/BankTeleCompaign.csv"},{filename:"HazardRate.csv",displayPath:"B2_Ch4/HazardRate.csv"},{filename:"LassoRegrData.csv",displayPath:"B2_Ch4/LassoRegrData.csv"},{filename:"MultiLrRegrData.csv",displayPath:"B2_Ch4/MultiLrRegrData.csv"},{filename:"PolyRegrData.csv",displayPath:"B2_Ch4/PolyRegrData.csv"},{filename:"RidgeRegrData.csv",displayPath:"B2_Ch4/RidgeRegrData.csv"},{filename:"WTI.csv",displayPath:"B2_Ch4/WTI.csv"},{filename:"outliersimpact.csv",displayPath:"B2_Ch4/outliersimpact.csv"}],b2_ch9:[{filename:"cs-training.csv",displayPath:"B2_Ch9/cs-training.csv"},{filename:"CDS_spreads.csv",displayPath:"datasets/b2_ch9/CDS_spreads.csv"}],b2_ch10:[{filename:"EE.csv",displayPath:"datasets/b2_ch10/EE.csv"}],b2_ch11:[{filename:"Data_portfolio_1.xlsx",displayPath:"B2_Ch11/Data_portfolio_1.xlsx"}],b2_ch12:[{filename:"Data_portfolio_1.xlsx",displayPath:"B2_Ch12/Data_portfolio_1.xlsx"},{filename:"Data_portfolio_2.xlsx",displayPath:"B2_Ch12/Data_portfolio_2.xlsx"}]};async function ie(s,e){if(!s||!e)return;const t=e.toLowerCase(),i=et[t];if(!(!i||i.length===0))for(const o of i){const{filename:d,displayPath:r}=o,p=`/data/${r}`;try{if(s.FS.analyzePath(p).exists)continue}catch{}try{const y=`/pwa_FRM_Book2/data/datasets/${t}/${d}`,l=await fetch(y);if(!l.ok||(l.headers.get("content-type")||"").toLowerCase().includes("text/html"))continue;const b=await l.arrayBuffer(),a=new Uint8Array(b),u=p.substring(0,p.lastIndexOf("/")).split("/").filter(E=>E);let v="";for(const E of u){v+="/"+E;try{s.FS.mkdir(v)}catch{}}s.FS.writeFile(p,a)}catch(y){console.error(`[Dataset] Failed to load ${d}:`,y)}}}async function tt(s){return Y?(s&&s(100,"Ready"),Y):F||(F=(async()=>{const e=new Je(s);e.start();try{e.update(10,"正在啟動 Python 直譯器 (v0.26.4)..."),await Ze();let t=null,i=3;for(;i>0;)try{t=await window.loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"});break}catch(r){if(console.warn(`Failed to load Pyodide (attempts left: ${i-1}):`,r),i--,i===0)throw r;await new Promise(p=>setTimeout(p,1e3))}e.update(30,"引擎啟動完成，正在檢查本地暫存環境..."),await e.yieldToUI();try{t.FS.mkdir("/mnt"),t.FS.mount(t.FS.filesystems.IDBFS,{},"/mnt"),await new Promise((r,p)=>{t.FS.syncfs(!0,y=>{y?p(y):r()})})}catch(r){console.warn("IDBFS mount skipped:",r)}e.update(50,"📦 核心：正在下載基礎運算模組 (Numpy, Pandas, SciPy)..."),await e.yieldToUI();const o=["numpy","pandas","matplotlib","scipy","micropip"];for(const r of o)try{await t.loadPackage(r)}catch(p){console.warn(`[Pyodide] loadPackage failed for ${r}:`,p)}try{const r=t.pyimport("micropip"),p="/pwa_FRM_Book2/",y=["pandas_datareader-0.10.0-py3-none-any.whl","openpyxl-3.1.5-py2.py3-none-any.whl","seaborn-0.13.2-py3-none-any.whl","numpy_financial-1.0.0-py3-none-any.whl","pymoo-0.4.1-py3-none-any.whl","pyodide_http-0.2.2-py3-none-any.whl","requests-2.32.5-py3-none-any.whl"];e.update(66,"📦 本地 wheels：正在安裝 (pandas_datareader, openpyxl, seaborn, ...)");for(const l of y){const w=`${p}wheels/${l}`;try{await r.install(w)}catch(b){console.warn(`[Pyodide] micropip.install failed for ${l}:`,b)}await e.yieldToUI()}}catch(r){console.warn("[Pyodide] Local wheel installation skipped or failed:",r)}e.update(90,"🐍 核心：正在注入 Python 相容性墊片..."),await t.runPythonAsync(`
import sys
import os
import builtins
import js

if not os.path.exists('/data'):
    os.makedirs('/data')
sys.path.append('/data')

def custom_input(prompt = ""):
    try:
        val = js.window.prompt(prompt if prompt else "")
        return val if val is not None else ""
    except Exception: return ""
builtins.input = custom_input
            `),await e.yieldToUI();const d=async(r,p,{timeoutMs:y=15e3,required:l=!1}={})=>{try{await he(t,r,y)}catch(w){if(console.warn(`[Pyodide] Shim failed: ${p}`,w),l)throw w}await e.yieldToUI()};return await d(Ve,"BASE_ENV_SETUP",{timeoutMs:2e4,required:!0}),e.update(92,"核心：正在注入資料集路徑重導向..."),await d(Ke,"DATASET_SHIM",{timeoutMs:15e3,required:!0}),e.update(94,"核心：正在注入常用模組 stub..."),await d(Ge,"SCIPY_STUB",{timeoutMs:15e3}),await d(Ye,"ARCH_STUB",{timeoutMs:15e3}),await d(Xe,"MIBIAN_STUB",{timeoutMs:15e3}),await d(_e,"MCINT_SHIM",{timeoutMs:15e3}),await d(ue,"QPSOLVERS_SHIM",{timeoutMs:15e3}),Y=t,F=null,e.finish("基礎核心載入完成！"),t}catch(t){throw F=null,e.interval&&clearInterval(e.interval),console.error("Failed to load Pyodide:",t),t}})(),F)}let oe=!1,H=null;async function at(s){return oe||H||(H=(async()=>{try{const e=["scipy","statsmodels","scikit-learn"];for(const o of e)await s.loadPackage(o);const t=["seaborn","numpy-financial","pandas-datareader","pyodide-http","chart_studio","plotly","prettytable","qpsolvers","tabulate"],i=s.pyimport("micropip");for(const o of t)try{await i.install(o)}catch(d){console.warn(`[Background] Failed to preload ${o}:`,d)}await Promise.all([s.runPythonAsync(Ue),s.runPythonAsync(We),s.runPythonAsync(me),s.runPythonAsync(_e),s.runPythonAsync(ue)]),oe=!0}catch(e){console.error("⚠️ [Background] Heavy package preload failed:",e),H=null}})()),H}async function he(s,e,t=3e4){let i;const o=new Promise((d,r)=>{i=setTimeout(()=>{r(new Error(`Execution timed out after ${t/1e3} seconds`))},t)});try{return await Promise.race([s.runPythonAsync(e),o])}finally{clearTimeout(i)}}async function st(s){if(s)try{await s.runPythonAsync(`
import gc
import matplotlib.pyplot as plt
plt.close('all')
gc.collect()
        `)}catch{}}async function rt(s){try{const e=await s.runPythonAsync(`
import matplotlib.pyplot as plt
len(plt.get_fignums())
    `);if(e===0)return[];const t=[];for(let i=0;i<e;i++){const o=await s.runPythonAsync(`
import matplotlib.pyplot as plt
import io
import base64

# 取得指定的圖表
fig = plt.figure(${i+1})
buf = io.BytesIO()
fig.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='white')
buf.seek(0)

# 轉換為 base64
img_base64 = base64.b64encode(buf.read()).decode('utf-8')
img_base64
      `);t.push(`data:image/png;base64,${o}`)}return await s.runPythonAsync('import matplotlib.pyplot as plt; plt.close("all")'),t}catch(e){return console.error("Failed to capture plots:",e),[]}}async function le(s,e=!1){try{const t=e?"module://matplotlib_pyodide.wasm_backend":"AGG";await s.runPythonAsync(`
import matplotlib
import matplotlib.pyplot as plt
import warnings
matplotlib.use('${t}')
if plt.style.available and 'default' in plt.style.available:
    plt.style.use('default')

# Suppress plt.show() agg backend warnings & font-not-found warnings
warnings.filterwarnings('ignore', message='.*Matplotlib is currently using agg.*')
warnings.filterwarnings('ignore', message='.*Glyph.*missing from font.*')
import logging
logging.getLogger('matplotlib.font_manager').setLevel(logging.ERROR)

# Replace Times New Roman with DejaVu Sans (available in Pyodide)
import matplotlib.font_manager as fm
_available = {f.name for f in fm.fontManager.ttflist}
if 'Times New Roman' not in _available:
    plt.rcParams['font.family'] = 'DejaVu Sans'
    plt.rcParams['font.serif'] = ['DejaVu Serif', 'DejaVu Sans']
    `)}catch(t){console.error("✗ Matplotlib 初始化失敗:",t)}}async function nt(s){try{await s.runPythonAsync(`
import matplotlib.pyplot as plt
if len(plt.get_fignums()) > 0:
    plt.show()
    `)}catch(e){console.error("Failed to show plots:",e)}}function de(s){const e=s.message||String(s),t=[{pattern:/NameError: name '(.+)' is not defined/,format:i=>`❌ 變數錯誤：'${i[1]}' 未定義`},{pattern:/ModuleNotFoundError: No module named '(.+)'/,format:i=>`❌ 模組錯誤：找不到模組 '${i[1]}'`},{pattern:/SyntaxError/,format:()=>"❌ 語法錯誤"},{pattern:/IndentationError/,format:()=>"❌ 縮排錯誤"},{pattern:/TypeError: (.+)/,format:i=>`❌ 型別錯誤：${i[1]}`},{pattern:/IndexError: (.+)/,format:i=>`❌ 索引錯誤：${i[1]}`},{pattern:/KeyError: (.+)/,format:i=>`❌ 鍵值錯誤：${i[1]}`},{pattern:/ValueError: (.+)/,format:i=>`❌ 數值錯誤：${i[1]}`},{pattern:/ZeroDivisionError/,format:()=>"❌ 除以零錯誤"},{pattern:/ImportError:?\s*(.*)/,format:i=>`❌ 匯入錯誤${i[1]?"："+i[1].trim():""}`}];for(const{pattern:i,format:o}of t){const d=e.match(i);if(d)return o(d)}return`❌ 執行錯誤

${e}`}class it{constructor(){this.metrics={},this.enabled=!0}start(e){this.enabled&&(this.metrics[e]={start:performance.now(),end:null,duration:null})}end(e){if(!this.enabled||!this.metrics[e])return 0;const t=performance.now(),i=this.metrics[e].start,o=t-i;return this.metrics[e].end=t,this.metrics[e].duration=o,this.log(e,o),o}log(e,t){const i=t<100?"⚡":t<1e3?"⏱️":"🐌",o=t<100?"color: green":t<1e3?"color: orange":"color: red";console.debug(`%c${i} ${e}: ${t.toFixed(2)}ms`,o),t>3e3&&console.warn(`⚠️ ${e} 執行時間過長: ${t.toFixed(2)}ms`)}async measure(e,t){this.start(e);try{return await t()}finally{this.end(e)}}getMetric(e){return this.metrics[e]||null}getMetrics(){return{...this.metrics}}getStats(){const e=Object.values(this.metrics).filter(t=>t.duration!==null).map(t=>t.duration);return e.length===0?{count:0,total:0,average:0,min:0,max:0}:{count:e.length,total:e.reduce((t,i)=>t+i,0),average:e.reduce((t,i)=>t+i,0)/e.length,min:Math.min(...e),max:Math.max(...e)}}clear(e){e?delete this.metrics[e]:this.metrics={}}setEnabled(e){this.enabled=e}report(){const e=this.getStats();console.group("📊 效能報告"),console.warn(`總計測量: ${e.count} 次`),console.warn(`總時間: ${e.total.toFixed(2)}ms`),console.warn(`平均時間: ${e.average.toFixed(2)}ms`),console.warn(`最快: ${e.min.toFixed(2)}ms`),console.warn(`最慢: ${e.max.toFixed(2)}ms`),console.groupEnd(),console.group("📋 詳細指標"),Object.entries(this.metrics).forEach(([t,i])=>{i.duration!==null&&console.warn(`${t}: ${i.duration.toFixed(2)}ms`)}),console.groupEnd()}}const Q=new it;Q.setEnabled(!1);let ce=!1;function ot(){if(!ce&&Q.enabled&&(ce=!0,"PerformanceObserver"in window)){new PerformanceObserver(o=>{const d=o.getEntries(),r=d[d.length-1];console.debug("🎨 LCP:",r.renderTime||r.loadTime)}).observe({entryTypes:["largest-contentful-paint"]}),new PerformanceObserver(o=>{o.getEntries().forEach(r=>{console.debug("⚡ FID:",r.processingStart-r.startTime)})}).observe({entryTypes:["first-input"]});let t=0;new PerformanceObserver(o=>{o.getEntries().forEach(r=>{r.hadRecentInput||(t+=r.value)}),console.debug("📐 CLS:",t)}).observe({entryTypes:["layout-shift"]})}}const lt=m.lazy(()=>pe(()=>import("./CodePreviewPanel-BWcJgivw.js"),__vite__mapDeps([0,1,2,3]))),X={QuantLib:"QuantLib",arch:"arch",autograd:"autograd",chart_studio:"chart-studio",datetime:"datetime",lxml:"lxml",math:"math",matplotlib:"matplotlib",mcint:"mcint",mibian:"mibian",mpl_toolkits:"matplotlib",numpy:"numpy",numpy_financial:"wheels/numpy_financial-1.0.0-py3-none-any.whl",openpyxl:"openpyxl",pandas:"pandas",pandas_datareader:"wheels/pandas_datareader-0.10.0-py3-none-any.whl",plotly:"plotly",prettytable:"prettytable",pylab:"matplotlib",pymoo:"wheels/pymoo-0.4.1-py3-none-any.whl",pyodide_http:"wheels/pyodide_http-0.2.2-py3-none-any.whl",qpsolvers:"qpsolvers",requests:"requests","scikit-learn":"scikit-learn",scipy:"scipy",seaborn:"wheels/seaborn-0.13.2-py3-none-any.whl",sklearn:"scikit-learn",statsmodels:"statsmodels",sympy:"sympy",tabulate:"tabulate"},fe={requests:["certifi","charset_normalizer","idna","urllib3"],certifi:"wheels/certifi-2026.1.4-py3-none-any.whl",charset_normalizer:"wheels/charset_normalizer-3.4.4-py3-none-any.whl",idna:"wheels/idna-3.11-py3-none-any.whl",urllib3:"wheels/urllib3-2.6.3-py3-none-any.whl"};typeof window<"u"&&"serviceWorker"in navigator&&(async()=>{try{const s=`/pwa_FRM_Book2/assets-manifest.json?t=${Date.now()}`,e=`/pwa_FRM_Book2/manifest.webmanifest?t=${Date.now()}`;let t=null;try{const r=await fetch(s,{cache:"no-store"});r&&r.ok&&(t=await r.text())}catch{}if(!t)try{const r=await fetch(e,{cache:"no-store"});if(!r||!r.ok)return;t=await r.text()}catch{return}const i=localStorage.getItem("app_assets_manifest_text");if(i&&i===t)return;localStorage.setItem("app_assets_manifest_text",t);const o=await navigator.serviceWorker.getRegistrations();if(!o||o.length===0){localStorage.getItem("app_manifest_reload_done")||(localStorage.setItem("app_manifest_reload_done","1"),location.reload());return}for(const r of o)try{await r.update(),r.waiting&&r.waiting.postMessage({type:"SKIP_WAITING"})}catch(p){console.warn("SW update attempt failed:",p)}const d=()=>{localStorage.getItem("app_manifest_reload_done")||(localStorage.setItem("app_manifest_reload_done","1"),window.location.reload())};navigator.serviceWorker.addEventListener("controllerchange",d)}catch(s){console.warn("Version check/update failed:",s)}})();function dt(){const[s,e]=m.useState(null),[t,i]=m.useState(!0),[o,d]=m.useState(0),[r,p]=m.useState("初始化中..."),[y,l]=m.useState([]),[w,b]=m.useState(!0),[a,c]=m.useState(null),[u,v]=m.useState(null),[E,j]=m.useState(""),[$,B]=m.useState({}),{bodyContent:z}=Oe(a),[M,S]=m.useState(""),[g,x]=m.useState([]),[k,I]=m.useState(!1),[J,ge]=m.useState(!1),[C,ye]=m.useState(()=>{const _=localStorage.getItem("theme");return _==="dark"||!_&&!1}),[Z,ve]=m.useState(600),[A]=m.useState(new Set),[ee,te]=m.useState(null),ae=m.useRef(!1);m.useEffect(()=>{b(!0);const _=`/pwa_FRM_Book2/data/chapters_index.json?t=${Date.now()}`;fetch(_).then(f=>f.json()).then(f=>{f&&f.length>0&&l(f),b(!1)}).catch(f=>{console.error("Failed to load chapters index:",f),b(!1)})},[]);const xe=async _=>{if($[_])return $[_];try{b(!0);const f=await fetch(`/pwa_FRM_Book2/data/chapters_${_}.json?t=${Date.now()}`);if(!f.ok)throw new Error(`HTTP error! status: ${f.status}`);const L=await f.text();let q=null;try{q=JSON.parse(L)}catch{try{const T=L.replace(/\\(?!["\\/bfnrtu])/g,"\\\\");q=JSON.parse(T)}catch(T){throw new Error(`Failed to parse chapter data: ${T.message}`)}}return B(T=>({...T,[_]:q})),b(!1),q}catch(f){return console.error(`Failed to load chapter ${_}:`,f),b(!1),null}};m.useEffect(()=>{tt((f,L)=>{d(f),p(L)}).then(f=>{e(f),i(!1),Q.end("pyodide-init")}),ot();const _=[];if("serviceWorker"in navigator){const f=setInterval(()=>{navigator.serviceWorker.getRegistrations().then(q=>{q.forEach(T=>T.update())})},36e5),L=()=>{};navigator.serviceWorker.addEventListener("controllerchange",L),_.push(()=>{clearInterval(f),navigator.serviceWorker.removeEventListener("controllerchange",L)})}if("storage"in navigator&&"estimate"in navigator.storage){const f=async()=>{try{const q=await navigator.storage.estimate();q.usage&&q.quota&&q.usage/q.quota*100>80&&console.warn("Storage usage is high (>80%). Consider cleaning up.")}catch(q){console.warn("Failed to check storage quota:",q)}};f();const L=setInterval(f,300*1e3);_.push(()=>clearInterval(L))}return()=>{_.forEach(f=>f())}},[]),m.useEffect(()=>{s&&!t&&at(s).then(()=>{ae.current||(ae.current=!0,console.warn("Background initialization complete"))}).catch(_=>console.error("Background loaded failed",_))},[s,t]),m.useEffect(()=>{localStorage.setItem("theme",C?"dark":"light"),document.documentElement.setAttribute("data-theme",C?"dark":"light")},[C]);const se=async(_,f=!1)=>{var ne;if(!s)return;const L=_.match(/^\s*(?:from|import)\s+([a-zA-Z0-9_]+)/gm);if(!L)return;if(/^\s*(?:from|import)\s+QuantLib\b/m.test(_)&&!A.has("QuantLib"))try{f||S(h=>h+`正在啟用 QuantLib 相容性墊片...
`),await s.runPythonAsync(He),A.add("QuantLib"),f||S(h=>h+`✅ QuantLib 墊片已啟用。
`)}catch(h){console.warn("QuantLib shim injection failed:",h),f||S(P=>P+`⚠️ QuantLib 墊片啟用失敗，將嘗試繼續執行...
`)}const q=["sys","os","io","time","timeit","base64","json","datetime","math","re","warnings","builtins","types","random","csv","copy","collections","itertools","functools","pathlib","fractions","struct","operator","string","decimal","abc","enum","typing","textwrap"],T=["numpy","pandas","matplotlib","micropip","js","builtins","QuantLib","mcint","arch","mibian"],D=[...new Set(L.map(h=>{const P=h.trim().split(/\s+/);return P[0]==="from",P[1].split(".")[0]}))].filter(h=>!q.includes(h)&&!T.includes(h)).filter(h=>{var P;return!A.has(h)&&!((P=window.failedPackages)!=null&&P.has(h))});if(D.length===0)return;const O=[],W=[],G=new URL("/pwa_FRM_Book2/",window.location.origin).href,qe=new Set(["scipy","statsmodels","scikit-learn","sympy"]),U=h=>{if(h){if(typeof h=="string"&&(h.endsWith(".whl")||h.startsWith("http"))){W.push(h);return}qe.has(h)?O.push(h):W.push(h)}},re={sklearn:["scipy","scikit-learn"],"scikit-learn":["scipy"],statsmodels:["scipy"],sympy:[],seaborn:["matplotlib","pandas","scipy","statsmodels"],pandas_datareader:["requests"]};if(D.forEach(h=>{const P=X[h];P?(U(P.endsWith(".whl")?G+P:P),(fe[h]||[]).forEach(R=>{const V=fe[R]||R;U(V.endsWith(".whl")?G+V:V)})):U(h),re[h]&&re[h].forEach(N=>{if(!A.has(N)&&!T.includes(N)){const R=X[N]||N;U(R.endsWith(".whl")?G+R:R)}})}),O.length>0||W.length>0)try{const h=[...new Set(O)],P=[...new Set(W)];f||S(N=>N+`正在動態載入所需套件 [${D.join(", ")}]...
`);for(const N of h)await s.loadPackage(N);P.length>0&&(await s.loadPackage("micropip"),await s.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(P)}, keep_going=True)
        `)),D.includes("pandas_datareader")&&await s.runPythonAsync(me),D.includes("matplotlib")&&(await le(s),ee||te("AGG")),D.forEach(N=>{A.add(N);const R=X[N];R&&!R.endsWith(".whl")&&A.add(R)}),f||S(N=>N+`✅ 套件載入完成。
`)}catch(h){if(console.warn("Dependency loading failed:",h),window.failedPackages||(window.failedPackages=new Set),D.forEach(P=>window.failedPackages.add(P)),!f){const P=h.message||String(h);if(P.includes("Can't find a pure Python 3 wheel")){const N=((ne=P.match(/for: '([^']+)'/))==null?void 0:ne[1])||"unknown";S(R=>R+`⚠️ 套件 "${N}" 無法載入（可能不支援瀏覽器環境），嘗試繼續執行...
`)}else S(N=>N+`⚠️ 套件載入出現問題，嘗試直接執行...
`)}}},we=async _=>{if(!(!s||k||!_)){I(!0),S(`執行中...
`),x([]);try{try{_=_.replace(/pd\.read_csv\(r?['"][^'"]*SPX_Option\.csv['"]\)/g,"pd.read_csv('/data/datasets/b2_ch1/SPX_Option.csv')")}catch{}a&&a.id&&await ie(s,a.id),await se(_),Q.start("run-code"),await st(s);const f=_.includes("matplotlib.widgets")||_.includes("Slider")||_.includes("Button");ge(f);const L=f?"module://matplotlib_pyodide.wasm_backend":"AGG";if(ee!==L&&(await le(s,f),te(L)),await s.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `),f){const T=document.getElementById("pyodide-plot-container");T&&(T.innerHTML="",window.document.pyodideMplTarget=T)}try{await he(s,_)}catch(T){const D=await s.runPythonAsync("sys.stdout.getvalue()"),O=de(T);S((D?D+`
`:"")+O),I(!1),Q.end("run-code");return}const q=await s.runPythonAsync("sys.stdout.getvalue()");if(S(q||"執行完成（無文字內容輸出 ）"),J)await nt(s);else{const T=await rt(s);x(T)}}catch(f){const L=de(f);S(L),console.error(f)}finally{I(!1),Q.end("run-code")}}},be=async _=>{let f=_;if(_&&!_.content&&(f=await xe(_.id)),!!f&&(c(f),v(null),j(""),S(""),x([]),f&&f.examples&&s)){const L=f.examples.map(q=>q.code).join(`
`);se(L,!0)}};m.useEffect(()=>{s&&a&&a.id&&ie(s,a.id).catch(_=>console.error("Dataset lazy load failed",_))},[s,a]);const ke=_=>{v(_),S(""),x([])},Se=_=>{v(_),S(""),x([])},Pe=()=>{v(null),S(""),x([])},Le=t;return n.jsxs("div",{className:`app ${C?"dark":""}`,children:[n.jsxs("div",{className:"main-content",children:[n.jsxs("div",{className:"top-bar",children:[n.jsxs("div",{className:"top-bar-left",children:[n.jsx(Te,{size:20,className:"logo-icon"}),n.jsx("span",{className:"app-title",children:"FRM_Book2 (實戰篇)"})]}),n.jsx(Be,{chapters:y,currentChapter:a,bodyContent:z,onChapterSelect:be,currentScript:u,onScriptSelect:Se,selectedTopicId:E,onTopicSelect:j,loading:w}),n.jsx("div",{className:"top-bar-right",children:n.jsx("button",{className:"theme-toggle",onClick:()=>ye(!C),title:C?"切換到亮色模式":"切換到暗色模式",children:C?n.jsx(Ne,{size:20}):n.jsx(Ee,{size:20})})})]}),Le&&n.jsx("div",{className:"hydration-overlay",children:n.jsxs("div",{className:"hydration-card",children:[n.jsxs("div",{className:"hydration-header",children:[n.jsx("div",{className:"hydration-title",children:"FRM Python 引擎啟動中"}),n.jsx("div",{className:"hydration-subtitle",children:"Financial Risk Management"})]}),n.jsx("div",{className:"hydration-progress-container",children:n.jsx("div",{className:"hydration-progress-bar",style:{width:`${o}%`}})}),n.jsxs("div",{className:"hydration-status",children:[n.jsx("span",{children:r}),n.jsxs("span",{children:[o,"%"]})]})]})}),n.jsxs("div",{className:"panes-container",children:[n.jsx("div",{className:"content-pane",children:n.jsx(Ie,{chapter:a,bodyContent:z,onCodeClick:ke,selectedTopicId:E,darkMode:C,output:M,isRunning:k,plotImages:g,onClearOutput:()=>{S(""),x([])}})}),u&&n.jsx("div",{className:"preview-pane",style:{width:`${Z}px`},children:n.jsx(m.Suspense,{fallback:n.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",color:"#888"},children:"Loading Editor..."}),children:n.jsx(lt,{script:u,onClose:Pe,onRun:we,isRunning:k,isLoading:t,output:M,images:g,isInteractive:J,darkMode:C,width:Z,onResize:ve})})})]})]}),n.jsx(Ae,{pyodide:s}),n.jsx(ze,{})]})}Me.createRoot(document.getElementById("root")).render(n.jsx(Re.StrictMode,{children:n.jsx(dt,{})}));
