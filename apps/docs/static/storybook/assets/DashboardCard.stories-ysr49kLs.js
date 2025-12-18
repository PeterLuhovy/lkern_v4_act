import{j as u}from"./jsx-runtime-D_zvdyIk.js";import{r as s,a as qe}from"./index-BKyFwriW.js";import"./index-DcHVLjtu.js";import{C as Xe}from"./Card-Bpo4PN3V.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DQw2Bw4b.js";/**
 * @remix-run/router v1.22.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function V(){return V=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},V.apply(this,arguments)}var S;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(S||(S={}));function Qe(e){e===void 0&&(e={});let{initialEntries:t=["/"],initialIndex:r,v5Compat:n=!1}=e,a;a=t.map((c,f)=>h(c,typeof c=="string"?null:c.state,f===0?"default":void 0));let i=p(r??a.length-1),o=S.Pop,l=null;function p(c){return Math.min(Math.max(c,0),a.length-1)}function d(){return a[i]}function h(c,f,g){f===void 0&&(f=null);let C=He(a?d().pathname:"/",c,f,g);return Ye(C.pathname.charAt(0)==="/","relative pathnames are not supported in memory history: "+JSON.stringify(c)),C}function m(c){return typeof c=="string"?c:z(c)}return{get index(){return i},get action(){return o},get location(){return d()},createHref:m,createURL(c){return new URL(m(c),"http://localhost")},encodeLocation(c){let f=typeof c=="string"?T(c):c;return{pathname:f.pathname||"",search:f.search||"",hash:f.hash||""}},push(c,f){o=S.Push;let g=h(c,f);i+=1,a.splice(i,a.length,g),n&&l&&l({action:o,location:g,delta:1})},replace(c,f){o=S.Replace;let g=h(c,f);a[i]=g,n&&l&&l({action:o,location:g,delta:0})},go(c){o=S.Pop;let f=p(i+c),g=a[f];i=f,l&&l({action:o,location:g,delta:c})},listen(c){return l=c,()=>{l=null}}}}function y(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Ye(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function Ze(){return Math.random().toString(36).substr(2,8)}function He(e,t,r,n){return r===void 0&&(r=null),V({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?T(t):t,{state:r,key:t&&t.key||n||Ze()})}function z(e){let{pathname:t="/",search:r="",hash:n=""}=e;return r&&r!=="?"&&(t+=r.charAt(0)==="?"?r:"?"+r),n&&n!=="#"&&(t+=n.charAt(0)==="#"?n:"#"+n),t}function T(e){let t={};if(e){let r=e.indexOf("#");r>=0&&(t.hash=e.substr(r),e=e.substr(0,r));let n=e.indexOf("?");n>=0&&(t.search=e.substr(n),e=e.substr(0,n)),e&&(t.pathname=e)}return t}var Q;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Q||(Q={}));function Me(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let r=t.endsWith("/")?t.length-1:t.length,n=e.charAt(r);return n&&n!=="/"?null:e.slice(r)||"/"}function et(e,t){t===void 0&&(t="/");let{pathname:r,search:n="",hash:a=""}=typeof e=="string"?T(e):e;return{pathname:r?r.startsWith("/")?r:tt(r,t):t,search:nt(n),hash:at(a)}}function tt(e,t){let r=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(a=>{a===".."?r.length>1&&r.pop():a!=="."&&r.push(a)}),r.length>1?r.join("/"):"/"}function J(e,t,r,n){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(n)+"].  Please separate it out to the ")+("`to."+r+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function rt(e){return e.filter((t,r)=>r===0||t.route.path&&t.route.path.length>0)}function Ne(e,t){let r=rt(e);return t?r.map((n,a)=>a===r.length-1?n.pathname:n.pathnameBase):r.map(n=>n.pathnameBase)}function We(e,t,r,n){n===void 0&&(n=!1);let a;typeof e=="string"?a=T(e):(a=V({},e),y(!a.pathname||!a.pathname.includes("?"),J("?","pathname","search",a)),y(!a.pathname||!a.pathname.includes("#"),J("#","pathname","hash",a)),y(!a.search||!a.search.includes("#"),J("#","search","hash",a)));let i=e===""||a.pathname==="",o=i?"/":a.pathname,l;if(o==null)l=r;else{let m=t.length-1;if(!n&&o.startsWith("..")){let v=o.split("/");for(;v[0]==="..";)v.shift(),m-=1;a.pathname=v.join("/")}l=m>=0?t[m]:"/"}let p=et(a,l),d=o&&o!=="/"&&o.endsWith("/"),h=(i||o===".")&&r.endsWith("/");return!p.pathname.endsWith("/")&&(d||h)&&(p.pathname+="/"),p}const Ve=e=>e.join("/").replace(/\/\/+/g,"/"),nt=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,at=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e,Be=["post","put","patch","delete"];new Set(Be);const it=["get",...Be];new Set(it);/**
 * React Router v6.29.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function B(){return B=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},B.apply(this,arguments)}const Ae=s.createContext(null),w=s.createContext(null),$=s.createContext(null),A=s.createContext({outlet:null,matches:[],isDataRoute:!1});function ot(e,t){let{relative:r}=t===void 0?{}:t;F()||y(!1);let{basename:n,navigator:a}=s.useContext(w),{hash:i,pathname:o,search:l}=Ge(e,{relative:r}),p=o;return n!=="/"&&(p=o==="/"?n:Ve([n,o])),a.createHref({pathname:p,search:l,hash:i})}function F(){return s.useContext($)!=null}function q(){return F()||y(!1),s.useContext($).location}function Fe(e){s.useContext(w).static||s.useLayoutEffect(e)}function st(){let{isDataRoute:e}=s.useContext(A);return e?pt():ct()}function ct(){F()||y(!1);let e=s.useContext(Ae),{basename:t,future:r,navigator:n}=s.useContext(w),{matches:a}=s.useContext(A),{pathname:i}=q(),o=JSON.stringify(Ne(a,r.v7_relativeSplatPath)),l=s.useRef(!1);return Fe(()=>{l.current=!0}),s.useCallback(function(d,h){if(h===void 0&&(h={}),!l.current)return;if(typeof d=="number"){n.go(d);return}let m=We(d,JSON.parse(o),i,h.relative==="path");e==null&&t!=="/"&&(m.pathname=m.pathname==="/"?t:Ve([t,m.pathname])),(h.replace?n.replace:n.push)(m,h.state,h)},[t,n,o,i,e])}function Ge(e,t){let{relative:r}=t===void 0?{}:t,{future:n}=s.useContext(w),{matches:a}=s.useContext(A),{pathname:i}=q(),o=JSON.stringify(Ne(a,n.v7_relativeSplatPath));return s.useMemo(()=>We(e,JSON.parse(o),i,r==="path"),[e,o,i,r])}var Je=(function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e})(Je||{}),ze=(function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e})(ze||{});function lt(e){let t=s.useContext(Ae);return t||y(!1),t}function dt(e){let t=s.useContext(A);return t||y(!1),t}function ut(e){let t=dt(),r=t.matches[t.matches.length-1];return r.route.id||y(!1),r.route.id}function pt(){let{router:e}=lt(Je.UseNavigateStable),t=ut(ze.UseNavigateStable),r=s.useRef(!1);return Fe(()=>{r.current=!0}),s.useCallback(function(a,i){i===void 0&&(i={}),r.current&&(typeof a=="number"?e.navigate(a):e.navigate(a,B({fromRouteId:t},i)))},[e,t])}function ht(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}const mt="startTransition",Y=qe[mt];function G(e){let{basename:t,children:r,initialEntries:n,initialIndex:a,future:i}=e,o=s.useRef();o.current==null&&(o.current=Qe({initialEntries:n,initialIndex:a,v5Compat:!0}));let l=o.current,[p,d]=s.useState({action:l.action,location:l.location}),{v7_startTransition:h}=i||{},m=s.useCallback(v=>{h&&Y?Y(()=>d(v)):d(v)},[d,h]);return s.useLayoutEffect(()=>l.listen(m),[l,m]),s.useEffect(()=>ht(i),[i]),s.createElement(ft,{basename:t,children:r,location:p.location,navigationType:p.action,navigator:l,future:i})}function ft(e){let{basename:t="/",children:r=null,location:n,navigationType:a=S.Pop,navigator:i,static:o=!1,future:l}=e;F()&&y(!1);let p=t.replace(/^\/*/,"/"),d=s.useMemo(()=>({basename:p,navigator:i,static:o,future:B({v7_relativeSplatPath:!1},l)}),[p,l,i,o]);typeof n=="string"&&(n=T(n));let{pathname:h="/",search:m="",hash:v="",state:c=null,key:f="default"}=n,g=s.useMemo(()=>{let C=Me(h,p);return C==null?null:{location:{pathname:C,search:m,hash:v,state:c,key:f},navigationType:a}},[p,h,m,v,c,f,a]);return g==null?null:s.createElement(w.Provider,{value:d},s.createElement($.Provider,{children:r,value:g}))}new Promise(()=>{});/**
 * React Router DOM v6.29.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function K(){return K=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},K.apply(this,arguments)}function gt(e,t){if(e==null)return{};var r={},n=Object.keys(e),a,i;for(i=0;i<n.length;i++)a=n[i],!(t.indexOf(a)>=0)&&(r[a]=e[a]);return r}function vt(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function xt(e,t){return e.button===0&&(!t||t==="_self")&&!vt(e)}const yt=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],Ct="6";try{window.__reactRouterVersion=Ct}catch{}const bt=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",St=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,wt=s.forwardRef(function(t,r){let{onClick:n,relative:a,reloadDocument:i,replace:o,state:l,target:p,to:d,preventScrollReset:h,viewTransition:m}=t,v=gt(t,yt),{basename:c}=s.useContext(w),f,g=!1;if(typeof d=="string"&&St.test(d)&&(f=d,bt))try{let b=new URL(window.location.href),j=d.startsWith("//")?new URL(b.protocol+d):new URL(d),X=Me(j.pathname,c);j.origin===b.origin&&X!=null?d=X+j.search+j.hash:g=!0}catch{}let C=ot(d,{relative:a}),Ke=Rt(d,{replace:o,state:l,target:p,preventScrollReset:h,relative:a,viewTransition:m});function $e(b){n&&n(b),b.defaultPrevented||Ke(b)}return s.createElement("a",K({},v,{href:f||C,onClick:g||i?n:$e,ref:r,target:p}))});var Z;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Z||(Z={}));var H;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(H||(H={}));function Rt(e,t){let{target:r,replace:n,state:a,preventScrollReset:i,relative:o,viewTransition:l}=t===void 0?{}:t,p=st(),d=q(),h=Ge(e,{relative:o});return s.useCallback(m=>{if(xt(m,r)){m.preventDefault();let v=n!==void 0?n:z(d)===z(h);p(e,{replace:v,state:a,preventScrollReset:i,relative:o,viewTransition:l})}},[d,p,h,n,a,r,e,i,o,l])}const Tt="DashboardCard-module__cardLink___Uojnh",jt="DashboardCard-module__cardContent___uGNG8",Lt="DashboardCard-module__icon___R8yPy",Pt="DashboardCard-module__cardTitle___eniv2",_t="DashboardCard-module__cardDescription___I-zKd",R={cardLink:Tt,cardContent:jt,icon:Lt,cardTitle:Pt,cardDescription:_t},x=({path:e,icon:t,title:r,description:n,className:a})=>u.jsx(wt,{to:e,className:R.cardLink,children:u.jsxs(Xe,{variant:"elevated",className:`${R.cardContent} ${a||""}`,children:[u.jsx("div",{className:R.icon,children:t}),u.jsx("h3",{className:R.cardTitle,children:r}),u.jsx("p",{className:R.cardDescription,children:n})]})}),Mt={title:"Components/Layout/DashboardCard",component:x,tags:["autodocs"],argTypes:{path:{control:"text",description:"Navigation path (React Router link)"},title:{control:"text",description:"Card title"},description:{control:"text",description:"Card description"}},parameters:{docs:{description:{component:"Reusable dashboard navigation card with icon, title, and description. Wraps Card component with React Router Link."}}},decorators:[e=>u.jsx(G,{children:u.jsx(e,{})})]},L={args:{path:"/forms",icon:"📝",title:"Form Components",description:"Test form inputs and validation"}},P={args:{path:"/contacts",icon:"👥",title:"Contacts",description:"Manage customer contacts and relationships"}},_={args:{path:"/analytics",icon:u.jsx("div",{style:{fontSize:"48px",background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"📊"}),title:"Analytics Dashboard",description:"View reports and business insights"}},D={args:{path:"/orders",icon:"📦",title:"Orders",description:"View and manage customer orders"}},E={args:{path:"/invoices",icon:"💳",title:"Invoices",description:"Create and track invoices"}},O={args:{path:"/settings",icon:"⚙️",title:"Settings",description:"Configure system preferences"}},k={args:{path:"/reports",icon:"📈",title:"Reports",description:"Generate financial and operational reports"}},I={args:{path:"/long-title",icon:"📚",title:"Very Long Dashboard Card Title Example",description:"Testing how the card handles longer titles"}},U={args:{path:"/long-description",icon:"📝",title:"Documentation",description:"This is a much longer description to test how the dashboard card component handles text wrapping and layout when descriptions exceed the typical length."}},M={render:()=>u.jsx(G,{children:u.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:"20px",padding:"20px",background:"var(--theme-input-background, #f5f5f5)",borderRadius:"8px"},children:[u.jsx(x,{path:"/dashboard",icon:"🏠",title:"Dashboard",description:"Overview of key metrics"}),u.jsx(x,{path:"/contacts",icon:"👥",title:"Contacts",description:"Manage customer contacts"}),u.jsx(x,{path:"/orders",icon:"📦",title:"Orders",description:"View and process orders"}),u.jsx(x,{path:"/invoices",icon:"💳",title:"Invoices",description:"Create and track invoices"}),u.jsx(x,{path:"/reports",icon:"📈",title:"Reports",description:"Business analytics and insights"}),u.jsx(x,{path:"/settings",icon:"⚙️",title:"Settings",description:"System configuration"})]})}),parameters:{docs:{description:{story:"Typical dashboard layout with multiple navigation cards in a responsive grid."}}}},N={render:()=>u.jsx(G,{children:u.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"16px",maxWidth:"700px"},children:[u.jsx(x,{path:"/income",icon:"💰",title:"Income",description:"Track revenue and earnings"}),u.jsx(x,{path:"/expenses",icon:"💸",title:"Expenses",description:"Manage business expenses"}),u.jsx(x,{path:"/inventory",icon:"📦",title:"Inventory",description:"Stock management"}),u.jsx(x,{path:"/customers",icon:"👥",title:"Customers",description:"Customer database"})]})}),parameters:{docs:{description:{story:"Two-column grid layout for dashboard cards."}}}},W={render:()=>u.jsx(G,{children:u.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",maxWidth:"400px"},children:[u.jsx(x,{path:"/profile",icon:"👤",title:"My Profile",description:"View and edit your profile"}),u.jsx(x,{path:"/notifications",icon:"🔔",title:"Notifications",description:"Manage your notifications"}),u.jsx(x,{path:"/help",icon:"❓",title:"Help & Support",description:"Get help and documentation"})]})}),parameters:{docs:{description:{story:"Single column layout, suitable for sidebars or mobile views."}}}};var ee,te,re;L.parameters={...L.parameters,docs:{...(ee=L.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    path: '/forms',
    icon: '📝',
    title: 'Form Components',
    description: 'Test form inputs and validation'
  }
}`,...(re=(te=L.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};var ne,ae,ie;P.parameters={...P.parameters,docs:{...(ne=P.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    path: '/contacts',
    icon: '👥',
    title: 'Contacts',
    description: 'Manage customer contacts and relationships'
  }
}`,...(ie=(ae=P.parameters)==null?void 0:ae.docs)==null?void 0:ie.source}}};var oe,se,ce;_.parameters={..._.parameters,docs:{...(oe=_.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    path: '/analytics',
    icon: <div style={{
      fontSize: '48px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}>\r
        📊\r
      </div>,
    title: 'Analytics Dashboard',
    description: 'View reports and business insights'
  }
}`,...(ce=(se=_.parameters)==null?void 0:se.docs)==null?void 0:ce.source}}};var le,de,ue;D.parameters={...D.parameters,docs:{...(le=D.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    path: '/orders',
    icon: '📦',
    title: 'Orders',
    description: 'View and manage customer orders'
  }
}`,...(ue=(de=D.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var pe,he,me;E.parameters={...E.parameters,docs:{...(pe=E.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    path: '/invoices',
    icon: '💳',
    title: 'Invoices',
    description: 'Create and track invoices'
  }
}`,...(me=(he=E.parameters)==null?void 0:he.docs)==null?void 0:me.source}}};var fe,ge,ve;O.parameters={...O.parameters,docs:{...(fe=O.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    path: '/settings',
    icon: '⚙️',
    title: 'Settings',
    description: 'Configure system preferences'
  }
}`,...(ve=(ge=O.parameters)==null?void 0:ge.docs)==null?void 0:ve.source}}};var xe,ye,Ce;k.parameters={...k.parameters,docs:{...(xe=k.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    path: '/reports',
    icon: '📈',
    title: 'Reports',
    description: 'Generate financial and operational reports'
  }
}`,...(Ce=(ye=k.parameters)==null?void 0:ye.docs)==null?void 0:Ce.source}}};var be,Se,we;I.parameters={...I.parameters,docs:{...(be=I.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    path: '/long-title',
    icon: '📚',
    title: 'Very Long Dashboard Card Title Example',
    description: 'Testing how the card handles longer titles'
  }
}`,...(we=(Se=I.parameters)==null?void 0:Se.docs)==null?void 0:we.source}}};var Re,Te,je;U.parameters={...U.parameters,docs:{...(Re=U.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    path: '/long-description',
    icon: '📝',
    title: 'Documentation',
    description: 'This is a much longer description to test how the dashboard card component handles text wrapping and layout when descriptions exceed the typical length.'
  }
}`,...(je=(Te=U.parameters)==null?void 0:Te.docs)==null?void 0:je.source}}};var Le,Pe,_e;M.parameters={...M.parameters,docs:{...(Le=M.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  render: () => <MemoryRouter>\r
      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)',
      borderRadius: '8px'
    }}>\r
        <DashboardCard path="/dashboard" icon="🏠" title="Dashboard" description="Overview of key metrics" />\r
        <DashboardCard path="/contacts" icon="👥" title="Contacts" description="Manage customer contacts" />\r
        <DashboardCard path="/orders" icon="📦" title="Orders" description="View and process orders" />\r
        <DashboardCard path="/invoices" icon="💳" title="Invoices" description="Create and track invoices" />\r
        <DashboardCard path="/reports" icon="📈" title="Reports" description="Business analytics and insights" />\r
        <DashboardCard path="/settings" icon="⚙️" title="Settings" description="System configuration" />\r
      </div>\r
    </MemoryRouter>,
  parameters: {
    docs: {
      description: {
        story: 'Typical dashboard layout with multiple navigation cards in a responsive grid.'
      }
    }
  }
}`,...(_e=(Pe=M.parameters)==null?void 0:Pe.docs)==null?void 0:_e.source}}};var De,Ee,Oe;N.parameters={...N.parameters,docs:{...(De=N.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <MemoryRouter>\r
      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      maxWidth: '700px'
    }}>\r
        <DashboardCard path="/income" icon="💰" title="Income" description="Track revenue and earnings" />\r
        <DashboardCard path="/expenses" icon="💸" title="Expenses" description="Manage business expenses" />\r
        <DashboardCard path="/inventory" icon="📦" title="Inventory" description="Stock management" />\r
        <DashboardCard path="/customers" icon="👥" title="Customers" description="Customer database" />\r
      </div>\r
    </MemoryRouter>,
  parameters: {
    docs: {
      description: {
        story: 'Two-column grid layout for dashboard cards.'
      }
    }
  }
}`,...(Oe=(Ee=N.parameters)==null?void 0:Ee.docs)==null?void 0:Oe.source}}};var ke,Ie,Ue;W.parameters={...W.parameters,docs:{...(ke=W.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <MemoryRouter>\r
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '400px'
    }}>\r
        <DashboardCard path="/profile" icon="👤" title="My Profile" description="View and edit your profile" />\r
        <DashboardCard path="/notifications" icon="🔔" title="Notifications" description="Manage your notifications" />\r
        <DashboardCard path="/help" icon="❓" title="Help & Support" description="Get help and documentation" />\r
      </div>\r
    </MemoryRouter>,
  parameters: {
    docs: {
      description: {
        story: 'Single column layout, suitable for sidebars or mobile views.'
      }
    }
  }
}`,...(Ue=(Ie=W.parameters)==null?void 0:Ie.docs)==null?void 0:Ue.source}}};const Nt=["Default","WithEmojiIcon","WithComplexIcon","OrdersCard","InvoicesCard","SettingsCard","ReportsCard","LongTitle","LongDescription","DashboardGrid","TwoColumnLayout","SingleColumn"];export{M as DashboardGrid,L as Default,E as InvoicesCard,U as LongDescription,I as LongTitle,D as OrdersCard,k as ReportsCard,O as SettingsCard,W as SingleColumn,N as TwoColumnLayout,_ as WithComplexIcon,P as WithEmojiIcon,Nt as __namedExportsOrder,Mt as default};
