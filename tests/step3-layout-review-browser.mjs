// Real Chrome/Edge import checks for the STEP3 structural-risk review matrix.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {STEP3_LAYOUT_RISK_CASES,makeStep3LayoutRiskPdf} from './fixtures/step3-layout-risk-matrix.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-step3-layout-risk-'));
const browser=launchBrowser(binary,profile,'STEP3 layout review matrix');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let ws,sequence=0;
const pending=new Map();
function rpc(method,params={},sessionId){
  return new Promise((resolve,reject)=>{
    const id=++sequence;pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
}
async function eventually(fn,predicate=value=>Boolean(value),timeout=45000){
  const start=Date.now();let last,lastError;
  while(Date.now()-start<timeout){
    try{last=await fn();if(predicate(last))return last;}
    catch(error){lastError=error;if(!/context was destroyed|navigated or closed|Cannot find context/i.test(String(error)))throw error;}
    await sleep(200);
  }
  throw Error('STEP3 layout browser timeout: last='+JSON.stringify(last)+' error='+String(lastError));
}
try{
  ws=await browser.connect();
  await new Promise((resolve,reject)=>{
    if(ws.readyState===1)return resolve();
    ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});
  });
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id&&pending.has(message.id)){
      const item=pending.get(message.id);pending.delete(message.id);
      if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
    }
  });
  const target=await rpc('Target.createTarget',{url});
  const attached=await rpc('Target.attachToTarget',{targetId:target.targetId,flatten:true});
  const send=(method,params={})=>rpc(method,params,attached.sessionId);
  const evaluate=async expression=>{
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await send('Runtime.enable');await send('Page.enable');
  await eventually(()=>evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]')&&document.querySelector('.doc-list-item.active'))"));
  const originalCount=await evaluate("document.querySelectorAll('.doc-list-item').length");
  let verifiedRiskCases=0;
  for(const scenario of STEP3_LAYOUT_RISK_CASES){
    const bytes=makeStep3LayoutRiskPdf(scenario.id);
    const expression="(()=>{const encoded="+JSON.stringify(bytes.toString('base64'))+
      ",name="+JSON.stringify('step3-'+scenario.id+'.pdf')+";const data=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));"+
      "const file=new File([data],name,{type:'application/pdf'});const transfer=new DataTransfer();transfer.items.add(file);"+
      "const input=document.querySelector('.step3-import-panel input[type=file]');input.files=transfer.files;"+
      "input.dispatchEvent(new Event('change',{bubbles:true}));})()";
    await evaluate(expression);
    await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),
      value=>scenario.markers.every(marker=>value?.includes(marker)));
    const reviewInput=await evaluate("Boolean(document.querySelector('[data-step3-layout-review-confirm=\"1\"]'))");
    assert.equal(reviewInput,scenario.expectedReview,scenario.id+' structural review classification mismatch');
    const reviewedText=await evaluate("[...document.querySelectorAll('.step3-block-review textarea')].map(area=>area.value).join('\\n')");
    const positions=scenario.markers.map(marker=>reviewedText.indexOf(marker));
    assert.ok(positions.every(position=>position>=0),scenario.id+' lost a required source marker: '+JSON.stringify(positions));
    if(scenario.expectedReview){
      verifiedRiskCases++;
      assert.ok(positions.every((position,index)=>index===0||positions[index-1]<position),
        scenario.id+' automatically reordered PDF.js source fragments');
      const pendingText=await evaluate("document.querySelector('[data-step3-layout-review-pending=\"1\"]')?.textContent");
      assert.ok(pendingText?.includes('수동 확인 대기'),scenario.id+' did not show an explicit pending review');
      assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),originalCount,
        scenario.id+' persisted a draft before approval');
    }
    await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').click()");
    const globalOnlyDisabled=await evaluate("document.querySelector('.step3-import-panel .print-button').disabled");
    assert.equal(globalOnlyDisabled,scenario.expectedReview,
      scenario.id+' save gating did not match the per-page review requirement');
    if(scenario.expectedReview){
      await evaluate("document.querySelector('[data-step3-layout-review-confirm=\"1\"]').click()");
      await eventually(()=>evaluate("!document.querySelector('.step3-import-panel .print-button').disabled"));
      if(scenario.id==='two-column'){
        await evaluate("(()=>{const area=document.querySelector('.step3-block-review textarea');"+
          "const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(area,area.value+' MANUAL_EDIT');"+
          "area.dispatchEvent(new Event('input',{bubbles:true}));})()");
        await eventually(()=>evaluate("document.querySelector('[data-step3-layout-review-confirm=\"1\"]')?.checked===false"));
        assert.equal(await evaluate("document.querySelector('.step3-import-panel .print-button').disabled"),true,
          'Editing a reviewed draft must revoke both layout and document confirmation');
      }
    }else{
      await eventually(()=>evaluate("!document.querySelector('.step3-import-panel .print-button').disabled"));
    }
    assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),originalCount,
      scenario.id+' saved without an explicit user action');
    console.log('PASS STEP3 LAYOUT MATRIX '+scenario.id+': markers retained, review='+scenario.expectedReview+', explicit save gate verified');
  }
  assert.equal(STEP3_LAYOUT_RISK_CASES.length,12,'P114 requires twelve distinct synthetic source PDFs');
  assert.equal(verifiedRiskCases,10,'Ten ambiguous matrix cases must remain pending for manual review');
  console.log('PASS STEP3 LAYOUT REVIEW MATRIX: 12/12 real local PDF fixtures reviewed in '+binary+'; uncertain pages retain source order and cannot save before page-level confirmation');
}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP3 layout review profile cleanup deferred ('+error.code+')');}
}