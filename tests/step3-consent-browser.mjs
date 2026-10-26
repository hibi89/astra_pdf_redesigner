// M09-A real Chrome/Edge approval-invalidation regression with synthetic PDF only.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import fixture from '../desktop/step3-scanned-fixture.cjs';

const {makeScannedPagesPdf,SCAN_MARKERS}=fixture;
const profile=mkdtempSync(join(tmpdir(),'astra-m09a-'));
const browser=launchBrowser(process.env.CHROME_PATH||'chromium',profile,'M09-A review approval');
let ws,sequence=0;const waiting=new Map();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const approvalSelector='.step3-import-panel > label.step3-confirm input';
const saveExpression="[...document.querySelectorAll('.step3-import-panel button')].find(b=>b.textContent.includes('검수 결과를 새 문서로 저장'))";
async function eventually(fn,check=x=>Boolean(x),ms=45000){
  const until=Date.now()+ms;let last;
  while(Date.now()<until){last=await fn();if(check(last))return last;await pause(160);}
  throw Error('M09-A timeout: '+JSON.stringify(last));
}
try{
  ws=await browser.connect();
  ws.addEventListener('message',event=>{
    const data=JSON.parse(event.data);
    if(data.id&&waiting.has(data.id)){
      const w=waiting.get(data.id);waiting.delete(data.id);
      if(data.error)w.reject(Error(data.error.message));else w.resolve(data.result);
    }
  });
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const id=++sequence;waiting.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await send('Target.createTarget',{
    url:process.env.SMOKE_URL||'http://127.0.0.1:4173'});
  const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const evaluate=async expression=>{
    const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);
    if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  await send('Runtime.enable',{},sessionId);
  await send('Page.enable',{},sessionId);
  await eventually(()=>evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]')&&document.querySelector('.doc-list-item.active'))"));
  const original=await evaluate("(()=>({count:document.querySelectorAll('.doc-list-item').length,active:document.querySelector('.doc-list-item.active strong')?.textContent}))()");
  assert.ok(original.count>=1&&original.active);
  const pdf=makeScannedPagesPdf({selectableSecondPage:true});
  const upload=async(name)=>evaluate("(()=>{const bytes=Uint8Array.from(atob("+
    JSON.stringify(pdf.toString('base64'))+"),c=>c.charCodeAt(0));"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "const transfer=new DataTransfer();transfer.items.add(new File([bytes],"+
    JSON.stringify(name)+",{type:'application/pdf'}));"+
    "input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  const ready=async()=>eventually(()=>evaluate("(()=>({text:document.querySelector('.step3-import-panel')?.textContent,blocks:document.querySelectorAll('.step3-block-review textarea').length}))()"),
    x=>x?.text?.includes(SCAN_MARKERS.first)&&x.text.includes(SCAN_MARKERS.end)&&x.blocks>0);
  const assertUnapproved=async label=>{
    const x=await eventually(()=>evaluate("(()=>({checked:document.querySelector("+JSON.stringify(approvalSelector)+")?.checked,saveDisabled:("+saveExpression+")?.disabled}))()"),
      x=>x?.checked===false&&x.saveDisabled===true);
    assert.equal(x.checked,false,label+' consent must be revoked');
    assert.equal(x.saveDisabled,true,label+' save must require fresh review approval');
  };
  await upload('m09a-review-source.pdf');
  await ready();
  await evaluate("document.querySelector("+JSON.stringify(approvalSelector)+").click()");
  assert.equal(await evaluate("document.querySelector("+JSON.stringify(approvalSelector)+").checked"),true);
  assert.equal(await evaluate("("+saveExpression+").disabled"),false);
  // Native prototype setter ensures React detects synthetic user input.
  await evaluate("(()=>{const area=document.querySelector('.step3-block-review textarea');"+
    "const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;"+
    "set.call(area,area.value+' M09A_EDITED');area.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await assertUnapproved('body edit');

  await evaluate("document.querySelector("+JSON.stringify(approvalSelector)+").click()");
  await evaluate("(()=>{const select=document.querySelector('.step3-block-review select');"+
    "select.value=select.value==='caption'?'paragraph':'caption';"+
    "select.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await assertUnapproved('classification edit');

  // The second text line is a separate fragment; test order changes if available.
  const moveCount=await evaluate("document.querySelectorAll('.step3-block-review button[aria-label$=\"아래로 이동\"]:not(:disabled)').length");
  if(moveCount>0){
    await evaluate("document.querySelector("+JSON.stringify(approvalSelector)+").click()");
    await evaluate("document.querySelector('.step3-block-review button[aria-label$=\"아래로 이동\"]:not(:disabled)').click()");
    await assertUnapproved('reading-order edit');
  }
  await evaluate("document.querySelector("+JSON.stringify(approvalSelector)+").click()");
  assert.equal(await evaluate("("+saveExpression+").disabled"),false);
  // Rejected drop must clear the previously accepted source rather than
  // leaving a stale, saveable draft under the invalid replacement error.
  await evaluate("(()=>{const d=new DataTransfer();d.items.add(new File(['invalid'],'bad.txt',{type:'text/plain'}));"+
    "document.querySelector('[data-m06b-dropzone]').dispatchEvent("+
    "new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:d}));})()");
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel [role=alert]')?.textContent"),
    x=>x?.includes('확장자가 .pdf'));
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-block-review'))"),false);
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-import-panel iframe[src^=blob]'))"),false);
  assert.equal(await evaluate("Boolean("+saveExpression+")"),false);

  await upload('m09a-after-invalid-retry.pdf');
  await ready();
  await assertUnapproved('fresh source after invalid drop');
  await evaluate("([...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소'))).click()");
  await send('Page.reload',{ignoreCache:true},sessionId);
  const reloaded=await eventually(()=>evaluate("(()=>({count:document.querySelectorAll('.doc-list-item').length,active:document.querySelector('.doc-list-item.active strong')?.textContent}))()"),
    x=>x?.count===original.count&&Boolean(x.active));
  assert.deepEqual(reloaded,original,'Edits/rejected drop must not change saved V2 documents');
  console.log('PASS M09-A CHROME/EDGE REVIEW CONSENT: text/role'+(moveCount>0?'/order':'')+
    ' changes revoke approval; rejected drop clears stale approved draft; V2 preserved after reload');
}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(e){if(!['EBUSY','ENOTEMPTY','EPERM'].includes(e?.code))throw e;}
}
