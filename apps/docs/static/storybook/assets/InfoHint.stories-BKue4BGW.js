import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{I as t}from"./InfoHint-TbK9iuJy.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";const ye={title:"Components/Feedback/InfoHint",component:t,tags:["autodocs"],argTypes:{content:{control:"text",description:"Content to display in the popup"},position:{control:"select",options:["top","bottom","left","right"],description:"Position of the popup relative to the icon"},size:{control:"select",options:["small","medium","large"],description:"Size of the info icon"},maxWidth:{control:"number",description:"Max width of the popup in pixels"}},parameters:{docs:{description:{component:"Info hint icon with click-to-show popup tooltip. Uses React Portal for proper positioning."}}}},i={args:{content:"This is helpful information that appears on top.",position:"top"}},o={args:{content:"This is helpful information that appears at the bottom.",position:"bottom"}},n={args:{content:"This is helpful information that appears on the left.",position:"left"}},s={args:{content:"This is helpful information that appears on the right.",position:"right"}},r={args:{content:"Small info hint icon",position:"top",size:"small"}},a={args:{content:"Medium info hint icon (default)",position:"top",size:"medium"}},p={args:{content:"Large info hint icon",position:"top",size:"large"}},l={args:{content:"Quick tip!",position:"top"}},d={args:{content:"This is a longer piece of information that explains something in more detail. It automatically wraps to multiple lines when it exceeds the maximum width.",position:"top",maxWidth:300}},c={args:{content:"This popup has a custom max width of 200px. The text will wrap accordingly.",position:"top",maxWidth:200}},m={args:{content:e.jsxs("div",{children:[e.jsx("strong",{children:"Important Note:"}),e.jsx("p",{style:{margin:"8px 0"},children:"This field accepts email addresses in the format: user@domain.com"}),e.jsxs("ul",{style:{margin:0,paddingLeft:"20px"},children:[e.jsx("li",{children:"Must contain @ symbol"}),e.jsx("li",{children:"Domain must be valid"})]})]}),position:"right",maxWidth:350},parameters:{docs:{description:{story:"InfoHint with rich HTML content including formatting."}}}},x={render:()=>e.jsxs("div",{style:{padding:"40px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("label",{htmlFor:"email-input",style:{fontWeight:"600"},children:"Email Address"}),e.jsx(t,{content:"Enter your business email address. We'll send important notifications here.",position:"right",size:"small"})]}),e.jsx("input",{id:"email-input",type:"email",placeholder:"user@example.com",style:{padding:"10px",border:"2px solid #e0e0e0",borderRadius:"6px",width:"300px",fontSize:"14px"}})]}),parameters:{docs:{description:{story:"InfoHint used as form field help tooltip."}}}},g={render:()=>e.jsx("div",{style:{padding:"40px"},children:e.jsx("table",{style:{borderCollapse:"collapse",width:"100%"},children:e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"2px solid #e0e0e0"},children:[e.jsx("th",{style:{textAlign:"left",padding:"12px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:["Name",e.jsx(t,{content:"Contact's full name as registered in the system.",position:"top",size:"small"})]})}),e.jsx("th",{style:{textAlign:"left",padding:"12px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:["Status",e.jsx(t,{content:"Active contacts receive notifications. Inactive contacts are archived.",position:"top",size:"small"})]})}),e.jsx("th",{style:{textAlign:"left",padding:"12px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:["Last Activity",e.jsx(t,{content:"Timestamp of the last recorded activity (login, order, message).",position:"top",size:"small"})]})})]})})})}),parameters:{docs:{description:{story:"InfoHint used in table headers for column explanations."}}}},h={render:()=>e.jsxs("div",{style:{padding:"40px",maxWidth:"600px"},children:[e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("label",{style:{fontWeight:"600",flex:1},children:"Enable Two-Factor Authentication"}),e.jsx(t,{content:e.jsxs("div",{children:[e.jsx("strong",{children:"Two-Factor Authentication (2FA)"}),e.jsx("p",{style:{margin:"8px 0"},children:"Adds an extra layer of security by requiring a code from your phone in addition to your password."}),e.jsx("p",{style:{margin:0},children:"Recommended for all accounts."})]}),position:"left",maxWidth:300})]}),e.jsx("input",{type:"checkbox",id:"2fa-toggle"})]}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},children:[e.jsx("label",{style:{fontWeight:"600",flex:1},children:"Session Timeout (minutes)"}),e.jsx(t,{content:"Automatically log out after this many minutes of inactivity. Minimum: 5 minutes, Maximum: 1440 minutes (24 hours).",position:"left",maxWidth:300})]}),e.jsx("input",{type:"number",defaultValue:"30",min:"5",max:"1440",style:{padding:"8px",border:"2px solid #e0e0e0",borderRadius:"6px",width:"100px"}})]})]}),parameters:{docs:{description:{story:"InfoHint used in settings page for feature explanations."}}}},u={render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"60px",padding:"100px",placeItems:"center"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(t,{content:"Top position",position:"top"}),e.jsx("div",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Top"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(t,{content:"Bottom position",position:"bottom"}),e.jsx("div",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Bottom"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(t,{content:"Left position",position:"left"}),e.jsx("div",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Left"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(t,{content:"Right position",position:"right"}),e.jsx("div",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Right"})]})]}),parameters:{docs:{description:{story:"All available popup positions."}}}},f={render:()=>e.jsxs("div",{style:{display:"flex",gap:"32px",alignItems:"center",padding:"40px"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(t,{content:"Small size",position:"top",size:"small"}),e.jsx("div",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Small"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(t,{content:"Medium size",position:"top",size:"medium"}),e.jsx("div",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Medium"})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(t,{content:"Large size",position:"top",size:"large"}),e.jsx("div",{style:{marginTop:"8px",fontSize:"14px",color:"#666"},children:"Large"})]})]}),parameters:{docs:{description:{story:"All available icon sizes."}}}};var y,v,j;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    content: 'This is helpful information that appears on top.',
    position: 'top'
  }
}`,...(j=(v=i.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var S,b,z;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    content: 'This is helpful information that appears at the bottom.',
    position: 'bottom'
  }
}`,...(z=(b=o.parameters)==null?void 0:b.docs)==null?void 0:z.source}}};var T,I,A;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    content: 'This is helpful information that appears on the left.',
    position: 'left'
  }
}`,...(A=(I=n.parameters)==null?void 0:I.docs)==null?void 0:A.source}}};var H,w,W;s.parameters={...s.parameters,docs:{...(H=s.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    content: 'This is helpful information that appears on the right.',
    position: 'right'
  }
}`,...(W=(w=s.parameters)==null?void 0:w.docs)==null?void 0:W.source}}};var L,B,M;r.parameters={...r.parameters,docs:{...(L=r.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    content: 'Small info hint icon',
    position: 'top',
    size: 'small'
  }
}`,...(M=(B=r.parameters)==null?void 0:B.docs)==null?void 0:M.source}}};var C,R,F;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    content: 'Medium info hint icon (default)',
    position: 'top',
    size: 'medium'
  }
}`,...(F=(R=a.parameters)==null?void 0:R.docs)==null?void 0:F.source}}};var E,k,N;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    content: 'Large info hint icon',
    position: 'top',
    size: 'large'
  }
}`,...(N=(k=p.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};var P,q,D;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    content: 'Quick tip!',
    position: 'top'
  }
}`,...(D=(q=l.parameters)==null?void 0:q.docs)==null?void 0:D.source}}};var Q,V,_;d.parameters={...d.parameters,docs:{...(Q=d.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    content: 'This is a longer piece of information that explains something in more detail. It automatically wraps to multiple lines when it exceeds the maximum width.',
    position: 'top',
    maxWidth: 300
  }
}`,...(_=(V=d.parameters)==null?void 0:V.docs)==null?void 0:_.source}}};var O,U,G;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    content: 'This popup has a custom max width of 200px. The text will wrap accordingly.',
    position: 'top',
    maxWidth: 200
  }
}`,...(G=(U=c.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};var J,K,X;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    content: <div>\r
        <strong>Important Note:</strong>\r
        <p style={{
        margin: '8px 0'
      }}>\r
          This field accepts email addresses in the format: user@domain.com\r
        </p>\r
        <ul style={{
        margin: 0,
        paddingLeft: '20px'
      }}>\r
          <li>Must contain @ symbol</li>\r
          <li>Domain must be valid</li>\r
        </ul>\r
      </div>,
    position: 'right',
    maxWidth: 350
  },
  parameters: {
    docs: {
      description: {
        story: 'InfoHint with rich HTML content including formatting.'
      }
    }
  }
}`,...(X=(K=m.parameters)==null?void 0:K.docs)==null?void 0:X.source}}};var Y,Z,$;x.parameters={...x.parameters,docs:{...(Y=x.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '40px'
  }}>\r
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    }}>\r
        <label htmlFor="email-input" style={{
        fontWeight: '600'
      }}>\r
          Email Address\r
        </label>\r
        <InfoHint content="Enter your business email address. We'll send important notifications here." position="right" size="small" />\r
      </div>\r
      <input id="email-input" type="email" placeholder="user@example.com" style={{
      padding: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      width: '300px',
      fontSize: '14px'
    }} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'InfoHint used as form field help tooltip.'
      }
    }
  }
}`,...($=(Z=x.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,te,ie;g.parameters={...g.parameters,docs:{...(ee=g.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '40px'
  }}>\r
      <table style={{
      borderCollapse: 'collapse',
      width: '100%'
    }}>\r
        <thead>\r
          <tr style={{
          borderBottom: '2px solid #e0e0e0'
        }}>\r
            <th style={{
            textAlign: 'left',
            padding: '12px'
          }}>\r
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>\r
                Name\r
                <InfoHint content="Contact's full name as registered in the system." position="top" size="small" />\r
              </div>\r
            </th>\r
            <th style={{
            textAlign: 'left',
            padding: '12px'
          }}>\r
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>\r
                Status\r
                <InfoHint content="Active contacts receive notifications. Inactive contacts are archived." position="top" size="small" />\r
              </div>\r
            </th>\r
            <th style={{
            textAlign: 'left',
            padding: '12px'
          }}>\r
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>\r
                Last Activity\r
                <InfoHint content="Timestamp of the last recorded activity (login, order, message)." position="top" size="small" />\r
              </div>\r
            </th>\r
          </tr>\r
        </thead>\r
      </table>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'InfoHint used in table headers for column explanations.'
      }
    }
  }
}`,...(ie=(te=g.parameters)==null?void 0:te.docs)==null?void 0:ie.source}}};var oe,ne,se;h.parameters={...h.parameters,docs:{...(oe=h.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: '40px',
    maxWidth: '600px'
  }}>\r
      <div style={{
      marginBottom: '24px'
    }}>\r
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>\r
          <label style={{
          fontWeight: '600',
          flex: 1
        }}>\r
            Enable Two-Factor Authentication\r
          </label>\r
          <InfoHint content={<div>\r
                <strong>Two-Factor Authentication (2FA)</strong>\r
                <p style={{
            margin: '8px 0'
          }}>\r
                  Adds an extra layer of security by requiring a code from your phone in addition to your password.\r
                </p>\r
                <p style={{
            margin: 0
          }}>\r
                  Recommended for all accounts.\r
                </p>\r
              </div>} position="left" maxWidth={300} />\r
        </div>\r
        <input type="checkbox" id="2fa-toggle" />\r
      </div>\r
\r
      <div style={{
      marginBottom: '24px'
    }}>\r
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>\r
          <label style={{
          fontWeight: '600',
          flex: 1
        }}>\r
            Session Timeout (minutes)\r
          </label>\r
          <InfoHint content="Automatically log out after this many minutes of inactivity. Minimum: 5 minutes, Maximum: 1440 minutes (24 hours)." position="left" maxWidth={300} />\r
        </div>\r
        <input type="number" defaultValue="30" min="5" max="1440" style={{
        padding: '8px',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        width: '100px'
      }} />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'InfoHint used in settings page for feature explanations.'
      }
    }
  }
}`,...(se=(ne=h.parameters)==null?void 0:ne.docs)==null?void 0:se.source}}};var re,ae,pe;u.parameters={...u.parameters,docs:{...(re=u.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '60px',
    padding: '100px',
    placeItems: 'center'
  }}>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <InfoHint content="Top position" position="top" />\r
        <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>Top</div>\r
      </div>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <InfoHint content="Bottom position" position="bottom" />\r
        <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>Bottom</div>\r
      </div>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <InfoHint content="Left position" position="left" />\r
        <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>Left</div>\r
      </div>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <InfoHint content="Right position" position="right" />\r
        <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>Right</div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available popup positions.'
      }
    }
  }
}`,...(pe=(ae=u.parameters)==null?void 0:ae.docs)==null?void 0:pe.source}}};var le,de,ce;f.parameters={...f.parameters,docs:{...(le=f.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    padding: '40px'
  }}>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <InfoHint content="Small size" position="top" size="small" />\r
        <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>Small</div>\r
      </div>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <InfoHint content="Medium size" position="top" size="medium" />\r
        <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>Medium</div>\r
      </div>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <InfoHint content="Large size" position="top" size="large" />\r
        <div style={{
        marginTop: '8px',
        fontSize: '14px',
        color: '#666'
      }}>Large</div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available icon sizes.'
      }
    }
  }
}`,...(ce=(de=f.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};const ve=["Top","Bottom","Left","Right","SizeSmall","SizeMedium","SizeLarge","ShortContent","LongContent","CustomWidth","RichContent","FormFieldHelp","TableHeaderHelp","SettingsHelp","AllPositions","AllSizes"];export{u as AllPositions,f as AllSizes,o as Bottom,c as CustomWidth,x as FormFieldHelp,n as Left,d as LongContent,m as RichContent,s as Right,h as SettingsHelp,l as ShortContent,p as SizeLarge,a as SizeMedium,r as SizeSmall,g as TableHeaderHelp,i as Top,ve as __namedExportsOrder,ye as default};
