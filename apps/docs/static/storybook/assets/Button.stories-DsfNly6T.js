import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./Button-gnwGUMlA.js";import"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const fr={title:"Components/Button",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","danger","danger-subtle","ghost","success"],description:"Visual style variant"},size:{control:"select",options:["xs","small","medium","large"],description:"Button size"},loading:{control:"boolean",description:"Loading state"},disabled:{control:"boolean",description:"Disabled state"},fullWidth:{control:"boolean",description:"Full width button"},debug:{control:"boolean",description:"Debug styling (orange gradient)"},iconPosition:{control:"select",options:["left","right"],description:"Icon position relative to text"}},parameters:{docs:{description:{component:"Reusable button component with multiple variants, sizes, and states."}}}},e={args:{variant:"primary",children:"Primary Button"}},s={args:{variant:"secondary",children:"Secondary Button"}},n={args:{variant:"danger",children:"Delete"}},t={args:{variant:"danger-subtle",children:"Cancel"}},i={args:{variant:"ghost",children:"Ghost Button"}},o={args:{variant:"success",children:"Confirm"}},c={args:{variant:"primary",size:"xs",children:"Extra Small"}},d={args:{variant:"primary",size:"small",children:"Small"}},l={args:{variant:"primary",size:"medium",children:"Medium"}},m={args:{variant:"primary",size:"large",children:"Large"}},p={args:{variant:"primary",loading:!0,children:"Saving..."}},u={args:{variant:"primary",disabled:!0,children:"Disabled"}},g={args:{variant:"primary",fullWidth:!0,children:"Full Width Button"},decorators:[vr=>r.jsx("div",{style:{width:"400px"},children:r.jsx(vr,{})})]},h={args:{variant:"primary",icon:"💾",iconPosition:"left",children:"Save"}},v={args:{variant:"secondary",icon:"→",iconPosition:"right",children:"Next"}},y={render:()=>r.jsxs("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[r.jsx(a,{variant:"primary",children:"Primary"}),r.jsx(a,{variant:"secondary",children:"Secondary"}),r.jsx(a,{variant:"danger",children:"Danger"}),r.jsx(a,{variant:"danger-subtle",children:"Danger Subtle"}),r.jsx(a,{variant:"ghost",children:"Ghost"}),r.jsx(a,{variant:"success",children:"Success"})]}),parameters:{docs:{description:{story:"All available button variants side by side."}}}},S={render:()=>r.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[r.jsx(a,{variant:"primary",size:"xs",children:"XS"}),r.jsx(a,{variant:"primary",size:"small",children:"Small"}),r.jsx(a,{variant:"primary",size:"medium",children:"Medium"}),r.jsx(a,{variant:"primary",size:"large",children:"Large"})]}),parameters:{docs:{description:{story:"All available button sizes."}}}};var x,b,B;e.parameters={...e.parameters,docs:{...(x=e.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(B=(b=e.parameters)==null?void 0:b.docs)==null?void 0:B.source}}};var z,f,j;s.parameters={...s.parameters,docs:{...(z=s.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(j=(f=s.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var D,W,L;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Delete'
  }
}`,...(L=(W=n.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};var P,A,I;t.parameters={...t.parameters,docs:{...(P=t.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'danger-subtle',
    children: 'Cancel'
  }
}`,...(I=(A=t.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var w,G,M;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Ghost Button'
  }
}`,...(M=(G=i.parameters)==null?void 0:G.docs)==null?void 0:M.source}}};var C,F,E;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Confirm'
  }
}`,...(E=(F=o.parameters)==null?void 0:F.docs)==null?void 0:E.source}}};var R,X,V;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'xs',
    children: 'Extra Small'
  }
}`,...(V=(X=c.parameters)==null?void 0:X.docs)==null?void 0:V.source}}};var N,_,O;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small'
  }
}`,...(O=(_=d.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var T,k,q;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium'
  }
}`,...(q=(k=l.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var H,J,K;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large'
  }
}`,...(K=(J=m.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,Y;p.parameters={...p.parameters,docs:{...(Q=p.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    loading: true,
    children: 'Saving...'
  }
}`,...(Y=(U=p.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var Z,$,rr;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled'
  }
}`,...(rr=($=u.parameters)==null?void 0:$.docs)==null?void 0:rr.source}}};var ar,er,sr;g.parameters={...g.parameters,docs:{...(ar=g.parameters)==null?void 0:ar.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button'
  },
  decorators: [Story => <div style={{
    width: '400px'
  }}>\r
        <Story />\r
      </div>]
}`,...(sr=(er=g.parameters)==null?void 0:er.docs)==null?void 0:sr.source}}};var nr,tr,ir;h.parameters={...h.parameters,docs:{...(nr=h.parameters)==null?void 0:nr.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    icon: '💾',
    iconPosition: 'left',
    children: 'Save'
  }
}`,...(ir=(tr=h.parameters)==null?void 0:tr.docs)==null?void 0:ir.source}}};var or,cr,dr;v.parameters={...v.parameters,docs:{...(or=v.parameters)==null?void 0:or.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    icon: '→',
    iconPosition: 'right',
    children: 'Next'
  }
}`,...(dr=(cr=v.parameters)==null?void 0:cr.docs)==null?void 0:dr.source}}};var lr,mr,pr;y.parameters={...y.parameters,docs:{...(lr=y.parameters)==null?void 0:lr.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }}>\r
      <Button variant="primary">Primary</Button>\r
      <Button variant="secondary">Secondary</Button>\r
      <Button variant="danger">Danger</Button>\r
      <Button variant="danger-subtle">Danger Subtle</Button>\r
      <Button variant="ghost">Ghost</Button>\r
      <Button variant="success">Success</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available button variants side by side.'
      }
    }
  }
}`,...(pr=(mr=y.parameters)==null?void 0:mr.docs)==null?void 0:pr.source}}};var ur,gr,hr;S.parameters={...S.parameters,docs:{...(ur=S.parameters)==null?void 0:ur.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  }}>\r
      <Button variant="primary" size="xs">XS</Button>\r
      <Button variant="primary" size="small">Small</Button>\r
      <Button variant="primary" size="medium">Medium</Button>\r
      <Button variant="primary" size="large">Large</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes.'
      }
    }
  }
}`,...(hr=(gr=S.parameters)==null?void 0:gr.docs)==null?void 0:hr.source}}};const jr=["Primary","Secondary","Danger","DangerSubtle","Ghost","Success","SizeXS","SizeSmall","SizeMedium","SizeLarge","Loading","Disabled","FullWidth","WithIconLeft","WithIconRight","AllVariants","AllSizes"];export{S as AllSizes,y as AllVariants,n as Danger,t as DangerSubtle,u as Disabled,g as FullWidth,i as Ghost,p as Loading,e as Primary,s as Secondary,m as SizeLarge,l as SizeMedium,d as SizeSmall,c as SizeXS,o as Success,h as WithIconLeft,v as WithIconRight,jr as __namedExportsOrder,fr as default};
