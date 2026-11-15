'use strict';
// Tests actual STEP2 UI edits, IndexedDB persistence, reload and installed
// Electron PDF output. CI-only, isolated smoke profile; no customer data.
const fs=require('node:fs/promises');
const {createHash}=require('node:crypto');
const path=require('node:path');
const PNG64='iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGOUS3nGwMDAxMDAwMDAAAAQQgFsBOs6hwAAAABJRU5ErkJggg==';
const TOKENS=Object.freeze({
  title:'ASTRA_STEP2_PRINT_8307',
  body:'ASTRA_STEP2_BODY_8308',
  caption:'ASTRA_STEP2_CAPTION_8309',
  library:'ASTRA_LIBRARY_ONLY_8310',
});
const APP_URL='astra://app/index.html';
async function waitForProjectPreview(win){
  for(let i=0;i<140;i++){
    try{
      if(await win.webContents.executeJavaScript(
        "document.readyState==='complete'&&Boolean(document.querySelector('.project-paper'))",true))return;
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,150));
  }
  throw Error('STEP2 project preview renderer did not become ready after reload');
}

async function editStep2InBrowser(encoded) {
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function until(test,label){
    for(let i=0;i<140;i++){
      const result=await test();
      if(result)return result;
      await sleep(150);
    }
    throw Error('STEP2 fixture timed out: '+label);
  }
  await until(()=>document.querySelector('.section-editor textarea')&&
    !document.querySelector('.section-editor textarea').disabled,'editable STEP2');
  const change=(el,value)=>{
    if(!el)throw Error('Missing STEP2 editable input');
    const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);
    el.dispatchEvent(new Event('input',{bubbles:true}));
  };
  const form=document.querySelectorAll('.project-layout .form-grid input');
  if(form.length<2)throw Error('Missing document metadata inputs');
  change(form[0],'ASTRA_LIBRARY_ONLY_8310');
  change(form[1],'ASTRA_STEP2_PRINT_8307');
  change(document.querySelector('.section-editor .section-editor-heading input'),'한글 프로젝트 확인');
  change(document.querySelector('.section-editor textarea'),
    'ASTRA_STEP2_BODY_8308 실제 문서 저장과 출력을 검증합니다. 숫자 24680.\n'+
    Array.from({length:65},(_,i)=>'한글 장문 테스트 '+String(i+1).padStart(2,'0')+
    ' 편집 후 저장 및 재출력 확인을 위한 합성 문장입니다.').join('\n'));
  await until(()=>document.querySelector('.project-paper')?.textContent.includes('ASTRA_STEP2_BODY_8308'),
    'React preview after text entry');
  const file=new File([Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))],
    'ci-step2.png',{type:'image/png'});
  const transfer=new DataTransfer();transfer.items.add(file);
  const upload=document.querySelector('.section-editor .add-block input[type=file]');
  if(!upload)throw Error('Missing STEP2 image upload control');
  upload.files=transfer.files;
  upload.dispatchEvent(new Event('change',{bubbles:true}));
  await until(()=>{
    const img=document.querySelector('.project-paper figure img');
    return img?.complete&&img.naturalWidth===2&&img.naturalHeight===2;
  },'image uploaded using STEP2 UI');
  const captionInput=[...document.querySelectorAll('.block-editor input')].find(e=>
    e.closest('label')?.textContent.includes('이미지 설명'));
  change(captionInput,'ASTRA_STEP2_CAPTION_8309');
  await until(()=>document.querySelector('.project-paper figcaption')?.textContent===
    'ASTRA_STEP2_CAPTION_8309','image caption preview');
  const save=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('지금 저장 / 재시도'));
  if(!save||save.disabled)throw Error('STEP2 save UI unavailable');
  save.click();
  await until(()=>document.querySelector('.save-chip')?.textContent==='저장됨','IndexedDB saved state');
  const output=document.querySelector('.project-paper')?.textContent||'';
  if(!output.includes('ASTRA_STEP2_PRINT_8307')||
     !output.includes('ASTRA_STEP2_BODY_8308')||
     !output.includes('ASTRA_STEP2_CAPTION_8309'))throw Error('Incomplete STEP2 document preview');
  return {image:true,editorSaved:true};
}
async function verifyReloadedProject(){
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  for(let i=0;i<140;i++){
    const paper=document.querySelector('.project-paper');
    const picture=paper?.querySelector('figure img');
    if(paper?.textContent.includes('ASTRA_STEP2_BODY_8308')&&
       paper?.textContent.includes('ASTRA_STEP2_CAPTION_8309')&&
       picture?.complete&&picture.naturalWidth===2)break;
    if(i===139)throw Error('STEP2 text or image did not survive reload');
    await sleep(150);
  }
  const db=await new Promise((resolve,reject)=>{
    const req=indexedDB.open('astra-pdf-redesigner:v2');
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||Error('IndexedDB open failed'));
  });
  const request=req=>new Promise((resolve,reject)=>{
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||Error('IndexedDB read failed'));
  });
  try{
    const metaTx=db.transaction('meta','readonly');
    const active=await request(metaTx.objectStore('meta').get('activeDocumentId'));
    const tx=db.transaction(['documents','assets'],'readonly');
    const doc=await request(tx.objectStore('documents').get(active));
    const assets=await request(tx.objectStore('assets').index('documentId').getAll(active));
    const blocks=doc?.content?.sections?.flatMap(s=>s.blocks)||[];
    const body=blocks.filter(b=>b.kind==='paragraph').map(b=>b.text).join('\n');
    const images=blocks.filter(b=>b.kind==='image');
    if(doc?.content?.title!=='ASTRA_STEP2_PRINT_8307'||
       doc?.name!=='ASTRA_LIBRARY_ONLY_8310'||
       !body.includes('ASTRA_STEP2_BODY_8308')||!body.includes('24680')||
       images.length!==1||assets.length!==1||assets[0].mimeType!=='image/png'||
       assets[0].width!==2||assets[0].height!==2||
       images[0].assetId!==assets[0].id||
       images[0].caption!=='ASTRA_STEP2_CAPTION_8309')
      throw Error('Persisted STEP2 IndexedDB document/asset differs from editor');
    return {saved:true,assets:assets.length,imageWidth:assets[0].width};
  }finally{db.close();}
}

