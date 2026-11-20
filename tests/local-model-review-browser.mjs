// P122 synthetic Chrome/Edge UI E2E. No model, customer text or external service.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.LOCAL_MODEL_REVIEW_URL||'http://127.0.0.1:4173/tests/fixtures/local-model-review-harness.html';
const profile=mkdtempSync(join(tmpdir(),'astra-local-model-ui-'));
const browser=launchBrowser(binary,profile,'P122 local model review');
let ws,seq=0;
const pending=new Map(),external=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=x=>Boolean(x),timeout=45000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(predicate(last))return last;await pause(100);}
 throw Error('P122 UI timeout: '+JSON.stringify(last));
}
try{
 ws=await browser.connect();
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.method==='Network.requestWillBeSent'){
   const request=message.params?.request?.url||'';
   if(request.startsWith('http://')||request.startsWith('https://')){
    const target=new URL(request);
    if(target.hostname!=='127.0.0.1'&&target.hostname!=='localhost')external.push(request.slice(0,60));
   }
  }
  if(message.id&&pending.has(message.id)){
   const item=pending.get(message.id);pending.delete(message.id);
   if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
  }
 });
 const request=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const id=++seq;pending.set(id,{resolve,reject});
  ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
 const {targetId}=await request('Target.createTarget',{url});
 const {sessionId}=await request('Target.attachToTarget',{targetId,flatten:true});
 const send=(method,params={})=>request(method,params,sessionId);
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 const evaluate=async expression=>{
  const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(response.exceptionDetails)throw Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
 };
 const click=selector=>evaluate("document.querySelector("+JSON.stringify(selector)+")?.click()");
 const setSource=value=>evaluate("(()=>{const input=document.querySelector('[data-model-source]');"+
  "const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;"+
  "set.call(input,"+JSON.stringify(value)+");input.dispatchEvent(new Event('input',{bubbles:true}));"+
  "input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-local-model-harness]')&&document.querySelector('[data-local-ai-probe]'))"));
 assert.equal(await evaluate("document.querySelector('[data-local-ai-run]').disabled"),true,'run starts disabled');
 assert.equal(await evaluate("window.__astraModelMock.calls.length"),0,'no request before consent');
 await click('[data-local-ai-probe]');
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-local-ai-consent]'))"));
 assert.equal(await evaluate("document.querySelector('[data-local-ai-run]').disabled"),true,'consent required before run');
 await click('[data-local-ai-consent]');
 assert.equal(await evaluate("document.querySelector('[data-local-ai-run]').disabled"),false);
 await click('[data-local-ai-run]');
 await eventually(()=>evaluate("window.__astraModelMock.calls.length"),value=>value===1);
 assert.equal(await evaluate("window.__astraModelMock.calls[0].consent"),true);
 // A document/block switch with identical text still changes request scope. Its old response must die.
 await click('[data-change-scope]');
 await eventually(()=>evaluate("window.__astraModelMock.cancelCalls"),value=>value===1);
 assert.equal(await evaluate("document.querySelector('[data-model-value]').textContent"),'문서를 확인하였습니다.');
 await evaluate("window.__astraModelMock.resolve(0,{status:'proposal',suggested:'문서를 확인했습니다.',externalTransfer:false})");
 await pause(150);
 assert.equal(await evaluate("document.querySelector('[data-local-ai-proposal]')===null"),true,'same-text stale proposal stays hidden');
 assert.equal(await evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),0);
 // A changed source also invalidates an in-flight response.
 const changed='새 문서 2026년 11월 15일을 확인하였습니다.';
 await click('[data-local-ai-run]');
 await eventually(()=>evaluate("window.__astraModelMock.calls.length"),value=>value===2);
 assert.equal(await evaluate("window.__astraModelMock.calls[1].text"),'문서를 확인하였습니다.');
 await setSource(changed);
 await eventually(()=>evaluate("window.__astraModelMock.cancelCalls"),value=>value===2);
 await evaluate("window.__astraModelMock.resolve(1,{status:'proposal',suggested:'문서를 확인했습니다.',externalTransfer:false})");
 await pause(150);
 assert.equal(await evaluate("document.querySelector('[data-local-ai-proposal]')===null"),true,'changed-text stale proposal stays hidden');
 assert.equal(await evaluate("document.querySelector('[data-model-value]').textContent"),changed,'stale response preserves current source');
 assert.equal(await evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),0);
 // Fresh proposal is visible only as a before/after draft; applying requires the explicit user button.
 await click('[data-local-ai-run]');
 await eventually(()=>evaluate("window.__astraModelMock.calls.length"),value=>value===3);
 assert.equal(await evaluate("window.__astraModelMock.calls[2].text"),changed);
 await evaluate("window.__astraModelMock.resolve(2,{status:'proposal',suggested:'새 문서 2026년 11월 15일을 검토했습니다.',externalTransfer:false})");
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-local-ai-proposal]'))"));
 assert.equal(await evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),0,'proposal never auto-applies');
 assert.equal(await evaluate("document.querySelector('[data-model-value]').textContent"),changed);
 // A completed proposal is also tied to its source scope and cannot surface on an identical block.
 await click('[data-change-scope]');
 assert.equal(await evaluate("document.querySelector('[data-local-ai-proposal]')===null"),true,'proposal is hidden immediately after scope changes');
 assert.equal(await evaluate("document.querySelector('[data-local-ai-accept]')===null"),true,'stale proposal cannot be accepted');
 assert.equal(await evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),0);
 await click('[data-local-ai-run]');
 await eventually(()=>evaluate("window.__astraModelMock.calls.length"),value=>value===4);
 await evaluate("window.__astraModelMock.resolve(3,{status:'proposal',suggested:'새 문서 2026년 11월 15일을 검토했습니다.',externalTransfer:false})");
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-local-ai-proposal]'))"));
 await click('[data-local-ai-accept]');
 await eventually(()=>evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),value=>value===1);
 const approved='새 문서 2026년 11월 15일을 검토했습니다.';
 assert.equal(await evaluate("document.querySelector('[data-model-value]').textContent"),approved);
 await click('[data-change-scope]');
 assert.equal(await evaluate("document.querySelector('[data-local-ai-undo]')===null"),true,'Undo is scoped to the paragraph that was approved');
 await click('[data-change-scope]');
 await eventually(()=>evaluate("Boolean(document.querySelector('[data-local-ai-undo]'))"));
 await click('[data-local-ai-undo]');
 await eventually(()=>evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),value=>value===2);
 assert.equal(await evaluate("document.querySelector('[data-model-value]').textContent"),changed,'Undo restores exact source');
 // A rejected exception leaves the original paragraph and application count unchanged.
 await click('[data-local-ai-run]');
 await eventually(()=>evaluate("window.__astraModelMock.calls.length"),value=>value===5);
 await evaluate("window.__astraModelMock.reject(4)");
 await eventually(()=>evaluate("document.querySelector('[data-local-ai-status]')?.textContent"),value=>value?.includes('원문은 유지'));
 assert.equal(await evaluate("document.querySelector('[data-model-value]').textContent"),changed);
 assert.equal(await evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),2);
 // Explicit cancellation also discards a later response.
 await click('[data-local-ai-run]');
 await eventually(()=>evaluate("window.__astraModelMock.calls.length"),value=>value===6);
 await click('[data-local-ai-cancel]');
 await eventually(()=>evaluate("window.__astraModelMock.cancelCalls"),value=>value===3);
 await evaluate("window.__astraModelMock.resolve(5,{status:'proposal',suggested:'새 문서 2026년 11월 15일을 확인했습니다.',externalTransfer:false})");
 await pause(150);
 assert.equal(await evaluate("document.querySelector('[data-local-ai-proposal]')===null"),true,'cancelled response is discarded');
 assert.equal(await evaluate("document.querySelector('[data-model-value]').textContent"),changed);
 assert.equal(await evaluate("Number(document.querySelector('[data-model-apply-count]').textContent)"),2);
 // Withdraw consent and verify the button closes before another inference call.
 await click('[data-local-ai-consent]');
 assert.equal(await evaluate("document.querySelector('[data-local-ai-run]').disabled"),true);
 assert.equal(await evaluate("window.__astraModelMock.calls.length"),6);
 assert.deepEqual(await evaluate("window.__astraModelMock.calls.map(call=>call.consent)"),[true,true,true,true,true,true]);
 assert.deepEqual(external,[],'no external request was made');
 console.log('PASS P122 local model UI: explicit consent, stale-response discard, manual apply/Undo, error preservation, cancel, no external calls');
}finally{
 try{ws?.close();}catch{}
 await browser.close().catch(()=>{});
 try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
 catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;}
}
