import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./index-BKyFwriW.js";import{c as lt,u as ct}from"./ToastContext-ErSnUSL6.js";import"./_commonjsHelpers-CqkleIqs.js";const pt="ThemeCustomizer-module__button___9lGrx",dt="ThemeCustomizer-module__buttonBottomRight___mDOuF",mt="ThemeCustomizer-module__buttonBottomLeft___DkaUB",ut="ThemeCustomizer-module__buttonTopRight___qGwfp",ht="ThemeCustomizer-module__buttonTopLeft___osqk1",gt="ThemeCustomizer-module__buttonIcon___ksahF",xt="ThemeCustomizer-module__overlay___nE2Fb",bt="ThemeCustomizer-module__fadeIn___VWYEg",yt="ThemeCustomizer-module__modal___pcRck",ft="ThemeCustomizer-module__slideUp___KT6hk",_t="ThemeCustomizer-module__title___ku0Fm",Ct="ThemeCustomizer-module__content___9-Kmf",Bt="ThemeCustomizer-module__checkboxLabel___uHY4t",St="ThemeCustomizer-module__selectGroup___jpb79",Tt="ThemeCustomizer-module__selectLabel___vtXXM",vt="ThemeCustomizer-module__select___kxHbj",zt="ThemeCustomizer-module__colorGroup___So7Kc",jt="ThemeCustomizer-module__colorLabel___xOTQX",kt="ThemeCustomizer-module__colorGrid___7izuY",Et="ThemeCustomizer-module__colorButton___0hR9j",Pt="ThemeCustomizer-module__colorButtonActive___ETDTe",At="ThemeCustomizer-module__actions___zNpdV",Rt="ThemeCustomizer-module__buttonReset___cZZ7k",Ht="ThemeCustomizer-module__buttonClose___B8AoR",r={button:pt,buttonBottomRight:dt,buttonBottomLeft:mt,buttonTopRight:ut,buttonTopLeft:ht,buttonIcon:gt,overlay:xt,fadeIn:bt,modal:yt,slideUp:ft,title:_t,content:Ct,checkboxLabel:Bt,selectGroup:St,selectLabel:Tt,select:vt,colorGroup:zt,colorLabel:jt,colorGrid:kt,colorButton:Et,colorButtonActive:Pt,actions:At,buttonReset:Rt,buttonClose:Ht},S={compactMode:!1,highContrast:!1,showAnimations:!0,fontSize:"medium",accentColor:"#9c27b0"},Lt=[{color:"#9c27b0",name:"L-KERN Purple"},{color:"#3366cc",name:"Blue"},{color:"#4caf50",name:"Green"},{color:"#ff9800",name:"Orange"},{color:"#e91e63",name:"Rose"},{color:"#FF69B4",name:"Pink"},{color:"#607d8b",name:"Blue Grey"}],wt={small:"14px",medium:"16px",large:"18px"},z=o=>{const e=document.documentElement;o.compactMode?(e.setAttribute("data-compact","true"),e.style.setProperty("--spacing-xs","2px"),e.style.setProperty("--spacing-sm","4px"),e.style.setProperty("--spacing-md","8px"),e.style.setProperty("--spacing-lg","12px"),e.style.setProperty("--spacing-xl","16px")):(e.removeAttribute("data-compact"),e.style.setProperty("--spacing-xs","4px"),e.style.setProperty("--spacing-sm","8px"),e.style.setProperty("--spacing-md","16px"),e.style.setProperty("--spacing-lg","24px"),e.style.setProperty("--spacing-xl","32px")),o.highContrast?(e.setAttribute("data-high-contrast","true"),e.style.setProperty("--high-contrast-text","#000000"),e.style.setProperty("--high-contrast-border","2px")):(e.removeAttribute("data-high-contrast"),e.style.removeProperty("--high-contrast-text"),e.style.removeProperty("--high-contrast-border")),o.showAnimations?(e.removeAttribute("data-reduce-motion"),e.style.setProperty("--animation-duration","0.3s"),e.style.setProperty("--transition-duration","0.2s")):(e.setAttribute("data-reduce-motion","true"),e.style.setProperty("--animation-duration","0s"),e.style.setProperty("--transition-duration","0s")),e.style.setProperty("--font-size-base",wt[o.fontSize]),e.setAttribute("data-font-size",o.fontSize),e.style.setProperty("--color-brand-primary",o.accentColor),e.style.setProperty("--color-primary",o.accentColor),e.style.setProperty("--color-accent",o.accentColor),e.style.setProperty("--theme-accent",o.accentColor),e.style.setProperty("--button-primary-from",o.accentColor),e.style.setProperty("--button-primary-to",o.accentColor),e.style.setProperty("--modal-header-gradient-start",`color-mix(in srgb, ${o.accentColor} 8%, transparent)`),e.style.setProperty("--modal-header-gradient-end",`color-mix(in srgb, ${o.accentColor} 3%, transparent)`),e.style.setProperty("--modal-header-border",`color-mix(in srgb, ${o.accentColor} 20%, var(--theme-border, #e0e0e0))`)},Nt=16,tt="l-kern-custom-settings",Gt=()=>{try{const o=localStorage.getItem(tt);if(o)return{...S,...JSON.parse(o)}}catch(o){console.warn("Failed to load custom settings:",o)}return S},Ft=o=>{try{localStorage.setItem(tt,JSON.stringify(o))}catch(e){console.warn("Failed to save custom settings:",e)}},c=({position:o="bottom-right",statusBarExpanded:e=!1,statusBarHeight:T=32,statusBarExpandedHeight:et=300})=>{const{theme:ot}=lt(),{t:i}=ct(),[st,C]=d.useState(!1),[a,v]=d.useState(Gt),l=ot==="dark",n={cardBackground:l?"#1e1e1e":"#ffffff",text:l?"#e0e0e0":"#212121",border:l?"#424242":"#e0e0e0",inputBackground:l?"#2d2d2d":"#ffffff",inputBorder:l?"#555555":"#e0e0e0",shadow:l?"0 8px 32px rgba(0,0,0,0.5)":"0 8px 32px rgba(0,0,0,0.15)"};d.useEffect(()=>{z(a)},[]),d.useEffect(()=>{Ft(a),z(a)},[a]);const rt=()=>(e?et+T:T)+Nt,p=(s,B)=>{v(it=>({...it,[s]:B}))},at=()=>{v(S)},nt=()=>{C(!1)};return t.jsxs(t.Fragment,{children:[t.jsx("button",{className:`${r.button} ${r[`button${o.split("-").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join("")}`]}`,onClick:()=>C(!0),title:i("themeCustomizer.buttonTitle"),style:{background:a.accentColor,bottom:`${rt()}px`,transition:"bottom 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease"},children:t.jsx("span",{className:r.buttonIcon,role:"img","aria-label":"palette",children:"🎨"})}),st&&t.jsx("div",{className:r.overlay,onClick:()=>C(!1),children:t.jsxs("div",{className:r.modal,onClick:s=>s.stopPropagation(),style:{background:n.cardBackground,border:`1px solid ${n.border}`,boxShadow:n.shadow},children:[t.jsxs("h3",{className:r.title,style:{color:n.text},children:[t.jsx("span",{role:"img","aria-label":"palette",children:"🎨"})," ",i("themeCustomizer.title")]}),t.jsxs("div",{className:r.content,children:[t.jsxs("label",{className:r.checkboxLabel,style:{color:n.text},children:[t.jsx("input",{type:"checkbox",checked:a.compactMode,onChange:s=>p("compactMode",s.target.checked),style:{accentColor:a.accentColor}}),t.jsxs("span",{children:[t.jsx("span",{role:"img","aria-label":"package",children:"📦"})," ",i("themeCustomizer.compactMode")]})]}),t.jsxs("label",{className:r.checkboxLabel,style:{color:n.text},children:[t.jsx("input",{type:"checkbox",checked:a.highContrast,onChange:s=>p("highContrast",s.target.checked),style:{accentColor:a.accentColor}}),t.jsxs("span",{children:[t.jsx("span",{role:"img","aria-label":"brightness",children:"🔆"})," ",i("themeCustomizer.highContrast")]})]}),t.jsxs("label",{className:r.checkboxLabel,style:{color:n.text},children:[t.jsx("input",{type:"checkbox",checked:a.showAnimations,onChange:s=>p("showAnimations",s.target.checked),style:{accentColor:a.accentColor}}),t.jsxs("span",{children:[t.jsx("span",{role:"img","aria-label":"sparkles",children:"✨"})," ",i("themeCustomizer.showAnimations")]})]}),t.jsxs("div",{className:r.selectGroup,children:[t.jsxs("label",{className:r.selectLabel,style:{color:n.text},children:[t.jsx("span",{role:"img","aria-label":"ruler",children:"📏"})," ",i("themeCustomizer.fontSize")]}),t.jsxs("select",{value:a.fontSize,onChange:s=>p("fontSize",s.target.value),className:r.select,style:{background:n.inputBackground,border:`1px solid ${n.inputBorder}`,color:n.text},children:[t.jsx("option",{value:"small",children:i("themeCustomizer.fontSizeSmall")}),t.jsx("option",{value:"medium",children:i("themeCustomizer.fontSizeMedium")}),t.jsx("option",{value:"large",children:i("themeCustomizer.fontSizeLarge")})]})]}),t.jsxs("div",{className:r.colorGroup,children:[t.jsxs("label",{className:r.colorLabel,style:{color:n.text},children:[t.jsx("span",{role:"img","aria-label":"palette",children:"🎨"})," ",i("themeCustomizer.accentColor")]}),t.jsx("div",{className:r.colorGrid,children:Lt.map(({color:s,name:B})=>t.jsx("button",{className:`${r.colorButton} ${a.accentColor===s?r.colorButtonActive:""}`,onClick:()=>p("accentColor",s),style:{background:s,border:a.accentColor===s?"3px solid white":"1px solid #ccc",boxShadow:a.accentColor===s?`0 0 0 2px ${s}`:"none"},title:B},s))})]})]}),t.jsxs("div",{className:r.actions,children:[t.jsxs("button",{className:r.buttonReset,onClick:at,style:{background:a.accentColor,color:"white"},title:i("themeCustomizer.resetTitle"),children:[t.jsx("span",{role:"img","aria-label":"refresh",children:"🔄"})," ",i("themeCustomizer.resetToDefaults")]}),t.jsx("button",{className:r.buttonClose,onClick:nt,style:{background:n.cardBackground,color:n.text,border:`2px solid ${n.border}`},title:i("common.close"),children:"✕"})]})]})})]})},$t={title:"Components/Utility/ThemeCustomizer",component:c,tags:["autodocs"],argTypes:{position:{control:"select",options:["top-left","top-right","bottom-left","bottom-right"],description:"Position of the floating button"},statusBarExpanded:{control:"boolean",description:"Whether StatusBar is expanded"},statusBarHeight:{control:{type:"number",min:0,max:100},description:"StatusBar collapsed height (px)"},statusBarExpandedHeight:{control:{type:"number",min:0,max:500},description:"StatusBar expanded height (px)"}},parameters:{docs:{description:{component:"Theme customization floating button with modal. Allows users to customize theme settings: compact mode, high contrast, animations, font size, and accent color. Settings persist in localStorage and apply via CSS variables."}}}},m={args:{position:"bottom-right",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},u={args:{position:"bottom-left",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},h={args:{position:"top-right",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},g={args:{position:"top-left",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},x={args:{position:"bottom-right",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300},parameters:{docs:{description:{story:"Floating button positioned above collapsed StatusBar (32px height)."}}}},b={args:{position:"bottom-right",statusBarExpanded:!0,statusBarHeight:32,statusBarExpandedHeight:300},parameters:{docs:{description:{story:"Floating button positioned above expanded StatusBar (332px total height). Button moves up dynamically."}}}},y={render:()=>t.jsxs("div",{style:{position:"relative",height:"400px",border:"2px dashed #ccc",borderRadius:"8px"},children:[t.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",textAlign:"center",color:"#999"},children:[t.jsx("p",{children:"Container (400px height)"}),t.jsx("p",{style:{fontSize:"12px"},children:"Floating buttons in all 4 corners"})]}),t.jsx(c,{position:"top-left"}),t.jsx(c,{position:"top-right"}),t.jsx(c,{position:"bottom-left"}),t.jsx(c,{position:"bottom-right"})]}),parameters:{docs:{description:{story:"All four position options demonstrated simultaneously."}}}},f={args:{position:"bottom-right"},parameters:{docs:{description:{story:`
Click the floating button to open settings modal with these options:

