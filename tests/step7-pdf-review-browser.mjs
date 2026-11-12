// STEP7: real Chrome/Edge PDF A vs output B, no PDF upload or stored V2 changes.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-step7-owner-'));
const browser=launchBrowser(binary,profile,'STEP7 offline PDF pair review');
let ws,seq=0;
const pending=new Map(),external=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=x=>Boolean(x),timeout=45000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(predicate(last))return last;await pause(130);}
 throw Error('STEP7 browser timeout: '+JSON.stringify(last));
}
try{
 ws=await browser.connect();
 ws.addEventListener('message',e=>{
  const m=JSON.parse(e.data);
  if(m.method==='Network.requestWillBeSent'){
   const request=m.params?.request?.url||'';
   if(/^https?:\/\//i.test(request)&&!/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\//i.test(request))
    external.push(request.slice(0,70));
  }
  if(m.id&&pending.has(m.id)){
   const p=pending.get(m.id);pending.delete(m.id);
   if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);
  }
 });
 const req=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const id=++seq;pending.set(id,{resolve,reject});
  ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
 const {targetId}=await req('Target.createTarget',{url});
 const {sessionId}=await req('Target.attachToTarget',{targetId,flatten:true});
 const send=(method,params={})=>req(method,params,sessionId);
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 const evaluate=async expression=>{
  const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
 };
 await eventually(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active')&&document.querySelector('[data-step7-open-pdf-review]'))"));
 const snapshot="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const id=await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return await new Promise((resolve,reject)=>{const r=db.transaction('documents','readonly').objectStore('documents').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{db.close()}})()";
 const before=await eventually(()=>evaluate(snapshot),x=>Boolean(x?.id&&x?.content));
 await evaluate("document.querySelector('[data-step7-open-pdf-review]').click()");
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-step7-pdf-review]'))"));
 const upload=async(selector,pdf,name)=>evaluate(`(()=>{const bytes=Uint8Array.from(atob(${JSON.stringify(pdf.toString('base64'))}),c=>c.charCodeAt(0));const f=new File([bytes],${JSON.stringify(name)},{type:'application/pdf'});const dt=new DataTransfer();dt.items.add(f);const input=document.querySelector(${JSON.stringify(selector)});input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
 const src=makeMixedLayoutPdf(1);
 const out=Buffer.from(src.toString('binary').replace('40 820 Td','41 820 Td'),'binary');
 assert.notDeepEqual(out,src,'Redesigned fixture differs at image-neutral layout position');
 await upload('[data-pdf-review-source]',src,'original.pdf');
 await upload('[data-pdf-review-output]',out,'redesigned.pdf');
 // P79: change selection synchronously after starting an asynchronous review.
 // A stale run must be cancelled and cannot leave the primary action disabled.
 await evaluate("(()=>{document.querySelector('[data-pdf-review-start]').click();const input=document.querySelector('[data-pdf-review-output]');const f=input.files[0];const dt=new DataTransfer();dt.items.add(new File([f],'reselected-redesign.pdf',{type:'application/pdf'}));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true})()");
 await eventually(()=>evaluate("(()=>{const b=document.querySelector('[data-pdf-review-start]');return !b.disabled && b.textContent.includes('두 PDF 대조하기') && !document.querySelector('[data-pdf-review-result]')})()"));
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-result]')?.textContent"),s=>s?.includes('원본 2 / 결과 2')&&s?.includes('누락된 원본 토큰'));
 assert.equal(await evaluate("Boolean(document.querySelector('[data-pdf-review-error]'))"),false);
 assert.equal(await evaluate("document.querySelector('[data-pdf-review-result]')?.textContent.includes('자동 텍스트 대조상 차이가 없지만')"),true);
 const read=await evaluate("(()=>{window.__ownerReviewBlob=null;const original=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{if(blob.type==='application/json')window.__ownerReviewBlob=blob;return original(blob)};HTMLAnchorElement.prototype.click=function(){window.__ownerReviewDownload=this.download;};document.querySelector('[data-pdf-review-download]').click();return true})()");
 const json=await evaluate("(async()=>await window.__ownerReviewBlob?.text())()");
 const review=JSON.parse(json);
 assert.equal(review.format,'astra-step7-local-pdf-parity-v1');
 assert.equal(review.missingTokens,0);assert.equal(review.missingNumericTokens,0);
 assert.equal(review.externalTransfer,false);assert.equal(review.ownerApproval,'NOT_GRANTED');
 assert.equal(await evaluate('window.__ownerReviewDownload'),'astra-pdf-parity-review.json');
 assert.doesNotMatch(json,/STEP3_SOURCE|RUNNING_HEADER|PAGE_TWO_TOKEN|original\.pdf/);
 const modified=Buffer.from(out.toString('binary').replace('STEP3_SOURCE_P2_END_913','STEP3_SOURCE_P2_END_998'),'binary');
 await upload('[data-pdf-review-output]',modified,'redesigned-changed.pdf');
 assert.equal(await evaluate("Boolean(document.querySelector('[data-pdf-review-result]'))"),false);
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-result]')?.textContent"),s=>s?.includes('차이 또는 미확인 위험')&&s?.includes('숫자 포함'));
 const missingNum=await evaluate("(()=>{const dl=document.querySelector('[data-pdf-review-result] dl');const d=[...dl.querySelectorAll('dt')].find(x=>x.textContent==='숫자 포함 누락 토큰');return Number(d?.nextElementSibling?.textContent)})()");
 assert.ok(missingNum>=1,'Changed numeric source token must be shown as risk');
 const reversed=Buffer.from(src.toString('binary').replace('/Kids [3 0 R 7 0 R]','/Kids [7 0 R 3 0 R]'),'binary');
 await upload('[data-pdf-review-output]',reversed,'page-order-changed.pdf');
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-result]')?.textContent"),s=>s?.includes('같은 번호 페이지의 내용이 다릅니다'));
 const drift=await evaluate("(()=>{const dl=document.querySelector('[data-pdf-review-result] dl');const d=[...dl.querySelectorAll('dt')].find(x=>x.textContent==='페이지별 텍스트 위험');return Number(d?.nextElementSibling?.textContent)})()");
 assert.equal(drift,2,'Page swap must be visible even when global text counts match');
 const movedVector=await evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='페이지별 벡터 위험');return Number(d?.nextElementSibling?.textContent)})()");
 assert.equal(movedVector,2,'A page swap must reveal per-page vector stroke displacement');
 const shifted=Buffer.from(src.toString('binary').replace('(TABLE_A_906)','(TABLE_Z_906)')
  .replace('(TABLE_B_907)','(TABLE_A_906)').replace('(TABLE_Z_906)','(TABLE_B_907)'),'binary');
 await upload('[data-pdf-review-output]',shifted,'within-page-table-swapped.pdf');
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-result]')?.textContent"),s=>s?.includes('같은 페이지에서 추출된 텍스트 순서가 바뀌었습니다'));
 const orderDrift=await evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='페이지 내 텍스트 순서 위험');return Number(d?.nextElementSibling?.textContent)})()");
 assert.equal(orderDrift,1,'Within-page content order warning must be visible to owner');
 const unsigned=Buffer.from(src.toString('binary').replace('(TABLE_A_906)','(100        )'),'binary');
 const negative=Buffer.from(unsigned.toString('binary').replace('(100        )','(-100       )'),'binary');
 await upload('[data-pdf-review-source]',unsigned,'positive-source.pdf');
 await upload('[data-pdf-review-output]',negative,'negative-result.pdf');
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-result]')?.textContent"),s=>s?.includes('결과 PDF에 없는 숫자 포함 토큰이 있습니다'));
 const missingSign=await evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='숫자 포함 누락 토큰');return Number(d?.nextElementSibling?.textContent)})()");
 assert.equal(missingSign,1,'A lost number sign must be flagged as missing numeric content');
 const removedBorder=Buffer.from(src.toString('binary').replace(
  '1 w 40 490 510 108 re S','1 w 40 490 510 108 re n'),'binary');
 await upload('[data-pdf-review-source]',src,'vector-original.pdf');
 await upload('[data-pdf-review-output]',removedBorder,'table-border-removed.pdf');
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-result]')?.textContent"),
  s=>s?.includes('벡터 선 그리기 수가 다릅니다'));
 const strokes=await evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='벡터 선 그리기');return d?.nextElementSibling?.textContent})()");
 assert.match(strokes,/원본 [0-9]+ \/ 결과 [0-9]+/);

 await evaluate("document.querySelector('.mode-bar button').click()");
 await eventually(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active'))"));
 const after=await evaluate(snapshot);
 assert.deepEqual(after,before,'Step7 owner review must not write IndexedDB V2');
 assert.deepEqual(external,[],'No outgoing external HTTP(S) request allowed');
 console.log('PASS STEP7 PDF PAIR: actual selectable PDF token comparison, local file inputs, numeric-drift warning, JSON metadata only, V2 unchanged, external requests0');
}finally{
 try{ws?.close();}catch{}
 await browser.close().catch(()=>{});
 try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
 catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;}
}
