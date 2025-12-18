import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{I as r}from"./Input-CFoEo-oh.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const te={title:"Components/Forms/Input",component:r,tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","tel","url","search"],description:"Input type"},fullWidth:{control:"boolean",description:"Make input full width of container"},hasError:{control:"boolean",description:"Apply error styling (red border)"},isValid:{control:"boolean",description:"Apply success styling (green border)"},disabled:{control:"boolean",description:"Disabled state"},placeholder:{control:"text",description:"Placeholder text"}},parameters:{docs:{description:{component:"Simplified input component - styling only, no validation. For form fields with labels and validation, wrap in FormField component."}}}},t={args:{type:"text",placeholder:"Enter text..."}},a={args:{type:"email",placeholder:"user@example.com"}},s={args:{type:"password",placeholder:"Enter password"}},o={args:{type:"number",placeholder:"0"}},l={args:{type:"search",placeholder:"Search..."}},p={args:{type:"text",placeholder:"Enter text...",hasError:!0}},n={args:{type:"email",placeholder:"user@example.com",isValid:!0,defaultValue:"user@example.com"}},c={args:{type:"text",placeholder:"Disabled input",disabled:!0}},d={args:{type:"text",placeholder:"Full width input",fullWidth:!0},decorators:[X=>e.jsx("div",{style:{width:"600px"},children:e.jsx(X,{})})]},i={args:{type:"text",defaultValue:"Pre-filled value"}},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",maxWidth:"400px"},children:[e.jsx(r,{type:"text",placeholder:"Text input"}),e.jsx(r,{type:"email",placeholder:"Email input"}),e.jsx(r,{type:"password",placeholder:"Password input"}),e.jsx(r,{type:"number",placeholder:"Number input"}),e.jsx(r,{type:"tel",placeholder:"Phone input"}),e.jsx(r,{type:"url",placeholder:"URL input"}),e.jsx(r,{type:"search",placeholder:"Search input"})]}),parameters:{docs:{description:{story:"All available input types."}}}},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",maxWidth:"400px"},children:[e.jsx(r,{type:"text",placeholder:"Default state"}),e.jsx(r,{type:"text",placeholder:"Error state",hasError:!0}),e.jsx(r,{type:"text",placeholder:"Valid state",isValid:!0,defaultValue:"valid@example.com"}),e.jsx(r,{type:"text",placeholder:"Disabled state",disabled:!0})]}),parameters:{docs:{description:{story:"All available input states."}}}};var h,x,y;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Enter text...'
  }
}`,...(y=(x=t.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var g,b,f;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'user@example.com'
  }
}`,...(f=(b=a.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var S,E,v;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    type: 'password',
    placeholder: 'Enter password'
  }
}`,...(v=(E=s.parameters)==null?void 0:E.docs)==null?void 0:v.source}}};var w,j,V;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    type: 'number',
    placeholder: '0'
  }
}`,...(V=(j=o.parameters)==null?void 0:j.docs)==null?void 0:V.source}}};var D,I,W;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    type: 'search',
    placeholder: 'Search...'
  }
}`,...(W=(I=l.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var A,P,F;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    hasError: true
  }
}`,...(F=(P=p.parameters)==null?void 0:P.docs)==null?void 0:F.source}}};var T,N,R;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'user@example.com',
    isValid: true,
    defaultValue: 'user@example.com'
  }
}`,...(R=(N=n.parameters)==null?void 0:N.docs)==null?void 0:R.source}}};var L,U,_;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true
  }
}`,...(_=(U=c.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var k,C,M;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Full width input',
    fullWidth: true
  },
  decorators: [Story => <div style={{
    width: '600px'
  }}>\r
        <Story />\r
      </div>]
}`,...(M=(C=d.parameters)==null?void 0:C.docs)==null?void 0:M.source}}};var O,q,z;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    type: 'text',
    defaultValue: 'Pre-filled value'
  }
}`,...(z=(q=i.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var B,G,H;u.parameters={...u.parameters,docs:{...(B=u.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px'
  }}>\r
      <Input type="text" placeholder="Text input" />\r
      <Input type="email" placeholder="Email input" />\r
      <Input type="password" placeholder="Password input" />\r
      <Input type="number" placeholder="Number input" />\r
      <Input type="tel" placeholder="Phone input" />\r
      <Input type="url" placeholder="URL input" />\r
      <Input type="search" placeholder="Search input" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available input types.'
      }
    }
  }
}`,...(H=(G=u.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,Q;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px'
  }}>\r
      <Input type="text" placeholder="Default state" />\r
      <Input type="text" placeholder="Error state" hasError />\r
      <Input type="text" placeholder="Valid state" isValid defaultValue="valid@example.com" />\r
      <Input type="text" placeholder="Disabled state" disabled />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available input states.'
      }
    }
  }
}`,...(Q=(K=m.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};const ae=["Default","Email","Password","Number","Search","WithError","Valid","Disabled","FullWidth","WithValue","AllTypes","AllStates"];export{m as AllStates,u as AllTypes,t as Default,c as Disabled,a as Email,d as FullWidth,o as Number,s as Password,l as Search,n as Valid,p as WithError,i as WithValue,ae as __namedExportsOrder,te as default};
