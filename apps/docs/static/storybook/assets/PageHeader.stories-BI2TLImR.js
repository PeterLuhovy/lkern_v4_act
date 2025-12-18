import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as he}from"./index-BKyFwriW.js";import{u as be}from"./ToastContext-ErSnUSL6.js";import{l as He}from"./lkern-logo-Cn1Dyld1.js";import{B as t}from"./Button-gnwGUMlA.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const fe="PageHeader-module__pageHeader___rrgzD",xe="PageHeader-module__pageHeader__content___d2A6j",ve="PageHeader-module__pageHeader__left___RESZF",ye="PageHeader-module__pageHeader__right___-89mu",Le="PageHeader-module__pageHeader__logo___jefqe",Pe="PageHeader-module__pageHeader__logoImage___RnioV",Se="PageHeader-module__pageHeader__logoPlaceholder___xtmgY",je="PageHeader-module__pageHeader__rightLogoImg___J61eK",we="PageHeader-module__pageHeader__text___NkEw3",Ie="PageHeader-module__pageHeader__title___GbkY4",Ne="PageHeader-module__pageHeader__subtitle___tJ54i",Be="PageHeader-module__pageHeader__breadcrumbs___-kYzZ",We="PageHeader-module__pageHeader__breadcrumbSeparator___urPi8",Ce="PageHeader-module__pageHeader__breadcrumb___KKOLb",a={pageHeader:fe,pageHeader__content:xe,pageHeader__left:ve,pageHeader__right:ye,pageHeader__logo:Le,pageHeader__logoImage:Pe,pageHeader__logoPlaceholder:Se,pageHeader__rightLogoImg:je,pageHeader__text:we,pageHeader__title:Ie,pageHeader__subtitle:Ne,pageHeader__breadcrumbs:Be,pageHeader__breadcrumbSeparator:We,pageHeader__breadcrumb:Ce,"pageHeader__breadcrumb--clickable":"PageHeader-module__pageHeader__breadcrumb--clickable___c14FK","pageHeader__breadcrumb--active":"PageHeader-module__pageHeader__breadcrumb--active___8jLYk"},o=({title:pe,subtitle:v,breadcrumbs:f,showLogo:me=!1,logoIcon:s,showRightLogo:y=!0,children:L,className:ue=""})=>{const{t:x}=be();return e.jsx("div",{className:`${a.pageHeader} ${ue}`,children:e.jsxs("div",{className:a.pageHeader__content,children:[e.jsxs("div",{className:a.pageHeader__left,children:[me&&e.jsx("div",{className:a.pageHeader__logo,children:typeof s=="string"?e.jsx("img",{src:s,alt:x("components.pageHeader.logoAlt"),className:a.pageHeader__logoImage}):s||e.jsx("span",{className:a.pageHeader__logoPlaceholder,children:x("components.pageHeader.logoPlaceholder")})}),e.jsxs("div",{className:a.pageHeader__text,children:[e.jsx("h1",{className:a.pageHeader__title,children:pe}),v&&e.jsx("div",{className:a.pageHeader__subtitle,children:v}),f&&f.length>0&&e.jsx("nav",{className:a.pageHeader__breadcrumbs,"aria-label":x("components.pageHeader.breadcrumbsLabel"),children:f.map((r,P)=>{const S=!!(r.href||r.to||r.onClick),j=`${a.pageHeader__breadcrumb} ${r.isActive?a["pageHeader__breadcrumb--active"]:""} ${S?a["pageHeader__breadcrumb--clickable"]:""}`;return e.jsxs(he.Fragment,{children:[P>0&&e.jsx("span",{className:a.pageHeader__breadcrumbSeparator,"aria-hidden":"true",children:"/"}),S?e.jsx("a",{href:r.href||r.to||"#",className:j,"aria-current":r.isActive?"page":void 0,onClick:_e=>{r.onClick&&(r.to&&!r.href&&_e.preventDefault(),r.onClick())},children:r.name}):e.jsx("span",{className:j,"aria-current":r.isActive?"page":void 0,children:r.name})]},P)})})]})]}),(L||y)&&e.jsxs("div",{className:a.pageHeader__right,children:[L,y&&e.jsx("img",{src:He,alt:"L-KERN Logo",className:a.pageHeader__rightLogoImg})]})]})})},Oe={title:"Components/Layout/PageHeader",component:o,tags:["autodocs"],argTypes:{title:{control:"text",description:"Page title (required)"},subtitle:{control:"text",description:"Optional subtitle below title"},showLogo:{control:"boolean",description:"Show logo on left side"},showRightLogo:{control:"boolean",description:"Show L-KERN logo on right side"}},parameters:{docs:{description:{component:"Universal page header with gradient design, title, subtitle, breadcrumbs, and logo support."}}}},i={args:{title:"Page Title"}},n={args:{title:"Contacts",subtitle:"Manage your contacts and customer information"}},l={args:{title:"Dashboard",subtitle:"Welcome back!",showLogo:!0,logoIcon:"🏠"}},c={args:{title:"Contact Details",breadcrumbs:[{name:"Home",href:"/"},{name:"Contacts",href:"/contacts"},{name:"John Doe",isActive:!0}]}},d={args:{title:"User Profile",subtitle:"Edit your profile information",showLogo:!0,logoIcon:"👤",breadcrumbs:[{name:"Home",href:"/"},{name:"Settings",href:"/settings"},{name:"Profile",isActive:!0}]}},g={args:{title:"Contacts",subtitle:"Manage your contacts",children:e.jsx(t,{variant:"primary",children:"Add Contact"})}},p={args:{title:"Orders",subtitle:"View and manage customer orders",showLogo:!0,logoIcon:"📦",children:e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(t,{variant:"secondary",children:"Export"}),e.jsx(t,{variant:"primary",children:"New Order"})]})}},m={args:{title:"L-KERN System",subtitle:"Business Operating System",showLogo:!0,logoIcon:"https://via.placeholder.com/40x40/667eea/ffffff?text=L"}},u={args:{title:"Clean Header",subtitle:"No right logo displayed",showRightLogo:!1}},_={args:{title:"Full Header",subtitle:"With both left and right logos",showLogo:!0,logoIcon:"🎯",showRightLogo:!0}},h={args:{title:"Invoice Management",subtitle:"View, create, and manage invoices",showLogo:!0,logoIcon:"💳",showRightLogo:!0,breadcrumbs:[{name:"Home",href:"/"},{name:"Finance",href:"/finance"},{name:"Invoices",isActive:!0}],children:e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsx("input",{type:"search",placeholder:"Search invoices...",style:{padding:"6px 12px",borderRadius:"4px",border:"1px solid var(--theme-border, #e0e0e0)",minWidth:"200px"}}),e.jsx(t,{variant:"secondary",size:"small",children:"Filter"}),e.jsx(t,{variant:"primary",size:"small",children:"New Invoice"})]})}},b={args:{title:"Simple Page"}},H={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(o,{title:"Simple Title"}),e.jsx(o,{title:"With Subtitle",subtitle:"This is a subtitle"}),e.jsx(o,{title:"With Logo",subtitle:"Left logo displayed",showLogo:!0,logoIcon:"📊"}),e.jsx(o,{title:"With Actions",subtitle:"Button on the right",children:e.jsx(t,{variant:"primary",size:"small",children:"Action"})})]}),parameters:{docs:{description:{story:"Various PageHeader configurations stacked vertically."}}}};var w,I,N;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    title: 'Page Title'
  }
}`,...(N=(I=i.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};var B,W,C;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: 'Contacts',
    subtitle: 'Manage your contacts and customer information'
  }
}`,...(C=(W=n.parameters)==null?void 0:W.docs)==null?void 0:C.source}}};var A,R,k;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    title: 'Dashboard',
    subtitle: 'Welcome back!',
    showLogo: true,
    logoIcon: '🏠'
  }
}`,...(k=(R=l.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var E,D,M;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    title: 'Contact Details',
    breadcrumbs: [{
      name: 'Home',
      href: '/'
    }, {
      name: 'Contacts',
      href: '/contacts'
    }, {
      name: 'John Doe',
      isActive: true
    }]
  }
}`,...(M=(D=c.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};var F,O,V;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    title: 'User Profile',
    subtitle: 'Edit your profile information',
    showLogo: true,
    logoIcon: '👤',
    breadcrumbs: [{
      name: 'Home',
      href: '/'
    }, {
      name: 'Settings',
      href: '/settings'
    }, {
      name: 'Profile',
      isActive: true
    }]
  }
}`,...(V=(O=d.parameters)==null?void 0:O.docs)==null?void 0:V.source}}};var z,K,T;g.parameters={...g.parameters,docs:{...(z=g.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    title: 'Contacts',
    subtitle: 'Manage your contacts',
    children: <Button variant="primary">Add Contact</Button>
  }
}`,...(T=(K=g.parameters)==null?void 0:K.docs)==null?void 0:T.source}}};var $,J,Y;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    title: 'Orders',
    subtitle: 'View and manage customer orders',
    showLogo: true,
    logoIcon: '📦',
    children: <div style={{
      display: 'flex',
      gap: '8px'
    }}>\r
        <Button variant="secondary">Export</Button>\r
        <Button variant="primary">New Order</Button>\r
      </div>
  }
}`,...(Y=(J=p.parameters)==null?void 0:J.docs)==null?void 0:Y.source}}};var U,q,Z;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    title: 'L-KERN System',
    subtitle: 'Business Operating System',
    showLogo: true,
    logoIcon: 'https://via.placeholder.com/40x40/667eea/ffffff?text=L'
  }
}`,...(Z=(q=m.parameters)==null?void 0:q.docs)==null?void 0:Z.source}}};var G,Q,X;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    title: 'Clean Header',
    subtitle: 'No right logo displayed',
    showRightLogo: false
  }
}`,...(X=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var ee,ae,re;_.parameters={..._.parameters,docs:{...(ee=_.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    title: 'Full Header',
    subtitle: 'With both left and right logos',
    showLogo: true,
    logoIcon: '🎯',
    showRightLogo: true
  }
}`,...(re=(ae=_.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var te,oe,se;h.parameters={...h.parameters,docs:{...(te=h.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    title: 'Invoice Management',
    subtitle: 'View, create, and manage invoices',
    showLogo: true,
    logoIcon: '💳',
    showRightLogo: true,
    breadcrumbs: [{
      name: 'Home',
      href: '/'
    }, {
      name: 'Finance',
      href: '/finance'
    }, {
      name: 'Invoices',
      isActive: true
    }],
    children: <div style={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    }}>\r
        <input type="search" placeholder="Search invoices..." style={{
        padding: '6px 12px',
        borderRadius: '4px',
        border: '1px solid var(--theme-border, #e0e0e0)',
        minWidth: '200px'
      }} />\r
        <Button variant="secondary" size="small">Filter</Button>\r
        <Button variant="primary" size="small">New Invoice</Button>\r
      </div>
  }
}`,...(se=(oe=h.parameters)==null?void 0:oe.docs)==null?void 0:se.source}}};var ie,ne,le;b.parameters={...b.parameters,docs:{...(ie=b.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    title: 'Simple Page'
  }
}`,...(le=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:le.source}}};var ce,de,ge;H.parameters={...H.parameters,docs:{...(ce=H.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>\r
      <PageHeader title="Simple Title" />\r
      <PageHeader title="With Subtitle" subtitle="This is a subtitle" />\r
      <PageHeader title="With Logo" subtitle="Left logo displayed" showLogo logoIcon="📊" />\r
      <PageHeader title="With Actions" subtitle="Button on the right" children={<Button variant="primary" size="small">Action</Button>} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Various PageHeader configurations stacked vertically.'
      }
    }
  }
}`,...(ge=(de=H.parameters)==null?void 0:de.docs)==null?void 0:ge.source}}};const Ve=["Simple","WithSubtitle","WithLogo","WithBreadcrumbs","WithBreadcrumbsAndLogo","WithButton","WithMultipleButtons","WithImageLogo","NoRightLogo","BothLogos","CompleteExample","MinimalExample","VariousConfigurations"];export{_ as BothLogos,h as CompleteExample,b as MinimalExample,u as NoRightLogo,i as Simple,H as VariousConfigurations,c as WithBreadcrumbs,d as WithBreadcrumbsAndLogo,g as WithButton,m as WithImageLogo,l as WithLogo,p as WithMultipleButtons,n as WithSubtitle,Ve as __namedExportsOrder,Oe as default};
