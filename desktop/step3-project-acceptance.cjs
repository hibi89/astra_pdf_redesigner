'use strict';
// Installed Windows STEP3 acceptance with only synthetic locally generated PDF.
// PDF.js UI review -> explicit approval -> IDB persistence -> new theme -> native IPC save.
// No customer PDF is read, uploaded or committed.
const fs=require('node:fs/promises');
const {acceptanceDomSource,MARKERS}=require('./pdf-acceptance-fixture.cjs');
const {runInstalledEightLayoutAcceptance}=require('./step3-eight-layout-acceptance.cjs');
const {makeScannedPagesPdf,SCAN_MARKERS}=require('./step3-scanned-fixture.cjs');
const {makeCorruptRootPdf}=require('./step3-invalid-fixture.cjs');
const {runInstalledPasswordPdfAcceptance}=require('./step3-password-acceptance.cjs');
const {runInstalledM09DCancelAcceptance}=require('./step3-m09d-cancel-acceptance.cjs');
const {runInstalledPdfReferenceAcceptance}=require('./step5-reference-acceptance.cjs');
const APP_URL='astra://app/index.html';
async function waitFor(check,label){
  for(let i=0;i<160;i++){
    if(await check())return;
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw Error('STEP3 installed acceptance timed out: '+label);
}
async function uploadAndConfirm(encoded){
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function until(check,label){
    for(let i=0;i<160;i++){
      if(await check())return;
      await pause(200);
    }
    const panel=document.querySelector('[data-step3-selected-source-block],[data-step3-selected-source-image],[data-step3-selected-missing-source]');
    const preview=panel?.querySelector('[data-m06-preview]');
    const canvas=preview?.querySelector('canvas');
    throw Error('STEP3 renderer timed out: '+label+' '+JSON.stringify({
      selectedBlock:panel?.getAttribute('data-step3-selected-source-block'),
      selectedImage:panel?.getAttribute('data-step3-selected-source-image'),
      renderedPage:preview?.getAttribute('data-m06-rendered-page'),
      canvas:canvas?{width:canvas.width,height:canvas.height}:null,
      warning:panel?.querySelector('[role=alert]')?.textContent,
      previewText:preview?.innerText?.slice(0,800),
    }));
  }
  await until(()=>{const input=document.querySelector('.step3-import-panel input[type=file]');
    return input&&!input.disabled&&document.querySelector('.doc-list-item.active');},'ready editor');
  const count=document.querySelectorAll('.doc-list-item').length;
  const original=document.querySelector('.doc-list-item.active strong')?.textContent;
  const data=Uint8Array.from(atob(encoded),char=>char.charCodeAt(0));
  const upload=new File([data],'astra-step3-ci-source.pdf',{type:'application/pdf'});
  const transfer=new DataTransfer();transfer.items.add(upload);
  const input=document.querySelector('.step3-import-panel input[type=file]');
  input.files=transfer.files;
  input.dispatchEvent(new Event('change',{bubbles:true}));
  await until(()=>{
    const panel=document.querySelector('.step3-import-panel');
    return panel?.textContent?.includes('ASTRA_PDF_PAGE_ONE_7401')&&
      panel.textContent.includes('ASTRA_PDF_PAGE_TWO_7402');
  },'actual PDF.js text extraction and source review');
  if(document.querySelectorAll('.doc-list-item').length!==count||
     document.querySelector('.doc-list-item.active strong')?.textContent!==original)
    throw Error('STEP3 review changed persisted document before approval');
  if(!document.querySelector('.step3-import-panel iframe[src^="blob:"]'))
    throw Error('Original PDF comparison iframe absent');
  const pageTwo=()=>[...document.querySelectorAll('.step3-block-review details')]
    .find(node=>node.querySelector(':scope > summary')?.textContent.includes('원본 2페이지'));
  const sourceText=pageTwo()?.querySelector('[data-step3-show-source]');
  if(!sourceText)throw Error('STEP3 block-to-source action absent in installed review');
  sourceText.click();
  await until(()=>{
    const panel=document.querySelector('[data-step3-selected-source-block]');
    const preview=panel?.querySelector('[data-m06-preview][data-m06-rendered-page]');
    return preview?.getAttribute('data-m06-rendered-page')==='2'&&
      preview.querySelector('canvas')?.width>0&&preview.querySelector('[data-m06-anchor-rect]');
  },'installed source text location and estimated highlight');
  document.querySelector('[data-step3-selected-source-block] button').click();
  const sourceImage=document.querySelector('[data-step3-show-image-source]');
  if(!sourceImage)throw Error('STEP3 recovered-image source action absent in installed review');
  sourceImage.click();
  await until(()=>{
    const panel=document.querySelector('[data-step3-selected-source-image]');
    const preview=panel?.querySelector('[data-m06-preview][data-m06-rendered-page]');
    return preview?.getAttribute('data-m06-rendered-page')==='1'&&
      preview.querySelector('canvas')?.width>0&&preview.querySelector('[data-m06-anchor-rect]');
  },'installed recovered-image source placement and estimated highlight');
  document.querySelector('[data-step3-selected-source-image] button').click();
  const restoreMarker='ASTRA_PDF_PAGE_ONE_7401';
  const restoreArea=()=>[...document.querySelectorAll('.step3-block-review textarea')]
    .find(area=>area.value.includes(restoreMarker));
  const extractedText=restoreArea()?.value;
  if(!extractedText)throw Error('STEP3 extracted text baseline unavailable in installed review');
  const editedText=extractedText+' ASTRA_RESTORE_EDIT_7404';
  const setTextareaValue=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;
  setTextareaValue.call(restoreArea(),editedText);
  restoreArea().dispatchEvent(new Event('input',{bubbles:true}));
  await until(()=>document.querySelector('[data-step3-restore-extracted]'),
    'extracted-text restore action appears after edit');
  document.querySelector('[data-step3-restore-extracted]').click();
  await until(()=>restoreArea()?.value===extractedText,'restore exact extracted PDF text');
  if(document.querySelector('[data-step3-restore-extracted]'))
    throw Error('STEP3 restore control remained after restoring extracted text');
  document.querySelector('[data-step3-undo]').click();
  await until(()=>restoreArea()?.value===editedText,'undo restores edited source text');
  if(!document.querySelector('[data-step3-restore-extracted]'))
    throw Error('STEP3 undo did not restore the extracted-text action');
  if(document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').checked)
    throw Error('STEP3 restore/undo retained stale source-review consent');
  document.querySelector('[data-step3-redo]').click();
  await until(()=>restoreArea()?.value===extractedText,'redo restores exact extracted PDF text');
  if(document.querySelector('[data-step3-restore-extracted]'))
    throw Error('STEP3 redo did not restore the extracted-text baseline');
  const omissionArea=restoreArea();
  setTextareaValue.call(omissionArea,'');
  omissionArea.dispatchEvent(new Event('input',{bubbles:true}));
  await until(()=>document.querySelector('[data-step3-source-text-missing] [data-step3-missing-source-item]'),
    'omitted extracted text gets a live source mismatch entry');
  const missingItem=document.querySelector('[data-step3-source-text-missing] [data-step3-missing-source-item]');
  const missingSnippet=missingItem?.querySelector('span')?.textContent;
  if(!missingSnippet)throw Error('STEP3 missing PDF source excerpt unavailable in installed review');
  missingItem.querySelector('[data-step3-show-missing-source]')?.click();
  await until(()=>document.querySelector('[data-step3-selected-missing-source] [data-m06-preview][data-m06-rendered-page] [data-m06-anchor-rect]'),
    'omitted text source location renders with estimated highlight');
  const recoveryItem=[...document.querySelectorAll('[data-step3-source-text-missing] [data-step3-missing-source-item]')]
    .find(node=>node.querySelector('span')?.textContent===missingSnippet);
  if(!recoveryItem?.querySelector('[data-step3-recover-missing-source]'))
    throw Error('STEP3 missing source quick-recovery action absent');
  recoveryItem.querySelector('[data-step3-recover-missing-source]').click();
  await until(()=>[...document.querySelectorAll('[data-step3-remove-manual]')]
    .some(button=>button.closest('.section-editor')?.querySelector('textarea')?.value===missingSnippet),
    'quick recovery creates an exact manual source-text block');
  if(document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]').checked)
    throw Error('STEP3 missing source recovery retained earlier review consent');
  document.querySelector('[data-step3-undo]').click();
  await until(()=>document.querySelectorAll('[data-step3-remove-manual]').length===0,
    'undo removes the quick-recovered source block');
  document.querySelector('[data-step3-undo]').click();
  await until(()=>restoreArea()?.value===extractedText,'undo restores source text after omission recovery review');
  const addMissing=pageTwo()?.querySelector('[data-step3-add-manual-block]');
  if(!addMissing)throw Error('STEP3 manual missing-text recovery action absent');
  addMissing.click();
  await until(()=>pageTwo()?.querySelector('[data-step3-remove-manual]'),
    'manual correction block added to installed review');
  const manualArea=pageTwo().querySelectorAll('textarea');
  const correction=manualArea[manualArea.length-1];
  if(!correction||!pageTwo().querySelector('[data-step3-remove-manual]'))
    throw Error('STEP3 manual correction block was not created');
  const approval=document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]');
  const save=[...document.querySelectorAll('.step3-import-panel button')].find(button=>
    button.textContent.includes('검수 결과를 새 문서로 저장'));
  if(!approval||!save)throw Error('STEP3 manual review approval controls missing');
  approval.click();
  if(!save.disabled||!document.querySelector('[data-step3-empty-block-warning]'))
    throw Error('STEP3 empty manual correction must warn and block save');
  const setValue=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;
  setValue.call(correction,'ASTRA_MANUAL_MISSING_7403');
  correction.dispatchEvent(new Event('input',{bubbles:true}));
  await until(()=>!document.querySelector('[data-step3-empty-block-warning]'),
    'manual correction completes empty-block warning');
  approval.click();
  if(save.disabled)throw Error('STEP3 completed manual correction remains unsavable');
  const confirm=document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]');
  if(!confirm?.checked||!save||save.disabled)throw Error('STEP3 explicit source-review checkbox or approval state missing');
  save.click();
  await until(()=>document.querySelectorAll('.doc-list-item').length===count+1,
    'new independent IndexedDB document');
  await until(()=>Boolean(document.querySelector('.studio-source-panel iframe[src^="blob:"]')),
    'active original PDF stays visible after successful installed import');
  await until(()=>{const paper=document.querySelector('.project-paper');
    return paper?.textContent?.includes('ASTRA_PDF_PAGE_ONE_7401')&&
      paper.textContent.includes('ASTRA_PDF_PAGE_TWO_7402')&&
      paper.textContent.includes('ASTRA_MANUAL_MISSING_7403');},
    'source tokens in new A4 preview');
  const firstClass=document.querySelector('.project-paper').className;
  const themes=[...document.querySelectorAll('input[name=v2theme]')];
  const alternative=themes.find(radio=>!radio.checked);
  if(!alternative)throw Error('No second PDF layout theme');
  alternative.click();
  await until(()=>document.querySelector('.project-paper')?.className!==firstClass,
    'different selected print theme');
  await until(()=>document.querySelector('.save-chip')?.textContent==='저장됨',
    'new PDF project persisted');
  return{count:count+1,themeClass:document.querySelector('.project-paper').className,
    manualMarker:'ASTRA_MANUAL_MISSING_7403',sourceTextRestored:true,
    missingTextSourceLocated:true,missingTextRecovered:true};
}
async function verifyPersisted(data){
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  for(let i=0;i<160;i++){
    const paper=document.querySelector('.project-paper');
    if(paper?.textContent?.includes('ASTRA_PDF_PAGE_ONE_7401')&&
       paper.textContent.includes('ASTRA_PDF_PAGE_TWO_7402')&&
       (!data.manualMarker||paper.textContent.includes(data.manualMarker))&&
       document.querySelectorAll('.doc-list-item').length===data.count&&
       paper.className===data.themeClass){
      const button=document.querySelector('header .print-button');
      if(!button||button.disabled||!button.textContent.includes('PDF 파일 저장'))
        throw Error('Windows native PDF save UI missing');
      return{buttonReady:true};
    }
    await pause(200);
  }
  throw Error('Imported STEP3 document/theme not restored after reload');
}

