// STEP3 true browser upload: synth PDF -> PDF.js review -> new IndexedDB doc -> themed A4 print.
import assert from 'node:assert/strict';
import {spawnSync,execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {makeClippedImagePdf} from './fixtures/step3-clipped-pdf.mjs';
import {makeMixedLayoutPdf,MIXED_LAYOUT_MARKERS} from './fixtures/step3-mixed-layout-pdf.mjs';
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
  const themeBefore=await evaluate("document.querySelector('.project-paper')?.className");
  await evaluate("document.querySelectorAll('input[name=v2theme]')[1].click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.className"),v=>v!==themeBefore);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
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
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),clipBefore,
    'Clipped PDF review must not persist a document before confirmation');
  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),clipActiveTitle,
    'Clipped PDF review must preserve the existing active document');
  console.log('PASS STEP3 CLIPPED XOBJECT PDF: real clipped raster triggers a review warning without premature persistence');

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
  const afterTitles=await evaluate("[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent)");
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
