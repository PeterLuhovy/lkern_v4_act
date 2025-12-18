import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as k}from"./index-BKyFwriW.js";import{u as it}from"./ToastContext-ErSnUSL6.js";import"./_commonjsHelpers-CqkleIqs.js";const lt="KeyboardShortcutsButton-module__button___Ax2P1",dt="KeyboardShortcutsButton-module__buttonIcon___TKvVI",ct="KeyboardShortcutsButton-module__buttonBottomRight___3X545",ut="KeyboardShortcutsButton-module__buttonBottomLeft___y7tVo",pt="KeyboardShortcutsButton-module__buttonTopRight___ADF2s",ht="KeyboardShortcutsButton-module__buttonTopLeft___41AG8",mt="KeyboardShortcutsButton-module__overlay___bdAPG",gt="KeyboardShortcutsButton-module__fadeIn___uNiRW",bt="KeyboardShortcutsButton-module__content___w-C-u",yt="KeyboardShortcutsButton-module__slideUp___-9c3k",xt="KeyboardShortcutsButton-module__header___sUisb",Bt="KeyboardShortcutsButton-module__title___tXpph",vt="KeyboardShortcutsButton-module__closeButton___T7v6i",ft="KeyboardShortcutsButton-module__body___UZKhP",St="KeyboardShortcutsButton-module__shortcuts___KoYVl",_t="KeyboardShortcutsButton-module__shortcut___-VEiO",Ct="KeyboardShortcutsButton-module__key___Tqo5p",kt="KeyboardShortcutsButton-module__description___OFfcU",Kt="KeyboardShortcutsButton-module__footer___sHQLk",Et="KeyboardShortcutsButton-module__hint___CecT1",e={button:lt,buttonIcon:dt,buttonBottomRight:ct,buttonBottomLeft:ut,buttonTopRight:pt,buttonTopLeft:ht,overlay:mt,fadeIn:gt,content:bt,slideUp:yt,header:xt,title:Bt,closeButton:vt,body:ft,shortcuts:St,shortcut:_t,key:Ct,description:kt,footer:Kt,hint:Et},Tt=16,Lt=48,jt=16,r=({position:y="bottom-right",statusBarExpanded:ot=!1,statusBarHeight:v=32,statusBarExpandedHeight:st=300,onOpen:f,onClose:S})=>{const[x,n]=k.useState(!1),{t:a}=it(),rt=[{key:"Ctrl+D",descriptionKey:"keyboardShortcuts.toggleTheme"},{key:"Ctrl+L",descriptionKey:"keyboardShortcuts.changeLanguage"},{key:"Ctrl+1",descriptionKey:"keyboardShortcuts.permissionLevel10"},{key:"Ctrl+2",descriptionKey:"keyboardShortcuts.permissionLevel20"},{key:"Ctrl+3",descriptionKey:"keyboardShortcuts.permissionLevel29"},{key:"Ctrl+4",descriptionKey:"keyboardShortcuts.permissionLevel35"},{key:"Ctrl+5",descriptionKey:"keyboardShortcuts.permissionLevel45"},{key:"Ctrl+6",descriptionKey:"keyboardShortcuts.permissionLevel59"},{key:"Ctrl+7",descriptionKey:"keyboardShortcuts.permissionLevel65"},{key:"Ctrl+8",descriptionKey:"keyboardShortcuts.permissionLevel85"},{key:"Ctrl+9",descriptionKey:"keyboardShortcuts.permissionLevel100"}],at=()=>(ot?st+v:v)+Tt+Lt+jt,_=()=>24,nt=()=>{n(!0),f&&f()},C=()=>{n(!1),S&&S()};return k.useEffect(()=>{const o=s=>{const B=s.target;B.tagName==="INPUT"||B.tagName==="TEXTAREA"||B.isContentEditable||(s.key==="?"&&!s.ctrlKey&&!s.altKey&&(s.preventDefault(),n(!0)),s.key==="Escape"&&x&&(s.preventDefault(),n(!1)))};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[x]),t.jsxs(t.Fragment,{children:[t.jsx("button",{className:`${e.button} ${e[`button${y.split("-").map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join("")}`]}`,onClick:nt,title:a("keyboardShortcuts.buttonHint"),style:{bottom:`${at()}px`,right:y.includes("right")?`${_()}px`:void 0,left:y.includes("left")?`${_()}px`:void 0,transition:"bottom 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease"},children:t.jsx("span",{className:e.buttonIcon,children:"?"})}),x&&t.jsx("div",{className:e.overlay,onClick:C,children:t.jsxs("div",{className:e.content,onClick:o=>o.stopPropagation(),children:[t.jsxs("div",{className:e.header,children:[t.jsx("h2",{className:e.title,children:a("keyboardShortcuts.title")}),t.jsx("button",{className:e.closeButton,onClick:C,"aria-label":a("common.close"),children:"×"})]}),t.jsx("div",{className:e.body,children:t.jsx("div",{className:e.shortcuts,children:rt.map((o,s)=>t.jsxs("div",{className:e.shortcut,children:[t.jsx("kbd",{className:e.key,children:o.key}),t.jsx("span",{className:e.description,children:a(o.descriptionKey)})]},s))})}),t.jsx("div",{className:e.footer,children:t.jsxs("p",{className:e.hint,children:[t.jsx("span",{role:"img","aria-hidden":"true",children:"💡"})," ",a("keyboardShortcuts.modalHint")]})})]})})]})},zt={title:"Components/Utility/KeyboardShortcutsButton",component:r,tags:["autodocs"],argTypes:{position:{control:"select",options:["top-left","top-right","bottom-left","bottom-right"],description:"Position of the floating button"},statusBarExpanded:{control:"boolean",description:"Whether StatusBar is expanded"},statusBarHeight:{control:{type:"number",min:0,max:100},description:"StatusBar collapsed height (px)"},statusBarExpandedHeight:{control:{type:"number",min:0,max:500},description:"StatusBar expanded height (px)"},onOpen:{action:"modal opened"},onClose:{action:"modal closed"}},parameters:{docs:{description:{component:'Floating button for displaying keyboard shortcuts modal. Shows available shortcuts: Ctrl+D (theme), Ctrl+L (language), Ctrl+1-9 (permission levels). Opens with "?" key, closes with Esc. Positions above ThemeCustomizer button.'}}}},i={args:{position:"bottom-right",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},l={args:{position:"bottom-left",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},d={args:{position:"top-right",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},c={args:{position:"top-left",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300}},u={args:{position:"bottom-right",statusBarExpanded:!1,statusBarHeight:32,statusBarExpandedHeight:300},parameters:{docs:{description:{story:"Floating button positioned above collapsed StatusBar, stacked vertically above ThemeCustomizer."}}}},p={args:{position:"bottom-right",statusBarExpanded:!0,statusBarHeight:32,statusBarExpandedHeight:300},parameters:{docs:{description:{story:"Floating button moves up dynamically when StatusBar expands. Maintains vertical stack above ThemeCustomizer."}}}},h={args:{position:"bottom-right",statusBarExpanded:!1,onOpen:()=>console.log("Shortcuts modal opened"),onClose:()=>console.log("Shortcuts modal closed")},parameters:{docs:{description:{story:"Open/close callbacks triggered when modal state changes. Check browser console for events."}}}},m={render:()=>t.jsxs("div",{style:{position:"relative",height:"400px",border:"2px dashed #ccc",borderRadius:"8px"},children:[t.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",textAlign:"center",color:"#999"},children:[t.jsx("p",{children:"Container (400px height)"}),t.jsx("p",{style:{fontSize:"12px"},children:'Floating "?" buttons in all 4 corners'})]}),t.jsx(r,{position:"top-left"}),t.jsx(r,{position:"top-right"}),t.jsx(r,{position:"bottom-left"}),t.jsx(r,{position:"bottom-right"})]}),parameters:{docs:{description:{story:"All four position options demonstrated simultaneously."}}}},g={args:{position:"bottom-right"},parameters:{docs:{description:{story:`
Click the "?" button or press "?" key to open shortcuts modal.

**Available Keyboard Shortcuts:**

- **Ctrl+D** - Toggle dark/light theme
- **Ctrl+L** - Change language (SK/EN)
- **Ctrl+1** - Permission Level 10 (Basic lvl1)
- **Ctrl+2** - Permission Level 20 (Basic lvl2)
- **Ctrl+3** - Permission Level 29 (Basic lvl3)
- **Ctrl+4** - Permission Level 35 (Standard lvl1)
- **Ctrl+5** - Permission Level 45 (Standard lvl2)
- **Ctrl+6** - Permission Level 59 (Standard lvl3)
- **Ctrl+7** - Permission Level 65 (Admin lvl1)
- **Ctrl+8** - Permission Level 85 (Admin lvl2)
- **Ctrl+9** - Permission Level 100 (Admin lvl3)

**Modal Controls:**
- **?** - Open shortcuts modal
- **Esc** - Close shortcuts modal
        `}}}},b={render:()=>t.jsxs("div",{style:{padding:"16px"},children:[t.jsxs("div",{style:{marginBottom:"16px",padding:"16px",background:"#f5f5f5",borderRadius:"8px"},children:[t.jsx("h4",{children:"Vertical Stacking with ThemeCustomizer"}),t.jsx("p",{children:"KeyboardShortcutsButton stacks vertically above ThemeCustomizer:"}),t.jsxs("ul",{style:{marginTop:"8px"},children:[t.jsx("li",{children:"ThemeCustomizer: StatusBar + 16px offset"}),t.jsx("li",{children:"KeyboardShortcuts: ThemeCustomizer + 48px width + 16px spacing"})]}),t.jsx("p",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Both buttons aligned to the same right position (24px from edge)"})]}),t.jsxs("div",{style:{position:"relative",height:"400px",border:"2px solid #3366cc",borderRadius:"8px",background:"#fafafa"},children:[t.jsx(r,{position:"bottom-right",statusBarExpanded:!1}),t.jsx("div",{style:{position:"absolute",bottom:"48px",right:"24px",width:"48px",height:"48px",background:"#9c27b0",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"24px"},children:"🎨"}),t.jsx("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:"32px",background:"#3366cc",color:"white",display:"flex",alignItems:"center",justifyContent:"center"},children:"StatusBar"})]})]}),parameters:{docs:{description:{story:"Visual demonstration of vertical stacking above ThemeCustomizer and StatusBar."}}}};var K,E,T;i.parameters={...i.parameters,docs:{...(K=i.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(T=(E=i.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var L,j,H;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    position: 'bottom-left',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(H=(j=l.parameters)==null?void 0:j.docs)==null?void 0:H.source}}};var P,w,R;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    position: 'top-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(R=(w=d.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var z,N,A;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    position: 'top-left',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  }
}`,...(A=(N=c.parameters)==null?void 0:N.docs)==null?void 0:A.source}}};var I,O,F;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned above collapsed StatusBar, stacked vertically above ThemeCustomizer.'
      }
    }
  }
}`,...(F=(O=u.parameters)==null?void 0:O.docs)==null?void 0:F.source}}};var U,D,W;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    statusBarExpanded: true,
    statusBarHeight: 32,
    statusBarExpandedHeight: 300
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button moves up dynamically when StatusBar expands. Maintains vertical stack above ThemeCustomizer.'
      }
    }
  }
}`,...(W=(D=p.parameters)==null?void 0:D.docs)==null?void 0:W.source}}};var M,V,$;h.parameters={...h.parameters,docs:{...(M=h.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    statusBarExpanded: false,
    onOpen: () => console.log('Shortcuts modal opened'),
    onClose: () => console.log('Shortcuts modal closed')
  },
  parameters: {
    docs: {
      description: {
        story: 'Open/close callbacks triggered when modal state changes. Check browser console for events.'
      }
    }
  }
}`,...($=(V=h.parameters)==null?void 0:V.docs)==null?void 0:$.source}}};var G,X,Z;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
      }}>Floating "?" buttons in all 4 corners</p>\r
      </div>\r
      <KeyboardShortcutsButton position="top-left" />\r
      <KeyboardShortcutsButton position="top-right" />\r
      <KeyboardShortcutsButton position="bottom-left" />\r
      <KeyboardShortcutsButton position="bottom-right" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All four position options demonstrated simultaneously.'
      }
    }
  }
}`,...(Z=(X=m.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var q,Q,Y;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Click the "?" button or press "?" key to open shortcuts modal.

**Available Keyboard Shortcuts:**

- **Ctrl+D** - Toggle dark/light theme
- **Ctrl+L** - Change language (SK/EN)
- **Ctrl+1** - Permission Level 10 (Basic lvl1)
- **Ctrl+2** - Permission Level 20 (Basic lvl2)
- **Ctrl+3** - Permission Level 29 (Basic lvl3)
- **Ctrl+4** - Permission Level 35 (Standard lvl1)
- **Ctrl+5** - Permission Level 45 (Standard lvl2)
- **Ctrl+6** - Permission Level 59 (Standard lvl3)
- **Ctrl+7** - Permission Level 65 (Admin lvl1)
- **Ctrl+8** - Permission Level 85 (Admin lvl2)
- **Ctrl+9** - Permission Level 100 (Admin lvl3)

**Modal Controls:**
- **?** - Open shortcuts modal
- **Esc** - Close shortcuts modal
        \`
      }
    }
  }
}`,...(Y=(Q=g.parameters)==null?void 0:Q.docs)==null?void 0:Y.source}}};var J,tt,et;b.parameters={...b.parameters,docs:{...(J=b.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '16px'
  }}>\r
      <div style={{
      marginBottom: '16px',
      padding: '16px',
      background: '#f5f5f5',
      borderRadius: '8px'
    }}>\r
        <h4>Vertical Stacking with ThemeCustomizer</h4>\r
        <p>KeyboardShortcutsButton stacks vertically above ThemeCustomizer:</p>\r
        <ul style={{
        marginTop: '8px'
      }}>\r
          <li>ThemeCustomizer: StatusBar + 16px offset</li>\r
          <li>KeyboardShortcuts: ThemeCustomizer + 48px width + 16px spacing</li>\r
        </ul>\r
        <p style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>\r
          Both buttons aligned to the same right position (24px from edge)\r
        </p>\r
      </div>\r
      <div style={{
      position: 'relative',
      height: '400px',
      border: '2px solid #3366cc',
      borderRadius: '8px',
      background: '#fafafa'
    }}>\r
        <KeyboardShortcutsButton position="bottom-right" statusBarExpanded={false} />\r
        <div style={{
        position: 'absolute',
        bottom: '48px',
        // StatusBar + offset
        right: '24px',
        width: '48px',
        height: '48px',
        background: '#9c27b0',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>\r
          🎨\r
        </div>\r
        <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '32px',
        background: '#3366cc',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>\r
          StatusBar\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Visual demonstration of vertical stacking above ThemeCustomizer and StatusBar.'
      }
    }
  }
}`,...(et=(tt=b.parameters)==null?void 0:tt.docs)==null?void 0:et.source}}};const Nt=["BottomRight","BottomLeft","TopRight","TopLeft","WithCollapsedStatusBar","WithExpandedStatusBar","WithCallbacks","AllPositions","ShortcutsReference","StackingBehavior"];export{m as AllPositions,l as BottomLeft,i as BottomRight,g as ShortcutsReference,b as StackingBehavior,c as TopLeft,d as TopRight,h as WithCallbacks,u as WithCollapsedStatusBar,p as WithExpandedStatusBar,Nt as __namedExportsOrder,zt as default};
