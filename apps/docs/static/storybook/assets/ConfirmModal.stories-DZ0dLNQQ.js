import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as G}from"./ConfirmModal-Ds9lIxjL.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./ToastContext-ErSnUSL6.js";import"./DebugBar-C6YrkoDS.js";import"./Button-gnwGUMlA.js";import"./classNames-CN4lTu6a.js";import"./Input-CFoEo-oh.js";import"./FormField-7Fj67rB9.js";import"./InfoHint-TbK9iuJy.js";const de={title:"Components/Modals/ConfirmModal",component:G,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},isDanger:{control:"boolean",description:"Danger mode (red button, keyword input)"},confirmKeyword:{control:"text",description:"Keyword required for danger confirmation"},isLoading:{control:"boolean",description:"Loading state for confirm button"},isSecondaryLoading:{control:"boolean",description:"Loading state for secondary button"}},parameters:{docs:{description:{component:"Universal confirmation modal with simple and danger modes. Danger mode requires typing a keyword to confirm."}}}},o={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed"),title:"Potvrdiť akciu",message:"Naozaj chcete pokračovať?"}},n={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed"),title:"Potvrdiť uloženie",message:"Chcete uložiť zmeny?",confirmButtonLabel:"Áno, uložiť",cancelButtonLabel:"Nie, zrušiť"}},r={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed"),title:"Ukladám zmeny...",message:"Počkajte prosím.",isLoading:!0}},a={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed delete"),title:"Vymazať kontakt",message:'Táto akcia je nevratná. Zadajte "ano" pre potvrdenie.',confirmKeyword:"ano",isDanger:!0}},s={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed delete"),title:"Vymazať všetky dáta",message:'VAROVÁNÍ! Táto akcia vymaže všetky dáta a je nezvratná. Zadajte "DELETE" pre potvrdenie.',confirmKeyword:"DELETE",isDanger:!0,confirmButtonLabel:"Vymazať všetko"}},t={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed delete"),title:"Mažem dáta...",message:"Prosím počkajte, prebieha mazanie.",confirmKeyword:"ano",isDanger:!0,isLoading:!0}},i={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed"),onSecondary:()=>console.log("Secondary action"),title:"Chyba pri ukladaní",message:"Nepodarilo sa uložiť zmeny. Chcete to skúsiť znova?",confirmButtonLabel:"Pokračovať",secondaryButtonLabel:"Skúsiť znova",cancelButtonLabel:"Zrušiť"}},l={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Confirmed"),onSecondary:()=>console.log("Secondary action"),title:"Opakujem pokus...",message:"Skúšam znova uložiť zmeny.",confirmButtonLabel:"Pokračovať",secondaryButtonLabel:"Skúsiť znova",isSecondaryLoading:!0}},d={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Discarded changes"),title:"Neuložené zmeny",message:"Máte neuložené zmeny. Naozaj chcete zatvoriť okno?",confirmButtonLabel:"Zahodiť zmeny",cancelButtonLabel:"Pokračovať v úprave"}},c={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Deleted contact"),title:"Vymazať kontakt",message:'Naozaj chcete vymazať kontakt "Ján Novák"? Túto akciu nie je možné vrátiť späť. Zadajte "ano" pre potvrdenie.',confirmKeyword:"ano",isDanger:!0,confirmButtonLabel:"Vymazať"}},m={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onConfirm:()=>console.log("Cleared form"),title:"Vyčistiť formulár",message:"Naozaj chcete vyčistiť všetky polia formulára?",confirmButtonLabel:"Vyčistiť",cancelButtonLabel:"Zrušiť"}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("p",{style:{textAlign:"center",fontSize:"14px",color:"#666"},children:"Note: In Storybook, only one modal can be shown at a time. Click through the examples above to see different variants."}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Simple Mode"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Basic confirmation with Yes/Cancel buttons."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Danger Mode"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Requires typing keyword to confirm. Red button."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"With Secondary Button"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Three buttons: Cancel / Retry / Proceed."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"Loading State"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Shows spinner while processing."})]})]})]}),parameters:{docs:{description:{story:"All available ConfirmModal variants."}}}};var g,u,y;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    title: 'Potvrdiť akciu',
    message: 'Naozaj chcete pokračovať?'
  }
}`,...(y=(u=o.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var f,C,v;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    title: 'Potvrdiť uloženie',
    message: 'Chcete uložiť zmeny?',
    confirmButtonLabel: 'Áno, uložiť',
    cancelButtonLabel: 'Nie, zrušiť'
  }
}`,...(v=(C=n.parameters)==null?void 0:C.docs)==null?void 0:v.source}}};var h,b,k;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    title: 'Ukladám zmeny...',
    message: 'Počkajte prosím.',
    isLoading: true
  }
}`,...(k=(b=r.parameters)==null?void 0:b.docs)==null?void 0:k.source}}};var x,z,S;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed delete'),
    title: 'Vymazať kontakt',
    message: 'Táto akcia je nevratná. Zadajte "ano" pre potvrdenie.',
    confirmKeyword: 'ano',
    isDanger: true
  }
}`,...(S=(z=a.parameters)==null?void 0:z.docs)==null?void 0:S.source}}};var L,j,M;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed delete'),
    title: 'Vymazať všetky dáta',
    message: 'VAROVÁNÍ! Táto akcia vymaže všetky dáta a je nezvratná. Zadajte "DELETE" pre potvrdenie.',
    confirmKeyword: 'DELETE',
    isDanger: true,
    confirmButtonLabel: 'Vymazať všetko'
  }
}`,...(M=(j=s.parameters)==null?void 0:j.docs)==null?void 0:M.source}}};var B,D,O;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed delete'),
    title: 'Mažem dáta...',
    message: 'Prosím počkajte, prebieha mazanie.',
    confirmKeyword: 'ano',
    isDanger: true,
    isLoading: true
  }
}`,...(O=(D=t.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var w,N,V;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    onSecondary: () => console.log('Secondary action'),
    title: 'Chyba pri ukladaní',
    message: 'Nepodarilo sa uložiť zmeny. Chcete to skúsiť znova?',
    confirmButtonLabel: 'Pokračovať',
    secondaryButtonLabel: 'Skúsiť znova',
    cancelButtonLabel: 'Zrušiť'
  }
}`,...(V=(N=i.parameters)==null?void 0:N.docs)==null?void 0:V.source}}};var R,P,T;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Confirmed'),
    onSecondary: () => console.log('Secondary action'),
    title: 'Opakujem pokus...',
    message: 'Skúšam znova uložiť zmeny.',
    confirmButtonLabel: 'Pokračovať',
    secondaryButtonLabel: 'Skúsiť znova',
    isSecondaryLoading: true
  }
}`,...(T=(P=l.parameters)==null?void 0:P.docs)==null?void 0:T.source}}};var E,K,Z;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Discarded changes'),
    title: 'Neuložené zmeny',
    message: 'Máte neuložené zmeny. Naozaj chcete zatvoriť okno?',
    confirmButtonLabel: 'Zahodiť zmeny',
    cancelButtonLabel: 'Pokračovať v úprave'
  }
}`,...(Z=(K=d.parameters)==null?void 0:K.docs)==null?void 0:Z.source}}};var W,A,U;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Deleted contact'),
    title: 'Vymazať kontakt',
    message: 'Naozaj chcete vymazať kontakt "Ján Novák"? Túto akciu nie je možné vrátiť späť. Zadajte "ano" pre potvrdenie.',
    confirmKeyword: 'ano',
    isDanger: true,
    confirmButtonLabel: 'Vymazať'
  }
}`,...(U=(A=c.parameters)==null?void 0:A.docs)==null?void 0:U.source}}};var q,F,I;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onConfirm: () => console.log('Cleared form'),
    title: 'Vyčistiť formulár',
    message: 'Naozaj chcete vyčistiť všetky polia formulára?',
    confirmButtonLabel: 'Vyčistiť',
    cancelButtonLabel: 'Zrušiť'
  }
}`,...(I=(F=m.parameters)==null?void 0:F.docs)==null?void 0:I.source}}};var J,Y,_;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
        Note: In Storybook, only one modal can be shown at a time. Click through the examples above to see different variants.\r
      </p>\r
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
          <h4>Simple Mode</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Basic confirmation with Yes/Cancel buttons.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>Danger Mode</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Requires typing keyword to confirm. Red button.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>With Secondary Button</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Three buttons: Cancel / Retry / Proceed.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>Loading State</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Shows spinner while processing.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available ConfirmModal variants.'
      }
    }
  }
}`,...(_=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};const ce=["SimpleConfirm","SimpleWithCustomButtons","SimpleLoading","DangerConfirm","DangerWithCustomKeyword","DangerLoading","WithSecondaryButton","WithSecondaryLoading","UnsavedChanges","DeleteContact","ClearForm","AllVariants"];export{p as AllVariants,m as ClearForm,a as DangerConfirm,t as DangerLoading,s as DangerWithCustomKeyword,c as DeleteContact,o as SimpleConfirm,r as SimpleLoading,n as SimpleWithCustomButtons,d as UnsavedChanges,i as WithSecondaryButton,l as WithSecondaryLoading,ce as __namedExportsOrder,de as default};
