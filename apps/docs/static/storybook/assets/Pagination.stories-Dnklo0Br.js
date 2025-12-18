import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r}from"./index-BKyFwriW.js";import{P as n}from"./Pagination-CEm6Kwu8.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";import"./Button-gnwGUMlA.js";import"./classNames-CN4lTu6a.js";import"./Checkbox-MVv5Yvl3.js";const Pe={title:"Components/Data/Pagination",component:n,tags:["autodocs"],argTypes:{currentPage:{control:"number",description:"Current page number (1-indexed)"},totalPages:{control:"number",description:"Total number of pages"},totalItems:{control:"number",description:"Total number of items"},itemsPerPage:{control:"number",description:"Items per page"},enabled:{control:"boolean",description:"Enable pagination"}},parameters:{docs:{description:{component:"Pagination component with page numbers and record count. Shows up to 5 page numbers at a time."}}}},g={render:()=>{const[e,t]=r.useState(1);return a.jsx(n,{currentPage:e,totalPages:10,totalItems:200,itemsPerPage:20,onPageChange:t})},parameters:{docs:{description:{story:"Default pagination with 10 pages and 200 items total."}}}},i={render:()=>{const[e,t]=r.useState(1);return a.jsx(n,{currentPage:e,totalPages:3,totalItems:60,itemsPerPage:20,onPageChange:t})},parameters:{docs:{description:{story:"Pagination with only 3 pages - all page numbers are shown."}}}},c={render:()=>{const[e,t]=r.useState(10);return a.jsx(n,{currentPage:e,totalPages:50,totalItems:1e3,itemsPerPage:20,onPageChange:t})},parameters:{docs:{description:{story:"Pagination with 50 pages - shows 5 page numbers around current page."}}}},P={render:()=>{const[e,t]=r.useState(1);return a.jsx(n,{currentPage:e,totalPages:20,totalItems:400,itemsPerPage:20,onPageChange:t})},parameters:{docs:{description:{story:"First page - previous button is disabled."}}}},u={render:()=>{const[e,t]=r.useState(20);return a.jsx(n,{currentPage:e,totalPages:20,totalItems:400,itemsPerPage:20,onPageChange:t})},parameters:{docs:{description:{story:"Last page - next button is disabled."}}}},d={render:()=>{const[e,t]=r.useState(1);return a.jsx(n,{currentPage:e,totalPages:1,totalItems:15,itemsPerPage:20,onPageChange:t})},parameters:{docs:{description:{story:"Single page - both navigation buttons are disabled."}}}},m={render:()=>{const[e,t]=r.useState(1),[s,C]=r.useState(!0);return a.jsx(n,{currentPage:e,totalPages:10,totalItems:200,itemsPerPage:20,onPageChange:t,enabled:s,onEnabledChange:C})},parameters:{docs:{description:{story:"Pagination with enable/disable toggle. When disabled, shows all items on page 1."}}}},p={args:{currentPage:1,totalPages:10,totalItems:200,itemsPerPage:20,onPageChange:()=>{},enabled:!1},parameters:{docs:{description:{story:"Disabled pagination state - all controls are disabled."}}}},l={render:()=>{const[e,t]=r.useState(1);return a.jsx(n,{currentPage:e,totalPages:40,totalItems:200,itemsPerPage:5,onPageChange:t})},parameters:{docs:{description:{story:"Pagination with 5 items per page - results in more pages."}}}},b={render:()=>{const[e,t]=r.useState(1);return a.jsx(n,{currentPage:e,totalPages:2,totalItems:200,itemsPerPage:100,onPageChange:t})},parameters:{docs:{description:{story:"Pagination with 100 items per page - results in fewer pages."}}}},h={render:()=>{const[e,t]=r.useState(1),[s,C]=r.useState(!0),I=15,o=300,S=20,ee=s?(e-1)*S+1:1,te=s?Math.min(e*S,o):o;return a.jsxs("div",{children:[a.jsxs("div",{style:{padding:"20px",marginBottom:"20px",background:"var(--theme-input-background)",borderRadius:"8px",border:"2px solid var(--theme-input-border)"},children:[a.jsx("h3",{style:{marginTop:0},children:"Current State:"}),a.jsxs("p",{children:[a.jsx("strong",{children:"Page:"})," ",s?e:1," of ",s?I:1]}),a.jsxs("p",{children:[a.jsx("strong",{children:"Items Shown:"})," ",ee,"-",te," of ",o]}),a.jsxs("p",{children:[a.jsx("strong",{children:"Pagination Enabled:"})," ",s?"Yes":"No"]})]}),a.jsx(n,{currentPage:e,totalPages:I,totalItems:o,itemsPerPage:S,onPageChange:t,enabled:s,onEnabledChange:C})]})},parameters:{docs:{description:{story:"Interactive demo showing current pagination state."}}}};var x,y,w;g.parameters={...g.parameters,docs:{...(x=g.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination currentPage={currentPage} totalPages={10} totalItems={200} itemsPerPage={20} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Default pagination with 10 pages and 200 items total.'
      }
    }
  }
}`,...(w=(y=g.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var j,f,v;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination currentPage={currentPage} totalPages={3} totalItems={60} itemsPerPage={20} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with only 3 pages - all page numbers are shown.'
      }
    }
  }
}`,...(v=(f=i.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var E,D,T;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(10);
    return <Pagination currentPage={currentPage} totalPages={50} totalItems={1000} itemsPerPage={20} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with 50 pages - shows 5 page numbers around current page.'
      }
    }
  }
}`,...(T=(D=c.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var F,L,k;P.parameters={...P.parameters,docs:{...(F=P.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination currentPage={currentPage} totalPages={20} totalItems={400} itemsPerPage={20} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'First page - previous button is disabled.'
      }
    }
  }
}`,...(k=(L=P.parameters)==null?void 0:L.docs)==null?void 0:k.source}}};var M,W,R;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(20);
    return <Pagination currentPage={currentPage} totalPages={20} totalItems={400} itemsPerPage={20} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Last page - next button is disabled.'
      }
    }
  }
}`,...(R=(W=u.parameters)==null?void 0:W.docs)==null?void 0:R.source}}};var B,N,Y;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination currentPage={currentPage} totalPages={1} totalItems={15} itemsPerPage={20} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Single page - both navigation buttons are disabled.'
      }
    }
  }
}`,...(Y=(N=d.parameters)==null?void 0:N.docs)==null?void 0:Y.source}}};var _,O,q;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [enabled, setEnabled] = useState(true);
    return <Pagination currentPage={currentPage} totalPages={10} totalItems={200} itemsPerPage={20} onPageChange={setCurrentPage} enabled={enabled} onEnabledChange={setEnabled} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with enable/disable toggle. When disabled, shows all items on page 1.'
      }
    }
  }
}`,...(q=(O=m.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var z,A,G;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 200,
    itemsPerPage: 20,
    onPageChange: () => {},
    enabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled pagination state - all controls are disabled.'
      }
    }
  }
}`,...(G=(A=p.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var H,J,K;l.parameters={...l.parameters,docs:{...(H=l.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination currentPage={currentPage} totalPages={40} totalItems={200} itemsPerPage={5} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with 5 items per page - results in more pages.'
      }
    }
  }
}`,...(K=(J=l.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,V;b.parameters={...b.parameters,docs:{...(Q=b.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination currentPage={currentPage} totalPages={2} totalItems={200} itemsPerPage={100} onPageChange={setCurrentPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination with 100 items per page - results in fewer pages.'
      }
    }
  }
}`,...(V=(U=b.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var X,Z,$;h.parameters={...h.parameters,docs:{...(X=h.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [enabled, setEnabled] = useState(true);
    const totalPages = 15;
    const totalItems = 300;
    const itemsPerPage = 20;
    const startItem = enabled ? (currentPage - 1) * itemsPerPage + 1 : 1;
    const endItem = enabled ? Math.min(currentPage * itemsPerPage, totalItems) : totalItems;
    return <div>\r
        <div style={{
        padding: '20px',
        marginBottom: '20px',
        background: 'var(--theme-input-background)',
        borderRadius: '8px',
        border: '2px solid var(--theme-input-border)'
      }}>\r
          <h3 style={{
          marginTop: 0
        }}>Current State:</h3>\r
          <p><strong>Page:</strong> {enabled ? currentPage : 1} of {enabled ? totalPages : 1}</p>\r
          <p><strong>Items Shown:</strong> {startItem}-{endItem} of {totalItems}</p>\r
          <p><strong>Pagination Enabled:</strong> {enabled ? 'Yes' : 'No'}</p>\r
        </div>\r
\r
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} enabled={enabled} onEnabledChange={setEnabled} />\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing current pagination state.'
      }
    }
  }
}`,...($=(Z=h.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};const ue=["Default","FewPages","ManyPages","FirstPage","LastPage","SinglePage","WithToggle","Disabled","SmallItemsPerPage","LargeItemsPerPage","InteractiveDemo"];export{g as Default,p as Disabled,i as FewPages,P as FirstPage,h as InteractiveDemo,b as LargeItemsPerPage,u as LastPage,c as ManyPages,d as SinglePage,l as SmallItemsPerPage,m as WithToggle,ue as __namedExportsOrder,Pe as default};
