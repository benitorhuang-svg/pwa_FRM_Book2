const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CodePreviewPanel-9CuloFY_.js","assets/vendor-react-BScQi9YO.js","assets/vendor-B3CQIlJd.js","assets/CodePreviewPanel-V3Zu5mOS.css"])))=>i.map(i=>d[i]);
import{r as u,j as s,C as z,_ as oe,B as ye,S as _e,M as ve,R as we,a as be}from"./vendor-react-BScQi9YO.js";import{B as xe,p as ke}from"./vendor-utils-DahDrsZr.js";import{m as Pe}from"./vendor-katex-Dxylrlod.js";import"./vendor-B3CQIlJd.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&r(p)}).observe(document,{childList:!0,subtree:!0});function t(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=t(o);fetch(o.href,i)}})();function Se({chapters:a,currentChapter:e,onChapterSelect:t,currentScript:r,onScriptSelect:o,selectedTopicId:i,onTopicSelect:p,loading:n}){var w,l;const y=u.useMemo(()=>{const m=e==null?void 0:e.content;if(!m)return[];let c="";const h=m.intro;typeof h=="string"?c=h:h&&typeof h=="object"&&h.body&&(c+=typeof h.body=="string"?h.body:Object.values(h.body).join(`
`));const g=m.body;if(g&&(typeof g=="string"?c+=`
`+g:Array.isArray(g)?c+=`
`+g.join(`
`):typeof g=="object"&&(c+=`
`+Object.values(g).join(`
`))),!c)return[];const S=/^###\s+(.+)$/gm,_=[];let k;for(;(k=S.exec(c))!==null;){const N=k[1].trim(),I="topic-"+N.replace(/\s+/g,"-").toLowerCase();_.push({id:I,title:N})}return _},[e]);return s.jsxs("div",{className:"top-nav-container",children:[s.jsx("div",{className:"nav-group",children:s.jsxs("div",{className:"custom-select-wrapper",children:[s.jsxs("select",{id:"chapter-select",name:"chapter-select",value:(e==null?void 0:e.id)||"",onChange:m=>{const c=a.find(h=>h.id===m.target.value);c&&t(c)},disabled:n||a.length===0,className:"custom-select",children:[s.jsx("option",{value:"",disabled:!0,children:n?"載入中...":"📖 章節選擇"}),a.map(m=>s.jsx("option",{value:m.id,children:m.title},m.id))]}),s.jsx(z,{className:"select-icon",size:16})]})}),s.jsx("div",{className:`nav-group ${!e||y.length===0?"disabled":""}`,children:s.jsxs("div",{className:"custom-select-wrapper",children:[s.jsxs("select",{id:"topic-select",name:"topic-select",value:i,onChange:m=>p(m.target.value),disabled:!e||y.length===0,className:"custom-select",children:[s.jsx("option",{value:"",children:"💡 重點導覽"}),y.map(m=>s.jsx("option",{value:m.id,children:m.title},m.id))]}),s.jsx(z,{className:"select-icon",size:16})]})}),s.jsx("div",{className:`nav-group ${e?"":"disabled"}`,children:s.jsxs("div",{className:"custom-select-wrapper",children:[s.jsxs("select",{id:"script-select",name:"script-select",value:(r==null?void 0:r.filename)||"",onChange:m=>{var h;const c=(e==null?void 0:e.examples)||((h=e==null?void 0:e.content)==null?void 0:h.examples);if(c){const g=c.find(S=>S.filename===m.target.value);g&&o(g)}},disabled:!e||!(e.examples||(w=e.content)!=null&&w.examples)||(e.examples||((l=e.content)==null?void 0:l.examples)||[]).length===0,className:"custom-select",children:[s.jsx("option",{value:"",disabled:!0,children:"💻 程式代碼"}),(()=>{var h;return[...(e==null?void 0:e.examples)||((h=e==null?void 0:e.content)==null?void 0:h.examples)||[]].sort((g,S)=>g.filename.localeCompare(S.filename,void 0,{numeric:!0,sensitivity:"base"})).map(g=>s.jsx("option",{value:g.filename,children:g.filename},g.filename))})()]}),s.jsx(z,{className:"select-icon",size:16})]})})]})}const Ee=new xe(Pe({throwOnError:!1,output:"html",nonStandard:!0})),je=u.memo(({chapter:a,onCodeClick:e,selectedTopicId:t,output:r,isRunning:o,plotImages:i})=>{const p=u.useMemo(()=>{var y,w;if(!a)return null;const n=(y=a.content)==null?void 0:y.intro;if(n){let l="";if(typeof n=="string")l=n;else if(typeof n=="object"){l=`# ${n.title||""}

`,n.roadmap&&(n.roadmap.guide&&(l+=`## 📌 章節導覽
${n.roadmap.guide}

`),n.roadmap.objectives&&(l+=`## 🎯 學習目標
${n.roadmap.objectives}

`),n.roadmap.topics&&(l+=`## 📋 章節重點分明
${n.roadmap.topics}

`)),n.value&&(n.value.practical&&(l+=`## 💼 FRM 考試與實務連結
${n.value.practical}

`),n.value.theory&&(l+=`## 🏛️ 財金理論深度解析
${n.value.theory}

`),n.value.further_reading&&(l+=`## 🚀 延伸閱讀與進階議題
${n.value.further_reading}

`)),n.implementation&&(n.implementation.python&&(l+=`## 🐍 Python 實踐價值
${n.implementation.python}

