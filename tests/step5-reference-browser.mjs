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
  const uploadImage=()=>evaluate(`(async()=>{const canvas=document.createElement('canvas');canvas.width=100;canvas.height=100;const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,100,100);c.fillStyle='#3f644d';c.fillRect(25,25,50,50);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const transfer=new DataTransfer();transfer.items.add(new File([blob],'reference.png',{type:'image/png'}));const input=document.querySelector('.reference-style-panel input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  await uploadImage();
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-reference-analysis]'))"));
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.classList.contains('paper-theme-minimal')"));
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
  const pdf64=Buffer.from(makeMixedLayoutPdf()).toString('base64');
  await evaluate(`(()=>{const data=Uint8Array.from(atob(${JSON.stringify(pdf64)}),c=>c.charCodeAt(0));const transfer=new DataTransfer();transfer.items.add(new File([data],'reference.pdf',{type:'application/pdf'}));const input=document.querySelector('.reference-style-panel input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  await eventually(()=>evaluate("document.querySelector('.reference-style-panel select')?.options.length"),count=>count===2);
  await evaluate("(()=>{const select=document.querySelector('.reference-style-panel select');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(select,'2');select.dispatchEvent(new Event('change',{bubbles:true}))})()");
  await eventually(()=>evaluate("document.querySelector('.reference-style-panel select')?.value"),page=>page==='2');
  await eventually(()=>evaluate("document.querySelector('.reference-image-row strong')?.textContent"),name=>name?.includes('2페이지'));
  const afterPdfAnalysis=await evaluate(stored);
  assert.deepEqual(afterPdfAnalysis.content,before.content,'PDF reference analysis must preserve source content');
  await evaluate("document.querySelector('.reference-style-panel .text-button').click()");
  assert.deepEqual((await evaluate(stored)).design,before.design,'Cancel must leave persisted design unchanged');
  console.log('PASS STEP5: local image and selectable PDF-page analysis, A4 PDF output, transient preview, cancel, apply/undo and content preservation');
}finally{
  try{ws?.close();}catch{}
  await browser.close().catch(()=>{});
  rmSync(profile,{recursive:true,force:true});
}