async function verifyInstalledScanBoundary(scanOnlyB64,partialB64,corruptB64,markers){
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function until(test,label){
    for(let i=0;i<160;i++){
      const answer=await test();
      if(answer)return answer;
      await pause(200);
    }
    throw Error('M08-B installed scan boundary timed out: '+label);
  }
  await until(()=>document.querySelector('.step3-import-panel input[type=file]')&&
    document.querySelector('.doc-list-item.active'),'source upload ready');
  const before=document.querySelectorAll('.doc-list-item').length;
  const current=document.querySelector('.doc-list-item.active strong')?.textContent;
  async function upload(encoded,name){
    const bytes=Uint8Array.from(atob(encoded),x=>x.charCodeAt(0));
    const transfer=new DataTransfer();
    transfer.items.add(new File([bytes],name,{type:'application/pdf'}));
    const input=document.querySelector('.step3-import-panel input[type=file]');
    input.files=transfer.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  await upload(scanOnlyB64,'m08-windows-scan-only.pdf');
  await until(()=>document.querySelector('.step3-import-panel [role=alert]')?.textContent
    .includes('선택 가능한 텍스트가 없습니다'),'full-scan rejection alert');
  if(document.querySelectorAll('.doc-list-item').length!==before||
    document.querySelector('.doc-list-item.active strong')?.textContent!==current||
    document.querySelector('.step3-import-panel .step3-block-review')||
    document.querySelector('.step3-import-panel iframe[src^="blob:"]'))
    throw Error('M08-B scan-only rejection changed user project/source state');
  await upload(partialB64,'m08-windows-partial-scan.pdf');
  await until(()=>document.querySelector('.step3-import-panel')?.textContent?.includes(markers.first)&&
    document.querySelector('.step3-import-panel')?.textContent?.includes(markers.end),
    'mixed scan local PDF.js review');
  const warnings=[...document.querySelectorAll('.step3-import-panel details li')].map(x=>x.textContent);
  if(!warnings.some(x=>x.includes('1페이지에서 선택 가능한 문자를 찾지 못했습니다'))||
     document.querySelectorAll('.step3-block-review details').length!==2)
    throw Error('M08-B installed mixed-scan loss warning or page review missing');
  const sections=[...document.querySelectorAll('.step3-block-review details')];
  if(sections[0].querySelectorAll('textarea').length!==0||
     sections[1].querySelectorAll('textarea').length<1||
     ![markers.first,markers.end].every(t=>
       [...sections[1].querySelectorAll('textarea')].some(x=>x.value.includes(t))))
    throw Error('M08-B scanned first page must have zero editable text and second page both markers');
  const checkbox=document.querySelector('.step3-import-panel > label.step3-confirm input');
  const save=[...document.querySelectorAll('.step3-import-panel button')].find(x=>
    x.textContent.includes('검수 결과를 새 문서로 저장'));
  if(!checkbox||checkbox.checked||!save||!save.disabled)
    throw Error('M08-B partial scan bypasses explicit review approval');
  const cancel=[...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소'));
  if(!cancel)throw Error('M08-B cancel source review button missing');
  cancel.click();
  await until(()=>!document.querySelector('.step3-import-panel .step3-block-review'),'cancel clears draft');
  if(document.querySelectorAll('.doc-list-item').length!==before||
    document.querySelector('.doc-list-item.active strong')?.textContent!==current)
    throw Error('M08-B cancel damaged existing persisted project');

  // M08-C: valid pending review -> damaged xref Catalog -> valid retry. A failed
  // parse must clear old draft/Blob/approval and preserve the stored V2 project.
  await upload(partialB64,'m08-valid-before-corrupt.pdf');
  await until(()=>document.querySelector('.step3-import-panel')?.textContent?.includes(markers.first),
    'pre-corruption valid source review');
  await upload(corruptB64,'m08-corrupt-root.pdf');
  await until(()=>Boolean(document.querySelector('.step3-import-panel [role=alert]')?.textContent?.trim()),
    'corrupt Catalog PDF visible failure');
  if(document.querySelector('.step3-import-panel .step3-block-review')||
    document.querySelector('.step3-import-panel iframe[src^="blob:"]')||
    document.querySelectorAll('.doc-list-item').length!==before||
    document.querySelector('.doc-list-item.active strong')?.textContent!==current)
    throw Error('M08-C corrupt PDF preserved stale review or damaged persisted V2 project');
  await upload(partialB64,'m08-recovered-after-corrupt.pdf');
  await until(()=>document.querySelector('.step3-import-panel')?.textContent?.includes(markers.end),
    'valid source reopens after corrupt PDF');
  const approval=document.querySelector('.step3-import-panel > label.step3-confirm input');
  if(!approval||approval.checked||document.querySelector('.step3-import-panel [role=alert]'))
    throw Error('M08-C recovery retained error or stale manual approval');
  const discard=[...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소'));
  if(!discard)throw Error('M08-C recovery missing cancel');
  discard.click();
  if(document.querySelectorAll('.doc-list-item').length!==before||
    document.querySelector('.doc-list-item.active strong')?.textContent!==current)
    throw Error('M08-C retry and cancel modified persisted project');
  return {rejectedWithoutWrite:true,mixedWarnedWithoutApproval:true,cancelPreserved:true,
    corruptRejected:true,corruptRecoveryWithoutWrite:true};
}

async function runStep3ProjectAcceptance(win,renderLocalPdf,armNativeCapture,output){
  if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP)
    throw Error('STEP3 installed acceptance requires GitHub Actions');
  await waitFor(()=>win.webContents.executeJavaScript(
    "Boolean(document.querySelector('.paper-surface'))",true),'initial A4 preview');
  const source=await win.webContents.executeJavaScript(acceptanceDomSource(),true);
  if(!source?.imageLoaded||!source?.text?.includes(MARKERS.first)||
     !source.text.includes(MARKERS.second)||!source.text.includes(MARKERS.korean))
    throw Error('Synthetic source preview unavailable');
  const bytes=await renderLocalPdf();
  if(bytes.length<3000||bytes.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('STEP3 source PDF generation failed');
  await win.loadURL(APP_URL);
  const encoded=JSON.stringify(bytes.toString('base64'));
  const imported=await win.webContents.executeJavaScript(
    '('+uploadAndConfirm.toString()+')('+encoded+')',true);
  if(!imported?.count||!imported?.themeClass||!imported?.missingTextSourceLocated||!imported?.missingTextRecovered)
    throw Error('STEP3 UI commit and layout selection failed');
  await win.loadURL(APP_URL);
  const stale=await win.webContents.executeJavaScript(
    "Boolean(document.querySelector('.studio-source-panel'))",true);
  if(stale)throw Error('Original Blob URL unexpectedly persisted after installed app reload');
  const verified=await win.webContents.executeJavaScript(
    '('+verifyPersisted.toString()+')('+JSON.stringify(imported)+')',true);
  if(!verified?.buttonReady)throw Error('STEP3 installed project reload failed');
  // M08-A opt-in: use actual installed renderer, with the same committed source;
  // independent PDF.js audit runs only after the process exits.
  if(process.argv.includes('--astra-step3-eight-layouts'))
    await runInstalledEightLayoutAcceptance(win,renderLocalPdf);
  armNativeCapture();
  await win.webContents.executeJavaScript(
    "document.querySelector('header .print-button').click(); true",true);
  await waitFor(async()=>{try{return(await fs.stat(output)).size>3000;}
    catch(error){if(error?.code==='ENOENT')return false;throw error;}},
    'actual native bridge wrote installed STEP3 A4 PDF');
  const actual=await fs.readFile(output);
  if(actual.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('Native PDF export produced invalid file');
  // M08-B: separate installed renderer navigation after the successful native
  // export; synth scanned image-only PDF must refuse import, partial scan warns
  // and cancel must preserve the formerly imported V2 project.
  await win.loadURL(APP_URL);
  const scanResult=await win.webContents.executeJavaScript(
    '('+verifyInstalledScanBoundary.toString()+')('+[
      JSON.stringify(makeScannedPagesPdf().toString('base64')),
      JSON.stringify(makeScannedPagesPdf({selectableSecondPage:true}).toString('base64')),
      JSON.stringify(makeCorruptRootPdf().toString('base64')),
      JSON.stringify(SCAN_MARKERS),
    ].join(',')+')',true);
  if(!scanResult?.rejectedWithoutWrite||!scanResult.mixedWarnedWithoutApproval||
     !scanResult.cancelPreserved)throw Error('M08-B installed scan boundary failed');
  if(!scanResult.corruptRejected||!scanResult.corruptRecoveryWithoutWrite)
    throw Error('M08-C installed corrupt PDF boundary failed');
  // M08-A's real eight-layout sequence intentionally ends on a different
  // persisted theme than the first imported theme. Capture that later state,
  // instead of comparing reload against the stale pre-M08-A class.
  await waitFor(()=>win.webContents.executeJavaScript(
    "document.querySelector('.save-chip')?.textContent==='저장됨'",true),
    'M08-A selected theme is saved before M08-C persistence audit');
  const finalTheme=await win.webContents.executeJavaScript(
    "document.querySelector('.project-paper')?.className",true);
  if(!finalTheme)throw Error('M08-C missing final theme before reload');
  await win.loadURL(APP_URL);
  await win.webContents.executeJavaScript(
    '('+verifyPersisted.toString()+')('+JSON.stringify({...imported,themeClass:finalTheme})+')',true);
  console.log('PASS M08-C WINDOWS INSTALLED CORRUPT CATALOG: parser rejects, stale draft/Blob cleared, valid retry canceled, V2 persisted across reload');
  await runInstalledPasswordPdfAcceptance(win);
  await runInstalledM09DCancelAcceptance(win,bytes,MARKERS);
  await runInstalledPdfReferenceAcceptance(win,bytes);
  console.log('PASS M08-B WINDOWS INSTALLED SCAN: full scan rejected; mixed scanned page warned and approval blocked; cancel and prior project retained');
  console.log('PASS ASTRA INSTALLED STEP3 E2E: local generated PDF -> review approval -> independent document -> changed theme -> reload -> native IPC PDF save');
}
module.exports={runStep3ProjectAcceptance};
