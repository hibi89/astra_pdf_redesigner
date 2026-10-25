// STEP3 true browser upload: synth PDF -> PDF.js review -> new IndexedDB doc -> themed A4 print.
import assert from 'node:assert/strict';
import {spawnSync,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {makeClippedImagePdf} from './fixtures/step3-clipped-pdf.mjs';
import {makeMixedLayoutPdf,MIXED_LAYOUT_MARKERS} from './fixtures/step3-mixed-layout-pdf.mjs';
import {makeTransparencyFormPdf} from './fixtures/step3-transparency-form-pdf.mjs';
import {auditPdfBytes} from './pdf-integrity-audit.mjs';
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
  const html='<html><head><meta charset="UTF-8"><style>@page{size:A4}body{font-family:sans-serif;margin:70px}h1{font-size:28px}p{font-size:14px;line-height:2}.next{break-before:page;page-break-before:always}img{display:block;width:180px;height:110px;object-fit:contain}</style></head>'+
    '<body><h1>STEP3_TEST_BEGIN_7519</h1><p>선택 가능한 한글 PDF ABC-123 100%</p>'+
    '<p>두 번째 문단 2/3 입력 &amp; 저장 확인</p>'+
    '<div id="page2" class="next"><p>STEP3_PAGE2_BEGIN_7519</p><p>여기는 2페이지의 내용입니다.</p></div></body></html>';
  await evaluate('document.open();document.write('+JSON.stringify(html)+');document.close()');
  await evaluate("(async()=>{const c=document.createElement('canvas');c.width=120;c.height=80;"+
    "const ctx=c.getContext('2d');ctx.fillStyle='#1b74bc';ctx.fillRect(0,0,120,80);"+
    "ctx.fillStyle='#ffbf35';ctx.fillRect(15,12,74,54);ctx.fillStyle='#183f70';ctx.fillRect(65,25,40,38);"+
    "const img=new Image();img.src=c.toDataURL('image/png');img.alt='TEST_RECOVERABLE_IMAGE';"+
    "document.querySelector('#page2').append(img);await img.decode();"+
    "const end=document.createElement('p');end.textContent='STEP3_TEST_END_7519';"+
    "document.querySelector('#page2').append(end);return true;})()");
  await eventually(()=>evaluate("Boolean(document.body.textContent.includes('STEP3_TEST_END_7519')&&document.images.length===1&&document.images[0].complete)"));
  const pdf=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:false});
  const srcPath=join(dir,'step3-fixture-source.pdf');
  writeFileSync(srcPath,Buffer.from(pdf.data,'base64'));
  const srcInfo=execFileSync('pdfinfo',[srcPath],{encoding:'utf8'});
  const srcImages=execFileSync('pdfimages',['-list',srcPath],{encoding:'utf8'});
  assert.ok(/Pages:\s*[2-9]/.test(srcInfo),'Synthetic PDF should span multiple pages');
  assert.ok(/^\s*\d+\s+\d+\s+image/m.test(srcImages),'Fixture PDF must actually contain a bitmap XObject');
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
  const recoveredSummary=await evaluate("document.querySelector('[data-step3-image-count]')?.textContent");
  console.log('STEP3 IMAGE SUMMARY:',recoveredSummary);
  assert.match(recoveredSummary??'',/PNG 복원 [1-9]/,'PDF.js must recover a bitmap from actual Chrome/Edge-generated PDF');
  assert.ok(await evaluate("document.querySelectorAll('.step3-image-thumbnail').length")>=1,
    'Image review thumbnail must be visible before user confirms');
  assert.ok(await evaluate("document.querySelectorAll('.step3-block-review details').length")>=2,
    'Two independent PDF pages must be visible for review');
  console.log('PASS STEP3 MULTIPAGE/IMAGE REVIEW: source image decoded and recovered with explicit count');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),before,'Review touched persisted document list');
  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),original,'Review switched active document');
  const hasSource=await evaluate("Boolean(document.querySelector('.step3-import-panel iframe[src^=blob]'))");
  assert.equal(hasSource,true,'Original PDF view missing');
  console.log('PASS STEP3 REVIEW: browser-local PDF.js extraction, preview, provenance and no premature document writes');
  const edits=await evaluate("document.querySelectorAll('.step3-block-review textarea').length");
  assert.ok(edits>=2,'Expected extracted text blocks');
  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').click()");
  await evaluate("(()=>{const b=[...document.querySelectorAll('.step3-import-panel button')].find(b=>b.textContent.includes('검수 결과를 새 문서로 저장'));if(!b||b.disabled)throw Error('PDF confirm disabled');b.click();})()");
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===before+1);
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),t=>t?.includes('STEP3_TEST_BEGIN_7519')&&t.includes('STEP3_PAGE2_BEGIN_7519')&&t.includes('STEP3_TEST_END_7519'));
  assert.ok(await evaluate("document.querySelectorAll('.project-paper img').length")>=1,'Recovered PNG must render in new document');
  await eventually(()=>evaluate("Promise.all([...document.querySelectorAll('.project-paper img')].map(img=>img.decode().then(()=>true,()=>false))).then(x=>x.every(Boolean))"));

  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent?.includes('step3-sample')"),true);
  assert.equal(await evaluate("document.querySelector('.section-editor .help-text')?.textContent?.includes('원본 PDF 출처')"),true);
  console.log('PASS STEP3 IMPORT: review creates independent active V2 document with PDF source provenance');

  // M06-A source coordinate → genuine PDF.js page canvas with positional
  // overlay; review remains opt-in and cannot mark content as verified by itself.
  const m06Before=await eventually(()=>evaluate("document.querySelector('[data-m06-progress]')?.textContent"),
    s=>s?.includes('수동 대조 0/'));
  const m06Count=await evaluate("document.querySelectorAll('.m06-block-origin[data-m06-page]').length");
  assert.ok(m06Count>=2,'M06 expects imported source coordinate blocks');
  assert.ok(m06Before.includes('검수 미완료'),'Unreviewed source must be flagged');
  const chosen=await evaluate("(()=>{const hit=[...document.querySelectorAll('.m06-block-origin')].find(x=>x.getAttribute('data-m06-page')==='2');if(!hit)throw Error('No page 2 source block');hit.querySelector('[data-m06-open]').click();return hit.parentElement.getAttribute('data-m06-block-id')})()");
  const m06View=await eventually(()=>evaluate("(()=>{const p=document.querySelector('[data-m06-preview][data-m06-rendered-page]');const c=p?.querySelector('canvas');const marker=p?.querySelector('[data-m06-anchor-rect]');return p&&c?.width>0&&c?.height>0&&marker?{id:p.getAttribute('data-m06-block-id'),page:p.getAttribute('data-m06-rendered-page'),width:c.width,height:c.height,rect:marker.getBoundingClientRect().width}:null})()"),
    x=>x&&x.id===chosen&&x.page==='2'&&x.rect>0);
  assert.ok(m06View.width>300&&m06View.height>500,'PDF.js must rasterize the actual source page');
  assert.ok(await evaluate("Boolean(document.querySelector('.m06-focused-block[data-m06-block-id='+JSON.stringify(chosen)+']'))"),
    'Selected extracted editor block must be highlighted');
  assert.equal(await evaluate("document.querySelector('[data-m06-progress]')?.textContent.includes('수동 대조 0/')"),true);
  await evaluate("document.querySelector('.m06-focused-block [data-m06-check]').click()");
  await eventually(()=>evaluate("document.querySelector('[data-m06-progress]')?.textContent"),t=>t?.includes('수동 대조 1/'));
  assert.ok(await evaluate("document.querySelector('.m06-focused-block [data-m06-check]')?.getAttribute('aria-pressed')==='true'"));
  console.log('PASS M06 CLICK-THROUGH: actual PDF.js rendered page 2; viewport bbox highlight; explicit 1/'+m06Count+' manual-review badge');


  // M03 actual React user flow: opt-in proposal -> reject -> accept -> undo.
  const extraParagraph=await evaluate("(()=>{const section=document.querySelector('.project-layout .section-editor');if(!section)throw Error('No editable section');const before=section.querySelectorAll('.block-editor').length;const add=[...section.querySelectorAll('.add-block button')].find(b=>b.textContent.includes('본문'));if(!add||add.disabled)throw Error('No enabled add paragraph button');add.click();return before})()");
  await eventually(()=>evaluate("document.querySelector('.project-layout .section-editor')?.querySelectorAll('.block-editor').length"),n=>n===extraParagraph+1);
  await evaluate("(()=>{const section=document.querySelector('.project-layout .section-editor');const last=[...section.querySelectorAll('.block-editor')].at(-1);const textarea=last?.querySelector('textarea');if(!textarea)throw Error('New paragraph textarea missing');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(textarea,'문서를  확인하였습니다.');textarea.dispatchEvent(new Event('input',{bubbles:true}))})()");
  await eventually(()=>evaluate("[...document.querySelector('.project-layout .section-editor').querySelectorAll('.block-editor textarea')].at(-1)?.value"),v=>v==='문서를  확인하였습니다.');
  await evaluate("(()=>{const last=[...document.querySelector('.project-layout .section-editor').querySelectorAll('.block-editor')].at(-1);const b=last?.querySelector('[data-m03-check]');if(!b||b.disabled)throw Error('Missing opt-in rule review');b.click()})()");
  await eventually(()=>evaluate("[...document.querySelectorAll('[data-m03-proposal] [data-m03-after]')].at(-1)?.textContent"),v=>v==='문서를 확인했습니다.');
  assert.ok(await evaluate("Boolean(document.querySelector('[data-m03-before] del')&&document.querySelector('[data-m03-after] ins'))"),
    'M03 must show an actual inline before/after difference');
  await evaluate("document.querySelector('[data-m03-reject]').click()");
  assert.equal(await evaluate("[...document.querySelector('.project-layout .section-editor').querySelectorAll('.block-editor textarea')].at(-1)?.value"),'문서를  확인하였습니다.');
  await evaluate("([...document.querySelector('.project-layout .section-editor').querySelectorAll('[data-m03-check]')].at(-1)).click()");
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-m03-accept]'))"));
  await evaluate("document.querySelector('[data-m03-accept]').click()");
  await eventually(()=>evaluate("[...document.querySelector('.project-layout .section-editor').querySelectorAll('.block-editor textarea')].at(-1)?.value"),v=>v==='문서를 확인했습니다.');
  await evaluate("([...document.querySelector('.project-layout .section-editor').querySelectorAll('[data-m03-undo]')].at(-1)).click()");
  await eventually(()=>evaluate("[...document.querySelector('.project-layout .section-editor').querySelectorAll('.block-editor textarea')].at(-1)?.value"),v=>v==='문서를  확인하였습니다.');
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),v=>v==='저장됨');
  console.log('PASS M03 OPT-IN RULE REVIEW: real React rejection, explicit acceptance, visible diff, undo, persisted original restored; no LLM claim');

  // M02: source survives a successful commit but only as a temporary Blob URL.
  const initialSource=await eventually(()=>evaluate("(()=>{const panel=document.querySelector('.studio-source-panel');return panel&&{id:panel.getAttribute('data-source-document-id'),title:panel.querySelector('iframe')?.title,url:panel.querySelector('iframe')?.src,visible:!!panel.querySelector('iframe')}})()"));
  assert.ok(initialSource.id&&initialSource.title==='가져온 원본 PDF'&&
    initialSource.url.startsWith('blob:')&&initialSource.visible,'Source comparison must show alongside the active output');
  const importedDocId=await evaluate("(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{return await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('activeDocumentId');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{db.close()}})()");
  assert.equal(initialSource.id,importedDocId,'Visible source must be tied to the active project id');
  const sourceHash=await evaluate("(async()=>{const url=document.querySelector('.studio-source-panel iframe').src;const data=await (await fetch(url)).arrayBuffer();const digest=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')})()");
  assert.equal(sourceHash,createHash('sha256').update(Buffer.from(pdf.data,'base64')).digest('hex'),
    'Retained in-memory original differs byte-for-byte from uploaded PDF');
  console.log('PASS M02 SOURCE AFTER COMMIT: same document id, active iframe, byte-identical local PDF; no source DB storage');
  // M02: Capture actual REPORT print before switching to MINIMAL, not CSS-only assertions.
  const reportPdf=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true});
  const reportPath=join(dir,'m02-report.pdf');
  writeFileSync(reportPath,Buffer.from(reportPdf.data,'base64'));
  const reportText=execFileSync('pdftotext',[reportPath,'-'],{encoding:'utf8'});
  assert.ok(reportText.includes('STEP3_TEST_BEGIN_7519')&&reportText.includes('STEP3_TEST_END_7519'));
  const themeBefore=await evaluate("document.querySelector('.project-paper')?.className");
  await evaluate("document.querySelectorAll('input[name=v2theme]')[1].click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.className"),v=>v!==themeBefore);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  const minimalPdf=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true});
  const minimalPath=join(dir,'m02-minimal.pdf');
  writeFileSync(minimalPath,Buffer.from(minimalPdf.data,'base64'));
  const minimalText=execFileSync('pdftotext',[minimalPath,'-'],{encoding:'utf8'});
  for(const marker of ['STEP3_TEST_BEGIN_7519','STEP3_PAGE2_BEGIN_7519','STEP3_TEST_END_7519']){
    assert.ok(reportText.includes(marker)&&minimalText.includes(marker),
      'PDF source content must survive both layouts: '+marker);
  }
  const wordPosition=file=>{
    const bbox=execFileSync('pdftotext',['-bbox',file,'-'],{encoding:'utf8'});
    const match=bbox.match(/<word\s+([^>]+)>STEP3_TEST_BEGIN_7519<\/word>/);
    if(!match)throw Error('Cannot locate title bbox in themed A4 PDF');
    const attributes=Object.fromEntries([...match[1].matchAll(/(xMin|yMin|xMax|yMax)="([^"]+)"/g)].map(m=>[m[1],Number(m[2])]));
    return attributes;
  };
  const reportBox=wordPosition(reportPath),minimalBox=wordPosition(minimalPath);
  assert.ok(Math.abs(reportBox.yMin-minimalBox.yMin)>8||Math.abs(reportBox.xMin-minimalBox.xMin)>8,
    'M02 requires actual PDF title positions to differ, not only color/theme ID');
  console.log('PASS M02 ACTUAL A4 DESIGN PARITY: report/minimal PDFs retain source markers with distinct title coordinates',reportBox,minimalBox);
  if(process.env.GITHUB_ACTIONS==='true'&&process.env.M02_SCREENSHOT_OUT){
    await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
    const paneGeometry=await evaluate("(()=>{const a=document.querySelector('.studio-layout'),l=document.querySelector('.editor-column'),c=document.querySelector('.preview-column'),r=document.querySelector('.studio-style-column');if(!a||!l||!c||!r)return null;return {display:getComputedStyle(a).display,left:l.getBoundingClientRect().left,center:c.getBoundingClientRect().left,right:r.getBoundingClientRect().left,centerWidth:c.getBoundingClientRect().width}})()");
    assert.ok(paneGeometry?.display==='grid'&&paneGeometry.left<paneGeometry.center&&
      paneGeometry.center<paneGeometry.right&&paneGeometry.centerWidth>450,
      'Studio must render as real left/center/right columns at 1600px, not only DOM wrappers: '+JSON.stringify(paneGeometry));
    console.log('PASS M02 THREE-PANE ACTUAL BROWSER GEOMETRY:',paneGeometry);
    const capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    writeFileSync(process.env.M02_SCREENSHOT_OUT,Buffer.from(capture.data,'base64'));
    console.log('PASS M02 ACTUAL CHROME SCREENSHOT: synthetic imported document and 3-pane studio');
  }
  // Project switch must close/revoke the transient original, with no
  // incorrect source association if the imported project is reopened.
  await evaluate("(()=>{const old=[...document.querySelectorAll('.doc-list-item')].find(b=>!b.classList.contains('active'));if(!old)throw Error('No older project for comparison guard');old.click()})()");
  await eventually(()=>evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),v=>v===original);
  await eventually(()=>evaluate("!document.querySelector('.studio-source-panel')"));
  const revoked=await evaluate("(async()=>{try{await fetch("+JSON.stringify(initialSource.url)+");return false}catch{return true}})()");
  assert.equal(revoked,true,'Source Blob URL must be revoked on document switch');
  await evaluate("(()=>{const imported=[...document.querySelectorAll('.doc-list-item')].find(b=>b.textContent.includes('step3-sample'));if(!imported)throw Error('Imported document missing after switch');imported.click()})()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),v=>v?.includes('STEP3_TEST_END_7519'));
  assert.equal(await evaluate("Boolean(document.querySelector('.studio-source-panel'))"),false,
    'Switching back must not resurrect an unowned source PDF');
  console.log('PASS M02 ACTIVE-SOURCE GUARD: close/revoke on switch and no stale source on return');
  await send('Page.reload',{ignoreCache:true});
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),v=>v?.includes('STEP3_TEST_END_7519'));
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===before+1);
  await eventually(()=>evaluate("document.querySelectorAll('.project-paper img').length"),n=>n>=1);
  await eventually(()=>evaluate("Promise.all([...document.querySelectorAll('.project-paper img')].map(img=>img.decode().then(()=>true,()=>false))).then(x=>x.every(Boolean))"));
  const printed=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:false});
  const pdfPath=join(dir,'step3-imported-output.pdf');
  writeFileSync(pdfPath,Buffer.from(printed.data,'base64'));
  const info=execFileSync('pdfinfo',[pdfPath],{encoding:'utf8'});
  const text=execFileSync('pdftotext',[pdfPath,'-'],{encoding:'utf8'});
  const embedded=execFileSync('pdfimages',['-list',pdfPath],{encoding:'utf8'});
  assert.ok(info.includes('(A4)')&&text.includes('STEP3_TEST_BEGIN_7519')&&
    text.includes('STEP3_PAGE2_BEGIN_7519')&&text.includes('STEP3_TEST_END_7519'),
    'Imported multi-page PDF must preserve text in A4 reprint');
  assert.ok(text.indexOf('STEP3_TEST_BEGIN_7519')<text.indexOf('STEP3_PAGE2_BEGIN_7519')&&
    text.indexOf('STEP3_PAGE2_BEGIN_7519')<text.indexOf('STEP3_TEST_END_7519'),
    'Reprinted PDF has incorrect page/text reading order');
  assert.ok(/^\s*\d+\s+\d+\s+image/m.test(embedded),'Reprinted A4 PDF must include recovered raster image');
  console.log('PASS STEP3 MULTIPAGE/IMAGE REPRINT: source order and embedded PNG survive theme/reload/A4 output');
  console.log('PASS STEP3 END-TO-END: imported PDF survives theme/reload and retains start/end markers in new A4 PDF');

  // Real clipped PDF, not only simulated PDF.js operator arrays.
  const clipBytes=makeClippedImagePdf(),clipPath=join(dir,'step3-clipped-source.pdf');
  writeFileSync(clipPath,clipBytes);
  assert.ok(execFileSync('pdftotext',[clipPath,'-'],{encoding:'utf8'}).includes('STEP3_CLIP_SOURCE_842'));
  const clipRows=execFileSync('pdfimages',['-list',clipPath],{encoding:'utf8'}).split('\n')
    .filter(line=>/^\s*\d+\s+\d+\s+image/.test(line));
  assert.equal(clipRows.length,2,'Fixture PDF must draw two bitmap images, including a clipped occurrence');
  const clipBefore=await evaluate("document.querySelectorAll('.doc-list-item').length");
  const clipActiveTitle=await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent");
  await evaluate("(()=>{const encoded="+JSON.stringify(clipBytes.toString('base64'))+";"+
    "const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));"+
    "const file=new File([bytes],'step3-clip-fixture.pdf',{type:'application/pdf'});"+
    "const dt=new DataTransfer();dt.items.add(file);"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  const clipWarnings=await eventually(
    ()=>evaluate("[...document.querySelectorAll('.step3-import-panel details li')].map(x=>x.textContent)"),
    lines=>lines?.some(line=>line?.includes('이미지에 클리핑 경로가 적용됐습니다')),
  );
  assert.ok(clipWarnings.some(line=>line?.includes('클리핑 경로')));
  const clipSummary=await evaluate("document.querySelector('[data-step3-image-count]')?.textContent");
  assert.match(clipSummary??'',/이미지 감지 [1-9]/);
  assert.match(clipSummary??'',/PNG 복원 [1-9]/);
  const clipVectorSummary=await evaluate("document.querySelector('[data-step3-vector-count]')?.textContent");
  assert.match(clipVectorSummary??'',/벡터 경로 관련 명령 0회/,
    'Image-only clipping path must not be misclassified as painted vector table lines');
  assert.ok(await evaluate("document.querySelector('[data-step3-acceptance-checklist]')?.textContent?.includes('그래픽 보존을 증명하지 않습니다')"),
    'Zero-risk operator count must not imply source graphics were preserved');
  console.log('PASS STEP3 CLIP-ONLY VECTOR CONTROL: clipping mask excluded, image warning retained');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),clipBefore,
    'Clipped PDF review must not persist a document before confirmation');
  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),clipActiveTitle,
    'Clipped PDF review must preserve the existing active document');
  console.log('PASS STEP3 CLIPPED XOBJECT PDF: real clipped raster triggers a review warning without premature persistence');

  // A separate real-PDF scenario: the same path clips AND paints (W S).
  // PDF.js packs the terminal paint op into constructPath's arguments.
  const paintedClipBytes=makeClippedImagePdf({strokeClipPath:true});
  await evaluate("(()=>{const encoded="+JSON.stringify(paintedClipBytes.toString('base64'))+";"+
    "const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));"+
    "const file=new File([bytes],'step3-clip-and-stroke.pdf',{type:'application/pdf'});"+
    "const dt=new DataTransfer();dt.items.add(file);"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  const paintedClipRisk=await eventually(
    ()=>evaluate("document.querySelector('[data-step3-vector-count]')?.textContent"),
    value=>/벡터 경로 관련 명령 [1-9][0-9]*회/.test(value??'')
  );
  assert.ok(paintedClipRisk.includes('도형/셀 개수 아님'));
  const paintedClipWarnings=await evaluate("[...document.querySelectorAll('.step3-import-panel details li')].map(x=>x.textContent)");
  assert.ok(paintedClipWarnings.some(line=>line?.includes('이미지에 클리핑 경로가 적용됐습니다')),
    'Actual clipped image warning must remain visible beside vector paint risk');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),clipBefore,
    'Mixed clip/stroke review cannot persist original documents without confirmation');
  console.log('PASS STEP3 CLIP+STROKE PDF: same path is painted and clipped; vector risk plus image warning');

  // Actual PDF.js/BROWSER signal for a Form XObject inside an alpha group:
  // never declare compositing pixel equivalence, even if a raster is decoded.
  for(const scenario of [
    {name:'step3-transparent-form.pdf',params:{alpha:0.4,group:true},hasTransparency:true},
    {name:'step3-opaque-form.pdf',params:{alpha:1,group:false},hasTransparency:false},
  ]){
    const source=makeTransparencyFormPdf(scenario.params);
    await evaluate("(()=>{const encoded="+JSON.stringify(source.toString('base64'))+
      ",name="+JSON.stringify(scenario.name)+";"+
      "const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));"+
      "const file=new File([bytes],name,{type:'application/pdf'});"+
      "const dt=new DataTransfer();dt.items.add(file);"+
      "const input=document.querySelector('.step3-import-panel input[type=file]');"+
      "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");
    const compositionSummary=await eventually(
      ()=>evaluate("document.querySelector('[data-step3-composition-count]')?.textContent"),
      value=>!!value&&/Form XObject 범위 [1-9][0-9]*건/.test(value)&&
        scenario.hasTransparency===/투명도·합성 위험 신호 [1-9][0-9]*건/.test(value)
    );
    assert.ok(compositionSummary.includes('동일 복원 미보장'),
      'Form and alpha counters must not promise source fidelity');
    const warnings=await evaluate("[...document.querySelectorAll('.step3-import-panel details li')].map(x=>x.textContent)");
    assert.ok(warnings.some(w=>w?.includes('Form XObject 범위')));
    assert.equal(warnings.some(w=>w?.includes('투명도·합성 그래픽 위험 신호')),scenario.hasTransparency,
      'Opaque form should not produce an alpha risk warning');
    assert.ok(await evaluate("document.querySelector('.step3-import-panel')?.textContent?.includes('FORM_ALPHA_END_202')"),
      'Selectable source text markers must remain visible in review');
    assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),clipBefore,
      'Form/alpha PDF review must not persist any existing document');
    console.log('PASS STEP3 FORM/ALPHA REVIEW:',scenario.name,compositionSummary);
  }



  // Source/output acceptance matrix for a known-difficult layout: two columns,
  // vector table rules, raster image and a second PDF page. Compare exact
  // content markers (not pixels, page-count equality, or table geometry).
  const mixedBytes=makeMixedLayoutPdf(),mixedSource=join(dir,'step3-mixed-source.pdf');
  writeFileSync(mixedSource,mixedBytes);
  const mixedInfo=execFileSync('pdfinfo',[mixedSource],{encoding:'utf8'});
  const mixedText=execFileSync('pdftotext',[mixedSource,'-'],{encoding:'utf8'});
  const mixedImages=execFileSync('pdfimages',['-list',mixedSource],{encoding:'utf8'});
  assert.match(mixedInfo,/Pages:\s+2\b/,'Source fixture must be two pages');
  assert.ok(mixedInfo.includes('(A4)'),'Source fixture must be A4');
  for(const marker of MIXED_LAYOUT_MARKERS){
    assert.equal(mixedText.split(marker).length-1,1,'Source fixture marker mismatch: '+marker);
  }
  assert.equal(mixedImages.split('\n').filter(line=>/^\s*\d+\s+\d+\s+image/.test(line)).length,1,
    'Source fixture must embed one raster image');
  const m04Source=await auditPdfBytes(mixedBytes,{markers:MIXED_LAYOUT_MARKERS,requireRaster:true,label:'M04 synthetic source'});
  assert.equal(m04Source.pages,2);
  assert.equal(m04Source.skippedRotation,0,'Rotated source text geometry remains unverified');
  console.log('PASS M04 INDEPENDENT SOURCE AUDIT:',m04Source);
  console.log('PASS STEP3 MIXED SOURCE: verified 2 A4 pages, 13 exact text markers, one raster image');

  const mixedBefore=await evaluate("document.querySelectorAll('.doc-list-item').length");
  const previousTitles=await evaluate("[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent)");
  await evaluate("(()=>{const encoded="+JSON.stringify(mixedBytes.toString('base64'))+";"+
    "const data=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));"+
    "const file=new File([data],'step3-mixed-layout.pdf',{type:'application/pdf'});"+
    "const dt=new DataTransfer();dt.items.add(file);"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  const reviewText=await eventually(
    ()=>evaluate("[...document.querySelectorAll('.step3-block-review textarea')].map(x=>x.value).join('\\n')"),
    txt=>MIXED_LAYOUT_MARKERS.every(marker=>txt?.includes(marker))
  );
  for(const marker of MIXED_LAYOUT_MARKERS)
    assert.equal(reviewText.split(marker).length-1,1,'Missing or duplicated review marker: '+marker);
  const mixedWarnings=await evaluate("[...document.querySelectorAll('.step3-import-panel details li')].map(x=>x.textContent)");
  console.log('STEP3 MIXED WARNING COUNT:',mixedWarnings.length,
    'column=',mixedWarnings.some(w=>w?.includes('열 또는 넓은 텍스트 간격')));
  assert.ok(mixedWarnings.some(w=>w?.includes('열 또는 넓은 텍스트 간격')),
    'The actual multi-column PDF must warn about uncertain reading order');
  const vectorRiskSummary=await evaluate("document.querySelector('[data-step3-vector-count]')?.textContent");
  assert.match(vectorRiskSummary??'',/벡터 경로 관련 명령 [1-9][0-9]*회/,
    'PDF.js must flag the source vector path construction batches');
  assert.ok(mixedWarnings.some(w=>/1페이지 벡터 경로 관련 명령 [1-9][0-9]*회/.test(w??'')),
    'Review must disclose page-local vector batches without claiming preserved table lines');
  assert.ok((vectorRiskSummary??'').includes('도형/셀 개수 아님'),
    'Risk count must never masquerade as recovered table cells');
  const mixedChecklist=await evaluate("document.querySelector('[data-step3-acceptance-checklist]')?.textContent");
  for(const label of ['텍스트·숫자·기호','다단·표의 읽기 순서','표 선·벡터 도형','이미지']){
    assert.ok(mixedChecklist?.includes(label),'Missing source comparison item: '+label);
  }
  assert.ok(mixedChecklist?.includes('경로 관련 명령 '),
    'Checklist should call out vector-path risk when it is detected');
  console.log('PASS STEP3 CHECKLIST: text/number, reading order, vector table and bitmap review');
  console.log('PASS STEP3 MIXED VECTOR RISK:',vectorRiskSummary,'; explicit table/shape loss advisory');
  assert.ok(await evaluate("document.querySelector('.step3-import-panel')?.textContent?.includes('이미지·표·도형이 누락될 수 있습니다')"),
    'Vector table/graphics fidelity limitation must remain visible');
  const mixedSummary=await evaluate("document.querySelector('[data-step3-image-count]')?.textContent");
  assert.match(mixedSummary??'',/이미지 감지 1건/);
  assert.match(mixedSummary??'',/PNG 복원 1건/);
  assert.match(mixedSummary??'',/미복원 0건/);
  assert.equal(await evaluate("document.querySelectorAll('.step3-block-review details').length"),2,
    'Both source PDF pages must be independently reviewable');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),mixedBefore,
    'Review must not write to the existing document list');
  console.log('PASS STEP3 MIXED REVIEW: source markers 13/13, multi-column warning, raster recovery, unchanged persisted docs');

  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').click()");
  await evaluate("(()=>{const button=[...document.querySelectorAll('.step3-import-panel button')].find(b=>b.textContent.includes('검수 결과를 새 문서로 저장'));if(!button||button.disabled)throw Error('Mixed PDF confirm disabled');button.click();})()");
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===mixedBefore+1);
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),
    txt=>txt?.includes('STEP3_SOURCE_P1_BEGIN_901')&&txt.includes('STEP3_SOURCE_P2_END_913'));
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  await send('Page.reload',{ignoreCache:true});
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),
    txt=>txt?.includes('STEP3_SOURCE_P2_END_913'));
  await eventually(()=>evaluate("document.querySelectorAll('.project-paper img').length"),n=>n>=1);
  assert.ok(await evaluate("Promise.all([...document.querySelectorAll('.project-paper img')].map(img=>img.decode().then(()=>true,()=>false))).then(x=>x.every(Boolean))"),
    'Restored raster image did not decode after reload');
  // Renderer hydration may populate the active document before the sidebar
  // list has finished refreshing; require the complete prior list, not an
  // instantaneous snapshot taken during that transition.
  const afterTitles=await eventually(
    ()=>evaluate("[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent)"),
    titles=>previousTitles.every(title=>titles?.includes(title))
  );
  for(const title of previousTitles)assert.ok(afterTitles.includes(title),'Prior document vanished: '+title);

  const mixedOutput=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:false});
  const mixedPrinted=join(dir,'step3-mixed-reprinted.pdf');
  writeFileSync(mixedPrinted,Buffer.from(mixedOutput.data,'base64'));
  const mixedPrintedInfo=execFileSync('pdfinfo',[mixedPrinted],{encoding:'utf8'});
  const mixedPrintedText=execFileSync('pdftotext',[mixedPrinted,'-'],{encoding:'utf8'});
  const mixedPrintedImages=execFileSync('pdfimages',['-list',mixedPrinted],{encoding:'utf8'});
  assert.ok(mixedPrintedInfo.includes('(A4)'),'Redesigned print must use A4, without requiring the same page count');
  for(const marker of MIXED_LAYOUT_MARKERS){
    assert.equal(mixedPrintedText.split(marker).length-1,1,'Source→reprint marker loss/duplication: '+marker);
  }
  assert.ok(mixedPrintedText.indexOf('STEP3_SOURCE_P1_BEGIN_901')<
    mixedPrintedText.indexOf('STEP3_SOURCE_P2_BEGIN_911'),'PDF page sequence was inverted');
  assert.ok(mixedPrintedImages.split('\n').some(line=>/^\s*\d+\s+\d+\s+image/.test(line)),
    'Redesigned print must embed a raster image');
  const m04Output=await auditPdfBytes(Buffer.from(mixedOutput.data,'base64'),
    {markers:MIXED_LAYOUT_MARKERS,requireRaster:true,label:'M04 reflowed PDF'});
  assert.equal(m04Output.markers,13);
  assert.equal(m04Output.skippedRotation,0,'Rotated output geometry requires manual review');
  console.log('PASS M04 OUTPUT A4 TEXT GEOMETRY / CONTENT:',m04Output);
  console.log('PASS STEP3 SOURCE/REPRINT COMPARISON: 13/13 exact markers once, source page sequence, output raster, A4, original documents intact');
  // Intentionally unverified: original vector grid lines, column/table cell
  // geometry, pixel-for-pixel image content and Windows print fidelity.

}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP3: synthetic browser profile cleanup deferred ('+error.code+')');}
}