`),n.implementation.logic&&(l+=`## ⚙️ 代碼核心邏輯
${n.implementation.logic}

`),n.implementation.scenarios&&(l+=`## 💻 應用場景清單
${n.implementation.scenarios}

`));const _=((w=a.content)==null?void 0:w.body)||n.body;if(_)if(l+=`
## 📝 章節重點解說 ( 內容由AI產生，非原書本提供 )
`,typeof _=="string"){let k=null;try{_.trim().startsWith("{")&&(k=JSON.parse(_))}catch{}k&&typeof k=="object"?l+=Object.values(k).join(`

`):l+=_}else Array.isArray(_)?l+=_.join(`

`):typeof _=="object"&&(l+=Object.values(_).join(`

`))}l=l.replace(/##\s*💻\s*應用場景清單[\s\S]*?(?=##|$)/g,""),l=l.replace(/\s*\$\$\s*/g,`
$$
`);let m=Ee.parse(l);m=m.replace(/<h3>(.*?)<\/h3>/g,(_,k)=>`<h3 id="${"topic-"+k.replace(/<[^>]*>/g,"").trim().replace(/\s+/g,"-").toLowerCase()}">${k}</h3>`);let h=ke.sanitize(m,{ADD_TAGS:["math","annotation","semantics","mrow","msub","msup","msubsup","mover","munder","munderover","mmultiscripts","mprec","mnext","mtable","mtr","mtd","mfrac","msqrt","mroot","mstyle","merror","mpadded","mphantom","mfenced","menclose","ms","mglyph","maligngroup","malignmark","maction","svg","path","use","span","div"],ADD_ATTR:["id","target","xlink:href","class","style","aria-hidden","viewBox","d","fill","stroke","stroke-width","data-filename"]});return[...a.examples||[]].sort((_,k)=>k.filename.length-_.filename.length).forEach(_=>{const k=_.filename.replace(".","\\."),N=new RegExp(`(?<!['".\\w])(${k})(?!['".\\w])`,"g");h=h.replace(N,`<span class="code-link" data-filename="${_.filename}">${_.filename}</span>`)}),h}else{const l=a.examples||[];let m=`
        <div class="chapter-intro">
          <h2>${a.title}</h2>
          <p>本章包含 ${l.length} 個程式範例</p>
          <div class="example-grid">
      `;return l.forEach((c,h)=>{m+=`
          <div class="example-card">
            <div class="example-number">${h+1}</div>
            <div class="example-info">
              <h3>${c.title}</h3>
              <span class="code-link" data-filename="${c.filename}">${c.filename}</span>
            </div>
          </div>
        `}),m+=`
          </div>
        </div>
      `,m}},[a]);return u.useEffect(()=>{const n=y=>{if(y.target.classList.contains("code-link")){const w=y.target.dataset.filename;let l=null;a!=null&&a.examples&&(l=a.examples.find(m=>m.filename===w),l&&!l.metadata&&(l.metadata={description:l.title})),l&&e(l)}};return document.addEventListener("click",n),()=>document.removeEventListener("click",n)},[a,e]),u.useEffect(()=>{const n=document.querySelector(".content-scroll");n&&(n.scrollTop=0)},[a]),u.useEffect(()=>{if(t){const n=document.getElementById(t);n&&n.scrollIntoView({behavior:"smooth",block:"start"})}},[t]),u.useEffect(()=>{if(r||i&&i.length>0||o){const n=document.querySelector(".content-scroll");n&&n.scrollTo({top:0,behavior:"instant"})}},[r,i,o]),s.jsx("div",{className:"content-panel",children:s.jsx("div",{className:"content-scroll",children:r||i&&i.length>0||o?s.jsxs("div",{id:"execution-output",className:"execution-output-section",children:[o&&s.jsxs("div",{className:"running-indicator",children:[s.jsx("div",{className:"spinner"}),s.jsx("span",{children:"程式執行中..."})]}),r&&s.jsx("pre",{className:"output-text",children:r}),i&&i.length>0&&s.jsx("div",{className:"output-images",children:i.map((n,y)=>s.jsx("div",{className:"output-image",children:s.jsx("img",{src:n,alt:`Plot ${y+1}`})},y))})]}):p?s.jsx("div",{className:"markdown-body",dangerouslySetInnerHTML:{__html:p}}):s.jsx("div",{className:"welcome-screen",children:s.jsxs("div",{className:"welcome-card premium-welcome",children:[s.jsxs("div",{className:"welcome-brand",children:[s.jsx("img",{src:"welcome.jpg",alt:"FRM Python 理論與實戰",className:"welcome-book-img"}),s.jsx("a",{href:"https://deepwisdom.com.tw/product/%e6%89%8b%e8%a1%93%e5%88%80%e8%88%ac%e7%b2%be%e6%ba%96%e7%9a%84frm-%e7%94%a8python%e7%a7%91%e5%ad%b8%e7%ae%a1%e6%8e%a7%e8%b2%a1%e9%87%91%e9%a2%a8%e9%9a%aa%e5%af%a6%e6%88%b0%e7%af%87dm2308/",target:"_blank",rel:"noopener noreferrer",className:"welcome-purchase-btn",children:"[ 本書官網購買連結 ]"})]}),s.jsxs("div",{className:"welcome-content",children:[s.jsxs("h2",{className:"welcome-title",children:["Python 金融風險管理：",s.jsx("br",{}),"數學模型與應用 (實戰篇)"]}),s.jsx("div",{className:"welcome-slogan",children:"☆★☆★【有如手術刀般精準！利用Python幫你管控財金風險！】★☆★☆"}),s.jsxs("div",{className:"welcome-text-scroll",children:[s.jsx("p",{children:"在上一本基礎篇的學習完備，能善用Python程式語言及常用的工具套件之後，接下來就是開始對金融風險進行評估了。"}),s.jsx("p",{children:"本書接續介紹了各種數學模型，包括波動性、隨機過程及相當重要的馬可夫過程、馬丁格爾、隨機漫步、維納過程等，另外也包含蒙地卡羅等數學模型的應用。"}),s.jsx("p",{children:"而統計科學中最常用的回歸，本書也有涉獵。另外包括了二元樹、BSM選擇權、希臘字母，市場風險等，都有最完整的Python程式和數學公式供讀者計算、運用。"}),s.jsx("p",{children:"金融商品龐大且複雜，需要像使用手術刀般精準、細緻地切割每一個細節，畢竟賠錢事事小，沒辦法掌握到大盤的迅速波動與走勢，才是一大損失。"})]})]})]})})})})});function Le(){return null}function Ne(a={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:r,onRegistered:o,onRegisteredSW:i,onRegisterError:p}=a;let n,y,w;const l=async(c=!0)=>{await y,w==null||w()};async function m(){if("serviceWorker"in navigator){if(n=await oe(async()=>{const{Workbox:c}=await import("./vendor-B3CQIlJd.js").then(h=>h.w);return{Workbox:c}},[]).then(({Workbox:c})=>new c("/pwa_FRM_Book2_python/sw.js",{scope:"/pwa_FRM_Book2_python/",type:"classic"})).catch(c=>{p==null||p(c)}),!n)return;w=()=>{n==null||n.messageSkipWaiting()};{let c=!1;const h=()=>{c=!0,n==null||n.addEventListener("controlling",g=>{g.isUpdate&&window.location.reload()}),t==null||t()};n.addEventListener("installed",g=>{typeof g.isUpdate>"u"?typeof g.isExternal<"u"&&g.isExternal?h():!c&&(r==null||r()):g.isUpdate||r==null||r()}),n.addEventListener("waiting",h)}n.register({immediate:e}).then(c=>{i?i("/pwa_FRM_Book2_python/sw.js",c):o==null||o(c)}).catch(c=>{p==null||p(c)})}}return y=m(),l}function De(a={}){const{immediate:e=!0,onNeedRefresh:t,onOfflineReady:r,onRegistered:o,onRegisteredSW:i,onRegisterError:p}=a,[n,y]=u.useState(!1),[w,l]=u.useState(!1),[m]=u.useState(()=>Ne({immediate:e,onOfflineReady(){l(!0),r==null||r()},onNeedRefresh(){y(!0),t==null||t()},onRegistered:o,onRegisteredSW:i,onRegisterError:p}));return{needRefresh:[n,y],offlineReady:[w,l],updateServiceWorker:m}}function Re(){const{offlineReady:[a,e],needRefresh:[t,r],updateServiceWorker:o}=De({onRegisteredSW(p,n){console.log(`Service Worker at: ${p}`),n&&setInterval(()=>{n.update()},36e5)},onRegisterError(p){console.log("SW registration error",p)}}),i=()=>{e(!1),r(!1)};return s.jsx("div",{className:"ReloadPrompt-container",children:(a||t)&&s.jsxs("div",{className:"ReloadPrompt-toast",children:[s.jsx("div",{className:"ReloadPrompt-message",children:a?"App ready to work offline":"New content available, click on reload button to update."}),t&&s.jsx("button",{className:"ReloadPrompt-toast-button",onClick:()=>o(!0),children:"Reload"}),s.jsx("button",{className:"ReloadPrompt-toast-button",onClick:i,children:"Close"})]})})}const Ce=`
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
            if other.units == "Months":
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

    def __str__(self): return self.dt.strftime('%B %d, %Y')
    def __repr__(self): return self.__str__()
    def date(self): return self

ql.Date = QLDate

class QLPeriod:
    def __init__(self, value, units=None):
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
    evaluationDate = None
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

print("✅ QuantLib (ql) 強大模擬層已啟動。")
`,qe=`
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
`,Ae=`
# 模擬數據引擎：處理 DataReader 因 CORS 導致的 RemoteDataError
def simulated_data_reader(name, data_source=None, start=None, end=None, **kwargs):
    import pandas as pd
    import numpy as np
    print(f"📡 模擬數據引擎：由於瀏覽器 CORS 限制，正在為 {name} 產生模擬股價數據...")
    
    start_date = pd.to_datetime(start or '2020-01-01')
    end_date = pd.to_datetime(end or '2020-12-31')
    dates = pd.date_range(start_date, end_date)
    
    tickers = [name] if isinstance(name, str) else name
    data = {}
    for ticker in tickers:
        stock_map = {
            'goog': 1500, 'amzn': 2000, 'fb': 200, 'nflx': 300, 
            'gld': 150, 'ge': 80, 'nke': 100, 'ford': 10, 'dis': 180, 'aapl': 150, 'tsla': 700
        }
        base_price = stock_map.get(ticker.lower(), 100)
        returns = np.random.normal(0.0005, 0.02, len(dates))
        price = base_price * np.exp(np.cumsum(returns))
        data[ticker] = price
    # Logic dispatch based on data source
    if data_source == 'fred':
        # FRED returns columns named after the series ID (ticker)
        return pd.DataFrame(data, index=dates)
    
    # Default (Yahoo-like): returns Adj Close, High, Low, etc. (Simulated as just Adj Close here)
    if len(tickers) > 1:
        df = pd.DataFrame(data, index=dates)
        df.columns = pd.MultiIndex.from_product([['Adj Close'], tickers])
        return df
    else:
        # Fix: Use tickers[0] to avoid "unhashable type: list" if name was a list
        target_ticker = tickers[0]
        df = pd.DataFrame({'Adj Close': data[target_ticker]}, index=dates)
        return df

try:
    import sys
    import pandas_datareader
    import pandas_datareader.data as pdr_data
    methods = ['DataReader', 'get_data_yahoo', 'get_data_stooq', 'get_data_fred']
    for method in methods:
        setattr(pdr_data, method, simulated_data_reader)
        setattr(pandas_datareader, method, simulated_data_reader)
    sys.modules['pandas_datareader.data'].DataReader = simulated_data_reader
    sys.modules['pandas_datareader'].DataReader = simulated_data_reader
    for method in methods:
        setattr(sys.modules['pandas_datareader.data'], method, simulated_data_reader)
        setattr(sys.modules['pandas_datareader'], method, simulated_data_reader)
    print("✅ 模擬數據引擎：攔截器已成功啟動。")
except ImportError:
    pass
except Exception as e:
    print(f"⚠️ 模擬數據引擎啟動失敗: {str(e)}")
`,Te=`
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
`,Me=`
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
        def wrapper(x, *args, **kwargs):
            x_arr = np.array(x)
            if x_arr.shape == (): return func(float(x), *args, **kwargs)
            return np.array([func(float(xi), *args, **kwargs) for xi in x_arr])
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
`,Ie=`
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
`,Be=`
# Dataset path redirection: intercept hardcoded absolute paths and redirect to virtual /data directory
import os
import sys

def check_and_redirect(path):
    if not isinstance(path, str):
        return path
    # If path looks like Windows or Unix absolute path
    if (':' in path and '\\\\' in path) or path.startswith('/'):
        filename = os.path.basename(path)
        # Search virtual /data directory
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
`,Fe=`
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
`;let U=null,A=null;class $e{constructor(e){this.onProgress=e,this.current=0,this.target=0,this.message="",this.interval=null}start(){this.interval||(this.interval=setInterval(()=>{if(this.current<this.target){const e=this.target-this.current,t=e>20?3.5:e>5?1.5:.5;this.current=Math.min(this.current+t,this.target),this.onProgress(Math.floor(this.current),this.message)}else this.target<99&&(this.current=Math.min(this.current+.08,99.9),this.onProgress(Math.floor(this.current),this.message))},100))}update(e,t){this.target=e,t&&(this.message=t)}async yieldToUI(){return new Promise(e=>setTimeout(e,30))}finish(e="Ready!"){this.interval&&clearInterval(this.interval),this.current=100,this.onProgress(100,e)}}async function Oe(){if(!window.loadPyodide)return new Promise((a,e)=>{const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js",t.onload=()=>a(),t.onerror=()=>e(new Error("Failed to load Pyodide script")),document.head.appendChild(t)})}const Qe={b2_ch1:[{filename:"SPX_Option.csv",displayPath:"B2_Ch1/SPX_Option.csv"}],b2_ch4:[{filename:"BankTeleCompaign.csv",displayPath:"B2_Ch4/BankTeleCompaign.csv"},{filename:"HazardRate.csv",displayPath:"B2_Ch4/HazardRate.csv"},{filename:"LassoRegrData.csv",displayPath:"B2_Ch4/LassoRegrData.csv"},{filename:"MultiLrRegrData.csv",displayPath:"B2_Ch4/MultiLrRegrData.csv"},{filename:"PolyRegrData.csv",displayPath:"B2_Ch4/PolyRegrData.csv"},{filename:"RidgeRegrData.csv",displayPath:"B2_Ch4/RidgeRegrData.csv"},{filename:"WTI.csv",displayPath:"B2_Ch4/WTI.csv"},{filename:"outliersimpact.csv",displayPath:"B2_Ch4/outliersimpact.csv"}],b2_ch9:[{filename:"cs-training.csv",displayPath:"B2_Ch9/cs-training.csv"}],b2_ch11:[{filename:"Data_portfolio_1.xlsx",displayPath:"B2_Ch11/Data_portfolio_1.xlsx"},{filename:"Data_portfolio_2.xlsx",displayPath:"B2_Ch11/Data_portfolio_2.xlsx"}],b2_ch12:[{filename:"Data_portfolio_1.xlsx",displayPath:"B2_Ch12/Data_portfolio_1.xlsx"},{filename:"Data_portfolio_2.xlsx",displayPath:"B2_Ch12/Data_portfolio_2.xlsx"}]};async function ze(a,e){if(!a||!e)return;const t=e.toLowerCase(),r=Qe[t];if(!(!r||r.length===0))for(const o of r){const{filename:i,displayPath:p}=o,n=`/data/${p}`;try{if(a.FS.analyzePath(n).exists)continue}catch{}try{const y=`/pwa_FRM_Book2_python/data/datasets/${t}/${i}`,w=await fetch(y);if(!w.ok)continue;const l=await w.arrayBuffer(),m=new Uint8Array(l),h=n.substring(0,n.lastIndexOf("/")).split("/").filter(S=>S);let g="";for(const S of h){g+="/"+S;try{a.FS.mkdir(g)}catch{}}a.FS.writeFile(n,m)}catch(y){console.error(`[Dataset] Failed to load ${i}:`,y)}}}async function Ue(a){return U?(a&&a(100,"Ready"),U):A||(A=(async()=>{const e=new $e(a);e.start();try{e.update(10,"正在啟動 Python 直譯器 (v0.26.4)..."),await Oe();let t=null,r=3;for(;r>0;)try{t=await window.loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"});break}catch(i){if(console.warn(`Failed to load Pyodide (attempts left: ${r-1}):`,i),r--,r===0)throw i;await new Promise(p=>setTimeout(p,1e3))}e.update(30,"引擎啟動完成，正在檢查本地暫存環境..."),await e.yieldToUI();try{t.FS.mkdir("/mnt"),t.FS.mount(t.FS.filesystems.IDBFS,{},"/mnt"),await new Promise((i,p)=>{t.FS.syncfs(!0,n=>{n?p(n):i()})})}catch(i){console.warn("IDBFS mount skipped:",i)}e.update(50,"📦 核心：正在下載基礎運算模組 (Numpy, Pandas)..."),await e.yieldToUI();const o=["numpy","pandas","matplotlib","micropip"];for(const i of o)await t.loadPackage(i);return e.update(90,"🐍 核心：正在注入 Python 相容性墊片..."),await t.runPythonAsync(`
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
            `),await e.yieldToUI(),await Promise.all([t.runPythonAsync(Ie),t.runPythonAsync(Be),t.runPythonAsync(Me)]),U=t,A=null,e.finish("基礎核心載入完成！"),t}catch(t){throw A=null,e.interval&&clearInterval(e.interval),console.error("Failed to load Pyodide:",t),t}})(),A)}let ee=!1,T=null;async function We(a){return ee||T||(T=(async()=>{try{const e=["scipy","statsmodels","scikit-learn"];for(const o of e)await a.loadPackage(o);const t=["arch","seaborn","numpy-financial","pandas-datareader","pyodide-http","chart_studio","mibian","plotly","prettytable","qpsolvers","tabulate"],r=a.pyimport("micropip");for(const o of t)await r.install(o);await Promise.all([a.runPythonAsync(Te),a.runPythonAsync(qe),a.runPythonAsync(Ce),a.runPythonAsync(Ae),a.runPythonAsync(Fe)]),ee=!0}catch(e){console.error("⚠️ [Background] Heavy package preload failed:",e),T=null}})()),T}async function He(a,e,t=3e4){let r;const o=new Promise((i,p)=>{r=setTimeout(()=>{p(new Error(`Execution timed out after ${t/1e3} seconds`))},t)});try{return await Promise.race([a.runPythonAsync(e),o])}finally{clearTimeout(r)}}async function Ve(a){if(a)try{await a.runPythonAsync(`
import gc
import matplotlib.pyplot as plt
plt.close('all')
gc.collect()
        `)}catch{}}async function Ye(a){try{const e=await a.runPythonAsync(`
import matplotlib.pyplot as plt
len(plt.get_fignums())
    `);if(e===0)return[];const t=[];for(let r=0;r<e;r++){const o=await a.runPythonAsync(`
import matplotlib.pyplot as plt
import io
import base64

# 取得指定的圖表
fig = plt.figure(${r+1})
buf = io.BytesIO()
fig.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='white')
buf.seek(0)

# 轉換為 base64
img_base64 = base64.b64encode(buf.read()).decode('utf-8')
img_base64
      `);t.push(`data:image/png;base64,${o}`)}return await a.runPythonAsync('import matplotlib.pyplot as plt; plt.close("all")'),t}catch(e){return console.error("Failed to capture plots:",e),[]}}async function te(a,e=!1){try{const t=e?"module://matplotlib_pyodide.wasm_backend":"AGG";await a.runPythonAsync(`
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('${t}')
if plt.style.available and 'default' in plt.style.available:
    plt.style.use('default')
    `)}catch(t){console.error("✗ Matplotlib 初始化失敗:",t)}}async function Ge(a){try{await a.runPythonAsync(`
import matplotlib.pyplot as plt
if len(plt.get_fignums()) > 0:
    plt.show()
    `)}catch(e){console.error("Failed to show plots:",e)}}function ae(a){const e=a.message||String(a),t=[{pattern:/NameError: name '(.+)' is not defined/,format:r=>`❌ 變數錯誤：'${r[1]}' 未定義`},{pattern:/ModuleNotFoundError: No module named '(.+)'/,format:r=>`❌ 模組錯誤：找不到模組 '${r[1]}'`},{pattern:/SyntaxError/,format:()=>"❌ 語法錯誤"},{pattern:/IndentationError/,format:()=>"❌ 縮排錯誤"},{pattern:/TypeError: (.+)/,format:r=>`❌ 型別錯誤：${r[1]}`},{pattern:/IndexError: (.+)/,format:r=>`❌ 索引錯誤：${r[1]}`},{pattern:/KeyError: (.+)/,format:r=>`❌ 鍵值錯誤：${r[1]}`},{pattern:/ValueError: (.+)/,format:r=>`❌ 數值錯誤：${r[1]}`},{pattern:/ZeroDivisionError/,format:()=>"❌ 除以零錯誤"},{pattern:/ImportError:?\s*(.*)/,format:r=>`❌ 匯入錯誤${r[1]?"："+r[1].trim():""}`}];for(const{pattern:r,format:o}of t){const i=e.match(r);if(i)return o(i)}return`❌ 執行錯誤

${e}`}class Je{constructor(){this.metrics={},this.enabled=!0}start(e){this.enabled&&(this.metrics[e]={start:performance.now(),end:null,duration:null})}end(e){if(!this.enabled||!this.metrics[e])return 0;const t=performance.now(),r=this.metrics[e].start,o=t-r;return this.metrics[e].end=t,this.metrics[e].duration=o,this.log(e,o),o}log(e,t){const r=t<100?"⚡":t<1e3?"⏱️":"🐌",o=t<100?"color: green":t<1e3?"color: orange":"color: red";console.log(`%c${r} ${e}: ${t.toFixed(2)}ms`,o),t>1e3&&console.warn(`⚠️ ${e} 執行時間過長: ${t.toFixed(2)}ms`)}async measure(e,t){this.start(e);try{return await t()}finally{this.end(e)}}getMetric(e){return this.metrics[e]||null}getMetrics(){return{...this.metrics}}getStats(){const e=Object.values(this.metrics).filter(t=>t.duration!==null).map(t=>t.duration);return e.length===0?{count:0,total:0,average:0,min:0,max:0}:{count:e.length,total:e.reduce((t,r)=>t+r,0),average:e.reduce((t,r)=>t+r,0)/e.length,min:Math.min(...e),max:Math.max(...e)}}clear(e){e?delete this.metrics[e]:this.metrics={}}setEnabled(e){this.enabled=e}report(){const e=this.getStats();console.group("📊 效能報告"),console.log(`總計測量: ${e.count} 次`),console.log(`總時間: ${e.total.toFixed(2)}ms`),console.log(`平均時間: ${e.average.toFixed(2)}ms`),console.log(`最快: ${e.min.toFixed(2)}ms`),console.log(`最慢: ${e.max.toFixed(2)}ms`),console.groupEnd(),console.group("📋 詳細指標"),Object.entries(this.metrics).forEach(([t,r])=>{r.duration!==null&&console.log(`${t}: ${r.duration.toFixed(2)}ms`)}),console.groupEnd()}}const M=new Je;M.setEnabled(!1);let se=!1;function Ze(){if(!se&&(se=!0,"PerformanceObserver"in window)){new PerformanceObserver(o=>{const i=o.getEntries(),p=i[i.length-1];console.log("🎨 LCP:",p.renderTime||p.loadTime)}).observe({entryTypes:["largest-contentful-paint"]}),new PerformanceObserver(o=>{o.getEntries().forEach(p=>{console.log("⚡ FID:",p.processingStart-p.startTime)})}).observe({entryTypes:["first-input"]});let t=0;new PerformanceObserver(o=>{o.getEntries().forEach(p=>{p.hadRecentInput||(t+=p.value)}),console.log("📐 CLS:",t)}).observe({entryTypes:["layout-shift"]})}}const Ke=u.lazy(()=>oe(()=>import("./CodePreviewPanel-9CuloFY_.js"),__vite__mapDeps([0,1,2,3]))),re={pandas:"pandas",matplotlib:"matplotlib",scipy:"scipy",statsmodels:"statsmodels",sympy:"sympy",autograd:"autograd",lxml:"lxml",openpyxl:"openpyxl",requests:"requests",sklearn:"scikit-learn","scikit-learn":"scikit-learn",arch:"arch",plotly:"plotly",chart_studio:"chart-studio",mcint:"mcint",mibian:"mibian",prettytable:"prettytable",qpsolvers:"qpsolvers",tabulate:"tabulate",numpy_financial:"wheels/numpy_financial-1.0.0-py3-none-any.whl",seaborn:"wheels/seaborn-0.13.2-py3-none-any.whl",pymoo:"wheels/pymoo-0.4.1-py3-none-any.whl",pandas_datareader:"wheels/pandas_datareader-0.10.0-py3-none-any.whl",pyodide_http:"wheels/pyodide_http-0.2.2-py3-none-any.whl",mpl_toolkits:"matplotlib",pylab:"matplotlib"},ne={requests:["certifi","charset_normalizer","idna","urllib3"],certifi:"wheels/certifi-2026.1.4-py3-none-any.whl",charset_normalizer:"wheels/charset_normalizer-3.4.4-py3-none-any.whl",idna:"wheels/idna-3.11-py3-none-any.whl",urllib3:"wheels/urllib3-2.6.3-py3-none-any.whl"};function Xe(){const[a,e]=u.useState(null),[t,r]=u.useState(!0),[o,i]=u.useState(0),[p,n]=u.useState("初始化中..."),[y,w]=u.useState([]),[l,m]=u.useState(!0),[c,h]=u.useState(null),[g,S]=u.useState(null),[_,k]=u.useState(""),[N,I]=u.useState({}),[W,j]=u.useState(""),[H,C]=u.useState([]),[F,$]=u.useState(!1),[V,ie]=u.useState(!1),[D,le]=u.useState(()=>{const f=localStorage.getItem("theme");return f==="dark"||!f&&!1}),[Y,ce]=u.useState(600),[O]=u.useState(new Set),[G,J]=u.useState(null);u.useEffect(()=>{m(!0);const f=`/pwa_FRM_Book2_python/data/chapters_index.json?t=${Date.now()}`;fetch(f).then(d=>d.json()).then(d=>{d&&d.length>0&&w(d),m(!1)}).catch(d=>{console.error("Failed to load chapters index:",d),m(!1)})},[]);const de=async f=>{if(N[f])return N[f];try{m(!0);const d=await fetch(`/pwa_FRM_Book2_python/data/chapters_${f}.json?t=${Date.now()}`);if(!d.ok)throw new Error(`HTTP error! status: ${d.status}`);const b=await d.text();let x=null;try{x=JSON.parse(b)}catch{try{const L=b.replace(/\\(?!["\\\/bfnrtu])/g,"\\\\");x=JSON.parse(L)}catch(L){throw new Error(`Failed to parse chapter data: ${L.message}`)}}return I(E=>({...E,[f]:x})),m(!1),x}catch(d){return console.error(`Failed to load chapter ${f}:`,d),m(!1),null}};u.useEffect(()=>{Ue((d,b)=>{i(d),n(b)}).then(d=>{e(d),r(!1),M.end("pyodide-init")}),Ze();const f=[];if("serviceWorker"in navigator){const d=setInterval(()=>{navigator.serviceWorker.getRegistrations().then(x=>{x.forEach(E=>E.update())})},36e5),b=()=>{};navigator.serviceWorker.addEventListener("controllerchange",b),f.push(()=>{clearInterval(d),navigator.serviceWorker.removeEventListener("controllerchange",b)})}if("storage"in navigator&&"estimate"in navigator.storage){const d=async()=>{try{const x=await navigator.storage.estimate();x.usage&&x.quota&&x.usage/x.quota*100>80&&console.warn("Storage usage is high (>80%). Consider cleaning up.")}catch(x){console.warn("Failed to check storage quota:",x)}};d();const b=setInterval(d,300*1e3);f.push(()=>clearInterval(b))}return()=>{f.forEach(d=>d())}},[]),u.useEffect(()=>{a&&!t&&We(a).then(()=>console.log("Background initialization complete")).catch(f=>console.error("Background loaded failed",f))},[a,t]),u.useEffect(()=>{localStorage.setItem("theme",D?"dark":"light"),document.documentElement.setAttribute("data-theme",D?"dark":"light")},[D]);const Z=async(f,d=!1)=>{var X;if(!a)return;const b=f.match(/^\s*(?:from|import)\s+([a-zA-Z0-9_]+)/gm);if(!b)return;const x=["sys","os","io","time","timeit","base64","json","datetime","math","re","warnings","builtins","types","random","csv","copy","collections","itertools","functools","pathlib","fractions","struct","operator","string","decimal","abc","enum","typing","textwrap"],E=["numpy","pandas","matplotlib","scipy","statsmodels","sympy","lxml","micropip","js","builtins","QuantLib","mcint"],L=[...new Set(b.map(P=>{const v=P.trim().split(/\s+/);return v[0]==="from",v[1].split(".")[0]}))].filter(P=>!x.includes(P)&&!E.includes(P)).filter(P=>{var v;return!O.has(P)&&!((v=window.failedPackages)!=null&&v.has(P))});if(L.length===0)return;const q=[],K=new URL("/pwa_FRM_Book2_python/",window.location.origin).href;if(L.forEach(P=>{const v=re[P];v?(q.push(v.endsWith(".whl")?K+v:v),(ne[P]||[]).forEach(B=>{const Q=ne[B]||B;q.push(Q.endsWith(".whl")?K+Q:Q)})):q.push(P)}),q.length>0)try{const P=[...new Set(q)];d||j(v=>v+`正在動態載入所需套件 [${L.join(", ")}]...
`),await a.loadPackage("micropip"),await a.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(P)}, keep_going=True)
        `),L.includes("matplotlib")&&(await te(a),G||J("AGG")),L.forEach(v=>{O.add(v);const R=re[v];R&&!R.endsWith(".whl")&&O.add(R)}),d||j(v=>v+`✅ 套件載入完成。
`)}catch(P){if(console.warn("Dependency loading failed:",P),window.failedPackages||(window.failedPackages=new Set),L.forEach(v=>window.failedPackages.add(v)),!d){const v=P.message||String(P);if(v.includes("Can't find a pure Python 3 wheel")){const R=((X=v.match(/for: '([^']+)'/))==null?void 0:X[1])||"unknown";j(B=>B+`⚠️ 套件 "${R}" 無法載入（可能不支援瀏覽器環境），嘗試繼續執行...
`)}else j(R=>R+`⚠️ 套件載入出現問題，嘗試直接執行...
`)}}},me=async f=>{if(!(!a||F||!f)){$(!0),j(`執行中...
`),C([]);try{await Z(f),M.start("run-code"),await Ve(a);const d=f.includes("matplotlib.widgets")||f.includes("Slider")||f.includes("Button");ie(d);const b=d?"module://matplotlib_pyodide.wasm_backend":"AGG";if(G!==b&&(await te(a,d),J(b)),await a.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `),d){const E=document.getElementById("pyodide-plot-container");E&&(E.innerHTML="",window.document.pyodideMplTarget=E)}try{await He(a,f)}catch(E){const L=await a.runPythonAsync("sys.stdout.getvalue()"),q=ae(E);j((L?L+`
`:"")+q),$(!1),M.end("run-code");return}const x=await a.runPythonAsync("sys.stdout.getvalue()");if(j(x||"執行完成（無文字內容輸出 ）"),V)await Ge(a);else{const E=await Ye(a);C(E)}}catch(d){const b=ae(d);j(b),console.error(d)}finally{$(!1),M.end("run-code")}}},pe=async f=>{let d=f;if(f&&!f.content&&(d=await de(f.id)),!!d&&(h(d),S(null),k(""),j(""),C([]),d&&d.examples&&a)){const b=d.examples.map(x=>x.code).join(`
`);Z(b,!0)}};u.useEffect(()=>{a&&c&&c.id&&ze(a,c.id).catch(f=>console.error("Dataset lazy load failed",f))},[a,c]);const fe=f=>{S(f),j(""),C([])},ue=f=>{S(f),j(""),C([])},he=()=>{S(null),j(""),C([])},ge=t;return s.jsxs("div",{className:`app ${D?"dark":""}`,children:[s.jsxs("div",{className:"main-content",children:[s.jsxs("div",{className:"top-bar",children:[s.jsxs("div",{className:"top-bar-left",children:[s.jsx(ye,{size:20,className:"logo-icon"}),s.jsx("span",{className:"app-title",children:"FRM_Book2 (實戰篇)"})]}),s.jsx(Se,{chapters:y,currentChapter:c,onChapterSelect:pe,currentScript:g,onScriptSelect:ue,selectedTopicId:_,onTopicSelect:k,loading:l}),s.jsx("div",{className:"top-bar-right",children:s.jsx("button",{className:"theme-toggle",onClick:()=>le(!D),title:D?"切換到亮色模式":"切換到暗色模式",children:D?s.jsx(_e,{size:20}):s.jsx(ve,{size:20})})})]}),ge&&s.jsx("div",{className:"hydration-overlay",children:s.jsxs("div",{className:"hydration-card",children:[s.jsxs("div",{className:"hydration-header",children:[s.jsx("div",{className:"hydration-title",children:"FRM Python 引擎啟動中"}),s.jsx("div",{className:"hydration-subtitle",children:"Financial Risk Management"})]}),s.jsx("div",{className:"hydration-progress-container",children:s.jsx("div",{className:"hydration-progress-bar",style:{width:`${o}%`}})}),s.jsxs("div",{className:"hydration-status",children:[s.jsx("span",{children:p}),s.jsxs("span",{children:[o,"%"]})]})]})}),s.jsxs("div",{className:"panes-container",children:[s.jsx("div",{className:"content-pane",children:s.jsx(je,{chapter:c,onCodeClick:fe,selectedTopicId:_,darkMode:D,output:W,isRunning:F,plotImages:H,onClearOutput:()=>{j(""),C([])}})}),g&&s.jsx("div",{className:"preview-pane",style:{width:`${Y}px`},children:s.jsx(u.Suspense,{fallback:s.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",color:"#888"},children:"Loading Editor..."}),children:s.jsx(Ke,{script:g,onClose:he,onRun:me,isRunning:F,isLoading:t,output:W,images:H,isInteractive:V,darkMode:D,width:Y,onResize:ce})})})]})]}),s.jsx(Le,{pyodide:a}),s.jsx(Re,{})]})}async function et(){try{if(!("serviceWorker"in navigator))return;const a="frm_sw_cleanup_done_v3";if(localStorage.getItem(a))return;if(!navigator.serviceWorker.controller){localStorage.setItem(a,"1");return}console.warn("[AUTO-CLEAN] STALE SERVICE WORKER DETECTED! Starting emergency cleanup.");try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>(console.log("[AUTO-CLEAN] Unregistering:",t.scope),t.unregister().catch(()=>{})))),console.info("[AUTO-CLEAN] serviceWorker registrations unregistered.")}catch(e){console.warn("[AUTO-CLEAN] Failed to unregister service workers",e)}try{if("caches"in window){const e=await caches.keys();await Promise.all(e.map(t=>(console.log("[AUTO-CLEAN] Deleting Cache:",t),caches.delete(t).catch(()=>{})))),console.info("[AUTO-CLEAN] CacheStorage cleared:",e)}}catch(e){console.warn("[AUTO-CLEAN] Failed to clear CacheStorage",e)}try{if("databases"in indexedDB){const e=await indexedDB.databases();await Promise.all(e.map(t=>indexedDB.deleteDatabase(t.name).catch(()=>{}))),console.info("[AUTO-CLEAN] IndexedDB databases deleted:",e.map(t=>t.name))}else{const e=["pyodide","emscripten-archives","idb-filesystem","file_storage","workbox-precache-v2"];await Promise.all(e.map(t=>indexedDB.deleteDatabase(t).catch(()=>{}))),console.info("[AUTO-CLEAN] IndexedDB fallback delete attempted for candidates.")}}catch(e){console.warn("[AUTO-CLEAN] Failed to clear IndexedDB",e)}try{const e=localStorage.getItem("theme");localStorage.clear(),sessionStorage.clear(),e&&localStorage.setItem("theme",e),console.info("[AUTO-CLEAN] localStorage and sessionStorage cleared (theme preserved).")}catch(e){console.warn("[AUTO-CLEAN] Failed to clear storage",e)}try{localStorage.setItem(a,"1")}catch{}try{console.error("[AUTO-CLEAN] CLEANUP COMPLETE. FORCING RELOAD FROM SERVER."),window.location.reload(!0)}catch{window.location.href=window.location.href}}catch(a){console.warn("[AUTO-CLEAN] Unexpected error",a)}}et().catch(()=>{});we.createRoot(document.getElementById("root")).render(s.jsx(be.StrictMode,{children:s.jsx(Xe,{})}));
