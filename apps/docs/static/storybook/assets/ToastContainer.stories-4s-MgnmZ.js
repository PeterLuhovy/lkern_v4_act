import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{e as J}from"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import{T as V}from"./Toast-BbuaT0Ou.js";import{B as r}from"./Button-gnwGUMlA.js";import{u as T}from"./useToast-CWKozLYC.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const Y="ToastContainer-module__toastContainer___Ns0m2",$="ToastContainer-module__toastContainer--top-left___guaST",z="ToastContainer-module__toastContainer--top-center___fJvsO",K="ToastContainer-module__toastContainer--top-right___SDfDV",Q="ToastContainer-module__toastContainer--bottom-left___1e4ql",U="ToastContainer-module__toastContainer--bottom-center___tbGCY",X="ToastContainer-module__toastContainer--bottom-right___s48fw",f={toastContainer:Y,"toastContainer--top-left":"ToastContainer-module__toastContainer--top-left___guaST",toastContainerTopLeft:$,"toastContainer--top-center":"ToastContainer-module__toastContainer--top-center___fJvsO",toastContainerTopCenter:z,"toastContainer--top-right":"ToastContainer-module__toastContainer--top-right___SDfDV",toastContainerTopRight:K,"toastContainer--bottom-left":"ToastContainer-module__toastContainer--bottom-left___1e4ql",toastContainerBottomLeft:Q,"toastContainer--bottom-center":"ToastContainer-module__toastContainer--bottom-center___tbGCY",toastContainerBottomCenter:U,"toastContainer--bottom-right":"ToastContainer-module__toastContainer--bottom-right___s48fw",toastContainerBottomRight:X},C=({position:o="bottom-center"})=>{const{toasts:e,hideToast:_}=J(),a=e.filter(n=>(n.position||"bottom-center")===o);if(a.length===0)return null;const G=[f.toastContainer,f[`toastContainer--${o}`]].filter(Boolean).join(" ");return t.jsx("div",{className:G,"data-testid":"toast-container",children:a.map(n=>t.jsx(V,{toast:n,onClose:_},n.id))})},pt={title:"Components/Feedback/ToastContainer",component:C,tags:["autodocs"],argTypes:{position:{control:"select",options:["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"],description:"Position of the toast container"}},parameters:{docs:{description:{component:"Container for rendering toast notifications. Must be used within ToastProvider. Supports 6 different positions."}}}},s=({position:o})=>{const{showToast:e}=T();return t.jsxs("div",{style:{padding:"20px",minHeight:"400px"},children:[t.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"12px",marginBottom:"20px"},children:[t.jsx(r,{variant:"success",onClick:()=>e("Operation completed successfully!","success",{position:o}),children:"Show Success"}),t.jsx(r,{variant:"danger",onClick:()=>e("An error occurred. Please try again.","error",{position:o}),children:"Show Error"}),t.jsx(r,{variant:"secondary",onClick:()=>e("Warning: This action cannot be undone.","warning",{position:o}),children:"Show Warning"}),t.jsx(r,{variant:"secondary",onClick:()=>e("New updates are available.","info",{position:o}),children:"Show Info"}),t.jsx(r,{variant:"primary",onClick:()=>e("Copied to clipboard!","success",{copiedContent:"user@example.com",position:o}),children:"Copy Email"})]}),t.jsx(C,{position:o})]})},i={render:()=>t.jsx(s,{position:"top-left"}),parameters:{docs:{description:{story:"Toasts appear in the top-left corner."}}}},c={render:()=>t.jsx(s,{position:"top-center"}),parameters:{docs:{description:{story:"Toasts appear at the top center."}}}},p={render:()=>t.jsx(s,{position:"top-right"}),parameters:{docs:{description:{story:"Toasts appear in the top-right corner."}}}},d={render:()=>t.jsx(s,{position:"bottom-left"}),parameters:{docs:{description:{story:"Toasts appear in the bottom-left corner."}}}},m={render:()=>t.jsx(s,{position:"bottom-center"}),parameters:{docs:{description:{story:"Toasts appear at the bottom center (default position)."}}}},l={render:()=>t.jsx(s,{position:"bottom-right"}),parameters:{docs:{description:{story:"Toasts appear in the bottom-right corner."}}}},Z=()=>{const{showToast:o}=T(),e=()=>{o("First notification","info",{duration:5e3}),setTimeout(()=>o("Second notification","success",{duration:5e3}),500),setTimeout(()=>o("Third notification","warning",{duration:5e3}),1e3),setTimeout(()=>o("Fourth notification","error",{duration:5e3}),1500)};return t.jsxs("div",{style:{padding:"20px",minHeight:"400px"},children:[t.jsx(r,{variant:"primary",onClick:e,children:"Show Multiple Toasts"}),t.jsx(C,{position:"bottom-center"})]})},u={render:()=>t.jsx(Z,{}),parameters:{docs:{description:{story:"Multiple toasts stacked in the container. Toasts appear with slight delays."}}}},tt=()=>{const{showToast:o}=T(),e=()=>{setTimeout(()=>{o("Contact saved successfully!","success",{duration:3e3})},500)},_=()=>{o("Contact deleted","error",{duration:3e3})},a=()=>{o("Copied to clipboard!","success",{copiedContent:"john.doe@example.com",duration:2e3})};return t.jsxs("div",{style:{padding:"20px",minHeight:"400px"},children:[t.jsxs("div",{style:{marginBottom:"20px"},children:[t.jsx("h3",{style:{marginBottom:"12px"},children:"Contact Actions"}),t.jsxs("div",{style:{display:"flex",gap:"12px"},children:[t.jsx(r,{variant:"primary",onClick:e,children:"Save Contact"}),t.jsx(r,{variant:"danger",onClick:_,children:"Delete Contact"}),t.jsx(r,{variant:"secondary",onClick:a,children:"Copy Email"})]})]}),t.jsx(C,{position:"bottom-right"})]})},h={render:()=>t.jsx(tt,{}),parameters:{docs:{description:{story:"Real-world example with save, delete, and copy actions."}}}};var g,x,y;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <InteractiveDemo position="top-left" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the top-left corner.'
      }
    }
  }
}`,...(y=(x=i.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var b,j,v;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <InteractiveDemo position="top-center" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear at the top center.'
      }
    }
  }
}`,...(v=(j=c.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};var w,S,B;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <InteractiveDemo position="top-right" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the top-right corner.'
      }
    }
  }
}`,...(B=(S=p.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var D,R,k;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <InteractiveDemo position="bottom-left" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the bottom-left corner.'
      }
    }
  }
}`,...(k=(R=d.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var M,I,L;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <InteractiveDemo position="bottom-center" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear at the bottom center (default position).'
      }
    }
  }
}`,...(L=(I=m.parameters)==null?void 0:I.docs)==null?void 0:L.source}}};var E,W,O;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <InteractiveDemo position="bottom-right" />,
  parameters: {
    docs: {
      description: {
        story: 'Toasts appear in the bottom-right corner.'
      }
    }
  }
}`,...(O=(W=l.parameters)==null?void 0:W.docs)==null?void 0:O.source}}};var F,H,N;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <MultipleToastsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Multiple toasts stacked in the container. Toasts appear with slight delays.'
      }
    }
  }
}`,...(N=(H=u.parameters)==null?void 0:H.docs)==null?void 0:N.source}}};var P,q,A;h.parameters={...h.parameters,docs:{...(P=h.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <RealWorldDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example with save, delete, and copy actions.'
      }
    }
  }
}`,...(A=(q=h.parameters)==null?void 0:q.docs)==null?void 0:A.source}}};const dt=["TopLeft","TopCenter","TopRight","BottomLeft","BottomCenter","BottomRight","MultipleToasts","RealWorldExample"];export{m as BottomCenter,d as BottomLeft,l as BottomRight,u as MultipleToasts,h as RealWorldExample,c as TopCenter,i as TopLeft,p as TopRight,dt as __namedExportsOrder,pt as default};
