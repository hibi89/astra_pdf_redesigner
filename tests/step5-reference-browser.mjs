// Local-only STEP5 reference analysis/apply/cancel regression in real Chromium or Edge.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-step5-reference-'));
const browser=launchBrowser(binary,profile,'STEP5 local references');
let ws,sequence=0;
const pending=new Map();
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=x=>Boolean(x),timeout=20000){
  const end=Date.now()+timeout;let last;
  while(Date.now()<end){last=await fn();if(predicate(last))return last;await pause(125);}
  throw Error('STEP5 browser timeout: '+JSON.stringify(last));
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
  const send=(method,params)=>request(method,params,sessionId);
  await send('Page.enable');await send('Runtime.enable');
  const evaluate=async(expression)=>{
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await eventually(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active')&&document.querySelector('.project-paper'))"));
  const stored="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const id=await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return await new Promise((resolve,reject)=>{const r=db.transaction('documents','readonly').objectStore('documents').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{db.close()}})()";
  const before=await eventually(()=>evaluate(stored),doc=>Boolean(doc?.id&&doc?.design&&doc?.content));
  // STEP6 opt-in browser navigation: no search links before consent, only manually supplied terms.
  assert.equal(await evaluate("document.querySelectorAll('[data-step6-google],[data-step6-bing]').length"),0);
  await evaluate("(()=>{const i=document.querySelector('[data-step6-query]');const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;set.call(i,'보고서 A4 디자인');i.dispatchEvent(new Event('input',{bubbles:true}));})()");
  assert.equal(await evaluate("document.querySelectorAll('[data-step6-google],[data-step6-bing]').length"),0,'No external links before consent');
  await evaluate("document.querySelector('[data-step6-consent]').click()");
  const referenceLinks=await eventually(()=>evaluate("(()=>{const a=document.querySelector('[data-step6-google]'),b=document.querySelector('[data-step6-bing]');return a&&b?{google:a.href,bing:b.href,rel:a.rel,target:a.target}:null})()"));
  assert.equal(new URL(referenceLinks.google).hostname,'www.google.com');
  assert.equal(new URL(referenceLinks.bing).hostname,'www.bing.com');
  assert.equal(new URL(referenceLinks.google).searchParams.get('q'),'보고서 A4 디자인');
  assert.equal(referenceLinks.target,'_blank');assert.match(referenceLinks.rel,/noopener/);
  await evaluate("(()=>{const i=document.querySelector('[data-step6-query]');const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;set.call(i,'브랜드 템플릿');i.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await eventually(()=>evaluate("document.querySelectorAll('[data-step6-google],[data-step6-bing]').length"),x=>x===0);
  assert.deepEqual((await evaluate(stored)).content,before.content,'STEP6 search must not modify persisted document content');
  assert.deepEqual((await evaluate(stored)).design,before.design,'STEP6 search must not modify persisted design');

  const projectFingerprint=async(includeUpdatedAt=true)=>evaluate("(async()=>{const includeUpdatedAt="+(includeUpdatedAt?"true":"false")+";const db=await new Promise((resolve,reject)=>{const request=indexedDB.open('astra-pdf-redesigner:v2');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});try{const tx=db.transaction(['documents','assets','meta'],'readonly');const done=new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});const read=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});const [documents,assets,keys,values,active]=await Promise.all([read(tx.objectStore('documents').getAll()),read(tx.objectStore('assets').getAll()),read(tx.objectStore('meta').getAllKeys()),read(tx.objectStore('meta').getAll()),read(tx.objectStore('meta').get('activeDocumentId'))]);await done;const documentRows=documents.map(document=>{const copy=structuredClone(document);if(!includeUpdatedAt)copy.updatedAt=null;return copy}).sort((a,b)=>a.id.localeCompare(b.id));const assetRows=await Promise.all(assets.sort((a,b)=>a.id.localeCompare(b.id)).map(async asset=>({id:asset.id,documentId:asset.documentId,name:asset.name,type:asset.blob.type,size:asset.blob.size,sha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await asset.blob.arrayBuffer()))).map(value=>value.toString(16).padStart(2,'0')).join('')})));const metaRows=keys.map((key,index)=>({key,value:values[index]})).sort((a,b)=>String(a.key).localeCompare(String(b.key)));return JSON.stringify({active,documents:documentRows,assets:assetRows,meta:metaRows})}finally{db.close()}})()");
  const metricValues=text=>{
    const values=(text??'').match(/\d+/g)?.map(Number)??[];
    assert.equal(values.length,6,'Expected whitespace, density and four margin percentages: '+text);
    assert.ok(values.every(value=>Number.isFinite(value)&&value>=0&&value<=100),'Metrics must be finite percentages');
    return values;
  };
  const uploadImage=async(name='vector-like')=>evaluate("(async()=>{const name="+JSON.stringify(name)+";const canvas=document.createElement('canvas');canvas.width=120;canvas.height=160;const c=canvas.getContext('2d');const white=()=>{c.fillStyle='#fff';c.fillRect(0,0,120,160)};switch(name){case 'scan-like':white();c.fillStyle='#252525';for(let y=12,row=0;y<150;y+=12,row++){c.fillRect(8+(row%3),y,104,5);for(let x=12;x<70;x+=18)c.fillRect(x,y+1,7,3)}break;case 'vector-like':white();c.fillStyle='#3f644d';c.fillRect(12,10,96,40);c.fillStyle='#252525';for(let y=62;y<145;y+=14)c.fillRect(12,y,78-(y%3)*4,4);break;case 'wide-whitespace':white();c.fillStyle='#202020';c.fillRect(42,56,36,48);break;case 'dense':c.fillStyle='#252525';c.fillRect(0,0,120,160);break;case 'margin-heavy':white();c.fillStyle='#202020';c.fillRect(30,32,60,96);break;case 'korean':white();c.fillStyle='#202020';c.font='18px sans-serif';c.fillText('한글 원문 2026',10,42);c.fillText('표와 여백 확인',10,80);c.fillText('문서 보존 테스트',10,118);c.fillRect(10,132,70,3);break;case 'transparent':c.fillStyle='#202020';c.fillRect(30,40,60,80);break;case 'low-contrast':white();c.fillStyle='#dedede';c.fillRect(20,20,80,120);break;default:throw new Error('Unknown synthetic reference '+name)}const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const file=new File([blob],name+'.png',{type:'image/png'});const digest=async item=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await item.arrayBuffer()))).map(value=>value.toString(16).padStart(2,'0')).join('');window.__astraReferenceOriginalFile=file;window.__astraReferenceOriginalHash=await digest(file);const transfer=new DataTransfer();transfer.items.add(file);const input=document.querySelector('.reference-style-panel input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));return{size:file.size,sha256:window.__astraReferenceOriginalHash}})()");
  const readFileFingerprint=()=>evaluate("(async()=>{const file=window.__astraReferenceOriginalFile;if(!file)throw Error('Missing held reference file');const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))).map(value=>value.toString(16).padStart(2,'0')).join('');return{size:file.size,sha256:hash}})()");
  const clearReference=async()=>{
    await evaluate("document.querySelector('.reference-style-panel [data-reference-analysis] .text-button').click()");
    await eventually(()=>evaluate("!document.querySelector('[data-reference-analysis]')"));
  };
  const referenceCases=[
    {name:'scan-like',white:[65,100],density:[0,35],margins:[[0,20],[0,20],[0,20],[0,20]],theme:'minimal'},
    {name:'vector-like',white:[65,100],density:[0,35],margins:[[0,20],[0,20],[0,25],[0,20]],theme:'minimal',accent:'#3f644d'},
    {name:'wide-whitespace',white:[90,100],density:[0,10],margins:[[30,40],[30,40],[30,40],[30,40]],theme:'minimal'},
    {name:'dense',white:[0,0],density:[100,100],margins:[[0,0],[0,0],[0,0],[0,0]],theme:'compact'},
    {name:'margin-heavy',white:[65,75],density:[25,35],margins:[[15,25],[20,30],[15,25],[20,30]],theme:'minimal'},
    {name:'korean',white:[65,100],density:[0,35],margins:[[0,25],[0,25],[0,25],[0,25]],theme:'minimal'},
    {name:'transparent',white:[65,75],density:[25,35],margins:[[20,30],[20,30],[20,30],[20,30]],theme:'minimal'},
    {name:'low-contrast',white:[45,55],density:[45,55],margins:[[10,15],[15,20],[10,15],[15,20]],theme:'minimal'},
  ];
  const projectBeforeReferences=await projectFingerprint(true);
  for(const sample of referenceCases){
    if(document.querySelector('[data-reference-analysis]'))await clearReference();
    const originalFile=await uploadImage(sample.name);
    await eventually(()=>evaluate("Boolean(document.querySelector('[data-reference-analysis]'))"));
    await eventually(()=>evaluate("document.querySelector('.project-paper')?.classList.contains('paper-theme-"+sample.theme+"')"));
    const values=metricValues(await evaluate("document.querySelector('.reference-analysis .reference-metrics')?.textContent"));
    for(const [index,range] of [sample.white,sample.density,...sample.margins].entries()){
      assert.ok(values[index]>=range[0]&&values[index]<=range[1],sample.name+' metric '+index+' expected '+range.join('-')+'%, received '+values[index]+'%');
    }
    if(sample.accent)assert.equal(await evaluate("getComputedStyle(document.querySelector('.project-paper')).getPropertyValue('--accent').trim()"),sample.accent);
    assert.equal(await projectFingerprint(true),projectBeforeReferences,sample.name+' preview must not write any V2 document, asset, active ID or metadata bytes');
    assert.deepEqual(await readFileFingerprint(),originalFile,sample.name+' source File bytes must remain unchanged');
  }
  console.log('PASS P118 IMAGE MATRIX: 8 synthetic scan/vector/whitespace/dense/margin/Korean/transparent/low-contrast references; bounded metrics, accent, source SHA-256 and complete V2 store unchanged');
  await uploadImage();
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-reference-analysis]'))"));

  // A local STEP5 reference can be exported as a bounded STEP4 preset without raw reference pixels/PDF text.
  const exportedReference=await evaluate("(async()=>{const original=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{if(blob.type==='application/json')window.__astraReferencePreset=blob;return original(blob);};const click=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download==='astra-style-preset.json')return;return click.call(this);};document.querySelector('[data-step5-reference-preset-export]').click();return await window.__astraReferencePreset.text()})()");
  const portable=JSON.parse(exportedReference);
  assert.equal(portable.format,'astra-style-preset');
  assert.equal(portable.design.theme,'minimal');
  assert.equal(portable.design.accent,'#3f644d');
  assert.deepEqual(Object.keys(portable.design).sort(),['accent','font','textSize','theme']);
  assert.doesNotMatch(exportedReference,/reference.png|reference.pdf|private|imageData|sourceTextItems/);
  const previewState=await evaluate(stored);
  assert.deepEqual(previewState.content,before.content);assert.deepEqual(previewState.design,before.design);
  await evaluate("document.querySelector('.reference-style-panel .text-button').click()");
  assert.equal(await evaluate("document.querySelector('.project-paper')?.classList.contains('paper-theme-minimal')"),false);
  await uploadImage();await eventually(()=>evaluate("Boolean(document.querySelector('[data-reference-analysis]'))"));
  const applyState=await evaluate("(()=>{const button=[...document.querySelectorAll('.reference-style-panel button')].find(button=>button.textContent==='제안 적용');if(!button)throw Error('missing apply button');const state={disabled:button.disabled,preview:document.querySelector('.project-paper')?.className};button.click();return state})()");
  assert.equal(applyState.disabled,false,'Reference apply button should be enabled: '+JSON.stringify(applyState));
  const applied=await eventually(()=>evaluate(stored),doc=>doc?.design?.accent==='#3f644d'&&doc?.design?.theme==='minimal').catch(async error=>{throw Error(error.message+'; before='+JSON.stringify(before.design)+'; after='+JSON.stringify(await evaluate(stored))+'; applyState='+JSON.stringify(applyState));});
  assert.deepEqual(applied.content,before.content,'Applying reference design must preserve source content');
  const pdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
  const pdfBytes=Buffer.from(pdf.data,'base64');assert.equal(pdfBytes.subarray(0,5).toString(),'%PDF-');assert.ok(pdfBytes.length>1000);
  await evaluate("[...document.querySelectorAll('.reference-style-panel button')].find(button=>button.textContent==='직전 디자인 적용 취소').click()");
  const undone=await eventually(()=>evaluate(stored),doc=>JSON.stringify(doc?.design)===JSON.stringify(before.design));
  assert.deepEqual(undone.content,before.content);
  const projectBeforePdf=await projectFingerprint(true);
  const pdf64=Buffer.from(makeMixedLayoutPdf()).toString('base64');
  const pdfUploadInfo=await evaluate("(async()=>{const data=Uint8Array.from(atob("+JSON.stringify(pdf64)+"),c=>c.charCodeAt(0));const file=new File([data],'reference.pdf',{type:'application/pdf'});window.__astraReferenceOriginalFile=file;const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))).map(value=>value.toString(16).padStart(2,'0')).join('');window.__astraReferenceOriginalHash=sha256;const transfer=new DataTransfer();transfer.items.add(file);const input=document.querySelector('.reference-style-panel input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));return{size:file.size,sha256}})()");
  await eventually(()=>evaluate("document.querySelector('.reference-style-panel select')?.options.length"),count=>count===2);
  const pdfPages=[];
  for(const page of ['1','2']){
    if(page==='2')await evaluate("(()=>{const select=document.querySelector('.reference-style-panel select'),set=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;set.call(select,'2');select.dispatchEvent(new Event('change',{bubbles:true}));})()");
    await eventually(()=>evaluate("document.querySelector('.reference-image-row strong')?.textContent"),name=>name?.includes(page+'페이지'));
    await eventually(()=>evaluate("Number(document.querySelector('[data-reference-pdf-text-count]')?.getAttribute('data-reference-pdf-text-count'))"),count=>count>0);
    const pageMetrics=metricValues(await evaluate("document.querySelector('.reference-analysis .reference-metrics')?.textContent"));
    assert.ok(pageMetrics.every(value=>value>=0&&value<=100),'PDF page metrics remain bounded');
    const textCount=await evaluate("Number(document.querySelector('[data-reference-pdf-text-count]')?.getAttribute('data-reference-pdf-text-count'))");
    pdfPages.push({page,textCount,metrics:pageMetrics});
    assert.equal(await projectFingerprint(true),projectBeforePdf,'PDF page analysis must preserve the complete V2 store');
    assert.deepEqual(await readFileFingerprint(),pdfUploadInfo,'PDF source bytes must remain unchanged during page selection');
  }
  const pdfTextCount=pdfPages[1].textCount;
  assert.ok(pdfTextCount>0,'Embedded PDF text analysis should be available when the selected page contains selectable text');
  assert.ok(await evaluate("document.querySelector('.reference-pdf-typography')?.textContent.includes('OCR은 수행하지 않습니다')"),'PDF analysis must disclose that it does not OCR scanned pixels');
  const afterPdfAnalysis=await evaluate(stored);
  assert.deepEqual(afterPdfAnalysis.content,before.content,'PDF reference analysis must preserve source content');
  await evaluate("document.querySelector('.reference-style-panel .text-button').click()");
  assert.deepEqual((await evaluate(stored)).design,before.design,'Cancel must leave persisted design unchanged');
  const malformedPdf=Buffer.from('%PDF-1.7\nSynthetic malformed reference without objects or xref','ascii').toString('base64');
  const malformedInfo=await evaluate("(async()=>{const bytes=Uint8Array.from(atob("+JSON.stringify(malformedPdf)+"),c=>c.charCodeAt(0));const file=new File([bytes],'malformed.pdf',{type:'application/pdf'});window.__astraReferenceOriginalFile=file;const sha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))).map(value=>value.toString(16).padStart(2,'0')).join('');window.__astraReferenceOriginalHash=sha256;const transfer=new DataTransfer();transfer.items.add(file);const input=document.querySelector('.reference-style-panel input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));return{size:file.size,sha256}})()");
  const malformedAlert=await eventually(()=>evaluate("document.querySelector('.reference-style-panel [role=alert]')?.textContent"),message=>Boolean(message));
  assert.ok(malformedAlert.trim().length>0,'Malformed PDF must explain the failed analysis');
  assert.equal(await evaluate("Boolean(document.querySelector('[data-reference-analysis]'))"),false,'Malformed PDF must fail closed without a preview or apply action');
  assert.equal(await projectFingerprint(true),projectBeforePdf,'Malformed PDF must leave the complete STEP2 V2 project store unchanged');
  assert.deepEqual(await readFileFingerprint(),malformedInfo,'Malformed source PDF bytes must remain unchanged');
  console.log('PASS P118 MULTIPAGE/FAIL-CLOSED: both synthetic PDF pages analyzed without OCR, V2 store unchanged, malformed PDF rejected');


  // P100: owner-curated source metadata is isolated from IndexedDB and any network fetching.
  await evaluate("(()=>{for(const [selector,value] of [['[data-step6-source-title]','합성 소스'],['[data-step6-source-url]','https://example.org/gallery'],['[data-step6-source-note]','권리 미확인']]){const i=document.querySelector(selector),proto=i.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(i,value);i.dispatchEvent(new Event('input',{bubbles:true}));}})()");
  await evaluate("document.querySelector('[data-step6-source-add]').click()");
  await eventually(()=>evaluate("document.querySelector('[data-step6-source-count]')?.textContent.includes('1/20')"));
  const sources=await evaluate("JSON.parse(localStorage.getItem('astra.step6.sources.v1')).items");
  assert.equal(sources.length,1);
  assert.equal(sources[0].rights,'UNVERIFIED');
  assert.equal(sources[0].sourceUrl,'https://example.org/gallery');
  assert.deepEqual((await evaluate(stored)).content,before.content);
  assert.deepEqual((await evaluate(stored)).design,before.design);
  console.log('PASS P100 STEP6 SOURCE: local-only manually entered source record, rights UNVERIFIED, V2 unchanged');
  console.log('PASS STEP5: local image and selectable PDF-page analysis, A4 PDF output, transient preview, cancel, apply/undo and content preservation');
}finally{
  try{ws?.close();}catch{}
  await browser.close().catch(()=>{});
  try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
  catch(error){
    if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP5: Chromium temporary profile cleanup deferred ('+error.code+')');
  }
}