**Compact Mode** - Reduces spacing throughout the app (--spacing-* variables)

**High Contrast** - Increases text contrast and border visibility

**Show Animations** - Toggles CSS animations and transitions

**Font Size** - Adjusts base font size (Small: 14px, Medium: 16px, Large: 18px)

**Accent Color** - Changes primary brand color and button gradients
  - L-KERN Purple (default)
  - Blue
  - Green
  - Orange
  - Rose
  - Pink
  - Blue Grey

All settings persist in localStorage and apply via CSS custom properties.
        `}}}},_={render:()=>t.jsxs("div",{style:{padding:"16px"},children:[t.jsxs("div",{style:{marginBottom:"16px",padding:"16px",background:"#f5f5f5",borderRadius:"8px"},children:[t.jsx("h4",{children:"Dynamic StatusBar Positioning"}),t.jsx("p",{children:"The ThemeCustomizer adjusts its position based on StatusBar state:"}),t.jsxs("ul",{style:{marginTop:"8px"},children:[t.jsx("li",{children:"Collapsed: 32px + 16px offset = 48px from bottom"}),t.jsx("li",{children:"Expanded: 332px + 16px offset = 348px from bottom"})]}),t.jsx("p",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Transition: smooth 0.3s ease animation when StatusBar expands/collapses"})]}),t.jsxs("div",{style:{position:"relative",height:"400px",border:"2px solid #9c27b0",borderRadius:"8px",background:"#fafafa"},children:[t.jsx(c,{position:"bottom-right",statusBarExpanded:!1}),t.jsx("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:"32px",background:"#9c27b0",color:"white",display:"flex",alignItems:"center",justifyContent:"center"},children:"StatusBar (collapsed)"})]})]}),parameters:{docs:{description:{story:"Demonstrates dynamic positioning above StatusBar with visual reference."}}}};var j,k,E;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(E=(k=m.parameters)==null?void 0:k.docs)==null?void 0:E.source}}};var P,A,R;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    position: 'bottom-left',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(R=(A=u.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var H,L,w;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    position: 'top-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(w=(L=h.parameters)==null?void 0:L.docs)==null?void 0:w.source}}};var N,G,F;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    position: 'top-left',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(F=(G=g.parameters)==null?void 0:G.docs)==null?void 0:F.source}}};var O,M,I;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned above collapsed StatusBar (32px height).'
      }
    }
  }
}`,...(I=(M=x.parameters)==null?void 0:M.docs)==null?void 0:I.source}}};var D,$,U;b.parameters={...b.parameters,docs:{...(D=b.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    statusBarExpanded: true,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned above expanded StatusBar (332px total height). Button moves up dynamically.'
      }
    }
  }
}`,...(U=($=b.parameters)==null?void 0:$.docs)==null?void 0:U.source}}};var K,W,Y;y.parameters={...y.parameters,docs:{...(K=y.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <div style={{
    position: 'relative',
    height: '400px',
    border: '2px dashed #ccc',
    borderRadius: '8px'
  }}>\r
      <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      color: '#999'
    }}>\r
        <p>Container (400px height)</p>\r
        <p style={{
        fontSize: '12px'
      }}>Floating buttons in all 4 corners</p>\r
      </div>\r
      <ThemeCustomizer position="top-left" />\r
      <ThemeCustomizer position="top-right" />\r
      <ThemeCustomizer position="bottom-left" />\r
      <ThemeCustomizer position="bottom-right" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All four position options demonstrated simultaneously.'
      }
    }
  }
}`,...(Y=(W=y.parameters)==null?void 0:W.docs)==null?void 0:Y.source}}};var Z,X,q;f.parameters={...f.parameters,docs:{...(Z=f.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Click the floating button to open settings modal with these options:

**Compact Mode** - Reduces spacing throughout the app (--spacing-* variables)

**High Contrast** - Increases text contrast and border visibility

**Show Animations** - Toggles CSS animations and transitions

**Font Size** - Adjusts base font size (Small: 14px, Medium: 16px, Large: 18px)

**Accent Color** - Changes primary brand color and button gradients
  - L-KERN Purple (default)
  - Blue
  - Green
  - Orange
  - Rose
  - Pink
  - Blue Grey

All settings persist in localStorage and apply via CSS custom properties.
        \`
      }
    }
  }
}`,...(q=(X=f.parameters)==null?void 0:X.docs)==null?void 0:q.source}}};var J,V,Q;_.parameters={..._.parameters,docs:{...(J=_.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '16px'
  }}>\r
      <div style={{
      marginBottom: '16px',
      padding: '16px',
      background: '#f5f5f5',
      borderRadius: '8px'
    }}>\r
        <h4>Dynamic StatusBar Positioning</h4>\r
        <p>The ThemeCustomizer adjusts its position based on StatusBar state:</p>\r
        <ul style={{
        marginTop: '8px'
      }}>\r
          <li>Collapsed: 32px + 16px offset = 48px from bottom</li>\r
          <li>Expanded: 332px + 16px offset = 348px from bottom</li>\r
        </ul>\r
        <p style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>\r
          Transition: smooth 0.3s ease animation when StatusBar expands/collapses\r
        </p>\r
      </div>\r
      <div style={{
      position: 'relative',
      height: '400px',
      border: '2px solid #9c27b0',
      borderRadius: '8px',
      background: '#fafafa'
    }}>\r
        <ThemeCustomizer position="bottom-right" statusBarExpanded={false} />\r
        <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '32px',
        background: '#9c27b0',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>\r
          StatusBar (collapsed)\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates dynamic positioning above StatusBar with visual reference.'
      }
    }
  }
}`,...(Q=(V=_.parameters)==null?void 0:V.docs)==null?void 0:Q.source}}};const Ut=["BottomRight","BottomLeft","TopRight","TopLeft","WithCollapsedStatusBar","WithExpandedStatusBar","AllPositions","SettingsOverview","DynamicPositioning"];export{y as AllPositions,u as BottomLeft,m as BottomRight,_ as DynamicPositioning,f as SettingsOverview,g as TopLeft,h as TopRight,x as WithCollapsedStatusBar,b as WithExpandedStatusBar,Ut as __namedExportsOrder,$t as default};
