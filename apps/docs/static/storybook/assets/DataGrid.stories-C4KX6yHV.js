import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-BKyFwriW.js";import{D as p}from"./DataGrid-C7uqfYuW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";import"./Button-gnwGUMlA.js";import"./classNames-CN4lTu6a.js";import"./Checkbox-MVv5Yvl3.js";const d=[{id:"1",name:"John Doe",email:"john@example.com",phone:"+421901234567",status:"active",priority:"high",isActive:!0},{id:"2",name:"Jane Smith",email:"jane@example.com",phone:"+421902345678",status:"pending",priority:"medium",isActive:!0},{id:"3",name:"Bob Johnson",email:"bob@example.com",phone:"+421903456789",status:"inactive",priority:"low",isActive:!1},{id:"4",name:"Alice Brown",email:"alice@example.com",phone:"+421904567890",status:"active",priority:"medium",isActive:!0},{id:"5",name:"Charlie Wilson",email:"charlie@example.com",phone:"+421905678901",status:"active",priority:"high",isActive:!0},{id:"6",name:"Diana Prince",email:"diana@example.com",phone:"+421906789012",status:"pending",priority:"low",isActive:!0},{id:"7",name:"Eve Adams",email:"eve@example.com",phone:"+421907890123",status:"inactive",priority:"medium",isActive:!1},{id:"8",name:"Frank Miller",email:"frank@example.com",phone:"+421908901234",status:"active",priority:"high",isActive:!0}],o=[{title:"Name",field:"name",sortable:!0,width:180},{title:"Email",field:"email",sortable:!0,width:220},{title:"Phone",field:"phone",sortable:!1,width:150},{title:"Status",field:"status",sortable:!0,width:120},{title:"Priority",field:"priority",sortable:!0,width:120}],me={active:"#4CAF50",pending:"#FF9800",inactive:"#9e9e9e"},ue={active:"Active",pending:"Pending",inactive:"Inactive"},be={title:"Components/Data/DataGrid",component:p,tags:["autodocs"],parameters:{docs:{description:{component:"Production data grid with sorting, selection, expansion, and actions. Supports column resizing, keyboard navigation, and status color coding."}}}},m={args:{data:d,columns:o,getRowId:e=>e.id,gridId:"default-grid"}},u={render:()=>{const[e,c]=i.useState("name"),[n,r]=i.useState("asc"),a=l=>{e===l?r(n==="asc"?"desc":"asc"):(c(l),r("asc"))};return t.jsx(p,{data:d,columns:o,sortField:e,sortDirection:n,onSort:a,getRowId:l=>l.id,gridId:"sorting-grid"})},parameters:{docs:{description:{story:"Click column headers to sort data ascending or descending."}}}},w={render:()=>{const[e,c]=i.useState(new Set);return t.jsxs("div",{children:[t.jsx(p,{data:d,columns:o,enableSelection:!0,selectedRows:e,onSelectionChange:c,getRowId:n=>n.id,gridId:"selection-grid"}),t.jsxs("div",{style:{marginTop:"16px",padding:"12px",background:"var(--theme-input-background)",borderRadius:"4px"},children:[t.jsxs("strong",{children:["Selected: ",e.size," rows"]}),e.size>0&&t.jsxs("div",{style:{marginTop:"8px",fontSize:"14px"},children:["IDs: ",Array.from(e).join(", ")]})]})]})},parameters:{docs:{description:{story:"Select rows using checkboxes. Supports Ctrl+Click, Shift+Click, and Ctrl+A for select all."}}}},h={render:()=>{const[e,c]=i.useState(new Set),n=r=>{const a=new Set(e);a.has(r)?a.delete(r):a.add(r),c(a)};return t.jsx(p,{data:d,columns:o,expandedRows:e,onRowToggle:n,renderExpandedContent:r=>t.jsxs("div",{style:{padding:"16px"},children:[t.jsx("h4",{children:"Contact Details"}),t.jsxs("p",{children:[t.jsx("strong",{children:"ID:"})," ",r.id]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Name:"})," ",r.name]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Email:"})," ",r.email]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Phone:"})," ",r.phone]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Status:"})," ",r.status]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Priority:"})," ",r.priority]})]}),getRowId:r=>r.id,gridId:"expansion-grid"})},parameters:{docs:{description:{story:"Click rows to expand and show additional details."}}}},S={args:{data:d,columns:o,getRowId:e=>e.id,getRowStatus:e=>e.status,statusColors:me,statusLabels:ue,showStatusLegend:!0,gridId:"status-grid"},parameters:{docs:{description:{story:"Rows are colored based on status. Status legend can be shown for clarity."}}}},x={args:{data:d,columns:o,actions:[{label:"Edit",onClick:e=>alert(`Edit ${e.name}`),variant:"secondary"},{label:"Delete",onClick:e=>alert(`Delete ${e.name}`),variant:"danger",disabled:e=>e.status==="pending"}],getRowId:e=>e.id,gridId:"actions-grid"},parameters:{docs:{description:{story:"Action buttons per row. Delete button is disabled for pending contacts."}}}},y={args:{data:[],columns:o,loading:!0,loadingMessage:"Loading contacts...",getRowId:e=>e.id,gridId:"loading-grid"},parameters:{docs:{description:{story:"Shows loading spinner while data is being fetched."}}}},R={args:{data:[],columns:o,loading:!0,loadingSlow:!0,getRowId:e=>e.id,gridId:"loading-slow-grid"},parameters:{docs:{description:{story:'Shows loading spinner with "taking longer than usual" message.'}}}},I={args:{data:[],columns:o,error:"Failed to connect to contacts service. Please try again.",onRetry:()=>alert("Retrying..."),getRowId:e=>e.id,gridId:"error-grid"},parameters:{docs:{description:{story:"Shows error message with retry button when data fetch fails."}}}},f={args:{data:[],columns:o,getRowId:e=>e.id,gridId:"empty-grid"},parameters:{docs:{description:{story:"Shows empty state message when no data is available."}}}},v={args:{data:[],columns:o,hasActiveFilters:!0,getRowId:e=>e.id,gridId:"empty-filtered-grid"},parameters:{docs:{description:{story:"Shows empty state with filter hint when no results match active filters."}}}},C={args:{data:d,columns:o,compactMode:!0,getRowId:e=>e.id,gridId:"compact-grid"},parameters:{docs:{description:{story:"Compact mode with reduced padding and smaller font sizes."}}}},b={render:()=>{const[e,c]=i.useState(new Set),[n,r]=i.useState(new Set),[a,l]=i.useState("name"),[D,E]=i.useState("asc"),we=s=>{a===s?E(D==="asc"?"desc":"asc"):(l(s),E("asc"))},he=s=>{const g=new Set(n);g.has(s)?g.delete(s):g.add(s),r(g)};return t.jsx(p,{data:d,columns:o,sortField:a,sortDirection:D,onSort:we,enableSelection:!0,selectedRows:e,onSelectionChange:c,expandedRows:n,onRowToggle:he,renderExpandedContent:s=>t.jsxs("div",{style:{padding:"16px"},children:[t.jsx("h4",{children:"Contact Details"}),t.jsxs("p",{children:[t.jsx("strong",{children:"ID:"})," ",s.id]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Name:"})," ",s.name]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Email:"})," ",s.email]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Phone:"})," ",s.phone]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Status:"})," ",s.status]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Priority:"})," ",s.priority]})]}),getRowId:s=>s.id,getRowStatus:s=>s.status,statusColors:me,statusLabels:ue,actions:[{label:"Edit",onClick:s=>alert(`Edit ${s.name}`),variant:"secondary"},{label:"Delete",onClick:s=>alert(`Delete ${s.name}`),variant:"danger"}],gridId:"full-featured-grid"})},parameters:{docs:{description:{story:"All features combined: sorting, selection, expansion, status colors, and actions."}}}};var j,k,F;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    getRowId: row => row.id,
    gridId: 'default-grid'
  }
}`,...(F=(k=m.parameters)==null?void 0:k.docs)==null?void 0:F.source}}};var A,P,T;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };
    return <DataGrid data={mockContacts} columns={columns} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} getRowId={row => row.id} gridId="sorting-grid" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Click column headers to sort data ascending or descending.'
      }
    }
  }
}`,...(T=(P=u.parameters)==null?void 0:P.docs)==null?void 0:T.source}}};var W,L,z;w.parameters={...w.parameters,docs:{...(W=w.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());
    return <div>\r
        <DataGrid data={mockContacts} columns={columns} enableSelection selectedRows={selectedRows} onSelectionChange={setSelectedRows} getRowId={row => row.id} gridId="selection-grid" />\r
        <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'var(--theme-input-background)',
        borderRadius: '4px'
      }}>\r
          <strong>Selected: {selectedRows.size} rows</strong>\r
          {selectedRows.size > 0 && <div style={{
          marginTop: '8px',
          fontSize: '14px'
        }}>\r
              IDs: {Array.from(selectedRows).join(', ')}\r
            </div>}\r
        </div>\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Select rows using checkboxes. Supports Ctrl+Click, Shift+Click, and Ctrl+A for select all.'
      }
    }
  }
}`,...(z=(L=w.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var G,$,M;h.parameters={...h.parameters,docs:{...(G=h.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [expandedRows, setExpandedRows] = useState(new Set<string>());
    const handleToggle = (rowId: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId);
      } else {
        newExpanded.add(rowId);
      }
      setExpandedRows(newExpanded);
    };
    return <DataGrid data={mockContacts} columns={columns} expandedRows={expandedRows} onRowToggle={handleToggle} renderExpandedContent={row => <div style={{
      padding: '16px'
    }}>\r
            <h4>Contact Details</h4>\r
            <p><strong>ID:</strong> {row.id}</p>\r
            <p><strong>Name:</strong> {row.name}</p>\r
            <p><strong>Email:</strong> {row.email}</p>\r
            <p><strong>Phone:</strong> {row.phone}</p>\r
            <p><strong>Status:</strong> {row.status}</p>\r
            <p><strong>Priority:</strong> {row.priority}</p>\r
          </div>} getRowId={row => row.id} gridId="expansion-grid" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Click rows to expand and show additional details.'
      }
    }
  }
}`,...(M=($=h.parameters)==null?void 0:$.docs)==null?void 0:M.source}}};var N,J,B;S.parameters={...S.parameters,docs:{...(N=S.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    getRowId: row => row.id,
    getRowStatus: row => row.status,
    statusColors,
    statusLabels,
    showStatusLegend: true,
    gridId: 'status-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Rows are colored based on status. Status legend can be shown for clarity.'
      }
    }
  }
}`,...(B=(J=S.parameters)==null?void 0:J.docs)==null?void 0:B.source}}};var _,O,q;x.parameters={...x.parameters,docs:{...(_=x.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    actions: [{
      label: 'Edit',
      onClick: row => alert(\`Edit \${row.name}\`),
      variant: 'secondary'
    }, {
      label: 'Delete',
      onClick: row => alert(\`Delete \${row.name}\`),
      variant: 'danger',
      disabled: row => row.status === 'pending'
    }] as DataGridAction<Contact>[],
    getRowId: row => row.id,
    gridId: 'actions-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Action buttons per row. Delete button is disabled for pending contacts.'
      }
    }
  }
}`,...(q=(O=x.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var H,K,Q;y.parameters={...y.parameters,docs:{...(H=y.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    loading: true,
    loadingMessage: 'Loading contacts...',
    getRowId: row => row.id,
    gridId: 'loading-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows loading spinner while data is being fetched.'
      }
    }
  }
}`,...(Q=(K=y.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,V,X;R.parameters={...R.parameters,docs:{...(U=R.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    loading: true,
    loadingSlow: true,
    getRowId: row => row.id,
    gridId: 'loading-slow-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows loading spinner with "taking longer than usual" message.'
      }
    }
  }
}`,...(X=(V=R.parameters)==null?void 0:V.docs)==null?void 0:X.source}}};var Y,Z,ee;I.parameters={...I.parameters,docs:{...(Y=I.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    error: 'Failed to connect to contacts service. Please try again.',
    onRetry: () => alert('Retrying...'),
    getRowId: row => row.id,
    gridId: 'error-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows error message with retry button when data fetch fails.'
      }
    }
  }
}`,...(ee=(Z=I.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,se,re;f.parameters={...f.parameters,docs:{...(te=f.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    getRowId: row => row.id,
    gridId: 'empty-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state message when no data is available.'
      }
    }
  }
}`,...(re=(se=f.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var oe,ne,ae;v.parameters={...v.parameters,docs:{...(oe=v.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    hasActiveFilters: true,
    getRowId: row => row.id,
    gridId: 'empty-filtered-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state with filter hint when no results match active filters.'
      }
    }
  }
}`,...(ae=(ne=v.parameters)==null?void 0:ne.docs)==null?void 0:ae.source}}};var ie,de,ce;C.parameters={...C.parameters,docs:{...(ie=C.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    compactMode: true,
    getRowId: row => row.id,
    gridId: 'compact-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact mode with reduced padding and smaller font sizes.'
      }
    }
  }
}`,...(ce=(de=C.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var le,pe,ge;b.parameters={...b.parameters,docs:{...(le=b.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());
    const [expandedRows, setExpandedRows] = useState(new Set<string>());
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };
    const handleToggle = (rowId: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId);
      } else {
        newExpanded.add(rowId);
      }
      setExpandedRows(newExpanded);
    };
    return <DataGrid data={mockContacts} columns={columns} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} enableSelection selectedRows={selectedRows} onSelectionChange={setSelectedRows} expandedRows={expandedRows} onRowToggle={handleToggle} renderExpandedContent={row => <div style={{
      padding: '16px'
    }}>\r
            <h4>Contact Details</h4>\r
            <p><strong>ID:</strong> {row.id}</p>\r
            <p><strong>Name:</strong> {row.name}</p>\r
            <p><strong>Email:</strong> {row.email}</p>\r
            <p><strong>Phone:</strong> {row.phone}</p>\r
            <p><strong>Status:</strong> {row.status}</p>\r
            <p><strong>Priority:</strong> {row.priority}</p>\r
          </div>} getRowId={row => row.id} getRowStatus={row => row.status} statusColors={statusColors} statusLabels={statusLabels} actions={[{
      label: 'Edit',
      onClick: row => alert(\`Edit \${row.name}\`),
      variant: 'secondary'
    }, {
      label: 'Delete',
      onClick: row => alert(\`Delete \${row.name}\`),
      variant: 'danger'
    }] as DataGridAction<Contact>[]} gridId="full-featured-grid" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'All features combined: sorting, selection, expansion, status colors, and actions.'
      }
    }
  }
}`,...(ge=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:ge.source}}};const De=["Default","WithSorting","WithSelection","WithExpansion","WithStatusColors","WithActions","LoadingState","LoadingSlow","ErrorState","EmptyState","EmptyWithFilters","CompactMode","FullFeatured"];export{C as CompactMode,m as Default,f as EmptyState,v as EmptyWithFilters,I as ErrorState,b as FullFeatured,R as LoadingSlow,y as LoadingState,x as WithActions,h as WithExpansion,w as WithSelection,u as WithSorting,S as WithStatusColors,De as __namedExportsOrder,be as default};
