import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r}from"./index-BKyFwriW.js";import{F as n}from"./FileUpload-srU4KVWh.js";import"./_commonjsHelpers-CqkleIqs.js";import"./ToastContext-ErSnUSL6.js";const ue={title:"Components/Forms/FileUpload",component:n,tags:["autodocs"],argTypes:{maxFiles:{control:"number",description:"Maximum number of files allowed"},maxSize:{control:"number",description:"Maximum size per file in bytes"},accept:{control:"text",description:"Accepted file types (MIME types or extensions)"},enablePaste:{control:"boolean",description:"Enable Ctrl+V paste functionality"},enableDragDrop:{control:"boolean",description:"Enable drag and drop functionality"},showHint:{control:"boolean",description:"Show file size limit hint"}},parameters:{docs:{description:{component:"Reusable file upload component with click, drag & drop, and paste (Ctrl+V) support. Features hard limit for paste (won't add if at max) and soft limit for drag & drop/click (adds all, parent can disable submit)."}}}},l={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t})}},d={render:()=>{const[s,t]=r.useState([]),[i,a]=r.useState("");return e.jsx(n,{value:s,onChange:t,error:i,onError:a})}},c={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t,maxFiles:3})},parameters:{docs:{description:{story:"File upload with custom max files limit (3 files)."}}}},p={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t,maxSize:5*1024*1024})},parameters:{docs:{description:{story:"File upload with custom max size (5MB per file)."}}}},m={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t,accept:"image/*",dropzoneText:"Click or drag images here",dropzoneHint:"Only image files are accepted"})},parameters:{docs:{description:{story:"File upload that only accepts image files."}}}},u={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t,accept:".pdf",dropzoneText:"Click or drag PDF documents",dropzoneHint:"Only PDF files are accepted"})},parameters:{docs:{description:{story:"File upload that only accepts PDF files."}}}},f={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t,enableDragDrop:!1})},parameters:{docs:{description:{story:"File upload without drag & drop support (click only)."}}}},g={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t,enablePaste:!1})},parameters:{docs:{description:{story:"File upload without Ctrl+V paste support."}}}},x={render:()=>{const[s,t]=r.useState([]);return e.jsx(n,{value:s,onChange:t,showHint:!1})},parameters:{docs:{description:{story:"File upload without file size hint."}}}},h={render:()=>{const[s,t]=r.useState([]),[i,a]=r.useState(!1);return e.jsxs("div",{children:[e.jsx(n,{value:s,onChange:t,maxFiles:3,onFileLimitExceeded:a}),e.jsxs("div",{style:{marginTop:"16px",padding:"12px",background:"#f5f5f5",borderRadius:"4px"},children:[e.jsx("strong",{children:"Submit button status:"})," ",i?"❌ Disabled":"✅ Enabled"]})]})},parameters:{docs:{description:{story:"Demonstrates onFileLimitExceeded callback - parent can disable submit button when too many files."}}}},F={render:()=>{const[s,t]=r.useState([]),[i,a]=r.useState(""),o=()=>{a("Cannot paste - maximum file limit reached!"),setTimeout(()=>a(""),3e3)};return e.jsxs("div",{children:[e.jsx(n,{value:s,onChange:t,maxFiles:3,onPasteLimitReached:o}),i&&e.jsxs("div",{style:{marginTop:"16px",padding:"12px",background:"#fff3cd",borderRadius:"4px",border:"1px solid #ffc107",color:"#856404"},children:["⚠️ ",i]}),e.jsxs("div",{style:{marginTop:"16px",padding:"12px",background:"#f5f5f5",borderRadius:"4px"},children:[e.jsx("strong",{children:"Tip:"})," Try pasting an image (Ctrl+V) when at max files limit"]})]})},parameters:{docs:{description:{story:"Demonstrates onPasteLimitReached callback - shows toast notification when paste is blocked."}}}},b={render:()=>{const[s,t]=r.useState([]),[i,a]=r.useState(""),[o,ne]=r.useState(!1),[v,S]=r.useState(""),ae=()=>{S("Cannot paste - maximum 5 files allowed!"),setTimeout(()=>S(""),3e3)},ie=()=>{if(s.length===0){a("Please attach at least one file");return}if(o){alert("Cannot submit - too many files!");return}alert(`Submitting ${s.length} file(s)!`)};return e.jsxs("div",{style:{maxWidth:"600px"},children:[e.jsx(n,{value:s,onChange:oe=>{t(oe),a("")},error:i,onError:a,maxFiles:5,onFileLimitExceeded:ne,onPasteLimitReached:ae}),v&&e.jsxs("div",{style:{marginTop:"16px",padding:"12px",background:"#fff3cd",borderRadius:"4px",border:"1px solid #ffc107",color:"#856404"},children:["⚠️ ",v]}),e.jsx("button",{onClick:ie,disabled:o,style:{marginTop:"16px",padding:"10px 20px",background:o?"#ccc":"#9c27b0",color:"white",border:"none",borderRadius:"4px",cursor:o?"not-allowed":"pointer"},children:"Submit Files"}),e.jsxs("div",{style:{marginTop:"16px",padding:"12px",background:"#f5f5f5",borderRadius:"4px"},children:[e.jsx("strong",{children:"Features:"}),e.jsxs("ul",{style:{marginTop:"8px",paddingLeft:"20px"},children:[e.jsx("li",{children:"📎 Click or drag & drop files"}),e.jsx("li",{children:"📋 Paste images with Ctrl+V"}),e.jsx("li",{children:"🚫 Hard limit for paste (blocks when at max)"}),e.jsx("li",{children:"⚠️ Soft limit for drag & drop (adds all, disables submit)"})]})]})]})},parameters:{docs:{description:{story:"Complete example with all features: validation, limits, callbacks, and submit button."}}}};var y,C,w;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} />;
  }
}`,...(w=(C=l.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var L,k,T;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    return <FileUpload value={files} onChange={setFiles} error={error} onError={setError} />;
  }
}`,...(T=(k=d.parameters)==null?void 0:k.docs)==null?void 0:T.source}}};var E,j,P;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} maxFiles={3} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload with custom max files limit (3 files).'
      }
    }
  }
}`,...(P=(j=c.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};var M,D,R;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} maxSize={5 * 1024 * 1024} // 5MB
    />;
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload with custom max size (5MB per file).'
      }
    }
  }
}`,...(R=(D=p.parameters)==null?void 0:D.docs)==null?void 0:R.source}}};var O,z,U;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} accept="image/*" dropzoneText="Click or drag images here" dropzoneHint="Only image files are accepted" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload that only accepts image files.'
      }
    }
  }
}`,...(U=(z=m.parameters)==null?void 0:z.docs)==null?void 0:U.source}}};var W,H,I;u.parameters={...u.parameters,docs:{...(W=u.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} accept=".pdf" dropzoneText="Click or drag PDF documents" dropzoneHint="Only PDF files are accepted" />;
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload that only accepts PDF files.'
      }
    }
  }
}`,...(I=(H=u.parameters)==null?void 0:H.docs)==null?void 0:I.source}}};var V,B,_;f.parameters={...f.parameters,docs:{...(V=f.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} enableDragDrop={false} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload without drag & drop support (click only).'
      }
    }
  }
}`,...(_=(B=f.parameters)==null?void 0:B.docs)==null?void 0:_.source}}};var $,A,q;g.parameters={...g.parameters,docs:{...($=g.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} enablePaste={false} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload without Ctrl+V paste support.'
      }
    }
  }
}`,...(q=(A=g.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var G,J,K;x.parameters={...x.parameters,docs:{...(G=x.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload value={files} onChange={setFiles} showHint={false} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'File upload without file size hint.'
      }
    }
  }
}`,...(K=(J=x.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var N,Q,X;h.parameters={...h.parameters,docs:{...(N=h.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isOverLimit, setIsOverLimit] = useState(false);
    return <div>\r
        <FileUpload value={files} onChange={setFiles} maxFiles={3} onFileLimitExceeded={setIsOverLimit} />\r
        <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f5f5f5',
        borderRadius: '4px'
      }}>\r
          <strong>Submit button status:</strong> {isOverLimit ? '❌ Disabled' : '✅ Enabled'}\r
        </div>\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates onFileLimitExceeded callback - parent can disable submit button when too many files.'
      }
    }
  }
}`,...(X=(Q=h.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;F.parameters={...F.parameters,docs:{...(Y=F.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    const [toastMessage, setToastMessage] = useState<string>('');
    const handlePasteLimitReached = () => {
      setToastMessage('Cannot paste - maximum file limit reached!');
      setTimeout(() => setToastMessage(''), 3000);
    };
    return <div>\r
        <FileUpload value={files} onChange={setFiles} maxFiles={3} onPasteLimitReached={handlePasteLimitReached} />\r
        {toastMessage && <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#fff3cd',
        borderRadius: '4px',
        border: '1px solid #ffc107',
        color: '#856404'
      }}>\r
            ⚠️ {toastMessage}\r
          </div>}\r
        <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f5f5f5',
        borderRadius: '4px'
      }}>\r
          <strong>Tip:</strong> Try pasting an image (Ctrl+V) when at max files limit\r
        </div>\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates onPasteLimitReached callback - shows toast notification when paste is blocked.'
      }
    }
  }
}`,...(ee=(Z=F.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var se,te,re;b.parameters={...b.parameters,docs:{...(se=b.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [isOverLimit, setIsOverLimit] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const handlePasteLimitReached = () => {
      setToastMessage('Cannot paste - maximum 5 files allowed!');
      setTimeout(() => setToastMessage(''), 3000);
    };
    const handleSubmit = () => {
      if (files.length === 0) {
        setError('Please attach at least one file');
        return;
      }
      if (isOverLimit) {
        alert('Cannot submit - too many files!');
        return;
      }
      alert(\`Submitting \${files.length} file(s)!\`);
    };
    return <div style={{
      maxWidth: '600px'
    }}>\r
        <FileUpload value={files} onChange={newFiles => {
        setFiles(newFiles);
        setError('');
      }} error={error} onError={setError} maxFiles={5} onFileLimitExceeded={setIsOverLimit} onPasteLimitReached={handlePasteLimitReached} />\r
\r
        {toastMessage && <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#fff3cd',
        borderRadius: '4px',
        border: '1px solid #ffc107',
        color: '#856404'
      }}>\r
            ⚠️ {toastMessage}\r
          </div>}\r
\r
        <button onClick={handleSubmit} disabled={isOverLimit} style={{
        marginTop: '16px',
        padding: '10px 20px',
        background: isOverLimit ? '#ccc' : '#9c27b0',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isOverLimit ? 'not-allowed' : 'pointer'
      }}>\r
          Submit Files\r
        </button>\r
\r
        <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f5f5f5',
        borderRadius: '4px'
      }}>\r
          <strong>Features:</strong>\r
          <ul style={{
          marginTop: '8px',
          paddingLeft: '20px'
        }}>\r
            <li>📎 Click or drag & drop files</li>\r
            <li>📋 Paste images with Ctrl+V</li>\r
            <li>🚫 Hard limit for paste (blocks when at max)</li>\r
            <li>⚠️ Soft limit for drag & drop (adds all, disables submit)</li>\r
          </ul>\r
        </div>\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete example with all features: validation, limits, callbacks, and submit button.'
      }
    }
  }
}`,...(re=(te=b.parameters)==null?void 0:te.docs)==null?void 0:re.source}}};const fe=["Default","WithError","CustomMaxFiles","CustomMaxSize","ImagesOnly","PDFOnly","WithoutDragDrop","WithoutPaste","WithoutHint","WithLimitExceededCallback","WithPasteLimitCallback","CompleteExample"];export{b as CompleteExample,c as CustomMaxFiles,p as CustomMaxSize,l as Default,m as ImagesOnly,u as PDFOnly,d as WithError,h as WithLimitExceededCallback,F as WithPasteLimitCallback,f as WithoutDragDrop,x as WithoutHint,g as WithoutPaste,fe as __namedExportsOrder,ue as default};
