import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{u as ne}from"./ToastContext-ErSnUSL6.js";import"./index-BKyFwriW.js";import{B as v}from"./Button-gnwGUMlA.js";import"./_commonjsHelpers-CqkleIqs.js";import"./classNames-CN4lTu6a.js";const re="WizardNavigation-module__wizardNavigation___pAYjS",ae="WizardNavigation-module__spacer___yT1a6",P={wizardNavigation:re,spacer:ae},o=({onPrevious:x,onNext:g,onComplete:N,canGoPrevious:V=!1,canGoNext:b=!0,isLastStep:X=!1,isSubmitting:t=!1,previousLabel:Z,nextLabel:$,completeLabel:ee})=>{const{t:m}=ne(),oe=Z||m("wizard.previous")||"← Späť",te=$||m("wizard.next")||"Ďalej →",se=ee||m("wizard.complete")||"Uložiť";return e.jsxs("div",{className:P.wizardNavigation,children:[x&&e.jsx(v,{variant:"ghost",onClick:x,disabled:!V||t,"data-testid":"wizard-previous-button",children:oe}),e.jsx("div",{className:P.spacer}),X?N&&e.jsx(v,{variant:"primary",onClick:N,disabled:!b||t,loading:t,"data-testid":"wizard-complete-button",children:se}):g&&e.jsx(v,{"data-testid":"wizard-next-button",variant:"primary",onClick:g,disabled:!b||t,children:te})]})},me={title:"Components/Utility/WizardNavigation",component:o,tags:["autodocs"],argTypes:{onPrevious:{action:"previous clicked"},onNext:{action:"next clicked"},onComplete:{action:"complete clicked"},canGoPrevious:{control:"boolean",description:"Whether can go to previous step"},canGoNext:{control:"boolean",description:"Whether can go to next step"},isLastStep:{control:"boolean",description:"Whether current step is last"},isSubmitting:{control:"boolean",description:"Whether wizard is submitting"},previousLabel:{control:"text",description:"Custom label for previous button"},nextLabel:{control:"text",description:"Custom label for next button"},completeLabel:{control:"text",description:"Custom label for complete button"}},parameters:{docs:{description:{component:"Navigation buttons for multi-step wizards with previous, next, and complete actions."}}}},s={args:{onPrevious:void 0,onNext:()=>console.log("Next clicked"),canGoPrevious:!1,canGoNext:!0,isLastStep:!1},parameters:{docs:{description:{story:"First step - only Next button is shown."}}}},n={args:{onPrevious:()=>console.log("Previous clicked"),onNext:()=>console.log("Next clicked"),canGoPrevious:!0,canGoNext:!0,isLastStep:!1},parameters:{docs:{description:{story:"Middle step - both Previous and Next buttons are shown."}}}},r={args:{onPrevious:()=>console.log("Previous clicked"),onComplete:()=>console.log("Complete clicked"),canGoPrevious:!0,canGoNext:!0,isLastStep:!0},parameters:{docs:{description:{story:"Last step - Previous and Complete buttons are shown."}}}},a={args:{onPrevious:()=>console.log("Previous clicked"),onNext:()=>console.log("Next clicked"),canGoPrevious:!0,canGoNext:!1,isLastStep:!1},parameters:{docs:{description:{story:"Next button disabled due to form validation failure."}}}},i={args:{onPrevious:()=>console.log("Previous clicked"),onComplete:()=>console.log("Complete clicked"),canGoPrevious:!0,canGoNext:!0,isLastStep:!0,isSubmitting:!0},parameters:{docs:{description:{story:"Submitting state - Complete button shows loading spinner."}}}},c={args:{onPrevious:()=>console.log("Previous clicked"),onNext:()=>console.log("Next clicked"),canGoPrevious:!0,canGoNext:!0,isLastStep:!1,previousLabel:"Go Back",nextLabel:"Continue"},parameters:{docs:{description:{story:"Custom button labels instead of default translations."}}}},l={args:{onPrevious:()=>console.log("Previous clicked"),onComplete:()=>console.log("Complete clicked"),canGoPrevious:!0,canGoNext:!0,isLastStep:!0,completeLabel:"Create Account"},parameters:{docs:{description:{story:"Custom complete button label for specific action."}}}},d={args:{onNext:()=>console.log("Next clicked"),canGoNext:!0,isLastStep:!1},parameters:{docs:{description:{story:"Only Next button (no Previous handler provided)."}}}},p={args:{onComplete:()=>console.log("Complete clicked"),canGoNext:!0,isLastStep:!0},parameters:{docs:{description:{story:"Only Complete button (no Previous handler provided)."}}}},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"First Step"}),e.jsx(o,{onNext:()=>console.log("Next"),canGoNext:!0,isLastStep:!1})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Middle Step"}),e.jsx(o,{onPrevious:()=>console.log("Previous"),onNext:()=>console.log("Next"),canGoPrevious:!0,canGoNext:!0,isLastStep:!1})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Last Step"}),e.jsx(o,{onPrevious:()=>console.log("Previous"),onComplete:()=>console.log("Complete"),canGoPrevious:!0,canGoNext:!0,isLastStep:!0})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px"},children:"Submitting"}),e.jsx(o,{onPrevious:()=>console.log("Previous"),onComplete:()=>console.log("Complete"),canGoPrevious:!0,canGoNext:!0,isLastStep:!0,isSubmitting:!0})]})]}),parameters:{docs:{description:{story:"All navigation states in different wizard steps."}}}};var S,C,f;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    onPrevious: undefined,
    // No previous button on first step
    onNext: () => console.log('Next clicked'),
    canGoPrevious: false,
    canGoNext: true,
    isLastStep: false
  },
  parameters: {
    docs: {
      description: {
        story: 'First step - only Next button is shown.'
      }
    }
  }
}`,...(f=(C=s.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};var h,G,L;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Middle step - both Previous and Next buttons are shown.'
      }
    }
  }
}`,...(L=(G=n.parameters)==null?void 0:G.docs)==null?void 0:L.source}}};var y,k,w;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onComplete: () => console.log('Complete clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Last step - Previous and Complete buttons are shown.'
      }
    }
  }
}`,...(w=(k=r.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var j,z,B;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    canGoPrevious: true,
    canGoNext: false,
    // Form validation failed
    isLastStep: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Next button disabled due to form validation failure.'
      }
    }
  }
}`,...(B=(z=a.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var W,_,O;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onComplete: () => console.log('Complete clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: true,
    isSubmitting: true // Showing loading state
  },
  parameters: {
    docs: {
      description: {
        story: 'Submitting state - Complete button shows loading spinner.'
      }
    }
  }
}`,...(O=(_=i.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var A,F,M;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: false,
    previousLabel: 'Go Back',
    nextLabel: 'Continue'
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom button labels instead of default translations.'
      }
    }
  }
}`,...(M=(F=c.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};var T,D,E;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    onPrevious: () => console.log('Previous clicked'),
    onComplete: () => console.log('Complete clicked'),
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: true,
    completeLabel: 'Create Account'
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom complete button label for specific action.'
      }
    }
  }
}`,...(E=(D=l.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var U,R,Y;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    onNext: () => console.log('Next clicked'),
    canGoNext: true,
    isLastStep: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Only Next button (no Previous handler provided).'
      }
    }
  }
}`,...(Y=(R=d.parameters)==null?void 0:R.docs)==null?void 0:Y.source}}};var q,H,I;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    onComplete: () => console.log('Complete clicked'),
    canGoNext: true,
    isLastStep: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Only Complete button (no Previous handler provided).'
      }
    }
  }
}`,...(I=(H=p.parameters)==null?void 0:H.docs)==null?void 0:I.source}}};var J,K,Q;u.parameters={...u.parameters,docs:{...(J=u.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>First Step</h4>\r
        <WizardNavigation onNext={() => console.log('Next')} canGoNext={true} isLastStep={false} />\r
      </div>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Middle Step</h4>\r
        <WizardNavigation onPrevious={() => console.log('Previous')} onNext={() => console.log('Next')} canGoPrevious={true} canGoNext={true} isLastStep={false} />\r
      </div>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Last Step</h4>\r
        <WizardNavigation onPrevious={() => console.log('Previous')} onComplete={() => console.log('Complete')} canGoPrevious={true} canGoNext={true} isLastStep={true} />\r
      </div>\r
      <div>\r
        <h4 style={{
        marginBottom: '8px'
      }}>Submitting</h4>\r
        <WizardNavigation onPrevious={() => console.log('Previous')} onComplete={() => console.log('Complete')} canGoPrevious={true} canGoNext={true} isLastStep={true} isSubmitting={true} />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All navigation states in different wizard steps.'
      }
    }
  }
}`,...(Q=(K=u.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};const ve=["FirstStep","MiddleStep","LastStep","NextDisabled","Submitting","CustomLabels","CustomCompleteLabel","OnlyNextButton","OnlyCompleteButton","AllStates"];export{u as AllStates,l as CustomCompleteLabel,c as CustomLabels,s as FirstStep,r as LastStep,n as MiddleStep,a as NextDisabled,p as OnlyCompleteButton,d as OnlyNextButton,i as Submitting,ve as __namedExportsOrder,me as default};
