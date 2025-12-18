import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{u as Y}from"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import"./_commonjsHelpers-CqkleIqs.js";const G="WizardProgress-module__wizardProgress___1JxA8",Q="WizardProgress-module__progressDots___h1AHk",Z="WizardProgress-module__dot___ISF0p",rr="WizardProgress-module__dotActive___5Rpvc",er="WizardProgress-module__progressBar___pKF8z",tr="WizardProgress-module__progressBarFill___Ob5Jk",sr="WizardProgress-module__progressNumbers___RA-3F",ar="WizardProgress-module__currentNumber___X-t0m",or="WizardProgress-module__separator___yPqkN",nr="WizardProgress-module__totalNumber___OSvF9",ir="WizardProgress-module__stepInfo___lhNiq",pr="WizardProgress-module__stepLabel___FYlLF",cr="WizardProgress-module__stepTitle___1geba",e={wizardProgress:G,progressDots:Q,dot:Z,dotActive:rr,progressBar:er,progressBarFill:tr,progressNumbers:sr,currentNumber:ar,separator:or,totalNumber:nr,stepInfo:ir,stepLabel:pr,stepTitle:cr},a=({currentStep:t,totalSteps:s,stepTitles:lr,currentStepTitle:_,variant:g="dots"})=>{const{t:U}=Y(),X=s>0?(t+1)/s*100:0;return r.jsxs("div",{className:e.wizardProgress,children:[g==="dots"&&r.jsx("div",{className:e.progressDots,children:Array.from({length:s}).map((dr,v)=>r.jsx("div",{className:`${e.dot} ${v<=t?e.dotActive:""}`},v))}),g==="bar"&&r.jsx("div",{className:e.progressBar,children:r.jsx("div",{className:e.progressBarFill,style:{width:`${X}%`}})}),g==="numbers"&&r.jsxs("div",{className:e.progressNumbers,children:[r.jsx("span",{className:e.currentNumber,children:t+1}),r.jsx("span",{className:e.separator,children:"/"}),r.jsx("span",{className:e.totalNumber,children:s})]}),r.jsxs("div",{className:e.stepInfo,children:[r.jsxs("span",{className:e.stepLabel,children:[U("wizard.step")||"Step"," ",t+1,"/",s]}),_&&r.jsx("span",{className:e.stepTitle,children:_})]})]})},_r={title:"Components/Utility/WizardProgress",component:a,tags:["autodocs"],argTypes:{currentStep:{control:{type:"number",min:0,max:4},description:"Current step (0-based)"},totalSteps:{control:{type:"number",min:1,max:10},description:"Total number of steps"},variant:{control:"select",options:["dots","bar","numbers"],description:"Progress display variant"},currentStepTitle:{control:"text",description:"Current step title"},stepTitles:{control:"object",description:"Step titles array (optional)"}},parameters:{docs:{description:{component:"Progress indicator for multi-step wizards with three visual variants: dots, bar, and numbers."}}}},o={args:{currentStep:1,totalSteps:5,variant:"dots",currentStepTitle:"Basic Information"}},n={args:{currentStep:2,totalSteps:5,variant:"bar",currentStepTitle:"Contact Details"}},i={args:{currentStep:3,totalSteps:5,variant:"numbers",currentStepTitle:"Review & Confirm"}},p={args:{currentStep:0,totalSteps:5,variant:"dots",currentStepTitle:"Welcome"}},c={args:{currentStep:2,totalSteps:5,variant:"dots",currentStepTitle:"Address Information"}},l={args:{currentStep:4,totalSteps:5,variant:"dots",currentStepTitle:"Confirmation"}},d={args:{currentStep:1,totalSteps:3,variant:"dots",currentStepTitle:"Step 2 of 3"}},m={args:{currentStep:3,totalSteps:7,variant:"dots",currentStepTitle:"Step 4 of 7"}},u={render:()=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[r.jsxs("div",{children:[r.jsx("h4",{style:{marginBottom:"8px"},children:"Dots Variant"}),r.jsx(a,{currentStep:2,totalSteps:5,variant:"dots",currentStepTitle:"Step 3 - Review"})]}),r.jsxs("div",{children:[r.jsx("h4",{style:{marginBottom:"8px"},children:"Bar Variant"}),r.jsx(a,{currentStep:2,totalSteps:5,variant:"bar",currentStepTitle:"Step 3 - Review"})]}),r.jsxs("div",{children:[r.jsx("h4",{style:{marginBottom:"8px"},children:"Numbers Variant"}),r.jsx(a,{currentStep:2,totalSteps:5,variant:"numbers",currentStepTitle:"Step 3 - Review"})]})]}),parameters:{docs:{description:{story:"All three progress variants showing the same step (3 of 5)."}}}},S={render:()=>r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[0,1,2,3,4].map(t=>r.jsx(a,{currentStep:t,totalSteps:5,variant:"dots",currentStepTitle:`Step ${t+1}`},t))}),parameters:{docs:{description:{story:"Progress sequence showing all steps from first to last."}}}};var x,h,b;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    currentStep: 1,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Basic Information'
  }
}`,...(b=(h=o.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var f,T,N;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    currentStep: 2,
    totalSteps: 5,
    variant: 'bar',
    currentStepTitle: 'Contact Details'
  }
}`,...(N=(T=n.parameters)==null?void 0:T.docs)==null?void 0:N.source}}};var P,y,j;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    currentStep: 3,
    totalSteps: 5,
    variant: 'numbers',
    currentStepTitle: 'Review & Confirm'
  }
}`,...(j=(y=i.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var z,W,w;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    currentStep: 0,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Welcome'
  }
}`,...(w=(W=p.parameters)==null?void 0:W.docs)==null?void 0:w.source}}};var B,A,D;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    currentStep: 2,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Address Information'
  }
}`,...(D=(A=c.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var F,R,C;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    currentStep: 4,
    totalSteps: 5,
    variant: 'dots',
    currentStepTitle: 'Confirmation'
  }
}`,...(C=(R=l.parameters)==null?void 0:R.docs)==null?void 0:C.source}}};var I,V,L;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    currentStep: 1,
    totalSteps: 3,
    variant: 'dots',
    currentStepTitle: 'Step 2 of 3'
  }
}`,...(L=(V=d.parameters)==null?void 0:V.docs)==null?void 0:L.source}}};var q,$,k;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    currentStep: 3,
    totalSteps: 7,
    variant: 'dots',
    currentStepTitle: 'Step 4 of 7'
  }
}`,...(k=($=m.parameters)==null?void 0:$.docs)==null?void 0:k.source}}};var O,E,J;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Dots Variant</h4>\r
        <WizardProgress currentStep={2} totalSteps={5} variant="dots" currentStepTitle="Step 3 - Review" />\r
      </div>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Bar Variant</h4>\r
        <WizardProgress currentStep={2} totalSteps={5} variant="bar" currentStepTitle="Step 3 - Review" />\r
      </div>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Numbers Variant</h4>\r
        <WizardProgress currentStep={2} totalSteps={5} variant="numbers" currentStepTitle="Step 3 - Review" />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All three progress variants showing the same step (3 of 5).'
      }
    }
  }
}`,...(J=(E=u.parameters)==null?void 0:E.docs)==null?void 0:J.source}}};var M,H,K;S.parameters={...S.parameters,docs:{...(M=S.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>\r
      {[0, 1, 2, 3, 4].map(step => <WizardProgress key={step} currentStep={step} totalSteps={5} variant="dots" currentStepTitle={\`Step \${step + 1}\`} />)}\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Progress sequence showing all steps from first to last.'
      }
    }
  }
}`,...(K=(H=S.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};const vr=["Dots","Bar","Numbers","FirstStep","MiddleStep","LastStep","ThreeSteps","SevenSteps","AllVariants","ProgressSequence"];export{u as AllVariants,n as Bar,o as Dots,p as FirstStep,l as LastStep,c as MiddleStep,i as Numbers,S as ProgressSequence,m as SevenSteps,d as ThreeSteps,vr as __namedExportsOrder,_r as default};
