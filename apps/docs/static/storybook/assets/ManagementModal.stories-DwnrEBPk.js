import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as h,R as ze}from"./index-BKyFwriW.js";import{u as Be,M as He,C as b}from"./ConfirmModal-Ds9lIxjL.js";import{B as l}from"./Button-gnwGUMlA.js";import{E as Ee}from"./EmptyState-c1ESi13i.js";import{u as We}from"./ToastContext-ErSnUSL6.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./DebugBar-C6YrkoDS.js";import"./Input-CFoEo-oh.js";import"./classNames-CN4lTu6a.js";import"./FormField-7Fj67rB9.js";import"./InfoHint-TbK9iuJy.js";const Pe="ManagementModal-module__content___-RxKQ",Oe="ManagementModal-module__addButton___A1xYR",we="ManagementModal-module__itemsList___kgCbv",z={content:Pe,addButton:Oe,itemsList:we},_e=({isOpen:t,onClose:o,onSave:a,hasUnsavedChanges:n=!1,title:d,modalId:m,parentModalId:I,items:r,renderItem:ie,onEdit:H,onDelete:E,editHint:se,deleteHint:ae,enablePrimary:y=!1,primaryItemId:p,onSetPrimary:W,primaryHint:de,getItemId:v=i=>i.id,onDeleteAll:re,deleteAllTitle:ce,deleteAllMessage:me,emptyStateMessage:pe,emptyStateIcon:ge="📭",addButtonText:xe,onAdd:ye,maxWidth:ve="700px",maxHeight:Re="80vh",children:Ve,bottomContent:he})=>{const{t:i}=We(),c=Be(),[ue,D]=h.useState(!1),[fe,A]=h.useState(!1),[P,O]=h.useState(null),g=!r||r.length===0,Se=ze.useMemo(()=>{if(!y||!p||g)return r;const s=r.find(x=>v(x)===p),w=r.filter(x=>v(x)!==p);return s?[s,...w]:r},[r,y,p,v,g]),Ce=h.useCallback(()=>{console.log("[ManagementModal v2.0] handleCloseWithConfirm called, hasUnsavedChanges:",n),n?(console.log("[ManagementModal v2.0] Showing unsaved changes confirmation..."),c.confirm({}).then(s=>{console.log("[ManagementModal v2.0] Confirmation result:",s),s?(console.log("[ManagementModal v2.0] User confirmed - closing modal"),o()):console.log("[ManagementModal v2.0] User cancelled - staying in modal")})):(console.log("[ManagementModal v2.0] No unsaved changes - closing directly"),o())},[n,c,o]),Me=()=>{r&&r.length>0&&D(!0)},ke=()=>{re(),D(!1)},je=s=>{H&&H(s)},Ie=s=>{O(s),A(!0)},De=()=>{E&&P!==null&&E(P),O(null),A(!1)},Ae=s=>{W&&W(s)};return e.jsxs(e.Fragment,{children:[e.jsx(He,{isOpen:t,onClose:o,onConfirm:a,hasUnsavedChanges:n,modalId:m,parentModalId:I,title:d,maxWidth:ve,footer:{left:e.jsx(l,{variant:"danger-subtle",onClick:Me,disabled:g,children:i("components.modalV3.managementModal.deleteAllButton")}),right:e.jsxs(e.Fragment,{children:[e.jsxs(l,{variant:"secondary",onClick:()=>{console.log("[ManagementModal v2.0] Cancel button clicked - calling handleCloseWithConfirm"),console.log("[ManagementModal v2.0] hasUnsavedChanges:",n),Ce()},children:[i("common.cancel")," "]}),e.jsx(l,{variant:"primary",onClick:a,children:i("common.save")})]})},children:e.jsxs("div",{className:z.content,children:[g&&e.jsx(Ee,{title:pe||i("components.modalV3.managementModal.emptyState.message"),icon:ge}),!g&&e.jsx("div",{className:z.itemsList,children:Se.map((s,w)=>{const x=v(s),be=y&&x===p;return ie(s,{onEdit:je,onDelete:Ie,editHint:se||i("components.modalV3.managementModal.editHint"),deleteHint:ae||i("components.modalV3.managementModal.deleteHint"),isPrimary:be,onSetPrimary:y?Ae:void 0,primaryHint:de||i("components.modalV3.managementModal.primaryHint")})})}),e.jsxs(l,{variant:"secondary",onClick:ye,fullWidth:!0,className:z.addButton,children:[e.jsx("span",{role:"img","aria-label":"plus",children:"➕"})," ",xe||i("components.modalV3.managementModal.addButton")]}),he]})}),e.jsx(b,{isOpen:ue,onClose:()=>D(!1),onConfirm:ke,title:ce||i("components.modalV3.managementModal.deleteAll.title"),message:me||i("components.modalV3.managementModal.deleteAll.message"),parentModalId:m}),e.jsx(b,{isOpen:fe,onClose:()=>A(!1),onConfirm:De,title:i("components.modalV3.managementModal.deleteItem.title"),message:i("components.modalV3.managementModal.deleteItem.message"),parentModalId:m}),e.jsx(b,{isOpen:c.state.isOpen,onClose:c.handleCancel,onConfirm:c.handleConfirm,title:c.state.title,message:c.state.message,parentModalId:m})]})},et={title:"Components/Modals/ManagementModal",component:_e,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},hasUnsavedChanges:{control:"boolean",description:"Has unsaved changes"},enablePrimary:{control:"boolean",description:"Enable primary item support"}},parameters:{docs:{description:{component:"Generic list management modal with add/edit/delete all functionality. Supports primary item marking and empty states."}}}},oe=[{id:1,number:"+421 900 123 456",type:"Mobil"},{id:2,number:"+421 2 1234 5678",type:"Pracovný"},{id:3,number:"+421 900 999 888",type:"Domov"}],B=[{id:1,email:"jan.novak@example.com",type:"Pracovný"},{id:2,email:"jan.personal@gmail.com",type:"Osobný"}],u={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Changes saved"),onAdd:()=>console.log("Add clicked"),onDeleteAll:()=>console.log("Delete all clicked"),title:"Správa telefónov",modalId:"manage-phones",items:oe,emptyStateMessage:"Žiadne telefónne čísla",emptyStateIcon:"📱",renderItem:(t,{onEdit:o,onDelete:a,editHint:n,deleteHint:d})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:500},children:t.number}),e.jsx("div",{style:{fontSize:"14px",color:"#666"},children:t.type})]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(l,{size:"xs",variant:"ghost",onClick:()=>o(t.id),title:n,children:"✏️"}),e.jsx(l,{size:"xs",variant:"danger-subtle",onClick:()=>a(t.id),title:d,children:"🗑️"})]})]})}},f={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Changes saved"),onAdd:()=>console.log("Add clicked"),onDeleteAll:()=>console.log("Delete all clicked"),title:"Správa emailov",modalId:"manage-emails",items:B,emptyStateMessage:"Žiadne emailové adresy",emptyStateIcon:"📧",renderItem:(t,{onEdit:o,onDelete:a,editHint:n,deleteHint:d})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:500},children:t.email}),e.jsx("div",{style:{fontSize:"14px",color:"#666"},children:t.type})]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(l,{size:"xs",variant:"ghost",onClick:()=>o(t.id),title:n,children:"✏️"}),e.jsx(l,{size:"xs",variant:"danger-subtle",onClick:()=>a(t.id),title:d,children:"🗑️"})]})]})}},S={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Changes saved"),onAdd:()=>console.log("Add clicked"),onDeleteAll:()=>console.log("Delete all clicked"),onSetPrimary:t=>console.log("Set primary:",t),title:"Správa emailov (s primárnym)",modalId:"manage-emails-primary",items:B,enablePrimary:!0,primaryItemId:1,emptyStateMessage:"Žiadne emailové adresy",emptyStateIcon:"📧",renderItem:(t,{onEdit:o,onDelete:a,onSetPrimary:n,isPrimary:d,editHint:m,deleteHint:I,primaryHint:r})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{style:{fontWeight:500,display:"flex",alignItems:"center",gap:"8px"},children:[t.email,d&&e.jsx("span",{style:{fontSize:"12px"},children:"⭐ Primárny"})]}),e.jsx("div",{style:{fontSize:"14px",color:"#666"},children:t.type})]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[n&&e.jsx(l,{size:"xs",variant:"ghost",onClick:()=>n(t.id),title:r,children:d?"⭐":"☆"}),e.jsx(l,{size:"xs",variant:"ghost",onClick:()=>o(t.id),title:m,children:"✏️"}),e.jsx(l,{size:"xs",variant:"danger-subtle",onClick:()=>a(t.id),title:I,children:"🗑️"})]})]})}},C={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Changes saved"),onAdd:()=>console.log("Add clicked"),onDeleteAll:()=>console.log("Delete all clicked"),title:"Správa telefónov (prázdny)",modalId:"manage-phones-empty",items:[],emptyStateMessage:"Zatiaľ ste nepridali žiadne telefónne čísla",emptyStateIcon:"📱",renderItem:()=>null}},M={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Changes saved"),onAdd:()=>console.log("Add clicked"),onDeleteAll:()=>console.log("Delete all clicked"),title:"Správa emailov (neuložené zmeny)",modalId:"manage-emails-dirty",items:B,hasUnsavedChanges:!0,emptyStateMessage:"Žiadne emailové adresy",emptyStateIcon:"📧",renderItem:(t,{onEdit:o,onDelete:a,editHint:n,deleteHint:d})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:500},children:t.email}),e.jsx("div",{style:{fontSize:"14px",color:"#666"},children:t.type})]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(l,{size:"xs",variant:"ghost",onClick:()=>o(t.id),title:n,children:"✏️"}),e.jsx(l,{size:"xs",variant:"danger-subtle",onClick:()=>a(t.id),title:d,children:"🗑️"})]})]})},parameters:{docs:{description:{story:"Try closing the modal - you will see unsaved changes confirmation."}}}},k={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:()=>console.log("Changes saved"),onAdd:()=>console.log("Add clicked"),onDeleteAll:()=>console.log("Delete all clicked"),title:"Správa kontaktov (široký)",modalId:"manage-contacts-wide",items:oe,maxWidth:"900px",emptyStateMessage:"Žiadne kontakty",emptyStateIcon:"👤",renderItem:(t,{onEdit:o,onDelete:a,editHint:n,deleteHint:d})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontWeight:500},children:t.number}),e.jsx("div",{style:{fontSize:"14px",color:"#666"},children:t.type})]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(l,{size:"xs",variant:"ghost",onClick:()=>o(t.id),title:n,children:"✏️"}),e.jsx(l,{size:"xs",variant:"danger-subtle",onClick:()=>a(t.id),title:d,children:"🗑️"})]})]})}},j={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("h3",{children:"ManagementModal Features"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"✨ List Management"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Add, edit, delete items with confirmation dialogs."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"⭐ Primary Item"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Mark one item as primary (e.g., default email)."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"🗑️ Delete All"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Clear all items with danger confirmation."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"📭 Empty State"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Custom icon and message when list is empty."})]})]})]}),parameters:{docs:{description:{story:"ManagementModal key features overview."}}}};var _,R,V;u.parameters={...u.parameters,docs:{...(_=u.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa telefónov',
    modalId: 'manage-phones',
    items: samplePhones,
    emptyStateMessage: 'Žiadne telefónne čísla',
    emptyStateIcon: '📱',
    renderItem: (item, {
      onEdit,
      onDelete,
      editHint,
      deleteHint
    }) => <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0'
    }}>\r
        <div style={{
        flex: 1
      }}>\r
          <div style={{
          fontWeight: 500
        }}>{item.number}</div>\r
          <div style={{
          fontSize: '14px',
          color: '#666'
        }}>{item.type}</div>\r
        </div>\r
        <div style={{
        display: 'flex',
        gap: '8px'
      }}>\r
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>\r
            ✏️\r
          </Button>\r
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>\r
            🗑️\r
          </Button>\r
        </div>\r
      </div>
  }
}`,...(V=(R=u.parameters)==null?void 0:R.docs)==null?void 0:V.source}}};var T,F,L;f.parameters={...f.parameters,docs:{...(T=f.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa emailov',
    modalId: 'manage-emails',
    items: sampleEmails,
    emptyStateMessage: 'Žiadne emailové adresy',
    emptyStateIcon: '📧',
    renderItem: (item, {
      onEdit,
      onDelete,
      editHint,
      deleteHint
    }) => <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0'
    }}>\r
        <div style={{
        flex: 1
      }}>\r
          <div style={{
          fontWeight: 500
        }}>{item.email}</div>\r
          <div style={{
          fontSize: '14px',
          color: '#666'
        }}>{item.type}</div>\r
        </div>\r
        <div style={{
        display: 'flex',
        gap: '8px'
      }}>\r
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>\r
            ✏️\r
          </Button>\r
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>\r
            🗑️\r
          </Button>\r
        </div>\r
      </div>
  }
}`,...(L=(F=f.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var U,N,Z;S.parameters={...S.parameters,docs:{...(U=S.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    onSetPrimary: id => console.log('Set primary:', id),
    title: 'Správa emailov (s primárnym)',
    modalId: 'manage-emails-primary',
    items: sampleEmails,
    enablePrimary: true,
    primaryItemId: 1,
    emptyStateMessage: 'Žiadne emailové adresy',
    emptyStateIcon: '📧',
    renderItem: (item, {
      onEdit,
      onDelete,
      onSetPrimary,
      isPrimary,
      editHint,
      deleteHint,
      primaryHint
    }) => <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0'
    }}>\r
        <div style={{
        flex: 1
      }}>\r
          <div style={{
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>\r
            {item.email}\r
            {isPrimary && <span style={{
            fontSize: '12px'
          }}>⭐ Primárny</span>}\r
          </div>\r
          <div style={{
          fontSize: '14px',
          color: '#666'
        }}>{item.type}</div>\r
        </div>\r
        <div style={{
        display: 'flex',
        gap: '8px'
      }}>\r
          {onSetPrimary && <Button size="xs" variant="ghost" onClick={() => onSetPrimary(item.id)} title={primaryHint}>\r
              {isPrimary ? '⭐' : '☆'}\r
            </Button>}\r
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>\r
            ✏️\r
          </Button>\r
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>\r
            🗑️\r
          </Button>\r
        </div>\r
      </div>
  }
}`,...(Z=(N=S.parameters)==null?void 0:N.docs)==null?void 0:Z.source}}};var G,K,Q;C.parameters={...C.parameters,docs:{...(G=C.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa telefónov (prázdny)',
    modalId: 'manage-phones-empty',
    items: [],
    emptyStateMessage: 'Zatiaľ ste nepridali žiadne telefónne čísla',
    emptyStateIcon: '📱',
    renderItem: () => null
  }
}`,...(Q=(K=C.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var Y,$,q;M.parameters={...M.parameters,docs:{...(Y=M.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa emailov (neuložené zmeny)',
    modalId: 'manage-emails-dirty',
    items: sampleEmails,
    hasUnsavedChanges: true,
    emptyStateMessage: 'Žiadne emailové adresy',
    emptyStateIcon: '📧',
    renderItem: (item, {
      onEdit,
      onDelete,
      editHint,
      deleteHint
    }) => <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0'
    }}>\r
        <div style={{
        flex: 1
      }}>\r
          <div style={{
          fontWeight: 500
        }}>{item.email}</div>\r
          <div style={{
          fontSize: '14px',
          color: '#666'
        }}>{item.type}</div>\r
        </div>\r
        <div style={{
        display: 'flex',
        gap: '8px'
      }}>\r
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>\r
            ✏️\r
          </Button>\r
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>\r
            🗑️\r
          </Button>\r
        </div>\r
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Try closing the modal - you will see unsaved changes confirmation.'
      }
    }
  }
}`,...(q=($=M.parameters)==null?void 0:$.docs)==null?void 0:q.source}}};var J,X,ee;k.parameters={...k.parameters,docs:{...(J=k.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: () => console.log('Changes saved'),
    onAdd: () => console.log('Add clicked'),
    onDeleteAll: () => console.log('Delete all clicked'),
    title: 'Správa kontaktov (široký)',
    modalId: 'manage-contacts-wide',
    items: samplePhones,
    maxWidth: '900px',
    emptyStateMessage: 'Žiadne kontakty',
    emptyStateIcon: '👤',
    renderItem: (item, {
      onEdit,
      onDelete,
      editHint,
      deleteHint
    }) => <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0'
    }}>\r
        <div style={{
        flex: 1
      }}>\r
          <div style={{
          fontWeight: 500
        }}>{item.number}</div>\r
          <div style={{
          fontSize: '14px',
          color: '#666'
        }}>{item.type}</div>\r
        </div>\r
        <div style={{
        display: 'flex',
        gap: '8px'
      }}>\r
          <Button size="xs" variant="ghost" onClick={() => onEdit(item.id)} title={editHint}>\r
            ✏️\r
          </Button>\r
          <Button size="xs" variant="danger-subtle" onClick={() => onDelete(item.id)} title={deleteHint}>\r
            🗑️\r
          </Button>\r
        </div>\r
      </div>
  }
}`,...(ee=(X=k.parameters)==null?void 0:X.docs)==null?void 0:ee.source}}};var te,ne,le;j.parameters={...j.parameters,docs:{...(te=j.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>ManagementModal Features</h3>\r
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
          <h4>✨ List Management</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Add, edit, delete items with confirmation dialogs.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>⭐ Primary Item</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Mark one item as primary (e.g., default email).</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>🗑️ Delete All</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Clear all items with danger confirmation.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>📭 Empty State</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Custom icon and message when list is empty.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'ManagementModal key features overview.'
      }
    }
  }
}`,...(le=(ne=j.parameters)==null?void 0:ne.docs)==null?void 0:le.source}}};const tt=["ManagePhones","ManageEmails","WithPrimaryItem","EmptyState","WithUnsavedChanges","CustomMaxWidth","Features"];export{k as CustomMaxWidth,C as EmptyState,j as Features,f as ManageEmails,u as ManagePhones,S as WithPrimaryItem,M as WithUnsavedChanges,tt as __namedExportsOrder,et as default};
