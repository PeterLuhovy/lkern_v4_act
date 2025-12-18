import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{T as r}from"./Textarea-CaCPejZY.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const ae={title:"Components/Forms/Textarea",component:r,tags:["autodocs"],argTypes:{rows:{control:"number",description:"Number of visible text lines"},cols:{control:"number",description:"Visible width of the textarea"},fullWidth:{control:"boolean",description:"Make textarea full width of container"},hasError:{control:"boolean",description:"Apply error styling (red border)"},isValid:{control:"boolean",description:"Apply success styling (green border)"},disabled:{control:"boolean",description:"Disabled state"},placeholder:{control:"text",description:"Placeholder text"},maxLength:{control:"number",description:"Maximum character length"}},parameters:{docs:{description:{component:"Styled multi-line text input without validation logic. For form fields with labels and validation, wrap in FormField component."}}}},a={args:{placeholder:"Enter description...",rows:4}},s={args:{placeholder:"Short comment...",rows:2}},t={args:{placeholder:"Detailed description...",rows:8}},o={args:{placeholder:"Full width textarea",rows:4,fullWidth:!0},decorators:[Q=>e.jsx("div",{style:{width:"600px"},children:e.jsx(Q,{})})]},i={args:{placeholder:"Enter description...",rows:4,hasError:!0}},l={args:{placeholder:"Enter description...",rows:4,isValid:!0,defaultValue:"This is a valid description that meets all requirements."}},d={args:{placeholder:"Disabled textarea",rows:4,disabled:!0}},n={args:{rows:4,defaultValue:`This is a pre-filled value.
It supports multiple lines.
You can edit this text.`}},c={args:{placeholder:"Enter comment (max 200 characters)...",rows:4,maxLength:200}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"500px"},children:[e.jsx(r,{placeholder:"2 rows",rows:2}),e.jsx(r,{placeholder:"4 rows (default)",rows:4}),e.jsx(r,{placeholder:"6 rows",rows:6}),e.jsx(r,{placeholder:"8 rows",rows:8})]}),parameters:{docs:{description:{story:"Textareas with different row counts."}}}},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"500px"},children:[e.jsx(r,{placeholder:"Default state",rows:3}),e.jsx(r,{placeholder:"Error state",rows:3,hasError:!0}),e.jsx(r,{placeholder:"Valid state",rows:3,isValid:!0,defaultValue:"This is a valid description."}),e.jsx(r,{placeholder:"Disabled state",rows:3,disabled:!0})]}),parameters:{docs:{description:{story:"All available textarea states."}}}},h={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",maxWidth:"600px"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"4px"},children:"Short comment"}),e.jsx(r,{placeholder:"Add a quick note...",rows:2})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"4px"},children:"Standard description"}),e.jsx(r,{placeholder:"Enter description...",rows:4})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"4px"},children:"Long content (with character limit)"}),e.jsx(r,{placeholder:"Enter detailed content (max 500 characters)...",rows:6,maxLength:500})]})]}),parameters:{docs:{description:{story:"Common use cases for textarea component."}}}};var u,x,g;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter description...',
    rows: 4
  }
}`,...(g=(x=a.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var w,f,v;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    placeholder: 'Short comment...',
    rows: 2
  }
}`,...(v=(f=s.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var y,b,S;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    placeholder: 'Detailed description...',
    rows: 8
  }
}`,...(S=(b=t.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var j,E,T;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    placeholder: 'Full width textarea',
    rows: 4,
    fullWidth: true
  },
  decorators: [Story => <div style={{
    width: '600px'
  }}>\r
        <Story />\r
      </div>]
}`,...(T=(E=o.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var W,D,V;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter description...',
    rows: 4,
    hasError: true
  }
}`,...(V=(D=i.parameters)==null?void 0:D.docs)==null?void 0:V.source}}};var L,A,F;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter description...',
    rows: 4,
    isValid: true,
    defaultValue: 'This is a valid description that meets all requirements.'
  }
}`,...(F=(A=l.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var z,B,C;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    placeholder: 'Disabled textarea',
    rows: 4,
    disabled: true
  }
}`,...(C=(B=d.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};var q,M,k;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    rows: 4,
    defaultValue: 'This is a pre-filled value.\\nIt supports multiple lines.\\nYou can edit this text.'
  }
}`,...(k=(M=n.parameters)==null?void 0:M.docs)==null?void 0:k.source}}};var I,U,Y;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter comment (max 200 characters)...',
    rows: 4,
    maxLength: 200
  }
}`,...(Y=(U=c.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var _,N,O;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '500px'
  }}>\r
      <Textarea placeholder="2 rows" rows={2} />\r
      <Textarea placeholder="4 rows (default)" rows={4} />\r
      <Textarea placeholder="6 rows" rows={6} />\r
      <Textarea placeholder="8 rows" rows={8} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Textareas with different row counts.'
      }
    }
  }
}`,...(O=(N=p.parameters)==null?void 0:N.docs)==null?void 0:O.source}}};var P,R,G;m.parameters={...m.parameters,docs:{...(P=m.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '500px'
  }}>\r
      <Textarea placeholder="Default state" rows={3} />\r
      <Textarea placeholder="Error state" rows={3} hasError />\r
      <Textarea placeholder="Valid state" rows={3} isValid defaultValue="This is a valid description." />\r
      <Textarea placeholder="Disabled state" rows={3} disabled />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available textarea states.'
      }
    }
  }
}`,...(G=(R=m.parameters)==null?void 0:R.docs)==null?void 0:G.source}}};var H,J,K;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '600px'
  }}>\r
      <div>\r
        <div style={{
        fontWeight: 'bold',
        marginBottom: '4px'
      }}>Short comment</div>\r
        <Textarea placeholder="Add a quick note..." rows={2} />\r
      </div>\r
      <div>\r
        <div style={{
        fontWeight: 'bold',
        marginBottom: '4px'
      }}>Standard description</div>\r
        <Textarea placeholder="Enter description..." rows={4} />\r
      </div>\r
      <div>\r
        <div style={{
        fontWeight: 'bold',
        marginBottom: '4px'
      }}>Long content (with character limit)</div>\r
        <Textarea placeholder="Enter detailed content (max 500 characters)..." rows={6} maxLength={500} />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Common use cases for textarea component.'
      }
    }
  }
}`,...(K=(J=h.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const se=["Default","SmallSize","LargeSize","FullWidth","WithError","Valid","Disabled","WithValue","WithMaxLength","AllSizes","AllStates","UseCases"];export{p as AllSizes,m as AllStates,a as Default,d as Disabled,o as FullWidth,t as LargeSize,s as SmallSize,h as UseCases,l as Valid,i as WithError,c as WithMaxLength,n as WithValue,se as __namedExportsOrder,ae as default};
