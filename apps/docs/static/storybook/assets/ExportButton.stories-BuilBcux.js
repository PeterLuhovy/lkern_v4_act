import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{u as Z}from"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";const A="ExportButton-module__exportButton___u0u07",W={exportButton:A};function p({onExport:o,formats:h=["csv","json"],disabled:E=!1,label:g,className:r=""}){const{t:s}=Z(),a=e=>{const f=e.target.value;f&&(o(f),e.target.value="")},n={csv:"CSV",json:"JSON",zip:"ZIP (Full)"};return t.jsxs("select",{className:`${W.exportButton} ${r}`,onChange:a,disabled:E,value:"",children:[t.jsx("option",{value:"",disabled:!0,hidden:!0,children:g||s("common.export")}),h.map(e=>t.jsx("option",{value:e,children:n[e]},e))]})}const Q={title:"Components/Data/ExportButton",component:p,tags:["autodocs"],argTypes:{formats:{control:"object",description:"Available export formats"},disabled:{control:"boolean",description:"Disabled state"}},parameters:{docs:{description:{component:"Dropdown select button for exporting data in various formats (CSV, JSON, ZIP)."}}}},l={args:{onExport:o=>{alert(`Exporting as ${o.toUpperCase()}...`)}},parameters:{docs:{description:{story:"Default export button with CSV and JSON formats."}}}},i={args:{formats:["csv"],onExport:o=>{alert(`Exporting as ${o.toUpperCase()}...`)}},parameters:{docs:{description:{story:"Export button with only CSV format available."}}}},d={args:{formats:["csv","json","zip"],onExport:o=>{alert(`Exporting as ${o.toUpperCase()}...`)}},parameters:{docs:{description:{story:"Export button with all available formats: CSV, JSON, and ZIP."}}}},c={args:{onExport:o=>{alert(`Exporting as ${o.toUpperCase()}...`)},disabled:!0},parameters:{docs:{description:{story:"Disabled export button (e.g., when no data to export)."}}}},m={args:{onExport:o=>{alert(`Exporting as ${o.toUpperCase()}...`)},label:"Download Data"},parameters:{docs:{description:{story:"Export button with custom label text."}}}},x={args:{onExport:o=>{alert(`Exporting as ${o.toUpperCase()}...`)},className:"custom-export-button"},decorators:[o=>t.jsxs("div",{children:[t.jsx("style",{children:`
          .custom-export-button {
            border: 2px solid var(--color-brand-primary);
            background: var(--color-brand-primary);
            color: white;
            font-weight: bold;
          }
        `}),t.jsx(o,{})]})],parameters:{docs:{description:{story:"Export button with custom CSS class for styling."}}}},b={render:()=>{const o=[{id:1,name:"John Doe",email:"john@example.com"},{id:2,name:"Jane Smith",email:"jane@example.com"},{id:3,name:"Bob Johnson",email:"bob@example.com"}],h=()=>{const r=[["ID","Name","Email"],...o.map(e=>[e.id,e.name,e.email])].map(e=>e.join(",")).join(`
`),s=new Blob([r],{type:"text/csv"}),a=URL.createObjectURL(s),n=document.createElement("a");n.href=a,n.download="export.csv",n.click(),URL.revokeObjectURL(a)},E=()=>{const r=JSON.stringify(o,null,2),s=new Blob([r],{type:"application/json"}),a=URL.createObjectURL(s),n=document.createElement("a");n.href=a,n.download="export.json",n.click(),URL.revokeObjectURL(a)},g=r=>{r==="csv"?h():r==="json"?E():r==="zip"&&alert("ZIP export not implemented in demo")};return t.jsxs("div",{children:[t.jsxs("div",{style:{marginBottom:"16px"},children:[t.jsx("h4",{children:"Mock Data Table"}),t.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",border:"1px solid var(--theme-border)"},children:[t.jsx("thead",{children:t.jsxs("tr",{style:{background:"var(--theme-input-background)"},children:[t.jsx("th",{style:{padding:"8px",border:"1px solid var(--theme-border)"},children:"ID"}),t.jsx("th",{style:{padding:"8px",border:"1px solid var(--theme-border)"},children:"Name"}),t.jsx("th",{style:{padding:"8px",border:"1px solid var(--theme-border)"},children:"Email"})]})}),t.jsx("tbody",{children:o.map(r=>t.jsxs("tr",{children:[t.jsx("td",{style:{padding:"8px",border:"1px solid var(--theme-border)"},children:r.id}),t.jsx("td",{style:{padding:"8px",border:"1px solid var(--theme-border)"},children:r.name}),t.jsx("td",{style:{padding:"8px",border:"1px solid var(--theme-border)"},children:r.email})]},r.id))})]})]}),t.jsx(p,{formats:["csv","json","zip"],onExport:g})]})},parameters:{docs:{description:{story:"Example showing ExportButton with actual export functionality (CSV and JSON downloads work)."}}}},u={render:()=>t.jsxs("div",{style:{display:"flex",gap:"12px",alignItems:"center"},children:[t.jsx(p,{formats:["csv"],onExport:o=>alert(`Exporting as ${o}`),label:"Export CSV"}),t.jsx(p,{formats:["json"],onExport:o=>alert(`Exporting as ${o}`),label:"Export JSON"}),t.jsx(p,{formats:["zip"],onExport:o=>alert(`Exporting as ${o}`),label:"Download All"})]}),parameters:{docs:{description:{story:"Multiple export buttons with different format options."}}}};var y,v,j;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    onExport: (format: ExportFormat) => {
      alert(\`Exporting as \${format.toUpperCase()}...\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Default export button with CSV and JSON formats.'
      }
    }
  }
}`,...(j=(v=l.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var S,w,C;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    formats: ['csv'],
    onExport: (format: ExportFormat) => {
      alert(\`Exporting as \${format.toUpperCase()}...\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Export button with only CSV format available.'
      }
    }
  }
}`,...(C=(w=i.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var D,U,O;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    formats: ['csv', 'json', 'zip'],
    onExport: (format: ExportFormat) => {
      alert(\`Exporting as \${format.toUpperCase()}...\`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Export button with all available formats: CSV, JSON, and ZIP.'
      }
    }
  }
}`,...(O=(U=d.parameters)==null?void 0:U.docs)==null?void 0:O.source}}};var k,N,B;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    onExport: (format: ExportFormat) => {
      alert(\`Exporting as \${format.toUpperCase()}...\`);
    },
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled export button (e.g., when no data to export).'
      }
    }
  }
}`,...(B=(N=c.parameters)==null?void 0:N.docs)==null?void 0:B.source}}};var J,$,L;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    onExport: (format: ExportFormat) => {
      alert(\`Exporting as \${format.toUpperCase()}...\`);
    },
    label: 'Download Data'
  },
  parameters: {
    docs: {
      description: {
        story: 'Export button with custom label text.'
      }
    }
  }
}`,...(L=($=m.parameters)==null?void 0:$.docs)==null?void 0:L.source}}};var R,V,I;x.parameters={...x.parameters,docs:{...(R=x.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    onExport: (format: ExportFormat) => {
      alert(\`Exporting as \${format.toUpperCase()}...\`);
    },
    className: 'custom-export-button'
  },
  decorators: [Story => <div>\r
        <style>{\`
          .custom-export-button {
            border: 2px solid var(--color-brand-primary);
            background: var(--color-brand-primary);
            color: white;
            font-weight: bold;
          }
        \`}</style>\r
        <Story />\r
      </div>],
  parameters: {
    docs: {
      description: {
        story: 'Export button with custom CSS class for styling.'
      }
    }
  }
}`,...(I=(V=x.parameters)==null?void 0:V.docs)==null?void 0:I.source}}};var F,T,z;b.parameters={...b.parameters,docs:{...(F=b.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    const mockData = [{
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }, {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com'
    }, {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com'
    }];
    const exportToCSV = () => {
      const csv = [['ID', 'Name', 'Email'], ...mockData.map(row => [row.id, row.name, row.email])].map(row => row.join(',')).join('\\n');
      const blob = new Blob([csv], {
        type: 'text/csv'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      a.click();
      URL.revokeObjectURL(url);
    };
    const exportToJSON = () => {
      const json = JSON.stringify(mockData, null, 2);
      const blob = new Blob([json], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.json';
      a.click();
      URL.revokeObjectURL(url);
    };
    const handleExport = (format: ExportFormat) => {
      if (format === 'csv') {
        exportToCSV();
      } else if (format === 'json') {
        exportToJSON();
      } else if (format === 'zip') {
        alert('ZIP export not implemented in demo');
      }
    };
    return <div>\r
        <div style={{
        marginBottom: '16px'
      }}>\r
          <h4>Mock Data Table</h4>\r
          <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid var(--theme-border)'
        }}>\r
            <thead>\r
              <tr style={{
              background: 'var(--theme-input-background)'
            }}>\r
                <th style={{
                padding: '8px',
                border: '1px solid var(--theme-border)'
              }}>ID</th>\r
                <th style={{
                padding: '8px',
                border: '1px solid var(--theme-border)'
              }}>Name</th>\r
                <th style={{
                padding: '8px',
                border: '1px solid var(--theme-border)'
              }}>Email</th>\r
              </tr>\r
            </thead>\r
            <tbody>\r
              {mockData.map(row => <tr key={row.id}>\r
                  <td style={{
                padding: '8px',
                border: '1px solid var(--theme-border)'
              }}>{row.id}</td>\r
                  <td style={{
                padding: '8px',
                border: '1px solid var(--theme-border)'
              }}>{row.name}</td>\r
                  <td style={{
                padding: '8px',
                border: '1px solid var(--theme-border)'
              }}>{row.email}</td>\r
                </tr>)}\r
            </tbody>\r
          </table>\r
        </div>\r
\r
        <ExportButton formats={['csv', 'json', 'zip']} onExport={handleExport} />\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing ExportButton with actual export functionality (CSV and JSON downloads work).'
      }
    }
  }
}`,...(z=(T=b.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};var _,M,P;u.parameters={...u.parameters,docs:{...(_=u.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  }}>\r
      <ExportButton formats={['csv']} onExport={format => alert(\`Exporting as \${format}\`)} label="Export CSV" />\r
      <ExportButton formats={['json']} onExport={format => alert(\`Exporting as \${format}\`)} label="Export JSON" />\r
      <ExportButton formats={['zip']} onExport={format => alert(\`Exporting as \${format}\`)} label="Download All" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Multiple export buttons with different format options.'
      }
    }
  }
}`,...(P=(M=u.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};const X=["Default","CSVOnly","AllFormats","Disabled","CustomLabel","WithClassName","WithDataGrid","MultipleButtons"];export{d as AllFormats,i as CSVOnly,m as CustomLabel,l as Default,c as Disabled,u as MultipleButtons,x as WithClassName,b as WithDataGrid,X as __namedExportsOrder,Q as default};
