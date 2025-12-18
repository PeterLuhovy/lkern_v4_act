import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-BKyFwriW.js";import{u as Ve,M as De,C as R}from"./ConfirmModal-Ds9lIxjL.js";import{B as O}from"./Button-gnwGUMlA.js";import{F as z}from"./FormField-7Fj67rB9.js";import{I as U}from"./Input-CFoEo-oh.js";import{S as we}from"./Select-WvzepR3_.js";import{u as Be}from"./ToastContext-ErSnUSL6.js";import{u as Te}from"./useFormDirty-DiJri1G9.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./DebugBar-C6YrkoDS.js";import"./classNames-CN4lTu6a.js";import"./InfoHint-TbK9iuJy.js";const Le="SectionEditModal-module__formContainer___NAwI-",Re="SectionEditModal-module__fieldGroup___SOS-t",Ue="SectionEditModal-module__fieldLabel___mIMPI",Pe="SectionEditModal-module__required___Wi3cQ",Ae="SectionEditModal-module__textarea___hq8KX",Ge="SectionEditModal-module__fieldError___ey-Nf",u={formContainer:Le,fieldGroup:Re,fieldLabel:Ue,required:Pe,textarea:Ae,fieldError:Ge},He=({isOpen:o,onClose:i,onSave:ge,title:he,modalId:I,parentModalId:xe,fields:v,initialData:g={},size:fe="md",showClearButton:V=!0,saveText:ye,cancelText:be,locking:Se,readOnly:Ce=!1})=>{const{t:l}=Be(),d=Ve(),[Fe,D]=s.useState(!1),[m,E]=s.useState(g),[Me,je]=s.useState(g),[w,p]=s.useState({}),[ke,_]=s.useState(!1),{isDirty:q}=Te(Me,m);s.useEffect(()=>{o&&(E(g),je(g),p({}))},[o,g]),s.useEffect(()=>{o||D(!1)},[o]);const B=Object.keys(w).length>0,h=Ce||Fe,x=s.useCallback((e,n)=>{E(r=>({...r,[e]:n}));const t=v.find(r=>r.name===e);if(t)if(t.validate){const r=t.validate(n,{...m,[e]:n});!r.isValid&&r.error?p(c=>({...c,[e]:r.error})):p(c=>{const{[e]:L,...Ne}=c;return Ne})}else p(r=>{const{[e]:c,...L}=r;return L})},[v,m]),T=()=>{if(B)return;let e=!1;const n={};if(v.forEach(t=>{const r=m[t.name];if(t.required&&(!r||r==="")){n[t.name]="This field is required",e=!0;return}if(t.validate){const c=t.validate(r,m);!c.isValid&&c.error&&(n[t.name]=c.error,e=!0)}}),e){p(n);return}ge(m),i()},Ie=s.useCallback(()=>{q?d.confirm({}).then(e=>{e&&i()}):i()},[q,d,i]),Ee=()=>{_(!0)},_e=()=>{const e={};v.forEach(n=>{n.type==="number"?e[n.name]=0:e[n.name]=""}),E(e),p({}),_(!1)},qe=()=>{_(!1)},Oe=e=>{const n=m[e.name]||"",t=w[e.name];return["text","email","number"].includes(e.type)?a.jsx(z,{label:e.label,error:t,required:e.required,value:n,onChange:r=>x(e.name,r.target.value),htmlFor:e.name,children:a.jsx(U,{type:e.type,name:e.name,id:e.name,placeholder:e.placeholder,pattern:e.pattern,min:e.min,max:e.max,required:e.required})},e.name):e.type==="date"?a.jsx(z,{label:e.label,error:t,required:e.required,value:n,onChange:r=>x(e.name,r.target.value),htmlFor:e.name,children:a.jsx(U,{type:"date",name:e.name,id:e.name,placeholder:e.placeholder,required:e.required})},e.name):e.type==="select"&&e.options?a.jsx(z,{label:e.label,error:t,required:e.required,value:n,onChange:r=>x(e.name,r.target.value),htmlFor:e.name,children:a.jsx(we,{name:e.name,id:e.name,options:e.options,placeholder:l("common.select"),required:e.required})},e.name):e.type==="textarea"?a.jsxs("div",{className:u.fieldGroup,children:[a.jsxs("label",{className:u.fieldLabel,htmlFor:e.name,children:[e.label,e.required&&a.jsx("span",{className:u.required,children:" *"})]}),a.jsx("textarea",{className:u.textarea,name:e.name,id:e.name,value:n,onChange:r=>x(e.name,r.target.value),placeholder:e.placeholder,rows:3,required:e.required}),t&&a.jsx("div",{className:u.fieldError,children:t})]},e.name):null},ze={left:V&&!h?a.jsx(O,{variant:"danger-subtle",onClick:Ee,"data-testid":"section-edit-modal-clear",children:l("components.modalV3.sectionEditModal.clearButton")}):void 0,right:a.jsxs(a.Fragment,{children:[a.jsx(O,{variant:"ghost",onClick:Ie,"data-testid":"section-edit-modal-cancel",children:h?l("common.close"):be||l("common.cancel")}),!h&&a.jsx(O,{variant:"primary",onClick:T,disabled:B,"data-testid":"section-edit-modal-save",children:ye||l("common.save")})]})};return a.jsxs(a.Fragment,{children:[a.jsx(De,{isOpen:o,onClose:i,onConfirm:d.state.isOpen||h?void 0:T,hasUnsavedChanges:h?!1:q,modalId:I,parentModalId:xe,title:he,size:fe,footer:ze,locking:Se,onLockStatusChange:D,children:a.jsx("div",{className:u.formContainer,children:v.map(e=>Oe(e))})}),V&&a.jsx(R,{isOpen:ke,onClose:qe,onConfirm:_e,title:l("components.modalV3.sectionEditModal.clearConfirmTitle"),message:l("components.modalV3.sectionEditModal.clearConfirmMessage"),confirmButtonLabel:l("components.modalV3.sectionEditModal.clearConfirmButton"),cancelButtonLabel:l("common.cancel"),parentModalId:I}),a.jsx(R,{isOpen:d.state.isOpen,onClose:d.handleCancel,onConfirm:d.handleConfirm,title:d.state.title,message:d.state.message,parentModalId:I})]})},pa={title:"Components/Modals/SectionEditModal",component:He,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},size:{control:"select",options:["sm","md","lg"],description:"Modal size"},showClearButton:{control:"boolean",description:"Show clear button"}},parameters:{docs:{description:{component:"Generic form builder modal with FieldDefinition system. Supports text, email, number, date, select, and textarea fields with validation."}}}},N=[{name:"firstName",label:"Meno",type:"text",required:!0,placeholder:"Ján"},{name:"lastName",label:"Priezvisko",type:"text",required:!0,placeholder:"Novák"},{name:"email",label:"Email",type:"email",required:!0,placeholder:"jan.novak@example.com"},{name:"phone",label:"Telefón",type:"text",placeholder:"+421 900 123 456"}],f={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"Upraviť: Osobné údaje",modalId:"edit-personal-info",fields:N,initialData:{firstName:"Ján",lastName:"Novák",email:"jan.novak@example.com",phone:"+421 900 123 456"}}},Je=[{name:"textField",label:"Text Field",type:"text",placeholder:"Enter text..."},{name:"emailField",label:"Email Field",type:"email",placeholder:"email@example.com"},{name:"numberField",label:"Number Field",type:"number",min:0,max:100,placeholder:"0"},{name:"dateField",label:"Date Field",type:"date"},{name:"selectField",label:"Select Field",type:"select",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}]},{name:"textareaField",label:"Textarea Field",type:"textarea",placeholder:"Enter long text..."}],y={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"All Field Types",modalId:"all-field-types",fields:Je,size:"lg"}},We=[{name:"username",label:"Používateľské meno",type:"text",required:!0,min:3,max:20,placeholder:"min 3, max 20 znakov",validate:o=>o&&o.length<3?{isValid:!1,error:"Meno musí mať aspoň 3 znaky"}:o&&o.length>20?{isValid:!1,error:"Meno môže mať max 20 znakov"}:{isValid:!0}},{name:"password",label:"Heslo",type:"text",required:!0,placeholder:"min 8 znakov",validate:o=>o&&o.length<8?{isValid:!1,error:"Heslo musí mať aspoň 8 znakov"}:{isValid:!0}},{name:"age",label:"Vek",type:"number",required:!0,min:18,max:120,validate:o=>{const i=parseInt(o,10);return i<18?{isValid:!1,error:"Musíte mať aspoň 18 rokov"}:i>120?{isValid:!1,error:"Neplatný vek"}:{isValid:!0}}}],b={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"Formulár s validáciou",modalId:"validated-form",fields:We}},Ke=[{name:"title",label:"Názov",type:"text",required:!0},{name:"description",label:"Popis",type:"textarea"}],S={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"Malý formulár",modalId:"small-form",fields:Ke,size:"sm"}},C={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"Veľký formulár",modalId:"large-form",fields:N,size:"lg"}},F={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"Formulár s tlačidlom Vyčistiť",modalId:"form-with-clear",fields:N,showClearButton:!0,initialData:{firstName:"Ján",lastName:"Novák",email:"jan.novak@example.com"}}},Ze=[{name:"companyName",label:"Názov spoločnosti",type:"text",required:!0},{name:"ico",label:"IČO",type:"text",pattern:"[0-9]{8}",placeholder:"12345678"},{name:"dic",label:"DIČ",type:"text",placeholder:"SK1234567890"}],M={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"Upraviť: Základné údaje",modalId:"edit-contact-basic",fields:Ze,initialData:{companyName:"BOSSystems s.r.o.",ico:"12345678",dic:"SK1234567890"}}},Qe=[{name:"type",label:"Typ",type:"select",required:!0,options:[{value:"bug",label:"🐛 Bug"},{value:"feature",label:"✨ Feature"},{value:"improvement",label:"📈 Improvement"}]},{name:"severity",label:"Závažnosť",type:"select",required:!0,options:[{value:"minor",label:"Minor"},{value:"moderate",label:"Moderate"},{value:"major",label:"Major"},{value:"blocker",label:"🚨 Blocker"}]},{name:"priority",label:"Priorita",type:"select",required:!0,options:[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"},{value:"critical",label:"🔴 Critical"}]}],j={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:o=>console.log("Saved:",o),title:"Upraviť: Metadata Issue",modalId:"edit-issue-metadata",fields:Qe,initialData:{type:"bug",severity:"moderate",priority:"medium"}}},k={render:()=>a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[a.jsx("h3",{children:"SectionEditModal Features"}),a.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[a.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[a.jsx("h4",{children:"📝 Dynamic Fields"}),a.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Define form fields via FieldDefinition array."})]}),a.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[a.jsx("h4",{children:"✅ Validation"}),a.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"HTML5 + custom validation with error messages."})]}),a.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[a.jsx("h4",{children:"🧹 Clear Form"}),a.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Optional clear button with confirmation."})]}),a.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[a.jsx("h4",{children:"💾 Dirty Tracking"}),a.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Unsaved changes detection."})]})]})]}),parameters:{docs:{description:{story:"SectionEditModal key features overview."}}}};var P,A,G;f.parameters={...f.parameters,docs:{...(P=f.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'Upraviť: Osobné údaje',
    modalId: 'edit-personal-info',
    fields: personalInfoFields,
    initialData: {
      firstName: 'Ján',
      lastName: 'Novák',
      email: 'jan.novak@example.com',
      phone: '+421 900 123 456'
    }
  }
}`,...(G=(A=f.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var H,J,W;y.parameters={...y.parameters,docs:{...(H=y.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'All Field Types',
    modalId: 'all-field-types',
    fields: allFieldTypes,
    size: 'lg'
  }
}`,...(W=(J=y.parameters)==null?void 0:J.docs)==null?void 0:W.source}}};var K,Z,Q;b.parameters={...b.parameters,docs:{...(K=b.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'Formulár s validáciou',
    modalId: 'validated-form',
    fields: validatedFields
  }
}`,...(Q=(Z=b.parameters)==null?void 0:Z.docs)==null?void 0:Q.source}}};var X,Y,$;S.parameters={...S.parameters,docs:{...(X=S.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'Malý formulár',
    modalId: 'small-form',
    fields: shortForm,
    size: 'sm'
  }
}`,...($=(Y=S.parameters)==null?void 0:Y.docs)==null?void 0:$.source}}};var ee,ae,oe;C.parameters={...C.parameters,docs:{...(ee=C.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'Veľký formulár',
    modalId: 'large-form',
    fields: personalInfoFields,
    size: 'lg'
  }
}`,...(oe=(ae=C.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var re,ne,te;F.parameters={...F.parameters,docs:{...(re=F.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'Formulár s tlačidlom Vyčistiť',
    modalId: 'form-with-clear',
    fields: personalInfoFields,
    showClearButton: true,
    initialData: {
      firstName: 'Ján',
      lastName: 'Novák',
      email: 'jan.novak@example.com'
    }
  }
}`,...(te=(ne=F.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var le,se,ie;M.parameters={...M.parameters,docs:{...(le=M.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'Upraviť: Základné údaje',
    modalId: 'edit-contact-basic',
    fields: contactBasicFields,
    initialData: {
      companyName: 'BOSSystems s.r.o.',
      ico: '12345678',
      dic: 'SK1234567890'
    }
  }
}`,...(ie=(se=M.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var de,ce,me;j.parameters={...j.parameters,docs:{...(de=j.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: data => console.log('Saved:', data),
    title: 'Upraviť: Metadata Issue',
    modalId: 'edit-issue-metadata',
    fields: issueFields,
    initialData: {
      type: 'bug',
      severity: 'moderate',
      priority: 'medium'
    }
  }
}`,...(me=(ce=j.parameters)==null?void 0:ce.docs)==null?void 0:me.source}}};var pe,ue,ve;k.parameters={...k.parameters,docs:{...(pe=k.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>SectionEditModal Features</h3>\r
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    }}>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>📝 Dynamic Fields</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Define form fields via FieldDefinition array.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>✅ Validation</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>HTML5 + custom validation with error messages.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>🧹 Clear Form</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Optional clear button with confirmation.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>💾 Dirty Tracking</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Unsaved changes detection.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'SectionEditModal key features overview.'
      }
    }
  }
}`,...(ve=(ue=k.parameters)==null?void 0:ue.docs)==null?void 0:ve.source}}};const ua=["PersonalInfo","AllFieldTypes","WithValidation","SmallSize","LargeSize","WithClearButton","ContactBasicInfo","IssueMetadata","Features"];export{y as AllFieldTypes,M as ContactBasicInfo,k as Features,j as IssueMetadata,C as LargeSize,f as PersonalInfo,S as SmallSize,F as WithClearButton,b as WithValidation,ua as __namedExportsOrder,pa as default};
