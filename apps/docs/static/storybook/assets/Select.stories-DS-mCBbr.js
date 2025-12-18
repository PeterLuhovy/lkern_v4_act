import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{S as o}from"./Select-WvzepR3_.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const K={title:"Components/Forms/Select",component:o,tags:["autodocs"],argTypes:{options:{description:"Array of select options"},placeholder:{control:"text",description:"Placeholder text (creates empty first option)"},error:{control:"text",description:"Error message to display below select"},helperText:{control:"text",description:"Helper text to display below select (when no error)"},fullWidth:{control:"boolean",description:"Make select full width of container"},disabled:{control:"boolean",description:"Disabled state"}},parameters:{docs:{description:{component:"Native select dropdown with error state, helper text, and design token integration. Supports all standard HTML select attributes."}}}},r=[{value:"sk",label:"Slovakia"},{value:"cz",label:"Czech Republic"},{value:"pl",label:"Poland"},{value:"hu",label:"Hungary"},{value:"at",label:"Austria"}],M=[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"pending",label:"Pending"},{value:"archived",label:"Archived"}],L=[{value:"1",label:"Low"},{value:"2",label:"Medium"},{value:"3",label:"High"},{value:"4",label:"Critical"}],t={args:{options:r,placeholder:"Choose country"}},s={args:{options:r,placeholder:"Choose country",helperText:"Select your country of residence"}},a={args:{options:r,placeholder:"Choose country",error:"Country is required"}},l={args:{options:M,placeholder:"Choose status",fullWidth:!0},decorators:[_=>e.jsx("div",{style:{width:"600px"},children:e.jsx(_,{})})]},n={args:{options:r,placeholder:"Choose country",disabled:!0}},i={args:{options:[{value:"sk",label:"Slovakia"},{value:"cz",label:"Czech Republic",disabled:!0},{value:"pl",label:"Poland"}],placeholder:"Choose country"}},c={args:{options:L,placeholder:"Choose priority",defaultValue:"3"}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"400px"},children:[e.jsx(o,{options:r,placeholder:"Default state"}),e.jsx(o,{options:r,placeholder:"With helper text",helperText:"Select your country"}),e.jsx(o,{options:r,placeholder:"Error state",error:"Country is required"}),e.jsx(o,{options:r,placeholder:"Disabled state",disabled:!0})]}),parameters:{docs:{description:{story:"All available select states."}}}},d={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"400px"},children:[e.jsx(o,{options:r,placeholder:"Countries",helperText:"Country selection"}),e.jsx(o,{options:M,placeholder:"Status",helperText:"Current status"}),e.jsx(o,{options:L,placeholder:"Priority",helperText:"Task priority"})]}),parameters:{docs:{description:{story:"Select components with different option sets."}}}};var u,h,m;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    options: countryOptions,
    placeholder: 'Choose country'
  }
}`,...(m=(h=t.parameters)==null?void 0:h.docs)==null?void 0:m.source}}};var y,x,b;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    options: countryOptions,
    placeholder: 'Choose country',
    helperText: 'Select your country of residence'
  }
}`,...(b=(x=s.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var v,S,g;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    options: countryOptions,
    placeholder: 'Choose country',
    error: 'Country is required'
  }
}`,...(g=(S=a.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var f,C,O;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    options: statusOptions,
    placeholder: 'Choose status',
    fullWidth: true
  },
  decorators: [Story => <div style={{
    width: '600px'
  }}>\r
        <Story />\r
      </div>]
}`,...(O=(C=l.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};var W,D,T;n.parameters={...n.parameters,docs:{...(W=n.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    options: countryOptions,
    placeholder: 'Choose country',
    disabled: true
  }
}`,...(T=(D=n.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var j,w,k;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    options: [{
      value: 'sk',
      label: 'Slovakia'
    }, {
      value: 'cz',
      label: 'Czech Republic',
      disabled: true
    }, {
      value: 'pl',
      label: 'Poland'
    }],
    placeholder: 'Choose country'
  }
}`,...(k=(w=i.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};var A,E,P;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    options: priorityOptions,
    placeholder: 'Choose priority',
    defaultValue: '3'
  }
}`,...(P=(E=c.parameters)==null?void 0:E.docs)==null?void 0:P.source}}};var z,H,q;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px'
  }}>\r
      <Select options={countryOptions} placeholder="Default state" />\r
      <Select options={countryOptions} placeholder="With helper text" helperText="Select your country" />\r
      <Select options={countryOptions} placeholder="Error state" error="Country is required" />\r
      <Select options={countryOptions} placeholder="Disabled state" disabled />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available select states.'
      }
    }
  }
}`,...(q=(H=p.parameters)==null?void 0:H.docs)==null?void 0:q.source}}};var R,V,F;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px'
  }}>\r
      <Select options={countryOptions} placeholder="Countries" helperText="Country selection" />\r
      <Select options={statusOptions} placeholder="Status" helperText="Current status" />\r
      <Select options={priorityOptions} placeholder="Priority" helperText="Task priority" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Select components with different option sets.'
      }
    }
  }
}`,...(F=(V=d.parameters)==null?void 0:V.docs)==null?void 0:F.source}}};const Q=["Default","WithHelperText","WithError","FullWidth","Disabled","WithDisabledOption","WithSelectedValue","AllStates","DifferentOptionSets"];export{p as AllStates,t as Default,d as DifferentOptionSets,n as Disabled,l as FullWidth,i as WithDisabledOption,a as WithError,s as WithHelperText,c as WithSelectedValue,Q as __namedExportsOrder,K as default};
