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
import {makeNumericOmissionPdf} from './fixtures/step3-numeric-omission-pdf.mjs';
import {auditPdfBytes} from './pdf-integrity-audit.mjs';
import scannedFixture from '../desktop/step3-scanned-fixture.cjs';
import invalidFixture from '../desktop/step3-invalid-fixture.cjs';
const {makeScannedPagesPdf,SCAN_MARKERS}=scannedFixture;
const {makeCorruptRootPdf}=invalidFixture;
const RUNNING_MARKERS=['RUNNING_HEADER_P1_914','RUNNING_FOOTER_P1_915','RUNNING_HEADER_P2_916','RUNNING_FOOTER_P2_917'];
const MIXED_OUTPUT_MARKERS=MIXED_LAYOUT_MARKERS.filter(marker=>!RUNNING_MARKERS.includes(marker));
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
  const navigation=await evaluate("(()=>({count:document.querySelectorAll('[data-m06b-stage]').length,sourceDisabled:document.querySelector('.studio-steps button:nth-child(2)').disabled,pickerAccessible:!!document.querySelector('[data-m06b-dropzone] input[type=file]')}))()");
  assert.deepEqual(navigation,{count:4,sourceDisabled:true,pickerAccessible:true});
  await send('Page.bringToFront');
  await evaluate("document.querySelector('.studio-steps button:nth-child(3)').focus()");
  assert.equal(await evaluate("document.activeElement?.getAttribute('data-m06b-stage')"),'3');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await eventually(()=>evaluate("document.querySelector('[aria-current=step]')?.getAttribute('data-m06b-stage')"),x=>x==='3');
  assert.equal(await evaluate("document.activeElement?.classList.contains('studio-style-column')"),true);
  await evaluate("document.querySelector('.studio-steps button:nth-child(1)').click()");
  assert.equal(await evaluate("document.activeElement?.id"),'astra-pdf-import');
  console.log('PASS M06-B KEYBOARD: native Enter activates guided stage and moves focus to design; return focuses file import');
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
  await evaluate("(()=>{const dt=new DataTransfer();dt.items.add(new File(['bad'],'not-pdf.txt',{type:'text/plain'}));document.querySelector('[data-m06b-dropzone]').dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));})()");
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel .warning')?.textContent"),v=>v?.includes('확장자가 .pdf'));
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),before);
  await evaluate("(()=>{const str=atob("+JSON.stringify(pdf.data)+");const arr=Uint8Array.from(str,c=>c.charCodeAt(0));"+
    "const file=new File([arr],'step3-sample.pdf',{type:'application/pdf'});"+
    "const dt=new DataTransfer();dt.items.add(file);"+
    "document.querySelector('[data-m06b-dropzone]').dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));})()");
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),txt=>txt?.includes('STEP3_TEST_BEGIN_7519')&&txt.includes('STEP3_TEST_END_7519'));
  assert.ok(await evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]'))"));
  console.log('PASS M06-B DRAG DROP: malformed file rejected, actual local PDF parsed; native file picker remains accessible');
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
  const sourceBlockId=await evaluate("(()=>{const page=[...document.querySelectorAll('.step3-block-review details')].find(d=>d.querySelector(':scope > summary')?.textContent.includes('원본 2페이지'));const button=page?.querySelector('[data-step3-show-source]');if(!button)throw Error('Page 2 block source navigation missing');button.click();return button.getAttribute('data-step3-show-source')})()");
  const sourceLocation=await eventually(()=>evaluate("(()=>{const panel=document.querySelector('[data-step3-selected-source-block]');const preview=panel?.querySelector('[data-m06-preview][data-m06-rendered-page]');const canvas=preview?.querySelector('canvas');const rect=preview?.querySelector('[data-m06-anchor-rect]');return panel&&preview&&canvas?.width>0&&canvas?.height>0&&rect?{id:panel.getAttribute('data-step3-selected-source-block'),page:preview.getAttribute('data-m06-rendered-page'),width:canvas.width,height:canvas.height,highlight:rect.getBoundingClientRect().width}:null})()"),x=>x&&x.id===sourceBlockId&&x.page==='2'&&x.highlight>0);
  assert.ok(sourceLocation.width>300&&sourceLocation.height>500,'Selected block must render its actual original PDF page');
  const originalSourceText=await evaluate("(()=>{const id="+JSON.stringify(sourceBlockId)+";return [...document.querySelectorAll('[data-step3-show-source]')].find(button=>button.getAttribute('data-step3-show-source')===id)?.closest('.section-editor')?.querySelector('textarea')?.value})()");
  const editedSourceText=originalSourceText+' REVIEW_EDIT_418';
  await evaluate("(()=>{const id="+JSON.stringify(sourceBlockId)+";const button=[...document.querySelectorAll('[data-step3-show-source]')].find(x=>x.getAttribute('data-step3-show-source')===id);const area=button?.closest('.section-editor')?.querySelector('textarea');if(!area)throw Error('Selected source block editor missing');const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;set.call(area,"+JSON.stringify(editedSourceText)+");area.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await eventually(()=>evaluate("document.querySelector('[data-step3-edited-excerpt]')?.textContent?.includes('REVIEW_EDIT_418')"),x=>x===true);
  assert.equal(await evaluate("document.querySelector('[data-step3-source-excerpt]')?.textContent?.replace(/^PDF.js 추출 원문: /,'')"),originalSourceText,
    'Source comparison must retain the original PDF.js text beside a live manual edit');
  assert.equal(await evaluate("document.querySelector('[data-step3-edited-excerpt]')?.textContent?.replace(/^현재 수정 내용: /,'')"),editedSourceText,
    'Source comparison must refresh the current edited text instead of a stale block snapshot');
  await evaluate("document.querySelector('[data-step3-undo]').click()");
  await eventually(()=>evaluate("!document.querySelector('[data-step3-edited-excerpt]')"),x=>x===true);
  await evaluate("document.querySelector('[data-step3-selected-source-block] button').click()");
  assert.equal(await evaluate("Boolean(document.querySelector('[data-step3-selected-source-block]'))"),false,'Source position panel must close without changing draft');
  console.log('PASS STEP3 BLOCK-TO-SOURCE NAVIGATION: selected page-2 text maps to its rendered original page and estimated source highlight');
  const sourceImageId=await evaluate("(()=>{const button=document.querySelector('[data-step3-show-image-source]');if(!button)throw Error('Recovered image source navigation missing');button.click();return button.getAttribute('data-step3-show-image-source')})()");
  const imageLocation=await eventually(()=>evaluate("(()=>{const panel=document.querySelector('[data-step3-selected-source-image]');const preview=panel?.querySelector('[data-m06-preview][data-m06-rendered-page]');const canvas=preview?.querySelector('canvas');const rect=preview?.querySelector('[data-m06-anchor-rect]');return panel&&preview&&canvas?.width>0&&canvas?.height>0&&rect?{id:panel.getAttribute('data-step3-selected-source-image'),page:preview.getAttribute('data-m06-rendered-page'),highlight:rect.getBoundingClientRect().width}:null})()"),x=>x&&x.id===sourceImageId&&x.page==='2'&&x.highlight>0);
  assert.ok(imageLocation.highlight>0,'Recovered image must highlight its estimated original placement');
  await evaluate("document.querySelector('[data-step3-selected-source-image] button').click()");
  assert.equal(await evaluate("Boolean(document.querySelector('[data-step3-selected-source-image]'))"),false,'Image source location panel must close');
  console.log('PASS STEP3 IMAGE-TO-SOURCE NAVIGATION: recovered raster maps to its rendered source page and estimated placement');
  await evaluate("(()=>{const page=[...document.querySelectorAll('.step3-block-review details')].find(d=>d.querySelector(':scope > summary')?.textContent.includes('원본 2페이지'));const button=page?.querySelector('[data-step3-add-manual-block]');if(!button)throw Error('Manual recovery action missing');button.click();return true})()");
  const manualBlockId=await eventually(()=>evaluate("document.querySelector('[data-step3-remove-manual]')?.getAttribute('data-step3-remove-manual')"),x=>typeof x==='string'&&x.length>0);
  assert.ok(manualBlockId,'Manual text block was not created');
  assert.equal(await evaluate("Boolean(document.querySelector('[data-step3-show-source="+JSON.stringify(manualBlockId)+"]'))"),false,'Manual block must not claim extracted source coordinates');
  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').click()");
  assert.equal(await evaluate("document.querySelector('.step3-import-panel .print-button').disabled"),true,'An empty included manual block must prevent saving');
  assert.ok(await evaluate("Boolean(document.querySelector('[data-step3-empty-block-warning]'))"),'Empty manual block warning missing');
  await evaluate("(()=>{const area=[...document.querySelectorAll('.step3-block-review textarea')].at(-1);const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;set.call(area,'MISSING_TEXT_MANUALLY_RECOVERED_7519');area.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await eventually(()=>evaluate("!document.querySelector('[data-step3-empty-block-warning]')"));
  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').click()");
  assert.equal(await evaluate("document.querySelector('.step3-import-panel .print-button').disabled"),false,'Completed manual text with fresh consent should be savable');
  await evaluate("document.querySelector('[data-step3-add-manual-block="+JSON.stringify('2')+"]').click()");
  await eventually(()=>evaluate("document.querySelectorAll('[data-step3-remove-manual]').length"),n=>n===2);
  const removable=await evaluate("[...document.querySelectorAll('[data-step3-remove-manual]')].at(-1)?.getAttribute('data-step3-remove-manual')");
  await evaluate("document.querySelector('[data-step3-remove-manual="+JSON.stringify(removable)+"]').click()");
  assert.equal(await evaluate("document.querySelectorAll('[data-step3-remove-manual]').length"),1,'Removing a manual correction must leave the previous draft blocks intact');
  console.log('PASS STEP3 MANUAL RECOVERY: add missing page text, prevent blank-block save, require renewed consent, delete correction');
  const edits=await evaluate("document.querySelectorAll('.step3-block-review textarea').length");
  assert.ok(edits>=2,'Expected extracted text blocks');
  const historySelector=".step3-import-panel [data-step3-undo]";
  const redoSelector=".step3-import-panel [data-step3-redo]";
  const editableText=await evaluate("document.querySelector('.step3-block-review textarea')?.value");
  await evaluate("(()=>{const area=document.querySelector('.step3-block-review textarea');"+
    "const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;"+
    "set.call(area,area.value+' STEP3_UNDO_SENTINEL');area.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await eventually(()=>evaluate("document.querySelector('.step3-block-review textarea')?.value"),
    value=>value?.endsWith('STEP3_UNDO_SENTINEL'));
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').checked"),false,
    'A text edit must revoke the PDF review approval');
  await evaluate("document.querySelector("+JSON.stringify(historySelector)+").click()");
  assert.equal(await evaluate("document.querySelector('.step3-block-review textarea')?.value"),editableText,
    'Undo should restore the exact extracted text');
  assert.equal(await evaluate("document.querySelector("+JSON.stringify(redoSelector)+").disabled"),false,
    'Undo should enable redo');
  await evaluate("document.querySelector("+JSON.stringify(redoSelector)+").click()");
  assert.equal(await evaluate("document.querySelector('.step3-block-review textarea')?.value"),editableText+' STEP3_UNDO_SENTINEL',
    'Redo should restore the exact edit');
  await evaluate("document.querySelector("+JSON.stringify(historySelector)+").click()");
  assert.equal(await evaluate("document.querySelector('.step3-block-review textarea')?.value"),editableText,
    'A second undo should return to the original extracted text');
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').checked"),false,
    'Undo/redo must still require explicit source review approval');
  console.log('PASS STEP3 DRAFT UNDO/REDO: text edit restored exactly and review approval stayed revoked');
  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').click()");
  await evaluate("(()=>{const b=[...document.querySelectorAll('.step3-import-panel button')].find(b=>b.textContent.includes('검수 결과를 새 문서로 저장'));if(!b||b.disabled)throw Error('PDF confirm disabled');b.click();})()");
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===before+1);
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),t=>t?.includes('STEP3_TEST_BEGIN_7519')&&t.includes('STEP3_PAGE2_BEGIN_7519')&&t.includes('STEP3_TEST_END_7519')&&t.includes('MISSING_TEXT_MANUALLY_RECOVERED_7519'));
  assert.ok(await evaluate("document.querySelectorAll('.project-paper img').length")>=1,'Recovered PNG must render in new document');
  await eventually(()=>evaluate("Promise.all([...document.querySelectorAll('.project-paper img')].map(img=>img.decode().then(()=>true,()=>false))).then(x=>x.every(Boolean))"));

  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent?.includes('step3-sample')"),true);
  assert.equal(await evaluate("document.querySelector('.section-editor .help-text')?.textContent?.includes('원본 PDF 출처')"),true);
  console.log('PASS STEP3 IMPORT: review creates independent active V2 document with PDF source provenance');
  await eventually(()=>evaluate("document.querySelector('.studio-steps button:nth-child(2)')?.disabled"),x=>x===false);
  await evaluate("document.querySelector('.studio-steps button:nth-child(2)').click()");
  await eventually(()=>evaluate("document.querySelector('[aria-current=step]')?.getAttribute('data-m06b-stage')"),x=>x==='2');
  assert.equal(await evaluate("document.activeElement?.classList.contains('studio-source-panel')"),true);
  await evaluate("document.querySelector('.studio-steps button:nth-child(4)').click()");
  assert.equal(await evaluate("document.activeElement?.classList.contains('print-button')"),true);
  assert.ok(await evaluate("Boolean(document.querySelector('.project-paper'))"));
  console.log('PASS M06-B STAGES: source-review and save actions focus real elements; save is never triggered by navigating');

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
  assert.equal(await evaluate("document.querySelector('.m06-focused-block')?.getAttribute('data-m06-block-id')"),chosen,
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
  // STEP4: same-document theme comparison is ephemeral until Apply and can be undone without touching content.
  const readStyleSnapshot=()=>evaluate("(async()=>{const open=await new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{return await new Promise((resolve,reject)=>{const tx=open.transaction('documents','readonly');const r=tx.objectStore('documents').get("+JSON.stringify(importedDocId)+
    ");r.onsuccess=()=>resolve({design:r.result.design,content:r.result.content,stores:[...open.objectStoreNames]});r.onerror=()=>reject(r.error)})}finally{open.close()}})()");
  const compareBefore=await readStyleSnapshot();
  const styleThemeIds=['report','minimal','diary','compact','editorial','ledger','brief','folio'];
  const originalThemeIndex=await evaluate("([...document.querySelectorAll('input[name=v2theme]')]).findIndex(input=>input.checked)");
  assert.ok(originalThemeIndex>=0&&originalThemeIndex<styleThemeIds.length);
  assert.equal(compareBefore.design.theme,styleThemeIds[originalThemeIndex],
    'Persisted theme and selected design control must agree before comparison');
  const compareThemeIndex=originalThemeIndex===7?0:7;
  const compareThemeId=styleThemeIds[compareThemeIndex];
  await evaluate("document.querySelector('[data-style-compare-toggle]').click()");
  await eventually(()=>evaluate("document.querySelectorAll('[data-style-compare-theme]').length"),n=>n===8);
  await evaluate("document.querySelector('[data-style-compare-theme="+JSON.stringify(compareThemeId)+"]').click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.classList.contains('paper-theme-"+compareThemeId+"')"),x=>x===true);
  await evaluate("document.querySelector('[data-style-compare-side-by-side]').click()");
  await eventually(()=>evaluate("document.querySelectorAll('[data-style-compare-gallery] .style-compare-card .project-paper').length"),n=>n===2);
  const sideBySide=await evaluate("(()=>({original:document.querySelector('[data-style-compare-original] .project-paper')?.className,candidate:document.querySelector('[data-style-compare-candidate] .project-paper')?.className,rects:[...document.querySelectorAll('[data-style-compare-gallery] .style-compare-card-viewport .project-paper')].map(x=>{const r=x.getBoundingClientRect();return {width:r.width,height:r.height}})}))()");
  assert.ok(sideBySide.original.includes('paper-theme-'+compareBefore.design.theme),'Side-by-side view must include the saved design');
  assert.ok(sideBySide.candidate.includes('paper-theme-'+compareThemeId),'Side-by-side view must include the selected candidate');
  assert.ok(sideBySide.rects.every(rect=>rect.width>300&&rect.height>400),'Both A4 design previews must render at a readable size');
  assert.deepEqual(await readStyleSnapshot(),compareBefore,'Opening visual comparison must not mutate persisted content/design or stores');
  const galleryPdf=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true});
  const galleryPath=join(dir,'step4-side-by-side-print.pdf');
  writeFileSync(galleryPath,Buffer.from(galleryPdf.data,'base64'));
  assert.match(await execFileSync('pdfinfo',[galleryPath],{encoding:'utf8'}),/Pages:\s+2\b/,
    'Printing from side-by-side comparison must output only the selected candidate document once');
  const galleryText=execFileSync('pdftotext',[galleryPath,'-'],{encoding:'utf8'});
  assert.equal(galleryText.split('STEP3_TEST_BEGIN_7519').length-1,1,
    'Side-by-side comparison cards must not duplicate content in the generated PDF');
  await evaluate("document.querySelector('[data-style-compare-side-by-side]').click()");
  assert.equal(await evaluate("document.querySelectorAll('input[name=v2theme]')["+originalThemeIndex+"]?.checked"),true,
    'Temporary comparison must not select or persist the design');
  assert.deepEqual(await readStyleSnapshot(),compareBefore,'Temporary preview must not mutate any saved content/design or add stores');
  const comparePdf=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true});
  const comparePath=join(dir,'step4-compare-alternate.pdf');
  writeFileSync(comparePath,Buffer.from(comparePdf.data,'base64'));
  const compareText=execFileSync('pdftotext',[comparePath,'-'],{encoding:'utf8'});
  assert.ok(['STEP3_TEST_BEGIN_7519','STEP3_PAGE2_BEGIN_7519','STEP3_TEST_END_7519'].every(x=>compareText.includes(x)),
    'Ephemeral design preview PDF must preserve the imported document text');
  assert.ok((await execFileSync('pdfinfo',[comparePath],{encoding:'utf8'})).includes('(A4)'),
    'Ephemeral design preview must print to A4');
  await evaluate("document.querySelector('[data-style-compare-apply]').click()");
  await eventually(()=>evaluate("document.querySelectorAll('input[name=v2theme]')["+compareThemeIndex+"]?.checked"),x=>x===true);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  const comparedApplied=await readStyleSnapshot();
  assert.equal(comparedApplied.design.theme,compareThemeId);
  assert.deepEqual(comparedApplied.content,compareBefore.content,'Applying a style must not mutate source text/blocks');
  await evaluate("document.querySelector('[data-style-compare-undo]').click()");
  await eventually(()=>evaluate("document.querySelectorAll('input[name=v2theme]')["+originalThemeIndex+"]?.checked"),x=>x===true);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  const comparedRestored=await readStyleSnapshot();
  assert.deepEqual(comparedRestored.design,compareBefore.design,'Apply undo must restore the exact prior design tokens');
  assert.deepEqual(comparedRestored.content,compareBefore.content,'Apply undo must preserve all content and image references');
  assert.deepEqual(comparedRestored.stores,compareBefore.stores,'STEP4 comparison must not change the IndexedDB schema');
  const normalThemeIndex=originalThemeIndex===0?1:0;
  await evaluate("document.querySelectorAll('input[name=v2theme]')["+normalThemeIndex+"].click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.classList.contains('paper-theme-"+styleThemeIds[normalThemeIndex]+"')"),x=>x===true);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  await evaluate("document.querySelectorAll('input[name=v2theme]')["+originalThemeIndex+"].click()");
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.classList.contains('paper-theme-"+styleThemeIds[originalThemeIndex]+"')"),x=>x===true);
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  assert.deepEqual((await readStyleSnapshot()).design,compareBefore.design,
    'Existing design controls must stay synchronized while comparison is open');
  await evaluate("document.querySelector('[data-style-compare-toggle]').click()");
  console.log('PASS STEP4 SAME-DOCUMENT COMPARE/APPLY/UNDO: eight presets, ephemeral PDF parity, exact content/store preservation');


  const compareBox=wordPosition(comparePath);
  const reportBox=wordPosition(reportPath),minimalBox=wordPosition(minimalPath);
  assert.ok(Math.abs(reportBox.yMin-minimalBox.yMin)>8||Math.abs(reportBox.xMin-minimalBox.xMin)>8,
    'M02 requires actual PDF title positions to differ, not only color/theme ID');
  console.log('PASS M02 ACTUAL A4 DESIGN PARITY: report/minimal PDFs retain source markers with distinct title coordinates',reportBox,minimalBox);

  // M07-B: test every displayed theme against real printed PDF structure, not
  // class names or palette alone. A4/source markers/bitmap and bbox features
  // come from independent PDF parsers and are recorded for each design.
  const themes=[
    {id:'report',index:0,path:reportPath},
    {id:'minimal',index:1,path:minimalPath},
    {id:'diary',index:2},
    {id:'compact',index:3},
    {id:'editorial',index:4},
    {id:'ledger',index:5},
     {id:'brief',index:6},
     {id:'folio',index:7},
  ];
  const signatures=[];
  for(const theme of themes){
    if(!theme.path){
      await evaluate("document.querySelectorAll('input[name=v2theme]')["+theme.index+"].click()");
      await eventually(()=>evaluate("document.querySelector('.project-paper')?.className"),x=>x?.includes('paper-theme-'+theme.id));
      await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
      await evaluate("Promise.all([...document.querySelectorAll('.project-paper img')].map(i=>i.decode().catch(()=>{})))");
      const output=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true});
      theme.path=join(dir,'m07-'+theme.id+'.pdf');
      writeFileSync(theme.path,Buffer.from(output.data,'base64'));
    }
    const bytes=Buffer.from(await import('node:fs').then(fs=>fs.readFileSync(theme.path)));
    const audit=await auditPdfBytes(bytes,{markers:['STEP3_TEST_BEGIN_7519','STEP3_PAGE2_BEGIN_7519','STEP3_TEST_END_7519'],
      requireRaster:true,label:'M07-B '+theme.id});
    const pdfInfo=execFileSync('pdfinfo',[theme.path],{encoding:'utf8'});
    assert.ok(pdfInfo.includes('(A4)'),theme.id+' output must be A4');
    const box=wordPosition(theme.path);
    if(theme.id===compareThemeId){
      for(const key of ['xMin','yMin','xMax','yMax'])
        assert.ok(Math.abs(box[key]-compareBox[key])<1.5,
          'Ephemeral compare preview and saved PDF must have identical geometry: '+key);
    }
    assert.ok(box.xMin>=0&&box.yMin>=0&&box.xMax<=595.28&&box.yMax<=841.89,
      theme.id+' first-page title extent outside A4');
    const signature=[box.xMin,box.yMin,box.xMax-box.xMin].map(x=>Math.round(x/3));
    signatures.push({id:theme.id,...audit,box,signature});
    console.log('PASS M07-B A4 DESIGN',theme.id,JSON.stringify({pages:audit.pages,markers:audit.markers,
      raster:audit.rasterDraws,title:box,signature}));
  }
  for(let a=0;a<signatures.length;a++)for(let b=a+1;b<signatures.length;b++){
    const left=signatures[a],right=signatures[b];
    assert.ok(left.signature.some((v,i)=>v!==right.signature[i]),
      'M07-B requires distinct printed title x/y/width geometry, not color-only: '+left.id+' vs '+right.id);
  }
  assert.equal(signatures.length,8,'M07-B eight BASIC layouts must be printed and audited');
  console.log('PASS M07-B VERIFIED 8 DISTINCT A4 LAYOUTS: title geometry pairwise distinct, exact source order, raster retained; BASIC synthetic design target met');
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
  // Test actual responsive geometry at the widths in the product brief.
  for(const width of [900,1100,1600]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
    const layout=await evaluate("(()=>{const g=document.querySelector('.studio-layout'),l=document.querySelector('.editor-column'),c=document.querySelector('.preview-column'),r=document.querySelector('.studio-style-column');return {horizontal:document.documentElement.scrollWidth,viewport:innerWidth,display:getComputedStyle(g).display,left:l.getBoundingClientRect().left,center:c.getBoundingClientRect().left,right:r.getBoundingClientRect().left,buttons:document.querySelectorAll('[data-m06b-stage]').length}})()");
    assert.ok(layout.horizontal<=width+3,'M06-B horizontal overflow at '+width+': '+JSON.stringify(layout));
    assert.equal(layout.buttons,4);
    if(width===900)assert.ok(layout.display==='flex'&&Math.abs(layout.center-layout.left)<5,'900px requires stacked full-width editor/preview');
    if(width===1100)assert.ok(layout.display==='grid'&&layout.center>layout.left+180,'1100px requires two-column editor/preview');
    if(width===1600)assert.ok(layout.left<layout.center&&layout.center<layout.right,'1600px requires three columns');
    console.log('PASS M06-B RESPONSIVE '+width+'px',layout);
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
  console.log('PASS STEP3 MIXED SOURCE: verified 2 A4 pages, 17 exact text markers, one raster image');

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
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-source-compare iframe[src^=blob]'))"),true,
    'Original PDF preview must remain available while text is excluded');
  const restoreMarker=RUNNING_MARKERS[0];
  await evaluate("(()=>{const marker="+JSON.stringify(restoreMarker)+";const area=[...document.querySelectorAll('.step3-block-review textarea')].find(x=>x.value.includes(marker));if(!area)throw Error('Missing extracted block for restore regression');const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;set.call(area,marker+'-edited');area.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-step3-restore-extracted]'))"),x=>x===true);
  await evaluate("document.querySelector('[data-step3-restore-extracted]').click()");
  await eventually(()=>evaluate("[...document.querySelectorAll('.step3-block-review textarea')].some(x=>x.value==="+JSON.stringify(restoreMarker)+")"),x=>x===true);
  assert.equal(await evaluate("Boolean(document.querySelector('[data-step3-restore-extracted]'))"),false,
    'Restoring extracted text should remove the restore action when the block matches its source');
  await evaluate("document.querySelector('[data-step3-undo]').click()");
  await eventually(()=>evaluate("[...document.querySelectorAll('.step3-block-review textarea')].some(x=>x.value==="+JSON.stringify(restoreMarker+'-edited')+")"),x=>x===true);
  assert.equal(await evaluate("Boolean(document.querySelector('[data-step3-restore-extracted]'))"),true,
    'Undo must restore the edited text and its source-restore action');
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').checked"),false,
    'Undo after source restore must require renewed source-review consent');
  await evaluate("document.querySelector('[data-step3-redo]').click()");
  await eventually(()=>evaluate("[...document.querySelectorAll('.step3-block-review textarea')].some(x=>x.value==="+JSON.stringify(restoreMarker)+")"),x=>x===true);
  assert.equal(await evaluate("Boolean(document.querySelector('[data-step3-restore-extracted]'))"),false,
    'Redo must restore the extracted baseline and remove the source-restore action');
  console.log('PASS STEP3 EXTRACTED TEXT RESTORE: edit, restore, undo, redo and consent invalidation');
  for(const marker of RUNNING_MARKERS){
    const expression="(()=>{const marker="+JSON.stringify(marker)+";const area=[...document.querySelectorAll('.step3-block-review textarea')].find(x=>x.value.includes(marker));const editor=area?.closest('.section-editor');const input=editor?.querySelector('[data-step3-block-included]');if(!area||!input)throw Error('Missing editable source block '+marker);input.click();return {included:input.checked,text:area.value};})()";
    const state=await evaluate(expression);
    assert.equal(state.included,false,'Header/footer should toggle out of the new document: '+marker);
    assert.ok(state.text.includes(marker),'Excluded source text must remain reviewable: '+marker);
  }
  const missingSourceItems=await evaluate("[...document.querySelectorAll('[data-step3-source-text-missing]')].map(node=>node.textContent)");
  assert.equal(missingSourceItems.length,2,'Each source page with excluded text should show its own live omission warning');
  for(const marker of RUNNING_MARKERS)assert.ok(missingSourceItems.some(text=>text?.includes(marker)),
    'Source parity warning should identify excluded marker for manual recovery: '+marker);
  await evaluate("(()=>{const marker="+JSON.stringify(RUNNING_MARKERS[0])+";const item=[...document.querySelectorAll('[data-step3-missing-source-item]')].find(node=>node.textContent.includes(marker));const button=item?.querySelector('[data-step3-show-missing-source]');if(!button)throw Error('Missing source-location action for omitted PDF text');button.click();})()");
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-step3-selected-missing-source] [data-m06-preview][data-m06-rendered-page] [data-m06-anchor-rect]'))"),x=>x===true);
  assert.ok(await evaluate("document.querySelector('[data-step3-missing-source-excerpt]')?.textContent?.includes("+JSON.stringify(RUNNING_MARKERS[0])+")"),
    'Missing-source location preview must identify the exact omitted source text');
  const recoveredCountBefore=await evaluate("Number(document.querySelector('[data-step3-page-char-count=\"1\"]')?.textContent?.replaceAll(',',''))");
  await evaluate("(()=>{const marker="+JSON.stringify(RUNNING_MARKERS[0])+";const item=[...document.querySelectorAll('[data-step3-missing-source-item]')].find(node=>node.textContent.includes(marker));const button=item?.querySelector('[data-step3-recover-missing-source]');if(!button)throw Error('Missing quick recovery action for omitted PDF text');button.click();})()");

  await eventually(()=>evaluate("[...document.querySelectorAll('[data-step3-source-text-missing]')].every(node=>!node.textContent.includes("+JSON.stringify(RUNNING_MARKERS[0])+"))"),x=>x===true);
  await eventually(()=>evaluate("[...document.querySelectorAll('[data-step3-remove-manual]')].some(button=>button.closest('.section-editor')?.querySelector('textarea')?.value==="+JSON.stringify(RUNNING_MARKERS[0])+")"),x=>x===true);
  assert.ok(await evaluate("[...document.querySelectorAll('[data-step3-remove-manual]')].some(button=>button.closest('.section-editor')?.querySelector('textarea')?.value==="+JSON.stringify(RUNNING_MARKERS[0])+")"),
    'Quick recovery must create a manual block prefilled with the exact missing source text');
  assert.equal(await evaluate("Number(document.querySelector('[data-step3-page-char-count=\"1\"]')?.textContent?.replaceAll(',',''))"),
    recoveredCountBefore+RUNNING_MARKERS[0].length,
    'Page review character count must include the recovered text block');
  const recoveredOrder=await evaluate("(()=>{const marker="+JSON.stringify(RUNNING_MARKERS[0])+";const pages=[...document.querySelectorAll('.step3-block-review details')].map(d=>({summary:d.querySelector(':scope > summary')?.textContent,values:[...d.querySelectorAll('textarea')].map(area=>area.value),manuals:[...d.querySelectorAll('[data-step3-remove-manual]')].map(button=>button.closest('.section-editor')?.querySelector('textarea')?.value)}));const page=pages.find(d=>d.summary?.includes('원본 1페이지'));const values=page?.values??[];const allManuals=[...document.querySelectorAll('[data-step3-remove-manual]')].map(button=>({id:button.getAttribute('data-step3-remove-manual'),value:button.closest('.section-editor')?.querySelector('textarea')?.value,page:button.closest('details')?.querySelector(':scope > summary')?.textContent??null}));return{recovered:values.indexOf(marker),following:values.findIndex(value=>value.includes('STEP3_SOURCE_P1_BEGIN_901')),pages,allManuals};})()");
  assert.ok(recoveredOrder.recovered>=0&&recoveredOrder.following>=0&&recoveredOrder.recovered<recoveredOrder.following,
    'Quick recovery should insert missing text before later source blocks using its estimated source position: '+JSON.stringify(recoveredOrder));
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').checked"),false,
    'Quick recovery must revoke earlier source-review consent');
  await evaluate("document.querySelector('[data-step3-undo]').click()");
  await eventually(()=>evaluate("document.querySelectorAll('[data-step3-remove-manual]').length"),n=>n===0);
  await evaluate("document.querySelector('[data-step3-add-manual-block]').click()");
  await evaluate("(()=>{const area=document.querySelector('[data-step3-remove-manual]')?.closest('.section-editor')?.querySelector('textarea');if(!area)throw Error('Manual source recovery textarea missing');const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;set.call(area,"+JSON.stringify(RUNNING_MARKERS[0])+");area.dispatchEvent(new Event('input',{bubbles:true}));})()");
  assert.ok(await evaluate("[...document.querySelectorAll('[data-step3-source-text-missing]')].every(node=>!node.textContent.includes("+JSON.stringify(RUNNING_MARKERS[0])+"))"),
    'Typing a missing source excerpt into an included manual block should clear the live warning');
  await evaluate("document.querySelector('[data-step3-remove-manual]')?.click()");
  const toggleSourceText=(marker)=>`(()=>{const marker=${JSON.stringify(marker)};const area=[...document.querySelectorAll('.step3-block-review textarea')].find(x=>x.value.includes(marker));const input=area?.closest('.section-editor')?.querySelector('[data-step3-block-included]');if(!input)throw Error('Missing source block inclusion checkbox '+marker);input.click();return input.checked;})()`;
  await evaluate(toggleSourceText(RUNNING_MARKERS[0]));
  assert.ok(await evaluate("[...document.querySelectorAll('[data-step3-source-text-missing]')].every(node=>!node.textContent.includes("+JSON.stringify(RUNNING_MARKERS[0])+"))"),
    'Reincluding the recovered source marker should clear it from the live omission warning');
  await evaluate(toggleSourceText(RUNNING_MARKERS[0]));
  assert.equal(await evaluate("document.querySelectorAll('[data-step3-block-included]:not(:checked)').length"),4);
  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').click()");
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').checked"),true);
  const historyMarker=RUNNING_MARKERS[0];
  const historyToggle="(()=>{const marker="+JSON.stringify(historyMarker)+";const area=[...document.querySelectorAll('.step3-block-review textarea')].find(x=>x.value.includes(marker));const input=area?.closest('.section-editor')?.querySelector('[data-step3-block-included]');input.click();return input.checked;})()";
  await evaluate(historyToggle);
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').checked"),false,
    'Changing text inclusion must revoke review consent');
  await evaluate("document.querySelector('[data-step3-undo]').click()");
  await eventually(()=>evaluate("(()=>{const marker="+JSON.stringify(historyMarker)+";const area=[...document.querySelectorAll('.step3-block-review textarea')].find(x=>x.value.includes(marker));return area?.closest('.section-editor')?.querySelector('[data-step3-block-included]')?.checked;})()"),x=>x===false);
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').checked"),false);
  console.log('PASS STEP3 RUNNING HEADER/FOOTER: all four excluded, source retained, consent revoked, undo works');
  console.log('PASS STEP3 MIXED REVIEW: source markers 17/17, multi-column warning, raster recovery, unchanged persisted docs');

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
  for(const marker of MIXED_OUTPUT_MARKERS){
    assert.equal(mixedPrintedText.split(marker).length-1,1,'Included source→reprint marker loss/duplication: '+marker);
  }
  for(const marker of RUNNING_MARKERS)
    assert.equal(mixedPrintedText.includes(marker),false,'Excluded running text appeared in output: '+marker);
  assert.ok(mixedPrintedText.indexOf('STEP3_SOURCE_P1_BEGIN_901')<
    mixedPrintedText.indexOf('STEP3_SOURCE_P2_BEGIN_911'),'PDF page sequence was inverted');
  assert.ok(mixedPrintedImages.split('\n').some(line=>/^\s*\d+\s+\d+\s+image/.test(line)),
    'Redesigned print must embed a raster image');
  const m04Output=await auditPdfBytes(Buffer.from(mixedOutput.data,'base64'),
    {markers:MIXED_OUTPUT_MARKERS,requireRaster:true,label:'M04 reflowed PDF'});
  assert.equal(m04Output.markers,13);
  assert.equal(m04Output.skippedRotation,0,'Rotated output geometry requires manual review');
  console.log('PASS M04 OUTPUT A4 TEXT GEOMETRY / CONTENT:',m04Output);
  console.log('PASS STEP3 SOURCE/REPRINT COMPARISON: 13 included markers preserved, four running headers/footers excluded, source order, raster, A4, prior documents intact');
  // Intentionally unverified: original vector grid lines, column/table cell
  // geometry, pixel-for-pixel image content and Windows print fidelity.

  // M08-B: actual PDF.js scan boundary (not a mocked PdfPageInput):
  // fully scanned pages must be rejected without a new V2 document; mixed
  // scanned/selectable pages must warn before explicit approval and keep raster.
  const scanBefore=await evaluate("document.querySelectorAll('.doc-list-item').length");
  const scanTitles=await evaluate("[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent)");
  const scanOnly=makeScannedPagesPdf();
  const scannedPath=join(dir,'m08-scanned-only.pdf');
  writeFileSync(scannedPath,scanOnly);
  assert.match(execFileSync('pdfinfo',[scannedPath],{encoding:'utf8'}),/Pages:\s+2\b/);
  assert.equal(execFileSync('pdftotext',[scannedPath,'-'],{encoding:'utf8'}).trim(),'',
    'M08-B source must have zero selectable text');
  assert.equal(execFileSync('pdfimages',['-list',scannedPath],{encoding:'utf8'})
    .split('\n').filter(x=>/^\s*\d+\s+\d+\s+image/.test(x)).length,2,
    'M08-B source must have raster on both scan-only pages');
  const uploadM08=async(bytes,name)=>evaluate("(()=>{const encoded="+JSON.stringify(bytes.toString('base64'))+
    ",name="+JSON.stringify(name)+";const data=Uint8Array.from(atob(encoded),x=>x.charCodeAt(0));"+
    "const file=new File([data],name,{type:'application/pdf'});const dt=new DataTransfer();dt.items.add(file);"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');input.files=dt.files;"+
    "input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await uploadM08(scanOnly,'m08-scan-only.pdf');
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel [role=alert]')?.textContent"),
    value=>value?.includes('선택 가능한 텍스트가 없습니다'));
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),scanBefore,
    'Rejecting image-only source must never insert a project');
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-import-panel .step3-block-review'))"),false);
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-import-panel iframe[src^=blob]'))"),false,
    'Rejected scan must not retain a source URL');
  console.log('PASS M08-B CHROME/EDGE SCAN-ONLY REJECT: actual 2p image-only PDF, no extracted text, V2 document untouched');

  const partialScan=makeScannedPagesPdf({selectableSecondPage:true});
  const partialPath=join(dir,'m08-mixed-scanned-source.pdf');
  writeFileSync(partialPath,partialScan);
  const partialText=execFileSync('pdftotext',[partialPath,'-'],{encoding:'utf8'});
  for(const token of Object.values(SCAN_MARKERS))assert.ok(partialText.includes(token));
  await uploadM08(partialScan,'m08-partial-scan.pdf');
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),
    value=>value?.includes(SCAN_MARKERS.first)&&value.includes(SCAN_MARKERS.end));
  const scanWarnings=await evaluate("[...document.querySelectorAll('.step3-import-panel details li')].map(x=>x.textContent)");
  assert.ok(scanWarnings.some(x=>x?.includes('1페이지에서 선택 가능한 문자를 찾지 못했습니다')),
    'First image-only page must be identified as unextracted; do not claim OCR');
  assert.ok(scanWarnings.some(x=>x?.includes('이미지가 감지됐습니다')),
    'Mixed source must disclose image raster approximation');
  assert.equal(await evaluate("document.querySelectorAll('.step3-block-review details').length"),2,
    'Image-only and selectable pages must be separately reviewable');
  const pageTexts=await evaluate("[...document.querySelectorAll('.step3-block-review details')].map(p=>[...p.querySelectorAll('textarea')].map(t=>t.value))");
  assert.equal(pageTexts[0].length,0,'First scanned page must have zero editable text blocks');
  assert.ok(pageTexts[1].length>=1&&Object.values(SCAN_MARKERS).every(t=>pageTexts[1].join('\\n').includes(t)),
    'Second page must hold both exact selectable markers even if consecutive lines are one paragraph');
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').checked"),false);
  assert.equal(await evaluate("([...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('검수 결과를 새 문서로 저장'))).disabled"),true,
    'Partial scan must never bypass manual approval');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),scanBefore);
  await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').click()");
  await evaluate("([...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('검수 결과를 새 문서로 저장'))).click()");
  await eventually(()=>evaluate("document.querySelectorAll('.doc-list-item').length"),n=>n===scanBefore+1);
  await eventually(()=>evaluate("document.querySelector('.project-paper')?.textContent"),
    value=>value?.includes(SCAN_MARKERS.first)&&value.includes(SCAN_MARKERS.end));
  await eventually(()=>evaluate("document.querySelector('.save-chip')?.textContent"),x=>x==='저장됨');
  const restored=await evaluate("Promise.all([...document.querySelectorAll('.project-paper img')].map(x=>x.decode().then(()=>true,()=>false)))");
  assert.ok(restored.length>=1&&restored.every(Boolean),
    'A mixed scanned/selectable source must still render a recovered raster');
  const reprinted=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true});
  const m08Audit=await auditPdfBytes(Buffer.from(reprinted.data,'base64'),
    {markers:Object.values(SCAN_MARKERS),requireRaster:true,label:'M08-B partially scanned A4'});
  assert.equal(m08Audit.markers,2);
  assert.equal(m08Audit.skippedRotation,0);
  const afterScanTitles=await evaluate("[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent)");
  for(const label of scanTitles)assert.ok(afterScanTitles.includes(label),'Import overwrote previous document '+label);
  console.log('PASS M08-B MIXED SCAN REVIEW/IMPORT: page-1 no text warning, manual consent, page-2 exact source markers, retained image, A4 native browser PDF, V2 documents preserved');

  // M08-C: keep one valid, unapproved review pending, then upload a complete
  // PDF whose xref/trailer points to a nonexistent Catalog. Its selectable
  // strings/image distinguish PDF parsing failure from empty-text rejection.
  const corruptBefore=await evaluate("document.querySelectorAll('.doc-list-item').length");
  const corruptTitles=await evaluate("[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent)");
  const corruptActive=await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent");
  await uploadM08(partialScan,'m08-valid-before-corruption.pdf');
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),
    txt=>txt?.includes(SCAN_MARKERS.first)&&txt.includes(SCAN_MARKERS.end));
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),corruptBefore);
  const corruptSource=makeCorruptRootPdf();
  assert.ok(corruptSource.subarray(0,5).toString('ascii')==='%PDF-');
  assert.ok(corruptSource.includes(Buffer.from('/Root 9 0 R')));
  assert.ok(corruptSource.includes(Buffer.from(SCAN_MARKERS.first)),
    'M08-C corrupt PDF must still hold selectable content in a real page stream');
  await uploadM08(corruptSource,'m08-corrupt-catalog.pdf');
  const corruptAlert=await eventually(()=>evaluate(
    "document.querySelector('.step3-import-panel [role=alert]')?.textContent"),
    message=>typeof message==='string'&&message.trim().length>0);
  assert.ok(corruptAlert.trim().length>0,'Corrupt PDF must show a visible rejection');
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-import-panel .step3-block-review'))"),false,
    'Failed parse must clear preceding successful but uncommitted review');
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-import-panel iframe[src^=blob]'))"),false,
    'Failed parse must not retain previous source Blob URL');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),corruptBefore,
    'M08-C parser rejection inserted or removed a persisted document');
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent)"),corruptTitles);
  assert.equal(await evaluate("document.querySelector('.doc-list-item.active strong')?.textContent"),corruptActive);
  await uploadM08(partialScan,'m08-after-corruption-recovery.pdf');
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),
    txt=>txt?.includes(SCAN_MARKERS.first)&&txt.includes(SCAN_MARKERS.end));
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-import-panel [role=alert]'))"),false,
    'Valid source after malformed PDF should clear parser alert');
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').checked"),false,
    'Parser failure must not carry over review approval');
  await uploadM08(makeNumericOmissionPdf(),'m08-numeric-overlap.pdf');
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel')?.textContent"),
    text=>text?.includes('SOURCE_NUMERIC_LABEL_222')&&text.includes('7.5%'));
  await evaluate("(()=>{const areas=[...document.querySelectorAll('.step3-block-review textarea')];const area=areas.find(x=>/(^|\\s)7(\\s|$)/.test(x.value));if(!area)throw Error('Standalone numeric source block missing');const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(area,area.value.replace(/(^|\\s)7(?=\\s|$)/,'$1'));area.dispatchEvent(new Event('input',{bubbles:true}));})()");
  await eventually(()=>evaluate("[...document.querySelectorAll('[data-step3-missing-source-item] span')].some(span=>span.textContent==='7')"));
  await evaluate("(()=>{const item=[...document.querySelectorAll('[data-step3-missing-source-item]')].find(node=>node.querySelector('span')?.textContent==='7');item?.querySelector('[data-step3-show-missing-source]')?.click();})()");
  await eventually(()=>evaluate("Boolean(document.querySelector('[data-step3-selected-missing-source] [data-m06-preview][data-m06-rendered-page] [data-m06-anchor-rect]'))"));
  assert.ok(await evaluate("document.querySelector('[data-step3-missing-source-excerpt]')?.textContent==='추출 누락 원문: 7'"),
    'Missing integer 7 must remain distinct from the neighboring decimal 7.5%');
  await evaluate("(()=>{const item=[...document.querySelectorAll('[data-step3-missing-source-item]')].find(node=>node.querySelector('span')?.textContent==='7');item?.querySelector('[data-step3-recover-missing-source]')?.click();})()");
  await eventually(()=>evaluate("[...document.querySelectorAll('[data-step3-remove-manual]')].some(button=>button.closest('.section-editor')?.querySelector('textarea')?.value==='7')"));
  assert.equal(await evaluate("document.querySelector('.step3-import-panel > label.step3-confirm input').checked"),false,
    'Numeric source recovery must revoke earlier approval');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),corruptBefore,
    'Numeric source review/recovery must not write a document before approval');
  console.log('PASS STEP3 NUMERIC SOURCE UI: missing 7 is detected despite adjacent 7.5%, source location and exact recovery work, and no project is saved before approval');
  await evaluate("([...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소'))).click()");
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),corruptBefore);
  console.log('PASS M08-C CHROME/EDGE CORRUPT CATALOG: actual parsed PDF failure visible, stale review/Blob cleared, original V2 project preserved, valid source retry unapproved and canceled');



}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(dir,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP3: synthetic browser profile cleanup deferred ('+error.code+')');}
}

