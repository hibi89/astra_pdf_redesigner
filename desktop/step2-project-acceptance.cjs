'use strict';
// Tests actual STEP2 UI edits, IndexedDB persistence, reload and installed
// Electron PDF output. CI-only, isolated smoke profile; no customer data.
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const PNG64='iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGOUS3nGwMDAxMDAwMDAAAAQQgFsBOs6hwAAAABJRU5ErkJggg==';
const TOKENS=Object.freeze({
  title:'ASTRA_STEP2_PRINT_8307',
  body:'ASTRA_STEP2_BODY_8308',
  caption:'ASTRA_STEP2_CAPTION_8309',
  library:'ASTRA_LIBRARY_ONLY_8310',
});
const APP_URL='astra://app/index.html';

async function editStep2InBrowser(image) {
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
  let bytes;
  if(image.pattern){
    const canvas=document.createElement('canvas');
    canvas.width=image.width;canvas.height=image.height;
    const context=canvas.getContext('2d');
    if(!context)throw Error('Could not create synthetic STEP2 image');
    context.fillStyle='#f4f7fb';context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle='#2563eb';context.fillRect(0,0,canvas.width,38);
    context.fillStyle='#14b8a6';context.fillRect(12,56,canvas.width-24,44);
    context.fillStyle='#f59e0b';context.fillRect(20,116,canvas.width-40,24);
    context.fillStyle='#111827';context.font='bold 14px sans-serif';context.fillText('ASTRA',18,174);
    context.strokeStyle='#1f2937';context.lineWidth=4;
    context.strokeRect(2,2,canvas.width-4,canvas.height-4);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>
      value?resolve(value):reject(Error('Could not encode synthetic STEP2 image')),'image/png'));
    bytes=new Uint8Array(await blob.arrayBuffer());
  }else{
    bytes=Uint8Array.from(atob(image.encoded),c=>c.charCodeAt(0));
  }
  const file=new File([bytes],image.pattern?'local-step2-pattern.png':'ci-step2.png',
    {type:'image/png'});
  const transfer=new DataTransfer();transfer.items.add(file);
  const upload=document.querySelector('.section-editor .add-block input[type=file]');
  if(!upload)throw Error('Missing STEP2 image upload control');
  upload.files=transfer.files;
  upload.dispatchEvent(new Event('change',{bubbles:true}));
  await until(()=>{
    const img=document.querySelector('.project-paper figure img');
    return img?.complete&&img.naturalWidth===image.width&&img.naturalHeight===image.height;
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
async function verifyReloadedProject(expectedVersion=1,expectedImage={width:2,height:2}){
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  for(let i=0;i<140;i++){
    const paper=document.querySelector('.project-paper');
    const picture=paper?.querySelector('figure img');
    if(paper?.textContent.includes('ASTRA_STEP2_BODY_8308')&&
       paper?.textContent.includes('ASTRA_STEP2_CAPTION_8309')&&
       picture?.complete&&picture.naturalWidth===expectedImage.width&&
       picture.naturalHeight===expectedImage.height)break;
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
    if(db.version!==expectedVersion)throw Error('Installed STEP2 IDB version mismatch: expected '+expectedVersion+', got '+db.version);
    for(const store of ['documents','assets','meta'])if(!db.objectStoreNames.contains(store))throw Error('Missing legacy STEP2 store: '+store);
    if(db.objectStoreNames.contains('migrationAudit')!==(expectedVersion===2))throw Error('Installed STEP2 migrationAudit store inconsistent with version '+expectedVersion);
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
       assets[0].width!==expectedImage.width||assets[0].height!==expectedImage.height||
       images[0].assetId!==assets[0].id||
       images[0].caption!=='ASTRA_STEP2_CAPTION_8309')
      throw Error('Persisted STEP2 IndexedDB document/asset differs from editor');
    return {saved:true,assets:assets.length,imageWidth:assets[0].width,imageHeight:assets[0].height};
  }finally{db.close();}
}
async function runStep2ProjectAcceptance(win,renderLocalPdf,{local=false,localOutput}={}){
  const schemaUpgrade=process.argv.includes('--astra-step2-schema-upgrade-verify');
  const verifyOnly=process.argv.includes('--astra-step2-preservation-verify')||schemaUpgrade;
  let root,output;
  if(local){
    root=path.resolve(os.tmpdir());
    output=path.resolve(localOutput||'');
    if(!localOutput||path.dirname(output)!==root||
       !/^astra-p5-pdf-visual-[A-Za-z0-9-]+\.pdf$/i.test(path.basename(output)))
      throw Error('Local STEP2 PDF output must be directly under the isolated OS temp folder');
  }else{
    if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP)
      throw Error('STEP2 acceptance allowed on GitHub Actions only');
    root=path.resolve(process.env.RUNNER_TEMP);
    output=path.resolve(process.env.ASTRA_STEP2_ACCEPTANCE_OUT||'');
    if(!process.env.ASTRA_STEP2_ACCEPTANCE_OUT||
       path.dirname(output)!==root||
       !/^astra-step2-project-[A-Za-z0-9-]+\.pdf$/i.test(path.basename(output)))
      throw Error('STEP2 PDF output must be directly under isolated RUNNER_TEMP');
  }
  if(!verifyOnly){
    const imageFixture=local?{pattern:true,width:144,height:216}:
      {encoded:PNG64,width:2,height:2};
    const before=await win.webContents.executeJavaScript(
      '('+editStep2InBrowser.toString()+')('+JSON.stringify(imageFixture)+')',true);
    if(!before?.editorSaved||!before?.image)throw Error('STEP2 UI edit did not complete');
  }
  await win.loadURL(APP_URL);
  const persisted=await win.webContents.executeJavaScript(
    '('+verifyReloadedProject.toString()+')('+(schemaUpgrade?2:1)+','+
      JSON.stringify(local?{width:144,height:216}:{width:2,height:2})+')',true);
  if(!persisted?.saved||persisted.assets!==1)throw Error('STEP2 IndexedDB reload failed');
  if(verifyOnly){
    if(schemaUpgrade)console.log('PASS ASTRA WINDOWS IDB V1 TO V2: installed EXE migrated real STEP2 document, PNG and active ID; audit store present');
    else console.log('PASS ASTRA STEP2 PROFILE PRESERVED: stored document and PNG survived installed EXE restart');
    return;
  }
  const bytes=await renderLocalPdf();
  await fs.writeFile(output,bytes,{flag:'wx'});
  const restored=await fs.readFile(output);
  if(!restored.equals(bytes))throw Error('STEP2 PDF bytes changed on disk');
  console.log('PASS ASTRA REAL STEP2 PROJECT: UI edit, IndexedDB document+PNG, reload, Electron PDF output'+
    (local?'; path='+output:''));
}
module.exports={runStep2ProjectAcceptance,TOKENS};
