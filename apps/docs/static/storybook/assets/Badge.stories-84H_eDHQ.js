import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as be}from"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";const ve="Badge-module__badge___7KRb9",Be="Badge-module__badge__content___ZFyQk",fe="Badge-module__badge__content___ZFyQk",he="Badge-module__badge__dot___P2r0g",xe="Badge-module__badge__dot___P2r0g",Se="Badge-module__badge--small___WKy2y",ye="Badge-module__badge--medium___CXdbZ",ze="Badge-module__badge--large___4qIWz",we="Badge-module__badge--neutral___dbD6N",je="Badge-module__badge--success___8G0bF",We="Badge-module__badge--warning___a4NTB",Ne="Badge-module__badge--error___k21VG",Ie="Badge-module__badge--info___Z5XmG",r={badge:ve,badge__content:Be,badgeContent:fe,badge__dot:he,badgeDot:xe,"badge--small":"Badge-module__badge--small___WKy2y",badgeSmall:Se,"badge--medium":"Badge-module__badge--medium___CXdbZ",badgeMedium:ye,"badge--large":"Badge-module__badge--large___4qIWz",badgeLarge:ze,"badge--neutral":"Badge-module__badge--neutral___dbD6N",badgeNeutral:we,"badge--success":"Badge-module__badge--success___8G0bF",badgeSuccess:je,"badge--warning":"Badge-module__badge--warning___a4NTB",badgeWarning:We,"badge--error":"Badge-module__badge--error___k21VG",badgeError:Ne,"badge--info":"Badge-module__badge--info___Z5XmG",badgeInfo:Ie},a=be.forwardRef(({variant:ce="neutral",size:le="medium",dot:ge=!1,children:me,className:ue},pe)=>{const _e=[r.badge,r[`badge--${ce}`],r[`badge--${le}`],ue].filter(Boolean).join(" ");return e.jsxs("span",{ref:pe,className:_e,children:[ge&&e.jsx("span",{className:r.badge__dot}),e.jsx("span",{className:r.badge__content,children:me})]})});a.displayName="Badge";const De={title:"Components/Feedback/Badge",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["success","warning","error","info","neutral"],description:"Visual style variant"},size:{control:"select",options:["small","medium","large"],description:"Badge size"},dot:{control:"boolean",description:"Show colored dot indicator"}},parameters:{docs:{description:{component:"Badge component for status indicators and labels with multiple variants and sizes."}}}},s={args:{variant:"success",children:"Success"}},n={args:{variant:"warning",children:"Warning"}},d={args:{variant:"error",children:"Error"}},o={args:{variant:"info",children:"Info"}},t={args:{variant:"neutral",children:"Neutral"}},i={args:{variant:"success",size:"small",children:"Small"}},c={args:{variant:"success",size:"medium",children:"Medium"}},l={args:{variant:"success",size:"large",children:"Large"}},g={args:{variant:"success",dot:!0,children:"Online"}},m={args:{variant:"error",dot:!0,children:"Offline"}},u={args:{variant:"warning",dot:!0,children:"Pending"}},p={render:()=>e.jsxs("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[e.jsx(a,{variant:"success",dot:!0,children:"Active"}),e.jsx(a,{variant:"warning",dot:!0,children:"Pending"}),e.jsx(a,{variant:"error",dot:!0,children:"Inactive"}),e.jsx(a,{variant:"info",dot:!0,children:"Processing"})]}),parameters:{docs:{description:{story:"Common status badges with dot indicators."}}}},_={render:()=>e.jsxs("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[e.jsx(a,{variant:"error",size:"small",children:"3"}),e.jsx(a,{variant:"warning",size:"small",children:"12"}),e.jsx(a,{variant:"info",size:"small",children:"99+"}),e.jsx(a,{variant:"success",size:"small",children:"New"})]}),parameters:{docs:{description:{story:"Count badges for notifications."}}}},b={render:()=>e.jsxs("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[e.jsx(a,{variant:"success",children:"Success"}),e.jsx(a,{variant:"warning",children:"Warning"}),e.jsx(a,{variant:"error",children:"Error"}),e.jsx(a,{variant:"info",children:"Info"}),e.jsx(a,{variant:"neutral",children:"Neutral"})]}),parameters:{docs:{description:{story:"All available badge variants side by side."}}}},v={render:()=>e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsx(a,{variant:"info",size:"small",children:"Small"}),e.jsx(a,{variant:"info",size:"medium",children:"Medium"}),e.jsx(a,{variant:"info",size:"large",children:"Large"})]}),parameters:{docs:{description:{story:"All available badge sizes."}}}};var B,f,h;s.parameters={...s.parameters,docs:{...(B=s.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Success'
  }
}`,...(h=(f=s.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var x,S,y;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Warning'
  }
}`,...(y=(S=n.parameters)==null?void 0:S.docs)==null?void 0:y.source}}};var z,w,j;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    children: 'Error'
  }
}`,...(j=(w=d.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};var W,N,I;o.parameters={...o.parameters,docs:{...(W=o.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    children: 'Info'
  }
}`,...(I=(N=o.parameters)==null?void 0:N.docs)==null?void 0:I.source}}};var E,C,A;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: 'neutral',
    children: 'Neutral'
  }
}`,...(A=(C=t.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var D,L,M;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    size: 'small',
    children: 'Small'
  }
}`,...(M=(L=i.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var P,G,Z;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    size: 'medium',
    children: 'Medium'
  }
}`,...(Z=(G=c.parameters)==null?void 0:G.docs)==null?void 0:Z.source}}};var k,F,O;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    size: 'large',
    children: 'Large'
  }
}`,...(O=(F=l.parameters)==null?void 0:F.docs)==null?void 0:O.source}}};var R,V,X;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    dot: true,
    children: 'Online'
  }
}`,...(X=(V=g.parameters)==null?void 0:V.docs)==null?void 0:X.source}}};var K,T,q;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    dot: true,
    children: 'Offline'
  }
}`,...(q=(T=m.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var Q,$,H;u.parameters={...u.parameters,docs:{...(Q=u.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    dot: true,
    children: 'Pending'
  }
}`,...(H=($=u.parameters)==null?void 0:$.docs)==null?void 0:H.source}}};var J,U,Y;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }}>\r
      <Badge variant="success" dot>Active</Badge>\r
      <Badge variant="warning" dot>Pending</Badge>\r
      <Badge variant="error" dot>Inactive</Badge>\r
      <Badge variant="info" dot>Processing</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Common status badges with dot indicators.'
      }
    }
  }
}`,...(Y=(U=p.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var ee,ae,re;_.parameters={..._.parameters,docs:{...(ee=_.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }}>\r
      <Badge variant="error" size="small">3</Badge>\r
      <Badge variant="warning" size="small">12</Badge>\r
      <Badge variant="info" size="small">99+</Badge>\r
      <Badge variant="success" size="small">New</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Count badges for notifications.'
      }
    }
  }
}`,...(re=(ae=_.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var se,ne,de;b.parameters={...b.parameters,docs:{...(se=b.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }}>\r
      <Badge variant="success">Success</Badge>\r
      <Badge variant="warning">Warning</Badge>\r
      <Badge variant="error">Error</Badge>\r
      <Badge variant="info">Info</Badge>\r
      <Badge variant="neutral">Neutral</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants side by side.'
      }
    }
  }
}`,...(de=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:de.source}}};var oe,te,ie;v.parameters={...v.parameters,docs:{...(oe=v.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  }}>\r
      <Badge variant="info" size="small">Small</Badge>\r
      <Badge variant="info" size="medium">Medium</Badge>\r
      <Badge variant="info" size="large">Large</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available badge sizes.'
      }
    }
  }
}`,...(ie=(te=v.parameters)==null?void 0:te.docs)==null?void 0:ie.source}}};const Le=["Success","Warning","Error","Info","Neutral","SizeSmall","SizeMedium","SizeLarge","WithDot","WithDotError","WithDotWarning","StatusBadges","CountBadges","AllVariants","AllSizes"];export{v as AllSizes,b as AllVariants,_ as CountBadges,d as Error,o as Info,t as Neutral,l as SizeLarge,c as SizeMedium,i as SizeSmall,p as StatusBadges,s as Success,n as Warning,g as WithDot,m as WithDotError,u as WithDotWarning,Le as __namedExportsOrder,De as default};
