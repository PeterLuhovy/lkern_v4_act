import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as r}from"./Card-Bpo4PN3V.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";const J={title:"Components/Layout/Card",component:r,tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","outlined","elevated","accent"],description:"Visual variant of the card"},disableHover:{control:"boolean",description:"Disable hover effects"},onClick:{action:"clicked",description:"Click handler (makes card interactive)"}},parameters:{docs:{description:{component:"Versatile card container for content grouping with multiple visual variants."}}}},n={args:{variant:"default",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Default Card"}),e.jsx("p",{style:{margin:0},children:"Standard card with subtle background."})]})}},a={args:{variant:"outlined",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Outlined Card"}),e.jsx("p",{style:{margin:0},children:"Card with visible border, transparent background."})]})}},i={args:{variant:"elevated",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Elevated Card"}),e.jsx("p",{style:{margin:0},children:"Card with shadow for depth and prominence."})]})}},t={args:{variant:"accent",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Accent Card"}),e.jsx("p",{style:{margin:0},children:"Card with accent border (purple) for emphasis."})]})}},d={args:{variant:"elevated",onClick:()=>alert("Card clicked!"),children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Clickable Card"}),e.jsx("p",{style:{margin:0},children:"Click me! Card with hover effects and pointer cursor."})]})}},s={args:{variant:"default",disableHover:!0,children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Non-Interactive Card"}),e.jsx("p",{style:{margin:0},children:"Card with hover effects disabled."})]})}},l={args:{variant:"elevated",children:e.jsxs("div",{children:[e.jsx("div",{style:{height:"160px",background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"48px"},children:"🖼️"}),e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Card with Image"}),e.jsx("p",{style:{margin:0},children:"Card containing image or visual header."})]})]})}},p={args:{variant:"outlined",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0"},children:"Shopping List"}),e.jsxs("ul",{style:{margin:0,paddingLeft:"20px"},children:[e.jsx("li",{children:"Bread"}),e.jsx("li",{children:"Milk"}),e.jsx("li",{children:"Eggs"}),e.jsx("li",{children:"Cheese"})]})]})}},c={args:{variant:"default",children:e.jsxs("div",{children:[e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h3",{style:{margin:"0 0 8px 0"},children:"Card Title"}),e.jsx("p",{style:{margin:0},children:"Card content with footer section below."})]}),e.jsxs("div",{style:{borderTop:"1px solid var(--theme-border, #e0e0e0)",padding:"12px 16px",display:"flex",justifyContent:"space-between",fontSize:"14px",color:"var(--theme-text-muted, #757575)"},children:[e.jsx("span",{children:"Last updated: 2025-12-16"}),e.jsx("span",{children:"👁️ 42 views"})]})]})}},o={render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"16px",maxWidth:"800px"},children:[e.jsx(r,{variant:"default",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Default"}),e.jsx("p",{style:{margin:0,fontSize:"14px"},children:"Standard variant"})]})}),e.jsx(r,{variant:"outlined",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Outlined"}),e.jsx("p",{style:{margin:0,fontSize:"14px"},children:"Border variant"})]})}),e.jsx(r,{variant:"elevated",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Elevated"}),e.jsx("p",{style:{margin:0,fontSize:"14px"},children:"Shadow variant"})]})}),e.jsx(r,{variant:"accent",children:e.jsxs("div",{style:{padding:"16px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Accent"}),e.jsx("p",{style:{margin:0,fontSize:"14px"},children:"Purple border variant"})]})})]}),parameters:{docs:{description:{story:"All available card variants displayed in a grid."}}}};var h,g,x;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    children: <div style={{
      padding: '16px'
    }}>\r
        <h3 style={{
        margin: '0 0 8px 0'
      }}>Default Card</h3>\r
        <p style={{
        margin: 0
      }}>Standard card with subtle background.</p>\r
      </div>
  }
}`,...(x=(g=n.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var m,v,y;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    children: <div style={{
      padding: '16px'
    }}>\r
        <h3 style={{
        margin: '0 0 8px 0'
      }}>Outlined Card</h3>\r
        <p style={{
        margin: 0
      }}>Card with visible border, transparent background.</p>\r
      </div>
  }
}`,...(y=(v=a.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var u,C,f;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    children: <div style={{
      padding: '16px'
    }}>\r
        <h3 style={{
        margin: '0 0 8px 0'
      }}>Elevated Card</h3>\r
        <p style={{
        margin: 0
      }}>Card with shadow for depth and prominence.</p>\r
      </div>
  }
}`,...(f=(C=i.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};var j,b,S;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    variant: 'accent',
    children: <div style={{
      padding: '16px'
    }}>\r
        <h3 style={{
        margin: '0 0 8px 0'
      }}>Accent Card</h3>\r
        <p style={{
        margin: 0
      }}>Card with accent border (purple) for emphasis.</p>\r
      </div>
  }
}`,...(S=(b=t.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var w,k,z;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    onClick: () => alert('Card clicked!'),
    children: <div style={{
      padding: '16px'
    }}>\r
        <h3 style={{
        margin: '0 0 8px 0'
      }}>Clickable Card</h3>\r
        <p style={{
        margin: 0
      }}>Click me! Card with hover effects and pointer cursor.</p>\r
      </div>
  }
}`,...(z=(k=d.parameters)==null?void 0:k.docs)==null?void 0:z.source}}};var A,E,L;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    disableHover: true,
    children: <div style={{
      padding: '16px'
    }}>\r
        <h3 style={{
        margin: '0 0 8px 0'
      }}>Non-Interactive Card</h3>\r
        <p style={{
        margin: 0
      }}>Card with hover effects disabled.</p>\r
      </div>
  }
}`,...(L=(E=s.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var I,W,D;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    children: <div>\r
        <div style={{
        height: '160px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '48px'
      }}>\r
          🖼️\r
        </div>\r
        <div style={{
        padding: '16px'
      }}>\r
          <h3 style={{
          margin: '0 0 8px 0'
        }}>Card with Image</h3>\r
          <p style={{
          margin: 0
        }}>Card containing image or visual header.</p>\r
        </div>\r
      </div>
  }
}`,...(D=(W=l.parameters)==null?void 0:W.docs)==null?void 0:D.source}}};var O,T,H;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    children: <div style={{
      padding: '16px'
    }}>\r
        <h3 style={{
        margin: '0 0 12px 0'
      }}>Shopping List</h3>\r
        <ul style={{
        margin: 0,
        paddingLeft: '20px'
      }}>\r
          <li>Bread</li>\r
          <li>Milk</li>\r
          <li>Eggs</li>\r
          <li>Cheese</li>\r
        </ul>\r
      </div>
  }
}`,...(H=(T=p.parameters)==null?void 0:T.docs)==null?void 0:H.source}}};var B,N,V;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    children: <div>\r
        <div style={{
        padding: '16px'
      }}>\r
          <h3 style={{
          margin: '0 0 8px 0'
        }}>Card Title</h3>\r
          <p style={{
          margin: 0
        }}>Card content with footer section below.</p>\r
        </div>\r
        <div style={{
        borderTop: '1px solid var(--theme-border, #e0e0e0)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: 'var(--theme-text-muted, #757575)'
      }}>\r
          <span>Last updated: 2025-12-16</span>\r
          <span>👁️ 42 views</span>\r
        </div>\r
      </div>
  }
}`,...(V=(N=c.parameters)==null?void 0:N.docs)==null?void 0:V.source}}};var F,M,P;o.parameters={...o.parameters,docs:{...(F=o.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    maxWidth: '800px'
  }}>\r
      <Card variant="default">\r
        <div style={{
        padding: '16px'
      }}>\r
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Default</h4>\r
          <p style={{
          margin: 0,
          fontSize: '14px'
        }}>Standard variant</p>\r
        </div>\r
      </Card>\r
      <Card variant="outlined">\r
        <div style={{
        padding: '16px'
      }}>\r
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Outlined</h4>\r
          <p style={{
          margin: 0,
          fontSize: '14px'
        }}>Border variant</p>\r
        </div>\r
      </Card>\r
      <Card variant="elevated">\r
        <div style={{
        padding: '16px'
      }}>\r
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Elevated</h4>\r
          <p style={{
          margin: 0,
          fontSize: '14px'
        }}>Shadow variant</p>\r
        </div>\r
      </Card>\r
      <Card variant="accent">\r
        <div style={{
        padding: '16px'
      }}>\r
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Accent</h4>\r
          <p style={{
          margin: 0,
          fontSize: '14px'
        }}>Purple border variant</p>\r
        </div>\r
      </Card>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available card variants displayed in a grid.'
      }
    }
  }
}`,...(P=(M=o.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};const K=["Default","Outlined","Elevated","Accent","Clickable","NoHover","WithImage","WithList","WithFooter","AllVariants"];export{t as Accent,o as AllVariants,d as Clickable,n as Default,i as Elevated,s as NoHover,a as Outlined,c as WithFooter,l as WithImage,p as WithList,K as __namedExportsOrder,J as default};
