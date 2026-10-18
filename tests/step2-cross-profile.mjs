// Real portable project: export from Chrome profile A to an actual .localdoc.json
// file, and load that file with Chrome's file input from a different profile B.
// All content is synthetic. Node 22 / DevTools Protocol, no browser dependency.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {launchBrowser} from './browser-process.mjs';
import {mkdtempSync,readFileSync,readdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const chrome=process.env.CHROME_PATH||'chromium',url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const workspace=mkdtempSync(join(tmpdir(),'astra-transfer-'));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn,check=v=>Boolean(v),timeout=18000){
  const begin=Date.now();let last,err;
  while(Date.now()-begin<timeout){
    try{const v=await fn();last=v;if(check(v))return v;}
    catch(e){if(!/Cannot find context|Execution context was destroyed|navigated or closed/i.test(String(e)))throw e;err=e;}
    await wait(120);
  }
  throw Error('Cross-profile test timed out: last='+JSON.stringify(last)+' error='+String(err||'none'));
}
async function launch(label){
  const dir=join(workspace,'profile-'+label);
  const browserSession=launchBrowser(chrome,dir,'STEP2 cross-profile '+label);
  let ws=null,seq=0,sessionId;
  const pending=new Map();
  try{
    const endpoint=await browserSession.devtools();
    ws=new WebSocket(endpoint);
    await new Promise((resolve,reject)=>{
      ws.addEventListener('open',resolve,{once:true});
      ws.addEventListener('error',reject,{once:true});
    });
    ws.addEventListener('message',event=>{
      const m=JSON.parse(event.data);
      if(m.id&&pending.has(m.id)){
        const p=pending.get(m.id);pending.delete(m.id);
        if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);
      }
    });
    const rpc=(method,params={},session)=>{
      return new Promise((resolve,reject)=>{
        const id=++seq;pending.set(id,{resolve,reject});
        ws.send(JSON.stringify({id,method,params,...(session?{sessionId:session}:{})}));
      });
    };
    const target=await rpc('Target.createTarget',{url});
    ({sessionId}=await rpc('Target.attachToTarget',{targetId:target.targetId,flatten:true}));
    const send=(method,params={})=>rpc(method,params,sessionId);
    await send('Runtime.enable');await send('Page.enable');
    const evaluate=async(expr)=>{
      const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
      if(r.exceptionDetails)throw Error('Chrome '+label+': '+JSON.stringify(r.exceptionDetails));
      return r.result.value;
    };
    const reload=async()=>{
      let timer,listener;
      const done=new Promise((resolve,reject)=>{
        listener=event=>{
          const m=JSON.parse(event.data);
          if(m.method==='Page.loadEventFired'&&m.sessionId===sessionId){
            clearTimeout(timer);ws.removeEventListener('message',listener);resolve();
          }
        };
        ws.addEventListener('message',listener);
        timer=setTimeout(()=>{ws.removeEventListener('message',listener);reject(Error('Page.reload timeout'));},15000);
      });
      try{await send('Page.reload',{ignoreCache:true});await done;}
      finally{clearTimeout(timer);ws.removeEventListener('message',listener);}
    };
    const close=async()=>{ws.close();await browserSession.close();};
    await until(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active')&&document.querySelector('.section-editor .block-editor textarea')&&document.querySelector('.save-chip')?.textContent==='저장됨')"));
    return{send,evaluate,reload,close};
  }catch(e){
    if(ws)ws.close();
    await browserSession.close();
    throw e;
  }
}
const payload=String.raw;
const snapshotJS="(async()=>{"+
  "const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});"+
  "const get=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});"+
  "try{const docs=await get(db.transaction('documents','readonly').objectStore('documents').getAll());"+
  "const meta=db.transaction('meta','readonly').objectStore('meta');const active=await get(meta.get('activeDocumentId'));"+
  "const images=await get(db.transaction('assets','readonly').objectStore('assets').getAll());"+
  "const assets=await Promise.all(images.map(async item=>({...item,blob:undefined,base64:btoa(String.fromCharCode(...new Uint8Array(await item.blob.arrayBuffer())))})));"+
  "return{docs,active,assets}}finally{db.close()}})()";
