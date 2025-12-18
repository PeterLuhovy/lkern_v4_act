import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as b}from"./index-BKyFwriW.js";import{u as xe,M as ge,C as E}from"./ConfirmModal-Ds9lIxjL.js";import{B as j}from"./Button-gnwGUMlA.js";import{u as ve}from"./ToastContext-ErSnUSL6.js";import{I as o}from"./Input-CFoEo-oh.js";import{S as le}from"./Select-WvzepR3_.js";import{F as l}from"./FormField-7Fj67rB9.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./DebugBar-C6YrkoDS.js";import"./classNames-CN4lTu6a.js";import"./InfoHint-TbK9iuJy.js";const oe=({isOpen:a,onClose:r,onSave:d,title:c,modalId:n,parentModalId:s,children:ae,saveDisabled:re=!1,saveText:ie,cancelText:te,showClearButton:I=!1,clearButtonText:se,onClear:S,hasUnsavedChanges:m=!1,size:ne="md"})=>{const{t:i}=ve(),t=xe(),[de,C]=b.useState(!1),ce=b.useCallback(()=>{console.log("[EditItemModal] handleCloseWithConfirm called, hasUnsavedChanges:",m),m?(console.log("[EditItemModal] Showing unsaved changes confirmation..."),t.confirm({}).then(M=>{console.log("[EditItemModal] Confirmation result:",M),M?(console.log("[EditItemModal] User confirmed - closing modal"),r()):console.log("[EditItemModal] User cancelled - staying in modal")})):(console.log("[EditItemModal] No unsaved changes - closing directly"),r())},[m,t,r]),me=()=>{console.log("[EditItemModal] Clear button clicked - showing confirmation"),C(!0)},pe=()=>{console.log("[EditItemModal] ========================================"),console.log("[EditItemModal] handleClearConfirm START"),console.log("[EditItemModal] User confirmed clear"),console.log("[EditItemModal] Closing clear confirmation modal"),C(!1),S?(console.log("[EditItemModal] onClear callback exists, calling it NOW"),S(),console.log("[EditItemModal] onClear callback finished")):console.log("[EditItemModal] WARNING: onClear callback not provided!"),console.log("[EditItemModal] handleClearConfirm END"),console.log("[EditItemModal] ========================================")},ue=()=>{console.log("[EditItemModal] User cancelled clear - staying in modal"),C(!1)},he={left:I?e.jsx(j,{variant:"danger-subtle",onClick:me,"data-testid":"edit-item-modal-clear",children:se||i("components.modalV3.editItemModal.defaultClear")}):void 0,right:e.jsxs(e.Fragment,{children:[e.jsx(j,{variant:"ghost",onClick:ce,"data-testid":"edit-item-modal-cancel",children:te||i("components.modalV3.editItemModal.defaultCancel")}),e.jsx(j,{variant:"primary",onClick:d,disabled:re,"data-testid":"edit-item-modal-save",children:ie||i("components.modalV3.editItemModal.defaultSave")})]})};return e.jsxs(e.Fragment,{children:[e.jsx(ge,{isOpen:a,onClose:r,onConfirm:d,hasUnsavedChanges:m,modalId:n,parentModalId:s,title:c,size:ne,footer:he,children:ae}),I&&e.jsx(E,{isOpen:de,onClose:ue,onConfirm:pe,title:i("components.modalV3.editItemModal.clearConfirmTitle"),message:i("components.modalV3.editItemModal.clearConfirmMessage"),confirmButtonLabel:i("components.modalV3.editItemModal.clearConfirmButton"),cancelButtonLabel:i("common.cancel"),parentModalId:n}),e.jsx(E,{isOpen:t.state.isOpen,onClose:t.handleCancel,onConfirm:t.handleConfirm,title:t.state.title,message:t.state.message,parentModalId:n})]})},qe={title:"Components/Modals/EditItemModal",component:oe,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},size:{control:"select",options:["sm","md","lg"],description:"Modal size"},saveDisabled:{control:"boolean",description:"Disable save button"},showClearButton:{control:"boolean",description:"Show clear button"},hasUnsavedChanges:{control:"boolean",description:"Has unsaved changes"}},parameters:{docs:{description:{component:"Generic add/edit modal wrapper with unsaved changes detection and optional clear button."}}}},p={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Email saved"),title:"Pridať email",modalId:"add-email",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(l,{label:"Email",required:!0,htmlFor:"email",children:e.jsx(o,{type:"email",id:"email",placeholder:"jan.novak@example.com"})}),e.jsx(l,{label:"Typ",htmlFor:"email-type",children:e.jsx(le,{id:"email-type",options:[{value:"personal",label:"Osobný"},{value:"work",label:"Pracovný"},{value:"other",label:"Iný"}]})})]})}},u={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Phone saved"),title:"Upraviť telefón",modalId:"edit-phone",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(l,{label:"Číslo",required:!0,htmlFor:"phone",children:e.jsx(o,{type:"tel",id:"phone",placeholder:"+421 900 123 456"})}),e.jsx(l,{label:"Typ",htmlFor:"phone-type",children:e.jsx(le,{id:"phone-type",options:[{value:"mobile",label:"Mobil"},{value:"work",label:"Pracovný"},{value:"home",label:"Domov"}]})})]})}},h={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Address saved"),onClear:()=>console.log("Form cleared"),title:"Pridať adresu",modalId:"add-address",showClearButton:!0,children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(l,{label:"Ulica",required:!0,htmlFor:"street",children:e.jsx(o,{type:"text",id:"street",placeholder:"Hlavná 123"})}),e.jsx(l,{label:"Mesto",required:!0,htmlFor:"city",children:e.jsx(o,{type:"text",id:"city",placeholder:"Bratislava"})}),e.jsx(l,{label:"PSČ",required:!0,htmlFor:"zip",children:e.jsx(o,{type:"text",id:"zip",placeholder:"811 01"})})]})}},x={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Data saved"),title:"Upraviť údaje",modalId:"edit-data",hasUnsavedChanges:!0,children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(l,{label:"Meno",required:!0,htmlFor:"name",children:e.jsx(o,{type:"text",id:"name",defaultValue:"Ján Novák"})}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Try closing this modal - you will see unsaved changes confirmation."})]})}},g={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Data saved"),title:"Neplatný formulár",modalId:"invalid-form",saveDisabled:!0,children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(l,{label:"Email",required:!0,htmlFor:"email",error:"Neplatný email",children:e.jsx(o,{type:"email",id:"email",defaultValue:"invalid-email"})}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Save button is disabled due to validation error."})]})}},v={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Note saved"),title:"Pridať poznámku",modalId:"add-note",size:"sm",children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:e.jsx(l,{label:"Poznámka",required:!0,htmlFor:"note",children:e.jsx("textarea",{id:"note",rows:3,placeholder:"Zadajte poznámku...",style:{width:"100%",padding:"8px",fontFamily:"inherit"}})})})}},f={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Details saved"),title:"Upraviť podrobné informácie",modalId:"edit-details",size:"lg",children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsx(l,{label:"Meno",required:!0,htmlFor:"firstname",children:e.jsx(o,{type:"text",id:"firstname",placeholder:"Ján"})}),e.jsx(l,{label:"Priezvisko",required:!0,htmlFor:"lastname",children:e.jsx(o,{type:"text",id:"lastname",placeholder:"Novák"})}),e.jsx(l,{label:"Email",required:!0,htmlFor:"email-lg",children:e.jsx(o,{type:"email",id:"email-lg",placeholder:"jan.novak@example.com"})}),e.jsx(l,{label:"Telefón",htmlFor:"phone-lg",children:e.jsx(o,{type:"tel",id:"phone-lg",placeholder:"+421 900 123 456"})})]})})}},y={render:()=>{const[a,r]=b.useState(""),[d,c]=b.useState(!1),n=s=>{r(s),c(s!=="")};return e.jsx(oe,{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Saved:",a),onClear:()=>{r(""),c(!1)},title:"Pridať kontakt (Interactive)",modalId:"interactive-modal",saveDisabled:!a||!a.includes("@"),hasUnsavedChanges:d,showClearButton:!0,children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx(l,{label:"Email",required:!0,htmlFor:"interactive-email",error:a&&!a.includes("@")?"Neplatný email":void 0,children:e.jsx(o,{type:"email",id:"interactive-email",placeholder:"jan.novak@example.com",value:a,onChange:s=>n(s.target.value)})}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Type an email to enable the save button. Try closing to see unsaved changes warning."})]})})}},F={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("p",{style:{textAlign:"center",fontSize:"14px",color:"#666"},children:"EditItemModal supports three sizes: sm (400px), md (600px), lg (800px)."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px"},children:[e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Small (sm)"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Best for simple forms with 1-2 fields."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Medium (md)"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Default size for most forms."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Large (lg)"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"For complex forms with many fields."})]})]})]}),parameters:{docs:{description:{story:"EditItemModal size comparison."}}}};var z,D,k;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Email saved'),
    title: 'Pridať email',
    modalId: 'add-email',
    children: <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>\r
        <FormField label="Email" required htmlFor="email">\r
          <Input type="email" id="email" placeholder="jan.novak@example.com" />\r
        </FormField>\r
        <FormField label="Typ" htmlFor="email-type">\r
          <Select id="email-type" options={[{
          value: 'personal',
          label: 'Osobný'
        }, {
          value: 'work',
          label: 'Pracovný'
        }, {
          value: 'other',
          label: 'Iný'
        }]} />\r
        </FormField>\r
      </div>
  }
}`,...(k=(D=p.parameters)==null?void 0:D.docs)==null?void 0:k.source}}};var w,q,O;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Phone saved'),
    title: 'Upraviť telefón',
    modalId: 'edit-phone',
    children: <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>\r
        <FormField label="Číslo" required htmlFor="phone">\r
          <Input type="tel" id="phone" placeholder="+421 900 123 456" />\r
        </FormField>\r
        <FormField label="Typ" htmlFor="phone-type">\r
          <Select id="phone-type" options={[{
          value: 'mobile',
          label: 'Mobil'
        }, {
          value: 'work',
          label: 'Pracovný'
        }, {
          value: 'home',
          label: 'Domov'
        }]} />\r
        </FormField>\r
      </div>
  }
}`,...(O=(q=u.parameters)==null?void 0:q.docs)==null?void 0:O.source}}};var P,T,N;h.parameters={...h.parameters,docs:{...(P=h.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Address saved'),
    onClear: () => console.log('Form cleared'),
    title: 'Pridať adresu',
    modalId: 'add-address',
    showClearButton: true,
    children: <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>\r
        <FormField label="Ulica" required htmlFor="street">\r
          <Input type="text" id="street" placeholder="Hlavná 123" />\r
        </FormField>\r
        <FormField label="Mesto" required htmlFor="city">\r
          <Input type="text" id="city" placeholder="Bratislava" />\r
        </FormField>\r
        <FormField label="PSČ" required htmlFor="zip">\r
          <Input type="text" id="zip" placeholder="811 01" />\r
        </FormField>\r
      </div>
  }
}`,...(N=(T=h.parameters)==null?void 0:T.docs)==null?void 0:N.source}}};var U,B,A;x.parameters={...x.parameters,docs:{...(U=x.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Data saved'),
    title: 'Upraviť údaje',
    modalId: 'edit-data',
    hasUnsavedChanges: true,
    children: <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>\r
        <FormField label="Meno" required htmlFor="name">\r
          <Input type="text" id="name" defaultValue="Ján Novák" />\r
        </FormField>\r
        <p style={{
        fontSize: '14px',
        color: '#666'
      }}>\r
          Try closing this modal - you will see unsaved changes confirmation.\r
        </p>\r
      </div>
  }
}`,...(A=(B=x.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var V,R,W;g.parameters={...g.parameters,docs:{...(V=g.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Data saved'),
    title: 'Neplatný formulár',
    modalId: 'invalid-form',
    saveDisabled: true,
    children: <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>\r
        <FormField label="Email" required htmlFor="email" error="Neplatný email">\r
          <Input type="email" id="email" defaultValue="invalid-email" />\r
        </FormField>\r
        <p style={{
        fontSize: '14px',
        color: '#666'
      }}>\r
          Save button is disabled due to validation error.\r
        </p>\r
      </div>
  }
}`,...(W=(R=g.parameters)==null?void 0:R.docs)==null?void 0:W.source}}};var L,J,H;v.parameters={...v.parameters,docs:{...(L=v.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Note saved'),
    title: 'Pridať poznámku',
    modalId: 'add-note',
    size: 'sm',
    children: <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>\r
        <FormField label="Poznámka" required htmlFor="note">\r
          <textarea id="note" rows={3} placeholder="Zadajte poznámku..." style={{
          width: '100%',
          padding: '8px',
          fontFamily: 'inherit'
        }} />\r
        </FormField>\r
      </div>
  }
}`,...(H=(J=v.parameters)==null?void 0:J.docs)==null?void 0:H.source}}};var G,Z,_;f.parameters={...f.parameters,docs:{...(G=f.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Details saved'),
    title: 'Upraviť podrobné informácie',
    modalId: 'edit-details',
    size: 'lg',
    children: <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>\r
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>\r
          <FormField label="Meno" required htmlFor="firstname">\r
            <Input type="text" id="firstname" placeholder="Ján" />\r
          </FormField>\r
          <FormField label="Priezvisko" required htmlFor="lastname">\r
            <Input type="text" id="lastname" placeholder="Novák" />\r
          </FormField>\r
          <FormField label="Email" required htmlFor="email-lg">\r
            <Input type="email" id="email-lg" placeholder="jan.novak@example.com" />\r
          </FormField>\r
          <FormField label="Telefón" htmlFor="phone-lg">\r
            <Input type="tel" id="phone-lg" placeholder="+421 900 123 456" />\r
          </FormField>\r
        </div>\r
      </div>
  }
}`,...(_=(Z=f.parameters)==null?void 0:Z.docs)==null?void 0:_.source}}};var K,Q,X;y.parameters={...y.parameters,docs:{...(K=y.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => {
    const [email, setEmail] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const handleEmailChange = (value: string) => {
      setEmail(value);
      setIsDirty(value !== '');
    };
    return <EditItemModal isOpen={true} onClose={() => console.log('Modal closed')} onSave={() => console.log('Saved:', email)} onClear={() => {
      setEmail('');
      setIsDirty(false);
    }} title="Pridať kontakt (Interactive)" modalId="interactive-modal" saveDisabled={!email || !email.includes('@')} hasUnsavedChanges={isDirty} showClearButton={true}>\r
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>\r
          <FormField label="Email" required htmlFor="interactive-email" error={email && !email.includes('@') ? 'Neplatný email' : undefined}>\r
            <Input type="email" id="interactive-email" placeholder="jan.novak@example.com" value={email} onChange={e => handleEmailChange(e.target.value)} />\r
          </FormField>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>\r
            Type an email to enable the save button. Try closing to see unsaved changes warning.\r
          </p>\r
        </div>\r
      </EditItemModal>;
  }
}`,...(X=(Q=y.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,$,ee;F.parameters={...F.parameters,docs:{...(Y=F.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <p style={{
      textAlign: 'center',
      fontSize: '14px',
      color: '#666'
    }}>\r
        EditItemModal supports three sizes: sm (400px), md (600px), lg (800px).\r
      </p>\r
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px'
    }}>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>Small (sm)</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Best for simple forms with 1-2 fields.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>Medium (md)</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Default size for most forms.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>Large (lg)</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>For complex forms with many fields.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'EditItemModal size comparison.'
      }
    }
  }
}`,...(ee=($=F.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};const Oe=["AddEmail","EditPhone","WithClearButton","WithUnsavedChanges","SaveDisabled","SmallSize","LargeSize","InteractiveForm","AllSizes"];export{p as AddEmail,F as AllSizes,u as EditPhone,y as InteractiveForm,f as LargeSize,g as SaveDisabled,v as SmallSize,h as WithClearButton,x as WithUnsavedChanges,Oe as __namedExportsOrder,qe as default};
