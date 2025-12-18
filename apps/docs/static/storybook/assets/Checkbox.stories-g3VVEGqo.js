import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as t}from"./Checkbox-MVv5Yvl3.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";const M={title:"Components/Forms/Checkbox",component:t,tags:["autodocs"],argTypes:{label:{control:"text",description:"Label text displayed next to the checkbox"},error:{control:"text",description:"Error message to display (shows error state)"},helperText:{control:"text",description:"Helper text to display below the checkbox"},indeterminate:{control:"boolean",description:'Indeterminate state (for "some but not all" selections)'},checked:{control:"boolean",description:"Checked state"},disabled:{control:"boolean",description:"Disabled state"}},parameters:{docs:{description:{component:"A customizable checkbox input with label, error states, and accessibility features. Supports indeterminate state for partial selections."}}}},r={args:{label:"I agree to the terms and conditions"}},a={args:{label:"I agree to the terms and conditions",checked:!0}},s={args:{label:"I agree to the terms and conditions",disabled:!0}},o={args:{label:"I agree to the terms and conditions",disabled:!0,checked:!0}},l={args:{label:"Subscribe to newsletter",helperText:"Receive updates about new features"}},c={args:{label:"I agree to the terms and conditions",error:"You must accept the terms to continue"}},i={args:{label:"Select all items",indeterminate:!0},parameters:{docs:{description:{story:'Indeterminate state is used when some but not all items are selected (e.g., "Select All" with partial selection).'}}}},n={args:{},parameters:{docs:{description:{story:"Checkbox without label text (e.g., for table row selection)."}}}},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(t,{label:"Unchecked"}),e.jsx(t,{label:"Checked",checked:!0}),e.jsx(t,{label:"Indeterminate",indeterminate:!0}),e.jsx(t,{label:"Disabled",disabled:!0}),e.jsx(t,{label:"Disabled checked",disabled:!0,checked:!0}),e.jsx(t,{label:"With error",error:"This field is required"}),e.jsx(t,{label:"With helper text",helperText:"Optional helper information"})]}),parameters:{docs:{description:{story:"All available checkbox states."}}}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx(t,{label:"Select all",indeterminate:!0}),e.jsxs("div",{style:{marginLeft:"24px",display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx(t,{label:"Option 1",checked:!0}),e.jsx(t,{label:"Option 2"}),e.jsx(t,{label:"Option 3",checked:!0})]})]}),parameters:{docs:{description:{story:'Example of checkbox group with "Select All" in indeterminate state.'}}}};var m,b,h;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms and conditions'
  }
}`,...(h=(b=r.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var u,x,g;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms and conditions',
    checked: true
  }
}`,...(g=(x=a.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var k,f,y;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms and conditions',
    disabled: true
  }
}`,...(y=(f=s.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var C,S,w;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms and conditions',
    disabled: true,
    checked: true
  }
}`,...(w=(S=o.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var D,I,j;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: 'Subscribe to newsletter',
    helperText: 'Receive updates about new features'
  }
}`,...(j=(I=l.parameters)==null?void 0:I.docs)==null?void 0:j.source}}};var v,T,W;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    label: 'I agree to the terms and conditions',
    error: 'You must accept the terms to continue'
  }
}`,...(W=(T=c.parameters)==null?void 0:T.docs)==null?void 0:W.source}}};var A,E,O;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    label: 'Select all items',
    indeterminate: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Indeterminate state is used when some but not all items are selected (e.g., "Select All" with partial selection).'
      }
    }
  }
}`,...(O=(E=i.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};var L,H,R;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Checkbox without label text (e.g., for table row selection).'
      }
    }
  }
}`,...(R=(H=n.parameters)==null?void 0:H.docs)==null?void 0:R.source}}};var q,G,U;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>\r
      <Checkbox label="Unchecked" />\r
      <Checkbox label="Checked" checked />\r
      <Checkbox label="Indeterminate" indeterminate />\r
      <Checkbox label="Disabled" disabled />\r
      <Checkbox label="Disabled checked" disabled checked />\r
      <Checkbox label="With error" error="This field is required" />\r
      <Checkbox label="With helper text" helperText="Optional helper information" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available checkbox states.'
      }
    }
  }
}`,...(U=(G=d.parameters)==null?void 0:G.docs)==null?void 0:U.source}}};var Y,_,z;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>\r
      <Checkbox label="Select all" indeterminate />\r
      <div style={{
      marginLeft: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>\r
        <Checkbox label="Option 1" checked />\r
        <Checkbox label="Option 2" />\r
        <Checkbox label="Option 3" checked />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example of checkbox group with "Select All" in indeterminate state.'
      }
    }
  }
}`,...(z=(_=p.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};const N=["Default","Checked","Disabled","DisabledChecked","WithHelperText","WithError","Indeterminate","WithoutLabel","AllStates","GroupExample"];export{d as AllStates,a as Checked,r as Default,s as Disabled,o as DisabledChecked,p as GroupExample,i as Indeterminate,c as WithError,l as WithHelperText,n as WithoutLabel,N as __namedExportsOrder,M as default};
