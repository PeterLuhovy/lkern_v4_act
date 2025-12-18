import{j as u}from"./jsx-runtime-D_zvdyIk.js";import{r as t}from"./index-BKyFwriW.js";import{F as c}from"./FilterPanel-GsQpHfnX.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";import"./Checkbox-MVv5Yvl3.js";const Fe={title:"Components/Data/FilterPanel",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"Filter panel with search, quick filters, and filter groups. Supports collapsible state and status legend."}}}},w={render:()=>{const[s,r]=t.useState("");return u.jsx(c,{searchQuery:s,onSearchChange:r,resultCount:50,totalCount:100})},parameters:{docs:{description:{story:"Basic filter panel with only search bar and result count."}}}},F={render:()=>{const[s,r]=t.useState(""),[e,n]=t.useState(new Set),d=[{id:"today",label:"Today",active:e.has("today"),onClick:()=>{const a=new Set(e);e.has("today")?a.delete("today"):a.add("today"),n(a)}},{id:"this-week",label:"This Week",active:e.has("this-week"),onClick:()=>{const a=new Set(e);e.has("this-week")?a.delete("this-week"):a.add("this-week"),n(a)}},{id:"this-month",label:"This Month",active:e.has("this-month"),onClick:()=>{const a=new Set(e);e.has("this-month")?a.delete("this-month"):a.add("this-month"),n(a)}}];return u.jsx(c,{searchQuery:s,onSearchChange:r,quickFilters:d,resultCount:42,totalCount:100})},parameters:{docs:{description:{story:"Filter panel with quick filter buttons (Today, This Week, This Month)."}}}},g={render:()=>{const[s,r]=t.useState(""),[e,n]=t.useState(new Set),[d,a]=t.useState(new Set),k=[{field:"status",title:"STATUS",options:[{value:"active",label:"Active"},{value:"pending",label:"Pending"},{value:"completed",label:"Completed"}],selectedValues:e,onChange:p=>{const o=new Set(e);o.has(p)?o.delete(p):o.add(p),n(o)}},{field:"priority",title:"PRIORITY",options:[{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}],selectedValues:d,onChange:p=>{const o=new Set(d);o.has(p)?o.delete(p):o.add(p),a(o)}}];return u.jsx(c,{searchQuery:s,onSearchChange:r,filterGroups:k,resultCount:35,totalCount:100})},parameters:{docs:{description:{story:"Filter panel with filter groups for Status and Priority."}}}},m={render:()=>{const[s,r]=t.useState(""),[e,n]=t.useState(new Set),a=[{field:"status",title:"STATUS",options:[{value:"active",label:"Active"},{value:"pending",label:"Pending"},{value:"completed",label:"Completed"},{value:"cancelled",label:"Cancelled"}],selectedValues:e,onChange:l=>{const h=new Set(e);h.has(l)?h.delete(l):h.add(l),n(h)}}];return u.jsx(c,{searchQuery:s,onSearchChange:r,filterGroups:a,useCheckboxes:!0,resultCount:28,totalCount:100})},parameters:{docs:{description:{story:"Filter panel using checkboxes instead of button pills."}}}},y={render:()=>{const[s,r]=t.useState(""),[e,n]=t.useState(20);return u.jsx(c,{searchQuery:s,onSearchChange:r,resultCount:50,totalCount:100,itemsPerPage:e,onItemsPerPageChange:n})},parameters:{docs:{description:{story:"Filter panel with items per page selector."}}}},v={render:()=>{const[s,r]=t.useState("");return u.jsx(c,{searchQuery:s,onSearchChange:r,resultCount:50,totalCount:100,onNewItem:()=>alert("Create new item"),newItemText:"+ New Contact"})},parameters:{docs:{description:{story:'Filter panel with "New Item" button.'}}}},C={render:()=>{const[s,r]=t.useState(""),[e,n]=t.useState(!1);return u.jsx(c,{searchQuery:s,onSearchChange:r,resultCount:e?100:75,totalCount:100,showInactive:e,onShowInactiveChange:n,showInactiveLabel:"Show Inactive"})},parameters:{docs:{description:{story:'Filter panel with "Show Inactive" checkbox toggle.'}}}},Q={render:()=>{const[s,r]=t.useState(""),e={active:"#4CAF50",pending:"#FF9800",completed:"#2196F3",cancelled:"#9e9e9e"},n={active:"Active",pending:"Pending",completed:"Completed",cancelled:"Cancelled"};return u.jsx(c,{searchQuery:s,onSearchChange:r,resultCount:50,totalCount:100,statusColors:e,statusLabels:n,showStatusLegend:!0})},parameters:{docs:{description:{story:"Filter panel with status color legend below filters."}}}},P={render:()=>{const[s,r]=t.useState(""),[e,n]=t.useState(!0);return u.jsx(c,{searchQuery:s,onSearchChange:r,resultCount:50,totalCount:100,collapsed:e,onCollapseChange:n})},parameters:{docs:{description:{story:"Filter panel in collapsed state - only title and toggle arrow visible."}}}},b={render:()=>{const[s,r]=t.useState(""),[e,n]=t.useState(new Set),[d,a]=t.useState(new Set),[l,h]=t.useState(new Set),[k,p]=t.useState(!1),[o,se]=t.useState(20),re=i=>{const S=new Set(e);S.has(i)?S.delete(i):S.add(i),n(S)},ne=i=>{const S=new Set(d);S.has(i)?S.delete(i):S.add(i),a(S)},ae=s!==""||e.size>0||d.size>0||l.size>0,ie=[{id:"today",label:"Today",active:l.has("today"),onClick:()=>{const i=new Set(l);l.has("today")?i.delete("today"):i.add("today"),h(i)}},{id:"this-week",label:"This Week",active:l.has("this-week"),onClick:()=>{const i=new Set(l);l.has("this-week")?i.delete("this-week"):i.add("this-week"),h(i)}},...ae?[{id:"clear-all",label:"Clear All",active:!1,onClick:()=>{r(""),n(new Set),a(new Set),h(new Set)}}]:[]],le=[{field:"status",title:"STATUS",options:[{value:"active",label:"Active"},{value:"pending",label:"Pending"},{value:"completed",label:"Completed"}],selectedValues:e,onChange:re},{field:"priority",title:"PRIORITY",options:[{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}],selectedValues:d,onChange:ne}],oe={active:"#4CAF50",pending:"#FF9800",completed:"#2196F3"},ce={active:"Active",pending:"Pending",completed:"Completed"};return u.jsx(c,{searchQuery:s,onSearchChange:r,quickFilters:ie,filterGroups:le,resultCount:42,totalCount:100,itemsPerPage:o,onItemsPerPageChange:se,onNewItem:()=>alert("Create new item"),newItemText:"+ New Contact",showInactive:k,onShowInactiveChange:p,showInactiveLabel:"Show Inactive",statusColors:oe,statusLabels:ce,showStatusLegend:!0})},parameters:{docs:{description:{story:"All features combined: search, quick filters, filter groups, status legend, items per page, new item button, and show inactive toggle."}}}};var I,f,A;w.parameters={...w.parameters,docs:{...(I=w.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} resultCount={50} totalCount={100} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic filter panel with only search bar and result count.'
      }
    }
  }
}`,...(A=(f=w.parameters)==null?void 0:f.docs)==null?void 0:A.source}}};var T,x,L;F.parameters={...F.parameters,docs:{...(T=F.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState(new Set<string>());
    const quickFilters: QuickFilter[] = [{
      id: 'today',
      label: 'Today',
      active: activeFilters.has('today'),
      onClick: () => {
        const newFilters = new Set(activeFilters);
        activeFilters.has('today') ? newFilters.delete('today') : newFilters.add('today');
        setActiveFilters(newFilters);
      }
    }, {
      id: 'this-week',
      label: 'This Week',
      active: activeFilters.has('this-week'),
      onClick: () => {
        const newFilters = new Set(activeFilters);
        activeFilters.has('this-week') ? newFilters.delete('this-week') : newFilters.add('this-week');
        setActiveFilters(newFilters);
      }
    }, {
      id: 'this-month',
      label: 'This Month',
      active: activeFilters.has('this-month'),
      onClick: () => {
        const newFilters = new Set(activeFilters);
        activeFilters.has('this-month') ? newFilters.delete('this-month') : newFilters.add('this-month');
        setActiveFilters(newFilters);
      }
    }];
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} quickFilters={quickFilters} resultCount={42} totalCount={100} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with quick filter buttons (Today, This Week, This Month).'
      }
    }
  }
}`,...(L=(x=F.parameters)==null?void 0:x.docs)==null?void 0:L.source}}};var W,G,q;g.parameters={...g.parameters,docs:{...(W=g.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(new Set<string>());
    const [priorityFilter, setPriorityFilter] = useState(new Set<string>());
    const toggleStatus = (value: string) => {
      const newFilter = new Set(statusFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setStatusFilter(newFilter);
    };
    const togglePriority = (value: string) => {
      const newFilter = new Set(priorityFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setPriorityFilter(newFilter);
    };
    const filterGroups: FilterGroup[] = [{
      field: 'status',
      title: 'STATUS',
      options: [{
        value: 'active',
        label: 'Active'
      }, {
        value: 'pending',
        label: 'Pending'
      }, {
        value: 'completed',
        label: 'Completed'
      }],
      selectedValues: statusFilter,
      onChange: toggleStatus
    }, {
      field: 'priority',
      title: 'PRIORITY',
      options: [{
        value: 'high',
        label: 'High'
      }, {
        value: 'medium',
        label: 'Medium'
      }, {
        value: 'low',
        label: 'Low'
      }],
      selectedValues: priorityFilter,
      onChange: togglePriority
    }];
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} filterGroups={filterGroups} resultCount={35} totalCount={100} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with filter groups for Status and Priority.'
      }
    }
  }
}`,...(q=(G=g.parameters)==null?void 0:G.docs)==null?void 0:q.source}}};var j,N,V;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(new Set<string>());
    const toggleStatus = (value: string) => {
      const newFilter = new Set(statusFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setStatusFilter(newFilter);
    };
    const filterGroups: FilterGroup[] = [{
      field: 'status',
      title: 'STATUS',
      options: [{
        value: 'active',
        label: 'Active'
      }, {
        value: 'pending',
        label: 'Pending'
      }, {
        value: 'completed',
        label: 'Completed'
      }, {
        value: 'cancelled',
        label: 'Cancelled'
      }],
      selectedValues: statusFilter,
      onChange: toggleStatus
    }];
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} filterGroups={filterGroups} useCheckboxes resultCount={28} totalCount={100} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel using checkboxes instead of button pills.'
      }
    }
  }
}`,...(V=(N=m.parameters)==null?void 0:N.docs)==null?void 0:V.source}}};var R,M,z;y.parameters={...y.parameters,docs:{...(R=y.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} resultCount={50} totalCount={100} itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with items per page selector.'
      }
    }
  }
}`,...(z=(M=y.parameters)==null?void 0:M.docs)==null?void 0:z.source}}};var U,O,B;v.parameters={...v.parameters,docs:{...(U=v.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} resultCount={50} totalCount={100} onNewItem={() => alert('Create new item')} newItemText="+ New Contact" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with "New Item" button.'
      }
    }
  }
}`,...(B=(O=v.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};var H,Y,D;C.parameters={...C.parameters,docs:{...(H=C.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} resultCount={showInactive ? 100 : 75} totalCount={100} showInactive={showInactive} onShowInactiveChange={setShowInactive} showInactiveLabel="Show Inactive" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with "Show Inactive" checkbox toggle.'
      }
    }
  }
}`,...(D=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:D.source}}};var E,_,J;Q.parameters={...Q.parameters,docs:{...(E=Q.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const statusColors = {
      active: '#4CAF50',
      pending: '#FF9800',
      completed: '#2196F3',
      cancelled: '#9e9e9e'
    };
    const statusLabels = {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} resultCount={50} totalCount={100} statusColors={statusColors} statusLabels={statusLabels} showStatusLegend />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with status color legend below filters.'
      }
    }
  }
}`,...(J=(_=Q.parameters)==null?void 0:_.docs)==null?void 0:J.source}}};var K,X,Z;P.parameters={...P.parameters,docs:{...(K=P.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsed, setCollapsed] = useState(true);
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} resultCount={50} totalCount={100} collapsed={collapsed} onCollapseChange={setCollapsed} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel in collapsed state - only title and toggle arrow visible.'
      }
    }
  }
}`,...(Z=(X=P.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var $,ee,te;b.parameters={...b.parameters,docs:{...($=b.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(new Set<string>());
    const [priorityFilter, setPriorityFilter] = useState(new Set<string>());
    const [activeQuickFilters, setActiveQuickFilters] = useState(new Set<string>());
    const [showInactive, setShowInactive] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const toggleStatus = (value: string) => {
      const newFilter = new Set(statusFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setStatusFilter(newFilter);
    };
    const togglePriority = (value: string) => {
      const newFilter = new Set(priorityFilter);
      newFilter.has(value) ? newFilter.delete(value) : newFilter.add(value);
      setPriorityFilter(newFilter);
    };
    const hasActiveFilters = searchQuery !== '' || statusFilter.size > 0 || priorityFilter.size > 0 || activeQuickFilters.size > 0;
    const quickFilters: QuickFilter[] = [{
      id: 'today',
      label: 'Today',
      active: activeQuickFilters.has('today'),
      onClick: () => {
        const newFilters = new Set(activeQuickFilters);
        activeQuickFilters.has('today') ? newFilters.delete('today') : newFilters.add('today');
        setActiveQuickFilters(newFilters);
      }
    }, {
      id: 'this-week',
      label: 'This Week',
      active: activeQuickFilters.has('this-week'),
      onClick: () => {
        const newFilters = new Set(activeQuickFilters);
        activeQuickFilters.has('this-week') ? newFilters.delete('this-week') : newFilters.add('this-week');
        setActiveQuickFilters(newFilters);
      }
    }, ...(hasActiveFilters ? [{
      id: 'clear-all',
      label: 'Clear All',
      active: false,
      onClick: () => {
        setSearchQuery('');
        setStatusFilter(new Set());
        setPriorityFilter(new Set());
        setActiveQuickFilters(new Set());
      }
    }] : [])];
    const filterGroups: FilterGroup[] = [{
      field: 'status',
      title: 'STATUS',
      options: [{
        value: 'active',
        label: 'Active'
      }, {
        value: 'pending',
        label: 'Pending'
      }, {
        value: 'completed',
        label: 'Completed'
      }],
      selectedValues: statusFilter,
      onChange: toggleStatus
    }, {
      field: 'priority',
      title: 'PRIORITY',
      options: [{
        value: 'high',
        label: 'High'
      }, {
        value: 'medium',
        label: 'Medium'
      }, {
        value: 'low',
        label: 'Low'
      }],
      selectedValues: priorityFilter,
      onChange: togglePriority
    }];
    const statusColors = {
      active: '#4CAF50',
      pending: '#FF9800',
      completed: '#2196F3'
    };
    const statusLabels = {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed'
    };
    return <FilterPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} quickFilters={quickFilters} filterGroups={filterGroups} resultCount={42} totalCount={100} itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} onNewItem={() => alert('Create new item')} newItemText="+ New Contact" showInactive={showInactive} onShowInactiveChange={setShowInactive} showInactiveLabel="Show Inactive" statusColors={statusColors} statusLabels={statusLabels} showStatusLegend />;
  },
  parameters: {
    docs: {
      description: {
        story: 'All features combined: search, quick filters, filter groups, status legend, items per page, new item button, and show inactive toggle.'
      }
    }
  }
}`,...(te=(ee=b.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};const ge=["Default","WithQuickFilters","WithFilterGroups","WithCheckboxes","WithItemsPerPage","WithNewItemButton","WithShowInactive","WithStatusLegend","Collapsed","FullFeatured"];export{P as Collapsed,w as Default,b as FullFeatured,m as WithCheckboxes,g as WithFilterGroups,y as WithItemsPerPage,v as WithNewItemButton,F as WithQuickFilters,C as WithShowInactive,Q as WithStatusLegend,ge as __namedExportsOrder,Fe as default};
