'use strict';
// M09-D: drive the real STEP3 import UI in the installed Windows Electron app.
// Synthetic PDF bytes only; never runs against a developer/user profile.
const APP_URL='astra://app/index.html';

async function waitFor(check,label){
  for(let i=0;i<200;i++){
    if(await check())return;
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw Error('M09-D installed acceptance timed out: '+label);
}

async function snapshotInstalledV2(){
  const db=await new Promise((resolve,reject)=>{
    const request=indexedDB.open('astra-pdf-redesigner:v2');
    request.onupgradeneeded=()=>{
      request.transaction?.abort();
      reject(Error('M09-D expected an existing V2 database; refusing migration'));
    };
    request.onerror=()=>reject(request.error||Error('M09-D could not open existing V2 database'));
    request.onsuccess=()=>resolve(request.result);
  });
  // IDB upgrade version is 1; schemaVersion:2 belongs to stored documents.
  if(db.version!==1){db.close();throw Error('M09-D expected IndexedDB upgrade version 1 (document schema V2), got '+db.version);}
  const stores=Array.from(db.objectStoreNames).sort();
  if(!['assets','documents','meta'].every(name=>stores.includes(name))){
    db.close();throw Error('M09-D missing a V2 object store: '+stores.join(','));
  }
  const tx=db.transaction(stores,'readonly');
  const done=new Promise((resolve,reject)=>{
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error||Error('M09-D V2 snapshot transaction failed'));
    tx.onabort=()=>reject(tx.error||Error('M09-D V2 snapshot transaction aborted'));
  });
  const requestValue=request=>new Promise((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||Error('M09-D V2 snapshot request failed'));
  });
  const rows=await Promise.all(stores.map(async name=>{
    const store=tx.objectStore(name);
    const [keys,values]=await Promise.all([
      requestValue(store.getAllKeys()),requestValue(store.getAll()),
    ]);
    return{name,keys,values};
  }));
  await done;db.close();
  async function normalize(value){
    if(value instanceof Blob){
      const bytes=await value.arrayBuffer();
      const hash=await crypto.subtle.digest('SHA-256',bytes);
      return{$type:'Blob',type:value.type,size:value.size,
        sha256:Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('')};
    }
    if(value instanceof ArrayBuffer||ArrayBuffer.isView(value)){
      const bytes=value instanceof ArrayBuffer?new Uint8Array(value):
        new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
      const hash=await crypto.subtle.digest('SHA-256',bytes);
      return{$type:value.constructor?.name||'ArrayBuffer',size:bytes.byteLength,
        sha256:Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('')};
    }
    if(value instanceof Date)return{$type:'Date',value:value.toISOString()};
    if(Array.isArray(value))return Promise.all(value.map(normalize));
    if(value&&typeof value==='object'){
      const result={};
      for(const key of Object.keys(value).sort())result[key]=await normalize(value[key]);
      return result;
    }
    return value;
  }
  const normalized=[];
  for(const row of rows)normalized.push({name:row.name,
    keys:await Promise.all(row.keys.map(normalize)),
    values:await Promise.all(row.values.map(normalize))});
  const serialized=JSON.stringify(normalized);
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(serialized));
  return{signature:Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join(''),
    stores,recordCounts:Object.fromEntries(rows.map(row=>[row.name,row.values.length]))};
}

