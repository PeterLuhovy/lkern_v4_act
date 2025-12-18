import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{T as s}from"./Toast-BbuaT0Ou.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";const oe={title:"Components/Feedback/Toast",component:s,tags:["autodocs"],argTypes:{toast:{control:"object",description:"Toast object with type, message, and optional copiedContent"},onClose:{action:"closed",description:"Callback when toast is closed"}},parameters:{docs:{description:{component:"Toast notification component for displaying temporary messages with different types (success, error, warning, info)."}}}},o={args:{toast:{id:"1",type:"success",message:"Operation completed successfully!",duration:5e3}}},n={args:{toast:{id:"2",type:"error",message:"An error occurred. Please try again.",duration:5e3}}},t={args:{toast:{id:"3",type:"warning",message:"Warning: This action cannot be undone.",duration:5e3}}},a={args:{toast:{id:"4",type:"info",message:"New updates are available.",duration:5e3}}},r={args:{toast:{id:"5",type:"success",message:"Copied to clipboard!",copiedContent:"user@example.com",duration:3e3}},parameters:{docs:{description:{story:"Toast with copied content displayed below the main message."}}}},i={args:{toast:{id:"6",type:"success",message:"API key copied!",copiedContent:"sk_test_51234567890abcdefghijklmnopqrstuvwxyz",duration:3e3}},parameters:{docs:{description:{story:"Toast with long copied content."}}}},c={args:{toast:{id:"7",type:"success",message:"Contact saved successfully!",duration:3e3}}},d={args:{toast:{id:"8",type:"error",message:"Failed to delete contact. Please check your connection.",duration:5e3}}},p={args:{toast:{id:"9",type:"warning",message:"Please fill in all required fields before submitting.",duration:4e3}}},l={args:{toast:{id:"10",type:"info",message:"You are currently offline. Changes will sync when reconnected.",duration:6e3}}},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",width:"400px"},children:[e.jsx(s,{toast:{id:"success",type:"success",message:"Operation completed successfully!",duration:5e3}}),e.jsx(s,{toast:{id:"error",type:"error",message:"An error occurred. Please try again.",duration:5e3}}),e.jsx(s,{toast:{id:"warning",type:"warning",message:"Warning: This action cannot be undone.",duration:5e3}}),e.jsx(s,{toast:{id:"info",type:"info",message:"New updates are available.",duration:5e3}})]}),parameters:{docs:{description:{story:"All available toast types stacked."}}}},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",width:"400px"},children:[e.jsx(s,{toast:{id:"with-close",type:"success",message:"Toast with close button",duration:5e3},onClose:U=>console.log("Closed:",U)}),e.jsx(s,{toast:{id:"without-close",type:"info",message:"Toast without close button (no onClose prop)",duration:5e3}})]}),parameters:{docs:{description:{story:"Toast with and without close button (controlled by onClose prop)."}}}};var g,y,T;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '1',
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 5000
    } as ToastType
  }
}`,...(T=(y=o.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var f,w,h;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '2',
      type: 'error',
      message: 'An error occurred. Please try again.',
      duration: 5000
    } as ToastType
  }
}`,...(h=(w=n.parameters)==null?void 0:w.docs)==null?void 0:h.source}}};var b,x,C;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '3',
      type: 'warning',
      message: 'Warning: This action cannot be undone.',
      duration: 5000
    } as ToastType
  }
}`,...(C=(x=t.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var v,S,j;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '4',
      type: 'info',
      message: 'New updates are available.',
      duration: 5000
    } as ToastType
  }
}`,...(j=(S=a.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var k,W,A;r.parameters={...r.parameters,docs:{...(k=r.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '5',
      type: 'success',
      message: 'Copied to clipboard!',
      copiedContent: 'user@example.com',
      duration: 3000
    } as ToastType
  },
  parameters: {
    docs: {
      description: {
        story: 'Toast with copied content displayed below the main message.'
      }
    }
  }
}`,...(A=(W=r.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var P,D,E;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '6',
      type: 'success',
      message: 'API key copied!',
      copiedContent: 'sk_test_51234567890abcdefghijklmnopqrstuvwxyz',
      duration: 3000
    } as ToastType
  },
  parameters: {
    docs: {
      description: {
        story: 'Toast with long copied content.'
      }
    }
  }
}`,...(E=(D=i.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var I,N,_;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '7',
      type: 'success',
      message: 'Contact saved successfully!',
      duration: 3000
    } as ToastType
  }
}`,...(_=(N=c.parameters)==null?void 0:N.docs)==null?void 0:_.source}}};var F,O,q;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '8',
      type: 'error',
      message: 'Failed to delete contact. Please check your connection.',
      duration: 5000
    } as ToastType
  }
}`,...(q=(O=d.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var z,L,V;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '9',
      type: 'warning',
      message: 'Please fill in all required fields before submitting.',
      duration: 4000
    } as ToastType
  }
}`,...(V=(L=p.parameters)==null?void 0:L.docs)==null?void 0:V.source}}};var Y,R,B;l.parameters={...l.parameters,docs:{...(Y=l.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    toast: {
      id: '10',
      type: 'info',
      message: 'You are currently offline. Changes will sync when reconnected.',
      duration: 6000
    } as ToastType
  }
}`,...(B=(R=l.parameters)==null?void 0:R.docs)==null?void 0:B.source}}};var G,H,J;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '400px'
  }}>\r
      <Toast toast={{
      id: 'success',
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 5000
    } as ToastType} />\r
      <Toast toast={{
      id: 'error',
      type: 'error',
      message: 'An error occurred. Please try again.',
      duration: 5000
    } as ToastType} />\r
      <Toast toast={{
      id: 'warning',
      type: 'warning',
      message: 'Warning: This action cannot be undone.',
      duration: 5000
    } as ToastType} />\r
      <Toast toast={{
      id: 'info',
      type: 'info',
      message: 'New updates are available.',
      duration: 5000
    } as ToastType} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available toast types stacked.'
      }
    }
  }
}`,...(J=(H=u.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,M,Q;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '400px'
  }}>\r
      <Toast toast={{
      id: 'with-close',
      type: 'success',
      message: 'Toast with close button',
      duration: 5000
    } as ToastType} onClose={id => console.log('Closed:', id)} />\r
      <Toast toast={{
      id: 'without-close',
      type: 'info',
      message: 'Toast without close button (no onClose prop)',
      duration: 5000
    } as ToastType} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Toast with and without close button (controlled by onClose prop).'
      }
    }
  }
}`,...(Q=(M=m.parameters)==null?void 0:M.docs)==null?void 0:Q.source}}};const ne=["Success","Error","Warning","Info","WithCopiedContent","LongCopiedContent","SaveSuccess","DeleteError","FormValidationWarning","NetworkInfo","AllTypes","WithAndWithoutClose"];export{u as AllTypes,d as DeleteError,n as Error,p as FormValidationWarning,a as Info,i as LongCopiedContent,l as NetworkInfo,c as SaveSuccess,o as Success,t as Warning,m as WithAndWithoutClose,r as WithCopiedContent,ne as __namedExportsOrder,oe as default};
