import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as P}from"./index-BKyFwriW.js";import{u as F}from"./ToastContext-ErSnUSL6.js";import"./_commonjsHelpers-CqkleIqs.js";const O="ReportButton-module__button___y0sZl",D="ReportButton-module__buttonGlow___e5B8W",A="ReportButton-module__button--top-right___eGFs5",H="ReportButton-module__button--top-left___-2aJ6",N="ReportButton-module__button--bottom-right___d13Lq",q="ReportButton-module__button--bottom-left___NSh3O",z="ReportButton-module__button__icon___TvWhM",G="ReportButton-module__button__icon___TvWhM",E="ReportButton-module__button__label___nVqbS",U="ReportButton-module__button__label___nVqbS",J="ReportButton-module__modal___XRrdR",X="ReportButton-module__modalFadeIn___-oHJb",Z="ReportButton-module__modal__content___p9s-5",$="ReportButton-module__modal__content___p9s-5",V="ReportButton-module__modalSlideUp___R7NM5",K="ReportButton-module__modal__header___ij716",Q="ReportButton-module__modal__header___ij716",Y="ReportButton-module__modal__title___6Hbdq",tt="ReportButton-module__modal__title___6Hbdq",ot="ReportButton-module__modal__close___uLq-b",et="ReportButton-module__modal__close___uLq-b",rt="ReportButton-module__modal__description___bWPm8",nt="ReportButton-module__modal__description___bWPm8",at="ReportButton-module__modal__form___st8Wk",it="ReportButton-module__modal__form___st8Wk",dt="ReportButton-module__modal__field___pgiHh",st="ReportButton-module__modal__field___pgiHh",lt="ReportButton-module__modal__label___loDch",pt="ReportButton-module__modal__label___loDch",ut="ReportButton-module__modal__typeSelector___NGlNi",ct="ReportButton-module__modal__typeSelector___NGlNi",_t="ReportButton-module__modal__typeButton___mtbgy",mt="ReportButton-module__modal__typeButton___mtbgy",bt="ReportButton-module__modal__typeButton--active___kGUv7",ht="ReportButton-module__modal__textarea___9-5Ug",gt="ReportButton-module__modal__textarea___9-5Ug",xt="ReportButton-module__modal__actions___s1bjB",yt="ReportButton-module__modal__actions___s1bjB",Rt="ReportButton-module__modal__button___vbXnJ",ft="ReportButton-module__modal__button___vbXnJ",Bt="ReportButton-module__modal__button--primary___-Z3B6",vt="ReportButton-module__modal__button--secondary___z6k6c",n={button:O,buttonGlow:D,"button--top-right":"ReportButton-module__button--top-right___eGFs5",buttonTopRight:A,"button--top-left":"ReportButton-module__button--top-left___-2aJ6",buttonTopLeft:H,"button--bottom-right":"ReportButton-module__button--bottom-right___d13Lq",buttonBottomRight:N,"button--bottom-left":"ReportButton-module__button--bottom-left___NSh3O",buttonBottomLeft:q,button__icon:z,buttonIcon:G,button__label:E,buttonLabel:U,modal:J,modalFadeIn:X,modal__content:Z,modalContent:$,modalSlideUp:V,modal__header:K,modalHeader:Q,modal__title:Y,modalTitle:tt,modal__close:ot,modalClose:et,modal__description:rt,modalDescription:nt,modal__form:at,modalForm:it,modal__field:dt,modalField:st,modal__label:lt,modalLabel:pt,modal__typeSelector:ut,modalTypeSelector:ct,modal__typeButton:_t,modalTypeButton:mt,"modal__typeButton--active":"ReportButton-module__modal__typeButton--active___kGUv7",modalTypeButtonActive:bt,modal__textarea:ht,modalTextarea:gt,modal__actions:xt,modalActions:yt,modal__button:Rt,modalButton:ft,"modal__button--primary":"ReportButton-module__modal__button--primary___-Z3B6",modalButtonPrimary:Bt,"modal__button--secondary":"ReportButton-module__modal__button--secondary___z6k6c",modalButtonSecondary:vt},e=({onClick:r,position:o="top-right"})=>{const{t:c}=F();return t.jsxs("button",{className:`${n.button} ${n[`button--${o}`]}`,onClick:r,title:c("components.reportButton.title"),"aria-label":c("components.reportButton.title"),type:"button",children:[t.jsx("span",{className:n.button__icon,children:"!"}),t.jsx("span",{className:n.button__label,children:c("components.reportButton.buttonLabel")})]})},It={title:"Components/Data/ReportButton",component:e,tags:["autodocs"],argTypes:{position:{control:"select",options:["top-right","top-left","bottom-right","bottom-left"],description:"Position of the floating button"}},parameters:{docs:{description:{component:"Floating button for reporting issues. Triggers external CreateIssueModal via onClick callback."}},layout:"fullscreen"}},a={args:{position:"top-right",onClick:()=>alert("Report button clicked! (Would open CreateIssueModal)")},parameters:{docs:{description:{story:"Default position - top right corner."}}}},i={args:{position:"top-left",onClick:()=>alert("Report button clicked! (Would open CreateIssueModal)")},parameters:{docs:{description:{story:"Floating button positioned in top left corner."}}}},d={args:{position:"bottom-right",onClick:()=>alert("Report button clicked! (Would open CreateIssueModal)")},parameters:{docs:{description:{story:"Floating button positioned in bottom right corner."}}}},s={args:{position:"bottom-left",onClick:()=>alert("Report button clicked! (Would open CreateIssueModal)")},parameters:{docs:{description:{story:"Floating button positioned in bottom left corner."}}}},l={render:()=>{const[r,o]=P.useState(!1);return t.jsxs("div",{style:{position:"relative",height:"400px",border:"1px dashed var(--theme-border)",borderRadius:"8px"},children:[t.jsxs("div",{style:{padding:"20px"},children:[t.jsx("h3",{children:"Page Content"}),t.jsx("p",{children:"This is a sample page with a floating report button in the top-right corner."}),t.jsx("p",{children:"Click the report button to open the issue modal."})]}),t.jsx(e,{position:"top-right",onClick:()=>o(!0)}),r&&t.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e4},children:t.jsxs("div",{style:{background:"var(--theme-input-background)",padding:"24px",borderRadius:"8px",maxWidth:"500px",width:"90%"},children:[t.jsx("h3",{style:{marginTop:0},children:"Report an Issue"}),t.jsx("p",{children:"This would be the CreateIssueModal component."}),t.jsx("button",{onClick:()=>o(!1),style:{marginTop:"16px",padding:"8px 16px",background:"var(--color-brand-primary)",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Close"})]})})]})},parameters:{docs:{description:{story:"Example showing ReportButton integrated with a modal (simulated CreateIssueModal)."}}}},p={render:()=>t.jsxs("div",{style:{position:"relative",height:"500px",border:"1px dashed var(--theme-border)",borderRadius:"8px"},children:[t.jsxs("div",{style:{padding:"20px",textAlign:"center"},children:[t.jsx("h3",{children:"All Positions Demo"}),t.jsx("p",{children:"Report buttons in all four corner positions."}),t.jsx("p",{style:{fontSize:"14px",color:"var(--theme-text-muted)",marginTop:"20px"},children:"Note: In real usage, you would only use one button per page."})]}),t.jsx(e,{position:"top-right",onClick:()=>alert("Top Right")}),t.jsx(e,{position:"top-left",onClick:()=>alert("Top Left")}),t.jsx(e,{position:"bottom-right",onClick:()=>alert("Bottom Right")}),t.jsx(e,{position:"bottom-left",onClick:()=>alert("Bottom Left")})]}),parameters:{docs:{description:{story:"Demo showing all four corner positions simultaneously (use only one in real applications)."}}}},u={render:()=>{const[r,o]=P.useState(!1);return t.jsxs("div",{style:{position:"relative",minHeight:"600px",background:"var(--theme-input-background)",border:"1px solid var(--theme-border)",borderRadius:"8px",display:"flex",flexDirection:"column"},children:[t.jsx("div",{style:{padding:"20px",borderBottom:"1px solid var(--theme-border)",background:"var(--color-brand-primary)",color:"white",borderRadius:"8px 8px 0 0"},children:t.jsx("h2",{style:{margin:0},children:"Page Title"})}),t.jsxs("div",{style:{flex:1,padding:"20px"},children:[t.jsx("h3",{children:"Content Area"}),t.jsx("p",{children:"This simulates a typical page layout with a PageTemplate component."}),t.jsx("p",{children:"The report button is floating in the top-right corner, always accessible."}),t.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"var(--theme-input-border)",borderRadius:"4px"},children:[t.jsx("h4",{children:"Sample Section"}),t.jsx("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit."})]}),t.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"var(--theme-input-border)",borderRadius:"4px"},children:[t.jsx("h4",{children:"Another Section"}),t.jsx("p",{children:"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."})]})]}),t.jsx(e,{position:"top-right",onClick:()=>o(!0)}),r&&t.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e4},children:t.jsxs("div",{style:{background:"var(--theme-input-background)",padding:"24px",borderRadius:"8px",maxWidth:"500px",width:"90%",boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)"},children:[t.jsx("h3",{style:{marginTop:0},children:"Report an Issue"}),t.jsx("p",{children:"Found a bug or have feedback? Let us know!"}),t.jsx("textarea",{placeholder:"Describe the issue...",style:{width:"100%",minHeight:"100px",padding:"8px",border:"1px solid var(--theme-border)",borderRadius:"4px",resize:"vertical"}}),t.jsxs("div",{style:{marginTop:"16px",display:"flex",gap:"8px",justifyContent:"flex-end"},children:[t.jsx("button",{onClick:()=>o(!1),style:{padding:"8px 16px",background:"transparent",color:"var(--theme-text)",border:"1px solid var(--theme-border)",borderRadius:"4px",cursor:"pointer"},children:"Cancel"}),t.jsx("button",{onClick:()=>{alert("Issue submitted!"),o(!1)},style:{padding:"8px 16px",background:"var(--color-brand-primary)",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Submit"})]})]})})]})},parameters:{docs:{description:{story:"Example showing ReportButton integrated into a full page layout with modal."}}}};var _,m,b;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    position: 'top-right',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)')
  },
  parameters: {
    docs: {
      description: {
        story: 'Default position - top right corner.'
      }
    }
  }
}`,...(b=(m=a.parameters)==null?void 0:m.docs)==null?void 0:b.source}}};var h,g,x;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    position: 'top-left',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)')
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned in top left corner.'
      }
    }
  }
}`,...(x=(g=i.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var y,R,f;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    position: 'bottom-right',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)')
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned in bottom right corner.'
      }
    }
  }
}`,...(f=(R=d.parameters)==null?void 0:R.docs)==null?void 0:f.source}}};var B,v,k;s.parameters={...s.parameters,docs:{...(B=s.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    position: 'bottom-left',
    onClick: () => alert('Report button clicked! (Would open CreateIssueModal)')
  },
  parameters: {
    docs: {
      description: {
        story: 'Floating button positioned in bottom left corner.'
      }
    }
  }
}`,...(k=(v=s.parameters)==null?void 0:v.docs)==null?void 0:k.source}}};var C,j,T;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return <div style={{
      position: 'relative',
      height: '400px',
      border: '1px dashed var(--theme-border)',
      borderRadius: '8px'
    }}>\r
        <div style={{
        padding: '20px'
      }}>\r
          <h3>Page Content</h3>\r
          <p>This is a sample page with a floating report button in the top-right corner.</p>\r
          <p>Click the report button to open the issue modal.</p>\r
        </div>\r
\r
        <ReportButton position="top-right" onClick={() => setIsModalOpen(true)} />\r
\r
        {/* Mock Modal */}\r
        {isModalOpen && <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}>\r
            <div style={{
          background: 'var(--theme-input-background)',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%'
        }}>\r
              <h3 style={{
            marginTop: 0
          }}>Report an Issue</h3>\r
              <p>This would be the CreateIssueModal component.</p>\r
              <button onClick={() => setIsModalOpen(false)} style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: 'var(--color-brand-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>\r
                Close\r
              </button>\r
            </div>\r
          </div>}\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing ReportButton integrated with a modal (simulated CreateIssueModal).'
      }
    }
  }
}`,...(T=(j=l.parameters)==null?void 0:j.docs)==null?void 0:T.source}}};var I,M,S;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div style={{
    position: 'relative',
    height: '500px',
    border: '1px dashed var(--theme-border)',
    borderRadius: '8px'
  }}>\r
      <div style={{
      padding: '20px',
      textAlign: 'center'
    }}>\r
        <h3>All Positions Demo</h3>\r
        <p>Report buttons in all four corner positions.</p>\r
        <p style={{
        fontSize: '14px',
        color: 'var(--theme-text-muted)',
        marginTop: '20px'
      }}>\r
          Note: In real usage, you would only use one button per page.\r
        </p>\r
      </div>\r
\r
      <ReportButton position="top-right" onClick={() => alert('Top Right')} />\r
      <ReportButton position="top-left" onClick={() => alert('Top Left')} />\r
      <ReportButton position="bottom-right" onClick={() => alert('Bottom Right')} />\r
      <ReportButton position="bottom-left" onClick={() => alert('Bottom Left')} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demo showing all four corner positions simultaneously (use only one in real applications).'
      }
    }
  }
}`,...(S=(M=p.parameters)==null?void 0:M.docs)==null?void 0:S.source}}};var w,L,W;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return <div style={{
      position: 'relative',
      minHeight: '600px',
      background: 'var(--theme-input-background)',
      border: '1px solid var(--theme-border)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column'
    }}>\r
        {/* Mock Page Header */}\r
        <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--theme-border)',
        background: 'var(--color-brand-primary)',
        color: 'white',
        borderRadius: '8px 8px 0 0'
      }}>\r
          <h2 style={{
          margin: 0
        }}>Page Title</h2>\r
        </div>\r
