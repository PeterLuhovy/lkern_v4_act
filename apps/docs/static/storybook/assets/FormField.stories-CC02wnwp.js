import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as F}from"./index-BKyFwriW.js";import{F as a}from"./FormField-7Fj67rB9.js";import{I as r}from"./Input-CFoEo-oh.js";import{T as f}from"./Textarea-CaCPejZY.js";import{S as xe}from"./Select-WvzepR3_.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";import"./classNames-CN4lTu6a.js";import"./InfoHint-TbK9iuJy.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";const qe={title:"Components/Forms/FormField",component:a,tags:["autodocs"],argTypes:{label:{control:"text",description:"Label text to display above input"},required:{control:"boolean",description:"Show required asterisk (*) next to label"},error:{control:"text",description:"External error message (overrides internal validation)"},helperText:{control:"text",description:"Helper text to display below input (when no error)"},fullWidth:{control:"boolean",description:"Make field full width of container"},reserveMessageSpace:{control:"boolean",description:"Reserve space for validation messages (prevents layout shift)"},maxLength:{control:"number",description:"Maximum character length (shows character counter)"}},parameters:{docs:{description:{component:"Enhanced form field with built-in real-time validation. Supports both controlled and uncontrolled modes. Features include validation, character counter, helper text, and error messages."}}}},l={args:{label:"Email",children:e.jsx(r,{type:"email",placeholder:"user@example.com"})}},o={args:{label:"Email",required:!0,children:e.jsx(r,{type:"email",placeholder:"user@example.com"})}},i={args:{label:"Email",helperText:"We will never share your email",children:e.jsx(r,{type:"email",placeholder:"user@example.com"})}},c={args:{label:"Email",error:"Invalid email address",children:e.jsx(r,{type:"email",placeholder:"user@example.com"})}},d={args:{label:"Email",fullWidth:!0,children:e.jsx(r,{type:"email",placeholder:"user@example.com"})},decorators:[s=>e.jsx("div",{style:{width:"600px"},children:e.jsx(s,{})})]},n={args:{label:"Email",reserveMessageSpace:!0,children:e.jsx(r,{type:"email",placeholder:"user@example.com"})},parameters:{docs:{description:{story:"Reserved space prevents layout shift when error messages appear/disappear."}}}},p={args:{label:"Full Name",required:!0,helperText:"Enter your first and last name",children:e.jsx(r,{type:"text",placeholder:"John Doe"})}},m={args:{label:"Description",helperText:"Provide a detailed description",children:e.jsx(f,{rows:4,placeholder:"Enter description..."})}},u={args:{label:"Country",required:!0,children:e.jsx(xe,{options:[{value:"sk",label:"Slovakia"},{value:"cz",label:"Czech Republic"},{value:"pl",label:"Poland"}],placeholder:"Choose country"})}},h={args:{label:"Comment",maxLength:200,helperText:"Add a brief comment",children:e.jsx(f,{rows:4,placeholder:"Enter comment...",maxLength:200})}},x={args:{label:"Password",labelHint:"Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.",required:!0,children:e.jsx(r,{type:"password",placeholder:"Enter password"})}},g={render:()=>{const[s,S]=F.useState(!1);return e.jsx(a,{label:"Email",required:!0,validate:t=>{if(!t)return"Email is required";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))return"Invalid email format"},onValidChange:S,successMessage:"Email is valid",reserveMessageSpace:!0,children:e.jsx(r,{type:"email",placeholder:"user@example.com"})})},parameters:{docs:{description:{story:"Real-time validation with success message when valid."}}}},v={render:()=>{const[s,S]=F.useState(""),[t,w]=F.useState(!1),ge=be=>{S(be.target.value),w(!1)},ve=()=>{s!=="secret"&&w(!0)};return e.jsx(a,{label:"Keyword",error:t?'Wrong keyword (hint: try "secret")':void 0,value:s,onChange:ge,reserveMessageSpace:!0,children:e.jsx(r,{placeholder:"Type keyword",onBlur:ve})})},parameters:{docs:{description:{story:"Controlled mode where parent component manages the value state."}}}},b={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",maxWidth:"500px"},children:[e.jsx(a,{label:"Full Name",required:!0,reserveMessageSpace:!0,children:e.jsx(r,{type:"text",placeholder:"John Doe"})}),e.jsx(a,{label:"Email",required:!0,helperText:"We will never share your email",reserveMessageSpace:!0,children:e.jsx(r,{type:"email",placeholder:"user@example.com"})}),e.jsx(a,{label:"Country",required:!0,reserveMessageSpace:!0,children:e.jsx(xe,{options:[{value:"sk",label:"Slovakia"},{value:"cz",label:"Czech Republic"},{value:"pl",label:"Poland"}],placeholder:"Choose country"})}),e.jsx(a,{label:"Comment",maxLength:500,helperText:"Optional feedback or notes",reserveMessageSpace:!0,children:e.jsx(f,{rows:4,placeholder:"Enter comment...",maxLength:500})})]}),parameters:{docs:{description:{story:"Example of a complete form using FormField wrapper."}}}},y={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",maxWidth:"500px"},children:[e.jsx(a,{label:"Default state",reserveMessageSpace:!0,children:e.jsx(r,{placeholder:"Enter text"})}),e.jsx(a,{label:"With helper text",helperText:"This is a helper text",reserveMessageSpace:!0,children:e.jsx(r,{placeholder:"Enter text"})}),e.jsx(a,{label:"With error",error:"This field is required",reserveMessageSpace:!0,children:e.jsx(r,{placeholder:"Enter text"})}),e.jsx(a,{label:"Required field",required:!0,reserveMessageSpace:!0,children:e.jsx(r,{placeholder:"Enter text"})}),e.jsx(a,{label:"With character counter",maxLength:100,reserveMessageSpace:!0,children:e.jsx(r,{placeholder:"Enter text",maxLength:100})})]}),parameters:{docs:{description:{story:"All available FormField states."}}}};var E,j,W;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    children: <Input type="email" placeholder="user@example.com" />
  }
}`,...(W=(j=l.parameters)==null?void 0:j.docs)==null?void 0:W.source}}};var C,M,T;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    required: true,
    children: <Input type="email" placeholder="user@example.com" />
  }
}`,...(T=(M=o.parameters)==null?void 0:M.docs)==null?void 0:T.source}}};var I,q,k;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    helperText: 'We will never share your email',
    children: <Input type="email" placeholder="user@example.com" />
  }
}`,...(k=(q=i.parameters)==null?void 0:q.docs)==null?void 0:k.source}}};var L,R,D;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    error: 'Invalid email address',
    children: <Input type="email" placeholder="user@example.com" />
  }
}`,...(D=(R=c.parameters)==null?void 0:R.docs)==null?void 0:D.source}}};var P,V,z;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    fullWidth: true,
    children: <Input type="email" placeholder="user@example.com" />
  },
  decorators: [Story => <div style={{
    width: '600px'
  }}>\r
        <Story />\r
      </div>]
}`,...(z=(V=d.parameters)==null?void 0:V.docs)==null?void 0:z.source}}};var H,A,B;n.parameters={...n.parameters,docs:{...(H=n.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    reserveMessageSpace: true,
    children: <Input type="email" placeholder="user@example.com" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Reserved space prevents layout shift when error messages appear/disappear.'
      }
    }
  }
}`,...(B=(A=n.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var K,J,N;p.parameters={...p.parameters,docs:{...(K=p.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    label: 'Full Name',
    required: true,
    helperText: 'Enter your first and last name',
    children: <Input type="text" placeholder="John Doe" />
  }
}`,...(N=(J=p.parameters)==null?void 0:J.docs)==null?void 0:N.source}}};var O,_,$;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: 'Description',
    helperText: 'Provide a detailed description',
    children: <Textarea rows={4} placeholder="Enter description..." />
  }
}`,...($=(_=m.parameters)==null?void 0:_.docs)==null?void 0:$.source}}};var G,Q,U;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    required: true,
    children: <Select options={[{
      value: 'sk',
      label: 'Slovakia'
    }, {
      value: 'cz',
      label: 'Czech Republic'
    }, {
      value: 'pl',
      label: 'Poland'
    }]} placeholder="Choose country" />
  }
}`,...(U=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,Z;h.parameters={...h.parameters,docs:{...(X=h.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    label: 'Comment',
    maxLength: 200,
    helperText: 'Add a brief comment',
    children: <Textarea rows={4} placeholder="Enter comment..." maxLength={200} />
  }
}`,...(Z=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,re,ae;x.parameters={...x.parameters,docs:{...(ee=x.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    labelHint: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.',
    required: true,
    children: <Input type="password" placeholder="Enter password" />
  }
}`,...(ae=(re=x.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,te,le;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => {
    const [isValid, setIsValid] = useState(false);
    return <FormField label="Email" required validate={value => {
      if (!value) return 'Email is required';
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
        return 'Invalid email format';
      }
      return undefined;
    }} onValidChange={setIsValid} successMessage="Email is valid" reserveMessageSpace>\r
        <Input type="email" placeholder="user@example.com" />\r
      </FormField>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-time validation with success message when valid.'
      }
    }
  }
}`,...(le=(te=g.parameters)==null?void 0:te.docs)==null?void 0:le.source}}};var oe,ie,ce;v.parameters={...v.parameters,docs:{...(oe=v.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => {
    const [keyword, setKeyword] = useState('');
    const [showError, setShowError] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
      setShowError(false);
    };
    const handleBlur = () => {
      if (keyword !== 'secret') {
        setShowError(true);
      }
    };
    return <FormField label="Keyword" error={showError ? 'Wrong keyword (hint: try "secret")' : undefined} value={keyword} onChange={handleChange} reserveMessageSpace>\r
        <Input placeholder="Type keyword" onBlur={handleBlur} />\r
      </FormField>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode where parent component manages the value state.'
      }
    }
  }
}`,...(ce=(ie=v.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};var de,ne,pe;b.parameters={...b.parameters,docs:{...(de=b.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '500px'
  }}>\r
      <FormField label="Full Name" required reserveMessageSpace>\r
        <Input type="text" placeholder="John Doe" />\r
      </FormField>\r
\r
      <FormField label="Email" required helperText="We will never share your email" reserveMessageSpace>\r
        <Input type="email" placeholder="user@example.com" />\r
      </FormField>\r
\r
      <FormField label="Country" required reserveMessageSpace>\r
        <Select options={[{
        value: 'sk',
        label: 'Slovakia'
      }, {
        value: 'cz',
        label: 'Czech Republic'
      }, {
        value: 'pl',
        label: 'Poland'
      }]} placeholder="Choose country" />\r
      </FormField>\r
\r
      <FormField label="Comment" maxLength={500} helperText="Optional feedback or notes" reserveMessageSpace>\r
        <Textarea rows={4} placeholder="Enter comment..." maxLength={500} />\r
      </FormField>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example of a complete form using FormField wrapper.'
      }
    }
  }
}`,...(pe=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:pe.source}}};var me,ue,he;y.parameters={...y.parameters,docs:{...(me=y.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '500px'
  }}>\r
      <FormField label="Default state" reserveMessageSpace>\r
        <Input placeholder="Enter text" />\r
      </FormField>\r
\r
      <FormField label="With helper text" helperText="This is a helper text" reserveMessageSpace>\r
        <Input placeholder="Enter text" />\r
      </FormField>\r
\r
      <FormField label="With error" error="This field is required" reserveMessageSpace>\r
        <Input placeholder="Enter text" />\r
      </FormField>\r
\r
      <FormField label="Required field" required reserveMessageSpace>\r
        <Input placeholder="Enter text" />\r
      </FormField>\r
\r
      <FormField label="With character counter" maxLength={100} reserveMessageSpace>\r
        <Input placeholder="Enter text" maxLength={100} />\r
      </FormField>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available FormField states.'
      }
    }
  }
}`,...(he=(ue=y.parameters)==null?void 0:ue.docs)==null?void 0:he.source}}};const ke=["Default","Required","WithHelperText","WithError","FullWidth","ReservedMessageSpace","WithTextInput","WithTextarea","WithSelect","WithCharacterCounter","WithLabelHint","WithValidation","ControlledMode","CompleteForm","AllStates"];export{y as AllStates,b as CompleteForm,v as ControlledMode,l as Default,d as FullWidth,o as Required,n as ReservedMessageSpace,h as WithCharacterCounter,c as WithError,i as WithHelperText,x as WithLabelHint,u as WithSelect,p as WithTextInput,m as WithTextarea,g as WithValidation,ke as __namedExportsOrder,qe as default};
