// P103: synthetic scanned PDF in real Chrome/Edge + mocked trusted native OCR.
// No OCR binary, customer document or external network required.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import scannedFixture from '../desktop/step3-scanned-fixture.cjs';
const {makeScannedPagesPdf}=scannedFixture;
const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-step7-ocr-ui-'));
const browser=launchBrowser(binary,profile,'STEP7 synthetic OCR UI');
let ws,seq=0;
const pending=new Map(),external=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,pred=x=>Boolean(x),timeout=45000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(pred(last))return last;await pause(130);}
 throw Error('STEP7 OCR UI timeout: '+JSON.stringify(last));
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
 // Mock only in a disposable Chrome/Edge profile. Product OCR stays OFF.
 await evaluate("(()=>{window.__astraOcrCalls=[];window.astraDesktop={"+
  "localOcrStatus:async()=>({status:'available',engineId:'synthetic-test-only'}),"+
  "localOcrRecognizePng:async(bytes,mode)=>{"+
  "if(!(bytes instanceof Uint8Array)||bytes[0]!==137||bytes.byteLength>8388608)throw Error('Expected bounded local PNG');"+
  "window.__astraOcrCalls.push({mode,bytes:bytes.byteLength});"+
  "return{status:'review',text:'SYNTHETIC_OCR_SAMPLE_2026',reviewOnly:true,approved:false,externalTransfer:false};},"+
  "localOcrCancel:async()=>({status:'idle'})};return true;})()");
 await evaluate("document.querySelector('[data-step7-open-pdf-review]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-step7-ocr-status]')?.textContent"),
  value=>value?.includes('해시 검증 완료'));
 const imageOnly=makeScannedPagesPdf({selectableSecondPage:false});
 const encoded=JSON.stringify(imageOnly.toString('base64'));
 await evaluate("(()=>{const bytes=Uint8Array.from(atob("+encoded+"),c=>c.charCodeAt(0));"+
  "const f=new File([bytes],'synthetic-scan.pdf',{type:'application/pdf'});"+
  "const dt=new DataTransfer();dt.items.add(f);"+
  "const input=document.querySelector('[data-step7-ocr-file]');"+
  "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
 await eventually(()=>evaluate("!document.querySelector('[data-step7-ocr-run]').disabled"));
 await evaluate("document.querySelector('[data-step7-ocr-run]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-step7-ocr-draft]')?.value"),
  value=>value==='SYNTHETIC_OCR_SAMPLE_2026');
 assert.equal(await evaluate("document.querySelector('[data-step7-ocr-draft-origin]')?.textContent.includes('1페이지 · PSM 6')"),true);
 assert.deepEqual(await evaluate('window.__astraOcrCalls.map(call=>call.mode)'),[6]);
 // Changing the source page must erase the previous page's review draft.
 await evaluate("(()=>{const input=document.querySelector('[data-step7-ocr-page]');"+
  "const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;"+
  "set.call(input,'2');input.dispatchEvent(new Event('input',{bubbles:true}));"+
  "input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
 await eventually(()=>evaluate("!document.querySelector('[data-step7-ocr-draft]')&&document.querySelector('[data-step7-ocr-page]').value==='2'"));
 // Switching PSM must not carry over a PSM6 transcript labeled as PSM3.
 await evaluate("(()=>{const input=document.querySelector('[data-step7-ocr-layout-mode]');"+
  "input.value='3';input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
 await eventually(()=>evaluate("document.querySelector('[data-step7-ocr-layout-mode]')?.value"),value=>value==='3');
 await evaluate("document.querySelector('[data-step7-ocr-run]').click()");
 await eventually(()=>evaluate("document.querySelector('[data-step7-ocr-draft-origin]')?.textContent"),
  value=>value?.includes('2페이지 · PSM 3'));
 assert.deepEqual(await evaluate('window.__astraOcrCalls.map(call=>call.mode)'),[6,3]);
 await evaluate("(()=>{const input=document.querySelector('[data-step7-ocr-layout-mode]');"+
  "input.value='6';input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
 await eventually(()=>evaluate("!document.querySelector('[data-step7-ocr-draft]')"));
 assert.deepEqual(external,[],'Synthetic OCR review made no external HTTP requests');
 console.log('PASS STEP7 OCR UI: PDF.js scan -> local PNG -> synthetic native review; page/PSM changes revoke draft, external requests0');
}finally{
 try{ws?.close();}catch{}
 await browser.close().catch(()=>{});
 try{rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
 catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;}
}
