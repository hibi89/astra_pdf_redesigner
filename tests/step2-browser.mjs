// End-to-end Chrome DevTools Protocol smoke: real IndexedDB, images, export/import and print.
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const chrome=process.env.CHROME_PATH||'chromium',url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const dir=mkdtempSync(join(tmpdir(),'astra-step2-'));const port=9338;
const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--no-first-run',`--user-data-dir=${dir}`,`--remote-debugging-port=${port}`,'about:blank'],{stdio:'ignore'});
let ws;let seq=1;const pending=new Map();const delay=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
function request(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=seq++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});}
async function eventually(fn,check=(value)=>!!value,timeout=15000){const begin=Date.now();while(Date.now()-begin<timeout){try{const val=await fn();if(check(val))return val;}catch(e){if(!/context was destroyed|navigated or closed|Cannot find context/i.test(String(e)))throw e;}await delay(150);}throw new Error('Browser condition timeout');}
try{
  let endpoint;
  for(let i=0;i<70;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);if(r.ok){endpoint=(await r.json()).webSocketDebuggerUrl;break;}}catch{}await delay(180);}
  if(!endpoint)throw new Error('Chrome did not start');ws=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(new Error(m.error.message));else p.resolve(m.result);}});
  const {targetId}=await request('Target.createTarget',{url});const {sessionId}=await request('Target.attachToTarget',{targetId,flatten:true});
  const send=(m,p)=>request(m,p??{},sessionId);
  const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  await send('Page.enable');await send('Runtime.enable');
  const reload=async()=>{let listener,timer;const loaded=new Promise((resolve,reject)=>{listener=e=>{const message=JSON.parse(e.data);if(message.method==='Page.loadEventFired'&&message.sessionId===sessionId){clearTimeout(timer);ws.removeEventListener('message',listener);resolve();}};ws.addEventListener('message',listener);timer=setTimeout(()=>{ws.removeEventListener('message',listener);reject(new Error('Reload timeout'));},15000);});try{await send('Page.reload',{ignoreCache:true});await loaded;}finally{clearTimeout(timer);ws.removeEventListener('message',listener);}};
  const fill=(selector,value,tag='HTMLInputElement')=>evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('missing '+${JSON.stringify(selector)});const setter=Object.getOwnPropertyDescriptor(${tag}.prototype,'value').set;setter.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await eventually(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active') && document.querySelector('.project-paper'))"));
  assert.equal(await evaluate("document.querySelectorAll('.section-editor').length"),1);
  await fill('.project-layout input[value="새 문서"]','문서함 이름');
  await fill('.section-editor .section-editor-heading input','검증용 섹션');
  await fill('.section-editor .block-editor textarea','STEP2_BEGIN 한글 원문\n\n123% STEP2_END','HTMLTextAreaElement');
  await eventually(()=>evaluate("document.querySelector('.project-paper .section-body')?.textContent"),x=>x==='STEP2_BEGIN 한글 원문\n\n123% STEP2_END');
  await evaluate("[...document.querySelectorAll('input[name=v2theme]')].at(-1).click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper').classList.contains('paper-theme-compact')"));
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  await reload();
  await eventually(()=>evaluate("document.querySelector('.project-paper .section-body')?.textContent"),x=>x==='STEP2_BEGIN 한글 원문\n\n123% STEP2_END');
  assert.equal(await evaluate("document.querySelector('.project-paper').classList.contains('paper-theme-compact')"),true);
  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),'문서함 이름');
  console.log('PASS STEP2: IndexedDB autosave/reload, paragraphs, theme, separate management name');
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('+ 섹션 추가')).click()");
  await eventually(()=>evaluate("document.querySelectorAll('.section-editor').length"),x=>x===2);
  await evaluate("document.querySelectorAll('.section-editor')[1].querySelector('button[aria-label*=\"위로 이동\"]').click()");
  assert.equal(await evaluate("document.querySelectorAll('.section-editor')[0].querySelector('input').value"),'새 섹션');
  console.log('PASS STEP2: add/reorder independent sections');
  // Valid PNG 2x2 with intact IDAT CRC (Chrome rejects malformed PNGs).
  const base64='iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGOUS3nGwMDAxMDAwMDAAAAQQgFsBOs6hwAAAABJRU5ErkJggg==';
  await evaluate(`(()=>{const b=Uint8Array.from(atob(${JSON.stringify(base64)}),c=>c.charCodeAt(0));const f=new File([b],'one.png',{type:'image/png'});const t=new DataTransfer();t.items.add(f);const e=document.querySelector('.section-editor .add-block input[type=file]');e.files=t.files;e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await eventually(()=>evaluate("Boolean(document.querySelector('.project-paper figure img')?.complete)"));
  const state=await evaluate("document.querySelectorAll('.project-paper img').length");assert.equal(state,1);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  await reload();
  await eventually(()=>evaluate("Boolean(document.querySelector('.project-paper img')?.naturalWidth)"));
  console.log('PASS STEP2: PNG image validation, IndexedDB persistence, object URL restore');
  await send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:dir});
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='프로젝트 내보내기').click()");
  await eventually(async()=>readdirSync(dir).find(name=>name.endsWith('.localdoc.json')));
  const exportName=readdirSync(dir).find(name=>name.endsWith('.localdoc.json'));assert.ok(exportName);
  const backup=readFileSync(join(dir,exportName),'utf8');assert.ok(backup.includes('STEP2_BEGIN'));
  assert.equal(JSON.parse(backup).assets.length,1);
  console.log('PASS STEP2: portable project JSON includes exact text and image bytes');
  const bad='{broken';
  await evaluate(`(()=>{const f=new File([${JSON.stringify(bad)}],'broken.json',{type:'application/json'});const dt=new DataTransfer();dt.items.add(f);const e=document.querySelector('.hidden-input');e.files=dt.files;e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await eventually(()=>evaluate("Boolean(document.querySelector('.warning')?.textContent.includes('JSON'))"));
  assert.ok(await evaluate("document.querySelector('.project-paper .section-body')?.textContent.includes('STEP2_BEGIN')"));
  await evaluate(`(()=>{const f=new File([${JSON.stringify(backup)}],'backup.json',{type:'application/json'});const dt=new DataTransfer();dt.items.add(f);const e=document.querySelector('.hidden-input');e.files=dt.files;e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),x=>x>=2);
  await eventually(()=>evaluate("Boolean(document.querySelector('.project-paper img')?.naturalWidth)"));
  await evaluate("window.confirm=()=>true;[...document.querySelectorAll('button')].find(b=>b.textContent==='문서 삭제').click()");
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),x=>x===1);
  assert.ok(await evaluate("document.querySelector('.project-paper .section-body')?.textContent.includes('STEP2_BEGIN')"));
  console.log('PASS STEP2: JSON import, invalid import rejection, independent copy survives delete');
  const pdfData=await send('Page.printToPDF',{printBackground:false,preferCSSPageSize:true});
  const file=join(dir,'step2.pdf');writeFileSync(file,Buffer.from(pdfData.data,'base64'));
  const pdfText=execFileSync('pdftotext',[file,'-'],{encoding:'utf8'});
  assert.ok(pdfText.includes('STEP2_BEGIN'));assert.ok(pdfText.includes('STEP2_END'));
  assert.ok(!pdfText.includes('문서함 이름')); // editing/list label should not bleed into PDF
  assert.ok(execFileSync('pdfinfo',[file],{encoding:'utf8'}).includes('A4'));
  console.log('PASS STEP2: Chrome A4 print with image/paragraphs and no editing UI');

  // Two document switch clicks within the same event turn must not race.
  const createBlank=()=>evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('+ 빈 문서')).click()");
  await createBlank();
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===2);
  await createBlank();
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===3);
  const choices=await evaluate(`(()=>{
    const buttons=[...document.querySelectorAll('.doc-list-item:not(.active)')];
    const first=buttons.find(b=>b.querySelector('strong')?.textContent==='문서함 이름');
    const second=buttons.find(b=>b!==first);
    if(!first||!second) throw new Error('expected two switchable documents');
    first.click(); second.click();
    return [first.querySelector('strong').textContent,second.querySelector('strong').textContent];
  })()`);
  assert.equal(choices[0], '문서함 이름');
  await eventually(()=>evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),x=>x==='문서함 이름');
  await eventually(()=>evaluate("document.querySelector('.project-paper .section-body')?.textContent"),x=>x===['STEP2_BEGIN 한글 원문','','123% STEP2_END'].join('\n'));
  await eventually(()=>evaluate("document.querySelector('.warning')?.textContent.includes('다른 문서 작업')"));
  await reload();
  await eventually(()=>evaluate("document.querySelector('.project-paper .section-body')?.textContent"),x=>x===['STEP2_BEGIN 한글 원문','','123% STEP2_END'].join('\n'));
  console.log('PASS STEP2: simultaneous document switch rejected; prior draft and active document survive reload');

  // Generate synthetic landscape JPEG and portrait WebP in Chrome itself.
  // Test the real browser decoders, persistence and exact original-file bytes.
  const formats=[
    {name:'landscape-test.jpg',mime:'image/jpeg',width:32,height:16},
    {name:'portrait-test.webp',mime:'image/webp',width:16,height:32},
  ];
  for(const fixture of formats){
    const existing=await evaluate("document.querySelectorAll('.project-paper figure img').length");
    const expr=[
      '(async()=>{',
      'const canvas=document.createElement("canvas");',
      'canvas.width='+fixture.width+';canvas.height='+fixture.height+';',
      'const context=canvas.getContext("2d");',
      'context.fillStyle="#1577aa";context.fillRect(0,0,canvas.width,canvas.height);',
      'context.fillStyle="#e34a88";context.fillRect(2,2,7,7);',
      'const blob=await new Promise(resolve=>canvas.toBlob(resolve,'+JSON.stringify(fixture.mime)+',0.82));',
      'if(!blob||blob.type!=='+JSON.stringify(fixture.mime)+')throw Error("browser unsupported image MIME");',
      'const file=new File([blob],'+JSON.stringify(fixture.name)+',{type:blob.type});',
      'const bytes=new Uint8Array(await blob.arrayBuffer());',
      'const encoded=btoa(String.fromCharCode(...bytes));',
      'const transfer=new DataTransfer();transfer.items.add(file);',
      'const input=document.querySelector(".section-editor .add-block input[type=file]");',
      'if(!input)throw Error("missing image input");',
      'input.files=transfer.files;input.dispatchEvent(new Event("change",{bubbles:true}));',
      'return encoded;',
      '})()'
    ].join('\n');
    fixture.base64=await evaluate(expr);
    await eventually(()=>evaluate("document.querySelectorAll('.project-paper figure img').length"),n=>n===existing+1);
    await eventually(()=>evaluate("(()=>{const img=[...document.querySelectorAll('.project-paper figure img')].at(-1);return img&&img.complete?[img.naturalWidth,img.naturalHeight]:null;})()"),
      dims=>dims?.[0]===fixture.width&&dims?.[1]===fixture.height);
    await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),s=>s==='저장됨');
  }
  await reload();
  await eventually(()=>evaluate("(()=>{const imgs=[...document.querySelectorAll('.project-paper figure img')];return imgs.length===3&&imgs.every(img=>img.complete&&img.naturalWidth>0)?imgs.map(img=>[img.naturalWidth,img.naturalHeight]):null;})()"),
    dims=>dims?.some(([w,h])=>w===32&&h===16)&&dims?.some(([w,h])=>w===16&&h===32));
  console.log('PASS STEP2: actual JPEG landscape and WebP portrait decode, IndexedDB reload and exact dimensions');

  // Capture the JSON Blob before the download; repeated browser downloads may be blocked or renamed.
  await evaluate('(()=>{const original=URL.createObjectURL.bind(URL);URL.createObjectURL=(blob)=>{if(blob.type==="application/json")window.__astraExportBlob=blob;return original(blob);};})()');
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='프로젝트 내보내기').click()");
  const exportedJson=await eventually(()=>evaluate('(async()=>window.__astraExportBlob?await window.__astraExportBlob.text():null)()'));
  const packageData=JSON.parse(exportedJson);
  assert.equal(packageData.assets.length,3);
  for(const fixture of formats){
    const asset=packageData.assets.find(item=>item.originalName===fixture.name);
    assert.ok(asset,'Missing image in JSON project backup: '+fixture.name);
    assert.equal(asset.mimeType,fixture.mime);
    assert.equal(asset.width,fixture.width);
    assert.equal(asset.height,fixture.height);
    assert.ok(Buffer.from(asset.base64,'base64').equals(Buffer.from(fixture.base64,'base64')),
      'Backup modified original file bytes: '+fixture.name);
  }
  console.log('PASS STEP2: JPEG/WebP stored without modification and exported in JSON with exact bytes');

  const multiPdf=join(dir,'jpeg-webp-a4.pdf');
  const printed=await send('Page.printToPDF',{printBackground:false,preferCSSPageSize:true});
  writeFileSync(multiPdf,Buffer.from(printed.data,'base64'));
  assert.ok(execFileSync('pdfinfo',[multiPdf],{encoding:'utf8'}).includes('A4'));
  assert.ok(execFileSync('pdftotext',[multiPdf,'-'],{encoding:'utf8'}).includes('STEP2_BEGIN'));
  const imageOutput=execFileSync('pdfimages',['-list',multiPdf],{encoding:'utf8'});
  const rasterRows=imageOutput.split('\n').filter(line=>/^\s*\d+\s+\d+\s+image\s/.test(line));
  assert.ok(rasterRows.length>=3,'PDF embedded fewer than three PNG/JPEG/WebP image rasters');
  console.log('PASS STEP2: Chrome A4 PDF embeds all three PNG/JPEG/WebP images');

  // Inject a one-time QuotaExceededError into the actual IndexedDB document write.
  // The draft, persisted document, unload guard, emergency backup and retry must remain safe.
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  const persistedCode="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const active=await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});const doc=await new Promise((resolve,reject)=>{const r=db.transaction('documents','readonly').objectStore('documents').get(active);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return doc.content.sections.flatMap(s=>s.blocks).filter(b=>b.kind==='paragraph').map(b=>b.text).join('|')}finally{db.close()}})()";
  const baseline=await evaluate(persistedCode);
  await evaluate("(()=>{const original=IDBDatabase.prototype.transaction;let failing=true;IDBDatabase.prototype.transaction=function(stores,mode,...options){if(failing&&mode==='readwrite'&&stores==='documents'){failing=false;IDBDatabase.prototype.transaction=original;throw new DOMException('Injected QuotaExceededError, test only','QuotaExceededError')}return original.call(this,stores,mode,...options)}})()");
  const recoveryText='SAVE_FAILURE_RECOVERY_987654';
  await fill('.section-editor .block-editor textarea',recoveryText,'HTMLTextAreaElement');
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),value=>value==='저장 실패');
  assert.ok(await evaluate("document.querySelector('.warning')?.textContent.includes('Injected QuotaExceededError')"));
  assert.ok(await evaluate("document.querySelector('.project-paper')?.textContent.includes('SAVE_FAILURE_RECOVERY_987654')"));
  assert.equal(await evaluate(persistedCode),baseline,'Failed IndexedDB transaction modified persisted document');
  assert.equal(await evaluate("(()=>{const e=new Event('beforeunload',{cancelable:true});window.dispatchEvent(e);return e.defaultPrevented})()"),true);
  console.log('PASS STEP2: injected QuotaExceededError preserves persisted document, memory draft and unload protection');

  // The backup must use current in-memory content even when the last save failed.
  await evaluate("window.__astraExportBlob=null;[...document.querySelectorAll('button')].find(b=>b.textContent==='프로젝트 내보내기').click()");
  const emergencyBackup=await eventually(()=>evaluate('(async()=>window.__astraExportBlob?await window.__astraExportBlob.text():null)()'));
  assert.ok(JSON.parse(emergencyBackup).document.content.sections.some(s=>s.blocks.some(b=>b.text==='SAVE_FAILURE_RECOVERY_987654')));
  console.log('PASS STEP2: emergency JSON export contains unsaved text and attached images');

  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('지금 저장 / 재시도')).click()");
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),value=>value==='저장됨');
  await eventually(()=>evaluate("!document.querySelector('.warning')?.textContent.includes('Injected QuotaExceededError')"));
  assert.ok((await evaluate(persistedCode)).includes(recoveryText),'Save retry did not persist latest draft');
  await reload();
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),value=>value?.includes('SAVE_FAILURE_RECOVERY_987654'));
  console.log('PASS STEP2: manual save retry persists unsaved edits and survives reload');

  // Force an IndexedDB transaction abort after putting the new image asset.
  // All queued document/asset mutations must roll back atomically.
  const imageSnapshotCode="(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{const ask=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});const active=await ask(db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId'));const doc=await ask(db.transaction('documents','readonly').objectStore('documents').get(active));const assets=await ask(db.transaction('assets','readonly').objectStore('assets').index('documentId').getAll(active));const entries=await Promise.all(assets.map(async asset=>({id:asset.id,mime:asset.mimeType,name:asset.originalName,bytes:btoa(String.fromCharCode(...new Uint8Array(await asset.blob.arrayBuffer())))})));entries.sort((a,b)=>a.id.localeCompare(b.id));return{docId:active,imageIds:doc.content.sections.flatMap(s=>s.blocks.filter(b=>b.kind==='image').map(b=>b.assetId)),entries}}finally{db.close()}})()";
  const imagesBefore=await evaluate(imageSnapshotCode);
  assert.equal(imagesBefore.imageIds.length,3);
  assert.equal(imagesBefore.entries.length,3);
  await evaluate("(()=>{const original=IDBObjectStore.prototype.put;let fired=false;IDBObjectStore.prototype.put=function(value,...args){const req=original.call(this,value,...args);if(!fired&&this.name==='assets'&&value?.originalName==='rollback-replacement.png'){fired=true;const tx=this.transaction;queueMicrotask(()=>{window.__astraForcedRollback=true;try{tx.abort()}finally{IDBObjectStore.prototype.put=original}})}return req};window.__astraForcedRollback=false})()");
  const replaceImageCode="(async()=>{const canvas=document.createElement('canvas');canvas.width=8;canvas.height=4;const ctx=canvas.getContext('2d');ctx.fillStyle='#d37e22';ctx.fillRect(0,0,8,4);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Cannot generate replacement PNG');const file=new File([blob],'rollback-replacement.png',{type:'image/png'});const transfer=new DataTransfer();transfer.items.add(file);const input=document.querySelector('.block-editor input[type=file]');if(!input)throw Error('Missing image replacement input');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}))})()";
  await evaluate(replaceImageCode);
  await eventually(()=>evaluate("window.__astraForcedRollback===true"));
  await eventually(()=>evaluate("document.querySelector('.warning')?.textContent"),txt=>Boolean(txt?.trim()));
  assert.deepEqual(await evaluate(imageSnapshotCode),imagesBefore,'Aborted replacement changed document, assets or original bytes');
  assert.equal(await evaluate("document.querySelectorAll('.project-paper figure img').length"),3);
  assert.equal(await evaluate("Boolean([...document.querySelectorAll('.project-paper figure img')].every(img=>img.complete&&img.naturalWidth>0))"),true);
  console.log('PASS STEP2: aborted real image replacement atomically rolls back doc, asset put and old asset delete');

  await reload();
  await eventually(()=>evaluate("document.querySelectorAll('.project-paper figure img').length"),n=>n===3);
  await eventually(()=>evaluate("Boolean([...document.querySelectorAll('.project-paper figure img')].every(img=>img.naturalWidth>0))"));
  assert.deepEqual(await evaluate(imageSnapshotCode),imagesBefore,'Reload after abort did not preserve exact original image bytes');
  console.log('PASS STEP2: original image refs and exact bytes survive reload after failed replacement');

  await evaluate(replaceImageCode);
  await eventually(()=>evaluate(imageSnapshotCode),s=>s?.entries?.some(a=>a.name==='rollback-replacement.png')&&s.entries.length===3);
  const imagesAfter=await evaluate(imageSnapshotCode);
  assert.equal(imagesAfter.entries.length,3,'Successful replacement left orphan assets');
  assert.equal(imagesAfter.imageIds.length,3);
  assert.ok(!imagesAfter.entries.some(a=>a.id===imagesBefore.imageIds[0]),'Original replaced asset not deleted');
  assert.ok(imagesAfter.imageIds.every(id=>imagesAfter.entries.some(a=>a.id===id)),'Document references missing asset');
  await reload();
  await eventually(()=>evaluate("Boolean([...document.querySelectorAll('.project-paper figure img')].some(img=>img.naturalWidth===8&&img.naturalHeight===4))"));
  assert.deepEqual(await evaluate(imageSnapshotCode),imagesAfter);
  console.log('PASS STEP2: retry commits replacement without orphan assets; persisted document and image survive reload');

  // A4 pagination: large portrait image at a paragraph boundary, short caption
  // kept on same page, then a long caption split across several pages.
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('+ 빈 문서')).click()");
  await eventually(()=>evaluate("document.querySelectorAll('.project-paper figure img').length"),n=>n===0);
  const preceding=Array.from({length:37},(_,i)=>'BEFORE_IMAGE_LINE_'+String(i+1).padStart(3,'0')).join('\n');
  await fill('.section-editor .block-editor textarea',preceding,'HTMLTextAreaElement');
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  const uploadPortrait="(async()=>{const c=document.createElement('canvas');c.width=1200;c.height=2500;const ctx=c.getContext('2d');ctx.fillStyle='#e7b35a';ctx.fillRect(0,0,1200,2500);ctx.fillStyle='#315183';ctx.fillRect(0,0,1200,200);ctx.fillStyle='#c13b68';ctx.fillRect(0,2300,1200,200);const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('Canvas encode failed');const dt=new DataTransfer();dt.items.add(new File([blob],'a4-portrait-1200x2500.png',{type:'image/png'}));const input=document.querySelector('.section-editor .add-block input[type=file]');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}))})()";
  await evaluate(uploadPortrait);
  await eventually(()=>evaluate("(()=>{const i=document.querySelector('.project-paper figure img');return i&&i.complete?[i.naturalWidth,i.naturalHeight]:null})()"),v=>v?.[0]===1200&&v?.[1]===2500);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  const updateCaption=(value)=>evaluate("(()=>{const label=[...document.querySelectorAll('.block-editor label')].find(x=>x.textContent.includes('이미지 설명'));const input=label?.querySelector('input');if(!input)throw Error('Missing caption input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,"+JSON.stringify(value)+");input.dispatchEvent(new Event('input',{bubbles:true}))})()");
  const shortCaption='SHORT_CAPTION_A4_BOUNDARY_9001';
  await updateCaption(shortCaption);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  const printA4=async(name)=>{
    const path=join(dir,name);
    const pdf=await send('Page.printToPDF',{printBackground:false,preferCSSPageSize:true});
    writeFileSync(path,Buffer.from(pdf.data,'base64'));
    const info=execFileSync('pdfinfo',[path],{encoding:'utf8'});
    assert.ok(info.includes('(A4)'),'Expected actual A4 PDF');
    const pages=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
    assert.ok(pages>=2);
    const fullText=execFileSync('pdftotext',[path,'-'],{encoding:'utf8'});
    const imgInfo=execFileSync('pdfimages',['-list',path],{encoding:'utf8'});
    const imagePages=imgInfo.split('\n').filter(x=>/^\s*\d+\s+\d+\s+image\s/.test(x)).map(x=>Number(x.trim().split(/\s+/)[0]));
    assert.ok(imagePages.length>=1,'Image missing in printed PDF');
    return{path,pages,fullText,imagePages};
  };
  const shortPrint=await printA4('step2-short-caption.pdf');
  assert.ok(shortPrint.fullText.includes('BEFORE_IMAGE_LINE_001'));
  assert.ok(shortPrint.fullText.includes('BEFORE_IMAGE_LINE_037'));
  assert.equal(shortPrint.fullText.split(shortCaption).length-1,1);
  const captionPage=Array.from({length:shortPrint.pages},(_,i)=>i+1).find(n=>execFileSync('pdftotext',['-f',String(n),'-l',String(n),shortPrint.path,'-'],{encoding:'utf8'}).includes(shortCaption));
  assert.ok(shortPrint.imagePages.includes(captionPage),'Image and short caption must share the same printable page');
  console.log('PASS STEP2: tall portrait with short caption stays together at A4 boundary');

  const first='LONG_CAPTION_START_8162', last='LONG_CAPTION_END_8162';
  const longCaption=[first,...Array.from({length:190},(_,i)=>'CAPTION_ROW_'+String(i+1).padStart(3,'0')+' 원문을 보존하는 여러 페이지 길이의 설명입니다.'),last].join('\n');
  await updateCaption(longCaption);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  const longPrint=await printA4('step2-long-caption.pdf');
  assert.ok(longPrint.pages>shortPrint.pages,'Long caption should span additional pages');
  assert.equal(longPrint.fullText.split(first).length-1,1);
  assert.equal(longPrint.fullText.split(last).length-1,1);
  assert.ok(longPrint.fullText.includes('CAPTION_ROW_001')&&longPrint.fullText.includes('CAPTION_ROW_190'));
  assert.ok(longPrint.fullText.includes('BEFORE_IMAGE_LINE_037'));
  console.log('PASS STEP2: long image caption spans additional A4 pages, full content retained');

  const bbox=execFileSync('pdftotext',['-bbox-layout',longPrint.path,'-'],{encoding:'utf8'});
  const bounds=[...bbox.matchAll(/<page width="([\d.]+)" height="([\d.]+)"/g)].map(m=>({w:Number(m[1]),h:Number(m[2])}));
  assert.equal(bounds.length,longPrint.pages);
  const segments=bbox.split(/<page width="[\d.]+" height="[\d.]+">/).slice(1);
  let count=0;
  for(let p=0;p<segments.length;p++){
    for(const m of segments[p].matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">/g)){
      const coords=m.slice(1).map(Number);
      assert.ok(coords[0]>=0&&coords[1]>=0&&coords[2]<=bounds[p].w+0.5&&coords[3]<=bounds[p].h+0.5,
        'PDF word escaped A4 page '+String(p+1));
      count++;
    }
  }
  assert.ok(count>200,'Expected multi-page extracted text coordinates');
  console.log('PASS STEP2: word bounding boxes remain within A4 media bounds');

  // Requirement audit: a rapid switch to the legacy mode must flush the current
  // in-memory document instead of cancelling the 450ms debounce on unmount.
  const quickText='FAST_MODE_SWITCH_SAVED_20261019';
  await evaluate("(()=>{const el=document.querySelector('.section-editor .block-editor textarea');const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;set.call(el,"+JSON.stringify(quickText)+");el.dispatchEvent(new Event('input',{bubbles:true}));const button=[...document.querySelectorAll('button')].find(b=>b.textContent==='기존 회고록 편집');if(!button)throw Error('mode switch button missing');button.click()})()");
  await eventually(()=>evaluate("Boolean(document.querySelector('.mode-bar')&&document.querySelector('button.print-button'))"));
  await evaluate("[...document.querySelectorAll('.mode-bar button')].find(b=>b.textContent.includes('개인 문서 제작기로 돌아가기')).click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(quickText)+")"));
  await reload();
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(quickText)+")"));
  console.log('PASS STEP2: immediate legacy-mode switch flushes pending edit; mode return and reload preserve text');

  // A failed write must block navigation, preserve the draft and show an error.
  await evaluate("(()=>{const original=IDBDatabase.prototype.transaction;let fail=true;IDBDatabase.prototype.transaction=function(stores,mode,...options){if(fail&&stores==='documents'&&mode==='readwrite'){fail=false;IDBDatabase.prototype.transaction=original;throw new DOMException('Injected mode-switch write failure','QuotaExceededError')}return original.call(this,stores,mode,...options)}})()");
  const failedText='FAILED_MODE_SWITCH_RECOVERY_20261019';
  await evaluate("(()=>{const el=document.querySelector('.section-editor .block-editor textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,"+JSON.stringify(failedText)+");el.dispatchEvent(new Event('input',{bubbles:true}));[...document.querySelectorAll('button')].find(b=>b.textContent==='기존 회고록 편집').click()})()");
  await eventually(()=>evaluate("document.querySelector('.warning')?.textContent.includes('Injected mode-switch write failure')"));
  assert.ok(await evaluate("Boolean(document.querySelector('.project-paper')&&!document.querySelector('.mode-bar'))"),'Navigation occurred despite save failure');
  assert.ok(await evaluate("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(failedText)+")"),'Unsaved draft lost after failed navigation');
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('지금 저장 / 재시도')).click()");
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='기존 회고록 편집').click()");
  await eventually(()=>evaluate("Boolean(document.querySelector('.mode-bar'))"));
  await evaluate("[...document.querySelectorAll('.mode-bar button')].find(b=>b.textContent.includes('개인 문서 제작기로 돌아가기')).click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(failedText)+")"));
  console.log('PASS STEP2: failed mode switch write blocks navigation and preserves in-memory text; retry succeeds');






}finally{if(ws)ws.close();proc.kill('SIGTERM');await delay(300);rmSync(dir,{recursive:true,force:true});}
