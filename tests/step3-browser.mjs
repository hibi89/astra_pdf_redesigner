// STEP3 true browser upload: synth PDF -> PDF.js review -> new IndexedDB doc -> themed A4 print.
import assert from 'node:assert/strict';
import {spawnSync,execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
const binary=process.env.CHROME_PATH||'chromium',url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const dir=mkdtempSync(join(tmpdir(),'astra-step3-'));
const browser=launchBrowser(binary,dir,'STEP3 PDF import');
const sleep=t=>new Promise(resolve=>setTimeout(resolve,t));
let ws,seq=0;
const pending=new Map();
function rpc(method,params={},sessionId){
  return new Promise((resolve,reject)=>{
    const id=++seq;pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
}
async function eventually(fn,predicate=x=>Boolean(x),timeout=45000){
  const start=Date.now();let last,lastError;
  while(Date.now()-start<timeout){
    try{last=await fn();if(predicate(last))return last;}
    catch(error){lastError=error;if(!/context was destroyed|navigated or closed|Cannot find context/i.test(String(error)))throw error;}
    await sleep(200);
  }
  throw Error('STEP3 browser timeout: last='+JSON.stringify(last)+' error='+String(lastError));
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
      const p=pending.get(message.id);pending.delete(message.id);
      if(message.error)p.reject(Error(message.error.message));else p.resolve(message.result);
    }
  });
  const {targetId}=await rpc('Target.createTarget',{url});
  const {sessionId}=await rpc('Target.attachToTarget',{targetId,flatten:true});
  const send=(method,params={})=>rpc(method,params,sessionId);
  const evaluate=async expression=>{
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await send('Runtime.enable');await send('Page.enable');
  await eventually(()=>evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]')&&document.querySelector('.doc-list-item.active'))"));
  const before=await evaluate("document.querySelectorAll('.doc-list-item').length");
  const original=await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent");

  // Create a selectable-text PDF with CDP itself, no network fixture dependencies.
  const html='<html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;margin:70px}h1{font-size:28px}p{font-size:14px;line-height:2}</style></head>'+
    '<body><h1>STEP3_TEST_BEGIN_7519</h1><p>선택 가능한 한글 PDF ABC-123 100%</p>'+
    '<p>두 번째 문단 2/3 입력 &amp; 저장 확인</p><p>STEP3_TEST_END_7519</p></body></html>';
  await evaluate('document.open();document.write('+JSON.stringify(html)+');document.close()');
  await eventually(()=>evaluate("Boolean(document.body.textContent.includes('STEP3_TEST_END_7519'))"));
  const pdf=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:false});
  assert.ok(pdf.data?.length>1000,'Synthetic PDF missing');
  console.log('PASS STEP3 FIXTURE: selectable PDF generated with actual browser');
  await send('Page.navigate',{url});
  await eventually(()=>evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]')&&document.querySelector('.doc-list-item.active'))"));
  await evaluate("(()=>{const str=atob("+JSON.stringify(pdf.data)+");const arr=Uint8Array.from(str,c=>c.charCodeAt(0));"+
    "const file=new File([arr],'step3-sample.pdf',{type:'application/pdf'});"+
    "const dt=new DataTransfer();dt.items.add(file);"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),txt=>txt?.includes('STEP3_TEST_BEGIN_7519')&&txt.includes('STEP3_TEST_END_7519'));
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),before,'Review touched persisted document list');
  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),original,'Review switched active document');
  const hasSource=await evaluate("Boolean(document.querySelector('.step3-import-panel iframe[src^=blob]'))");
  assert.equal(hasSource,true,'Original PDF view missing');
  console.log('PASS STEP3 REVIEW: browser-local PDF.js extraction, preview, provenance and no premature document writes');
  const edits=await evaluate("document.querySelectorAll('.step3-block-review textarea').length");
  assert.ok(edits>=2,'Expected extracted text blocks');
  await evaluate("document.querySelector('.step3-confirm input[type=checkbox]').click()");
  await evaluate("(()=>{const b=[...document.querySelectorAll('.step3-import-panel button')].find(b=>b.textContent.includes('검수 결과를 새 문서로 저장'));if(!b||b.disabled)throw Error('PDF confirm disabled');b.click();})()");
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===before+1);
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),t=>t?.includes('STEP3_TEST_BEGIN_7519')&&t.includes('STEP3_TEST_END_7519'));
  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent?.includes('step3-sample')"),true);
  assert.equal(await evaluate("document.querySelector('.section-editor .help-text')?.textContent?.includes('원본 PDF 출처')"),true);
  console.log('PASS STEP3 IMPORT: review creates independent active V2 document with PDF source provenance');
  const themeBefore=await evaluate("document.querySelector('.project-paper')?.className");
  await evaluate("document.querySelectorAll('input[name=v2theme]')[1].click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.className"),v=>v!==themeBefore);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  await send('Page.reload',{ignoreCache:true});
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),v=>v?.includes('STEP3_TEST_END_7519'));
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),before+1);
  const printed=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:false});
  const pdfPath=join(dir,'step3-imported-output.pdf');
  writeFileSync(pdfPath,Buffer.from(printed.data,'base64'));
  const info=execFileSync('pdfinfo',[pdfPath],{encoding:'utf8'});
  const text=execFileSync('pdftotext',[pdfPath,'-'],{encoding:'utf8'});
  assert.ok(info.includes('(A4)')&&text.includes('STEP3_TEST_BEGIN_7519')&&text.includes('STEP3_TEST_END_7519'),
    'Imported PDF text not preserved in A4 reprint');
  console.log('PASS STEP3 END-TO-END: imported PDF survives theme/reload and retains start/end markers in new A4 PDF');
}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP3: synthetic browser profile cleanup deferred ('+error.code+')');}
}