async function snapshotStep2Storage(){
  const req=request=>new Promise((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||Error('IndexedDB recovery snapshot failed'));
  });
  const db=await new Promise((resolve,reject)=>{
    const open=indexedDB.open('astra-pdf-redesigner:v2');
    open.onsuccess=()=>resolve(open.result);
    open.onerror=()=>reject(open.error||Error('IndexedDB recovery open failed'));
  });
  try{
    const tx=db.transaction(['documents','assets','meta'],'readonly');
    const done=new Promise((resolve,reject)=>{
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error||Error('IndexedDB snapshot transaction failed'));
      tx.onabort=()=>reject(tx.error||Error('IndexedDB snapshot transaction aborted'));
    });
    const docsRequest=tx.objectStore('documents').getAll();
    const assetsRequest=tx.objectStore('assets').getAll();
    const metaStore=tx.objectStore('meta');
    const keysRequest=metaStore.getAllKeys();
    const valuesRequest=metaStore.getAll();
    const [documents,assets,keys,values]=await Promise.all([
      req(docsRequest),req(assetsRequest),req(keysRequest),req(valuesRequest)
    ]);
    await done;
    const normalizedAssets=await Promise.all(assets.map(async asset=>{
      const {blob,...metadata}=asset;
      const bytes=new Uint8Array(await blob.arrayBuffer());
      let binary='';
      for(let i=0;i<bytes.length;i++)binary+=String.fromCharCode(bytes[i]);
      return {...metadata,blobBase64:btoa(binary)};
    }));
    return JSON.stringify({
      documents,
      assets:normalizedAssets,
      meta:keys.map((key,index)=>[key,values[index]])
    });
  }finally{db.close();}
}
async function waitForSaveState(expected){
  for(let i=0;i<140;i++){
    if(document.querySelector('.save-chip')?.textContent===expected)return;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw Error('STEP2 recovery save state did not reach '+expected);
}
async function waitForStep2Title(title){
  for(let i=0;i<140;i++){
    if(document.querySelector('.project-paper')?.textContent.includes(title))return;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw Error('STEP2 editor preview did not reflect recovery title');
}
async function injectStep2QuotaFailure(){
  const before=await snapshotStep2Storage();
  const prototype=IDBObjectStore.prototype;
  const originalPut=prototype.put;
  let injected=false;
  const patchedPut=function(...args){
    if(!injected&&this.name==='documents'&&this.transaction.mode==='readwrite'){
      injected=true;
      throw new DOMException('C007_QUOTA_INJECTION_UNSAVED','QuotaExceededError');
    }
    return originalPut.apply(this,args);
  };
  prototype.put=patchedPut;
  if(prototype.put!==patchedPut)throw Error('Could not install isolated IndexedDB quota fault');
  try{
    const fields=document.querySelectorAll('.project-layout .form-grid input');
    if(fields.length<2)throw Error('Missing STEP2 title input for quota recovery');
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(fields[1],'C007_QUOTA_INJECTION_UNSAVED');
    fields[1].dispatchEvent(new Event('input',{bubbles:true}));
    await waitForStep2Title('C007_QUOTA_INJECTION_UNSAVED');
    const save=[...document.querySelectorAll('button')].find(button=>
      button.textContent.includes('지금 저장 / 재시도'));
    if(!save||save.disabled)throw Error('STEP2 quota recovery save button unavailable');
    save.click();
    await waitForSaveState('저장 실패');
  }finally{
    prototype.put=originalPut;
  }
  const after=await snapshotStep2Storage();
  return {injected,before,after,status:document.querySelector('.save-chip')?.textContent||''};
}
async function setStep2TitleAndSave(title){
  const fields=document.querySelectorAll('.project-layout .form-grid input');
  if(fields.length<2)throw Error('Missing STEP2 title input for retry');
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
  setter.call(fields[1],title);
  fields[1].dispatchEvent(new Event('input',{bubbles:true}));
  await waitForStep2Title(title);
  const save=[...document.querySelectorAll('button')].find(button=>
    button.textContent.includes('지금 저장 / 재시도'));
  if(!save||save.disabled)throw Error('STEP2 recovery retry button unavailable');
  save.click();
  await waitForSaveState('저장됨');
  return await snapshotStep2Storage();
}
async function abortStep2MultiStoreTransaction(){
  const before=await snapshotStep2Storage();
  const db=await new Promise((resolve,reject)=>{
    const open=indexedDB.open('astra-pdf-redesigner:v2');
    open.onsuccess=()=>resolve(open.result);
    open.onerror=()=>reject(open.error||Error('IndexedDB abort probe open failed'));
  });
  try{
    const read=db.transaction(['documents','assets'],'readonly');
    const readDone=new Promise((resolve,reject)=>{
      read.oncomplete=resolve;
      read.onerror=()=>reject(read.error||Error('IndexedDB abort probe read failed'));
      read.onabort=()=>reject(read.error||Error('IndexedDB abort probe read aborted'));
    });
    const documents=await new Promise((resolve,reject)=>{
      const request=read.objectStore('documents').getAll();
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||Error('Document read failed'));
    });
    const assets=await new Promise((resolve,reject)=>{
      const request=read.objectStore('assets').getAll();
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||Error('Asset read failed'));
    });
    await readDone;
    if(!documents.length||!assets.length)throw Error('STEP2 recovery abort fixture is incomplete');
    const tx=db.transaction(['documents','assets','meta'],'readwrite');
    const aborted=new Promise((resolve,reject)=>{
      tx.onabort=()=>resolve(true);
      tx.onerror=event=>event.preventDefault();
      tx.oncomplete=()=>reject(Error('Synthetic STEP2 transaction unexpectedly committed'));
    });
    tx.objectStore('documents').put({...documents[0],name:'C007_ABORT_UNCOMMITTED'});
    tx.objectStore('assets').put({
      ...assets[0],
      blob:new Blob([new Uint8Array([0,1,2,3])],{type:'image/png'})
    });
    tx.objectStore('meta').put('C007_ABORT_UNCOMMITTED','c007FailureProbe');
    tx.abort();
    await aborted;
  }finally{db.close();}
  const after=await snapshotStep2Storage();
  return {before,after};
}

