// G002 isolated end-to-end: actual Chromium product PDF import -> live V2
// IndexedDB -> product localdoc export -> CDP printed PDF -> PDF.js parity.
// All bytes synthetic, all browser data confined to isolated ephemeral profile.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {launchBrowser} from './browser-process.mjs';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';
import {inspectStep2V2ExportPdfParity} from '../tools/gpt-final-qa-v2-pdfjs-bridge.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const profile=mkdtempSync(join(tmpdir(),'astra-g002-live-v2-'));
const browser=launchBrowser(process.env.CHROME_PATH||'chromium',profile,'G002 source-gated V2 PDF.js');
const source=makeMixedLayoutPdf(1);
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
let ws=null,seq=0;
const pending=new Map();
try {
  ws=await browser.connect();
  ws.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id||!pending.has(msg.id))return;
    const item=pending.get(msg.id);pending.delete(msg.id);
    if(msg.error)item.reject(Error(msg.error.message));else item.resolve(msg.result);
  });
  const rpc=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const id=++seq;pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await rpc('Target.createTarget',{url});
  const {sessionId}=await rpc('Target.attachToTarget',{targetId,flatten:true});
  const send=(method,params={})=>rpc(method,params,sessionId);
  await send('Page.enable');await send('Runtime.enable');
  const evaluate=async source=>{
    const r=await send('Runtime.evaluate',{expression:source,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw Error('G002_BROWSER_EVALUATION_FAILED');
    return r.result.value;
  };
  const eventually=async(fn,predicate=x=>Boolean(x),timeout=30000)=>{
    let observed,lastError;
    const deadline=Date.now()+timeout;
    while(Date.now()<deadline){
      try{observed=await fn();if(predicate(observed))return observed;}
      catch(e){lastError=e;}
      await sleep(150);
    }
    throw Error('G002_BROWSER_TIMEOUT:'+String(lastError?.message||'target not reached').slice(0,80));
  };
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-m06b-dropzone]')&&document.querySelector('.doc-list-item.active'))"));
  const before=await evaluate("JSON.stringify(Object.keys(localStorage).filter(k=>/v1/i.test(k)).sort().map(k=>[k,localStorage.getItem(k)]))");
  const beforeDocs=await evaluate("document.querySelectorAll('.doc-list-item').length");
  const base64=source.toString('base64');
  await evaluate(`(()=>{const bytes=Uint8Array.from(atob(${JSON.stringify(base64)}),c=>c.charCodeAt(0));
    const file=new File([bytes],'g002-synthetic-source.pdf',{type:'application/pdf'});
    const dt=new DataTransfer();dt.items.add(file);
    document.querySelector('[data-m06b-dropzone]').dispatchEvent(
      new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));
    return true;})()`);
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),
    t=>typeof t==='string'&&t.includes('STEP3_SOURCE_P1_BEGIN_901')&&t.includes('STEP3_SOURCE_P2_BEGIN_911'));
  assert.ok(await evaluate("document.querySelectorAll('.step3-block-review details').length")>=2);
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),beforeDocs,
    'Review-only import must not mutate persisted V2 project list');
  // These synthetic PDFs intentionally contain a vector table/two columns.
  // STEP3 requires a separate manual page-order comparison in addition to
  // the global checkbox. This was the actual cause of the old blocked E2E.
  const riskyPages=await evaluate(`(()=>{
    const rows=[...document.querySelectorAll('[data-step3-layout-review]')];
    return rows.map(row=>({
      page:Number(row.getAttribute('data-step3-layout-review')),
      enabled:!row.querySelector('[data-step3-layout-review-confirm]')?.disabled,
    }));})()`);
  assert.ok(riskyPages.length>=1,'Synthetic mixed-layout PDF must trigger a manual reading-order gate');
  for(const page of riskyPages){
    assert.equal(page.enabled,true,'Manual page review must be available to the owner');
    // The test owner has examined the deterministic fixture content for
    // each page in this synthetic test; no production review state bypass.
    await evaluate(`(()=>{
      const input=document.querySelector('[data-step3-layout-review-confirm="${page.page}"]');
      if(!input||input.disabled||input.checked)throw Error('Layout review checkbox not ready');
      const details=input.closest('details');if(details)details.open=true;
      input.click();return true;})()`);
    await eventually(()=>evaluate(`document.querySelector('[data-step3-layout-review-confirm="${page.page}"]')?.checked`),
      x=>x===true,12000);
  }
  const noPending=await evaluate(`(()=>{
    return [...document.querySelectorAll('[data-step3-layout-review-confirm]')]
      .every(x=>x.checked);
  })()`);
  assert.equal(noPending,true,'All flagged pages must be actually confirmed before saving');
  // Click is a React state event; the confirm button rerenders in a later
  // task. Reading disabled in this same synchronous evaluation is a false fail.
  await evaluate(`(()=>{
    const approve=document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]');
    if(!approve||approve.disabled)throw Error('No explicit owner confirmation checkbox');
    approve.click();return true;})()`);
  await eventually(()=>evaluate(`(()=>{
    const confirm=[...document.querySelectorAll('.step3-import-panel button')]
      .find(x=>x.textContent.includes('검수 결과를 새 문서로 저장'));
    return confirm?{exists:true,enabled:!confirm.disabled}:null;})()`),
    state=>state?.enabled===true,10000);
  const importConfirmed=await evaluate(`(()=>{
    const confirm=[...document.querySelectorAll('.step3-import-panel button')]
      .find(x=>x.textContent.includes('검수 결과를 새 문서로 저장'));
    if(!confirm||confirm.disabled)throw Error('V2 save requires explicit confirmation');
    confirm.click();return true;})()`);
  assert.equal(importConfirmed,true);
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===beforeDocs+1);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),s=>s==='저장됨');
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),
    s=>typeof s==='string'&&s.includes('STEP3_SOURCE_P1_BEGIN_901'));
  const liveDoc=await evaluate(`(async()=>{
    const db=await new Promise((res,rej)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
    try{
      const active=await new Promise((res,rej)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
      const document=await new Promise((res,rej)=>{const r=db.transaction('documents','readonly').objectStore('documents').get(active);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
      if(!document||document.id!==active)throw Error('Live document ID mismatch');
      const json=JSON.stringify(document.content);
      const bytes=new TextEncoder().encode(json);
      const hash=await crypto.subtle.digest('SHA-256',bytes);
      return {id:active,sha:Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,'0')).join(''),
        anchored:document.content.sections.flatMap(s=>s.blocks).filter(b=>b.origin).length};
    }finally{db.close();}
  })()`);
  assert.ok(liveDoc.id&&liveDoc.anchored>=1);
  await evaluate(`(()=>{
    const originalUrl=URL.createObjectURL.bind(URL);
    URL.createObjectURL=function(blob){
      if(blob?.type==='application/json')window.__g002CapturedProjectExport=blob;
      return originalUrl(blob);
    };
    const originalClick=HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click=function(){
      if(this.download.endsWith('.localdoc.json'))return;
      return originalClick.call(this);
    };
    const button=[...document.querySelectorAll('.project-toolbar button')].find(x=>x.textContent.includes('프로젝트 내보내기'));
    if(!button||button.disabled)throw Error('V2 product export button unavailable');
    button.click();return true;})()`);
  const projectJSON=await eventually(()=>evaluate("window.__g002CapturedProjectExport?.text()"),
    s=>typeof s==='string'&&s.includes('"format":"astra-local-document"'));
  const project=JSON.parse(projectJSON);
  const exportedHash=sha(Buffer.from(JSON.stringify(project.document.content),'utf8'));
  assert.equal(exportedHash,liveDoc.sha,'Actual live V2 record and product export content SHA must match');
  assert.equal(project.document.id,liveDoc.id);
  const sourceBrowserHash=await evaluate(`(async()=>{
    const iframe=document.querySelector('.studio-source-panel iframe[src^="blob:"]');
    if(!iframe)throw Error('Original source PDF preview not retained');
    const bytes=await(await fetch(iframe.src)).arrayBuffer();
    const digest=await crypto.subtle.digest('SHA-256',bytes);
    return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
  })()`);
  assert.equal(sourceBrowserHash,sha(source),'Original source Blob changed after V2 import');
  const printed=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
  const output=Buffer.from(printed.data,'base64');
  assert.ok(output.length>1000&&output.toString('ascii',0,5)==='%PDF-');
  const anchored=project.document.content.sections.flatMap(s=>s.blocks).filter(b=>b.origin);
  const unanchored=project.document.content.sections.flatMap(s=>s.blocks).filter(b=>!b.origin);
  const receipt={
    format:'astra-local-source-review-receipt',version:1,
    source_sha256:sha(source),source_size_bytes:source.length,
    project_content_sha256:exportedHash,
    anchored_block_count:anchored.length,acknowledged_block_count:anchored.length,
    unacknowledged_block_count:0,stale_acknowledgement_count:0,
    unanchored_block_count:unanchored.length,anchored_source_page_count:
      new Set(anchored.map(b=>b.origin.page)).size,
    status:'ALL_ANCHORED_BLOCKS_ACKNOWLEDGED',source_fidelity_certified:false,
    owner_approval:'NOT_GRANTED',external_transfer:false,original_modified:false,
  };
  // Self-reported *synthetic* receipt above is intentionally NOT an attestation
  // that the owner reviewed each block. It binds the real V2 export hash only.
  // Synthetic-only counts to locate PDF.js control glyph issues. Never log
  // actual text, paths, input PDF bytes or customer values.
  const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const textStats=async bytes=>{
    const task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true,disableFontFace:true});
    try{
      const pdf=await task.promise;
      let charCount=0,nullCount=0,itemCount=0;
      for(let n=1;n<=pdf.numPages;n++){
        const page=await pdf.getPage(n);
        for(const item of (await page.getTextContent()).items){
          if(typeof item.str!=='string')continue;
          charCount+=item.str.length;nullCount+=item.str.split('\u0000').length-1;itemCount++;
        }
      }
      return {pages:pdf.numPages,itemCount,charCount,nullCount};
    }finally{await task.destroy();}
  };
  const allAnchors=project.document.content.sections.flatMap(s=>s.blocks).filter(b=>b.origin&&b.kind!=='image');
  const importedNull=allAnchors.reduce((n,b)=>n+b.text.split('\u0000').length-1,0);
  console.log('G002 synthetic PDF.js counts:',JSON.stringify({
    source:await textStats(source),output:await textStats(output),
    anchoredItems:allAnchors.length,anchoredNullCount:importedNull,
  }));
  const report=await inspectStep2V2ExportPdfParity({
    sourcePdfBefore:source,sourcePdfAfter:Buffer.from(source),
    outputPdf:output,projectExportBytes:Buffer.from(projectJSON,'utf8'),
    reviewReceiptBytes:Buffer.from(JSON.stringify(receipt),'utf8'),
  });
  assert.equal(report.projectContentSha256,liveDoc.sha);
  assert.equal(report.sourcePdfSha256,sourceBrowserHash);
  assert.equal(report.ownerApproval,'NOT_GRANTED');
  assert.equal(report.buyerAcceptance,'UNASSESSED');
  assert.equal(report.scoreDelta,0);
  assert.equal(report.release,'RELEASE HOLD');
  assert.equal(report.externalTransfer,false);
  const after=await evaluate("JSON.stringify(Object.keys(localStorage).filter(k=>/v1/i.test(k)).sort().map(k=>[k,localStorage.getItem(k)]))");
  assert.equal(after,before,'Local STEP1 V1 state must survive real PDF import and V2 export');
  console.log('PASS G002 LIVE V2 WITH PAGE REVIEW: genuine Chrome PDF.js import, explicit user save, IndexedDB V2 content/hash, product project export, retained source SHA, actual A4 output PDF, independent structural risk flags, no V1 changes, no buyer acceptance');
  console.log('G002 synthetic risk codes:',JSON.stringify(report.issues));
}finally{
  try{ws?.close();}catch{}
  await browser.close();
  // Chrome may leave a helper process flushing the ephemeral profile; do not
  // replace the real test result with an ENOTEMPTY cleanup exception.
  try{rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});}
  catch{ /* GitHub-hosted runner destroys this dedicated synthetic profile on exit. */ }
}
