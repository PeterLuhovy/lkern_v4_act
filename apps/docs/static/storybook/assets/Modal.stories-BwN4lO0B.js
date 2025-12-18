import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{M as xe}from"./ConfirmModal-Ds9lIxjL.js";import{B as o}from"./Button-gnwGUMlA.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./ToastContext-ErSnUSL6.js";import"./DebugBar-C6YrkoDS.js";import"./Input-CFoEo-oh.js";import"./classNames-CN4lTu6a.js";import"./FormField-7Fj67rB9.js";import"./InfoHint-TbK9iuJy.js";const ke={title:"Components/Modals/Modal",component:xe,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},size:{control:"select",options:["sm","md","lg"],description:"Modal size"},alignment:{control:"select",options:["top","center","bottom"],description:"Vertical alignment"},closeOnBackdropClick:{control:"boolean",description:"Close on backdrop click"},showCloseButton:{control:"boolean",description:"Show X close button"},loading:{control:"boolean",description:"Loading state"},disableDrag:{control:"boolean",description:"Disable drag"},hasUnsavedChanges:{control:"boolean",description:"Has unsaved changes"}},parameters:{docs:{description:{component:"Production modal component with drag & drop, nested modals, and pessimistic locking support."}}}},n={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"default-modal",title:"Default Modal",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This is a default modal with basic content."})})}},l={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"footer-modal",title:"Modal with Footer",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal has a footer with action buttons."})}),footer:e.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[e.jsx(o,{variant:"secondary",children:"Cancel"}),e.jsx(o,{variant:"primary",children:"Save"})]})}},a={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"enhanced-footer-modal",title:"Enhanced Footer",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal uses enhanced footer with left/right slots."})}),footer:{left:e.jsx(o,{variant:"danger",children:"Delete"}),right:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"secondary",children:"Cancel"}),e.jsx(o,{variant:"primary",children:"Save"})]})}}},s={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"small-modal",title:"Small Modal (400px)",size:"sm",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This is a small modal (400px width)."})})}},d={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"medium-modal",title:"Medium Modal (600px)",size:"md",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This is a medium modal (600px width)."})})}},r={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"large-modal",title:"Large Modal (800px)",size:"lg",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This is a large modal (800px width)."})})}},t={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"top-modal",title:"Top Aligned",alignment:"top",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal is aligned to the top."})})}},i={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"center-modal",title:"Center Aligned",alignment:"center",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal is aligned to the center (default)."})})}},c={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"bottom-modal",title:"Bottom Aligned",alignment:"bottom",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal is aligned to the bottom."})})}},p={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"loading-modal",title:"Loading Modal",loading:!0}},m={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"unsaved-modal",title:"Unsaved Changes",hasUnsavedChanges:!0,children:e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("p",{children:"Try closing this modal with ESC or X button."}),e.jsx("p",{children:"You will see an unsaved changes confirmation."})]})}},g={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"no-close-modal",title:"No Close Button",showCloseButton:!1,children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal has no X close button."})})}},h={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"backdrop-close-modal",title:"Close on Backdrop Click",closeOnBackdropClick:!0,children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"Click outside the modal to close it."})})}},u={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"draggable-modal",title:"Draggable Modal - Grab and Drag the Header",children:e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("p",{children:"Click and drag the header to move this modal around."}),e.jsx("p",{children:"The cursor changes to a hand when hovering over the header."})]})}},x={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"no-drag-modal",title:"Drag Disabled",disableDrag:!0,children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal cannot be dragged."})})}},v={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"custom-width-modal",title:"Custom Max Width (1000px)",maxWidth:"1000px",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"This modal has a custom max width of 1000px."})})}},C={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[e.jsx("p",{style:{textAlign:"center",fontSize:"14px",color:"#666"},children:"Note: In Storybook, only one modal can be shown at a time. Click through the size examples above."}),e.jsx(xe,{isOpen:!0,onClose:()=>console.log("Modal closed"),modalId:"gallery-sm",title:"Small (400px)",size:"sm",children:e.jsx("div",{style:{padding:"20px"},children:e.jsx("p",{children:"Small modal content"})})})]}),parameters:{docs:{description:{story:"All available modal sizes: sm (400px), md (600px), lg (800px)."}}}};var y,M,b;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'default-modal',
    title: 'Default Modal',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This is a default modal with basic content.</p>\r
      </div>
  }
}`,...(b=(M=n.parameters)==null?void 0:M.docs)==null?void 0:b.source}}};var f,j,S;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'footer-modal',
    title: 'Modal with Footer',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal has a footer with action buttons.</p>\r
      </div>,
    footer: <div style={{
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end'
    }}>\r
        <Button variant="secondary">Cancel</Button>\r
        <Button variant="primary">Save</Button>\r
      </div>
  }
}`,...(S=(j=l.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var O,I,T;a.parameters={...a.parameters,docs:{...(O=a.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'enhanced-footer-modal',
    title: 'Enhanced Footer',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal uses enhanced footer with left/right slots.</p>\r
      </div>,
    footer: {
      left: <Button variant="danger">Delete</Button>,
      right: <>\r
          <Button variant="secondary">Cancel</Button>\r
          <Button variant="primary">Save</Button>\r
        </>
    }
  }
}`,...(T=(I=a.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};var w,B,k;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'small-modal',
    title: 'Small Modal (400px)',
    size: 'sm',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This is a small modal (400px width).</p>\r
      </div>
  }
}`,...(k=(B=s.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};var D,z,A;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'medium-modal',
    title: 'Medium Modal (600px)',
    size: 'md',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This is a medium modal (600px width).</p>\r
      </div>
  }
}`,...(A=(z=d.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var W,F,L;r.parameters={...r.parameters,docs:{...(W=r.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'large-modal',
    title: 'Large Modal (800px)',
    size: 'lg',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This is a large modal (800px width).</p>\r
      </div>
  }
}`,...(L=(F=r.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var E,U,N;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'top-modal',
    title: 'Top Aligned',
    alignment: 'top',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal is aligned to the top.</p>\r
      </div>
  }
}`,...(N=(U=t.parameters)==null?void 0:U.docs)==null?void 0:N.source}}};var X,H,G;i.parameters={...i.parameters,docs:{...(X=i.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'center-modal',
    title: 'Center Aligned',
    alignment: 'center',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal is aligned to the center (default).</p>\r
      </div>
  }
}`,...(G=(H=i.parameters)==null?void 0:H.docs)==null?void 0:G.source}}};var Y,_,P;c.parameters={...c.parameters,docs:{...(Y=c.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'bottom-modal',
    title: 'Bottom Aligned',
    alignment: 'bottom',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal is aligned to the bottom.</p>\r
      </div>
  }
}`,...(P=(_=c.parameters)==null?void 0:_.docs)==null?void 0:P.source}}};var R,V,q;p.parameters={...p.parameters,docs:{...(R=p.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'loading-modal',
    title: 'Loading Modal',
    loading: true
  }
}`,...(q=(V=p.parameters)==null?void 0:V.docs)==null?void 0:q.source}}};var J,K,Q;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'unsaved-modal',
    title: 'Unsaved Changes',
    hasUnsavedChanges: true,
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>Try closing this modal with ESC or X button.</p>\r
        <p>You will see an unsaved changes confirmation.</p>\r
      </div>
  }
}`,...(Q=(K=m.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var Z,$,ee;g.parameters={...g.parameters,docs:{...(Z=g.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'no-close-modal',
    title: 'No Close Button',
    showCloseButton: false,
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal has no X close button.</p>\r
      </div>
  }
}`,...(ee=($=g.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var oe,ne,le;h.parameters={...h.parameters,docs:{...(oe=h.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'backdrop-close-modal',
    title: 'Close on Backdrop Click',
    closeOnBackdropClick: true,
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>Click outside the modal to close it.</p>\r
      </div>
  }
}`,...(le=(ne=h.parameters)==null?void 0:ne.docs)==null?void 0:le.source}}};var ae,se,de;u.parameters={...u.parameters,docs:{...(ae=u.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'draggable-modal',
    title: 'Draggable Modal - Grab and Drag the Header',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>Click and drag the header to move this modal around.</p>\r
        <p>The cursor changes to a hand when hovering over the header.</p>\r
      </div>
  }
}`,...(de=(se=u.parameters)==null?void 0:se.docs)==null?void 0:de.source}}};var re,te,ie;x.parameters={...x.parameters,docs:{...(re=x.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'no-drag-modal',
    title: 'Drag Disabled',
    disableDrag: true,
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal cannot be dragged.</p>\r
      </div>
  }
}`,...(ie=(te=x.parameters)==null?void 0:te.docs)==null?void 0:ie.source}}};var ce,pe,me;v.parameters={...v.parameters,docs:{...(ce=v.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    modalId: 'custom-width-modal',
    title: 'Custom Max Width (1000px)',
    maxWidth: '1000px',
    children: <div style={{
      padding: '20px'
    }}>\r
        <p>This modal has a custom max width of 1000px.</p>\r
      </div>
  }
}`,...(me=(pe=v.parameters)==null?void 0:pe.docs)==null?void 0:me.source}}};var ge,he,ue;C.parameters={...C.parameters,docs:{...(ge=C.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }}>\r
      <p style={{
      textAlign: 'center',
      fontSize: '14px',
      color: '#666'
    }}>\r
        Note: In Storybook, only one modal can be shown at a time. Click through the size examples above.\r
      </p>\r
      <Modal isOpen={true} onClose={() => console.log('Modal closed')} modalId="gallery-sm" title="Small (400px)" size="sm">\r
        <div style={{
        padding: '20px'
      }}>\r
          <p>Small modal content</p>\r
        </div>\r
      </Modal>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available modal sizes: sm (400px), md (600px), lg (800px).'
      }
    }
  }
}`,...(ue=(he=C.parameters)==null?void 0:he.docs)==null?void 0:ue.source}}};const De=["Default","WithFooter","WithEnhancedFooter","SizeSmall","SizeMedium","SizeLarge","AlignmentTop","AlignmentCenter","AlignmentBottom","Loading","WithUnsavedChanges","NoCloseButton","CloseOnBackdropClick","Draggable","DragDisabled","CustomMaxWidth","AllSizes"];export{c as AlignmentBottom,i as AlignmentCenter,t as AlignmentTop,C as AllSizes,h as CloseOnBackdropClick,v as CustomMaxWidth,n as Default,x as DragDisabled,u as Draggable,p as Loading,g as NoCloseButton,r as SizeLarge,d as SizeMedium,s as SizeSmall,a as WithEnhancedFooter,l as WithFooter,m as WithUnsavedChanges,De as __namedExportsOrder,ke as default};
