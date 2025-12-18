import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as J}from"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";const K="Radio-module__radioLabel___xXS-t",M="Radio-module__disabled___Olchv",Q="Radio-module__radioInput___U1K1P",X="Radio-module__radioCustom___JTImc",q="Radio-module__error___V1lM9",H="Radio-module__labelText___ea1BQ",r={radioLabel:K,disabled:M,radioInput:Q,radioCustom:X,error:q,labelText:H},a=J.forwardRef(({label:L,error:z=!1,className:F,disabled:m,...U},V)=>e.jsxs("label",{className:`${r.radioLabel} ${z?r.error:""} ${m?r.disabled:""} ${F||""}`,children:[e.jsx("input",{ref:V,type:"radio",className:r.radioInput,disabled:m,...U}),e.jsx("span",{className:r.radioCustom}),e.jsx("span",{className:r.labelText,children:L})]}));a.displayName="Radio";const ae={title:"Components/Forms/Radio",component:a,tags:["autodocs"],argTypes:{label:{control:"text",description:"Label text displayed next to the radio button"},name:{control:"text",description:"Name attribute (groups radio buttons)"},value:{control:"text",description:"Value of the radio button"},checked:{control:"boolean",description:"Checked state"},disabled:{control:"boolean",description:"Disabled state"},error:{control:"boolean",description:"Error state (typically controlled by RadioGroup)"}},parameters:{docs:{description:{component:"A customizable radio input with label and accessibility features. Typically used within a RadioGroup component for managing selection state."}}}},o={args:{name:"option",value:"1",label:"Option 1"}},s={args:{name:"option",value:"1",label:"Option 1",checked:!0}},t={args:{name:"option",value:"1",label:"Option 1",disabled:!0}},l={args:{name:"option",value:"1",label:"Option 1",disabled:!0,checked:!0}},i={args:{name:"option",value:"1",label:"Option 1",error:!0}},n={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(a,{name:"demo1",value:"1",label:"Unchecked"}),e.jsx(a,{name:"demo2",value:"1",label:"Checked",checked:!0}),e.jsx(a,{name:"demo3",value:"1",label:"Disabled",disabled:!0}),e.jsx(a,{name:"demo4",value:"1",label:"Disabled checked",disabled:!0,checked:!0}),e.jsx(a,{name:"demo5",value:"1",label:"Error state",error:!0})]}),parameters:{docs:{description:{story:"All available radio button states."}}}},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"Choose payment method:"}),e.jsx(a,{name:"payment",value:"card",label:"Credit Card",checked:!0}),e.jsx(a,{name:"payment",value:"paypal",label:"PayPal"}),e.jsx(a,{name:"payment",value:"bank",label:"Bank Transfer"}),e.jsx(a,{name:"payment",value:"cash",label:"Cash on Delivery"})]}),parameters:{docs:{description:{story:"Example of radio buttons grouped together for single selection."}}}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"Choose shipping method:"}),e.jsx(a,{name:"shipping",value:"standard",label:"Standard (3-5 days)",checked:!0}),e.jsx(a,{name:"shipping",value:"express",label:"Express (1-2 days)"}),e.jsx(a,{name:"shipping",value:"overnight",label:"Overnight (Currently unavailable)",disabled:!0}),e.jsx(a,{name:"shipping",value:"pickup",label:"Store Pickup"})]}),parameters:{docs:{description:{story:"Radio group with a disabled option."}}}},c={render:()=>e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"Choose your subscription plan: *"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx(a,{name:"plan",value:"free",label:"Free",error:!0}),e.jsx(a,{name:"plan",value:"basic",label:"Basic - $9/month",error:!0}),e.jsx(a,{name:"plan",value:"pro",label:"Pro - $29/month",error:!0})]}),e.jsx("div",{style:{color:"var(--color-status-error)",fontSize:"14px",marginTop:"8px"},children:"⚠ Please select a subscription plan"})]}),parameters:{docs:{description:{story:"Radio group in error state (typically controlled by RadioGroup wrapper)."}}}};var u,b,h;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1'
  }
}`,...(h=(b=o.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var x,v,y;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    checked: true
  }
}`,...(y=(v=s.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var g,f,R;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    disabled: true
  }
}`,...(R=(f=t.parameters)==null?void 0:f.docs)==null?void 0:R.source}}};var k,_,j;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    disabled: true,
    checked: true
  }
}`,...(j=(_=l.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};var C,D,S;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    name: 'option',
    value: '1',
    label: 'Option 1',
    error: true
  }
}`,...(S=(D=i.parameters)==null?void 0:D.docs)==null?void 0:S.source}}};var E,O,W;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>\r
      <Radio name="demo1" value="1" label="Unchecked" />\r
      <Radio name="demo2" value="1" label="Checked" checked />\r
      <Radio name="demo3" value="1" label="Disabled" disabled />\r
      <Radio name="demo4" value="1" label="Disabled checked" disabled checked />\r
      <Radio name="demo5" value="1" label="Error state" error />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available radio button states.'
      }
    }
  }
}`,...(W=(O=n.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var B,P,T;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>\r
      <div style={{
      fontWeight: 'bold',
      marginBottom: '8px'
    }}>Choose payment method:</div>\r
      <Radio name="payment" value="card" label="Credit Card" checked />\r
      <Radio name="payment" value="paypal" label="PayPal" />\r
      <Radio name="payment" value="bank" label="Bank Transfer" />\r
      <Radio name="payment" value="cash" label="Cash on Delivery" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example of radio buttons grouped together for single selection.'
      }
    }
  }
}`,...(T=(P=d.parameters)==null?void 0:P.docs)==null?void 0:T.source}}};var G,$,w;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>\r
      <div style={{
      fontWeight: 'bold',
      marginBottom: '8px'
    }}>Choose shipping method:</div>\r
      <Radio name="shipping" value="standard" label="Standard (3-5 days)" checked />\r
      <Radio name="shipping" value="express" label="Express (1-2 days)" />\r
      <Radio name="shipping" value="overnight" label="Overnight (Currently unavailable)" disabled />\r
      <Radio name="shipping" value="pickup" label="Store Pickup" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Radio group with a disabled option.'
      }
    }
  }
}`,...(w=($=p.parameters)==null?void 0:$.docs)==null?void 0:w.source}}};var N,A,I;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div>\r
      <div style={{
      fontWeight: 'bold',
      marginBottom: '8px'
    }}>Choose your subscription plan: *</div>\r
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>\r
        <Radio name="plan" value="free" label="Free" error />\r
        <Radio name="plan" value="basic" label="Basic - $9/month" error />\r
        <Radio name="plan" value="pro" label="Pro - $29/month" error />\r
      </div>\r
      <div style={{
      color: 'var(--color-status-error)',
      fontSize: '14px',
      marginTop: '8px'
    }}>\r
        ⚠ Please select a subscription plan\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Radio group in error state (typically controlled by RadioGroup wrapper).'
      }
    }
  }
}`,...(I=(A=c.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};const re=["Default","Checked","Disabled","DisabledChecked","WithError","AllStates","RadioGroup","RadioGroupWithDisabled","RadioGroupWithError"];export{n as AllStates,s as Checked,o as Default,t as Disabled,l as DisabledChecked,d as RadioGroup,p as RadioGroupWithDisabled,c as RadioGroupWithError,i as WithError,re as __namedExportsOrder,ae as default};
