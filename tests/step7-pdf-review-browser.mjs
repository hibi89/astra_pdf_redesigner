// STEP7: real Chrome/Edge PDF A vs output B, no PDF upload or stored V2 changes.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';
import {makeStep7PdfParityCorpus} from './fixtures/step7-pdf-parity-corpus.mjs';

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
 const fullV2Snapshot="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const result={};for(const name of [...db.objectStoreNames].sort())result[name]=await new Promise((resolve,reject)=>{const r=db.transaction(name,'readonly').objectStore(name).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return result}finally{db.close()}})()";
 const v2FullBefore=await evaluate(fullV2Snapshot);
 await evaluate("(()=>{const key='astra-pdf-redesigner:current:v1';localStorage.setItem(key,JSON.stringify({schemaVersion:1,document:{title:'P115 synthetic V1 baseline',author:'Synthetic',date:'2026-11-15',learned:'V1 sentinel',difficult:'',solved:'',reflection:''},design:{theme:'report',accent:'#285a73',textSize:'medium',font:'sans'}}));return true})()");
 const v1Before=await evaluate("localStorage.getItem('astra-pdf-redesigner:current:v1')");
 assert.equal(JSON.parse(v1Before).schemaVersion,1,'STEP1 V1 synthetic baseline must be valid for the no-write regression');
 await evaluate("document.querySelector('[data-step7-open-pdf-review]').click()");
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-step7-pdf-review]'))"));
 // The web/Chrome/Edge version must not pretend that unbundled native OCR is ready.
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-step7-local-ocr]'))"));
 assert.equal(await evaluate("document.querySelector('[data-step7-ocr-run]')?.disabled"),true);
 assert.equal(await evaluate("document.querySelector('[data-step7-ocr-file]')?.disabled"),true);
 assert.equal(await evaluate("document.querySelector('[data-step7-ocr-status]')?.textContent.includes('브라우저 모드')"),true);
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
 assert.deepEqual(await evaluate(snapshot),before,'Cancelled comparison must leave active V2 document unchanged');
 assert.deepEqual(await evaluate(fullV2Snapshot),v2FullBefore,'Cancelled comparison must leave all V2 stores unchanged');
 assert.equal(await evaluate("localStorage.getItem('astra-pdf-redesigner:current:v1')"),v1Before,'Cancelled comparison must leave STEP1 V1 unchanged');
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-result]')?.textContent"),s=>s?.includes('원본 2 / 결과 2')&&s?.includes('누락된 원본 토큰'));
 assert.equal(await evaluate("Boolean(document.querySelector('[data-pdf-review-error]'))"),false);
 assert.equal(await evaluate("document.querySelector('[data-pdf-review-result]')?.textContent.includes('자동 텍스트 대조상 차이가 없지만')"),true);
 const parityCorpus=makeStep7PdfParityCorpus();
 assert.equal(parityCorpus.length,15,'P115 must compare at least 15 synthetic source/output A4 pairs');
 const metric=label=>evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==="+JSON.stringify(label)+");return Number(d?.nextElementSibling?.textContent??0)})()");
 for(const pair of parityCorpus){
  const sourceHash=createHash('sha256').update(pair.source).digest('hex');
  await upload('[data-pdf-review-source]',pair.source,pair.id+'-source.pdf');
  await upload('[data-pdf-review-output]',pair.output,pair.id+'-output.pdf');
  await eventually(()=>evaluate("(()=>{const b=document.querySelector('[data-pdf-review-start]');return Boolean(b&&!b.disabled&&!document.querySelector('[data-pdf-review-result]'))})()"),x=>x===true);
  await evaluate("document.querySelector('[data-pdf-review-start]').click()");
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-pdf-review-result]'))"),x=>x===true);
  const sourceDigest=await evaluate("(()=>[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='원본 PDF SHA256')?.nextElementSibling?.textContent)()");
  assert.equal(sourceDigest,sourceHash,pair.id+' source SHA256');
  const pageText=await evaluate("(()=>[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='PDF 페이지')?.nextElementSibling?.textContent)()");
  assert.equal(pageText,'원본 1 / 결과 1',pair.id+' one-page A4 pair');
  assert.equal(await metric('원본 비A4 페이지'),0,pair.id+' source A4');
  assert.equal(await metric('출력 비A4 페이지'),0,pair.id+' output A4');
  const expectedToMetric={missingNumericTokens:'숫자 포함 누락 토큰',missingSymbols:'빠진 기호/구두점',addedSymbols:'추가 기호/구두점',missingNegations:'빠진 부정 표현',addedNegations:'추가 부정 표현',missingLinkTargets:'빠진 링크 대상',addedLinkTargets:'추가 링크 대상',addedTokens:'출력에만 있는 토큰'};
  for(const [field,label] of Object.entries(expectedToMetric))
   if(pair.expected[field]!==undefined)assert.equal(await metric(label),pair.expected[field],pair.id+' '+field);
  assert.equal(await evaluate("document.querySelector('[data-pdf-review-page-differences]')?.textContent"),'1페이지',pair.id+' original page location');
  assert.match(await evaluate("document.querySelector('[data-pdf-review-result] [role=status]')?.textContent??''"),/차이 또는 미확인 위험/);
  assert.equal(createHash('sha256').update(pair.source).digest('hex'),sourceHash,pair.id+' immutable source bytes');
 }
 assert.deepEqual(await evaluate(snapshot),before,'15 pair comparisons must not write STEP2 V2');
 assert.deepEqual(await evaluate(fullV2Snapshot),v2FullBefore,'15 pair comparisons must not change any V2 store');
 assert.equal(await evaluate("localStorage.getItem('astra-pdf-redesigner:current:v1')"),v1Before,'15 pair comparisons must not write STEP1 V1');
 console.log('PASS P115 PDF PARITY CORPUS: 15/15 actual A4 source/output pairs classify money, dates, symbols, negation, links, duplicates and page risks; source SHA plus full STEP1 V1/STEP2 V2 unchanged');
 const invalidPdf=Buffer.from('%PDF-not-a-valid-catalog','ascii');
 await upload('[data-pdf-review-source]',src,'immutable-original.pdf');
 const sourceHashBeforeError=createHash('sha256').update(src).digest('hex');
 await upload('[data-pdf-review-output]',invalidPdf,'broken-output.pdf');
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-pdf-review-error]'))"),x=>x===true);
 assert.equal(createHash('sha256').update(src).digest('hex'),sourceHashBeforeError,'Failed review must not mutate original source bytes');
 assert.deepEqual(await evaluate(snapshot),before,'Failed comparison must leave active V2 document unchanged');
 assert.deepEqual(await evaluate(fullV2Snapshot),v2FullBefore,'Failed comparison must leave every V2 store unchanged');
 assert.equal(await evaluate("localStorage.getItem('astra-pdf-redesigner:current:v1')"),v1Before,'Failed comparison must leave STEP1 V1 unchanged');
 console.log('PASS P115 PDF ERROR RECOVERY: invalid output remains manual-review-required; original SHA, STEP1 V1 and STEP2 V2 unchanged');
 await upload('[data-pdf-review-source]',src,'original.pdf');
 await upload('[data-pdf-review-output]',out,'redesigned.pdf');
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-pdf-review-result]'))"),x=>x===true);
 
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
 const globalOrder=await evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='문서 전체 읽기 순서');return d?.nextElementSibling?.textContent})()");
 assert.equal(globalOrder,'검토 필요','All tokens equal but global reading order moved');

 const movedVector=await evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='페이지별 벡터 위험');return Number(d?.nextElementSibling?.textContent)})()");
 assert.equal(movedVector,2,'A page swap must reveal per-page vector stroke displacement');
 const movedRaster=await evaluate("(()=>{const d=[...document.querySelectorAll('[data-pdf-review-result] dt')].find(x=>x.textContent==='페이지별 이미지 위험');return Number(d?.nextElementSibling?.textContent)})()");
 assert.equal(movedRaster,2,'A page swap must reveal moved raster image draw even with same image total');
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
 const manualStart=await evaluate("document.querySelector('[data-pdf-review-manual]')?.textContent");
 assert.match(manualStart,/0\/10/);
 await evaluate("document.querySelector('[data-pdf-review-manual-check=\"numbers\"]').click()");
 await evaluate("document.querySelector('[data-pdf-review-manual-check=\"symbols\"]').click()");
 await evaluate("document.querySelector('[data-pdf-review-manual-check=\"negation\"]').click()");
 await evaluate("document.querySelector('[data-pdf-review-manual-check=\"links\"]').click()");
 assert.match(await evaluate("document.querySelector('[data-pdf-review-manual]')?.textContent"),/4\/10/);
 await evaluate("document.querySelectorAll('[data-pdf-review-manual-check]').forEach(input=>{if(!input.checked)input.click()})");
 await evaluate("document.querySelector('[data-pdf-review-download]').click()");
 const updated=JSON.parse(await evaluate("(async()=>await window.__ownerReviewBlob?.text())()"));
 assert.equal(updated.manualVisualReview.items.length,10);
 assert.equal(updated.manualVisualReview.items.find(x=>x.id==='numbers').checked,true);
 assert.equal(updated.manualVisualReview.completed,true);
 assert.equal(updated.manualVisualReview.scope,'LOCAL_VISUAL_CHECK_ONLY_NOT_SALE_APPROVAL');
 assert.equal(updated.ownerApproval,'NOT_GRANTED');
 assert.equal(updated.externalTransfer,false);
 await upload('[data-pdf-review-output]',out,'manual-review-reset.pdf');
 assert.equal(await evaluate("Boolean(document.querySelector('[data-pdf-review-result]'))"),false);
 await evaluate("document.querySelector('[data-pdf-review-start]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pdf-review-manual]')?.textContent"),s=>s?.includes('0/10'));


 await evaluate("document.querySelector('.mode-bar button').click()");
 await eventually(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active'))"));
 const after=await evaluate(snapshot);
 assert.deepEqual(after,before,'Step7 owner review must not write active IndexedDB V2 document');
 assert.deepEqual(await evaluate(fullV2Snapshot),v2FullBefore,'Step7 owner review must preserve every IndexedDB V2 store');
 assert.equal(await evaluate("localStorage.getItem('astra-pdf-redesigner:current:v1')"),v1Before,'Step7 owner review must preserve STEP1 V1');
 assert.deepEqual(external,[],'No outgoing external HTTP(S) request allowed');
 console.log('PASS STEP7 PDF PAIR: actual selectable PDF token comparison, local file inputs, numeric-drift warning, JSON metadata only, V2 unchanged, external requests0');
}finally{
 try{ws?.close();}catch{}
 await browser.close().catch(()=>{});
 try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
 catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;}
}
