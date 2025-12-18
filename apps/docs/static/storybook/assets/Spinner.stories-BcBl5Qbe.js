import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as de}from"./index-BKyFwriW.js";import{u as me}from"./ToastContext-ErSnUSL6.js";import"./_commonjsHelpers-CqkleIqs.js";const ue="Spinner-module__spinner___wLy-J",ge="Spinner-module__spinner__ring___s71a-",_e="Spinner-module__spinner__ring___s71a-",be="Spinner-module__spin___Xi7jh",Se="Spinner-module__spinner__label___-jNok",xe="Spinner-module__spinner__label___-jNok",fe="Spinner-module__spinner--small___edpwY",ze="Spinner-module__spinner--medium___HgcNc",ye="Spinner-module__spinner--large___jc21V",s={spinner:ue,spinner__ring:ge,spinnerRing:_e,spin:be,spinner__label:Se,spinnerLabel:xe,"spinner--small":"Spinner-module__spinner--small___edpwY",spinnerSmall:fe,"spinner--medium":"Spinner-module__spinner--medium___HgcNc",spinnerMedium:ze,"spinner--large":"Spinner-module__spinner--large___jc21V",spinnerLarge:ye},r=de.forwardRef(({size:ne="medium",label:b,color:S,className:ae,"data-testid":oe},ie)=>{const{t:le}=me(),te=[s.spinner,s[`spinner--${ne}`],ae].filter(Boolean).join(" "),ce=S?{borderTopColor:S,borderRightColor:S}:void 0,pe=b||le("common.loading");return e.jsxs("div",{ref:ie,className:te,"data-testid":oe,role:"status","aria-live":"polite","aria-label":pe,children:[e.jsx("div",{className:s.spinner__ring,style:ce,"aria-hidden":"true"}),b&&e.jsx("div",{className:s.spinner__label,children:b})]})});r.displayName="Spinner";const ve={title:"Components/Feedback/Spinner",component:r,tags:["autodocs"],argTypes:{size:{control:"select",options:["small","medium","large"],description:"Spinner size"},label:{control:"text",description:"Optional label text below spinner"},color:{control:"color",description:"Custom color for the spinner"}},parameters:{docs:{description:{component:"Spinner component for loading states with customizable size and color."}}}},n={args:{size:"small"}},a={args:{size:"medium"}},o={args:{size:"large"}},i={args:{size:"medium",label:"Loading..."}},l={args:{size:"large",label:"Processing your request..."}},t={args:{size:"medium",color:"#9c27b0",label:"Primary Color"}},c={args:{size:"medium",color:"#4CAF50",label:"Success Color"}},p={args:{size:"medium",color:"#f44336",label:"Error Color"}},d={render:()=>e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"300px",background:"var(--theme-input-background, #fafafa)",borderRadius:"8px"},children:e.jsx(r,{size:"large",label:"Loading page..."})}),parameters:{docs:{description:{story:"Full page loading spinner."}}}},m={render:()=>e.jsxs("button",{style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"10px 20px",background:"#9c27b0",color:"white",border:"none",borderRadius:"6px",fontSize:"14px",fontWeight:"600",cursor:"not-allowed"},disabled:!0,children:[e.jsx(r,{size:"small",color:"#ffffff"}),"Saving..."]}),parameters:{docs:{description:{story:"Inline spinner in a button."}}}},u={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(r,{size:"small"}),e.jsx("span",{children:"Loading data..."})]}),parameters:{docs:{description:{story:"Inline spinner with text."}}}},g={render:()=>e.jsxs("div",{style:{display:"flex",gap:"32px",alignItems:"center"},children:[e.jsx(r,{size:"small",label:"Small"}),e.jsx(r,{size:"medium",label:"Medium"}),e.jsx(r,{size:"large",label:"Large"})]}),parameters:{docs:{description:{story:"All available spinner sizes."}}}},_={render:()=>e.jsxs("div",{style:{display:"flex",gap:"32px",alignItems:"center"},children:[e.jsx(r,{size:"medium",color:"#9c27b0",label:"Primary"}),e.jsx(r,{size:"medium",color:"#4CAF50",label:"Success"}),e.jsx(r,{size:"medium",color:"#f44336",label:"Error"}),e.jsx(r,{size:"medium",color:"#FF9800",label:"Warning"}),e.jsx(r,{size:"medium",color:"#2196F3",label:"Info"})]}),parameters:{docs:{description:{story:"Spinners with different colors."}}}};var x,f,z;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    size: 'small'
  }
}`,...(z=(f=n.parameters)==null?void 0:f.docs)==null?void 0:z.source}}};var y,h,j;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    size: 'medium'
  }
}`,...(j=(h=a.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var C,L,v;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    size: 'large'
  }
}`,...(v=(L=o.parameters)==null?void 0:L.docs)==null?void 0:v.source}}};var I,w,F;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    size: 'medium',
    label: 'Loading...'
  }
}`,...(F=(w=i.parameters)==null?void 0:w.docs)==null?void 0:F.source}}};var R,P,k;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    size: 'large',
    label: 'Processing your request...'
  }
}`,...(k=(P=l.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};var A,E,N;t.parameters={...t.parameters,docs:{...(A=t.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    size: 'medium',
    color: '#9c27b0',
    label: 'Primary Color'
  }
}`,...(N=(E=t.parameters)==null?void 0:E.docs)==null?void 0:N.source}}};var W,M,V;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    size: 'medium',
    color: '#4CAF50',
    label: 'Success Color'
  }
}`,...(V=(M=c.parameters)==null?void 0:M.docs)==null?void 0:V.source}}};var B,T,q;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    size: 'medium',
    color: '#f44336',
    label: 'Error Color'
  }
}`,...(q=(T=p.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var H,O,Y;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    background: 'var(--theme-input-background, #fafafa)',
    borderRadius: '8px'
  }}>\r
      <Spinner size="large" label="Loading page..." />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Full page loading spinner.'
      }
    }
  }
}`,...(Y=(O=d.parameters)==null?void 0:O.docs)==null?void 0:Y.source}}};var J,X,$;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <button style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#9c27b0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed'
  }} disabled>\r
      <Spinner size="small" color="#ffffff" />\r
      Saving...\r
    </button>,
  parameters: {
    docs: {
      description: {
        story: 'Inline spinner in a button.'
      }
    }
  }
}`,...($=(X=m.parameters)==null?void 0:X.docs)==null?void 0:$.source}}};var D,G,K;u.parameters={...u.parameters,docs:{...(D=u.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>\r
      <Spinner size="small" />\r
      <span>Loading data...</span>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Inline spinner with text.'
      }
    }
  }
}`,...(K=(G=u.parameters)==null?void 0:G.docs)==null?void 0:K.source}}};var Q,U,Z;g.parameters={...g.parameters,docs:{...(Q=g.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '32px',
    alignItems: 'center'
  }}>\r
      <Spinner size="small" label="Small" />\r
      <Spinner size="medium" label="Medium" />\r
      <Spinner size="large" label="Large" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available spinner sizes.'
      }
    }
  }
}`,...(Z=(U=g.parameters)==null?void 0:U.docs)==null?void 0:Z.source}}};var ee,re,se;_.parameters={..._.parameters,docs:{...(ee=_.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '32px',
    alignItems: 'center'
  }}>\r
      <Spinner size="medium" color="#9c27b0" label="Primary" />\r
      <Spinner size="medium" color="#4CAF50" label="Success" />\r
      <Spinner size="medium" color="#f44336" label="Error" />\r
      <Spinner size="medium" color="#FF9800" label="Warning" />\r
      <Spinner size="medium" color="#2196F3" label="Info" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Spinners with different colors.'
      }
    }
  }
}`,...(se=(re=_.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};const Ie=["Small","Medium","Large","WithLabel","WithLabelLarge","CustomColorPrimary","CustomColorSuccess","CustomColorError","PageLoading","ButtonLoading","InlineLoading","AllSizes","ColorVariations"];export{g as AllSizes,m as ButtonLoading,_ as ColorVariations,p as CustomColorError,t as CustomColorPrimary,c as CustomColorSuccess,u as InlineLoading,o as Large,a as Medium,d as PageLoading,n as Small,i as WithLabel,l as WithLabelLarge,Ie as __namedExportsOrder,ve as default};
