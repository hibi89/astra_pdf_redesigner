'use strict';
// STEP5 local embedded-PDF typography proposal; synthetic input only.
const APP_URL='astra://app/index.html';
const {snapshotInstalledV2}=require('./step3-m09d-cancel-acceptance.cjs');

async function runInstalledPdfReferenceAcceptance(win,pdfBytes){
  if(process.env.GITHUB_ACTIONS!=='true'||process.platform!=='win32'||!process.env.RUNNER_TEMP)
    throw Error('STEP5 reference acceptance requires an isolated Windows CI runner');
  if(!Buffer.isBuffer(pdfBytes)||pdfBytes.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('STEP5 needs the existing synthetic selectable-text PDF');
  await win.loadURL(APP_URL);
  const evaluate=expression=>win.webContents.executeJavaScript(expression,true).catch(error=>{
    throw Error('STEP5 reference renderer evaluation failed: '+expression.slice(0,180)+' :: '+
      (error instanceof Error?error.message:String(error)));
  });
  for(let i=0;i<160;i++){
    if(await evaluate("Boolean(document.querySelector('.reference-style-panel input[type=file]')&&"+
      "document.querySelector('.doc-list-item.active')&&document.querySelector('.save-chip')?.textContent==='저장됨')"))break;
    await new Promise(resolve=>setTimeout(resolve,200));
    if(i===159)throw Error('STEP5 installed reference panel did not become ready');
  }
  const before=await evaluate('('+snapshotInstalledV2.toString()+')()');
  const encoded=pdfBytes.toString('base64');
  await evaluate("(()=>{const input=document.querySelector('.reference-style-panel input[type=file]');"+
    "const data=Uint8Array.from(atob("+JSON.stringify(encoded)+"),c=>c.charCodeAt(0));"+
    "const transfer=new DataTransfer();transfer.items.add(new File([data],'astra-step5-reference.pdf',{type:'application/pdf'}));"+
    "input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
  for(let i=0;i<240;i++){
    if(await evaluate("Boolean(document.querySelector('[data-reference-analysis] [data-reference-pdf-text-count]')&&"+
      "document.querySelector('[data-reference-analysis] [data-reference-pdf-body-size]'))"))break;
    await new Promise(resolve=>setTimeout(resolve,200));
    if(i===239)throw Error('STEP5 PDF typography and body-size suggestion did not render');
  }
  const review=await evaluate("(()=>{const panel=document.querySelector('[data-reference-analysis]');"+
    "const metric=panel?.querySelector('[data-reference-pdf-text-count]');"+
    "const controls=[...panel.querySelectorAll('.setting-block')].find(node=>node.querySelector('h3')?.textContent==='본문 크기와 글꼴');"+
    "const selected=[...controls.querySelectorAll('button')].slice(0,3).find(button=>button.classList.contains('on'))?.textContent?.trim();"+
    "return{count:Number(metric?.getAttribute('data-reference-pdf-text-count')),"+
    "suggestion:metric?.getAttribute('data-reference-pdf-body-size'),selected};})()");
  const labels={small:'작게',medium:'보통',large:'크게'};
  if(!(review.count>0)||!labels[review.suggestion]||review.selected!==labels[review.suggestion])
    throw Error('STEP5 PDF text-size proposal did not follow embedded metrics: '+JSON.stringify(review));
  const after=await evaluate('('+snapshotInstalledV2.toString()+')()');
  if(JSON.stringify(before)!==JSON.stringify(after))
    throw Error('STEP5 reference analysis changed one or more persisted V2 stores: '+JSON.stringify({before,after}));
  await evaluate("document.querySelector('[data-reference-analysis] button.text-button')?.click();true");
  for(let i=0;i<80;i++){
    if(!await evaluate("Boolean(document.querySelector('[data-reference-analysis]'))"))break;
    await new Promise(resolve=>setTimeout(resolve,100));
    if(i===79)throw Error('STEP5 reference cancel did not clear its transient preview');
  }
  const afterCancel=await evaluate('('+snapshotInstalledV2.toString()+')()');
  if(JSON.stringify(before)!==JSON.stringify(afterCancel))
    throw Error('STEP5 cancel changed persisted V2 data');
  console.log('PASS STEP5 WINDOWS PDF REFERENCE: embedded typography drives editable body-size proposal; scanning and cancel preserve all V2 stores');
  return{selectableTextCount:review.count,suggestedTextSize:review.suggestion,storesUnchanged:true};
}

module.exports={runInstalledPdfReferenceAcceptance};

