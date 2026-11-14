// P117 BUSINESS batch plan: real multi-document UI, per-document A4 PDF, and V2 parity.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {launchBrowser} from './browser-process.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-p117-brand-batch-'));
const browser=launchBrowser(binary,profile,'P117 BUSINESS batch');
let ws,sequence=0;
const pending=new Map();
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=value=>Boolean(value),timeout=30000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){
  last=await fn();
  if(predicate(last))return last;
  await pause(120);
 }
 throw Error('P117 browser condition timed out: '+JSON.stringify(last));
}
try{
 ws=await browser.connect();
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.id&&pending.has(message.id)){
   const item=pending.get(message.id);pending.delete(message.id);
   if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
  }
 });
 const request=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const id=++sequence;pending.set(id,{resolve,reject});
  ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
 const {targetId}=await request('Target.createTarget',{url});
 const {sessionId}=await request('Target.attachToTarget',{targetId,flatten:true});
 const send=(method,params={})=>request(method,params,sessionId);
 await send('Page.enable');await send('Runtime.enable');
 const evaluate=async expression=>{
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
 };
 const activeIdCode="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{return await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{db.close()}})()";
 const setValue=async(selector,value,elementType='HTMLInputElement')=>evaluate(
  "(()=>{const e=document.querySelector("+JSON.stringify(selector)+");if(!e)throw Error('missing '+"
  +JSON.stringify(selector)+");const setter=Object.getOwnPropertyDescriptor("+elementType
  +".prototype,'value').set;setter.call(e,"+JSON.stringify(value)
  +");e.dispatchEvent(new Event('input',{bubbles:true}));return true})()"
 );
 const waitSaved=()=>eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),value=>value==='저장됨',45000);
 await eventually(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active')&&document.querySelector('[data-business-batch-panel]'))"));
 const expandDocs=await evaluate("(()=>{const b=[...document.querySelectorAll('button[aria-expanded]')].find(x=>x.parentElement?.querySelector('h2')?.textContent==='내 문서함');if(!b)throw Error('missing document list toggle');if(b.getAttribute('aria-expanded')==='false')b.click();return true})()");
 assert.equal(expandDocs,true);
 await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),count=>count>=1);
 const docNames=Array.from({length:21},(_,i)=>'P117_DOC_'+String(i).padStart(2,'0'));
 const docMarkers=docNames.map(name=>name+'_BEGIN');
 const writeCurrentDocument=async index=>{
  const name=docNames[index],marker=docMarkers[index];
  await setValue('.form-grid label:nth-of-type(1) input',name);
  await setValue('.form-grid label:nth-of-type(2) input','Individual output '+name);
  await setValue('.section-editor .section-editor-heading input','Synthetic source '+name);
  await setValue('.section-editor .block-editor textarea',marker+' | synthetic V2 source text | '+name+'_END','HTMLTextAreaElement');
  await eventually(()=>evaluate("document.querySelector('.project-paper .section-body')?.textContent"),
   value=>value?.includes(marker)&&value?.includes(name+'_END'));
  await waitSaved();
 };
 await writeCurrentDocument(0);
 for(let index=1;index<docNames.length;index++){
  const previousId=await evaluate(activeIdCode);
  const previousCount=await evaluate("document.querySelectorAll('.doc-list-item').length");
  await evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='+ 빈 문서');if(!b)throw Error('missing blank document button');b.click();return true})()");
  await eventually(async()=>({id:await evaluate(activeIdCode),count:await evaluate("document.querySelectorAll('.doc-list-item').length")}),
   state=>state.count===previousCount+1&&state.id&&state.id!==previousId);
  await eventually(()=>evaluate("Boolean(document.querySelector('.form-grid label:nth-of-type(1) input'))"));
  await writeCurrentDocument(index);
 }
 const docs=await evaluate("([...document.querySelectorAll('[data-business-batch-target]')]).map(e=>({id:e.dataset.businessBatchTarget,name:e.closest('label')?.textContent.trim()}))");
 assert.equal(docs.length,21,'the UI must expose 21 isolated synthetic V2 documents');
 assert.deepEqual(new Set(docs.map(doc=>doc.name)),new Set(docNames));
 assert.equal(new Set(docs.map(doc=>doc.id)).size,21,'each document must have a unique V2 ID');
 const byName=new Map(docs.map(doc=>[doc.name,doc.id]));
 const snapshotCode="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const read=name=>new Promise((resolve,reject)=>{const r=db.transaction(name,'readonly').objectStore(name).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});const documents=await read('documents');const assets=await read('assets');const safeAssets=await Promise.all(assets.map(async asset=>{const blob=asset.blob;const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));const fields={...asset};delete fields.blob;return{...fields,blobType:blob.type,blobSize:blob.size,blobBase64:btoa(binary)}}));return{documents,assets:safeAssets}}finally{db.close()}})()";
 const v2Before=await evaluate(snapshotCode);
 assert.equal(v2Before.documents.length,21);
 assert.equal(v2Before.assets.length,0,'fixture starts without image assets');
 for(const doc of v2Before.documents){
  assert.ok(doc.content.sections.some(section=>section.blocks.some(block=>block.kind!=='image'&&block.text.includes(doc.name+'_BEGIN'))),
   'each document must retain its own synthetic source marker');
 }
 const targetSets=[
  {label:'2',names:docNames.slice(0,2)},
  {label:'5',names:docNames.slice(2,7)},
  {label:'20',names:[...docNames.slice(0,6),...docNames.slice(7,21)]},
 ];
 const brandName='P117_SYNTHETIC_BRAND';
 await evaluate("window.__p117PrintCalls=0;window.print=()=>{window.__p117PrintCalls++;}");
 const switchTo=async name=>{
  await evaluate("(()=>{const b=[...document.querySelectorAll('.doc-list-item')].find(x=>x.querySelector('strong')?.textContent.trim()==="
   +JSON.stringify(name)+");if(!b)throw Error('missing document '+"
   +JSON.stringify(name)+");if(!b.classList.contains('active'))b.click();return true})()");
  await eventually(()=>evaluate("document.querySelector('.doc-list-item.active strong')?.textContent.trim()"),value=>value===name);
  const marker=docMarkers[docNames.indexOf(name)];
  await eventually(()=>evaluate("document.querySelector('.project-paper .section-body')?.textContent"),value=>value?.includes(marker));
 };
 const applyPlan=async names=>{
  await switchTo(docNames[0]);
  if(await evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout")!=='business-01'){
   await evaluate("document.querySelector('[data-extended-layout-id=\"business-01\"]')?.click()");
  }
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),value=>value==='business-01');
  if(!(await evaluate("Boolean(document.querySelector('[data-business-brand-status]'))"))){
   await setValue('[data-business-brand-name]',brandName);
   await setValue('[data-business-brand-tagline]','synthetic batch preview');
   await setValue('input[data-business-brand-footer]','P117 CI ONLY');
   await evaluate("document.querySelector('[data-business-brand-apply]').click()");
  }
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-business-brand-header]')?.textContent.includes("
   +JSON.stringify(brandName)+"))"));
  const selectionResult=await evaluate("(async()=>{const checked=[...document.querySelectorAll('[data-business-batch-target]')].filter(e=>e.checked).map(e=>e.closest('label').textContent.trim());for(const name of checked){const e=[...document.querySelectorAll('[data-business-batch-target]')].find(x=>x.closest('label')?.textContent.trim()===name);e.click();await new Promise(r=>setTimeout(r,0))}for(const name of "
   +JSON.stringify(names)+"){const e=[...document.querySelectorAll('[data-business-batch-target]')].find(x=>x.closest('label')?.textContent.trim()===name);if(!e)throw Error('missing selection '+name);e.click();await new Promise(r=>setTimeout(r,0))}return [...document.querySelectorAll('[data-business-batch-target]')].filter(e=>e.checked).map(e=>e.closest('label').textContent.trim())})()");
  assert.deepEqual(new Set(selectionResult),new Set(names),'UI target selection must exactly match the new batch');
  await eventually(()=>evaluate("document.querySelector('[data-business-batch-apply]')?.disabled"),disabled=>disabled===false);
  await evaluate("document.querySelector('[data-business-batch-apply]').click()");
  await eventually(()=>evaluate("document.querySelector('[data-business-batch-status]')?.textContent"),
   status=>status?.includes('일괄 적용 '+names.length+'건'));
  const cancelPreview=await evaluate("Boolean(document.querySelector('[data-extended-layout-cancel]'))");
  if(cancelPreview)await evaluate("document.querySelector('[data-extended-layout-cancel]').click()");
  await pause(80);
 };
 const readPreview=()=>evaluate("(()=>{const p=document.querySelector('.project-paper');return{layout:p?.dataset.advancedLayout||null,planned:Boolean(document.querySelector('[data-business-batch-current]')),brand:document.querySelector('[data-business-brand-header]')?.textContent.trim()||'',body:document.querySelector('.project-paper .section-body')?.textContent||''}})()");
 const verifySnapshot=async label=>{
  const current=await evaluate(snapshotCode);
  assert.deepEqual(current.documents,v2Before.documents,'P117 '+label+' must not change any stored V2 document/content/design');
  assert.deepEqual(current.assets,v2Before.assets,'P117 '+label+' must not change stored V2 image bytes or metadata');
 };
 const exportIndividualPdf=async(name,label)=>{
  await switchTo(name);
  const preview=await readPreview();
  assert.equal(preview.planned,true,'each output must come from an active batch target');
  assert.equal(preview.layout,'business-01');
  assert.ok(preview.brand.includes(brandName));
  assert.ok(preview.body.includes(docMarkers[docNames.indexOf(name)]));
  const calls=await evaluate('window.__p117PrintCalls');
  await evaluate("document.querySelector('.print-button')?.click()");
  await eventually(()=>evaluate('window.__p117PrintCalls'),count=>count===calls+1,45000);
  await eventually(()=>evaluate("document.querySelector('.print-button')?.textContent.trim()"),text=>text!=='준비 중…',45000);
  const result=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
  const output=join(profile,'P117-'+label+'-'+name+'.pdf');
  writeFileSync(output,Buffer.from(result.data,'base64'));
  const info=execFileSync('pdfinfo',[output],{encoding:'utf8'});
  assert.match(info,/Page size:\s+[0-9.]+ x [0-9.]+ pts \(A4\)/,'each individual output must be A4');
  const extracted=execFileSync('pdftotext',['-raw',output,'-'],{encoding:'utf8'});
  assert.ok(extracted.includes(docMarkers[docNames.indexOf(name)]),'PDF must contain its own source marker');
  assert.ok(extracted.includes(brandName),'PDF must contain the requested BUSINESS brand');
  const printedMarkers=extracted.match(/P117_DOC_[0-9]{2}_BEGIN/g)||[];
  assert.deepEqual(printedMarkers,[docMarkers[docNames.indexOf(name)]],
   'individual PDFs must not contain text from another selected or unselected document');
 };
 for(const batch of targetSets){
  await applyPlan(batch.names);
  const selected=new Set(batch.names);
  for(const name of docNames){
   await switchTo(name);
   const preview=await readPreview();
   if(selected.has(name)){
    assert.equal(preview.planned,true,'selected '+name+' must receive the current session plan');
    assert.equal(preview.layout,'business-01');
    assert.ok(preview.brand.includes(brandName));
   }else{
    assert.equal(preview.planned,false,'unselected '+name+' must not retain a stale target plan');
    assert.equal(preview.layout,null,'unselected '+name+' must retain its original layout');
    assert.equal(preview.brand,'','unselected '+name+' must not receive batch branding');
   }
  }
  for(const name of batch.names)await exportIndividualPdf(name,batch.label);
  await verifySnapshot('after '+batch.label+'-document plan and individual PDFs');
  console.log('PASS P117 '+batch.label+' DOCUMENTS: exact target plan, switching, branded individual A4 PDFs, V2 unchanged');
 }
 const sentinel=docNames[6];
 await switchTo(sentinel);
 let state=await readPreview();
 assert.equal(state.planned,false,'the stale prior 5-document target must be excluded from the 20-document plan');
 assert.equal(state.layout,null);
 await evaluate("document.querySelector('[data-business-batch-clear]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-business-batch-status]')?.textContent"),
  status=>status?.includes('일괄 적용 계획 취소'));
 await eventually(()=>evaluate("document.querySelector('[data-business-batch-clear]')?.disabled"),disabled=>disabled===true);
 for(let index=0;index<docNames.length;index++){
  const name=docNames[index];
  await switchTo(name);
  state=await readPreview();
  assert.equal(state.planned,false,'cancel must clear every ephemeral target');
  assert.equal(state.layout,null,'cancel must restore the original saved design');
  assert.equal(state.brand,'','cancel must clear the transient BUSINESS brand from the output preview');
  const original=v2Before.documents.find(doc=>doc.name===name);
  assert.ok(original);
  assert.ok(await evaluate("document.querySelector('.project-paper')?.classList.contains("
   +JSON.stringify('paper-theme-'+original.design.theme)+")"),'cancel must restore original style for '+name);
 }
 await verifySnapshot('after cancel');
 assert.equal(await evaluate('window.__p117PrintCalls'),27,'the real PDF action must run once for each of 2+5+20 documents');
 console.log('PASS P117 CANCEL: 21/21 documents restored; STEP2 V2 content/design/assets unchanged; 27 individual PDFs');
}catch(error){
 console.error('FAIL P117 BUSINESS BATCH:',error);
 throw error;
}finally{
 try{ws?.close();}catch{}
 await browser.close().catch(()=>{});
 try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
 catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;}
}
