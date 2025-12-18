import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as r}from"./AuthRoleSwitcher-CoFXCztO.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";const A={title:"Components/Utility/AuthRoleSwitcher",component:r,tags:["autodocs"],argTypes:{isCollapsed:{control:"boolean",description:"Whether sidebar is collapsed"}},parameters:{docs:{description:{component:"Authorization permission level switcher with 9 levels (Basic 1-3, Standard 1-3, Admin 1-3) and test user switcher. Keyboard shortcuts: Ctrl+1 through Ctrl+9. Development tool for testing permissions."}}}},s={args:{isCollapsed:!1},parameters:{docs:{description:{story:"Expanded view showing test users, permission indicator, and 9-level grid with full labels."}}}},n={args:{isCollapsed:!0},parameters:{docs:{description:{story:"Collapsed view showing only keyboard shortcut numbers (1-9) in compact grid."}}}},l={render:()=>e.jsxs("div",{style:{display:"flex",gap:"24px",alignItems:"flex-start"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Expanded (Sidebar Open)"}),e.jsx(r,{isCollapsed:!1})]}),e.jsxs("div",{style:{flex:1},children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Collapsed (Sidebar Closed)"}),e.jsx(r,{isCollapsed:!0})]})]}),parameters:{docs:{description:{story:"Side-by-side comparison of expanded and collapsed states."}}}},i={render:()=>e.jsxs("div",{style:{padding:"16px"},children:[e.jsx(r,{isCollapsed:!1}),e.jsxs("div",{style:{marginTop:"24px",padding:"16px",background:"#f5f5f5",borderRadius:"8px"},children:[e.jsx("h4",{children:"Keyboard Shortcuts"}),e.jsxs("ul",{style:{marginTop:"8px"},children:[e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+1"})," - Basic Level 1 (10)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+2"})," - Basic Level 2 (20)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+3"})," - Basic Level 3 (29)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+4"})," - Standard Level 1 (35)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+5"})," - Standard Level 2 (45)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+6"})," - Standard Level 3 (59)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+7"})," - Admin Level 1 (65)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+8"})," - Admin Level 2 (85)"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+9"})," - Admin Level 3 (100)"]})]})]})]}),parameters:{docs:{description:{story:"Component with keyboard shortcuts documentation. Try pressing Ctrl+1 through Ctrl+9 to switch permission levels."}}}},d={render:()=>e.jsxs("div",{style:{padding:"16px"},children:[e.jsx(r,{isCollapsed:!1}),e.jsxs("div",{style:{marginTop:"24px",padding:"16px",background:"#f5f5f5",borderRadius:"8px"},children:[e.jsx("h4",{children:"Permission Levels"}),e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{style:{color:"#4CAF50"},children:"Basic (Green Zone)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Level 1 (10) - View only"}),e.jsx("li",{children:"Level 2 (20) - View + basic actions"}),e.jsx("li",{children:"Level 3 (29) - View + extended actions"})]})]}),e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{style:{color:"#FF9800"},children:"Standard (Yellow Zone)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Level 1 (35) - Create & edit own"}),e.jsx("li",{children:"Level 2 (45) - Edit all"}),e.jsx("li",{children:"Level 3 (59) - Delete own"})]})]}),e.jsxs("div",{children:[e.jsx("strong",{style:{color:"#f44336"},children:"Admin (Red Zone)"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Level 1 (65) - Delete all"}),e.jsx("li",{children:"Level 2 (85) - Advanced settings"}),e.jsx("li",{children:"Level 3 (100) - Full admin access"})]})]})]})]})]}),parameters:{docs:{description:{story:"Permission levels documentation showing the 9-level structure and color coding."}}}};var t,o,a;s.parameters={...s.parameters,docs:{...(t=s.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    isCollapsed: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Expanded view showing test users, permission indicator, and 9-level grid with full labels.'
      }
    }
  }
}`,...(a=(o=s.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};var c,p,h;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    isCollapsed: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Collapsed view showing only keyboard shortcut numbers (1-9) in compact grid.'
      }
    }
  }
}`,...(h=(p=n.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var x,m,v;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start'
  }}>\r
      <div style={{
      flex: 1
    }}>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Expanded (Sidebar Open)</h4>\r
        <AuthRoleSwitcher isCollapsed={false} />\r
      </div>\r
      <div style={{
      flex: 1
    }}>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Collapsed (Sidebar Closed)</h4>\r
        <AuthRoleSwitcher isCollapsed={true} />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of expanded and collapsed states.'
      }
    }
  }
}`,...(v=(m=l.parameters)==null?void 0:m.docs)==null?void 0:v.source}}};var u,g,y;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '16px'
  }}>\r
      <AuthRoleSwitcher isCollapsed={false} />\r
      <div style={{
      marginTop: '24px',
      padding: '16px',
      background: '#f5f5f5',
      borderRadius: '8px'
    }}>\r
        <h4>Keyboard Shortcuts</h4>\r
        <ul style={{
        marginTop: '8px'
      }}>\r
          <li><kbd>Ctrl+1</kbd> - Basic Level 1 (10)</li>\r
          <li><kbd>Ctrl+2</kbd> - Basic Level 2 (20)</li>\r
          <li><kbd>Ctrl+3</kbd> - Basic Level 3 (29)</li>\r
          <li><kbd>Ctrl+4</kbd> - Standard Level 1 (35)</li>\r
          <li><kbd>Ctrl+5</kbd> - Standard Level 2 (45)</li>\r
          <li><kbd>Ctrl+6</kbd> - Standard Level 3 (59)</li>\r
          <li><kbd>Ctrl+7</kbd> - Admin Level 1 (65)</li>\r
          <li><kbd>Ctrl+8</kbd> - Admin Level 2 (85)</li>\r
          <li><kbd>Ctrl+9</kbd> - Admin Level 3 (100)</li>\r
        </ul>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Component with keyboard shortcuts documentation. Try pressing Ctrl+1 through Ctrl+9 to switch permission levels.'
      }
    }
  }
}`,...(y=(g=i.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var b,j,C;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '16px'
  }}>\r
      <AuthRoleSwitcher isCollapsed={false} />\r
      <div style={{
      marginTop: '24px',
      padding: '16px',
      background: '#f5f5f5',
      borderRadius: '8px'
    }}>\r
        <h4>Permission Levels</h4>\r
        <div style={{
        marginTop: '8px'
      }}>\r
          <div style={{
          marginBottom: '8px'
        }}>\r
            <strong style={{
            color: '#4CAF50'
          }}>Basic (Green Zone)</strong>\r
            <ul>\r
              <li>Level 1 (10) - View only</li>\r
              <li>Level 2 (20) - View + basic actions</li>\r
              <li>Level 3 (29) - View + extended actions</li>\r
            </ul>\r
          </div>\r
          <div style={{
          marginBottom: '8px'
        }}>\r
            <strong style={{
            color: '#FF9800'
          }}>Standard (Yellow Zone)</strong>\r
            <ul>\r
              <li>Level 1 (35) - Create & edit own</li>\r
              <li>Level 2 (45) - Edit all</li>\r
              <li>Level 3 (59) - Delete own</li>\r
            </ul>\r
          </div>\r
          <div>\r
            <strong style={{
            color: '#f44336'
          }}>Admin (Red Zone)</strong>\r
            <ul>\r
              <li>Level 1 (65) - Delete all</li>\r
              <li>Level 2 (85) - Advanced settings</li>\r
              <li>Level 3 (100) - Full admin access</li>\r
            </ul>\r
          </div>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Permission levels documentation showing the 9-level structure and color coding.'
      }
    }
  }
}`,...(C=(j=d.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};const B=["Expanded","Collapsed","ExpandedAndCollapsed","KeyboardShortcuts","PermissionLevels"];export{n as Collapsed,s as Expanded,l as ExpandedAndCollapsed,i as KeyboardShortcuts,d as PermissionLevels,B as __namedExportsOrder,A as default};
