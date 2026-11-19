// C009: exercise a large synthetic document under CPU throttling, measure renderer
// heap/DOM metrics, print to PDF, then reopen the app and verify IndexedDB recovery.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdirSync,mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {isAbsolute,join,relative,resolve} from 'node:path';
import {launchBrowser} from './browser-process.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-c009-resource-'));
const runnerTemp=process.env.RUNNER_TEMP?resolve(process.env.RUNNER_TEMP):null;
const outputRoot=process.env.C009_RESOURCE_OUTPUT_DIR?resolve(process.env.C009_RESOURCE_OUTPUT_DIR):join(profile,'outputs');
if(process.env.GITHUB_ACTIONS==='true'){
 if(!runnerTemp||!process.env.C009_RESOURCE_OUTPUT_DIR)throw Error('C009 resource evidence must be under GitHub RUNNER_TEMP.');
 const rel=relative(runnerTemp,outputRoot);
 if(rel==='..'||rel.startsWith('..')||isAbsolute(rel))throw Error('C009 output path escaped GitHub RUNNER_TEMP.');
}
mkdirSync(outputRoot,{recursive:true});
const browser=launchBrowser(binary,profile,'C009 large-document and recovery');
const pause=ms=>new Promise(resolvePause=>setTimeout(resolvePause,ms));
const cpuRate=4;
const paragraphCount=180;
const filler='합성 장문 레이아웃과 인쇄 복구를 확인합니다. 숫자 230,000원과 부정문은 바뀌면 안 됩니다. '.repeat(3);
const paragraphs=Array.from({length:paragraphCount},(_,index)=>
 'C009_RESOURCE_ITEM_'+String(index).padStart(4,'0')+' '+filler);
const largeBody=paragraphs.join('\n\n');
const firstMarker='C009_RESOURCE_ITEM_0000';
const middleMarker='C009_RESOURCE_ITEM_0090';
const lastMarker='C009_RESOURCE_ITEM_'+String(paragraphCount-1).padStart(4,'0');
let ws,sequence=0;
const pending=new Map();