\r
        {/* Mock Page Content */}\r
        <div style={{
        flex: 1,
        padding: '20px'
      }}>\r
          <h3>Content Area</h3>\r
          <p>This simulates a typical page layout with a PageTemplate component.</p>\r
          <p>The report button is floating in the top-right corner, always accessible.</p>\r
          <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'var(--theme-input-border)',
          borderRadius: '4px'
        }}>\r
            <h4>Sample Section</h4>\r
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\r
          </div>\r
          <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'var(--theme-input-border)',
          borderRadius: '4px'
        }}>\r
            <h4>Another Section</h4>\r
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>\r
          </div>\r
        </div>\r
\r
        {/* Report Button */}\r
        <ReportButton position="top-right" onClick={() => setIsModalOpen(true)} />\r
\r
        {/* Mock Modal */}\r
        {isModalOpen && <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}>\r
            <div style={{
          background: 'var(--theme-input-background)',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>\r
              <h3 style={{
            marginTop: 0
          }}>Report an Issue</h3>\r
              <p>Found a bug or have feedback? Let us know!</p>\r
              <textarea placeholder="Describe the issue..." style={{
            width: '100%',
            minHeight: '100px',
            padding: '8px',
            border: '1px solid var(--theme-border)',
            borderRadius: '4px',
            resize: 'vertical'
          }} />\r
              <div style={{
            marginTop: '16px',
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end'
          }}>\r
                <button onClick={() => setIsModalOpen(false)} style={{
              padding: '8px 16px',
              background: 'transparent',
              color: 'var(--theme-text)',
              border: '1px solid var(--theme-border)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>\r
                  Cancel\r
                </button>\r
                <button onClick={() => {
              alert('Issue submitted!');
              setIsModalOpen(false);
            }} style={{
              padding: '8px 16px',
              background: 'var(--color-brand-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>\r
                  Submit\r
                </button>\r
              </div>\r
            </div>\r
          </div>}\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing ReportButton integrated into a full page layout with modal.'
      }
    }
  }
}`,...(W=(L=u.parameters)==null?void 0:L.docs)==null?void 0:W.source}}};const Mt=["TopRight","TopLeft","BottomRight","BottomLeft","WithModal","MultiplePositions","WithPageTemplate"];export{s as BottomLeft,d as BottomRight,p as MultiplePositions,i as TopLeft,a as TopRight,l as WithModal,u as WithPageTemplate,Mt as __namedExportsOrder,It as default};