async function runStep2ProjectAcceptance(win,renderLocalPdf){
  const verifyOnly=process.argv.includes('--astra-step2-preservation-verify');
  if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP)
    throw Error('STEP2 acceptance allowed on GitHub Actions only');
  const root=path.resolve(process.env.RUNNER_TEMP);
  const output=path.resolve(process.env.ASTRA_STEP2_ACCEPTANCE_OUT||'');
  if(!process.env.ASTRA_STEP2_ACCEPTANCE_OUT||
     path.dirname(output)!==root||
     !/^astra-step2-project-[A-Za-z0-9-]+\.pdf$/i.test(path.basename(output)))
    throw Error('STEP2 PDF output must be directly under isolated RUNNER_TEMP');
  const evaluate=async(source,label)=>{
    try{
      const wrapped=`(async()=>{try{return {ok:true,value:await (${source})}}catch(error){return {ok:false,error:{name:error?.name||'',message:error?.message||'',stack:error?.stack||'',string:String(error)}}}})()`;
      const result=await win.webContents.executeJavaScript(wrapped,true);
      if(result?.ok)return result.value;
      const detail=result?.error?
        [result.error.name,result.error.message,result.error.stack,result.error.string].filter(Boolean).join('\n'):
        JSON.stringify(result);
      throw Error(detail||'renderer returned no result');
    }
    catch(error){
      const detail=error&&typeof error==='object'?
        [error.name,error.message,error.stack].filter(Boolean).join('\n'):
        String(error);
      throw Error(`STEP2 ${label} renderer evaluation failed: ${detail}`);
    }
  };
  if(!verifyOnly){
    const before=await evaluate(
      '('+editStep2InBrowser.toString()+')('+JSON.stringify(PNG64)+')','document edit and save');
    if(!before?.editorSaved||!before?.image)throw Error('STEP2 UI edit did not complete');
  }
  await win.loadURL(APP_URL);
  await waitForProjectPreview(win);
  const persisted=await evaluate('('+verifyReloadedProject.toString()+')()','reload verification');
  if(!persisted?.saved||persisted.assets!==1)throw Error('STEP2 IndexedDB reload failed');
  if(!verifyOnly&&process.env.ASTRA_STEP2_FAILURE_INJECTION==='1'){
    const reportPath=path.resolve(process.env.ASTRA_STEP2_RECOVERY_REPORT_OUT||'');
    if(!process.env.ASTRA_STEP2_RECOVERY_REPORT_OUT||path.dirname(reportPath)!==root||
       !/^astra-step2-recovery-[A-Za-z0-9-]+\.json$/i.test(path.basename(reportPath)))
      throw Error('STEP2 recovery report must be directly under isolated RUNNER_TEMP');
    const baseline=await evaluate('('+snapshotStep2Storage.toString()+')()','baseline recovery snapshot');
    const quota=await evaluate('('+injectStep2QuotaFailure.toString()+')()','synthetic quota failure');
    if(!quota?.injected||quota.status!=='저장 실패'||quota.before!==baseline||quota.after!==baseline)
      throw Error('STEP2 quota failure changed persisted V2 data or was not visible');
    await win.loadURL(APP_URL);
    await waitForProjectPreview(win);
    const afterQuotaReload=await evaluate('('+verifyReloadedProject.toString()+')()','quota reload verification');
    if(!afterQuotaReload?.saved||afterQuotaReload.assets!==1)
      throw Error('STEP2 persisted document/PNG did not survive quota failure reload');
    const retry=await evaluate('('+setStep2TitleAndSave.toString()+')('+JSON.stringify('C007_QUOTA_RECOVERY_RETRY')+')','quota recovery retry');
    const retryState=JSON.parse(retry);
    const baselineState=JSON.parse(baseline);
    const retryDocument=retryState.documents.find(doc=>doc.content?.title==='C007_QUOTA_RECOVERY_RETRY');
    if(!retryDocument||JSON.stringify(retryState.assets.map(asset=>asset.blobBase64))!==JSON.stringify(baselineState.assets.map(asset=>asset.blobBase64)))
      throw Error('STEP2 save retry did not persist or changed the existing PNG bytes');
    const restored=await evaluate('('+setStep2TitleAndSave.toString()+')('+JSON.stringify('ASTRA_STEP2_PRINT_8307')+')','restored title after retry');
    const restoredState=JSON.parse(restored);
    if(!restoredState.documents.some(doc=>doc.content?.title==='ASTRA_STEP2_PRINT_8307')||
       JSON.stringify(restoredState.assets.map(asset=>asset.blobBase64))!==JSON.stringify(baselineState.assets.map(asset=>asset.blobBase64)))
      throw Error('STEP2 recovery cleanup changed original synthetic document or PNG bytes');
    await win.loadURL(APP_URL);
    await waitForProjectPreview(win);
    const afterRetryReload=await evaluate('('+verifyReloadedProject.toString()+')()','retry reload verification');
    if(!afterRetryReload?.saved||afterRetryReload.assets!==1)
      throw Error('STEP2 retry data did not survive renderer reload');
    const aborted=await evaluate('('+abortStep2MultiStoreTransaction.toString()+')()','multi-store transaction abort');
    if(!aborted?.before||aborted.before!==aborted.after)
      throw Error('STEP2 aborted multi-store transaction changed persisted data');
    await win.loadURL(APP_URL);
    await waitForProjectPreview(win);
    const afterAbortReload=await evaluate('('+verifyReloadedProject.toString()+')()','transaction abort reload verification');
    if(!afterAbortReload?.saved||afterAbortReload.assets!==1)
      throw Error('STEP2 document/PNG did not survive transaction abort reload');
    const report={
      schema:'astra-c007-step2-recovery-v1',
      status:'PASS',
      github_sha:process.env.GITHUB_SHA||'',
      quota_failure_visible:true,
      quota_failure_preserved_storage:true,
      retry_persisted:true,
      png_bytes_preserved:true,
      multi_store_abort_atomic:true,
      renderer_reload_preserved:true,
      installed_process_restart_verified:false,
      stdout_stderr_leak_check:false,
      baseline_snapshot_sha256:createHash('sha256').update(baseline).digest('hex'),
      after_quota_snapshot_sha256:createHash('sha256').update(quota.after).digest('hex'),
      abort_before_snapshot_sha256:createHash('sha256').update(aborted.before).digest('hex'),
      abort_after_snapshot_sha256:createHash('sha256').update(aborted.after).digest('hex'),
      evidence_scope:'synthetic QuotaExceededError and IndexedDB transaction abort; not physical power-loss'
    };
    if(!report.github_sha)throw Error('STEP2 recovery report requires exact GitHub Actions SHA');
    await fs.writeFile(reportPath,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
    console.log('PASS ASTRA STEP2 SYNTHETIC QUOTA FAILURE: save failure visible; V2 document and PNG bytes unchanged');
    console.log('PASS ASTRA STEP2 RETRY AND ABORT RECOVERY: successful retry and atomic documents/assets/meta transaction abort');
  }
  if(verifyOnly){
    console.log('PASS ASTRA STEP2 PROFILE PRESERVED: stored document and PNG survived installed EXE restart');
    return;
  }
  const bytes=await renderLocalPdf();
  await fs.writeFile(output,bytes,{flag:'wx'});
  const restored=await fs.readFile(output);
  if(!restored.equals(bytes))throw Error('STEP2 PDF bytes changed on disk');
  console.log('PASS ASTRA REAL STEP2 PROJECT: UI edit, IndexedDB document+PNG, reload, installed Electron PDF output');
}
module.exports={runStep2ProjectAcceptance,TOKENS};
