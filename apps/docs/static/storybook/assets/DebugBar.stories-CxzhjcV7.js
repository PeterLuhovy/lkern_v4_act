import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{D as t}from"./DebugBar-C6YrkoDS.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";import"./Button-gnwGUMlA.js";import"./classNames-CN4lTu6a.js";const a=(Q={})=>({metrics:{totalTime:"00:02:15",timeSinceLastActivity:"00:00:05",clickCount:42,keyboardCount:18,...Q},trackClick:(u,g,X)=>{console.log("Click tracked:",u,g)},trackKeyboard:(u,g)=>{console.log("Keyboard tracked:",u)},reset:()=>{console.log("Analytics reset")}}),re={title:"Components/Utility/DebugBar",component:t,tags:["autodocs"],argTypes:{modalName:{control:"text",description:"Modal/Page name to display"},isDarkMode:{control:"boolean",description:"Whether dark mode is active"},show:{control:"boolean",description:"Whether to show debug bar"},contextType:{control:"select",options:["page","modal"],description:"Context type for analytics"}},parameters:{docs:{description:{component:"Debug analytics bar displaying real-time modal/page metrics including clicks, keyboard events, theme, language, and timers."}}}},o={args:{modalName:"edit-contact",isDarkMode:!1,analytics:a(),show:!0,contextType:"modal"}},r={args:{modalName:"edit-contact",isDarkMode:!0,analytics:a(),show:!0,contextType:"modal"}},s={args:{modalName:"home",isDarkMode:!1,analytics:a(),show:!0,contextType:"page"}},n={args:{modalName:"modalV3Testing",isDarkMode:!1,analytics:a(),show:!0,contextType:"modal"}},c={args:{modalName:"orders",isDarkMode:!1,analytics:a({totalTime:"00:15:42",timeSinceLastActivity:"00:00:01",clickCount:284,keyboardCount:156}),show:!0}},i={args:{modalName:"settings",isDarkMode:!1,analytics:a({totalTime:"00:00:45",timeSinceLastActivity:"00:00:30",clickCount:5,keyboardCount:2}),show:!0}},d={args:{modalName:"create-order",isDarkMode:!1,analytics:a({totalTime:"00:00:03",timeSinceLastActivity:"00:00:01",clickCount:0,keyboardCount:0}),show:!0}},l={args:{modalName:"edit-contact-with-very-long-modal-name-that-wraps",isDarkMode:!1,analytics:a(),show:!0}},m={args:{modalName:"edit-contact",isDarkMode:!1,analytics:a(),show:!1},parameters:{docs:{description:{story:"Debug bar hidden (show=false). Nothing is rendered."}}}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Light Mode"}),e.jsx(t,{modalName:"edit-contact",isDarkMode:!1,analytics:a(),show:!0})]}),e.jsxs("div",{style:{background:"#1e1e1e",padding:"16px"},children:[e.jsx("h4",{style:{marginBottom:"8px",color:"#fff"},children:"Dark Mode"}),e.jsx(t,{modalName:"edit-contact",isDarkMode:!0,analytics:a(),show:!0})]})]}),parameters:{docs:{description:{story:"Debug bar in both light and dark modes."}}}},y={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Page Context"}),e.jsx(t,{modalName:"home",isDarkMode:!1,analytics:a(),show:!0,contextType:"page"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Modal Context"}),e.jsx(t,{modalName:"edit-contact",isDarkMode:!1,analytics:a(),show:!0,contextType:"modal"})]})]}),parameters:{docs:{description:{story:"Debug bar with different context types (affects copy format)."}}}};var h,k,x;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    modalName: 'edit-contact',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'modal'
  }
}`,...(x=(k=o.parameters)==null?void 0:k.docs)==null?void 0:x.source}}};var f,M,D;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    modalName: 'edit-contact',
    isDarkMode: true,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'modal'
  }
}`,...(D=(M=r.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};var b,w,v;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    modalName: 'home',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'page'
  }
}`,...(v=(w=s.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var N,A,C;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    modalName: 'modalV3Testing',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true,
    contextType: 'modal'
  }
}`,...(C=(A=n.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};var T,S,L;c.parameters={...c.parameters,docs:{...(T=c.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    modalName: 'orders',
    isDarkMode: false,
    analytics: createMockAnalytics({
      totalTime: '00:15:42',
      timeSinceLastActivity: '00:00:01',
      clickCount: 284,
      keyboardCount: 156
    }),
    show: true
  }
}`,...(L=(S=c.parameters)==null?void 0:S.docs)==null?void 0:L.source}}};var j,B,P;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    modalName: 'settings',
    isDarkMode: false,
    analytics: createMockAnalytics({
      totalTime: '00:00:45',
      timeSinceLastActivity: '00:00:30',
      clickCount: 5,
      keyboardCount: 2
    }),
    show: true
  }
}`,...(P=(B=i.parameters)==null?void 0:B.docs)==null?void 0:P.source}}};var H,O,E;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    modalName: 'create-order',
    isDarkMode: false,
    analytics: createMockAnalytics({
      totalTime: '00:00:03',
      timeSinceLastActivity: '00:00:01',
      clickCount: 0,
      keyboardCount: 0
    }),
    show: true
  }
}`,...(E=(O=d.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var J,K,V;l.parameters={...l.parameters,docs:{...(J=l.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    modalName: 'edit-contact-with-very-long-modal-name-that-wraps',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: true
  }
}`,...(V=(K=l.parameters)==null?void 0:K.docs)==null?void 0:V.source}}};var W,_,R;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    modalName: 'edit-contact',
    isDarkMode: false,
    analytics: createMockAnalytics(),
    show: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Debug bar hidden (show=false). Nothing is rendered.'
      }
    }
  }
}`,...(R=(_=m.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};var U,q,z;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Light Mode</h4>\r
        <DebugBar modalName="edit-contact" isDarkMode={false} analytics={createMockAnalytics()} show={true} />\r
      </div>\r
      <div style={{
      background: '#1e1e1e',
      padding: '16px'
    }}>\r
        <h4 style={{
        marginBottom: '8px',
        color: '#fff'
      }}>Dark Mode</h4>\r
        <DebugBar modalName="edit-contact" isDarkMode={true} analytics={createMockAnalytics()} show={true} />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Debug bar in both light and dark modes.'
      }
    }
  }
}`,...(z=(q=p.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var F,G,I;y.parameters={...y.parameters,docs:{...(F=y.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Page Context</h4>\r
        <DebugBar modalName="home" isDarkMode={false} analytics={createMockAnalytics()} show={true} contextType="page" />\r
      </div>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Modal Context</h4>\r
        <DebugBar modalName="edit-contact" isDarkMode={false} analytics={createMockAnalytics()} show={true} contextType="modal" />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Debug bar with different context types (affects copy format).'
      }
    }
  }
}`,...(I=(G=y.parameters)==null?void 0:G.docs)==null?void 0:I.source}}};const se=["LightMode","DarkMode","PageContext","ModalContext","HighActivity","LowActivity","JustOpened","LongModalName","Hidden","LightAndDark","DifferentContextTypes"];export{r as DarkMode,y as DifferentContextTypes,m as Hidden,c as HighActivity,d as JustOpened,p as LightAndDark,o as LightMode,l as LongModalName,i as LowActivity,n as ModalContext,s as PageContext,se as __namedExportsOrder,re as default};
