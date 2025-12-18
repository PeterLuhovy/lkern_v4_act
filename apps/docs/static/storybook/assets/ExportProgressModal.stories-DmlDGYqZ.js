import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{u as _e}from"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import{M as Be}from"./ConfirmModal-Ds9lIxjL.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./DebugBar-C6YrkoDS.js";import"./Button-gnwGUMlA.js";import"./classNames-CN4lTu6a.js";import"./Input-CFoEo-oh.js";import"./FormField-7Fj67rB9.js";import"./InfoHint-TbK9iuJy.js";const be="ExportProgressModal-module__progressSection___msqf9",Pe="ExportProgressModal-module__progressInfo___i02u3",Ce="ExportProgressModal-module__progressSize___Fg-FC",je="ExportProgressModal-module__progressPercent___EAtKK",ze="ExportProgressModal-module__progressBar___ucRr9",Me="ExportProgressModal-module__progressFill___uCYkI",Ke="ExportProgressModal-module__fileSection___qRvBb",Ie="ExportProgressModal-module__fileCount___tfPjA",ke="ExportProgressModal-module__fileList___U8L42",Ee="ExportProgressModal-module__fileItem___d-Bgm",Oe="ExportProgressModal-module__fileInfo___-reYm",Ne="ExportProgressModal-module__fileName___4crhK",Fe="ExportProgressModal-module__fileEntity___A48oF",We="ExportProgressModal-module__fileSize___Ow6XE",Le="ExportProgressModal-module__noAttachments___mQcBg",Ze="ExportProgressModal-module__cancelSection___ilnyV",Re="ExportProgressModal-module__cancelButton___V2bR9",o={progressSection:be,progressInfo:Pe,progressSize:Ce,progressPercent:je,progressBar:ze,progressFill:Me,fileSection:Ke,fileCount:Ie,fileList:ke,fileItem:Ee,fileInfo:Oe,fileName:Ne,fileEntity:Fe,fileSize:We,noAttachments:Le,cancelSection:Ze,cancelButton:Re},Ae=({isOpen:ce,format:me,progress:n,files:t,onCancel:S,title:_,healthCheckText:ge,downloadingText:B,processingText:xe="Spracovávam...",completeText:he="Hotovo!",noAttachmentsText:fe,attachmentsLabel:ue,cancelText:ye})=>{const{t:v}=_e(),we=v("pages.issues.exportZipLoading"),b=v("pages.issues.exportLoading",{format:me}),ve="📋 Exportujem iba dáta (žiadne prílohy)",Se=()=>{if(_)return _;switch(n==null?void 0:n.phase){case"healthCheck":return ge||we;case"downloading":return B||b;case"processing":return xe;case"complete":return he;default:return B||b}},a=s=>s<1024?`${s} B`:s<1024*1024?`${(s/1024).toFixed(1)} KB`:`${(s/1024/1024).toFixed(2)} MB`;return e.jsxs(Be,{isOpen:ce,onClose:()=>{},modalId:"export-progress",size:"md",showCloseButton:!1,title:Se(),children:[e.jsx("style",{children:`
        @keyframes exportIndeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
      `}),n&&n.phase!=="healthCheck"&&e.jsxs("div",{className:o.progressSection,children:[e.jsxs("div",{className:o.progressInfo,children:[e.jsx("span",{className:o.progressSize,children:n.totalKnown?`${a(n.downloadedBytes)} / ${a(n.totalBytes)}`:a(n.downloadedBytes)}),e.jsx("span",{className:o.progressPercent,children:n.totalKnown?`${n.percentage}%`:"..."})]}),e.jsx("div",{className:o.progressBar,children:e.jsx("div",{className:o.progressFill,style:{width:n.totalKnown?`${n.percentage}%`:"30%",transition:n.totalKnown?"width 0.3s ease":"none",animation:n.totalKnown?"none":"exportIndeterminate 1.5s ease-in-out infinite"}})})]}),t.length>0&&e.jsxs("div",{className:o.fileSection,children:[e.jsxs("p",{className:o.fileCount,children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"📎"})," ",t.length," ",ue||(t.length===1?"príloha":"príloh")," na stiahnutie:"]}),e.jsx("div",{className:o.fileList,children:t.map((s,P)=>e.jsxs("div",{className:o.fileItem,style:{borderBottom:P<t.length-1?"1px solid var(--theme-border, #e0e0e0)":"none"},children:[e.jsxs("div",{className:o.fileInfo,children:[e.jsxs("div",{className:o.fileName,children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"📄"})," ",s.name]}),e.jsx("div",{className:o.fileEntity,children:s.entityCode})]}),e.jsx("div",{className:o.fileSize,children:s.size>0?a(s.size):"—"})]},P))})]}),t.length===0&&e.jsx("p",{className:o.noAttachments,children:fe||ve}),S&&(n==null?void 0:n.phase)!=="complete"&&e.jsx("div",{className:o.cancelSection,children:e.jsx("button",{type:"button",onClick:S,className:o.cancelButton,children:ye||v("common.cancel")})})]})},nn={title:"Components/Modals/ExportProgressModal",component:Ae,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},format:{control:"text",description:"Export format (CSV, JSON, ZIP)"}},parameters:{docs:{description:{component:"Reusable export progress modal for serviceWorkflow downloads. Shows progress bar, file list, and status."}}}},r=[{name:"screenshot-2025-12-16.png",entityCode:"LKMS-123",size:1024*512},{name:"error-log.txt",entityCode:"LKMS-124",size:1024*8},{name:"diagram.pdf",entityCode:"LKMS-125",size:1024*1024*2.5}],i={args:{isOpen:!0,format:"ZIP",progress:{phase:"healthCheck",percentage:0,downloadedBytes:0,totalBytes:0,totalKnown:!1},files:r},parameters:{docs:{description:{story:"Health check phase - checking if backend service is available."}}}},d={args:{isOpen:!0,format:"ZIP",progress:{phase:"downloading",percentage:45,downloadedBytes:1024*1024*1.5,totalBytes:1024*1024*3.5,totalKnown:!0},files:r},parameters:{docs:{description:{story:"Downloading phase with known total size - shows percentage and progress bar."}}}},l={args:{isOpen:!0,format:"ZIP",progress:{phase:"downloading",percentage:0,downloadedBytes:1024*1024*1.2,totalBytes:0,totalKnown:!1},files:r},parameters:{docs:{description:{story:"Downloading phase with unknown total size - shows indeterminate progress bar animation."}}}},p={args:{isOpen:!0,format:"ZIP",progress:{phase:"processing",percentage:100,downloadedBytes:1024*1024*3.5,totalBytes:1024*1024*3.5,totalKnown:!0},files:r},parameters:{docs:{description:{story:"Processing phase - download complete, processing ZIP file."}}}},c={args:{isOpen:!0,format:"ZIP",progress:{phase:"complete",percentage:100,downloadedBytes:1024*1024*3.5,totalBytes:1024*1024*3.5,totalKnown:!0},files:r},parameters:{docs:{description:{story:"Complete phase - export finished, file saved to disk."}}}},m={args:{isOpen:!0,format:"CSV",progress:{phase:"downloading",percentage:60,downloadedBytes:1024*50,totalBytes:1024*80,totalKnown:!0},files:[]},parameters:{docs:{description:{story:"CSV export - no attachments, only data."}}}},g={args:{isOpen:!0,format:"JSON",progress:{phase:"downloading",percentage:35,downloadedBytes:1024*120,totalBytes:1024*350,totalKnown:!0},files:[]},parameters:{docs:{description:{story:"JSON export - no attachments, only data."}}}},x={args:{isOpen:!0,format:"ZIP",progress:{phase:"downloading",percentage:25,downloadedBytes:1024*1024*5,totalBytes:1024*1024*20,totalKnown:!0},files:[{name:"screenshot1.png",entityCode:"LKMS-100",size:1024*512},{name:"screenshot2.png",entityCode:"LKMS-101",size:1024*480},{name:"error-log.txt",entityCode:"LKMS-102",size:1024*12},{name:"video-demo.mp4",entityCode:"LKMS-103",size:1024*1024*8},{name:"document.pdf",entityCode:"LKMS-104",size:1024*1024*3}]},parameters:{docs:{description:{story:"ZIP export with many files - shows scrollable file list."}}}},h={args:{isOpen:!0,format:"ZIP",progress:{phase:"downloading",percentage:30,downloadedBytes:1024*1024,totalBytes:1024*1024*3.5,totalKnown:!0},files:r,onCancel:()=>console.log("Export cancelled")},parameters:{docs:{description:{story:"With cancel button - allows user to abort download."}}}},f={args:{isOpen:!0,format:"CSV",progress:{phase:"downloading",percentage:80,downloadedBytes:1024*40,totalBytes:1024*50,totalKnown:!0},files:[]},parameters:{docs:{description:{story:"No attachments - shows message instead of file list."}}}},u={args:{isOpen:!0,format:"ZIP",progress:{phase:"downloading",percentage:15,downloadedBytes:1024*1024*50,totalBytes:1024*1024*350,totalKnown:!0},files:[{name:"large-video.mp4",entityCode:"LKMS-999",size:1024*1024*350}]},parameters:{docs:{description:{story:"Large file download - progress updates more slowly."}}}},y={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("h3",{children:"Export Progress Phases"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",justifyContent:"center"},children:[e.jsxs("div",{style:{padding:"16px",border:"2px solid #3366cc",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"1. Health Check"}),e.jsx("div",{style:{fontSize:"14px"},children:"Verify backend availability"})]}),e.jsx("div",{style:{fontSize:"24px",color:"#3366cc"},children:"→"}),e.jsxs("div",{style:{padding:"16px",border:"2px solid #3366cc",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"2. Downloading"}),e.jsx("div",{style:{fontSize:"14px"},children:"Stream file data"})]}),e.jsx("div",{style:{fontSize:"24px",color:"#3366cc"},children:"→"}),e.jsxs("div",{style:{padding:"16px",border:"2px solid #3366cc",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"3. Processing"}),e.jsx("div",{style:{fontSize:"14px"},children:"Prepare final file"})]}),e.jsx("div",{style:{fontSize:"24px",color:"#3366cc"},children:"→"}),e.jsxs("div",{style:{padding:"16px",border:"2px solid #4CAF50",borderRadius:"8px",textAlign:"center",minWidth:"150px"},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:"8px"},children:"4. Complete"}),e.jsx("div",{style:{fontSize:"14px"},children:"File saved to disk"})]})]})]}),parameters:{docs:{description:{story:"Four-phase export workflow with serviceWorkflow integration."}}}},w={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("h3",{children:"ExportProgressModal Features"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"📊 Progress Bar"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Determinate (with total) or indeterminate (unknown size)."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"📎 File List"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Shows all files being exported with sizes."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"⚙️ serviceWorkflow"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Integrates with serviceWorkflow onProgress callback."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"🚫 Cancellable"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Optional cancel button to abort download."})]})]})]}),parameters:{docs:{description:{story:"ExportProgressModal key features overview."}}}};var C,j,z;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'healthCheck',
      percentage: 0,
      downloadedBytes: 0,
      totalBytes: 0,
      totalKnown: false
    },
    files: sampleFiles
  },
  parameters: {
    docs: {
      description: {
        story: 'Health check phase - checking if backend service is available.'
      }
    }
  }
}`,...(z=(j=i.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var M,K,I;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 45,
      downloadedBytes: 1024 * 1024 * 1.5,
      // 1.5 MB
      totalBytes: 1024 * 1024 * 3.5,
      // 3.5 MB
      totalKnown: true
    },
    files: sampleFiles
  },
  parameters: {
    docs: {
      description: {
        story: 'Downloading phase with known total size - shows percentage and progress bar.'
      }
    }
  }
}`,...(I=(K=d.parameters)==null?void 0:K.docs)==null?void 0:I.source}}};var k,E,O;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 0,
      downloadedBytes: 1024 * 1024 * 1.2,
      // 1.2 MB
      totalBytes: 0,
      totalKnown: false
    },
    files: sampleFiles
  },
  parameters: {
    docs: {
      description: {
        story: 'Downloading phase with unknown total size - shows indeterminate progress bar animation.'
      }
    }
  }
}`,...(O=(E=l.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};var N,F,W;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'processing',
      percentage: 100,
      downloadedBytes: 1024 * 1024 * 3.5,
      totalBytes: 1024 * 1024 * 3.5,
      totalKnown: true
    },
    files: sampleFiles
  },
  parameters: {
    docs: {
      description: {
        story: 'Processing phase - download complete, processing ZIP file.'
      }
    }
  }
}`,...(W=(F=p.parameters)==null?void 0:F.docs)==null?void 0:W.source}}};var L,Z,R;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'complete',
      percentage: 100,
      downloadedBytes: 1024 * 1024 * 3.5,
      totalBytes: 1024 * 1024 * 3.5,
      totalKnown: true
    },
    files: sampleFiles
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete phase - export finished, file saved to disk.'
      }
    }
  }
}`,...(R=(Z=c.parameters)==null?void 0:Z.docs)==null?void 0:R.source}}};var A,D,V;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'CSV',
    progress: {
      phase: 'downloading',
      percentage: 60,
      downloadedBytes: 1024 * 50,
      totalBytes: 1024 * 80,
      totalKnown: true
    },
    files: []
  },
  parameters: {
    docs: {
      description: {
        story: 'CSV export - no attachments, only data.'
      }
    }
  }
}`,...(V=(D=m.parameters)==null?void 0:D.docs)==null?void 0:V.source}}};var H,J,T;g.parameters={...g.parameters,docs:{...(H=g.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'JSON',
    progress: {
      phase: 'downloading',
      percentage: 35,
      downloadedBytes: 1024 * 120,
      totalBytes: 1024 * 350,
      totalKnown: true
    },
    files: []
  },
  parameters: {
    docs: {
      description: {
        story: 'JSON export - no attachments, only data.'
      }
    }
  }
}`,...(T=(J=g.parameters)==null?void 0:J.docs)==null?void 0:T.source}}};var $,X,q;x.parameters={...x.parameters,docs:{...($=x.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 25,
      downloadedBytes: 1024 * 1024 * 5,
      totalBytes: 1024 * 1024 * 20,
      totalKnown: true
    },
    files: [{
      name: 'screenshot1.png',
      entityCode: 'LKMS-100',
      size: 1024 * 512
    }, {
      name: 'screenshot2.png',
      entityCode: 'LKMS-101',
      size: 1024 * 480
    }, {
      name: 'error-log.txt',
      entityCode: 'LKMS-102',
      size: 1024 * 12
    }, {
      name: 'video-demo.mp4',
      entityCode: 'LKMS-103',
      size: 1024 * 1024 * 8
    }, {
      name: 'document.pdf',
      entityCode: 'LKMS-104',
      size: 1024 * 1024 * 3
    }]
  },
  parameters: {
    docs: {
      description: {
        story: 'ZIP export with many files - shows scrollable file list.'
      }
    }
  }
}`,...(q=(X=x.parameters)==null?void 0:X.docs)==null?void 0:q.source}}};var Y,Q,U;h.parameters={...h.parameters,docs:{...(Y=h.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 30,
      downloadedBytes: 1024 * 1024,
      totalBytes: 1024 * 1024 * 3.5,
      totalKnown: true
    },
    files: sampleFiles,
    onCancel: () => console.log('Export cancelled')
  },
  parameters: {
    docs: {
      description: {
        story: 'With cancel button - allows user to abort download.'
      }
    }
  }
}`,...(U=(Q=h.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var G,ee,ne;f.parameters={...f.parameters,docs:{...(G=f.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'CSV',
    progress: {
      phase: 'downloading',
      percentage: 80,
      downloadedBytes: 1024 * 40,
      totalBytes: 1024 * 50,
      totalKnown: true
    },
    files: []
  },
  parameters: {
    docs: {
      description: {
        story: 'No attachments - shows message instead of file list.'
      }
    }
  }
}`,...(ne=(ee=f.parameters)==null?void 0:ee.docs)==null?void 0:ne.source}}};var oe,se,te;u.parameters={...u.parameters,docs:{...(oe=u.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    format: 'ZIP',
    progress: {
      phase: 'downloading',
      percentage: 15,
      downloadedBytes: 1024 * 1024 * 50,
      totalBytes: 1024 * 1024 * 350,
      totalKnown: true
    },
    files: [{
      name: 'large-video.mp4',
      entityCode: 'LKMS-999',
      size: 1024 * 1024 * 350 // 350 MB
    }]
  },
  parameters: {
    docs: {
      description: {
        story: 'Large file download - progress updates more slowly.'
      }
    }
  }
}`,...(te=(se=u.parameters)==null?void 0:se.docs)==null?void 0:te.source}}};var re,ae,ie;y.parameters={...y.parameters,docs:{...(re=y.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>Export Progress Phases</h3>\r
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      justifyContent: 'center'
    }}>\r
        <div style={{
        padding: '16px',
        border: '2px solid #3366cc',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>1. Health Check</div>\r
          <div style={{
          fontSize: '14px'
        }}>Verify backend availability</div>\r
        </div>\r
        <div style={{
        fontSize: '24px',
        color: '#3366cc'
      }}>→</div>\r
        <div style={{
        padding: '16px',
        border: '2px solid #3366cc',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>2. Downloading</div>\r
          <div style={{
          fontSize: '14px'
        }}>Stream file data</div>\r
        </div>\r
        <div style={{
        fontSize: '24px',
        color: '#3366cc'
      }}>→</div>\r
        <div style={{
        padding: '16px',
        border: '2px solid #3366cc',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>3. Processing</div>\r
          <div style={{
          fontSize: '14px'
        }}>Prepare final file</div>\r
        </div>\r
        <div style={{
        fontSize: '24px',
        color: '#3366cc'
      }}>→</div>\r
        <div style={{
        padding: '16px',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '150px'
      }}>\r
          <div style={{
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>4. Complete</div>\r
          <div style={{
          fontSize: '14px'
        }}>File saved to disk</div>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Four-phase export workflow with serviceWorkflow integration.'
      }
    }
  }
}`,...(ie=(ae=y.parameters)==null?void 0:ae.docs)==null?void 0:ie.source}}};var de,le,pe;w.parameters={...w.parameters,docs:{...(de=w.parameters)==null?void 0:de.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>ExportProgressModal Features</h3>\r
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    }}>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>📊 Progress Bar</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Determinate (with total) or indeterminate (unknown size).</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>📎 File List</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Shows all files being exported with sizes.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>⚙️ serviceWorkflow</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Integrates with serviceWorkflow onProgress callback.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>🚫 Cancellable</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Optional cancel button to abort download.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'ExportProgressModal key features overview.'
      }
    }
  }
}`,...(pe=(le=w.parameters)==null?void 0:le.docs)==null?void 0:pe.source}}};const on=["HealthCheck","DownloadingDeterminate","DownloadingIndeterminate","Processing","Complete","CSVExport","JSONExport","ZIPWithManyFiles","WithCancel","NoAttachments","LargeFile","ProgressPhases","Features"];export{m as CSVExport,c as Complete,d as DownloadingDeterminate,l as DownloadingIndeterminate,w as Features,i as HealthCheck,g as JSONExport,u as LargeFile,f as NoAttachments,p as Processing,y as ProgressPhases,h as WithCancel,x as ZIPWithManyFiles,on as __namedExportsOrder,nn as default};
