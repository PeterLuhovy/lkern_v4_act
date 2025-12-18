import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-BKyFwriW.js";import{u as is}from"./ToastContext-ErSnUSL6.js";import{u as ls}from"./useToast-CWKozLYC.js";import{u as ds}from"./useFormDirty-DiJri1G9.js";import{u as cs,M as ps,C as ee}from"./ConfirmModal-Ds9lIxjL.js";import{B as H}from"./Button-gnwGUMlA.js";import{I as se}from"./Input-CFoEo-oh.js";import{T as te}from"./Textarea-CaCPejZY.js";import{S as b}from"./Select-WvzepR3_.js";import{F as u}from"./FormField-7Fj67rB9.js";import{F as us}from"./FileUpload-srU4KVWh.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DcHVLjtu.js";import"./index-DQw2Bw4b.js";import"./DebugBar-C6YrkoDS.js";import"./classNames-CN4lTu6a.js";import"./InfoHint-TbK9iuJy.js";const ms="CreateIssueModal-module__formContainer___O4i1f",gs="CreateIssueModal-module__formGroup___x0qOM",xs="CreateIssueModal-module__formRow___YXotA",hs="CreateIssueModal-module__label___J-Nfm",ys="CreateIssueModal-module__required___5i9uS",fs="CreateIssueModal-module__error___w7qq6",bs="CreateIssueModal-module__readOnlyField___RXBIh",vs="CreateIssueModal-module__dropzone___sAFm7",_s="CreateIssueModal-module__fileInputHidden___hdDuy",js="CreateIssueModal-module__dropzoneContent___qZUBP",Cs="CreateIssueModal-module__dropzoneIcon___Vq0om",Is="CreateIssueModal-module__dropzoneText___ArJVt",ws="CreateIssueModal-module__dropzoneHint___ehX9m",Ss="CreateIssueModal-module__fileHint___xkQNG",Rs="CreateIssueModal-module__fileList___0LSfe",Ms="CreateIssueModal-module__fileItem___o6YcE",As="CreateIssueModal-module__removeFileBtn___OqSSA",Ts="CreateIssueModal-module__formActions___BOF8d",Bs="CreateIssueModal-module__roleTabs___67db3",Fs="CreateIssueModal-module__roleTab___I1ska",Ns="CreateIssueModal-module__roleTabActive___0whav",Ls="CreateIssueModal-module__headerBug___MLuto",Os="CreateIssueModal-module__headerFeature___ocY3A",ks="CreateIssueModal-module__headerImprovement___GmyHR",Ds="CreateIssueModal-module__headerQuestion___HQIMx",Vs="CreateIssueModal-module__systemInfoBox___Ls6SP",zs="CreateIssueModal-module__systemInfoRow___8b6UO",$s="CreateIssueModal-module__systemInfoLabel___q7M1w",qs="CreateIssueModal-module__systemInfoValue___qr95I",Es="CreateIssueModal-module__hint___owRhK",r={formContainer:ms,formGroup:gs,formRow:xs,label:hs,required:ys,error:fs,readOnlyField:bs,dropzone:vs,fileInputHidden:_s,dropzoneContent:js,dropzoneIcon:Cs,dropzoneText:Is,dropzoneHint:ws,fileHint:Ss,fileList:Rs,fileItem:Ms,removeFileBtn:As,formActions:Ts,roleTabs:Bs,roleTab:Fs,roleTabActive:Ns,headerBug:Ls,headerFeature:Os,headerImprovement:ks,headerQuestion:Ds,systemInfoBox:Vs,systemInfoRow:zs,systemInfoLabel:$s,systemInfoValue:qs,hint:Es};function Hs({isOpen:n,onClose:y,onSubmit:Pe,modalId:L="create-issue-modal",showClearButton:W=!0,initialData:P,showRoleTabs:Ue=!0,userRole:U,isLoading:g=!1}){const{t:s}=is(),m=cs(),Ge=ls(),[Qe,O]=l.useState("user_basic"),p=U||Qe,x={title:"",description:"",type:"bug",severity:"moderate",category:void 0,priority:"medium",error_message:"",error_type:"",browser:"",os:"",url:"",attachments:[],system_info:void 0},[o,k]=l.useState(x),[Xe,G]=l.useState(x),[d,f]=l.useState({}),[Q,D]=l.useState(!1),[X,V]=l.useState(!1),[Ye,z]=l.useState(!1),[Je,$]=l.useState(!1),{isDirty:q}=ds(Xe,o),c=(t,a)=>{k(i=>({...i,[t]:a})),d[t]&&f(i=>{const h={...i};return delete h[t],h})},Ke=()=>{var h,J,K,Z;const t=navigator.userAgent;let a="Unknown",i="Unknown";return t.includes("Firefox/")?a=`Firefox ${((h=t.match(/Firefox\/(\d+)/))==null?void 0:h[1])||""}`.trim():t.includes("Edg/")?a=`Edge ${((J=t.match(/Edg\/(\d+)/))==null?void 0:J[1])||""}`.trim():t.includes("Chrome/")?a=`Chrome ${((K=t.match(/Chrome\/(\d+)/))==null?void 0:K[1])||""}`.trim():t.includes("Safari/")&&!t.includes("Chrome")&&(a=`Safari ${((Z=t.match(/Version\/(\d+)/))==null?void 0:Z[1])||""}`.trim()),t.includes("Windows NT 10")?i="Windows 10/11":t.includes("Windows NT 6.3")?i="Windows 8.1":t.includes("Windows NT 6.1")?i="Windows 7":t.includes("Mac OS X")?i="macOS":t.includes("Linux")?i="Linux":t.includes("Android")?i="Android":(t.includes("iOS")||t.includes("iPhone")||t.includes("iPad"))&&(i="iOS"),{browser:a,os:i,url:window.location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,screen:`${window.screen.width}x${window.screen.height}`,timestamp:new Date().toISOString()}};l.useEffect(()=>{if(n){const t=Ke(),a={...x,system_info:t,...P};k(a),G(a),$(!1),f({}),D(!!a.title&&a.title.length>=5&&a.title.length<=200),V(!!a.description&&a.description.length>=10)}},[n,P]);const Y=()=>{g||!Q||!X||Pe(o)},Ze=l.useCallback(()=>{q?m.confirm({}).then(t=>{t&&y()}):y()},[q,m,y]),es=()=>{z(!0)},ss=()=>{k(x),G(x),f({}),D(!1),V(!1),$(!1),z(!1)},ts=()=>{z(!1)},rs=Object.keys(d).filter(t=>t!=="attachments").length>0,ns=!Q||!X||rs||Je||g,os=()=>{const t={bug:s("issues.types.bug"),feature:s("issues.types.feature"),improvement:s("issues.types.improvement"),question:s("issues.types.question")},a={user_basic:s("issues.modal.basic"),user_standard:s("issues.modal.standard"),user_advance:s("issues.modal.advanced")};return`${t[o.type]} (${a[p]})`},as={left:W?e.jsx(H,{variant:"danger-subtle",onClick:es,disabled:g,"data-testid":"create-issue-modal-clear",children:s("components.modalV3.sectionEditModal.clearButton")}):void 0,right:e.jsxs(e.Fragment,{children:[e.jsx(H,{variant:"ghost",onClick:Ze,disabled:g,"data-testid":"create-issue-modal-cancel",children:s("common.cancel")}),e.jsx(H,{variant:"primary",onClick:Y,disabled:ns,loading:g,"data-testid":"create-issue-modal-submit",children:s("issues.form.submit")})]})};return e.jsxs(e.Fragment,{children:[e.jsxs(ps,{isOpen:n,onClose:y,onConfirm:m.state.isOpen?void 0:Y,hasUnsavedChanges:q,modalId:L,title:os(),size:"md",footer:as,headerClassName:r[`header${o.type.charAt(0).toUpperCase()+o.type.slice(1).toLowerCase()}`],children:[!U&&Ue&&e.jsxs("div",{className:r.roleTabs,children:[e.jsxs("button",{type:"button",className:`${r.roleTab} ${p==="user_basic"?r.roleTabActive:""}`,onClick:()=>O("user_basic"),"data-testid":"role-tab-basic",children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"👤"})," ",s("issues.roles.basic")]}),e.jsxs("button",{type:"button",className:`${r.roleTab} ${p==="user_standard"?r.roleTabActive:""}`,onClick:()=>O("user_standard"),"data-testid":"role-tab-standard",children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"👥"})," ",s("issues.roles.standard")]}),e.jsxs("button",{type:"button",className:`${r.roleTab} ${p==="user_advance"?r.roleTabActive:""}`,onClick:()=>O("user_advance"),"data-testid":"role-tab-advance",children:[e.jsx("span",{role:"img","aria-hidden":"true",children:"🔧"})," ",s("issues.roles.advanced")]})]}),e.jsxs("div",{className:r.formContainer,children:[e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.title"),required:!0,value:o.title,onChange:t=>c("title",t.target.value),htmlFor:"title",helperText:s("issues.form.titleHint"),maxLength:200,reserveMessageSpace:!0,validate:t=>{if(!t||t.length<5)return s("issues.validation.titleMinLength");if(t.length>200)return s("issues.validation.titleMaxLength")},onValidChange:D,children:e.jsx(se,{type:"text",name:"title",id:"title",placeholder:s("issues.form.titlePlaceholder"),maxLength:200})})}),e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.description"),required:!0,value:o.description,onChange:t=>c("description",t.target.value),htmlFor:"description",helperText:s("issues.form.descriptionHint"),reserveMessageSpace:!0,validate:t=>{if(!t||t.length<10)return s("issues.validation.descriptionMinLength")},onValidChange:V,children:e.jsx(te,{name:"description",id:"description",placeholder:s("issues.form.descriptionPlaceholder"),rows:3,fullWidth:!0})})}),(p==="user_standard"&&(o.type==="bug"||o.type==="improvement")||p==="user_advance"&&o.type==="improvement")&&e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.severity"),labelHint:s("pages.issues.edit.severityVsPriorityInfo"),required:!0,error:d.severity,value:o.severity||"",onChange:t=>c("severity",t.target.value),htmlFor:"severity",children:e.jsx(b,{name:"severity",id:"severity",options:[{value:"minor",label:s("issues.severity.minor")},{value:"moderate",label:s("issues.severity.moderate")},{value:"major",label:s("issues.severity.major")},{value:"blocker",label:`🚨 ${s("issues.severity.blocker")}`}]})})}),p==="user_advance"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:r.formRow,children:[e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.category"),error:d.category,value:o.category||"",onChange:t=>c("category",t.target.value||void 0),htmlFor:"category",children:e.jsx(b,{name:"category",id:"category",placeholder:s("issues.category.placeholder"),options:[{value:"ui",label:`🎨 ${s("issues.category.ui")}`},{value:"backend",label:`⚙️ ${s("issues.category.backend")}`},{value:"database",label:`🗄️ ${s("issues.category.database")}`},{value:"integration",label:`🔗 ${s("issues.category.integration")}`},{value:"docs",label:`📚 ${s("issues.category.docs")}`},{value:"performance",label:`⚡ ${s("issues.category.performance")}`},{value:"security",label:`🔒 ${s("issues.category.security")}`}]})})}),e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.priority"),labelHint:s("pages.issues.edit.severityVsPriorityInfo"),error:d.priority,value:o.priority||"",onChange:t=>c("priority",t.target.value),htmlFor:"priority",children:e.jsx(b,{name:"priority",id:"priority",options:[{value:"low",label:s("issues.priority.low")},{value:"medium",label:s("issues.priority.medium")},{value:"high",label:s("issues.priority.high")},{value:"critical",label:`🔴 ${s("issues.priority.critical")}`}]})})})]}),o.type==="bug"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:r.formRow,children:[e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.errorType"),error:d.error_type,value:o.error_type||"",onChange:t=>c("error_type",t.target.value),htmlFor:"error_type",children:e.jsx(se,{type:"text",name:"error_type",id:"error_type",placeholder:s("pages.issues.details.errorTypePlaceholder"),maxLength:100})})}),e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.severity"),labelHint:s("pages.issues.edit.severityVsPriorityInfo"),required:!0,error:d.severity,value:o.severity||"",onChange:t=>c("severity",t.target.value),htmlFor:"severity-advance",children:e.jsx(b,{name:"severity-advance",id:"severity-advance",options:[{value:"minor",label:s("issues.severity.minor")},{value:"moderate",label:s("issues.severity.moderate")},{value:"major",label:s("issues.severity.major")},{value:"blocker",label:`🚨 ${s("issues.severity.blocker")}`}]})})})]}),e.jsx("div",{className:r.formGroup,children:e.jsx(u,{label:s("issues.form.errorMessage"),error:d.error_message,value:o.error_message||"",onChange:t=>c("error_message",t.target.value),htmlFor:"error_message",children:e.jsx(te,{name:"error_message",id:"error_message",placeholder:s("pages.issues.details.errorMessagePlaceholder"),rows:5,fullWidth:!0})})})]})]}),p==="user_advance"&&o.system_info&&e.jsxs("div",{className:r.formGroup,children:[e.jsxs("label",{className:r.label,children:[s("issues.form.systemInfo")," 🖥️"]}),e.jsxs("div",{className:r.systemInfoBox,children:[e.jsxs("div",{className:r.systemInfoRow,children:[e.jsxs("span",{className:r.systemInfoLabel,children:[s("issues.form.systemInfoLabels.browser"),":"]}),e.jsx("span",{className:r.systemInfoValue,children:o.system_info.browser})]}),e.jsxs("div",{className:r.systemInfoRow,children:[e.jsxs("span",{className:r.systemInfoLabel,children:[s("issues.form.systemInfoLabels.os"),":"]}),e.jsx("span",{className:r.systemInfoValue,children:o.system_info.os})]}),e.jsxs("div",{className:r.systemInfoRow,children:[e.jsxs("span",{className:r.systemInfoLabel,children:[s("issues.form.systemInfoLabels.url"),":"]}),e.jsx("span",{className:r.systemInfoValue,children:o.system_info.url})]}),e.jsxs("div",{className:r.systemInfoRow,children:[e.jsxs("span",{className:r.systemInfoLabel,children:[s("issues.form.systemInfoLabels.viewport"),":"]}),e.jsx("span",{className:r.systemInfoValue,children:o.system_info.viewport})]}),e.jsxs("div",{className:r.systemInfoRow,children:[e.jsxs("span",{className:r.systemInfoLabel,children:[s("issues.form.systemInfoLabels.screen"),":"]}),e.jsx("span",{className:r.systemInfoValue,children:o.system_info.screen})]}),e.jsxs("div",{className:r.systemInfoRow,children:[e.jsxs("span",{className:r.systemInfoLabel,children:[s("issues.form.systemInfoLabels.timestamp"),":"]}),e.jsx("span",{className:r.systemInfoValue,children:o.system_info.timestamp?new Date(o.system_info.timestamp).toLocaleString():"-"})]})]}),e.jsx("div",{className:r.hint,children:s("issues.form.systemInfoHint")})]}),e.jsxs("div",{className:r.formGroup,children:[e.jsx("label",{className:r.label,children:s("issues.form.attachments")}),e.jsx(us,{value:o.attachments||[],onChange:t=>c("attachments",t),maxFiles:5,maxSize:10*1024*1024,accept:"image/*,.pdf,.log,.txt",error:d.attachments,onError:t=>{f(a=>({...a,attachments:t}))},onFileLimitExceeded:t=>$(t),onPasteLimitReached:()=>{Ge.info(s("components.fileUpload.errors.maxFiles",{max:5}))}})]})]})]}),W&&e.jsx(ee,{isOpen:Ye,onClose:ts,onConfirm:ss,title:s("components.modalV3.sectionEditModal.clearConfirmTitle"),message:s("components.modalV3.sectionEditModal.clearConfirmMessage"),confirmButtonLabel:s("components.modalV3.sectionEditModal.clearConfirmButton"),cancelButtonLabel:s("common.cancel"),parentModalId:L}),e.jsx(ee,{isOpen:m.state.isOpen,onClose:m.handleCancel,onConfirm:m.handleConfirm,title:s("components.modalV3.confirmModal.unsavedChanges.title"),message:s("components.modalV3.confirmModal.unsavedChanges.message"),confirmButtonLabel:s("components.modalV3.confirmModal.unsavedChanges.confirmButton"),cancelButtonLabel:s("common.cancel"),parentModalId:L})]})}const lt={title:"Components/Modals/CreateIssueModal",component:Hs,tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls modal visibility"},showClearButton:{control:"boolean",description:"Show clear form button"},showRoleTabs:{control:"boolean",description:"Show role selection tabs"},isLoading:{control:"boolean",description:"Loading state for submit button"}},parameters:{docs:{description:{component:"Create Issue Modal with role-based form variants (basic, standard, advanced). Auto-collects system info and supports file uploads."}}}},v={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_basic",showRoleTabs:!1},parameters:{docs:{description:{story:"Basic user view - minimal fields (title, description, severity for bugs)."}}}},_={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_standard",showRoleTabs:!1},parameters:{docs:{description:{story:"Standard user view - adds severity for bugs and improvements."}}}},j={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_advance",showRoleTabs:!1},parameters:{docs:{description:{story:"Advanced user view - all fields including category, priority, error details, and system info."}}}},C={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),showRoleTabs:!0},parameters:{docs:{description:{story:"Development mode - shows role tabs to test different user levels. Will be hidden once authentication is implemented."}}}},I={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_advance",showRoleTabs:!1,initialData:{title:"Pre-filled bug title",description:"This data was pre-filled from a ReportButton click.",type:"bug",severity:"major",error_message:'TypeError: Cannot read property "foo" of undefined'}},parameters:{docs:{description:{story:"Pre-filled from ReportButton - useful for context-aware bug reporting."}}}},w={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_standard",isLoading:!0},parameters:{docs:{description:{story:"Submit button shows spinner while creating issue in backend."}}}},S={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_standard",showClearButton:!0},parameters:{docs:{description:{story:"Clear button in footer left slot - resets form with confirmation."}}}},R={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_standard",showClearButton:!1}},M={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_advance",showRoleTabs:!1,initialData:{title:"Login button not working",description:"When I click the login button, nothing happens.",type:"bug",severity:"major",category:"ui",priority:"high"}}},A={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_standard",showRoleTabs:!1,initialData:{title:"Add dark mode support",description:"It would be great to have a dark mode option for night work.",type:"feature"}}},T={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_standard",showRoleTabs:!1,initialData:{title:"Improve search performance",description:"Search is slow with large datasets (10k+ records).",type:"improvement",severity:"moderate"}}},B={args:{isOpen:!0,onClose:()=>console.log("Modal closed"),onSubmit:n=>console.log("Issue submitted:",n),userRole:"user_basic",showRoleTabs:!1,initialData:{title:"How to export contacts to CSV?",description:"I can't find the export button in the contacts page.",type:"question"}}},F={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("h3",{children:"CreateIssueModal Features"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"👤 Role-Based Forms"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Different field sets for basic/standard/advanced users."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"🖥️ System Info"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Auto-collects browser, OS, URL, viewport."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"📎 File Upload"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Up to 5 files, 10MB max each."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"✅ Validation"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Title (5-200 chars), description (10+ chars)."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"🎨 Colored Headers"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Different colors for bug/feature/improvement/question."})]}),e.jsxs("div",{style:{padding:"16px",border:"1px solid #e0e0e0",borderRadius:"8px"},children:[e.jsx("h4",{children:"💾 Pre-fill Support"}),e.jsx("p",{style:{fontSize:"14px",color:"#666"},children:"Accept initialData from ReportButton."})]})]})]}),parameters:{docs:{description:{story:"CreateIssueModal key features overview."}}}},N={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",padding:"20px"},children:[e.jsx("h3",{children:"Role-Based Field Comparison"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderBottom:"2px solid #e0e0e0"},children:[e.jsx("th",{style:{textAlign:"left",padding:"12px"},children:"Field"}),e.jsx("th",{style:{textAlign:"center",padding:"12px"},children:"Basic"}),e.jsx("th",{style:{textAlign:"center",padding:"12px"},children:"Standard"}),e.jsx("th",{style:{textAlign:"center",padding:"12px"},children:"Advanced"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{borderBottom:"1px solid #e0e0e0"},children:[e.jsx("td",{style:{padding:"12px"},children:"Title"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e0e0e0"},children:[e.jsx("td",{style:{padding:"12px"},children:"Description"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e0e0e0"},children:[e.jsx("td",{style:{padding:"12px"},children:"Severity (bug/improvement)"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e0e0e0"},children:[e.jsx("td",{style:{padding:"12px"},children:"Category"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e0e0e0"},children:[e.jsx("td",{style:{padding:"12px"},children:"Priority"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e0e0e0"},children:[e.jsx("td",{style:{padding:"12px"},children:"Error Type/Message"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅ (bugs only)"})]}),e.jsxs("tr",{style:{borderBottom:"1px solid #e0e0e0"},children:[e.jsx("td",{style:{padding:"12px"},children:"System Info"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"❌"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"})]}),e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"12px"},children:"File Attachments"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"}),e.jsx("td",{style:{textAlign:"center",padding:"12px"},children:"✅"})]})]})]})]}),parameters:{docs:{description:{story:"Field availability per role level."}}}};var re,ne,oe;v.parameters={...v.parameters,docs:{...(re=v.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_basic',
    showRoleTabs: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic user view - minimal fields (title, description, severity for bugs).'
      }
    }
  }
}`,...(oe=(ne=v.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ae,ie,le;_.parameters={..._.parameters,docs:{...(ae=_.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showRoleTabs: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard user view - adds severity for bugs and improvements.'
      }
    }
  }
}`,...(le=(ie=_.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};var de,ce,pe;j.parameters={...j.parameters,docs:{...(de=j.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_advance',
    showRoleTabs: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced user view - all fields including category, priority, error details, and system info.'
      }
    }
  }
}`,...(pe=(ce=j.parameters)==null?void 0:ce.docs)==null?void 0:pe.source}}};var ue,me,ge;C.parameters={...C.parameters,docs:{...(ue=C.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    showRoleTabs: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Development mode - shows role tabs to test different user levels. Will be hidden once authentication is implemented.'
      }
    }
  }
}`,...(ge=(me=C.parameters)==null?void 0:me.docs)==null?void 0:ge.source}}};var xe,he,ye;I.parameters={...I.parameters,docs:{...(xe=I.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_advance',
    showRoleTabs: false,
    initialData: {
      title: 'Pre-filled bug title',
      description: 'This data was pre-filled from a ReportButton click.',
      type: 'bug',
      severity: 'major',
      error_message: 'TypeError: Cannot read property "foo" of undefined'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pre-filled from ReportButton - useful for context-aware bug reporting.'
      }
    }
  }
}`,...(ye=(he=I.parameters)==null?void 0:he.docs)==null?void 0:ye.source}}};var fe,be,ve;w.parameters={...w.parameters,docs:{...(fe=w.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    isLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Submit button shows spinner while creating issue in backend.'
      }
    }
  }
}`,...(ve=(be=w.parameters)==null?void 0:be.docs)==null?void 0:ve.source}}};var _e,je,Ce;S.parameters={...S.parameters,docs:{...(_e=S.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showClearButton: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Clear button in footer left slot - resets form with confirmation.'
      }
    }
  }
}`,...(Ce=(je=S.parameters)==null?void 0:je.docs)==null?void 0:Ce.source}}};var Ie,we,Se;R.parameters={...R.parameters,docs:{...(Ie=R.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showClearButton: false
  }
}`,...(Se=(we=R.parameters)==null?void 0:we.docs)==null?void 0:Se.source}}};var Re,Me,Ae;M.parameters={...M.parameters,docs:{...(Re=M.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_advance',
    showRoleTabs: false,
    initialData: {
      title: 'Login button not working',
      description: 'When I click the login button, nothing happens.',
      type: 'bug',
      severity: 'major',
      category: 'ui',
      priority: 'high'
    }
  }
}`,...(Ae=(Me=M.parameters)==null?void 0:Me.docs)==null?void 0:Ae.source}}};var Te,Be,Fe;A.parameters={...A.parameters,docs:{...(Te=A.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showRoleTabs: false,
    initialData: {
      title: 'Add dark mode support',
      description: 'It would be great to have a dark mode option for night work.',
      type: 'feature'
    }
  }
}`,...(Fe=(Be=A.parameters)==null?void 0:Be.docs)==null?void 0:Fe.source}}};var Ne,Le,Oe;T.parameters={...T.parameters,docs:{...(Ne=T.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_standard',
    showRoleTabs: false,
    initialData: {
      title: 'Improve search performance',
      description: 'Search is slow with large datasets (10k+ records).',
      type: 'improvement',
      severity: 'moderate'
    }
  }
}`,...(Oe=(Le=T.parameters)==null?void 0:Le.docs)==null?void 0:Oe.source}}};var ke,De,Ve;B.parameters={...B.parameters,docs:{...(ke=B.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: data => console.log('Issue submitted:', data),
    userRole: 'user_basic',
    showRoleTabs: false,
    initialData: {
      title: 'How to export contacts to CSV?',
      description: "I can't find the export button in the contacts page.",
      type: 'question'
    }
  }
}`,...(Ve=(De=B.parameters)==null?void 0:De.docs)==null?void 0:Ve.source}}};var ze,$e,qe;F.parameters={...F.parameters,docs:{...(ze=F.parameters)==null?void 0:ze.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>CreateIssueModal Features</h3>\r
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
          <h4>👤 Role-Based Forms</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Different field sets for basic/standard/advanced users.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>🖥️ System Info</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Auto-collects browser, OS, URL, viewport.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>📎 File Upload</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Up to 5 files, 10MB max each.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>✅ Validation</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Title (5-200 chars), description (10+ chars).</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>🎨 Colored Headers</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Different colors for bug/feature/improvement/question.</p>\r
        </div>\r
        <div style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}>\r
          <h4>💾 Pre-fill Support</h4>\r
          <p style={{
          fontSize: '14px',
          color: '#666'
        }}>Accept initialData from ReportButton.</p>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'CreateIssueModal key features overview.'
      }
    }
  }
}`,...(qe=($e=F.parameters)==null?void 0:$e.docs)==null?void 0:qe.source}}};var Ee,He,We;N.parameters={...N.parameters,docs:{...(Ee=N.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px'
  }}>\r
      <h3>Role-Based Field Comparison</h3>\r
      <table style={{
      width: '100%',
      borderCollapse: 'collapse'
    }}>\r
        <thead>\r
          <tr style={{
          borderBottom: '2px solid #e0e0e0'
        }}>\r
            <th style={{
            textAlign: 'left',
            padding: '12px'
          }}>Field</th>\r
            <th style={{
            textAlign: 'center',
            padding: '12px'
          }}>Basic</th>\r
            <th style={{
            textAlign: 'center',
            padding: '12px'
          }}>Standard</th>\r
            <th style={{
            textAlign: 'center',
            padding: '12px'
          }}>Advanced</th>\r
          </tr>\r
        </thead>\r
        <tbody>\r
          <tr style={{
          borderBottom: '1px solid #e0e0e0'
        }}>\r
            <td style={{
            padding: '12px'
          }}>Title</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
          </tr>\r
          <tr style={{
          borderBottom: '1px solid #e0e0e0'
        }}>\r
            <td style={{
            padding: '12px'
          }}>Description</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
          </tr>\r
          <tr style={{
          borderBottom: '1px solid #e0e0e0'
        }}>\r
            <td style={{
            padding: '12px'
          }}>Severity (bug/improvement)</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
          </tr>\r
          <tr style={{
          borderBottom: '1px solid #e0e0e0'
        }}>\r
            <td style={{
            padding: '12px'
          }}>Category</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
          </tr>\r
          <tr style={{
          borderBottom: '1px solid #e0e0e0'
        }}>\r
            <td style={{
            padding: '12px'
          }}>Priority</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
          </tr>\r
          <tr style={{
          borderBottom: '1px solid #e0e0e0'
        }}>\r
            <td style={{
            padding: '12px'
          }}>Error Type/Message</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅ (bugs only)</td>\r
          </tr>\r
          <tr style={{
          borderBottom: '1px solid #e0e0e0'
        }}>\r
            <td style={{
            padding: '12px'
          }}>System Info</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>❌</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
          </tr>\r
          <tr>\r
            <td style={{
            padding: '12px'
          }}>File Attachments</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
            <td style={{
            textAlign: 'center',
            padding: '12px'
          }}>✅</td>\r
          </tr>\r
        </tbody>\r
      </table>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Field availability per role level.'
      }
    }
  }
}`,...(We=(He=N.parameters)==null?void 0:He.docs)==null?void 0:We.source}}};const dt=["BasicUser","StandardUser","AdvancedUser","WithRoleTabs","WithInitialData","LoadingState","WithClearButton","WithoutClearButton","BugReport","FeatureRequest","Improvement","Question","Features","RoleComparison"];export{j as AdvancedUser,v as BasicUser,M as BugReport,A as FeatureRequest,F as Features,T as Improvement,w as LoadingState,B as Question,N as RoleComparison,_ as StandardUser,S as WithClearButton,I as WithInitialData,C as WithRoleTabs,R as WithoutClearButton,dt as __namedExportsOrder,lt as default};
