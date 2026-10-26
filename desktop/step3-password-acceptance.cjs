'use strict';
// Installed Windows Electron M08-D. Local synthetic input only.
const {makePasswordProtectedPdf}=require('./step3-encrypted-fixture.cjs');
const {makeScannedPagesPdf,SCAN_MARKERS}=require('./step3-scanned-fixture.cjs');
const APP_URL='astra://app/index.html';
async function checkInstalledPasswordBoundary(lockedB64,validB64,markers){
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function until(test,label){
    for(let i=0;i<160;i++){const found=await test();if(found)return found;await wait(200);}
    throw Error('M08-D Windows timeout: '+label);
  }
  await until(()=>document.querySelector('.step3-import-panel input[type=file]')&&
    document.querySelector('.doc-list-item.active'),'ready import/editor');
  const old={
    names:[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent),
    active:document.querySelector('.doc-list-item.active strong')?.textContent,
  };
  if(!old.names.length||!old.active)throw Error('M08-D requires a stored V2 document');
  function upload(encoded,name){
    const bytes=Uint8Array.from(atob(encoded),x=>x.charCodeAt(0));
    const transfer=new DataTransfer();
    transfer.items.add(new File([bytes],name,{type:'application/pdf'}));
    const file=document.querySelector('.step3-import-panel input[type=file]');
    file.files=transfer.files;
    file.dispatchEvent(new Event('change',{bubbles:true}));
  }
  upload(validB64,'m08d-valid-before-locked.pdf');
  await until(()=>document.querySelector('.step3-import-panel')?.textContent?.includes(markers.first)&&
    document.querySelector('.step3-import-panel')?.textContent?.includes(markers.end),
    'valid PDF original review');
  upload(lockedB64,'m08d-aes256-locked.pdf');
  const notice=await until(()=>{
    const value=document.querySelector('.step3-import-panel [role=alert]')?.textContent;
    return value?.includes('암호화된 PDF는 이번 버전에서 지원하지 않습니다')?value:null;
  },'AES-256 protected PDF rejection');
  if(!notice.includes('암호를 해제하고 다시 선택하세요'))
    throw Error('M08-D missing password-specific user guidance');
  if(document.querySelector('.step3-import-panel .step3-block-review')||
    document.querySelector('.step3-import-panel iframe[src^="blob:"]'))
    throw Error('M08-D rejected source retained previous draft or Blob');
  const unchanged=()=>old.active===document.querySelector('.doc-list-item.active strong')?.textContent&&
    JSON.stringify(old.names)===JSON.stringify(
      [...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent));
  if(!unchanged())throw Error('M08-D rejected encrypted PDF modified stored V2 document');
  upload(validB64,'m08d-valid-after-locked.pdf');
  await until(()=>document.querySelector('.step3-import-panel')?.textContent?.includes(markers.end),
    'valid source recovers after rejected encrypted PDF');
  const approval=document.querySelector('.step3-import-panel > label.step3-confirm input');
  if(!approval||approval.checked||document.querySelector('.step3-import-panel [role=alert]'))
    throw Error('M08-D retained previous approval or error');
  const cancel=[...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소'));
  if(!cancel)throw Error('M08-D cancellation not offered');
  cancel.click();
  if(!unchanged())throw Error('M08-D cancel modified stored project');
  return old;
}
async function runInstalledPasswordPdfAcceptance(win){
  if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP||process.platform!=='win32')
    throw Error('M08-D Windows synthetic installed acceptance is runner-only');
  const locked=makePasswordProtectedPdf();
  if(locked.subarray(0,5).toString('ascii')!=='%PDF-'||
     !locked.includes(Buffer.from('/Encrypt')))
    throw Error('M08-D source must be a real encrypted PDF');
  const valid=makeScannedPagesPdf({selectableSecondPage:true});
  await win.loadURL(APP_URL);
  const state=await win.webContents.executeJavaScript(
    '('+checkInstalledPasswordBoundary.toString()+')('+[
      JSON.stringify(locked.toString('base64')),
      JSON.stringify(valid.toString('base64')),
      JSON.stringify(SCAN_MARKERS)
    ].join(',')+')',true);
  await win.loadURL(APP_URL);
  const restored=await win.webContents.executeJavaScript(
    "(()=>({names:[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent),"+
    "active:document.querySelector('.doc-list-item.active strong')?.textContent}))()",true);
  if(JSON.stringify(state)!==JSON.stringify(restored))
    throw Error('M08-D existing project list or selection changed after reload');
  console.log('PASS M08-D WINDOWS INSTALLED AES-256 PASSWORD: clear local rejection, stale draft/Blob removed, V2 documents preserved after reload, valid retry unapproved');
}
module.exports={runInstalledPasswordPdfAcceptance};
