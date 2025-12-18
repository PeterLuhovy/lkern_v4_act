import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{E as r}from"./EmptyState-c1ESi13i.js";import{B as t}from"./Button-gnwGUMlA.js";import"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const Re={title:"Components/Feedback/EmptyState",component:r,tags:["autodocs"],argTypes:{icon:{control:"text",description:"Icon or emoji to display"},title:{control:"text",description:"Main heading text"},description:{control:"text",description:"Optional description text"},size:{control:"select",options:["small","medium","large"],description:"Size variant"}},parameters:{docs:{description:{component:"Empty state component for displaying empty/no-data states with optional action button."}}},decorators:[s=>e.jsx("div",{style:{minHeight:"400px",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--theme-input-background, #fafafa)",borderRadius:"8px",padding:"40px"},children:e.jsx(s,{})})]},o={args:{icon:"📭",title:"No items found",description:"Try adjusting your search or filters."}},i={args:{icon:"🔍",title:"No results"}},a={args:{icon:"📝",title:"No contacts yet",description:"Get started by adding your first contact.",action:e.jsx(t,{variant:"primary",children:"Add Contact"})}},n={args:{icon:"📭",title:"No items",description:"Small empty state.",size:"small"}},c={args:{icon:"📭",title:"No items found",description:"Medium empty state (default).",size:"medium"}},d={args:{icon:"📭",title:"No items found",description:"Large empty state for full-page views.",size:"large"}},p={args:{icon:"👥",title:"No contacts yet",description:"Start building your network by adding your first contact.",action:e.jsx(t,{variant:"primary",icon:"+",iconPosition:"left",children:"Add First Contact"}),size:"large"},parameters:{docs:{description:{story:"Empty state for contacts list."}}}},l={args:{icon:"🔍",title:"No results found",description:"Try searching with different keywords or check your spelling.",action:e.jsx(t,{variant:"secondary",children:"Clear Search"})},parameters:{docs:{description:{story:"Empty state for search with no results."}}}},m={args:{icon:"🛒",title:"No orders yet",description:"Your order history will appear here once you make your first purchase.",action:e.jsx(t,{variant:"primary",children:"Browse Products"})},parameters:{docs:{description:{story:"Empty state for orders list."}}}},u={args:{icon:"🔔",title:"You're all caught up!",description:"No new notifications at the moment.",size:"medium"},parameters:{docs:{description:{story:"Empty state for notifications (positive message)."}}}},y={args:{icon:"💬",title:"No messages",description:"Start a conversation by sending your first message.",action:e.jsx(t,{variant:"primary",children:"New Message"})},parameters:{docs:{description:{story:"Empty state for messages/inbox."}}}},g={args:{icon:"📧",title:"Inbox Zero!",description:"Great job! You've cleared all your emails.",size:"large"},parameters:{docs:{description:{story:"Empty state for email inbox (achievement message)."}}}},f={args:{icon:"⭐",title:"No favorites yet",description:"Mark items as favorites to find them quickly later.",size:"medium"},parameters:{docs:{description:{story:"Empty state for favorites list."}}}},x={args:{icon:"🔎",title:"No items match your filters",description:"Try removing some filters to see more results.",action:e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(t,{variant:"secondary",children:"Clear Filters"}),e.jsx(t,{variant:"ghost",children:"Reset All"})]})},parameters:{docs:{description:{story:"Empty state with multiple action buttons."}}}},h={args:{icon:"⚠️",title:"Unable to load data",description:"Something went wrong. Please try again later or contact support.",action:e.jsx(t,{variant:"primary",children:"Retry"})},parameters:{docs:{description:{story:"Empty state used as error state."}}}},v={args:{icon:"🚧",title:"Coming Soon",description:"This feature is currently under development. Check back later!",size:"large"},parameters:{docs:{description:{story:"Empty state for features under development."}}}},S={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"40px",width:"100%"},children:[e.jsx("div",{style:{background:"var(--theme-input-background, #fafafa)",borderRadius:"8px",padding:"20px",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(r,{icon:"📭",title:"Small Size",description:"Compact empty state",size:"small"})}),e.jsx("div",{style:{background:"var(--theme-input-background, #fafafa)",borderRadius:"8px",padding:"40px",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(r,{icon:"📭",title:"Medium Size",description:"Default empty state size",size:"medium"})}),e.jsx("div",{style:{background:"var(--theme-input-background, #fafafa)",borderRadius:"8px",padding:"60px",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(r,{icon:"📭",title:"Large Size",description:"Full-page empty state",size:"large"})})]}),decorators:[],parameters:{docs:{description:{story:"All available sizes side by side."}}}},N={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"20px"},children:[{icon:"📭",title:"Empty List"},{icon:"🔍",title:"No Results"},{icon:"👥",title:"No Contacts"},{icon:"🛒",title:"No Orders"},{icon:"⭐",title:"No Favorites"},{icon:"💬",title:"No Messages"},{icon:"📧",title:"No Emails"},{icon:"🔔",title:"No Notifications"},{icon:"⚠️",title:"Error"}].map((s,be)=>e.jsx("div",{style:{background:"var(--theme-input-background, #fafafa)",borderRadius:"8px",padding:"30px",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(r,{icon:s.icon,title:s.title,size:"small"})},be))}),decorators:[],parameters:{docs:{description:{story:"Common icons used with EmptyState."}}}};var b,z,E;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    icon: '📭',
    title: 'No items found',
    description: 'Try adjusting your search or filters.'
  }
}`,...(E=(z=o.parameters)==null?void 0:z.docs)==null?void 0:E.source}}};var j,k,C;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    icon: '🔍',
    title: 'No results'
  }
}`,...(C=(k=i.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};var w,B,R;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    icon: '📝',
    title: 'No contacts yet',
    description: 'Get started by adding your first contact.',
    action: <Button variant="primary">Add Contact</Button>
  }
}`,...(R=(B=a.parameters)==null?void 0:B.docs)==null?void 0:R.source}}};var I,M,F;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    icon: '📭',
    title: 'No items',
    description: 'Small empty state.',
    size: 'small'
  }
}`,...(F=(M=n.parameters)==null?void 0:M.docs)==null?void 0:F.source}}};var A,T,D;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    icon: '📭',
    title: 'No items found',
    description: 'Medium empty state (default).',
    size: 'medium'
  }
}`,...(D=(T=c.parameters)==null?void 0:T.docs)==null?void 0:D.source}}};var L,O,P;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    icon: '📭',
    title: 'No items found',
    description: 'Large empty state for full-page views.',
    size: 'large'
  }
}`,...(P=(O=d.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};var Y,G,W;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    icon: '👥',
    title: 'No contacts yet',
    description: 'Start building your network by adding your first contact.',
    action: <Button variant="primary" icon="+" iconPosition="left">\r
        Add First Contact\r
      </Button>,
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for contacts list.'
      }
    }
  }
}`,...(W=(G=p.parameters)==null?void 0:G.docs)==null?void 0:W.source}}};var q,U,Z;l.parameters={...l.parameters,docs:{...(q=l.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    icon: '🔍',
    title: 'No results found',
    description: 'Try searching with different keywords or check your spelling.',
    action: <Button variant="secondary">Clear Search</Button>
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for search with no results.'
      }
    }
  }
}`,...(Z=(U=l.parameters)==null?void 0:U.docs)==null?void 0:Z.source}}};var _,H,J;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    icon: '🛒',
    title: 'No orders yet',
    description: 'Your order history will appear here once you make your first purchase.',
    action: <Button variant="primary">Browse Products</Button>
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for orders list.'
      }
    }
  }
}`,...(J=(H=m.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,V;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    icon: '🔔',
    title: "You're all caught up!",
    description: 'No new notifications at the moment.',
    size: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for notifications (positive message).'
      }
    }
  }
}`,...(V=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:V.source}}};var X,$,ee;y.parameters={...y.parameters,docs:{...(X=y.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    icon: '💬',
    title: 'No messages',
    description: 'Start a conversation by sending your first message.',
    action: <Button variant="primary">New Message</Button>
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for messages/inbox.'
      }
    }
  }
}`,...(ee=($=y.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};var te,re,se;g.parameters={...g.parameters,docs:{...(te=g.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    icon: '📧',
    title: 'Inbox Zero!',
    description: "Great job! You've cleared all your emails.",
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for email inbox (achievement message).'
      }
    }
  }
}`,...(se=(re=g.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var oe,ie,ae;f.parameters={...f.parameters,docs:{...(oe=f.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    icon: '⭐',
    title: 'No favorites yet',
    description: 'Mark items as favorites to find them quickly later.',
    size: 'medium'
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for favorites list.'
      }
    }
  }
}`,...(ae=(ie=f.parameters)==null?void 0:ie.docs)==null?void 0:ae.source}}};var ne,ce,de;x.parameters={...x.parameters,docs:{...(ne=x.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    icon: '🔎',
    title: 'No items match your filters',
    description: 'Try removing some filters to see more results.',
    action: <div style={{
      display: 'flex',
      gap: '8px'
    }}>\r
        <Button variant="secondary">Clear Filters</Button>\r
        <Button variant="ghost">Reset All</Button>\r
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state with multiple action buttons.'
      }
    }
  }
}`,...(de=(ce=x.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};var pe,le,me;h.parameters={...h.parameters,docs:{...(pe=h.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    icon: '⚠️',
    title: 'Unable to load data',
    description: 'Something went wrong. Please try again later or contact support.',
    action: <Button variant="primary">Retry</Button>
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state used as error state.'
      }
    }
  }
}`,...(me=(le=h.parameters)==null?void 0:le.docs)==null?void 0:me.source}}};var ue,ye,ge;v.parameters={...v.parameters,docs:{...(ue=v.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    icon: '🚧',
    title: 'Coming Soon',
    description: 'This feature is currently under development. Check back later!',
    size: 'large'
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for features under development.'
      }
    }
  }
}`,...(ge=(ye=v.parameters)==null?void 0:ye.docs)==null?void 0:ge.source}}};var fe,xe,he;S.parameters={...S.parameters,docs:{...(fe=S.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    width: '100%'
  }}>\r
      <div style={{
      background: 'var(--theme-input-background, #fafafa)',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>\r
        <EmptyState icon="📭" title="Small Size" description="Compact empty state" size="small" />\r
      </div>\r
      <div style={{
      background: 'var(--theme-input-background, #fafafa)',
      borderRadius: '8px',
      padding: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>\r
        <EmptyState icon="📭" title="Medium Size" description="Default empty state size" size="medium" />\r
      </div>\r
      <div style={{
      background: 'var(--theme-input-background, #fafafa)',
      borderRadius: '8px',
      padding: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>\r
        <EmptyState icon="📭" title="Large Size" description="Full-page empty state" size="large" />\r
      </div>\r
    </div>,
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: 'All available sizes side by side.'
      }
    }
  }
}`,...(he=(xe=S.parameters)==null?void 0:xe.docs)==null?void 0:he.source}}};var ve,Se,Ne;N.parameters={...N.parameters,docs:{...(ve=N.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  }}>\r
      {[{
      icon: '📭',
      title: 'Empty List'
    }, {
      icon: '🔍',
      title: 'No Results'
    }, {
      icon: '👥',
      title: 'No Contacts'
    }, {
      icon: '🛒',
      title: 'No Orders'
    }, {
      icon: '⭐',
      title: 'No Favorites'
    }, {
      icon: '💬',
      title: 'No Messages'
    }, {
      icon: '📧',
      title: 'No Emails'
    }, {
      icon: '🔔',
      title: 'No Notifications'
    }, {
      icon: '⚠️',
      title: 'Error'
    }].map((item, idx) => <div key={idx} style={{
      background: 'var(--theme-input-background, #fafafa)',
      borderRadius: '8px',
      padding: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>\r
          <EmptyState icon={item.icon} title={item.title} size="small" />\r
        </div>)}\r
    </div>,
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: 'Common icons used with EmptyState.'
      }
    }
  }
}`,...(Ne=(Se=N.parameters)==null?void 0:Se.docs)==null?void 0:Ne.source}}};const Ie=["Default","WithoutDescription","WithAction","SizeSmall","SizeMedium","SizeLarge","NoContacts","NoSearchResults","NoOrders","NoNotifications","NoMessages","EmptyInbox","NoFavorites","NoFilterResults","ErrorState","ComingSoon","AllSizes","CommonIcons"];export{S as AllSizes,v as ComingSoon,N as CommonIcons,o as Default,g as EmptyInbox,h as ErrorState,p as NoContacts,f as NoFavorites,x as NoFilterResults,y as NoMessages,u as NoNotifications,m as NoOrders,l as NoSearchResults,d as SizeLarge,c as SizeMedium,n as SizeSmall,a as WithAction,i as WithoutDescription,Ie as __namedExportsOrder,Re as default};
