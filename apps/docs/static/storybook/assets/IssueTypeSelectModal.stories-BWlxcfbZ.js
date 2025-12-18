import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{u as K}from"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import{M as Q}from"./ConfirmModal-Ds9lIxjL.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./DebugBar-C6YrkoDS.js";import"./Button-gnwGUMlA.js";import"./classNames-CN4lTu6a.js";import"./Input-CFoEo-oh.js";import"./FormField-7Fj67rB9.js";import"./InfoHint-TbK9iuJy.js";const U="IssueTypeSelectModal-module__typeGrid___2ahN-",$="IssueTypeSelectModal-module__typeButton___dOGCA",P="IssueTypeSelectModal-module__typeIcon___Enw7-",Z="IssueTypeSelectModal-module__typeLabel___pdZ-I",o={typeGrid:U,typeButton:$,typeIcon:P,typeLabel:Z},q=({isOpen:t,onClose:c,onSelectType:D,modalId:E="issue-type-select-modal",availableTypes:x})=>{const{t:y}=K(),u=[{type:"bug",icon:"🐛",labelKey:"pages.issues.types.bug"},{type:"feature",icon:"✨",labelKey:"pages.issues.types.feature"},{type:"improvement",icon:"📈",labelKey:"pages.issues.types.improvement"},{type:"question",icon:"❓",labelKey:"pages.issues.types.question"}],F=x?u.filter(({type:s})=>x.includes(s)):u,G=s=>{D(s)};return e.jsx(Q,{isOpen:t,onClose:c,modalId:E,title:y("pages.issues.typeSelect.title"),size:"sm",showFooter:!1,children:e.jsx("div",{className:o.typeGrid,children:F.map(({type:s,icon:L,labelKey:N})=>e.jsxs("button",{className:o.typeButton,onClick:()=>G(s),"data-testid":`issue-type-${s.toLowerCase()}`,children:[e.jsx("span",{className:o.typeIcon,children:L}),e.jsx("span",{className:o.typeLabel,children:y(N)})]},s))})})},de={title:"Components/Modals/IssueTypeSelectModal",component:q,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"}},parameters:{docs:{description:{component:"Small modal with 4 buttons to select issue type before opening CreateIssueModal. Clean 2x2 grid layout."}}}},n={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSelectType:t=>console.log("Selected type:",t)}},r={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSelectType:t=>console.log("Selected type:",t),availableTypes:["bug"]},parameters:{docs:{description:{story:"Restrict to bugs only (e.g., for error boundary error reporting)."}}}},i={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSelectType:t=>console.log("Selected type:",t),availableTypes:["bug","question"]},parameters:{docs:{description:{story:"Basic users might only report bugs or ask questions."}}}},l={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSelectType:t=>console.log("Selected type:",t),availableTypes:["feature","improvement"]},parameters:{docs:{description:{story:"Product managers might focus on feature requests and improvements."}}}},d={render:()=>{const t=c=>{alert(`Selected: ${c}

In real app, this would:
1. Close IssueTypeSelectModal
2. Open CreateIssueModal with type pre-selected`)};return e.jsx(q,{isOpen:!0,onClose:()=>console.log("Modal closed"),onSelectType:t})},parameters:{docs:{description:{story:"Click any issue type button to see the workflow."}}}},p={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("h3",{children:"Issue Type Buttons"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",maxWidth:"600px"},children:[e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"32px",marginBottom:"8px"},children:"🐛"}),e.jsx("h4",{children:"Bug"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Something is broken or not working as expected."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"32px",marginBottom:"8px"},children:"✨"}),e.jsx("h4",{children:"Feature"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Request a new feature or capability."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"32px",marginBottom:"8px"},children:"📈"}),e.jsx("h4",{children:"Improvement"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Enhancement to existing functionality."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"32px",marginBottom:"8px"},children:"❓"}),e.jsx("h4",{children:"Question"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Ask for help or clarification."})]})]})]}),parameters:{docs:{description:{story:"All available issue types with descriptions."}}}},a={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("h3",{children:"Modal Workflow"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",justifyContent:"center"},children:[e.jsxs("div",{style:{padding:"16px",border:"2px solid #9c27b0",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"Step 1"}),e.jsx("div",{style:{fontSize:"14px"},children:'User clicks "Report Issue"'})]}),e.jsx("div",{style:{fontSize:"24px",color:"#9c27b0"},children:"→"}),e.jsxs("div",{style:{padding:"16px",border:"2px solid #9c27b0",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"Step 2"}),e.jsx("div",{style:{fontSize:"14px"},children:"IssueTypeSelectModal opens"})]}),e.jsx("div",{style:{fontSize:"24px",color:"#9c27b0"},children:"→"}),e.jsxs("div",{style:{padding:"16px",border:"2px solid #9c27b0",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"Step 3"}),e.jsx("div",{style:{fontSize:"14px"},children:"User selects type (bug/feature/etc)"})]}),e.jsx("div",{style:{fontSize:"24px",color:"#9c27b0"},children:"→"}),e.jsxs("div",{style:{padding:"16px",border:"2px solid #9c27b0",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"Step 4"}),e.jsx("div",{style:{fontSize:"14px"},children:"CreateIssueModal opens with type pre-selected"})]})]})]}),parameters:{docs:{description:{story:"Two-step modal workflow for creating issues."}}}};var m,g,h;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: type => console.log('Selected type:', type)
  }
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var v,b,f;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: type => console.log('Selected type:', type),
    availableTypes: ['bug']
  },
  parameters: {
    docs: {
      description: {
        story: 'Restrict to bugs only (e.g., for error boundary error reporting).'
      }
    }
  }
}`,...(f=(b=r.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var S,j,T;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: type => console.log('Selected type:', type),
    availableTypes: ['bug', 'question']
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic users might only report bugs or ask questions.'
      }
    }
  }
}`,...(T=(j=i.parameters)==null?void 0:j.docs)==null?void 0:T.source}}};var I,z,M;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSelectType: type => console.log('Selected type:', type),
    availableTypes: ['feature', 'improvement']
  },
  parameters: {
    docs: {
      description: {
        story: 'Product managers might focus on feature requests and improvements.'
      }
    }
  }
}`,...(M=(z=l.parameters)==null?void 0:z.docs)==null?void 0:M.source}}};var w,B,C;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    const handleSelectType = (type: 'bug' | 'feature' | 'improvement' | 'question') => {
      alert(\`Selected: \${type}\\n\\nIn real app, this would:\\n1. Close IssueTypeSelectModal\\n2. Open CreateIssueModal with type pre-selected\`);
    };
    return <IssueTypeSelectModal isOpen={true} onClose={() => console.log('Modal closed')} onSelectType={handleSelectType} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Click any issue type button to see the workflow.'
      }
    }
  }
}`,...(C=(B=d.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};var A,R,k;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>Issue Type Buttons</h3>\r
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      maxWidth: '600px'
    }}>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        textAlign: 'center'
      }}>\r
          <div style={{
          fontSize: '32px',
          marginBottom: '8px'
        }}>🐛</div>\r
          <h4>Bug</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Something is broken or not working as expected.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        textAlign: 'center'
      }}>\r
          <div style={{
          fontSize: '32px',
          marginBottom: '8px'
        }}>✨</div>\r
          <h4>Feature</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Request a new feature or capability.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        textAlign: 'center'
      }}>\r
          <div style={{
          fontSize: '32px',
          marginBottom: '8px'
        }}>📈</div>\r
          <h4>Improvement</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Enhancement to existing functionality.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        textAlign: 'center'
      }}>\r
          <div style={{
          fontSize: '32px',
          marginBottom: '8px'
        }}>❓</div>\r
          <h4>Question</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Ask for help or clarification.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available issue types with descriptions.'
      }
    }
  }
}`,...(k=(R=p.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var W,_,O;a.parameters={...a.parameters,docs:{...(W=a.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>Modal Workflow</h3>\r
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      justifyContent: 'center'
    }}>\r
        <div style={{
        padding: '16px',
        border: '2px solid #9c27b0',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>Step 1</div>\r
          <div style={{
          fontSize: '14px'
        }}>User clicks "Report Issue"</div>\r
        </div>\r
        <div style={{
        fontSize: '24px',
        color: '#9c27b0'
      }}>→</div>\r
        <div style={{
        padding: '16px',
        border: '2px solid #9c27b0',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>Step 2</div>\r
          <div style={{
          fontSize: '14px'
        }}>IssueTypeSelectModal opens</div>\r
        </div>\r
        <div style={{
        fontSize: '24px',
        color: '#9c27b0'
      }}>→</div>\r
        <div style={{
        padding: '16px',
        border: '2px solid #9c27b0',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>Step 3</div>\r
          <div style={{
          fontSize: '14px'
        }}>User selects type (bug/feature/etc)</div>\r
        </div>\r
        <div style={{
        fontSize: '24px',
        color: '#9c27b0'
      }}>→</div>\r
        <div style={{
        padding: '16px',
        border: '2px solid #9c27b0',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>Step 4</div>\r
          <div style={{
          fontSize: '14px'
        }}>CreateIssueModal opens with type pre-selected</div>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Two-step modal workflow for creating issues.'
      }
    }
  }
}`,...(O=(_=a.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};const pe=["Default","BugsOnly","BugsAndQuestions","FeaturesAndImprovements","Interactive","IssueTypes","Workflow"];export{i as BugsAndQuestions,r as BugsOnly,n as Default,l as FeaturesAndImprovements,d as Interactive,p as IssueTypes,a as Workflow,pe as __namedExportsOrder,de as default};
