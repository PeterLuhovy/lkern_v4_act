import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-BKyFwriW.js";import{M as Ke,C as Le}from"./ConfirmModal-Ds9lIxjL.js";import{B as U}from"./Button-gnwGUMlA.js";import{F as P}from"./FormField-7Fj67rB9.js";import{I as we}from"./Input-CFoEo-oh.js";import{T as Ne}from"./Textarea-CaCPejZY.js";import{S as Pe}from"./Select-WvzepR3_.js";import{u as Te}from"./ToastContext-ErSnUSL6.js";import{u as Oe}from"./useFormDirty-DiJri1G9.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./DebugBar-C6YrkoDS.js";import"./classNames-CN4lTu6a.js";import"./InfoHint-TbK9iuJy.js";const De="EntityEditModal-module__content___0LBMv",Re="EntityEditModal-module__grid___MlziD",Ae="EntityEditModal-module__stack___aT8pC",Be="EntityEditModal-module__fieldHalf___MjGC-",ze="EntityEditModal-module__fieldFull___gvdwB",Ge="EntityEditModal-module__footer___lrbdl",Ve="EntityEditModal-module__blurredField___SRfh3",qe="EntityEditModal-module__noEditAccess___XlIxI",g={content:De,grid:Re,stack:Ae,fieldHalf:Be,fieldFull:ze,footer:Ge,blurredField:Ve,noEditAccess:qe};function Ie({isOpen:i,onClose:r,onSave:D,entity:v,sectionId:p,config:o,permissionLevel:y,parentModalId:he,size:fe="md",maxWidth:xe="600px"}){const{t:a}=Te(),[d,R]=s.useState({}),[M,be]=s.useState({}),[h,j]=s.useState({}),[_,A]=s.useState(!1),[Fe,k]=s.useState(!1),m=s.useMemo(()=>o.sections.find(e=>e.id===p),[o.sections,p]),B=`entity-edit-${o.entityName}-${p}`,{isDirty:z}=Oe(M,d),G=s.useCallback(e=>o.permissions.canEdit(e,y),[o.permissions,y]),V=s.useCallback(e=>o.permissions.canView?o.permissions.canView(e,y):!0,[o.permissions,y]),q=s.useCallback(e=>{if(!o.permissions.getEditReasonKey)return;const t=o.permissions.getEditReasonKey(e,y);return t?a(t):void 0},[o.permissions,y,a]);s.useEffect(()=>{if(i&&v&&m){let e;o.initializeFormData?e=o.initializeFormData(v,p):(e={},m.fields.forEach(t=>{const l=v[t.name];if(t.name.includes(".")){const u=t.name.split(".");let c=v;for(const K of u)if(c&&typeof c=="object")c=c[K];else{c=void 0;break}e[t.name]=c??""}else e[t.name]=l??""})),R(e),be(e),j({})}},[i,v,m,o,p]);const I=s.useCallback((e,t)=>{R(l=>({...l,[e]:t})),h[e]&&j(l=>{const u={...l};return delete u[e],u})},[h]),$=s.useCallback((e,t)=>{if(e.required&&(t==null||t===""))return"validation.required";if(e.minLength&&typeof t=="string"&&t.length<e.minLength)return"validation.minLength";if(e.maxLength&&typeof t=="string"&&t.length>e.maxLength)return"validation.maxLength";if(e.validate)return e.validate(t,d)},[d]),W=s.useCallback(()=>{if(!m)return!1;const e={};return m.fields.forEach(t=>{const l=d[t.name],u=$(t,l);u&&(e[t.name]=u)}),j(e),Object.keys(e).length===0},[m,d,$]),H=s.useCallback(()=>{z?k(!0):r()},[z,r]),Ee=s.useCallback(()=>{k(!1),r()},[r]),Se=s.useCallback(()=>{k(!1)},[]),Ce=s.useCallback(async()=>{if(W()){A(!0);try{let e;if(o.extractChanges?e=o.extractChanges(d,v,p):(e={},Object.keys(d).forEach(l=>{d[l]!==M[l]&&(e[l]=d[l])})),Object.keys(e).length===0){r();return}await D(e,y)&&r()}finally{A(!1)}}},[W,o,d,v,p,M,D,y,r]),J=s.useCallback(e=>{if(e.type!=="select")return[];const t=e.options;return typeof t=="function"?t():t},[]),Me=s.useCallback(e=>{const t=d[e.name],l=h[e.name],u=l?a(l):void 0,c=e.disabled||!G(e.permissionField||e.name),K=e.blur&&!V(e.name),L=q(e.permissionField||e.name),w=[e.width==="full"?g.fieldFull:g.fieldHalf,K?g.blurredField:void 0,c&&!e.disabled?g.noEditAccess:void 0].filter(Boolean).join(" "),N={label:a(e.labelKey),required:e.required,error:u,value:String(t??""),onChange:ke=>I(e.name,ke.target.value),htmlFor:`edit-${e.name}`,reserveMessageSpace:!!(e.required||e.validate),labelHint:e.hintKey?a(e.hintKey):void 0,labelHintMaxWidth:e.hintMaxWidth,maxLength:e.maxLength};switch(e.type){case"text":case"email":case"url":case"number":case"date":case"datetime-local":return n.jsx("div",{className:w,children:n.jsx(P,{...N,children:n.jsx(we,{id:`edit-${e.name}`,type:e.type,placeholder:e.placeholderKey?a(e.placeholderKey):void 0,fullWidth:!0,disabled:c,title:L,min:e.min,max:e.max,maxLength:e.maxLength})})},e.name);case"textarea":return n.jsx("div",{className:w,children:n.jsx(P,{...N,children:n.jsx(Ne,{id:`edit-${e.name}`,rows:e.rows??4,placeholder:e.placeholderKey?a(e.placeholderKey):void 0,fullWidth:!0,disabled:c,title:L,maxLength:e.maxLength})})},e.name);case"select":return n.jsx("div",{className:w,children:n.jsx(P,{...N,children:n.jsx(Pe,{id:`edit-${e.name}`,options:J(e),fullWidth:!0,disabled:c,title:L})})},e.name);case"hidden":return null;default:return null}},[d,h,a,G,V,q,I,J]);if(!m)return console.error(`[EntityEditModal] Section "${p}" not found in config for "${o.entityName}"`),null;const je=Object.keys(h).length>0,_e=_||je;return n.jsxs(n.Fragment,{children:[n.jsxs(Ke,{isOpen:i,onClose:H,modalId:B,parentModalId:he,title:a(m.titleKey),size:fe,maxWidth:xe,children:[n.jsx("div",{className:g.content,children:n.jsx("div",{className:m.useGrid?g.grid:g.stack,children:m.fields.map(e=>Me(e))})}),n.jsxs("div",{className:g.footer,children:[n.jsx(U,{variant:"secondary",onClick:H,disabled:_,children:a("common.cancel")}),n.jsx(U,{variant:"primary",onClick:Ce,disabled:_e,loading:_,children:a("common.save")})]})]}),n.jsx(Le,{isOpen:Fe,onConfirm:Ee,onClose:Se,title:a("components.modalV3.confirmModal.unsavedChanges.title"),message:a("components.modalV3.confirmModal.unsavedChanges.message"),confirmButtonLabel:a("components.modalV3.confirmModal.unsavedChanges.confirmButton"),cancelButtonLabel:a("common.cancel"),parentModalId:B})]})}const gn={title:"Components/Modals/EntityEditModal",component:Ie,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},size:{control:"select",options:["sm","md","lg"],description:"Modal size"}},parameters:{docs:{description:{component:"Universal entity edit modal with configuration-driven fields. Supports multi-section editing with permission-based field access control."}}}},T={id:1,firstName:"Ján",lastName:"Novák",email:"jan.novak@example.com",phone:"+421 900 123 456",company:"BOSSystems s.r.o.",role:"Developer"},O=[{name:"firstName",labelKey:"Meno",type:"text",required:!0,width:"half"},{name:"lastName",labelKey:"Priezvisko",type:"text",required:!0,width:"half"},{name:"email",labelKey:"Email",type:"email",required:!0,width:"full"},{name:"phone",labelKey:"Telefón",type:"text",width:"full"}],$e={id:"basic",titleKey:"Základné údaje",fields:O,useGrid:!0},We={entityName:"contact",sections:[$e],permissions:{canEdit:()=>!0}},f={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:i=>(console.log("Saved changes:",i),Promise.resolve(!0)),entity:T,sectionId:"basic",config:We,permissionLevel:100}},He={id:"grid",titleKey:"Grid Layout (2 columns)",fields:O,useGrid:!0},Je={id:"stack",titleKey:"Stack Layout (1 column)",fields:O,useGrid:!1},x={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:i=>(console.log("Saved changes:",i),Promise.resolve(!0)),entity:T,sectionId:"grid",config:{entityName:"contact",sections:[He],permissions:{canEdit:()=>!0}},permissionLevel:100}},b={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:i=>(console.log("Saved changes:",i),Promise.resolve(!0)),entity:T,sectionId:"stack",config:{entityName:"contact",sections:[Je],permissions:{canEdit:()=>!0}},permissionLevel:100}},Ue=[{name:"textField",labelKey:"Text Field",type:"text",width:"half"},{name:"emailField",labelKey:"Email Field",type:"email",width:"half"},{name:"numberField",labelKey:"Number Field",type:"number",width:"half",min:0,max:100},{name:"dateField",labelKey:"Date Field",type:"date",width:"half"},{name:"selectField",labelKey:"Select Field",type:"select",width:"full",options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}]},{name:"textareaField",labelKey:"Textarea Field",type:"textarea",width:"full",rows:4}],F={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:i=>(console.log("Saved changes:",i),Promise.resolve(!0)),entity:{textField:"Text value",emailField:"test@example.com",numberField:42,dateField:"2025-12-16",selectField:"option1",textareaField:"Long text value..."},sectionId:"allTypes",config:{entityName:"demo",sections:[{id:"allTypes",titleKey:"All Field Types",fields:Ue,useGrid:!0}],permissions:{canEdit:()=>!0}},permissionLevel:100,size:"lg"}},Xe=[{name:"email",labelKey:"Email",type:"email",required:!0,width:"full",validate:i=>{if(!i||!i.includes("@"))return"validation.invalidEmail"}},{name:"age",labelKey:"Vek",type:"number",required:!0,width:"full",min:18,max:120,validate:i=>{if(parseInt(i,10)<18)return"validation.minAge"}}],E={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:i=>(console.log("Saved changes:",i),Promise.resolve(!0)),entity:{email:"invalid-email",age:15},sectionId:"validated",config:{entityName:"user",sections:[{id:"validated",titleKey:"Validovaný formulár",fields:Xe,useGrid:!1}],permissions:{canEdit:()=>!0}},permissionLevel:100}},Ze=[{name:"publicField",labelKey:"Public Field (all can edit)",type:"text",width:"full",permissionField:"publicField"},{name:"moderatorField",labelKey:"Moderator Field (moderator+ can edit)",type:"text",width:"full",permissionField:"moderatorField"},{name:"adminField",labelKey:"Admin Field (admin only)",type:"text",width:"full",permissionField:"adminField"}],S={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSave:i=>(console.log("Saved changes:",i),Promise.resolve(!0)),entity:{publicField:"Public value",moderatorField:"Moderator value",adminField:"Admin value"},sectionId:"permissions",config:{entityName:"demo",sections:[{id:"permissions",titleKey:"Permission-Based Fields",fields:Ze,useGrid:!1}],permissions:{canEdit:(i,r)=>i==="publicField"?r>=10:i==="moderatorField"?r>=50:i==="adminField"?r>=100:!0,getEditReasonKey:(i,r)=>{if(i==="moderatorField"&&r<50)return"permissions.moderatorRequired";if(i==="adminField"&&r<100)return"permissions.adminRequired"}}},permissionLevel:50},parameters:{docs:{description:{story:"Try changing permissionLevel in controls to see different field access (10=public, 50=moderator, 100=admin)."}}}},C={render:()=>n.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[n.jsx("h3",{children:"EntityEditModal Features"}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[n.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[n.jsx("h4",{children:"⚙️ Config-Driven"}),n.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Define fields via EntityEditConfig."})]}),n.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[n.jsx("h4",{children:"🔐 Permissions"}),n.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Fine-grained field-level access control."})]}),n.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[n.jsx("h4",{children:"📐 Grid/Stack"}),n.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Choose 1-column or 2-column layout."})]}),n.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[n.jsx("h4",{children:"✅ Validation"}),n.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Custom validation per field."})]})]})]}),parameters:{docs:{description:{story:"EntityEditModal key features overview."}}}};var X,Z,Q;f.parameters={...f.parameters,docs:{...(X=f.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: changes => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: mockContact,
    sectionId: 'basic',
    config: basicContactConfig,
    permissionLevel: 100
  }
}`,...(Q=(Z=f.parameters)==null?void 0:Z.docs)==null?void 0:Q.source}}};var Y,ee,ne;x.parameters={...x.parameters,docs:{...(Y=x.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: changes => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: mockContact,
    sectionId: 'grid',
    config: {
      entityName: 'contact',
      sections: [gridSection],
      permissions: {
        canEdit: () => true
      }
    },
    permissionLevel: 100
  }
}`,...(ne=(ee=x.parameters)==null?void 0:ee.docs)==null?void 0:ne.source}}};var te,ie,se;b.parameters={...b.parameters,docs:{...(te=b.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: changes => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: mockContact,
    sectionId: 'stack',
    config: {
      entityName: 'contact',
      sections: [stackSection],
      permissions: {
        canEdit: () => true
      }
    },
    permissionLevel: 100
  }
}`,...(se=(ie=b.parameters)==null?void 0:ie.docs)==null?void 0:se.source}}};var oe,re,ae;F.parameters={...F.parameters,docs:{...(oe=F.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: changes => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: {
      textField: 'Text value',
      emailField: 'test@example.com',
      numberField: 42,
      dateField: '2025-12-16',
      selectField: 'option1',
      textareaField: 'Long text value...'
    },
    sectionId: 'allTypes',
    config: {
      entityName: 'demo',
      sections: [{
        id: 'allTypes',
        titleKey: 'All Field Types',
        fields: allFieldTypesFields,
        useGrid: true
      }],
      permissions: {
        canEdit: () => true
      }
    },
    permissionLevel: 100,
    size: 'lg'
  }
}`,...(ae=(re=F.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var le,de,ce;E.parameters={...E.parameters,docs:{...(le=E.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: changes => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: {
      email: 'invalid-email',
      age: 15
    },
    sectionId: 'validated',
    config: {
      entityName: 'user',
      sections: [{
        id: 'validated',
        titleKey: 'Validovaný formulár',
        fields: validatedFields,
        useGrid: false
      }],
      permissions: {
        canEdit: () => true
      }
    },
    permissionLevel: 100
  }
}`,...(ce=(de=E.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var me,ue,pe;S.parameters={...S.parameters,docs:{...(me=S.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSave: changes => {
      console.log('Saved changes:', changes);
      return Promise.resolve(true);
    },
    entity: {
      publicField: 'Public value',
      moderatorField: 'Moderator value',
      adminField: 'Admin value'
    },
    sectionId: 'permissions',
    config: {
      entityName: 'demo',
      sections: [{
        id: 'permissions',
        titleKey: 'Permission-Based Fields',
        fields: permissionFields,
        useGrid: false
      }],
      permissions: {
        canEdit: (fieldName, permissionLevel) => {
          // Public: level 10+
          if (fieldName === 'publicField') return permissionLevel >= 10;
          // Moderator: level 50+
          if (fieldName === 'moderatorField') return permissionLevel >= 50;
          // Admin: level 100+
          if (fieldName === 'adminField') return permissionLevel >= 100;
          return true;
        },
        getEditReasonKey: (fieldName, permissionLevel) => {
          if (fieldName === 'moderatorField' && permissionLevel < 50) {
            return 'permissions.moderatorRequired';
          }
          if (fieldName === 'adminField' && permissionLevel < 100) {
            return 'permissions.adminRequired';
          }
          return undefined;
        }
      }
    },
    permissionLevel: 50 // Moderator level
  },
  parameters: {
    docs: {
      description: {
        story: 'Try changing permissionLevel in controls to see different field access (10=public, 50=moderator, 100=admin).'
      }
    }
  }
}`,...(pe=(ue=S.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var ye,ge,ve;C.parameters={...C.parameters,docs:{...(ye=C.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>EntityEditModal Features</h3>\r
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
          <h4>⚙️ Config-Driven</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Define fields via EntityEditConfig.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>🔐 Permissions</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Fine-grained field-level access control.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>📐 Grid/Stack</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Choose 1-column or 2-column layout.</p>\r
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
        }}>Custom validation per field.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'EntityEditModal key features overview.'
      }
    }
  }
}`,...(ve=(ge=C.parameters)==null?void 0:ge.docs)==null?void 0:ve.source}}};const vn=["BasicContact","GridLayout","StackLayout","AllFieldTypes","WithValidation","PermissionBasedAccess","Features"];export{F as AllFieldTypes,f as BasicContact,C as Features,x as GridLayout,S as PermissionBasedAccess,b as StackLayout,E as WithValidation,vn as __namedExportsOrder,gn as default};