function activeDocument(snapshot){return snapshot.docs.find(doc=>doc.id===snapshot.active);}
function normalizeBlocks(doc,assets){
  const byId=new Map(assets.map(asset=>[asset.id,asset]));
  return doc.content.sections.map(section=>({
    title:section.title,
    blocks:section.blocks.map(block=>block.kind==='image'?{
      kind:'image',caption:block.caption,size:block.size,alignment:block.alignment,
      asset:(()=>{
        const image=byId.get(block.assetId);
        assert.ok(image,'Missing asset for '+block.assetId);
        return {mimeType:image.mimeType,originalName:image.originalName,
          byteSize:image.byteSize,width:image.width,height:image.height,base64:image.base64};
      })(),
    }:{kind:block.kind,text:block.text}),
  }));
}
function setInput(selector,value,tag='HTMLInputElement'){
  return "(()=>{const el=document.querySelector("+JSON.stringify(selector)+");if(!el)throw Error('missing input "+selector+"');Object.getOwnPropertyDescriptor("+tag+".prototype,'value').set.call(el,"+JSON.stringify(value)+");el.dispatchEvent(new Event('input',{bubbles:true}))})()";
}
async function addSyntheticImage(tab,mime,name,w,h,shade){
  const command="(async()=>{"+
    "const c=document.createElement('canvas');c.width="+w+";c.height="+h+";"+
    "const context=c.getContext('2d');context.fillStyle="+JSON.stringify(shade)+";context.fillRect(0,0,c.width,c.height);"+
    "context.fillStyle='#f0ca54';context.fillRect(0,0,4,4);"+
    "const blob=await new Promise(resolve=>c.toBlob(resolve,"+JSON.stringify(mime)+",0.84));"+
    "if(!blob||blob.type!=="+JSON.stringify(mime)+")throw Error('Unsupported test MIME');"+
    "const dt=new DataTransfer();dt.items.add(new File([blob],"+JSON.stringify(name)+",{type:blob.type}));"+
    "const input=document.querySelector('.section-editor .add-block input[type=file]');if(!input)throw Error('Missing upload');"+
    "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}))})()";
  await tab.evaluate(command);
}
let a,b;
try{
  a=await launch('A');
  const originalA=await a.evaluate(snapshotJS);
  assert.equal(originalA.docs.length,1);
  await a.evaluate(setInput('.project-layout .form-grid .field-wide input','EXPORT_A_WORKSPACE_20261019'));
  await a.evaluate(setInput('.project-layout .form-grid .field-wide:nth-child(2) input','CROSS_PROFILE_TITLE_4816'));
  await a.evaluate(setInput('.project-layout .form-grid .field:not(.field-wide) input','작성자 ABC'));
  await a.evaluate(setInput('.section-editor .section-editor-heading input','이식 검증 섹션'));
  await a.evaluate(setInput('.section-editor .block-editor textarea','CROSS_PROFILE_BEGIN_4816\n\n줄바꿈·공백  100% & <tag>\nCROSS_PROFILE_END_4816','HTMLTextAreaElement'));
  await a.evaluate("document.querySelectorAll('input[name=v2theme]')[3].click()");
  await a.evaluate("document.querySelectorAll('input[name=v2size]')[2].click()");
  await a.evaluate("document.querySelectorAll('input[name=v2font]')[1].click()");
  await a.evaluate("document.querySelectorAll('input[name=v2accent]')[3].click()");
  await addSyntheticImage(a,'image/png','transfer-portrait.png',40,70,'#a25e89');
  await until(()=>a.evaluate("document.querySelectorAll('.project-paper figure img').length"),n=>n===1);
  await until(()=>a.evaluate("document.querySelector('.section-editor .add-block input[type=file]')?.disabled"),v=>v===false);
  await addSyntheticImage(a,'image/webp','transfer-landscape.webp',84,36,'#1c7e99');
  await until(()=>a.evaluate("document.querySelectorAll('.project-paper figure img').length"),n=>n===2);
  await until(()=>a.evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  const snapA=await until(()=>a.evaluate(snapshotJS),s=>s.assets.length===2&&activeDocument(s)?.content.sections[0].blocks.length===3);
  const docA=activeDocument(snapA);
  assert.equal(docA.content.title,'CROSS_PROFILE_TITLE_4816');
  assert.equal(docA.design.theme,'compact');
  assert.equal(docA.design.font,'serif');
  assert.equal(docA.design.textSize,'large');
  assert.equal(docA.design.accent,'#aa593c');
  assert.equal(snapA.assets.length,2);
  assert.ok(docA.content.sections[0].blocks[0].text.includes('CROSS_PROFILE_END_4816'));
  console.log('PASS STEP2 PROFILE A: synthetic paragraphs, metadata, design, PNG and WebP saved in isolated IndexedDB');

  await a.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:workspace});
  await a.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='프로젝트 내보내기').click()");
  const file=await until(()=>{
    const names=readdirSync(workspace).filter(n=>n.endsWith('.localdoc.json'));
    if(names.length!==1)return null;
    try{const raw=readFileSync(join(workspace,names[0]),'utf8');JSON.parse(raw);return{path:join(workspace,names[0]),raw};}catch{return null;}
  });
  const backed=JSON.parse(file.raw);
  assert.equal(backed.format,'astra-local-document');
  assert.equal(backed.formatVersion,1);
  assert.equal(backed.document.id,docA.id);
  assert.equal(backed.assets.length,2);
  for(const asset of backed.assets){
    assert.equal(asset.base64,snapA.assets.find(x=>x.id===asset.id)?.base64,'Export modified image bytes');
  }
  console.log('PASS STEP2 PROFILE A: actual downloaded .localdoc.json file has complete text, theme and byte-identical PNG/WebP');

  await a.close();a=null;
  b=await launch('B');
  const blankB=await b.evaluate(snapshotJS);
  assert.equal(blankB.docs.length,1);
  assert.equal(blankB.assets.length,0);
  assert.notEqual(blankB.active,docA.id);
  assert.equal(await b.evaluate("document.querySelector('.project-paper')?.textContent.includes('CROSS_PROFILE_BEGIN_4816')"),false);
  // Native Chrome File Input supplies the downloaded file itself, not a test-generated JSON object.
  const root=await b.send('DOM.getDocument',{depth:1});
  const input=await b.send('DOM.querySelector',{nodeId:root.root.nodeId,selector:'.hidden-input'});
  assert.ok(input.nodeId,'Missing project file import input');
  await b.send('DOM.setFileInputFiles',{files:[file.path],nodeId:input.nodeId});
  // Some Chrome versions dispatch input/change on file selection automatically.
  await until(()=>b.evaluate("document.querySelectorAll('.doc-list-item').length"),count=>count===2);
  await until(()=>b.evaluate("Boolean(document.querySelector('.project-paper')?.textContent.includes('CROSS_PROFILE_END_4816'))"));
  await until(()=>b.evaluate("document.querySelectorAll('.project-paper figure img').length"),n=>n===2);
  await until(()=>b.evaluate("Boolean([...document.querySelectorAll('.project-paper img')].every(img=>img.complete&&img.naturalWidth>0))"));
  const snapB=await until(()=>b.evaluate(snapshotJS),s=>s?.assets.length===2&&s?.docs.length===2);
  const docB=activeDocument(snapB);
  assert.ok(docB,'Imported active document missing');
  assert.notEqual(docB.id,docA.id,'Import reused the source document ID');
  assert.deepEqual(docB.design,docA.design);
  assert.deepEqual(docB.content, {...docA.content,sections:docB.content.sections},'Content title/author/date changed'); // section IDs deliberately regenerated
  assert.equal(docB.name,docA.name);
  assert.notEqual(docB.createdAt,docA.createdAt,'Imported copy should have a distinct creation timestamp');
  assert.ok(snapB.docs.some(d=>d.id===blankB.active),'Import replaced existing profile B document');
  assert.ok(!snapB.docs.find(d=>d.id===blankB.active)?.content.title.includes('CROSS_PROFILE_TITLE'));
  assert.ok(docA.content.sections.every((s,i)=>s.id!==docB.content.sections[i]?.id),'Import reused a source section ID');
  assert.ok(docA.content.sections[0].blocks.every((x,i)=>x.id!==docB.content.sections[0].blocks[i]?.id),'Import reused source block IDs');
  const oldIDs=new Set(snapA.assets.map(x=>x.id));
  assert.ok(snapB.assets.every(asset=>asset.documentId===docB.id&&!oldIDs.has(asset.id)),'Asset ID not changed');
  assert.deepEqual(normalizeBlocks(docB,snapB.assets),normalizeBlocks(docA,snapA.assets),
    'Cross-profile document text/caption/image bytes/order/size/alignment changed');
  assert.ok(docB.content.sections.flatMap(s=>s.blocks).filter(x=>x.kind==='image').every(x=>snapB.assets.some(a=>a.id===x.assetId)));
  console.log('PASS STEP2 PROFILE B: real downloaded JSON imported via native Chrome file picker; old blank document untouched');
  console.log('PASS STEP2 PROFILE B: exact text, dates, theme, PNG/WebP original bytes preserved with regenerated document/asset/section/block IDs');

  await b.reload();
  await until(()=>b.evaluate("Boolean(document.querySelector('.project-paper')?.textContent.includes('CROSS_PROFILE_END_4816'))"));
  await until(()=>b.evaluate("Boolean([...document.querySelectorAll('.project-paper img')].length===2&&[...document.querySelectorAll('.project-paper img')].every(i=>i.naturalWidth>0))"));
  assert.deepEqual(await b.evaluate(snapshotJS),snapB,'Imported project changed after browser reload');
  const printed=await b.send('Page.printToPDF',{printBackground:false,preferCSSPageSize:true});
  const pdfPath=join(workspace,'profile-b-imported-a4.pdf');
  writeFileSync(pdfPath,Buffer.from(printed.data,'base64'));
  assert.ok(execFileSync('pdfinfo',[pdfPath],{encoding:'utf8'}).includes('(A4)'));
  const text=execFileSync('pdftotext',[pdfPath,'-'],{encoding:'utf8'});
  assert.ok(text.includes('CROSS_PROFILE_BEGIN_4816')&&text.includes('CROSS_PROFILE_END_4816'));
  const list=execFileSync('pdfimages',['-list',pdfPath],{encoding:'utf8'});
  const embedded=list.split('\n').filter(line=>/^\s*\d+\s+\d+\s+image\s/.test(line));
  assert.ok(embedded.length>=2,'Imported PNG/WebP missing from actual Chrome A4 PDF');
  console.log('PASS STEP2 PROFILE B: imported document/2 images persist after reload and appear in real A4 PDF');
}finally{
  if(a)await a.close();
  if(b)await b.close();
  try{rmSync(workspace,{recursive:true,force:true,maxRetries:10,retryDelay:200});}
  catch(error){
    if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP2: ephemeral Chrome profile cleanup deferred ('+error.code+')');
  }
}
