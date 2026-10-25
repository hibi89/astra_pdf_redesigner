'use strict';
// Installed Windows STEP3 acceptance with only synthetic locally generated PDF.
// PDF.js UI review -> explicit approval -> IDB persistence -> new theme -> native IPC save.
// No customer PDF is read, uploaded or committed.
const fs=require('node:fs/promises');
const {acceptanceDomSource,MARKERS}=require('./pdf-acceptance-fixture.cjs');
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
    throw Error('STEP3 renderer timed out: '+label);
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
  const confirm=document.querySelector('.step3-import-panel > label.step3-confirm input[type=checkbox]');
  if(!confirm)throw Error('STEP3 explicit source-review checkbox absent');
  confirm.click();
  const save=[...document.querySelectorAll('.step3-import-panel button')].find(b=>
    b.textContent.includes('검수 결과를 새 문서로 저장'));
  if(!save||save.disabled)throw Error('STEP3 approval button disabled');
  save.click();
  await until(()=>document.querySelectorAll('.doc-list-item').length===count+1,
    'new independent IndexedDB document');
  await until(()=>{const paper=document.querySelector('.project-paper');
    return paper?.textContent?.includes('ASTRA_PDF_PAGE_ONE_7401')&&
      paper.textContent.includes('ASTRA_PDF_PAGE_TWO_7402');},
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
  return{count:count+1,themeClass:document.querySelector('.project-paper').className};
}
async function verifyPersisted(data){
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  for(let i=0;i<160;i++){
    const paper=document.querySelector('.project-paper');
    if(paper?.textContent?.includes('ASTRA_PDF_PAGE_ONE_7401')&&
       paper.textContent.includes('ASTRA_PDF_PAGE_TWO_7402')&&
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
  if(!imported?.count||!imported?.themeClass)
    throw Error('STEP3 UI commit and layout selection failed');
  await win.loadURL(APP_URL);
  const verified=await win.webContents.executeJavaScript(
    '('+verifyPersisted.toString()+')('+JSON.stringify(imported)+')',true);
  if(!verified?.buttonReady)throw Error('STEP3 installed project reload failed');
  armNativeCapture();
  await win.webContents.executeJavaScript(
    "document.querySelector('header .print-button').click(); true",true);
  await waitFor(async()=>{try{return(await fs.stat(output)).size>3000;}
    catch(error){if(error?.code==='ENOENT')return false;throw error;}},
    'actual native bridge wrote installed STEP3 A4 PDF');
  const actual=await fs.readFile(output);
  if(actual.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('Native PDF export produced invalid file');
  console.log('PASS ASTRA INSTALLED STEP3 E2E: local generated PDF -> review approval -> independent document -> changed theme -> reload -> native IPC PDF save');
}
module.exports={runStep3ProjectAcceptance};
