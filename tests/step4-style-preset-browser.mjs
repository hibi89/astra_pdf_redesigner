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
 const p116Markers=Array.from({length:40},(_,i)=>'P116_ROW_'+String(i+1).padStart(2,'0'));
 const p116Body=['P116_TEXT_BEGIN · 2026-11-15 · 원문 디자인 시험',...p116Markers.map(marker=>marker+' · effective date 2026-11-15 · amount -1250.50 USD · 한국어 원문 줄 보존 표본'), 'P116_TEXT_END'].join('\n');
 const p116PngBase64='iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGOUS3nGwMDAxMDAwMDAAAAQQgFsBOs6hwAAAABJRU5ErkJggg==';
 await evaluate("(()=>{const e=document.querySelector('.section-editor .section-editor-heading input');if(!e)throw Error('missing section title input');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(e,'P116 구조 검수 섹션');e.dispatchEvent(new Event('input',{bubbles:true}));return true})()");
 await evaluate("(()=>{const e=document.querySelector('.section-editor .block-editor textarea');if(!e)throw Error('missing source paragraph');const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(e,"+JSON.stringify(p116Body)+");e.dispatchEvent(new Event('input',{bubbles:true}));return true})()");
 await eventually(()=>evaluate("document.querySelector('.project-paper .section-body')?.textContent"),text=>text?.includes('P116_TEXT_BEGIN')&&text?.includes('P116_TEXT_END'));
  await evaluate("(()=>{const bytes=Uint8Array.from(atob("+JSON.stringify(p116PngBase64)+"),c=>c.charCodeAt(0));const f=new File([bytes],'p116-layout.png',{type:'image/png'});const dt=new DataTransfer();dt.items.add(f);const input=document.querySelector('.section-editor .add-block input[type=file]');if(!input)throw Error('missing image file input');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true})()");
 await eventually(()=>evaluate("Boolean(document.querySelector('.project-paper figure img')?.complete&&document.querySelector('.project-paper figure img')?.naturalWidth===2)"));
 await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),value=>value==='저장됨');
 const stored="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const id=await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return await new Promise((resolve,reject)=>{const r=db.transaction('documents','readonly').objectStore('documents').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{db.close()}})()";
 const before=await eventually(()=>evaluate(stored),x=>Boolean(x?.id&&x?.design&&x?.content));
 const fullV2Snapshot="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const result={};for(const name of [...db.objectStoreNames].sort()){const rows=await new Promise((resolve,reject)=>{const r=db.transaction(name,'readonly').objectStore(name).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});if(name==='assets'){result[name]=await Promise.all(rows.map(async asset=>{const {blob,...fields}=asset;const bytes=new Uint8Array(await blob.arrayBuffer());fields.blobType=blob.type;fields.blobSize=blob.size;fields.blobBase64=btoa(String.fromCharCode(...bytes));return fields}))}else result[name]=rows}return result}finally{db.close()}})()";
 const fullV2Before=await evaluate(fullV2Snapshot);
 assert.ok(JSON.stringify(before.content).includes('P116_TEXT_BEGIN')&&JSON.stringify(before.content).includes('P116_TEXT_END'),'P116 synthetic source text must be persisted before preview checks');
 assert.equal(fullV2Before.assets.length,1,'P116 must start with exactly one persisted synthetic PNG');
 assert.equal(fullV2Before.assets[0].originalName,'p116-layout.png');
 assert.equal(fullV2Before.assets[0].blobBase64,p116PngBase64,'V2 must store the exact source PNG bytes');
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

 const geometry=[];
 const layoutSignature=()=>evaluate("(()=>{const p=document.querySelector('.project-paper'),h=p.querySelector('.document-heading'),s=p.querySelector('.document-section'),sh=s?.querySelector('h2'),b=p.querySelector('.block-prose');const a=getComputedStyle(p),c=getComputedStyle(h),d=s&&getComputedStyle(s),e=sh&&getComputedStyle(sh),f=b&&getComputedStyle(b);return{paper:[a.paddingTop,a.paddingRight,a.paddingBottom,a.paddingLeft,a.lineHeight],title:[c.textAlign,c.fontSize,c.lineHeight,c.marginTop,c.marginBottom,c.paddingTop,c.paddingRight,c.paddingBottom,c.paddingLeft,c.borderTopWidth,c.borderRightWidth,c.borderBottomWidth,c.borderLeftWidth],section:[d?.marginBottom,d?.paddingTop,d?.paddingRight,d?.paddingBottom,d?.paddingLeft,e?.fontSize,e?.textAlign,e?.lineHeight,e?.marginBottom,e?.paddingTop,e?.paddingRight,e?.paddingBottom,e?.paddingLeft,e?.borderTopWidth,e?.borderRightWidth,e?.borderBottomWidth,e?.borderLeftWidth],body:[f?.fontSize,f?.lineHeight]}})()");
 const auditLayout=async id=>{
  const screen=await evaluate("(()=>{const p=document.querySelector('.project-paper'),r=p.getBoundingClientRect(),nodes=[...p.querySelectorAll('.document-heading,.document-section,.document-section h2,.block-prose,.document-figure,.document-figure img')];return{imageCount:p.querySelectorAll('.document-figure img').length,imagesLoaded:[...p.querySelectorAll('.document-figure img')].every(i=>i.complete&&i.naturalWidth>0),overflow:nodes.filter(n=>{const b=n.getBoundingClientRect();return b.left<r.left-1||b.right>r.right+1||(n.clientWidth>0&&n.scrollWidth>n.clientWidth+1)}).map(n=>n.className||n.tagName)}})()");
  assert.equal(screen.imageCount,1,id+' visible PNG count');
  assert.equal(screen.imagesLoaded,true,id+' image decode');
  assert.deepEqual(screen.overflow,[],id+' browser preview horizontal clipping');
  const pdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
  const bytes=Buffer.from(pdf.data,'base64');
  assert.equal(bytes.subarray(0,5).toString(),'%PDF-',id+' real browser PDF signature');
  const output=join(profile,'p116-'+id+'.pdf');writeFileSync(output,bytes);
  const info=execFileSync('pdfinfo',[output],{encoding:'utf8'});
  assert.match(info,/Page size:\s+[0-9.]+ x [0-9.]+ pts \(A4\)/,id+' A4 page dimensions');
  const pageCount=Number(/Pages:\s+(\d+)/.exec(info)?.[1]);
  assert.ok(pageCount>=2,id+' long source must paginate without dropping the final content');
  const extracted=execFileSync('pdftotext',[output,'-'],{encoding:'utf8'});
  const normalizeText=value=>value.replace(/[\s\u00a0]+/gu,' ').trim();
  assert.ok(normalizeText(extracted).includes(normalizeText(p116Body)),id+' full source text order/content');
  for(const marker of p116Markers)assert.equal(normalizeText(extracted).split(marker).length-1,1,id+' exactly one '+marker);
  assert.equal(normalizeText(extracted).split('P116_TEXT_BEGIN').length-1,1,id+' opening source marker');
  assert.equal(normalizeText(extracted).split('P116_TEXT_END').length-1,1,id+' final source marker');
  const imageList=execFileSync('pdfimages',['-list',output],{encoding:'utf8'});
  const rasterCount=(imageList.match(/^\s*\d+\s+\d+\s+image\b/gmu)||[]).length;
  assert.ok(rasterCount>=1,id+' actual PDF must embed the source PNG');
  const bbox=execFileSync('pdftotext',['-bbox',output,'-'],{encoding:'utf8'});
  const pages=[...bbox.matchAll(/<page\b([^>]*)>([\s\S]*?)<\/page>/gu)];
  assert.equal(pages.length,pageCount,id+' bounding-box page count');
  const pdfGeometry=[];
  for(let pageIndex=0;pageIndex<pages.length;pageIndex++){
   const [,attributes,body]=pages[pageIndex];
   const width=Number(/width="([\d.]+)"/u.exec(attributes)?.[1]);
   const height=Number(/height="([\d.]+)"/u.exec(attributes)?.[1]);
   assert.ok(Math.abs(width-595.28)<1&&Math.abs(height-841.89)<1,id+' page '+(pageIndex+1)+' A4 media box');
   const words=[...body.matchAll(/<word\b([^>]*)>([\s\S]*?)<\/word>/gu)].map(match=>{
    const attrs=match[1];return{text:match[2].replace(/<[^>]*>/gu,'').trim(),xMin:Number(/xMin="([\d.]+)"/u.exec(attrs)?.[1]),yMin:Number(/yMin="([\d.]+)"/u.exec(attrs)?.[1]),xMax:Number(/xMax="([\d.]+)"/u.exec(attrs)?.[1]),yMax:Number(/yMax="([\d.]+)"/u.exec(attrs)?.[1])};
   }).sort((a,b)=>a.yMin-b.yMin||a.xMin-b.xMin);
   pdfGeometry.push(words.map(word=>[word.xMin,word.yMin,word.xMax,word.yMax].map(value=>Math.round(value*10)/10)));
   assert.ok(words.length>0,id+' page '+(pageIndex+1)+' has readable text');
   for(const word of words)assert.ok(word.xMin>=-0.5&&word.yMin>=-0.5&&word.xMax<=width+0.5&&word.yMax<=height+0.5,id+' text clipped outside page '+(pageIndex+1));
   for(let wi=0;wi<words.length;wi++)for(let wj=wi+1;wj<words.length;wj++){
    const a=words[wi],b=words[wj];if(b.yMin>=a.yMax)break;
    const overlapX=Math.min(a.xMax,b.xMax)-Math.max(a.xMin,b.xMin);
    const overlapY=Math.min(a.yMax,b.yMax)-Math.max(a.yMin,b.yMin);
    assert.ok(!(overlapX>1&&overlapY>1),id+' overlapping PDF text boxes on page '+(pageIndex+1));
   }
  }
  return{pageCount,rasterCount,pdfGeometry:JSON.stringify(pdfGeometry)};
 };
  assert.equal(await evaluate("document.querySelector('[data-style-compare-toggle]')?.textContent.includes('8개 디자인 비교')"),true);
  await evaluate("document.querySelector('[data-style-compare-toggle]').click()");
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-style-compare-theme]'))"));
  const basicThemeIds=await evaluate("Array.from(document.querySelectorAll('[data-style-compare-theme]')).map(button=>button.dataset.styleCompareTheme)");
  assert.deepEqual(basicThemeIds,['report','minimal','diary','compact','editorial','ledger','brief','folio'],'BASIC must contain the original eight themes');
 for(const id of basicThemeIds){
  await evaluate("document.querySelector('[data-style-compare-theme="+JSON.stringify(id)+"]').click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.classList.contains("+JSON.stringify('paper-theme-'+id)+")"));
  const measured=await auditLayout(id);
  geometry.push(JSON.stringify(await layoutSignature())+measured.pdfGeometry);
 }
 assert.equal(new Set(geometry).size,8,'Original BASIC themes must have eight distinct structural, not palette-only, signatures');
 const advancedList=await evaluate("Array.from(document.querySelectorAll('[data-extended-layout-id]')).map(button=>button.dataset.extendedLayoutId)");
 assert.equal(advancedList.length,22);
 assert.equal(advancedList.filter(id=>id.startsWith('pro-')).length,12,'PRO must retain exactly twelve layouts');
 assert.equal(advancedList.filter(id=>id.startsWith('business-')).length,10,'BUSINESS must retain exactly ten layouts');
  const advancedPrior=await evaluate(stored);
 for(const id of advancedList){
  await evaluate("document.querySelector('[data-extended-layout-id="+JSON.stringify(id)+"]').click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),value=>value===id);
  const measured=await auditLayout(id);
  geometry.push(JSON.stringify(await layoutSignature())+measured.pdfGeometry);
 }
 assert.equal(new Set(geometry).size,30,'All eight BASIC and 22 PRO/BUSINESS PDFs must have distinct structural signatures; color-only variants do not count');
 assert.deepEqual(await evaluate(stored),before,'Thirty real PDF previews cannot modify V2 document content or design');
 assert.deepEqual(await evaluate(fullV2Snapshot),fullV2Before,'Thirty previews must preserve every V2 store and the exact source PNG bytes');
 console.log('PASS P116 LAYOUT MATRIX: BASIC 8 + PRO 12 + BUSINESS 10 = 30/30 structurally distinct actual Chrome/Edge A4 PDFs; full text/order, all 40 markers, PNG bytes, V2 stores, page bounds and text-overlap checks PASS');
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


 // P94 BUSINESS branded letterhead is opt-in, has A4 output, and does not modify stored V2.
 await evaluate("document.querySelector('[data-extended-layout-id=business-01]').click()");
 await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),x=>x==='business-01');
 await evaluate("(()=>{const i=document.querySelector('[data-business-brand-name]');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(i,'합성 테스트 회사');i.dispatchEvent(new Event('input',{bubbles:true}));})()");
 await evaluate("document.querySelector('[data-business-brand-apply]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-business-brand-header]')?.textContent"),x=>x?.includes('합성 테스트 회사'));
 assert.deepEqual(await evaluate(stored),advancedPrior,'Brand preview must not mutate saved V2');
 const brandedOutput=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
 const brandedBytes=Buffer.from(brandedOutput.data,'base64');assert.equal(brandedBytes.subarray(0,5).toString(),'%PDF-');
 const brandedPath=join(profile,'business-branded-a4.pdf');writeFileSync(brandedPath,brandedBytes);
 assert.match(execFileSync('pdfinfo',[brandedPath],{encoding:'utf8'}),/Page size:\s+[0-9.]+ x [0-9.]+ pts \(A4\)/);
 await evaluate("document.querySelector('[data-business-brand-export]').click()");
 const brandedJson=await evaluate("(async()=>await window.__astraPresetBlob.text())()");
 assert.equal(JSON.parse(brandedJson).kit.name,'합성 테스트 회사');
 assert.doesNotMatch(brandedJson,/sourcePdf|assetId|base64|sections/);
 await evaluate("document.querySelector('[data-business-brand-clear]').click()");
 await eventually(()=>evaluate("!document.querySelector('[data-business-brand-header]')"));
 await evaluate("(()=>{const f=new File(["+JSON.stringify(brandedJson)+"],'brand.json',{type:'application/json'});const d=new DataTransfer();d.items.add(f);const i=document.querySelector('[data-business-brand-file]');i.files=d.files;i.dispatchEvent(new Event('change',{bubbles:true}));})()");
 await eventually(()=>evaluate("document.querySelector('[data-business-brand-header]')?.textContent"),x=>x?.includes('합성 테스트 회사'));
 assert.deepEqual(await evaluate(stored),advancedPrior,'Brand JSON import must not mutate saved V2');
 await evaluate("document.querySelector('[data-business-brand-clear]').click()");
 await evaluate("document.querySelector('[data-extended-layout-cancel]').click()");

 // P97 permanent independent PRO layout library: explicit save/reload/restore, no V2 mutation.
 await evaluate("document.querySelector('[data-extended-layout-id=pro-03]').click()");
 await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),v=>v==='pro-03');
 await evaluate("document.querySelector('[data-pro-layout-save]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-pro-layout-count]')?.textContent.includes('1/24')"));
 const storedPro=await evaluate("localStorage.getItem('astra.pro-layout-library.v1')");
 assert.equal(JSON.parse(storedPro).items[0].layoutId,'pro-03');
 assert.deepEqual(await evaluate(stored),advancedPrior,'Stored layout ID must not mutate saved document');
 await evaluate("document.querySelector('[data-extended-layout-cancel]').click()");
 await evaluate("document.querySelector('[data-pro-layout-restore]').click()");
 await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),v=>v==='pro-03');
 assert.deepEqual(await evaluate(stored),advancedPrior);
 console.log('PASS P97 PRO LIBRARY: local saved ID and preview restore independent of V2 document');
 // P98 BUSINESS local saved kit, only explicit user action, V2 unchanged.
 await evaluate("document.querySelector('[data-extended-layout-id=business-01]').click()");
 await eventually(()=>evaluate("document.querySelector('.project-paper')?.dataset.advancedLayout"),v=>v==='business-01');
 await evaluate("(()=>{const i=document.querySelector('[data-business-brand-name]');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(i,'테스트 브랜드');i.dispatchEvent(new Event('input',{bubbles:true}));})()");
 await evaluate("document.querySelector('[data-business-brand-apply]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-business-brand-header]')?.textContent.includes('테스트 브랜드')"));
 await evaluate("document.querySelector('[data-business-library-save]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-business-library-count]')?.textContent.includes('1/12')"));
 const savedBusiness=await evaluate("JSON.parse(localStorage.getItem('astra.business-brand-library.v1'))");
 assert.equal(savedBusiness.items[0].kit.name,'테스트 브랜드');
 assert.equal(JSON.stringify(savedBusiness).includes('sourcePdf'),false);
 await evaluate("document.querySelector('[data-business-brand-clear]').click()");
 await eventually(()=>evaluate("!document.querySelector('[data-business-brand-header]')"));
 await evaluate("document.querySelector('[data-business-library-restore]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-business-brand-header]')?.textContent.includes('테스트 브랜드')"));
 assert.deepEqual(await evaluate(stored),advancedPrior,'Business saved text must preserve V2 document');
 console.log('PASS P98 BUSINESS LIBRARY: text-only local save/restore and original V2 unchanged');

 console.log('PASS P93 PRO/BUSINESS 22/22: unique DOM geometries, every A4 PDF output audited, V2 unchanged');
 console.log('PASS STEP4 PORTABLE STYLE: file export/import, transient preview/cancel, apply/undo, A4 PDF, tamper and original V2 preservation');
}finally{
 try{ws?.close();}catch{}
 await browser.close().catch(()=>{});
 try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
 catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;}
}
