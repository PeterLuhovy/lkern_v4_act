import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as o}from"./index-BKyFwriW.js";import{F as Wt}from"./FilterPanel-GsQpHfnX.js";import{D as zt}from"./DataGrid-C7uqfYuW.js";import{P as Ot}from"./Pagination-CEm6Kwu8.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";import"./Checkbox-MVv5Yvl3.js";import"./Button-gnwGUMlA.js";import"./classNames-CN4lTu6a.js";const _t="FilteredDataGrid-module__filteredDataGrid___JnXyt",qt={filteredDataGrid:_t};function J({data:e,columns:m,getRowId:g,getRowStatus:n,statusColors:u,statusLabels:a,showStatusLegend:x,enableSelection:tt,selectedRows:rt,onSelectionChange:at,isRowSelectable:st,expandedRows:nt,onRowToggle:ot,onRowDoubleClick:it,renderExpandedContent:dt,actions:ct,compact:lt,searchPlaceholder:gt,searchFn:pt,filters:mt=[],useFilterCheckboxes:ut=!1,quickFilters:V=[],itemsPerPage:wt=10,enablePagination:ht=!0,onNewItem:St,newItemText:ft,newItemDisabled:xt=!1,inactiveField:w,showInactiveLabel:y,gridId:It,className:yt,betweenContent:Ct,autoRefreshInterval:b,onRefresh:$,loading:Rt=!1,loadingMessage:Ft,loadingSlow:vt=!1,error:bt,onRetry:Dt}){const[C,K]=o.useState(""),[D,Z]=o.useState(new Map),[P,ee]=o.useState(new Set),[S,U]=o.useState(!1),[h,Pt]=o.useState(wt),[X,te]=o.useState(1),[Y,jt]=o.useState(ht),[I,Et]=o.useState(""),[j,re]=o.useState("asc"),ae=pt||((r,i)=>{const s=i.toLowerCase();return Object.values(r).some(d=>String(d).toLowerCase().includes(s))}),R=o.useMemo(()=>e.filter(r=>{if(C&&!ae(r,C))return!1;for(const[i,s]of D.entries())if(s.size>0&&!s.has(r[i]))return!1;for(const i of P){const s=V.find(d=>d.id===i);if(s&&!s.filterFn(r))return!1}return!(!S&&w&&!r[w])}),[e,C,D,P,S,V,w,ae]),Gt=o.useMemo(()=>e.filter(r=>!(!S&&w&&!r[w])).length,[e,S,w]),se=C!==""||D.size>0||P.size>0,F=o.useMemo(()=>I?[...R].sort((r,i)=>{const s=r[I],d=i[I];if(s==null&&d==null)return 0;if(s==null)return 1;if(d==null)return-1;let f=0;return typeof s=="string"&&typeof d=="string"?f=s.localeCompare(d):typeof s=="number"&&typeof d=="number"?f=s-d:f=String(s).localeCompare(String(d)),j==="asc"?f:-f}):R,[R,I,j]);o.useEffect(()=>{te(1)},[R.length,h]),o.useEffect(()=>{if(b&&b>0&&$){const r=setInterval(()=>{$()},b);return()=>clearInterval(r)}},[b,$]),o.useEffect(()=>{!y&&S&&U(!1)},[y,S]);const kt=r=>{I===r?re(j==="asc"?"desc":"asc"):(Et(r),re("asc"))},Lt=Math.ceil(F.length/h),At=o.useMemo(()=>{if(!Y)return F;const r=(X-1)*h,i=r+h;return F.slice(r,i)},[F,X,h,Y]),Tt=(r,i)=>{Z(s=>{const d=new Map(s),f=d.get(r)||new Set,v=new Set(f);return v.has(i)?v.delete(i):v.add(i),v.size===0?d.delete(r):d.set(r,v),d})},Mt=mt.map(r=>({field:r.field,title:r.title,options:r.options,selectedValues:D.get(r.field)||new Set,onChange:i=>Tt(r.field,i)})),Nt=[...V.map(r=>({id:r.id,label:r.label,active:P.has(r.id),onClick:()=>{ee(i=>{const s=new Set(i);return s.has(r.id)?s.delete(r.id):s.add(r.id),s})}})),...se?[{id:"clear-all",label:"Clear All",active:!1,onClick:()=>{K(""),Z(new Map),ee(new Set),U(!1)}}]:[]];return t.jsxs("div",{className:`${qt.filteredDataGrid} ${yt||""}`,children:[t.jsx(Wt,{searchQuery:C,onSearchChange:K,searchPlaceholder:gt,quickFilters:Nt,filterGroups:Mt,useCheckboxes:ut,resultCount:R.length,totalCount:Gt,itemsPerPage:h,onItemsPerPageChange:Pt,onNewItem:St,newItemText:ft,newItemDisabled:xt,showInactive:w&&y?S:void 0,onShowInactiveChange:w&&y?U:void 0,showInactiveLabel:y,statusColors:u,statusLabels:a,showStatusLegend:x}),Ct,t.jsx(zt,{data:At,columns:m,getRowId:g,getRowStatus:n,statusColors:u,enableSelection:tt,selectedRows:rt,onSelectionChange:at,isRowSelectable:st,expandedRows:nt,onRowToggle:ot,onRowDoubleClick:it,renderExpandedContent:dt,actions:ct,compactMode:lt,hasActiveFilters:se,gridId:It,itemsPerPage:h,sortField:I,sortDirection:j,onSort:kt,loading:Rt,loadingMessage:Ft,loadingSlow:vt,error:bt,onRetry:Dt}),t.jsx(Ot,{currentPage:X,totalPages:Lt,totalItems:F.length,itemsPerPage:h,onPageChange:te,enabled:Y,onEnabledChange:jt})]})}const Ht=e=>{const m=["active","pending","completed","cancelled"],g=["high","medium","low"],n=["John Doe","Jane Smith","Bob Johnson","Alice Brown","Charlie Wilson","Diana Prince","Eve Adams","Frank Miller"];return Array.from({length:e},(u,a)=>({id:String(a+1),name:n[a%n.length],email:`user${a+1}@example.com`,phone:`+42190${String(a+1).padStart(7,"0")}`,status:m[a%m.length],priority:g[a%g.length],isActive:a%4!==0,createdAt:new Date(Date.now()-Math.random()*30*24*60*60*1e3).toISOString()}))},p=Ht(50),c=[{title:"Name",field:"name",sortable:!0,width:180},{title:"Email",field:"email",sortable:!0,width:220},{title:"Phone",field:"phone",sortable:!1,width:150},{title:"Status",field:"status",sortable:!0,width:120},{title:"Priority",field:"priority",sortable:!0,width:120}],Ze={active:"#4CAF50",pending:"#FF9800",completed:"#2196F3",cancelled:"#9e9e9e"},et={active:"Active",pending:"Pending",completed:"Completed",cancelled:"Cancelled"},l=[{field:"status",title:"STATUS",options:[{value:"active",label:"Active"},{value:"pending",label:"Pending"},{value:"completed",label:"Completed"},{value:"cancelled",label:"Cancelled"}]},{field:"priority",title:"PRIORITY",options:[{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}]}],tr={title:"Components/Data/FilteredDataGrid",component:J,tags:["autodocs"],parameters:{docs:{description:{component:"Wrapper combining FilterPanel + DataGrid + Pagination with internal state management. Handles filtering, sorting, and pagination automatically."}}}},E={args:{data:p,columns:c,getRowId:e=>e.id,gridId:"default-filtered-grid"}},G={args:{data:p,columns:c,filters:l,getRowId:e=>e.id,gridId:"filtered-grid"},parameters:{docs:{description:{story:"FilteredDataGrid with status and priority filter groups."}}}},k={args:{data:p,columns:c,filters:l,getRowId:e=>e.id,getRowStatus:e=>e.status,statusColors:Ze,statusLabels:et,showStatusLegend:!0,gridId:"status-colored-grid"},parameters:{docs:{description:{story:"Rows colored by status with status legend in FilterPanel."}}}},L={render:()=>{const[e,m]=o.useState(new Set);return t.jsxs("div",{children:[t.jsx(J,{data:p,columns:c,filters:l,enableSelection:!0,selectedRows:e,onSelectionChange:m,getRowId:g=>g.id,gridId:"selection-filtered-grid"}),t.jsx("div",{style:{marginTop:"16px",padding:"12px",background:"var(--theme-input-background)",borderRadius:"4px"},children:t.jsxs("strong",{children:["Selected: ",e.size," rows"]})})]})},parameters:{docs:{description:{story:"FilteredDataGrid with row selection enabled."}}}},A={render:()=>{const[e,m]=o.useState(new Set),g=n=>{const u=new Set(e);u.has(n)?u.delete(n):u.add(n),m(u)};return t.jsx(J,{data:p,columns:c,filters:l,expandedRows:e,onRowToggle:g,renderExpandedContent:n=>t.jsxs("div",{style:{padding:"16px"},children:[t.jsx("h4",{children:"Contact Details"}),t.jsxs("p",{children:[t.jsx("strong",{children:"ID:"})," ",n.id]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Name:"})," ",n.name]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Email:"})," ",n.email]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Phone:"})," ",n.phone]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Status:"})," ",n.status]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Priority:"})," ",n.priority]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Created:"})," ",new Date(n.createdAt).toLocaleDateString()]})]}),getRowId:n=>n.id,gridId:"expansion-filtered-grid"})},parameters:{docs:{description:{story:"FilteredDataGrid with expandable rows showing additional details."}}}},T={args:{data:p,columns:c,filters:l,inactiveField:"isActive",showInactiveLabel:"Show Inactive",getRowId:e=>e.id,gridId:"inactive-toggle-grid"},parameters:{docs:{description:{story:'FilteredDataGrid with "Show Inactive" checkbox to toggle inactive items.'}}}},M={args:{data:p,columns:c,filters:l,onNewItem:()=>alert("Create new contact"),newItemText:"+ New Contact",getRowId:e=>e.id,gridId:"new-item-grid"},parameters:{docs:{description:{story:'FilteredDataGrid with "New Item" button in FilterPanel.'}}}},N={args:{data:p,columns:c,filters:l,searchPlaceholder:"Search contacts by name or email...",searchFn:(e,m)=>{const g=m.toLowerCase();return e.name.toLowerCase().includes(g)||e.email.toLowerCase().includes(g)},getRowId:e=>e.id,gridId:"custom-search-grid"},parameters:{docs:{description:{story:"FilteredDataGrid with custom search function (name and email only)."}}}},W={args:{data:p,columns:c,filters:l,quickFilters:[{id:"high-priority",label:"High Priority",filterFn:e=>e.priority==="high"},{id:"active-only",label:"Active Only",filterFn:e=>e.status==="active"}],getRowId:e=>e.id,gridId:"quick-filters-grid"},parameters:{docs:{description:{story:"FilteredDataGrid with quick filter buttons for common filters."}}}},z={args:{data:[],columns:c,filters:l,loading:!0,loadingMessage:"Loading contacts...",getRowId:e=>e.id,gridId:"loading-filtered-grid"},parameters:{docs:{description:{story:"FilteredDataGrid showing loading state."}}}},O={args:{data:[],columns:c,filters:l,error:"Failed to load contacts. Service unavailable.",onRetry:()=>alert("Retrying..."),getRowId:e=>e.id,gridId:"error-filtered-grid"},parameters:{docs:{description:{story:"FilteredDataGrid showing error state with retry button."}}}},_={args:{data:[],columns:c,filters:l,getRowId:e=>e.id,gridId:"empty-filtered-grid"},parameters:{docs:{description:{story:"FilteredDataGrid with no data."}}}},q={args:{data:p,columns:c,filters:l,compact:!0,getRowId:e=>e.id,gridId:"compact-filtered-grid"},parameters:{docs:{description:{story:"FilteredDataGrid in compact mode with reduced padding."}}}},H={args:{data:p,columns:c,filters:l,itemsPerPage:5,getRowId:e=>e.id,gridId:"small-page-grid"},parameters:{docs:{description:{story:"FilteredDataGrid with 5 items per page."}}}},Q={args:{data:p,columns:c,filters:l,itemsPerPage:50,getRowId:e=>e.id,gridId:"large-page-grid"},parameters:{docs:{description:{story:"FilteredDataGrid with 50 items per page (all data on one page)."}}}},B={render:()=>{const[e,m]=o.useState(new Set),[g,n]=o.useState(new Set),u=a=>{const x=new Set(g);x.has(a)?x.delete(a):x.add(a),n(x)};return t.jsx(J,{data:p,columns:c,filters:l,quickFilters:[{id:"high-priority",label:"High Priority",filterFn:a=>a.priority==="high"},{id:"active-only",label:"Active Only",filterFn:a=>a.status==="active"}],enableSelection:!0,selectedRows:e,onSelectionChange:m,expandedRows:g,onRowToggle:u,renderExpandedContent:a=>t.jsxs("div",{style:{padding:"16px"},children:[t.jsx("h4",{children:"Contact Details"}),t.jsxs("p",{children:[t.jsx("strong",{children:"ID:"})," ",a.id]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Name:"})," ",a.name]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Email:"})," ",a.email]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Phone:"})," ",a.phone]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Status:"})," ",a.status]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Priority:"})," ",a.priority]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Created:"})," ",new Date(a.createdAt).toLocaleDateString()]})]}),getRowId:a=>a.id,getRowStatus:a=>a.status,statusColors:Ze,statusLabels:et,showStatusLegend:!0,inactiveField:"isActive",showInactiveLabel:"Show Inactive",onNewItem:()=>alert("Create new contact"),newItemText:"+ New Contact",searchPlaceholder:"Search contacts...",itemsPerPage:10,gridId:"full-featured-filtered-grid"})},parameters:{docs:{description:{story:"All features combined: filtering, sorting, pagination, selection, expansion, status colors, and actions."}}}};var ne,oe,ie;E.parameters={...E.parameters,docs:{...(ne=E.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    getRowId: row => row.id,
    gridId: 'default-filtered-grid'
  }
}`,...(ie=(oe=E.parameters)==null?void 0:oe.docs)==null?void 0:ie.source}}};var de,ce,le;G.parameters={...G.parameters,docs:{...(de=G.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    getRowId: row => row.id,
    gridId: 'filtered-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with status and priority filter groups.'
      }
    }
  }
}`,...(le=(ce=G.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var ge,pe,me;k.parameters={...k.parameters,docs:{...(ge=k.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    getRowId: row => row.id,
    getRowStatus: row => row.status,
    statusColors,
    statusLabels,
    showStatusLegend: true,
    gridId: 'status-colored-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'Rows colored by status with status legend in FilterPanel.'
      }
    }
  }
}`,...(me=(pe=k.parameters)==null?void 0:pe.docs)==null?void 0:me.source}}};var ue,we,he;L.parameters={...L.parameters,docs:{...(ue=L.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  render: () => {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());
    return <div>\r
        <FilteredDataGrid data={mockContacts} columns={columns} filters={filters} enableSelection selectedRows={selectedRows} onSelectionChange={setSelectedRows} getRowId={row => row.id} gridId="selection-filtered-grid" />\r
        <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'var(--theme-input-background)',
        borderRadius: '4px'
      }}>\r
          <strong>Selected: {selectedRows.size} rows</strong>\r
        </div>\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with row selection enabled.'
      }
    }
  }
}`,...(he=(we=L.parameters)==null?void 0:we.docs)==null?void 0:he.source}}};var Se,fe,xe;A.parameters={...A.parameters,docs:{...(Se=A.parameters)==null?void 0:Se.docs,source:{originalSource:`{
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
    return <FilteredDataGrid data={mockContacts} columns={columns} filters={filters} expandedRows={expandedRows} onRowToggle={handleToggle} renderExpandedContent={row => <div style={{
      padding: '16px'
    }}>\r
            <h4>Contact Details</h4>\r
            <p><strong>ID:</strong> {row.id}</p>\r
            <p><strong>Name:</strong> {row.name}</p>\r
            <p><strong>Email:</strong> {row.email}</p>\r
            <p><strong>Phone:</strong> {row.phone}</p>\r
            <p><strong>Status:</strong> {row.status}</p>\r
            <p><strong>Priority:</strong> {row.priority}</p>\r
            <p><strong>Created:</strong> {new Date(row.createdAt).toLocaleDateString()}</p>\r
          </div>} getRowId={row => row.id} gridId="expansion-filtered-grid" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with expandable rows showing additional details.'
      }
    }
  }
}`,...(xe=(fe=A.parameters)==null?void 0:fe.docs)==null?void 0:xe.source}}};var Ie,ye,Ce;T.parameters={...T.parameters,docs:{...(Ie=T.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    inactiveField: 'isActive',
    showInactiveLabel: 'Show Inactive',
    getRowId: row => row.id,
    gridId: 'inactive-toggle-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with "Show Inactive" checkbox to toggle inactive items.'
      }
    }
  }
}`,...(Ce=(ye=T.parameters)==null?void 0:ye.docs)==null?void 0:Ce.source}}};var Re,Fe,ve;M.parameters={...M.parameters,docs:{...(Re=M.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    onNewItem: () => alert('Create new contact'),
    newItemText: '+ New Contact',
    getRowId: row => row.id,
    gridId: 'new-item-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with "New Item" button in FilterPanel.'
      }
    }
  }
}`,...(ve=(Fe=M.parameters)==null?void 0:Fe.docs)==null?void 0:ve.source}}};var be,De,Pe;N.parameters={...N.parameters,docs:{...(be=N.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    searchPlaceholder: 'Search contacts by name or email...',
    searchFn: (item: Contact, query: string) => {
      const searchLower = query.toLowerCase();
      return item.name.toLowerCase().includes(searchLower) || item.email.toLowerCase().includes(searchLower);
    },
    getRowId: row => row.id,
    gridId: 'custom-search-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with custom search function (name and email only).'
      }
    }
  }
}`,...(Pe=(De=N.parameters)==null?void 0:De.docs)==null?void 0:Pe.source}}};var je,Ee,Ge;W.parameters={...W.parameters,docs:{...(je=W.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    quickFilters: [{
      id: 'high-priority',
      label: 'High Priority',
      filterFn: (row: Contact) => row.priority === 'high'
    }, {
      id: 'active-only',
      label: 'Active Only',
      filterFn: (row: Contact) => row.status === 'active'
    }],
    getRowId: row => row.id,
    gridId: 'quick-filters-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with quick filter buttons for common filters.'
      }
    }
  }
}`,...(Ge=(Ee=W.parameters)==null?void 0:Ee.docs)==null?void 0:Ge.source}}};var ke,Le,Ae;z.parameters={...z.parameters,docs:{...(ke=z.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    filters,
    loading: true,
    loadingMessage: 'Loading contacts...',
    getRowId: row => row.id,
    gridId: 'loading-filtered-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid showing loading state.'
      }
    }
  }
}`,...(Ae=(Le=z.parameters)==null?void 0:Le.docs)==null?void 0:Ae.source}}};var Te,Me,Ne;O.parameters={...O.parameters,docs:{...(Te=O.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    filters,
    error: 'Failed to load contacts. Service unavailable.',
    onRetry: () => alert('Retrying...'),
    getRowId: row => row.id,
    gridId: 'error-filtered-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid showing error state with retry button.'
      }
    }
  }
}`,...(Ne=(Me=O.parameters)==null?void 0:Me.docs)==null?void 0:Ne.source}}};var We,ze,Oe;_.parameters={..._.parameters,docs:{...(We=_.parameters)==null?void 0:We.docs,source:{originalSource:`{
  args: {
    data: [],
    columns,
    filters,
    getRowId: row => row.id,
    gridId: 'empty-filtered-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with no data.'
      }
    }
  }
}`,...(Oe=(ze=_.parameters)==null?void 0:ze.docs)==null?void 0:Oe.source}}};var _e,qe,He;q.parameters={...q.parameters,docs:{...(_e=q.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    compact: true,
    getRowId: row => row.id,
    gridId: 'compact-filtered-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid in compact mode with reduced padding.'
      }
    }
  }
}`,...(He=(qe=q.parameters)==null?void 0:qe.docs)==null?void 0:He.source}}};var Qe,Be,Je;H.parameters={...H.parameters,docs:{...(Qe=H.parameters)==null?void 0:Qe.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    itemsPerPage: 5,
    getRowId: row => row.id,
    gridId: 'small-page-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with 5 items per page.'
      }
    }
  }
}`,...(Je=(Be=H.parameters)==null?void 0:Be.docs)==null?void 0:Je.source}}};var Ve,$e,Ue;Q.parameters={...Q.parameters,docs:{...(Ve=Q.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  args: {
    data: mockContacts,
    columns,
    filters,
    itemsPerPage: 50,
    getRowId: row => row.id,
    gridId: 'large-page-grid'
  },
  parameters: {
    docs: {
      description: {
        story: 'FilteredDataGrid with 50 items per page (all data on one page).'
      }
    }
  }
}`,...(Ue=($e=Q.parameters)==null?void 0:$e.docs)==null?void 0:Ue.source}}};var Xe,Ye,Ke;B.parameters={...B.parameters,docs:{...(Xe=B.parameters)==null?void 0:Xe.docs,source:{originalSource:`{
  render: () => {
    const [selectedRows, setSelectedRows] = useState(new Set<string>());
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
    return <FilteredDataGrid data={mockContacts} columns={columns} filters={filters} quickFilters={[{
      id: 'high-priority',
      label: 'High Priority',
      filterFn: (row: Contact) => row.priority === 'high'
    }, {
      id: 'active-only',
      label: 'Active Only',
      filterFn: (row: Contact) => row.status === 'active'
    }]} enableSelection selectedRows={selectedRows} onSelectionChange={setSelectedRows} expandedRows={expandedRows} onRowToggle={handleToggle} renderExpandedContent={row => <div style={{
      padding: '16px'
    }}>\r
            <h4>Contact Details</h4>\r
            <p><strong>ID:</strong> {row.id}</p>\r
            <p><strong>Name:</strong> {row.name}</p>\r
            <p><strong>Email:</strong> {row.email}</p>\r
            <p><strong>Phone:</strong> {row.phone}</p>\r
            <p><strong>Status:</strong> {row.status}</p>\r
            <p><strong>Priority:</strong> {row.priority}</p>\r
            <p><strong>Created:</strong> {new Date(row.createdAt).toLocaleDateString()}</p>\r
          </div>} getRowId={row => row.id} getRowStatus={row => row.status} statusColors={statusColors} statusLabels={statusLabels} showStatusLegend inactiveField="isActive" showInactiveLabel="Show Inactive" onNewItem={() => alert('Create new contact')} newItemText="+ New Contact" searchPlaceholder="Search contacts..." itemsPerPage={10} gridId="full-featured-filtered-grid" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'All features combined: filtering, sorting, pagination, selection, expansion, status colors, and actions.'
      }
    }
  }
}`,...(Ke=(Ye=B.parameters)==null?void 0:Ye.docs)==null?void 0:Ke.source}}};const rr=["Default","WithFilters","WithStatusColors","WithSelection","WithExpansion","WithInactiveToggle","WithNewItemButton","WithCustomSearch","WithQuickFilters","LoadingState","ErrorState","EmptyState","CompactMode","SmallPageSize","LargePageSize","FullFeatured"];export{q as CompactMode,E as Default,_ as EmptyState,O as ErrorState,B as FullFeatured,Q as LargePageSize,z as LoadingState,H as SmallPageSize,N as WithCustomSearch,A as WithExpansion,G as WithFilters,T as WithInactiveToggle,M as WithNewItemButton,W as WithQuickFilters,L as WithSelection,k as WithStatusColors,rr as __namedExportsOrder,tr as default};
