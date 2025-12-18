import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as p,R as m}from"./index-BKyFwriW.js";import{u as R,c as He,b as ze,d as We}from"./ToastContext-ErSnUSL6.js";import{l as $e}from"./lkern-logo-Cn1Dyld1.js";import{A as Re}from"./AuthRoleSwitcher-CoFXCztO.js";import{I as Oe}from"./InfoHint-TbK9iuJy.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";const Je="Sidebar-module__sidebar___LwB3u",Ve="Sidebar-module__sidebar__logo___Uli4-",Ue="Sidebar-module__sidebar__nav___stTBJ",Xe="Sidebar-module__sidebar__bottom___Clug2",qe="Sidebar-module__sidebar__logoImage___fgzPk",Ze="Sidebar-module__sidebar__toggle___M8B0E",Ge="Sidebar-module__sidebar__toggleIcon___7yf8o",Qe="Sidebar-module__sidebar__resizeHandle___Xciyf",Ye="Sidebar-module__sidebar__expandCollapseButtons___RmIDU",ea="Sidebar-module__sidebar__expandAllButton___-7sJ7",aa="Sidebar-module__sidebar__collapseAllButton___wxTNJ",sa="Sidebar-module__sidebar__navList___VHFPK",ta="Sidebar-module__sidebar__navItemWrapper___e9V2x",ia="Sidebar-module__sidebar__labelContainer___d7Pen",na="Sidebar-module__sidebar__navItem___2u4qL",oa="Sidebar-module__sidebar__navItemIndicator___xd-Pu",ra="Sidebar-module__sidebar__icon___FAbQe",la="Sidebar-module__sidebar__label___w5hoB",da="Sidebar-module__sidebar__expandArrow___Y1oDO",ca="Sidebar-module__sidebar__badge___cXHtB",_a="Sidebar-module__sidebar__floatingSubmenu___OWZSE",ba="Sidebar-module__sidebar__floatingSubmenuHeader___6G6dd",ga="Sidebar-module__sidebar__floatingSubmenuList___8DrVe",pa="Sidebar-module__sidebar__floatingSubmenuItem___zUa4z",ha="Sidebar-module__sidebar__submenuList___9ANpD",ua="Sidebar-module__sidebar__togglesWrapper___DorDA",ma="Sidebar-module__sidebar__themeToggle___KuYWS",xa="Sidebar-module__sidebar__uploadBox___xytcF",ya="Sidebar-module__sidebar__uploadBoxIcon___jZmxj",va="Sidebar-module__sidebar__uploadBoxText___H18HI",fa="Sidebar-module__sidebar__uploadBoxSubtext___uvaEO",Sa="Sidebar-module__sidebar__floatingAction___TH58z",ka="Sidebar-module__sidebar__tabs___JHmyg",ja="Sidebar-module__sidebar__tabButton___H9sda",wa="Sidebar-module__sidebar__tabIcon___1Uec4",Na="Sidebar-module__sidebar__tabContent___z5IFg",Ia="Sidebar-module__sidebar__analyticsPanel___L6T1-",Ca="Sidebar-module__sidebar__analyticsSection___FS1ir",Ta="Sidebar-module__sidebar__analyticsSectionTitle___q6QXB",Aa="Sidebar-module__sidebar__analyticsDivider___nMJda",Ba="Sidebar-module__sidebar__analyticsToggle___TrjZh",La="Sidebar-module__sidebar__analyticsToggleClickable___44d6j",Ka="Sidebar-module__sidebar__analyticsCheckbox___0uT2V",Da="Sidebar-module__sidebar__analyticsCheckmark___tRALy",Ea="Sidebar-module__sidebar__analyticsLabel___CWVhO",Pa="Sidebar-module__sidebar__analyticsActions___MS5dg",Fa="Sidebar-module__sidebar__analyticsActionBtn___5dNF8",Ma="Sidebar-module__sidebar__select___js36j",Ha="Sidebar-module__sidebar__hint___7pvo-",a={sidebar:Je,"sidebar--resizing":"Sidebar-module__sidebar--resizing___Cw--V","sidebar--collapsed":"Sidebar-module__sidebar--collapsed___wVO6w",sidebar__logo:Ve,sidebar__nav:Ue,sidebar__bottom:Xe,sidebar__logoImage:qe,sidebar__toggle:Ze,sidebar__toggleIcon:Ge,sidebar__resizeHandle:Qe,sidebar__expandCollapseButtons:Ye,sidebar__expandAllButton:ea,sidebar__collapseAllButton:aa,sidebar__navList:sa,sidebar__navItemWrapper:ta,sidebar__labelContainer:ia,sidebar__navItem:na,"sidebar__navItem--active":"Sidebar-module__sidebar__navItem--active___JvRL3","sidebar__navItem--disabled":"Sidebar-module__sidebar__navItem--disabled___Jdqll",sidebar__navItemIndicator:oa,sidebar__icon:ra,sidebar__label:la,sidebar__expandArrow:da,sidebar__badge:ca,sidebar__floatingSubmenu:_a,sidebar__floatingSubmenuHeader:ba,sidebar__floatingSubmenuList:ga,sidebar__floatingSubmenuItem:pa,"sidebar__floatingSubmenuItem--active":"Sidebar-module__sidebar__floatingSubmenuItem--active___oG7DM",sidebar__submenuList:ha,sidebar__togglesWrapper:ua,sidebar__themeToggle:ma,sidebar__uploadBox:xa,sidebar__uploadBoxIcon:ya,sidebar__uploadBoxText:va,sidebar__uploadBoxSubtext:fa,sidebar__floatingAction:Sa,sidebar__tabs:ka,sidebar__tabButton:ja,"sidebar__tabButton--active":"Sidebar-module__sidebar__tabButton--active___2S8Kk",sidebar__tabIcon:wa,sidebar__tabContent:Na,"sidebar__tabContent--active":"Sidebar-module__sidebar__tabContent--active___uKVcn",sidebar__analyticsPanel:Ia,sidebar__analyticsSection:Ca,sidebar__analyticsSectionTitle:Ta,sidebar__analyticsDivider:Aa,sidebar__analyticsToggle:Ba,sidebar__analyticsToggleClickable:La,sidebar__analyticsCheckbox:Ka,"sidebar__analyticsCheckbox--checked":"Sidebar-module__sidebar__analyticsCheckbox--checked___KfR7z",sidebar__analyticsCheckmark:Da,sidebar__analyticsLabel:Ea,sidebar__analyticsActions:Pa,sidebar__analyticsActionBtn:Fa,"sidebar__analyticsActionBtn--enable":"Sidebar-module__sidebar__analyticsActionBtn--enable___MnOfv","sidebar__analyticsActionBtn--disable":"Sidebar-module__sidebar__analyticsActionBtn--disable___O02IB",sidebar__select:Ma,sidebar__hint:Ha},Te=({item:s,activePath:c,isCollapsed:d,onItemClick:_})=>{const{t:b}=R(),[x,y]=p.useState(!1),[g,v]=p.useState(()=>{try{const i=localStorage.getItem("sidebar-expanded-items");if(i)return JSON.parse(i).includes(s.path)}catch(i){console.error("Failed to load sidebar expanded state:",i)}return!1}),o=c===s.path,h=s.children&&s.children.length>0,u=!s.onClick,O=p.useCallback(i=>{if(u){i.preventDefault(),i.stopPropagation();return}i.button===1||i.ctrlKey||i.metaKey||(i.preventDefault(),_(s))},[s,_,u]),J=p.useCallback(i=>{i.stopPropagation(),i.preventDefault(),v(!g)},[g]);return m.useEffect(()=>{try{const i=localStorage.getItem("sidebar-expanded-items"),l=i?JSON.parse(i):[];if(g&&!l.includes(s.path))l.push(s.path),localStorage.setItem("sidebar-expanded-items",JSON.stringify(l));else if(!g&&l.includes(s.path)){const k=l.filter(T=>T!==s.path);localStorage.setItem("sidebar-expanded-items",JSON.stringify(k))}}catch(i){console.error("Failed to save sidebar expanded state:",i)}},[g,s.path]),m.useEffect(()=>{const i=()=>{try{const l=localStorage.getItem("sidebar-expanded-items");if(l){const k=JSON.parse(l);v(k.includes(s.path))}else v(!1)}catch(l){console.error("Failed to sync expanded state:",l)}};return window.addEventListener("storage",i),()=>window.removeEventListener("storage",i)},[s.path]),e.jsxs("li",{className:a.sidebar__navItemWrapper,onMouseEnter:()=>y(!0),onMouseLeave:()=>y(!1),children:[e.jsxs("a",{href:s.path,className:`${a.sidebar__navItem} ${o?a["sidebar__navItem--active"]:""} ${u?a["sidebar__navItem--disabled"]:""}`,onClick:O,"aria-current":o?"page":void 0,"aria-disabled":u,title:d?b(s.labelKey):void 0,children:[o&&e.jsx("span",{className:a.sidebar__navItemIndicator}),e.jsx("span",{className:a.sidebar__icon,children:(typeof s.icon=="string",s.icon)}),e.jsxs("div",{className:a.sidebar__labelContainer,children:[!d&&e.jsx("span",{className:a.sidebar__label,children:b(s.labelKey)}),!d&&h&&e.jsx("span",{className:a.sidebar__expandArrow,onClick:J,children:g?"▼":"▶"}),s.badge!==void 0&&s.badge>0&&e.jsx("span",{className:a.sidebar__badge,children:s.badge>99?"99+":s.badge})]})]}),d&&h&&x&&e.jsxs("div",{className:a.sidebar__floatingSubmenu,children:[e.jsx("div",{className:a.sidebar__floatingSubmenuHeader,children:b(s.labelKey)}),e.jsx("ul",{className:a.sidebar__floatingSubmenuList,children:s.children.map(i=>e.jsx("li",{children:e.jsxs("a",{href:i.path,className:`${a.sidebar__floatingSubmenuItem} ${c===i.path?a["sidebar__floatingSubmenuItem--active"]:""}`,onClick:l=>{l.button===1||l.ctrlKey||l.metaKey||(l.preventDefault(),_(i))},children:[e.jsx("span",{className:a.sidebar__icon,children:(typeof i.icon=="string",i.icon)}),e.jsx("span",{children:b(i.labelKey)})]})},i.path))})]}),!d&&h&&g&&e.jsx("ul",{className:a.sidebar__submenuList,children:s.children.map(i=>e.jsx(Te,{item:i,activePath:c,isCollapsed:d,onItemClick:_},i.path))})]})},za=()=>{const{t:s}=R(),{user:c,setPermissionLevel:d}=ze(),_=x=>{const y=x.target.value;try{localStorage.setItem("user-export-behavior",y),d(c.permissionLevel)}catch(g){console.error("Failed to save export behavior:",g)}},b=c.exportBehavior||"automatic";return e.jsxs("div",{className:a.sidebar__analyticsSection,children:[e.jsxs("div",{className:a.sidebar__analyticsSectionTitle,children:[e.jsx("span",{role:"img","aria-label":"export",children:"📤"})," ",s("settings.title")]}),e.jsxs("div",{className:a.sidebar__analyticsToggle,children:[e.jsx("label",{htmlFor:"export-behavior-select",className:a.sidebar__analyticsLabel,children:s("settings.exportBehavior.label")}),e.jsxs("select",{id:"export-behavior-select",value:b,onChange:_,className:a.sidebar__select,children:[e.jsx("option",{value:"automatic",children:s("settings.exportBehavior.automatic")}),e.jsx("option",{value:"save-as-dialog",children:s("settings.exportBehavior.saveAsDialog")})]}),e.jsx("div",{className:a.sidebar__hint,children:s(b==="automatic"?"settings.exportBehavior.automaticDescription":"settings.exportBehavior.saveAsDialogDescription")})]})]})},Wa=({isCollapsed:s})=>{const{t:c}=R();let d={trackMouse:!0,trackKeyboard:!0,trackDrag:!0,logToConsole:!0,trackTiming:!0,showDebugBarPage:!0,showDebugBarModal:!0,logPermissions:!0,logModalStack:!0,logIssueWorkflow:!0,logToasts:!0,logFetchCalls:!0,logSSEInvalidation:!0},_=()=>{},b=()=>{},x=()=>{};try{const o=We();d=o.settings,_=o.toggleSetting,b=o.enableAll,x=o.disableAll}catch{}const y=[{key:"trackMouse",icon:'<span role="img" aria-label="mouse">🖱️</span>',labelKey:"components.sidebar.analytics.trackMouse",hintKey:"components.sidebar.analytics.trackMouseHint"},{key:"trackKeyboard",icon:'<span role="img" aria-label="keyboard">⌨️</span>',labelKey:"components.sidebar.analytics.trackKeyboard",hintKey:"components.sidebar.analytics.trackKeyboardHint"},{key:"trackDrag",icon:'<span role="img" aria-label="drag">✋</span>',labelKey:"components.sidebar.analytics.trackDrag",hintKey:"components.sidebar.analytics.trackDragHint"},{key:"trackTiming",icon:'<span role="img" aria-label="timing">⏱️</span>',labelKey:"components.sidebar.analytics.trackTiming",hintKey:"components.sidebar.analytics.trackTimingHint"}],g=[{key:"logToConsole",icon:'<span role="img" aria-label="console">📝</span>',labelKey:"components.sidebar.analytics.logToConsole",hintKey:"components.sidebar.analytics.logToConsoleHint"},{key:"showDebugBarPage",icon:'<span role="img" aria-label="debug-bar">📊</span>',labelKey:"components.sidebar.analytics.showDebugBarPage",hintKey:"components.sidebar.analytics.showDebugBarPageHint"},{key:"showDebugBarModal",icon:'<span role="img" aria-label="modal-debug">🗂️</span>',labelKey:"components.sidebar.analytics.showDebugBarModal",hintKey:"components.sidebar.analytics.showDebugBarModalHint"},{key:"logPermissions",icon:'<span role="img" aria-label="permissions">🔐</span>',labelKey:"components.sidebar.analytics.logPermissions",hintKey:"components.sidebar.analytics.logPermissionsHint"},{key:"logModalStack",icon:'<span role="img" aria-label="modal-stack">📚</span>',labelKey:"components.sidebar.analytics.logModalStack",hintKey:"components.sidebar.analytics.logModalStackHint"},{key:"logIssueWorkflow",icon:'<span role="img" aria-label="workflow">🎫</span>',labelKey:"components.sidebar.analytics.logIssueWorkflow",hintKey:"components.sidebar.analytics.logIssueWorkflowHint"},{key:"logToasts",icon:'<span role="img" aria-label="toasts">🍞</span>',labelKey:"components.sidebar.analytics.logToasts",hintKey:"components.sidebar.analytics.logToastsHint"},{key:"logFetchCalls",icon:'<span role="img" aria-label="fetch">📡</span>',labelKey:"components.sidebar.analytics.logFetchCalls",hintKey:"components.sidebar.analytics.logFetchCallsHint"},{key:"logSSEInvalidation",icon:'<span role="img" aria-label="sse">🔄</span>',labelKey:"components.sidebar.analytics.logSSEInvalidation",hintKey:"components.sidebar.analytics.logSSEInvalidationHint"}];if(s)return null;const v=o=>e.jsxs("div",{className:a.sidebar__analyticsToggle,children:[e.jsxs("div",{className:a.sidebar__analyticsToggleClickable,onClick:()=>_(o.key),role:"checkbox","aria-checked":d[o.key],tabIndex:0,onKeyDown:h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),_(o.key))},children:[e.jsx("div",{className:`${a.sidebar__analyticsCheckbox} ${d[o.key]?a["sidebar__analyticsCheckbox--checked"]:""}`,children:d[o.key]&&e.jsx("span",{className:a.sidebar__analyticsCheckmark,children:"✓"})}),e.jsxs("span",{className:a.sidebar__analyticsLabel,children:[e.jsx("span",{dangerouslySetInnerHTML:{__html:o.icon}})," ",c(o.labelKey)]})]}),e.jsx(Oe,{content:c(o.hintKey),position:"right",size:"small",maxWidth:200})]},o.key);return e.jsxs("div",{className:a.sidebar__analyticsPanel,children:[e.jsxs("div",{className:a.sidebar__analyticsSection,children:[e.jsxs("div",{className:a.sidebar__analyticsSectionTitle,children:[e.jsx("span",{role:"img","aria-label":"analytics",children:"📈"})," ",c("components.sidebar.analytics.sectionAnalytics")]}),y.map(v)]}),e.jsx("div",{className:a.sidebar__analyticsDivider}),e.jsxs("div",{className:a.sidebar__analyticsSection,children:[e.jsxs("div",{className:a.sidebar__analyticsSectionTitle,children:[e.jsx("span",{role:"img","aria-label":"debug",children:"🐛"})," ",c("components.sidebar.analytics.sectionDebug")]}),g.map(v)]}),e.jsxs("div",{className:a.sidebar__analyticsActions,children:[e.jsxs("button",{type:"button",className:`${a.sidebar__analyticsActionBtn} ${a["sidebar__analyticsActionBtn--enable"]}`,onClick:b,children:["✓ ",c("components.sidebar.analytics.enableAll")]}),e.jsxs("button",{type:"button",className:`${a.sidebar__analyticsActionBtn} ${a["sidebar__analyticsActionBtn--disable"]}`,onClick:x,children:["✗ ",c("components.sidebar.analytics.disableAll")]})]})]})},G=({items:s,activePath:c,defaultCollapsed:d=!1,collapsed:_,onCollapseChange:b,className:x,showLogo:y=!0,logoIcon:g=$e,showUploadBox:v=!1,showThemeToggle:o=!1,showLanguageToggle:h=!1,bottomContent:u,showFloatingAction:O=!1,onFloatingAction:J,resizable:i=!0,defaultWidth:l=240,minWidth:k=120,maxWidth:T=400})=>{const{t:r,language:A,setLanguage:Ae}=R(),{theme:B,toggleTheme:Be}=He(),[f,V]=p.useState(()=>{try{const t=localStorage.getItem("sidebar-active-tab");if(t&&["navigation","settings","analytics"].includes(t))return t}catch{}return"navigation"});m.useEffect(()=>{try{localStorage.setItem("sidebar-active-tab",f)}catch{}},[f]);const[U,Le]=p.useState(()=>{try{const t=localStorage.getItem("sidebar-collapsed");return t!==null?JSON.parse(t):d}catch(t){return console.error("Failed to load sidebar collapsed state:",t),d}}),[N,Ke]=p.useState(()=>{try{const t=localStorage.getItem("sidebar-width");return t!==null?parseInt(t,10):l}catch(t){return console.error("Failed to load sidebar width:",t),l}}),[I,Q]=p.useState(!1),L=m.useRef(null),n=_!==void 0?_:U,De=p.useCallback(()=>{const t=!n;_===void 0&&Le(t),b==null||b(t)},[n,_,b]),Ee=p.useCallback(t=>{var S;(S=t.onClick)==null||S.call(t)},[]),Pe=p.useCallback(()=>{try{const t=[],S=Z=>{Z.forEach(j=>{j.children&&j.children.length>0&&(t.push(j.path),S(j.children))})};S(s),localStorage.setItem("sidebar-expanded-items",JSON.stringify(t)),window.dispatchEvent(new Event("storage"))}catch(t){console.error("Failed to expand all items:",t)}},[s]),Fe=p.useCallback(()=>{try{localStorage.setItem("sidebar-expanded-items",JSON.stringify([])),window.dispatchEvent(new Event("storage"))}catch(t){console.error("Failed to collapse all items:",t)}},[]),Me=p.useCallback(t=>{!i||n||(t.preventDefault(),L.current={startX:t.clientX,startWidth:N},Q(!0))},[i,n,N]),X=p.useCallback(t=>{if(!I||!L.current)return;const S=t.clientX-L.current.startX,Z=L.current.startWidth+S,j=Math.max(k,Math.min(T,Z));Ke(j)},[I,k,T]),q=p.useCallback(()=>{Q(!1)},[]);return m.useEffect(()=>{try{localStorage.setItem("sidebar-width",N.toString())}catch(t){console.error("Failed to save sidebar width:",t)}},[N]),m.useEffect(()=>{try{localStorage.setItem("sidebar-collapsed",JSON.stringify(U))}catch(t){console.error("Failed to save sidebar collapsed state:",t)}},[U]),m.useEffect(()=>{if(I)return document.addEventListener("mousemove",X),document.addEventListener("mouseup",q),document.body.style.userSelect="none",document.body.style.cursor="ew-resize",()=>{document.removeEventListener("mousemove",X),document.removeEventListener("mouseup",q),document.body.style.userSelect="",document.body.style.cursor=""}},[I,X,q]),e.jsxs("aside",{className:`${a.sidebar} ${n?a["sidebar--collapsed"]:""} ${I?a["sidebar--resizing"]:""} ${x||""}`,"data-component":"sidebar","data-collapsed":n,style:{width:n?"24px":`${N}px`},children:[y&&e.jsx("div",{className:a.sidebar__logo,children:typeof g=="string"?e.jsx("img",{src:g,alt:"Logo",className:a.sidebar__logoImage}):g}),e.jsx("button",{className:a.sidebar__toggle,onClick:De,type:"button","aria-label":r(n?"components.sidebar.expand":"components.sidebar.collapse"),title:r(n?"components.sidebar.expand":"components.sidebar.collapse"),children:e.jsx("span",{className:a.sidebar__toggleIcon,children:n?"▶":"◀"})}),e.jsxs("div",{className:a.sidebar__tabs,children:[e.jsxs("button",{type:"button",className:`${a.sidebar__tabButton} ${f==="navigation"?a["sidebar__tabButton--active"]:""}`,onClick:()=>V("navigation"),title:r("components.sidebar.tabs.navigation"),children:[e.jsx("span",{className:a.sidebar__tabIcon,role:"img","aria-label":"navigation",children:"📁"}),!n&&r("components.sidebar.tabs.nav")]}),e.jsxs("button",{type:"button",className:`${a.sidebar__tabButton} ${f==="settings"?a["sidebar__tabButton--active"]:""}`,onClick:()=>V("settings"),title:r("components.sidebar.tabs.settings"),children:[e.jsx("span",{className:a.sidebar__tabIcon,role:"img","aria-label":"user settings",children:"👤"}),!n&&r("components.sidebar.tabs.user")]}),e.jsxs("button",{type:"button",className:`${a.sidebar__tabButton} ${f==="analytics"?a["sidebar__tabButton--active"]:""}`,onClick:()=>V("analytics"),title:r("components.sidebar.tabs.debug"),children:[e.jsx("span",{className:a.sidebar__tabIcon,role:"img","aria-label":"debug",children:"🐛"}),!n&&r("components.sidebar.tabs.dbg")]})]}),e.jsx("div",{className:`${a.sidebar__tabContent} ${f==="navigation"?a["sidebar__tabContent--active"]:""}`,children:e.jsxs("nav",{className:a.sidebar__nav,"aria-label":r("components.sidebar.navigation"),children:[!n&&e.jsxs("div",{className:a.sidebar__expandCollapseButtons,children:[e.jsxs("button",{className:a.sidebar__expandAllButton,onClick:Pe,type:"button",title:r("components.sidebar.expandAll"),children:[e.jsx("span",{className:a.sidebar__icon,children:"▼"}),e.jsx("span",{children:r("components.sidebar.expandAll")})]}),e.jsxs("button",{className:a.sidebar__collapseAllButton,onClick:Fe,type:"button",title:r("components.sidebar.collapseAll"),children:[e.jsx("span",{className:a.sidebar__icon,children:"▲"}),e.jsx("span",{children:r("components.sidebar.collapseAll")})]})]}),e.jsx("ul",{className:a.sidebar__navList,children:s.map(t=>e.jsx(Te,{item:t,activePath:c,isCollapsed:n,onItemClick:Ee},t.path))})]})}),e.jsx("div",{className:`${a.sidebar__tabContent} ${f==="settings"?a["sidebar__tabContent--active"]:""}`,children:e.jsxs("div",{className:a.sidebar__analyticsPanel,children:[e.jsx(Re,{isCollapsed:n}),!n&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:a.sidebar__analyticsDivider}),e.jsx(za,{})]})]})}),e.jsx("div",{className:`${a.sidebar__tabContent} ${f==="analytics"?a["sidebar__tabContent--active"]:""}`,children:e.jsx(Wa,{isCollapsed:n})}),e.jsxs("div",{className:a.sidebar__bottom,children:[v&&!n&&e.jsxs("div",{className:a.sidebar__uploadBox,children:[e.jsx("div",{className:a.sidebar__uploadBoxIcon,children:"+"}),e.jsxs("div",{className:a.sidebar__uploadBoxText,children:[e.jsx("div",{children:r("components.sidebar.uploadNewImage")}),e.jsx("div",{className:a.sidebar__uploadBoxSubtext,children:r("components.sidebar.dragAndDrop")})]})]}),u&&(m.isValidElement(u)&&typeof u.type=="function"?m.cloneElement(u,{isCollapsed:n}):u),(o||h)&&e.jsxs("div",{className:a.sidebar__togglesWrapper,children:[o&&e.jsxs("button",{className:a.sidebar__themeToggle,onClick:Be,type:"button",title:r(B==="dark"?"components.sidebar.switchToLight":"components.sidebar.switchToDark"),children:[e.jsx("span",{className:a.sidebar__icon,role:"img","aria-label":B==="dark"?"sun":"moon",children:B==="dark"?"☀️":"🌙"}),!n&&e.jsx("span",{children:r(B==="dark"?"components.sidebar.lightMode":"components.sidebar.darkMode")})]}),h&&e.jsxs("button",{className:a.sidebar__themeToggle,onClick:()=>Ae(A==="sk"?"en":"sk"),type:"button",title:r("components.sidebar.changeLanguage"),children:[e.jsx("span",{className:a.sidebar__icon,role:"img","aria-label":A==="sk"?"Slovakia":"United Kingdom",children:A==="sk"?"🇸🇰":"🇬🇧"}),!n&&e.jsx("span",{children:A==="sk"?"SK":"EN"})]})]}),O&&e.jsx("button",{className:a.sidebar__floatingAction,onClick:J,type:"button",title:r("components.sidebar.newAction"),children:"+"})]}),i&&!n&&e.jsx("div",{className:a.sidebar__resizeHandle,onMouseDown:Me,title:r("components.sidebar.resizeWidth")})]})},Ga={title:"Components/Layout/Sidebar",component:G,tags:["autodocs"],argTypes:{defaultCollapsed:{control:"boolean",description:"Initial collapsed state"},showLogo:{control:"boolean",description:"Show logo at top"},showThemeToggle:{control:"boolean",description:"Show theme toggle at bottom"},showLanguageToggle:{control:"boolean",description:"Show language toggle at bottom"},showFloatingAction:{control:"boolean",description:"Show floating action button"},resizable:{control:"boolean",description:"Enable sidebar width resizing"}},parameters:{docs:{description:{component:"Modern dark sidebar with collapsible navigation, tabs (Navigation, Settings, Analytics), and floating submenu tooltips."}},layout:"fullscreen"}},w=[{path:"/",labelKey:"sidebar.dashboard",icon:"🏠",onClick:()=>console.log("Navigate to Dashboard")},{path:"/contacts",labelKey:"sidebar.contacts",icon:"👥",badge:5,onClick:()=>console.log("Navigate to Contacts")},{path:"/orders",labelKey:"sidebar.orders",icon:"📦",badge:12,onClick:()=>console.log("Navigate to Orders")},{path:"/settings",labelKey:"sidebar.settings",icon:"⚙️",onClick:()=>console.log("Navigate to Settings")}],C=[{path:"/",labelKey:"sidebar.dashboard",icon:"🏠",onClick:()=>console.log("Navigate to Dashboard")},{path:"/income",labelKey:"sidebar.income",icon:"💰",onClick:()=>console.log("Navigate to Income"),children:[{path:"/income/earnings",labelKey:"sidebar.earnings",icon:"📈",onClick:()=>console.log("Navigate to Earnings")},{path:"/income/refunds",labelKey:"sidebar.refunds",icon:"↩️",onClick:()=>console.log("Navigate to Refunds")}]},{path:"/expenses",labelKey:"sidebar.expenses",icon:"💸",onClick:()=>console.log("Navigate to Expenses"),children:[{path:"/expenses/bills",labelKey:"sidebar.bills",icon:"📄",onClick:()=>console.log("Navigate to Bills")},{path:"/expenses/payroll",labelKey:"sidebar.payroll",icon:"💵",onClick:()=>console.log("Navigate to Payroll")}]},{path:"/reports",labelKey:"sidebar.reports",icon:"📊",onClick:()=>console.log("Navigate to Reports")}],K={args:{items:w,activePath:"/",defaultCollapsed:!1,showLogo:!0,showThemeToggle:!0,showLanguageToggle:!0},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Main Content Area"}),e.jsx("p",{children:"Sidebar is expanded (240px width by default)"})]})]})]},D={args:{items:w,activePath:"/",defaultCollapsed:!0,showLogo:!0,showThemeToggle:!0,showLanguageToggle:!0},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Main Content Area"}),e.jsx("p",{children:"Sidebar is collapsed (24px width). Hover over items to see floating submenu tooltips."})]})]})]},E={args:{items:w,activePath:"/contacts",showLogo:!0,logoIcon:"🎯"},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Contacts Page"}),e.jsx("p",{children:"Active path: /contacts (highlighted in sidebar)"})]})]})]},P={args:{items:C,activePath:"/income/earnings",showLogo:!0,logoIcon:"💼"},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Earnings Page"}),e.jsx("p",{children:"Nested navigation with expandable/collapsible submenus"}),e.jsx("p",{children:"Active path: /income/earnings"})]})]})]},F={args:{items:w,activePath:"/orders",showLogo:!0},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Navigation with Badges"}),e.jsx("p",{children:"Contacts has 5 notifications, Orders has 12 notifications"})]})]})]},M={args:{items:C,activePath:"/",showLogo:!0,logoIcon:"🚀",showThemeToggle:!0,showLanguageToggle:!0,showFloatingAction:!0,onFloatingAction:()=>alert("Floating action clicked!"),resizable:!0},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Sidebar with All Features"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Logo at top"}),e.jsx("li",{children:"Nested navigation with expand/collapse"}),e.jsx("li",{children:"Theme toggle (light/dark mode)"}),e.jsx("li",{children:"Language toggle (SK/EN)"}),e.jsx("li",{children:"Floating action button"}),e.jsx("li",{children:"Resizable width (drag right edge)"}),e.jsx("li",{children:"3 tabs: Navigation, Settings, Analytics"})]})]})]})]},H={args:{items:w,activePath:"/",showLogo:!1,showThemeToggle:!1,showLanguageToggle:!1,showFloatingAction:!1},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Minimal Sidebar"}),e.jsx("p",{children:"Only navigation, no extra features"})]})]})]},z={args:{items:w,activePath:"/",showLogo:!0,resizable:!0,defaultWidth:300,minWidth:180,maxWidth:450},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"Resizable Sidebar"}),e.jsx("p",{children:"Drag the right edge to resize (180px - 450px)"}),e.jsx("p",{children:"Default width: 300px"})]})]})]},W={args:{items:C,activePath:"/",showLogo:!0,showThemeToggle:!0,showLanguageToggle:!0},decorators:[s=>e.jsxs("div",{style:{height:"600px",display:"flex"},children:[e.jsx(s,{}),e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h2",{children:"3-Tab System"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Tab 1: Navigation"})," - Main app navigation with expand/collapse controls"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tab 2: User Settings"})," - Auth role switcher, export settings"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tab 3: Analytics"})," - Debug settings, analytics toggles"]})]}),e.jsx("p",{children:"Click tabs at the top of the sidebar to switch between them."})]})]})]},$={render:()=>e.jsxs("div",{style:{display:"flex",gap:"40px"},children:[e.jsxs("div",{style:{height:"600px",display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("h3",{children:"Expanded (240px)"}),e.jsxs("div",{style:{display:"flex",flex:1},children:[e.jsx(G,{items:C,activePath:"/income/earnings",defaultCollapsed:!1,showLogo:!0,showThemeToggle:!0}),e.jsx("div",{style:{width:"200px",padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:"Content area"})]})]}),e.jsxs("div",{style:{height:"600px",display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("h3",{children:"Collapsed (24px)"}),e.jsxs("div",{style:{display:"flex",flex:1},children:[e.jsx(G,{items:C,activePath:"/income/earnings",defaultCollapsed:!0,showLogo:!0,showThemeToggle:!0}),e.jsx("div",{style:{width:"200px",padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:"Content area"})]})]})]}),parameters:{docs:{description:{story:"Side-by-side comparison of expanded vs collapsed states. Hover over collapsed sidebar to see floating submenu tooltips."}}}};var Y,ee,ae;K.parameters={...K.parameters,docs:{...(Y=K.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    items: basicNavItems,
    activePath: '/',
    defaultCollapsed: false,
    showLogo: true,
    showThemeToggle: true,
    showLanguageToggle: true
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Main Content Area</h2>\r
          <p>Sidebar is expanded (240px width by default)</p>\r
        </div>\r
      </div>]
}`,...(ae=(ee=K.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var se,te,ie;D.parameters={...D.parameters,docs:{...(se=D.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    items: basicNavItems,
    activePath: '/',
    defaultCollapsed: true,
    showLogo: true,
    showThemeToggle: true,
    showLanguageToggle: true
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Main Content Area</h2>\r
          <p>Sidebar is collapsed (24px width). Hover over items to see floating submenu tooltips.</p>\r
        </div>\r
      </div>]
}`,...(ie=(te=D.parameters)==null?void 0:te.docs)==null?void 0:ie.source}}};var ne,oe,re;E.parameters={...E.parameters,docs:{...(ne=E.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    items: basicNavItems,
    activePath: '/contacts',
    showLogo: true,
    logoIcon: '🎯'
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Contacts Page</h2>\r
          <p>Active path: /contacts (highlighted in sidebar)</p>\r
        </div>\r
      </div>]
}`,...(re=(oe=E.parameters)==null?void 0:oe.docs)==null?void 0:re.source}}};var le,de,ce;P.parameters={...P.parameters,docs:{...(le=P.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    items: nestedNavItems,
    activePath: '/income/earnings',
    showLogo: true,
    logoIcon: '💼'
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Earnings Page</h2>\r
          <p>Nested navigation with expandable/collapsible submenus</p>\r
          <p>Active path: /income/earnings</p>\r
        </div>\r
      </div>]
}`,...(ce=(de=P.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var _e,be,ge;F.parameters={...F.parameters,docs:{...(_e=F.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    items: basicNavItems,
    activePath: '/orders',
    showLogo: true
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Navigation with Badges</h2>\r
          <p>Contacts has 5 notifications, Orders has 12 notifications</p>\r
        </div>\r
      </div>]
}`,...(ge=(be=F.parameters)==null?void 0:be.docs)==null?void 0:ge.source}}};var pe,he,ue;M.parameters={...M.parameters,docs:{...(pe=M.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    items: nestedNavItems,
    activePath: '/',
    showLogo: true,
    logoIcon: '🚀',
    showThemeToggle: true,
    showLanguageToggle: true,
    showFloatingAction: true,
    onFloatingAction: () => alert('Floating action clicked!'),
    resizable: true
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Sidebar with All Features</h2>\r
          <ul>\r
            <li>Logo at top</li>\r
            <li>Nested navigation with expand/collapse</li>\r
            <li>Theme toggle (light/dark mode)</li>\r
            <li>Language toggle (SK/EN)</li>\r
            <li>Floating action button</li>\r
            <li>Resizable width (drag right edge)</li>\r
            <li>3 tabs: Navigation, Settings, Analytics</li>\r
          </ul>\r
        </div>\r
      </div>]
}`,...(ue=(he=M.parameters)==null?void 0:he.docs)==null?void 0:ue.source}}};var me,xe,ye;H.parameters={...H.parameters,docs:{...(me=H.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    items: basicNavItems,
    activePath: '/',
    showLogo: false,
    showThemeToggle: false,
    showLanguageToggle: false,
    showFloatingAction: false
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Minimal Sidebar</h2>\r
          <p>Only navigation, no extra features</p>\r
        </div>\r
      </div>]
}`,...(ye=(xe=H.parameters)==null?void 0:xe.docs)==null?void 0:ye.source}}};var ve,fe,Se;z.parameters={...z.parameters,docs:{...(ve=z.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    items: basicNavItems,
    activePath: '/',
    showLogo: true,
    resizable: true,
    defaultWidth: 300,
    minWidth: 180,
    maxWidth: 450
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>Resizable Sidebar</h2>\r
          <p>Drag the right edge to resize (180px - 450px)</p>\r
          <p>Default width: 300px</p>\r
        </div>\r
      </div>]
}`,...(Se=(fe=z.parameters)==null?void 0:fe.docs)==null?void 0:Se.source}}};var ke,je,we;W.parameters={...W.parameters,docs:{...(ke=W.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    items: nestedNavItems,
    activePath: '/',
    showLogo: true,
    showThemeToggle: true,
    showLanguageToggle: true
  },
  decorators: [Story => <div style={{
    height: '600px',
    display: 'flex'
  }}>\r
        <Story />\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h2>3-Tab System</h2>\r
          <ul>\r
            <li><strong>Tab 1: Navigation</strong> - Main app navigation with expand/collapse controls</li>\r
            <li><strong>Tab 2: User Settings</strong> - Auth role switcher, export settings</li>\r
            <li><strong>Tab 3: Analytics</strong> - Debug settings, analytics toggles</li>\r
          </ul>\r
          <p>Click tabs at the top of the sidebar to switch between them.</p>\r
        </div>\r
      </div>]
}`,...(we=(je=W.parameters)==null?void 0:je.docs)==null?void 0:we.source}}};var Ne,Ie,Ce;$.parameters={...$.parameters,docs:{...(Ne=$.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '40px'
  }}>\r
      <div style={{
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>\r
        <h3>Expanded (240px)</h3>\r
        <div style={{
        display: 'flex',
        flex: 1
      }}>\r
          <Sidebar items={nestedNavItems} activePath="/income/earnings" defaultCollapsed={false} showLogo={true} showThemeToggle={true} />\r
          <div style={{
          width: '200px',
          padding: '20px',
          background: 'var(--theme-input-background, #f5f5f5)'
        }}>\r
            Content area\r
          </div>\r
        </div>\r
      </div>\r
\r
      <div style={{
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>\r
        <h3>Collapsed (24px)</h3>\r
        <div style={{
        display: 'flex',
        flex: 1
      }}>\r
          <Sidebar items={nestedNavItems} activePath="/income/earnings" defaultCollapsed={true} showLogo={true} showThemeToggle={true} />\r
          <div style={{
          width: '200px',
          padding: '20px',
          background: 'var(--theme-input-background, #f5f5f5)'
        }}>\r
            Content area\r
          </div>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of expanded vs collapsed states. Hover over collapsed sidebar to see floating submenu tooltips.'
      }
    }
  }
}`,...(Ce=(Ie=$.parameters)==null?void 0:Ie.docs)==null?void 0:Ce.source}}};const Qa=["Expanded","Collapsed","BasicNavigation","NestedNavigation","WithBadges","WithAllFeatures","MinimalSidebar","ResizableWidth","TabSystem","ExpandedVsCollapsed"];export{E as BasicNavigation,D as Collapsed,K as Expanded,$ as ExpandedVsCollapsed,H as MinimalSidebar,P as NestedNavigation,z as ResizableWidth,W as TabSystem,M as WithAllFeatures,F as WithBadges,Qa as __namedExportsOrder,Ga as default};
