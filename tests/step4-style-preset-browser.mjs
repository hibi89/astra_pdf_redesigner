// STEP4 portable preset: actual browser export/import, ephemeral preview, undo, A4, V2 integrity.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {launchBrowser} from './browser-process.mjs';
const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-style-preset-'));
const browser=launchBrowser(binary,profile,'STEP4 portable preset');
let ws,seq=0;
const pending=new Map();
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=x=>Boolean(x),timeout=25000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(predicate(last))return last;await pause(120);}
 throw Error('STEP4 preset browser timeout: '+JSON.stringify(last));
}
try{
 ws=await browser.connect();
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.id&&pending.has(message.id)){const item=pending.get(message.id);pending.delete(message.id);
   if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);}
 });
 const request=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const id=++seq;pending.set(id,{resolve,reject});
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
 await eventually(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active')&&document.querySelector('[data-step4-portable-preset]'))"));
 const stored="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const id=await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return await new Promise((resolve,reject)=>{const r=db.transaction('documents','readonly').objectStore('documents').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{db.close()}})()";
 const before=await eventually(()=>evaluate(stored),x=>Boolean(x?.id&&x?.design&&x?.content));
 await evaluate("(()=>{window.__astraPresetBlob=null;const original=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{if(blob.type==='application/json')window.__astraPresetBlob=blob;return original(blob)};HTMLAnchorElement.prototype.click=function(){window.__astraPresetDownload=this.download;};document.querySelector('[data-style-preset-export]').click();})()");
 const exported=await evaluate("(async()=>({filename:window.__astraPresetDownload,json:await window.__astraPresetBlob?.text()}))()");
 assert.equal(exported.filename,'astra-style-preset.json');
 const preset=JSON.parse(exported.json);
 assert.deepEqual(preset.design,before.design);
 assert.deepEqual(Object.keys(preset).sort(),['design','format','name','version']);
 assert.doesNotMatch(exported.json,/sections|PRIVATE|assetId|sourcePdf/);
 const newTheme=before.design.theme==='report'?'folio':'report';
 preset.design.theme=newTheme;
 const selected=JSON.stringify(preset);
 const load=async json=>evaluate("(()=>{const f=new File(["+JSON.stringify(json)+"],'portable.json',{type:'application/json'});const transfer=new DataTransfer();transfer.items.add(f);const input=document.querySelector('[data-step4-portable-preset] input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
 await load(selected);
 await eventually(()=>evaluate("document.querySelector('[data-style-preset-preview]')?.textContent.includes('미리보기')"));
 assert.equal(await evaluate("document.querySelector('.project-paper')?.classList.contains("+JSON.stringify('paper-theme-'+newTheme)+")"),true);
 assert.deepEqual(await evaluate(stored),before,'Import/preview must not persist design or document');
 await evaluate("document.querySelector('[data-style-preset-cancel]').click()");
 await eventually(()=>evaluate("!document.querySelector('[data-style-preset-preview]')"));
 assert.equal(await evaluate("document.querySelector('.project-paper')?.classList.contains("+JSON.stringify('paper-theme-'+before.design.theme)+")"),true);
 assert.deepEqual(await evaluate(stored),before,'Cancel must keep saved source intact');
 await load(selected);
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-style-preset-apply]:not(:disabled)'))"));
 await evaluate("document.querySelector('[data-style-preset-apply]').click()");
 const applied=await eventually(()=>evaluate(stored),d=>d?.design?.theme===newTheme);
 assert.deepEqual(applied.content,before.content,'Apply must only change design, never PDF-derived content');
 const pdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
 const bytes=Buffer.from(pdf.data,'base64');
 assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
 const output=join(profile,'style-preset-a4.pdf');writeFileSync(output,bytes);
 const pdfinfo=execFileSync('pdfinfo',[output],{encoding:'utf8'});
 const page=/Page size:\s+([0-9.]+) x ([0-9.]+) pts \(A4\)/.exec(pdfinfo);
 assert.ok(page,'Browser-printed PDF must be identified as A4');
 assert.ok(Math.abs(Number(page[1])-595.28)<1&&Math.abs(Number(page[2])-841.89)<1,'A4 page dimensions must be within renderer point rounding tolerance');
 await evaluate("[...document.querySelectorAll('.reference-style-panel button')].find(b=>b.textContent==='직전 디자인 적용 취소').click()");
 const restored=await eventually(()=>evaluate(stored),d=>JSON.stringify(d?.design)===JSON.stringify(before.design));
 assert.deepEqual(restored.content,before.content);
 await load(JSON.stringify({...preset,ownerApproval:'GRANTED'}));
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-style-preset-error]'))"));
 assert.equal(await evaluate("Boolean(document.querySelector('[data-style-preset-preview]'))"),false);
 assert.deepEqual(await evaluate(stored),restored,'Tampered preset must not modify the document after completed apply/undo');

 const advancedList=await evaluate("Array.from(document.querySelectorAll('[data-extended-layout-id]')).map(button=>button.dataset.extendedLayoutId)");
 assert.equal(advancedList.length,22);
 assert.equal(new Set(advancedList).size,22);
 const advancedPrior=await evaluate(stored);
 const geometry=[];
 for(const id of advancedList){
   await evaluate("document.querySelector('[data-extended-layout-id="+JSON.stringify(id)+"]').click()");
   await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),x=>x===id);
   const values=await evaluate("(()=>{const p=document.querySelector('.project-paper'),h=p.querySelector('.document-heading'),s=p.querySelector('.document-section h2');const a=getComputedStyle(p),b=getComputedStyle(h),c=s&&getComputedStyle(s);return [a.paddingTop,a.paddingLeft,b.textAlign,b.borderLeftWidth,b.borderTopWidth,b.borderRightWidth,b.backgroundColor,c?.borderLeftWidth,c?.borderRightWidth,c?.borderBottomWidth]})()");
   geometry.push(JSON.stringify(values));
   // Print every PRO/BUSINESS candidate, not just one representative.
   const candidatePdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
   const candidateBytes=Buffer.from(candidatePdf.data,'base64');
   assert.equal(candidateBytes.subarray(0,5).toString(),'%PDF-',id+' browser PDF signature');
   assert.ok(candidateBytes.length>1000,id+' must produce a real PDF');
   const candidateFile=join(profile,'all-layout-'+id+'.pdf');
   writeFileSync(candidateFile,candidateBytes);
   const info=execFileSync('pdfinfo',[candidateFile],{encoding:'utf8'});
   assert.match(info,/Page size:\\s+[0-9.]+ x [0-9.]+ pts \\(A4\\)/,id+' A4 print format');
   assert.ok(Number(/Pages:\\s+(\\d+)/.exec(info)?.[1])>=1,id+' contains at least one A4 page');
 }
 assert.equal(new Set(geometry).size,22,'Every advanced candidate must have a unique computed geometry signature');
 assert.deepEqual(await evaluate(stored),advancedPrior,'Transient advanced layouts never modify V2');
 const chosen=advancedList.at(-1);
 await evaluate("document.querySelector('[data-extended-layout-id="+JSON.stringify(chosen)+"]').click()");
 const printed=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
 const printedBytes=Buffer.from(printed.data,'base64');
 assert.equal(printedBytes.subarray(0,5).toString(),'%PDF-');
 const printedPath=join(profile,'advanced-layout-a4.pdf');writeFileSync(printedPath,printedBytes);
 assert.match(execFileSync('pdfinfo',[printedPath],{encoding:'utf8'}),/Page size:\s+[0-9.]+ x [0-9.]+ pts \(A4\)/);
 await evaluate("document.querySelector('[data-extended-layout-cancel]').click()");
 await eventually(()=>evaluate("!document.querySelector('.project-paper')?.dataset.advancedLayout"));
 assert.deepEqual(await evaluate(stored),advancedPrior,'Advanced cancel keeps original V2');
  // Portable advanced-layout receipt: browser export/import without writes to IndexedDB.
  await evaluate("document.querySelector('[data-extended-layout-id=pro-01]').click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),x=>x==='pro-01');
  await evaluate("document.querySelector('[data-advanced-preset-export]').click()");
  const advancedJson=await evaluate("(async()=>await window.__astraPresetBlob.text())()");
  const advancedReceipt=JSON.parse(advancedJson);
  assert.deepEqual(Object.keys(advancedReceipt).sort(),['format','layoutId','version']);
  assert.equal(advancedReceipt.layoutId,'pro-01');
  assert.doesNotMatch(advancedJson,/assetId|content|sections|PDF-/);
  await evaluate("document.querySelector('[data-extended-layout-cancel]').click()");
  await evaluate("(()=>{const f=new File(["+JSON.stringify(advancedJson)+"],'advanced-layout.json',{type:'application/json'});const d=new DataTransfer();d.items.add(f);const i=document.querySelector('[data-advanced-preset-file]');i.files=d.files;i.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),x=>x==='pro-01');
  assert.deepEqual(await evaluate(stored),advancedPrior,'Portable advanced layout must not write V2 document');
  await evaluate("document.querySelector('[data-extended-layout-cancel]').click()");

 console.log('PASS P93 PRO/BUSINESS 22/22: unique DOM geometries, every A4 PDF output audited, V2 unchanged');
 console.log('PASS STEP4 PORTABLE STYLE: file export/import, transient preview/cancel, apply/undo, A4 PDF, tamper and original V2 preservation');
}finally{
 try{ws?.close();}catch{}
 await browser.close().catch(()=>{});
 try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
 catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;}
}
