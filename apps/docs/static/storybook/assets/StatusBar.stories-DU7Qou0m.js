import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./index-BKyFwriW.js";import{u as ds,c as hs}from"./ToastContext-ErSnUSL6.js";import"./_commonjsHelpers-CqkleIqs.js";const ps="StatusBar-module__statusBar___AAJwB",ms="StatusBar-module__header___x51hv",vs="StatusBar-module__headerExpanded___EOrhX",gs="StatusBar-module__headerContent___k2YTm",_s="StatusBar-module__statusText___j7EXk",fs="StatusBar-module__statusIcon___pT4M-",xs="StatusBar-module__servicesCount___CjppK",Ss="StatusBar-module__lastUpdated___Q0aAS",ks="StatusBar-module__userInfo___DHyqf",ys="StatusBar-module__userAvatar___6az0T",bs="StatusBar-module__userName___UwOy2",Bs="StatusBar-module__userPosition___OIR-V",js="StatusBar-module__dataSource___RkHW0",Ns="StatusBar-module__pulse___e6Tfc",Is="StatusBar-module__dataSourceMock___3rx5i",ws="StatusBar-module__dataSourceError___f5-yq",Ds="StatusBar-module__dataSourceIcon___KEfbU",Cs="StatusBar-module__blink___8p5xK",Us="StatusBar-module__dataSourceText___P5hoO",Ms="StatusBar-module__headerActions___-tk2s",Ts="StatusBar-module__separator___kC51F",Es="StatusBar-module__themeToggle___mNz9o",Os="StatusBar-module__themeIcon___2nIZ8",Rs="StatusBar-module__themeSlider___8kTgs",Ls="StatusBar-module__themeSliderKnob___1QQGi",$s="StatusBar-module__themeSliderKnobDark___qUuAZ",Hs="StatusBar-module__languageToggle___krJnS",Ps="StatusBar-module__languageButton___TJz-6",As="StatusBar-module__refreshButton___XafOx",zs="StatusBar-module__expandIcon___0ZdaW",Fs="StatusBar-module__expanded___uk1xR",Ws="StatusBar-module__resizeHandle___ljcde",Ks="StatusBar-module__resizeHandleDragging___OQmIa",Qs="StatusBar-module__resizeLine___yH0lG",Gs="StatusBar-module__section___dEgxL",Ys="StatusBar-module__sectionHeader___8TI91",qs="StatusBar-module__sectionCount___DQmLx",Vs="StatusBar-module__lastBackup___wneRp",Js="StatusBar-module__serviceGrid___v1Qr2",Xs="StatusBar-module__service___VdkrX",Zs="StatusBar-module__serviceCritical___EgB45",et="StatusBar-module__serviceNormal___jRrWn",st="StatusBar-module__serviceDatabase___8-Q1w",tt="StatusBar-module__serviceIcon___em2YM",at="StatusBar-module__serviceName___b-z-A",rt="StatusBar-module__serviceTime___RSzJB",nt="StatusBar-module__backupButton___RmBi8",ct="StatusBar-module__backupButtonRunning___TLHSJ",ot="StatusBar-module__backupIcon___pIKB4",it="StatusBar-module__backupLabel___w2WQc",lt="StatusBar-module__backupStatus___Sy8fn",ut="StatusBar-module__backupProgress___8lsdY",dt="StatusBar-module__backupProgressHeader___dezq4",ht="StatusBar-module__backupProgressBar___uysPG",pt="StatusBar-module__backupProgressFill___pM87m",mt="StatusBar-module__backupMessage___jn-1V",vt="StatusBar-module__backupMessageSuccess___fcxOm",gt="StatusBar-module__backupMessageError___pps47",_t="StatusBar-module__footer___WaXqe",s={statusBar:ps,header:ms,headerExpanded:vs,headerContent:gs,statusText:_s,statusIcon:fs,servicesCount:xs,lastUpdated:Ss,userInfo:ks,userAvatar:ys,userName:bs,userPosition:Bs,dataSource:js,pulse:Ns,dataSourceMock:Is,dataSourceError:ws,dataSourceIcon:Ds,blink:Cs,dataSourceText:Us,headerActions:Ms,separator:Ts,themeToggle:Es,themeIcon:Os,themeSlider:Rs,themeSliderKnob:Ls,themeSliderKnobDark:$s,languageToggle:Hs,languageButton:Ps,refreshButton:As,expandIcon:zs,expanded:Fs,resizeHandle:Ws,resizeHandleDragging:Ks,resizeLine:Qs,section:Gs,sectionHeader:Ys,sectionCount:qs,lastBackup:Vs,serviceGrid:Js,service:Xs,serviceCritical:Zs,serviceNormal:et,serviceDatabase:st,serviceIcon:tt,serviceName:at,serviceTime:rt,backupButton:nt,backupButtonRunning:ct,backupIcon:ot,backupLabel:it,backupStatus:lt,backupProgress:ut,backupProgressHeader:dt,backupProgressBar:ht,backupProgressFill:pt,backupMessage:mt,backupMessageSuccess:vt,backupMessageError:gt,footer:_t},ft=({services:a={},onBackup:_,onRefresh:Y,initialBackupInfo:H=null,currentUser:y,onExpandedChange:P,onExpandedHeightChange:f,dataSource:m="mock",dataSourceError:We})=>{const{t:r,language:A,setLanguage:Ke,availableLanguages:z}=ds(),{theme:Qe,toggleTheme:Ge}=hs(),b=Qe==="dark",[u,q]=c.useState(!1),[i,v]=c.useState(!1),[B,V]=c.useState(0),[x,g]=c.useState(""),[F,Ye]=c.useState(H),[qe,Ve]=c.useState(new Date),[p,Je]=c.useState(()=>{if(typeof window>"u")return 300;const t=localStorage.getItem("l-kern-statusbar-height");return t?parseInt(t,10):300}),[W,J]=c.useState(!1),[X,Xe]=c.useState(0),[Z,Ze]=c.useState(0),K=c.useRef(null);c.useEffect(()=>{P&&P(u)},[u,P]),c.useEffect(()=>{f&&f(p)},[]),c.useEffect(()=>{if(!u)return;const t=k=>{K.current&&!K.current.contains(k.target)&&q(!1)},n=setTimeout(()=>{document.addEventListener("mousedown",t)},100);return()=>{clearTimeout(n),document.removeEventListener("mousedown",t)}},[u]);const es=t=>{t.preventDefault(),t.stopPropagation(),J(!0),Xe(t.clientY),Ze(p)};c.useEffect(()=>{if(!W)return;const t=k=>{const ls=X-k.clientY,us=Math.max(150,Math.min(600,Z+ls));Je(us)},n=()=>{J(!1),localStorage.setItem("l-kern-statusbar-height",p.toString()),f&&f(p)};return document.addEventListener("mousemove",t),document.addEventListener("mouseup",n),()=>{document.removeEventListener("mousemove",t),document.removeEventListener("mouseup",n)}},[W,X,Z,p,f]);const Q=t=>{const n={healthy:"var(--color-status-success, #4caf50)",unhealthy:"var(--color-status-warning, #ff9800)",down:"var(--color-status-error, #f44336)",unknown:"var(--theme-text-muted, #757575)"};return n[t]||n.unknown},ee=t=>({healthy:"●",unhealthy:"⚠",down:"●",unknown:"?"})[t]||"?",G=async()=>{Ye({completed_at:new Date(Date.now()-7200*1e3).toISOString(),files:15,status:"completed"})},ss=async()=>{if(_)try{v(!0),await _(),v(!1),G()}catch(t){console.error("Backup error:",t),v(!1),g(r("statusBar.backup.error"))}else try{v(!0),V(0),g(r("statusBar.backup.starting"));let t=0;const n=setInterval(()=>{t+=Math.random()*20,t>=100&&(t=100,clearInterval(n),v(!1),g(r("statusBar.backup.completed",{files:"15"})),setTimeout(()=>{G(),g("")},3e3)),V(Math.round(t));const k=Math.round(t/10);g(r("statusBar.backup.processing",{current:k.toString(),total:"10"}))},500)}catch(t){console.error("Error starting backup:",t),v(!1),g(r("statusBar.backup.error"))}},ts=async()=>{Y&&await Y(),Ve(new Date)};c.useEffect(()=>{H||G()},[H]);const l=Object.values(a),S=l.filter(t=>t.critical),j=l.filter(t=>!t.critical),se=S.every(t=>t.status==="healthy"),te=l.every(t=>t.status==="healthy"),ae=l.filter(t=>t.status==="healthy").length,re=l.length,as=S.filter(t=>t.status==="healthy").length,rs=j.filter(t=>t.status==="healthy").length,ns=r(se?te?"statusBar.allServicesRunning":"statusBar.systemOperational":"statusBar.criticalServicesUnhealthy"),cs=te?"var(--color-status-success, #4caf50)":se?"var(--color-status-warning, #ff9800)":"var(--color-status-error, #f44336)",os=l.length>0?Math.min(...l.map(t=>t.response_time)):0,is=l.length>0?Math.max(...l.map(t=>t.response_time)):0;return e.jsxs("div",{className:s.statusBar,ref:K,children:[u&&e.jsx("div",{className:`${s.resizeHandle} ${W?s.resizeHandleDragging:""}`,onMouseDown:es,title:r("statusBar.dragToResize"),children:e.jsx("div",{className:s.resizeLine})}),e.jsxs("div",{className:`${s.header} ${u?s.headerExpanded:""}`,children:[e.jsxs("div",{className:s.headerContent,onClick:()=>q(!u),style:{cursor:"pointer"},children:[e.jsxs("span",{className:s.statusText,style:{color:cs},children:[e.jsx("span",{className:s.statusIcon,children:"●"})," ",ns]}),e.jsxs("span",{className:s.servicesCount,children:["(",r("statusBar.servicesCount",{active:ae.toString(),total:re.toString()}),")"]}),e.jsxs("span",{className:s.lastUpdated,children:["• ",r("statusBar.lastUpdated",{time:qe.toLocaleTimeString("sk-SK")})]}),y&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:s.separator,children:"|"}),e.jsxs("div",{className:s.userInfo,children:[e.jsx("span",{className:s.userAvatar,children:y.avatar}),e.jsx("span",{className:s.userName,children:y.name}),e.jsx("span",{className:s.separator,children:"•"}),e.jsx("span",{className:s.userPosition,children:y.position})]})]}),m!=="orchestrator"&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:s.separator,children:"|"}),e.jsxs("div",{className:`${s.dataSource} ${s[`dataSource${m.charAt(0).toUpperCase()+m.slice(1)}`]}`,title:m==="error"?We:void 0,children:[m==="mock"&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:s.dataSourceIcon,role:"img","aria-label":"warning",children:"⚠️"}),e.jsx("span",{className:s.dataSourceText,children:"MOCK DATA"})]}),m==="error"&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:s.dataSourceIcon,role:"img","aria-label":"error",children:"🔴"}),e.jsx("span",{className:s.dataSourceText,children:"ORCHESTRATOR OFFLINE"})]})]})]})]}),e.jsxs("div",{className:s.headerActions,children:[e.jsxs("div",{className:s.themeToggle,children:[e.jsx("span",{className:s.themeIcon,role:"img","aria-label":b?"moon":"sun",children:b?"🌙":"☀️"}),e.jsx("div",{className:s.themeSlider,onClick:Ge,title:r(b?"theme.switchToLight":"theme.switchToDark"),children:e.jsx("div",{className:`${s.themeSliderKnob} ${b?s.themeSliderKnobDark:""}`})})]}),e.jsx("span",{className:s.separator,children:"•"}),e.jsx("div",{className:s.languageToggle,children:e.jsx("button",{className:s.languageButton,onClick:()=>{const n=(z.indexOf(A)+1)%z.length;Ke(z[n])},title:`Change language (${A.toUpperCase()})`,children:A.toUpperCase()})}),e.jsx("span",{className:s.separator,children:"•"}),e.jsx("button",{className:s.refreshButton,onClick:ts,title:r("statusBar.manualRefresh"),children:"↻"}),e.jsx("span",{className:s.separator,children:"•"}),e.jsx("span",{className:s.expandIcon,children:u?"▼":"▲"})]})]}),u&&e.jsxs("div",{className:s.expanded,style:{maxHeight:`${p}px`,height:`${p}px`},children:[S.length>0&&e.jsxs("div",{className:s.section,children:[e.jsxs("div",{className:s.sectionHeader,children:[e.jsx("h4",{children:r("statusBar.sections.critical")}),e.jsxs("span",{className:s.sectionCount,children:["(",as,"/",S.length,")"]})]}),e.jsx("div",{className:s.serviceGrid,children:S.map((t,n)=>e.jsxs("div",{className:`${s.service} ${s.serviceCritical}`,title:`${t.name}: ${t.status} (${t.response_time}ms)`,children:[e.jsx("span",{className:s.serviceIcon,style:{color:Q(t.status)},children:ee(t.status)}),e.jsx("span",{className:s.serviceName,children:t.name}),e.jsxs("span",{className:s.serviceTime,children:[t.response_time,"ms"]})]},`critical-${n}`))})]}),j.length>0&&e.jsxs("div",{className:s.section,children:[e.jsxs("div",{className:s.sectionHeader,children:[e.jsx("h4",{children:r("statusBar.sections.other")}),e.jsxs("span",{className:s.sectionCount,children:["(",rs,"/",j.length,")"]})]}),e.jsx("div",{className:s.serviceGrid,children:j.map((t,n)=>e.jsxs("div",{className:`${s.service} ${s.serviceNormal}`,title:`${t.name}: ${t.status} (${t.response_time}ms)`,children:[e.jsx("span",{className:s.serviceIcon,style:{color:Q(t.status)},children:ee(t.status)}),e.jsx("span",{className:s.serviceName,children:t.name}),e.jsxs("span",{className:s.serviceTime,children:[t.response_time,"ms"]})]},`other-${n}`))})]}),e.jsxs("div",{className:s.section,children:[e.jsxs("div",{className:s.sectionHeader,children:[e.jsx("h4",{children:r("statusBar.sections.databases")}),F&&!i&&F.completed_at&&e.jsx("span",{className:s.lastBackup,children:r("statusBar.backup.lastBackup",{time:new Date(F.completed_at).toLocaleString("sk-SK")})})]}),e.jsxs("div",{className:s.serviceGrid,children:[l.filter(t=>t.name.toLowerCase().includes("database")||t.name.toLowerCase().includes("postgres")||t.name.toLowerCase().includes("redis")).map((t,n)=>e.jsxs("div",{className:`${s.service} ${s.serviceDatabase}`,title:`${t.name}: ${t.status} (${t.response_time}ms)`,children:[e.jsx("span",{className:s.serviceIcon,style:{color:Q(t.status)},role:"img","aria-label":"database",children:"🗄️"}),e.jsx("span",{className:s.serviceName,children:t.name}),e.jsxs("span",{className:s.serviceTime,children:[t.response_time,"ms"]})]},`db-${n}`)),e.jsxs("div",{className:`${s.backupButton} ${i?s.backupButtonRunning:""}`,onClick:()=>!i&&ss(),title:i?r("statusBar.backup.progress",{percent:B.toString()}):r("statusBar.backup.button"),children:[e.jsx("span",{className:s.backupIcon,role:"img","aria-label":i?"loading":"save",children:i?"🔄":"💾"}),e.jsx("span",{className:s.backupLabel,children:r(i?"statusBar.backup.buttonRunning":"statusBar.backup.button")}),e.jsx("span",{className:s.backupStatus,children:i?`${B}%`:r("statusBar.backup.oneClick")})]})]}),i&&e.jsxs("div",{className:s.backupProgress,children:[e.jsxs("div",{className:s.backupProgressHeader,children:[e.jsx("span",{children:x}),e.jsxs("span",{children:[B,"%"]})]}),e.jsx("div",{className:s.backupProgressBar,children:e.jsx("div",{className:s.backupProgressFill,style:{width:`${B}%`}})})]}),x&&!i&&e.jsx("div",{className:`${s.backupMessage} ${x.includes("✅")?s.backupMessageSuccess:x.includes("❌")?s.backupMessageError:""}`,children:x})]}),e.jsx("div",{className:s.footer,children:e.jsxs("small",{children:[ae,"/",re," ",r("statusBar.servicesWorking")," •"," ",r("statusBar.responseTimes")," ",os,"-",is,"ms"]})})]})]})},jt={title:"Components/Layout/StatusBar",component:ft,tags:["autodocs"],argTypes:{dataSource:{control:"select",options:["orchestrator","mock","error"],description:"Data source indicator"}},parameters:{docs:{description:{component:"Status bar component with real-time system monitoring, service health indicators, backup controls, and theme/language toggles."}},layout:"fullscreen"}},h={orchestrator:{name:"Orchestrator",status:"healthy",critical:!0,response_time:15},"lkms101-contacts":{name:"Contacts Service",status:"healthy",critical:!1,response_time:23},"lkms102-orders":{name:"Orders Service",status:"healthy",critical:!1,response_time:31},postgres:{name:"PostgreSQL Database",status:"healthy",critical:!0,response_time:8}},xt={orchestrator:{name:"Orchestrator",status:"healthy",critical:!0,response_time:15},"lkms101-contacts":{name:"Contacts Service",status:"unhealthy",critical:!1,response_time:450},"lkms102-orders":{name:"Orders Service",status:"down",critical:!1,response_time:0},postgres:{name:"PostgreSQL Database",status:"healthy",critical:!0,response_time:8}},St={orchestrator:{name:"Orchestrator",status:"down",critical:!0,response_time:0},"lkms101-contacts":{name:"Contacts Service",status:"healthy",critical:!1,response_time:23},postgres:{name:"PostgreSQL Database",status:"down",critical:!0,response_time:0}},d={completed_at:new Date(Date.now()-7200*1e3).toISOString(),files:15,status:"completed"},o={name:"John Doe",position:"Administrator",department:"IT",avatar:"👤"},N={args:{services:h,initialBackupInfo:d,currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Main Application Content"}),e.jsx("p",{children:"Click the status bar at the bottom to expand it and see detailed service information."})]}),e.jsx(a,{})]})]},I={args:{services:xt,initialBackupInfo:d,currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Main Application Content"}),e.jsx("p",{children:"Some non-critical services are unhealthy or down."})]}),e.jsx(a,{})]})]},w={args:{services:St,initialBackupInfo:d,currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Main Application Content"}),e.jsx("p",{children:"Critical services are down! Status bar shows red warning."})]}),e.jsx(a,{})]})]},D={args:{services:h,initialBackupInfo:d,currentUser:o,dataSource:"mock"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Mock Data Mode"}),e.jsx("p",{children:"Status bar displays a warning indicator showing mock/dummy data is being used."})]}),e.jsx(a,{})]})]},C={args:{services:{},currentUser:o,dataSource:"error",dataSourceError:"Failed to connect to orchestrator service (timeout after 5s)"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Orchestrator Offline"}),e.jsx("p",{children:"Status bar displays error indicator when orchestrator service is unavailable."})]}),e.jsx(a,{})]})]},U={args:{services:h,initialBackupInfo:d,currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"With User Info"}),e.jsx("p",{children:"Status bar displays current user information (avatar, name, position)."})]}),e.jsx(a,{})]})]},M={args:{services:h,initialBackupInfo:d,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Without User Info"}),e.jsx("p",{children:"Status bar without user information section."})]}),e.jsx(a,{})]})]},T={args:{services:h,initialBackupInfo:{completed_at:new Date(Date.now()-1800*1e3).toISOString(),files:42,status:"completed"},currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Recent Backup"}),e.jsx("p",{children:"Expand status bar to see recent backup information (30 minutes ago)."})]}),e.jsx(a,{})]})]},E={args:{services:h,initialBackupInfo:null,currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"No Backup History"}),e.jsx("p",{children:"Expand status bar to see backup controls. Click backup button to run first backup."})]}),e.jsx(a,{})]})]},O={args:{services:{orchestrator:{name:"Orchestrator",status:"healthy",critical:!0,response_time:15},postgres:{name:"PostgreSQL",status:"healthy",critical:!0,response_time:8}},currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Minimal Services"}),e.jsx("p",{children:"Only essential critical services (Orchestrator and Database)."})]}),e.jsx(a,{})]})]},R={args:{services:{orchestrator:{name:"Orchestrator",status:"healthy",critical:!0,response_time:15},"lkms101-contacts":{name:"Contacts Service",status:"healthy",critical:!1,response_time:23},"lkms102-orders":{name:"Orders Service",status:"healthy",critical:!1,response_time:31},"lkms103-invoices":{name:"Invoices Service",status:"healthy",critical:!1,response_time:28},"lkms104-reports":{name:"Reports Service",status:"unhealthy",critical:!1,response_time:420},"lkms105-auth":{name:"Auth Service",status:"healthy",critical:!0,response_time:12},postgres:{name:"PostgreSQL",status:"healthy",critical:!0,response_time:8},redis:{name:"Redis Cache",status:"healthy",critical:!0,response_time:3}},initialBackupInfo:d,currentUser:o,dataSource:"orchestrator"},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Many Services"}),e.jsx("p",{children:"Full microservices architecture with 8 services (one unhealthy)."})]}),e.jsx(a,{})]})]},L={args:{services:h,initialBackupInfo:d,currentUser:o,dataSource:"orchestrator",onBackup:async()=>{await new Promise(a=>setTimeout(a,2e3)),alert("Backup completed successfully!")},onRefresh:async()=>{await new Promise(a=>setTimeout(a,500)),alert("Services refreshed!")}},decorators:[a=>e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Interactive Features"}),e.jsx("p",{children:"Expand status bar and click backup button or refresh button to trigger callbacks."})]}),e.jsx(a,{})]})]},$={args:{services:h,initialBackupInfo:d,currentUser:o,dataSource:"orchestrator"},decorators:[a=>(React.useEffect(()=>{const _=document.querySelector('[data-component="statusbar"]');_&&_.click()},[]),e.jsxs("div",{style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"20px",background:"var(--theme-input-background, #f5f5f5)"},children:[e.jsx("h1",{children:"Expanded View"}),e.jsx("p",{children:"Status bar is automatically expanded to show full service details."}),e.jsx("p",{children:"Features:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Critical services section (orchestrator, database)"}),e.jsx("li",{children:"Other services section (microservices)"}),e.jsx("li",{children:"Database & backup section with one-click backup"}),e.jsx("li",{children:"Service response times"}),e.jsx("li",{children:"Resizable height (drag top edge)"}),e.jsx("li",{children:"Click outside to collapse"})]})]}),e.jsx(a,{})]}))]};var ne,ce,oe;N.parameters={...N.parameters,docs:{...(ne=N.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Main Application Content</h1>\r
          <p>Click the status bar at the bottom to expand it and see detailed service information.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(oe=(ce=N.parameters)==null?void 0:ce.docs)==null?void 0:oe.source}}};var ie,le,ue;I.parameters={...I.parameters,docs:{...(ie=I.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    services: unhealthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Main Application Content</h1>\r
          <p>Some non-critical services are unhealthy or down.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(ue=(le=I.parameters)==null?void 0:le.docs)==null?void 0:ue.source}}};var de,he,pe;w.parameters={...w.parameters,docs:{...(de=w.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    services: criticalDownServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Main Application Content</h1>\r
          <p>Critical services are down! Status bar shows red warning.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(pe=(he=w.parameters)==null?void 0:he.docs)==null?void 0:pe.source}}};var me,ve,ge;D.parameters={...D.parameters,docs:{...(me=D.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'mock'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Mock Data Mode</h1>\r
          <p>Status bar displays a warning indicator showing mock/dummy data is being used.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(ge=(ve=D.parameters)==null?void 0:ve.docs)==null?void 0:ge.source}}};var _e,fe,xe;C.parameters={...C.parameters,docs:{...(_e=C.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    services: {},
    currentUser: mockUser,
    dataSource: 'error',
    dataSourceError: 'Failed to connect to orchestrator service (timeout after 5s)'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Orchestrator Offline</h1>\r
          <p>Status bar displays error indicator when orchestrator service is unavailable.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(xe=(fe=C.parameters)==null?void 0:fe.docs)==null?void 0:xe.source}}};var Se,ke,ye;U.parameters={...U.parameters,docs:{...(Se=U.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>With User Info</h1>\r
          <p>Status bar displays current user information (avatar, name, position).</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(ye=(ke=U.parameters)==null?void 0:ke.docs)==null?void 0:ye.source}}};var be,Be,je;M.parameters={...M.parameters,docs:{...(be=M.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Without User Info</h1>\r
          <p>Status bar without user information section.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(je=(Be=M.parameters)==null?void 0:Be.docs)==null?void 0:je.source}}};var Ne,Ie,we;T.parameters={...T.parameters,docs:{...(Ne=T.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: {
      completed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      // 30 minutes ago
      files: 42,
      status: 'completed'
    },
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Recent Backup</h1>\r
          <p>Expand status bar to see recent backup information (30 minutes ago).</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(we=(Ie=T.parameters)==null?void 0:Ie.docs)==null?void 0:we.source}}};var De,Ce,Ue;E.parameters={...E.parameters,docs:{...(De=E.parameters)==null?void 0:De.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: null,
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>No Backup History</h1>\r
          <p>Expand status bar to see backup controls. Click backup button to run first backup.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(Ue=(Ce=E.parameters)==null?void 0:Ce.docs)==null?void 0:Ue.source}}};var Me,Te,Ee;O.parameters={...O.parameters,docs:{...(Me=O.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    services: {
      'orchestrator': {
        name: 'Orchestrator',
        status: 'healthy',
        critical: true,
        response_time: 15
      },
      'postgres': {
        name: 'PostgreSQL',
        status: 'healthy',
        critical: true,
        response_time: 8
      }
    },
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Minimal Services</h1>\r
          <p>Only essential critical services (Orchestrator and Database).</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(Ee=(Te=O.parameters)==null?void 0:Te.docs)==null?void 0:Ee.source}}};var Oe,Re,Le;R.parameters={...R.parameters,docs:{...(Oe=R.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    services: {
      'orchestrator': {
        name: 'Orchestrator',
        status: 'healthy',
        critical: true,
        response_time: 15
      },
      'lkms101-contacts': {
        name: 'Contacts Service',
        status: 'healthy',
        critical: false,
        response_time: 23
      },
      'lkms102-orders': {
        name: 'Orders Service',
        status: 'healthy',
        critical: false,
        response_time: 31
      },
      'lkms103-invoices': {
        name: 'Invoices Service',
        status: 'healthy',
        critical: false,
        response_time: 28
      },
      'lkms104-reports': {
        name: 'Reports Service',
        status: 'unhealthy',
        critical: false,
        response_time: 420
      },
      'lkms105-auth': {
        name: 'Auth Service',
        status: 'healthy',
        critical: true,
        response_time: 12
      },
      'postgres': {
        name: 'PostgreSQL',
        status: 'healthy',
        critical: true,
        response_time: 8
      },
      'redis': {
        name: 'Redis Cache',
        status: 'healthy',
        critical: true,
        response_time: 3
      }
    },
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Many Services</h1>\r
          <p>Full microservices architecture with 8 services (one unhealthy).</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(Le=(Re=R.parameters)==null?void 0:Re.docs)==null?void 0:Le.source}}};var $e,He,Pe;L.parameters={...L.parameters,docs:{...($e=L.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator',
    onBackup: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Backup completed successfully!');
    },
    onRefresh: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Services refreshed!');
    }
  },
  decorators: [Story => <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>\r
        <div style={{
      flex: 1,
      padding: '20px',
      background: 'var(--theme-input-background, #f5f5f5)'
    }}>\r
          <h1>Interactive Features</h1>\r
          <p>Expand status bar and click backup button or refresh button to trigger callbacks.</p>\r
        </div>\r
        <Story />\r
      </div>]
}`,...(Pe=(He=L.parameters)==null?void 0:He.docs)==null?void 0:Pe.source}}};var Ae,ze,Fe;$.parameters={...$.parameters,docs:{...(Ae=$.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  args: {
    services: healthyServices,
    initialBackupInfo: lastBackup,
    currentUser: mockUser,
    dataSource: 'orchestrator'
  },
  decorators: [Story => {
    // Auto-expand on mount
    React.useEffect(() => {
      const statusBar = document.querySelector('[data-component="statusbar"]');
      if (statusBar) {
        (statusBar as HTMLElement).click();
      }
    }, []);
    return <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>\r
          <div style={{
        flex: 1,
        padding: '20px',
        background: 'var(--theme-input-background, #f5f5f5)'
      }}>\r
            <h1>Expanded View</h1>\r
            <p>Status bar is automatically expanded to show full service details.</p>\r
            <p>Features:</p>\r
            <ul>\r
              <li>Critical services section (orchestrator, database)</li>\r
              <li>Other services section (microservices)</li>\r
              <li>Database & backup section with one-click backup</li>\r
              <li>Service response times</li>\r
              <li>Resizable height (drag top edge)</li>\r
              <li>Click outside to collapse</li>\r
            </ul>\r
          </div>\r
          <Story />\r
        </div>;
  }]
}`,...(Fe=(ze=$.parameters)==null?void 0:ze.docs)==null?void 0:Fe.source}}};const Nt=["AllHealthy","SomeUnhealthy","CriticalDown","MockData","OrchestratorOffline","WithUser","WithoutUser","WithRecentBackup","NoBackupHistory","MinimalServices","ManyServices","WithCallbacks","ExpandedView"];export{N as AllHealthy,w as CriticalDown,$ as ExpandedView,R as ManyServices,O as MinimalServices,D as MockData,E as NoBackupHistory,C as OrchestratorOffline,I as SomeUnhealthy,L as WithCallbacks,T as WithRecentBackup,U as WithUser,M as WithoutUser,Nt as __namedExportsOrder,jt as default};