async function runInstalledM09DCancelAcceptance(win,pdfBytes,markers){
  if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP||process.platform!=='win32')
    throw Error('M09-D requires an installed Windows app on an ephemeral GitHub runner');
  if(!Buffer.isBuffer(pdfBytes)||pdfBytes.subarray(0,5).toString('ascii')!=='%PDF-')
    throw Error('M09-D needs the existing synthetic PDF fixture');
  await win.loadURL(APP_URL);
  const evaluate=expression=>win.webContents.executeJavaScript(expression,true);
  await waitFor(()=>evaluate(
    "Boolean(document.querySelector('.step3-import-panel input[type=file]')&&"+
    "document.querySelector('.doc-list-item.active')&&document.querySelector('.save-chip')?.textContent==='저장됨')"),
    'existing saved V2 project is hydrated before M09-D');
  const before=await evaluate('('+snapshotInstalledV2.toString()+')()');
  if(!before?.signature||!before.recordCounts?.documents)
    throw Error('M09-D needs at least one saved V2 document before cancellation');
  let hooksInstalled=false;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function upload(name){
    const encoded=pdfBytes.toString('base64');
    const script="(()=>{const panel=document.querySelector('.step3-import-panel');"+
      "const input=panel?.querySelector('input[type=file]');if(!input||input.disabled)throw Error('M09-D file input is not available');"+
      "const data=Uint8Array.from(atob("+JSON.stringify(encoded)+"),c=>c.charCodeAt(0));"+
      "const transfer=new DataTransfer();transfer.items.add(new File([data],"+JSON.stringify(name)+",{type:'application/pdf'}));"+
      "input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));return true;})()";
    await evaluate(script);
  }
  try{
    hooksInstalled=true;
    await evaluate("(()=>{const state={held:false,released:false,oldBytesDelivered:false,created:[],revoked:[],"+
      "originalArrayBuffer:File.prototype.arrayBuffer,originalCreate:URL.createObjectURL,originalRevoke:URL.revokeObjectURL};"+
      "window.__astraM09D=state;File.prototype.arrayBuffer=function(...args){if(this.name!=='m09d-old.pdf')return state.originalArrayBuffer.apply(this,args);"+
      "if(state.held)throw Error('M09-D old PDF was read more than once');state.held=true;const file=this;"+
      "return new Promise((resolve,reject)=>{state.releaseOld=()=>{if(state.released)return;state.released=true;"+
      "state.originalArrayBuffer.apply(file,args).then(bytes=>{state.oldBytesDelivered=true;resolve(bytes);},reject);};});};"+
      "URL.createObjectURL=function(value){const url=state.originalCreate.call(URL,value);"+
      "if(value instanceof File&&value.name.startsWith('m09d-'))state.created.push({name:value.name,url});return url;};"+
      "URL.revokeObjectURL=function(url){state.revoked.push(url);return state.originalRevoke.call(URL,url);};return true;})()",true);
    await upload('m09d-old.pdf');
    await waitFor(()=>evaluate(
      "Boolean(window.__astraM09D?.held&&document.querySelector('.step3-import-panel p[role=status]')?.textContent.includes('분석'))"),
      'old synthetic PDF is actively being analyzed with its File bytes held');
    const pending=await evaluate("(()=>{const panel=document.querySelector('.step3-import-panel');"+
      "const button=[...panel.querySelectorAll('button')].find(x=>x.textContent.includes('가져오기 취소'));"+
      "const style=button&&getComputedStyle(button);return{exists:!!button,disabled:button?.disabled??true,"+
      "visible:!!button&&button.getClientRects().length>0&&style.display!=='none'&&style.visibility!=='hidden',"+
      "inputDisabled:panel.querySelector('input[type=file]')?.disabled};})()",true);
    if(!pending.exists||pending.disabled||!pending.visible||!pending.inputDisabled)
      throw Error('M09-D real installed UI must expose an enabled, visible cancel while file analysis is pending');
    await evaluate("[...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소')).click();true");
    await waitFor(()=>evaluate("(()=>{const p=document.querySelector('.step3-import-panel');return p&&"+
      "!p.querySelector('.step3-block-review')&&!p.querySelector('p[role=status]')&&"+
      "!p.querySelector('input[type=file]').disabled;})()"),
      'cancel clears review and re-enables the installed file picker while old parsing remains pending');
    await upload('m09d-new.pdf');
    await waitFor(()=>evaluate("(()=>{const p=document.querySelector('.step3-import-panel');return p?.textContent?.includes('m09d-new.pdf')&&"+
      "p.textContent.includes("+JSON.stringify(markers.first)+")&&p.querySelector('.step3-block-review');})()"),
      'new valid source selected and reviewed in the installed app');
    const review=await evaluate("(()=>{const p=document.querySelector('.step3-import-panel');"+
      "const approval=p.querySelector('.step3-confirm input[type=checkbox]');"+
      "const save=[...p.querySelectorAll('button')].find(x=>x.textContent.includes('검수 결과를 새 문서로 저장'));"+
      "return{text:p.textContent,approved:approval?.checked??null,saveDisabled:save?.disabled??null};})()",true);
    if(!review.text.includes('m09d-new.pdf')||review.text.includes('m09d-old.pdf')||
       review.approved!==false||review.saveDisabled!==true)
      throw Error('M09-D new review must be distinct, unapproved and unsaved before late completion');
    await evaluate("if(!window.__astraM09D?.releaseOld)throw Error('M09-D held old parse cannot be released');"+
      "window.__astraM09D.releaseOld();true");
    await waitFor(()=>evaluate('window.__astraM09D?.oldBytesDelivered===true'),
      'old PDF bytes are released after the newer file has been reviewed');
    await wait(4500); // Give the stale PDF.js continuation time to finish after its bytes arrive.
    const late=await evaluate("(()=>{const s=window.__astraM09D,p=document.querySelector('.step3-import-panel');"+
      "const approval=p.querySelector('.step3-confirm input[type=checkbox]');"+
      "const save=[...p.querySelectorAll('button')].find(x=>x.textContent.includes('검수 결과를 새 문서로 저장'));"+
      "return{text:p.textContent,approved:approval?.checked??null,saveDisabled:save?.disabled??null,"+
      "oldUrls:s.created.filter(x=>x.name==='m09d-old.pdf'),newUrls:s.created.filter(x=>x.name==='m09d-new.pdf'),"+
      "released:s.released,bytesDelivered:s.oldBytesDelivered};})()",true);
    if(!late.released||!late.bytesDelivered||late.oldUrls.length!==0||late.newUrls.length!==1||
       !late.text.includes('m09d-new.pdf')||late.text.includes('m09d-old.pdf')||
       late.approved!==false||late.saveDisabled!==true)
      throw Error('M09-D late old parse replaced or approved the newer review, or created an orphan source URL');
    await evaluate("[...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소')).click();true");
    await waitFor(()=>evaluate("!document.querySelector('.step3-import-panel .step3-block-review')"),
      'user cancels the newer unapproved source review');
    const final=await evaluate("(()=>{const s=window.__astraM09D;return{newUrls:s.created.filter(x=>x.name==='m09d-new.pdf').map(x=>x.url),"+
      "revoked:s.revoked,hasDraft:Boolean(document.querySelector('.step3-import-panel .step3-block-review'))};})()",true);
    if(final.hasDraft||!final.newUrls.length||!final.newUrls.every(url=>final.revoked.includes(url)))
      throw Error('M09-D cancel must revoke the new source URL and clear its review');
    const afterCancel=await evaluate('('+snapshotInstalledV2.toString()+')()');
    if(JSON.stringify(before)!==JSON.stringify(afterCancel))
      throw Error('M09-D cancel/retry/stale completion changed V2 stores before reload');
    const result={before,afterCancel,oldUrlCreated:late.oldUrls.length,
      newUrlCreated:final.newUrls.length,newUrlRevoked:true,lateOldBytesDelivered:late.bytesDelivered};
    await evaluate("(()=>{const s=window.__astraM09D;if(!s)return;File.prototype.arrayBuffer=s.originalArrayBuffer;"+
      "URL.createObjectURL=s.originalCreate;URL.revokeObjectURL=s.originalRevoke;delete window.__astraM09D;return true;})()",true);
    hooksInstalled=false;
    await win.loadURL(APP_URL);
    await waitFor(()=>win.webContents.executeJavaScript(
      "Boolean(document.querySelector('.doc-list-item.active')&&document.querySelector('.step3-import-panel input[type=file]')&&"+
      "document.querySelector('.save-chip')?.textContent==='저장됨')",true),
      'existing V2 project is rehydrated after M09-D cancel/retry');
    const afterReload=await evaluate('('+snapshotInstalledV2.toString()+')()');
    if(JSON.stringify(before)!==JSON.stringify(afterReload))
      throw Error('M09-D V2 stores differ after installed-app reload');
    console.log('PASS M09-D WINDOWS INSTALLED UI: visible cancel during analysis, replacement selection, released stale parse ignored, new URL revoked, full V2 stores unchanged before/after reload');
    return result;
  }finally{
    if(hooksInstalled){
      try{await evaluate("(()=>{const s=window.__astraM09D;if(!s)return;"+
        "if(s.held&&!s.released)s.releaseOld?.();File.prototype.arrayBuffer=s.originalArrayBuffer;"+
        "URL.createObjectURL=s.originalCreate;URL.revokeObjectURL=s.originalRevoke;delete window.__astraM09D;return true;})()");}
      catch{}
    }
  }
}

module.exports={runInstalledM09DCancelAcceptance};
