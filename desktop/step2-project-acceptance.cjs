'use strict';
// Tests actual STEP2 UI edits, IndexedDB persistence, reload and installed
// Electron PDF output. CI-only, isolated smoke profile; no customer data.
const fs=require('node:fs/promises');
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