function request(method,params={},sessionId,timeoutMs=30000){
 return new Promise((resolveRequest,rejectRequest)=>{
  const id=++sequence;
  const timeout=setTimeout(()=>{
   pending.delete(id);
   rejectRequest(Error('C009 CDP request timed out: '+method));
  },timeoutMs);
  pending.set(id,{
   resolve(value){clearTimeout(timeout);resolveRequest(value);},
   reject(error){clearTimeout(timeout);rejectRequest(error);},
  });
  ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
}
async function eventually(fn,predicate=x=>Boolean(x),label='state',timeoutMs=90000){
 const end=Date.now()+timeoutMs;let last;
 while(Date.now()<end){
  last=await fn();
  if(predicate(last))return last;
  await pause(100);
 }
 throw Error('C009 '+label+' timed out: '+JSON.stringify(last));
}
async function attach(urlToOpen){
 const {targetId}=await request('Target.createTarget',{url:urlToOpen});
 const {sessionId}=await request('Target.attachToTarget',{targetId,flatten:true});
 const send=(method,params={},timeoutMs=30000)=>request(method,params,sessionId,timeoutMs);
 await send('Page.enable');await send('Runtime.enable');await send('Performance.enable');
 const evaluate=async expression=>{
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},90000);
  if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
 };
 return{targetId,sessionId,send,evaluate};
}
async function metrics(page){
 const result=await page.send('Performance.getMetrics');
 const values=Object.fromEntries((result.metrics||[]).map(item=>[item.name,item.value]));
 const snapshot={
  js_heap_used_bytes:Math.round(values.JSHeapUsedSize||0),
  js_heap_total_bytes:Math.round(values.JSHeapTotalSize||0),
  dom_nodes:Math.round(values.Nodes||0),
  documents:Math.round(values.Documents||0),
  layout_count:Math.round(values.LayoutCount||0),
  task_duration_seconds:Number((values.TaskDuration||0).toFixed(3)),
 };
 assert.ok(snapshot.js_heap_used_bytes>0,'Chromium must expose renderer heap metrics.');
 assert.ok(snapshot.dom_nodes>0,'Chromium must expose renderer DOM node metrics.');
 assert.ok(snapshot.js_heap_used_bytes<512*1024*1024,
  'Synthetic document renderer heap exceeded the 512 MiB safety ceiling.');
 assert.ok(snapshot.dom_nodes<100000,'Synthetic document created an unexpectedly large DOM.');
 return snapshot;
}
async function persistedSnapshot(page){
 return page.evaluate(`(async()=>{
  const request=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('IndexedDB request failed'));});
  const db=await new Promise((resolve,reject)=>{
   const open=indexedDB.open('astra-pdf-redesigner:v2',1);
   open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error||new Error('IndexedDB open failed'));
   open.onblocked=()=>reject(new Error('IndexedDB unexpectedly blocked'));
  });
  const tx=db.transaction(['documents','meta'],'readonly');
  const completed=new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('IndexedDB read aborted'));});
  const docsPromise=request(tx.objectStore('documents').getAll());
  const activePromise=request(tx.objectStore('meta').get('activeDocumentId'));
  const [docs,activeId]=await Promise.all([docsPromise,activePromise]);
  await completed;db.close();
  const document=docs.find(item=>item.id===activeId)||null;
  return{activeId,document,localStorage:Object.entries(localStorage).sort(([a],[b])=>a.localeCompare(b))};
 })()`);
}
function writePdf(page,stem,bytes){
 const path=join(outputRoot,stem+'.pdf');
 writeFileSync(path,bytes,{flag:'wx'});
 const info=execFileSync('pdfinfo',[path],{encoding:'utf8'});
 const pagesLine=info.split(/\r?\n/).find(line=>line.startsWith('Pages:'));
 const pages=Number(pagesLine?.split(':')[1]?.trim()||0);
 assert.ok(pages>=5&&pages<=80,'Large synthetic print expected 5–80 A4 pages, got '+pages);
 const extracted=execFileSync('pdftotext',[path,'-'],{encoding:'utf8',maxBuffer:8*1024*1024}).normalize('NFC');
 const compact=extracted.replace(/[^A-Za-z0-9가-힣]/g,'');
 for(const marker of [firstMarker,middleMarker,lastMarker,'230000원','부정문은바뀌면안됩니다']){
  const expected=marker.replace(/[^A-Za-z0-9가-힣]/g,'');
  assert.ok(compact.includes(expected),'Large synthetic PDF lost marker '+marker+' in '+stem);
 }
 return{path,pages,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),text_markers_preserved:true};
}
async function renderPdf(page,stem){
 const start=Date.now();
 const result=await page.send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false},120000);
 const elapsedMs=Date.now()-start;
 const bytes=Buffer.from(result.data,'base64');
 assert.ok(bytes.length>10000,'Large-document PDF output is unexpectedly small.');
 assert.ok(elapsedMs<120000,'Large-document PDF print exceeded two minutes under 4x CPU throttle.');
 return{...writePdf(page,stem,bytes),elapsed_ms:elapsedMs};
}
async function main(){
 ws=await browser.connect();
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.id&&pending.has(message.id)){
   const item=pending.get(message.id);pending.delete(message.id);
   if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
  }
 });
 let page=await attach(url);
 await eventually(()=>page.evaluate('Boolean(document.querySelector(".studio-layout .project-paper")&&document.querySelector(".save-chip")&&document.querySelector(".section-editor textarea"))'),
  Boolean,'real React Workspace startup');
 await page.send('Emulation.setCPUThrottlingRate',{rate:cpuRate});
 const title='C009 synthetic large document resource and recovery verification';
 await page.evaluate(`(()=>{const e=[...document.querySelectorAll('.form-grid label')].find(label=>label.textContent.includes('출력 제목'))?.querySelector('input');if(!e)throw Error('Missing output title editor');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(e,${JSON.stringify(title)});e.dispatchEvent(new Event('input',{bubbles:true}));return true})()`);
 await page.evaluate(`(()=>{const e=document.querySelector('.section-editor textarea');if(!e)throw Error('Missing synthetic paragraph editor');const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(e,${JSON.stringify(largeBody)});e.dispatchEvent(new Event('input',{bubbles:true}));return true})()`);
 await eventually(()=>page.evaluate(`(()=>document.querySelector('.paper-surface .project-paper')?.innerText.includes(${JSON.stringify(lastMarker)}))()`),
  Boolean,'large synthetic React preview',120000);
 await eventually(()=>page.evaluate('document.querySelector(".save-chip")?.textContent?.trim()'),
  value=>value==='저장됨','large synthetic IndexedDB save',120000);
 const saved=await persistedSnapshot(page);
 assert.ok(saved.document,'The active STEP2 V2 document must persist in IndexedDB.');
 assert.equal(saved.document.schemaVersion,2,'The stored document must remain STEP2 V2.');
 assert.equal(saved.document.content.title,title,'The synthetic document title must persist exactly.');
 const storedText=saved.document.content.sections.flatMap(section=>section.blocks)
  .find(block=>block.kind==='paragraph')?.text;
 assert.equal(storedText,largeBody,'The full synthetic body must persist in IndexedDB without truncation.');
 const beforeMetrics=await metrics(page);
 const firstPrint=await renderPdf(page,'c009-large-document-throttled');
 const afterPrintMetrics=await metrics(page);
 const beforeClose=await persistedSnapshot(page);
 assert.deepEqual(beforeClose,saved,'Printing must not mutate saved V2 or localStorage.');
 const report={
  schema:'astra-c009-resource-recovery-v1',status:'RUNNING',browser:binary,
  cpu_throttling_rate:cpuRate,synthetic_paragraphs:paragraphCount,synthetic_characters:largeBody.length,
  first_print:firstPrint,renderer_metrics_before_print:beforeMetrics,renderer_metrics_after_print:afterPrintMetrics,
  storage_unchanged_after_print:true,
 };
 writeFileSync(join(outputRoot,'report.json'),JSON.stringify(report,null,2),'utf8');
 console.log('PASS C009 large synthetic document print',JSON.stringify({
  browser:binary,pages:firstPrint.pages,elapsed_ms:firstPrint.elapsed_ms,
  js_heap_used_bytes:afterPrintMetrics.js_heap_used_bytes,dom_nodes:afterPrintMetrics.dom_nodes
 }));

 // Close the rendered tab after a completed durable save, then reopen a fresh
 // renderer in the same isolated browser profile and verify IndexedDB recovery.
 const closed=await request('Target.closeTarget',{targetId:page.targetId});
 assert.equal(closed.success,true,'The test must close the original rendered page before recovery.');
 page=await attach(url);
 await page.send('Emulation.setCPUThrottlingRate',{rate:cpuRate});
 await eventually(()=>page.evaluate('Boolean(document.querySelector(".save-chip")&&document.querySelector(".section-editor textarea"))'),
  Boolean,'reopened Workspace startup',120000);
 await eventually(()=>page.evaluate(`(()=>{const title=[...document.querySelectorAll('.form-grid label')].find(label=>label.textContent.includes('출력 제목'))?.querySelector('input')?.value;const body=document.querySelector('.section-editor textarea')?.value;return title===${JSON.stringify(title)}&&body.length===${largeBody.length}&&body.includes(${JSON.stringify(lastMarker)})})()`),
  Boolean,'reopened document restored from IndexedDB',120000);
 const recovered=await persistedSnapshot(page);
 assert.deepEqual(recovered,saved,'Close/reopen recovery must preserve the exact synthetic V2 record and legacy localStorage bytes.');
 const recoveredPrint=await renderPdf(page,'c009-large-document-recovery');
 const afterRecoveryMetrics=await metrics(page);
 const finalReport={
  ...report,status:'PASS',recovered_print:recoveredPrint,
  renderer_metrics_after_recovery:afterRecoveryMetrics,
  indexeddb_v2_restored:true,localstorage_preserved:true,
 };
 writeFileSync(join(outputRoot,'report.json'),JSON.stringify(finalReport,null,2),'utf8');
 console.log('PASS C009 close/reopen recovery',JSON.stringify({
  browser:binary,pages:recoveredPrint.pages,elapsed_ms:recoveredPrint.elapsed_ms,
  indexeddb_v2_restored:true,localstorage_preserved:true,
  js_heap_used_bytes:afterRecoveryMetrics.js_heap_used_bytes,dom_nodes:afterRecoveryMetrics.dom_nodes
 }));
}
try{
 await main();
}finally{
 try{ws?.close();}catch{}
 try{await browser.close();}catch{}
 try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}catch{}
}
