'use strict';
// Actual Electron renderer connection conflict check. CI-only, synthetic data
// in a disposable RUNNER_TEMP profile; never run against an installed profile.
const path=require('node:path');
const {isDeepStrictEqual}=require('node:util');

const DB_NAME='astra-pdf-redesigner:v2';
const APP_URL='astra://app/index.html';
const BODY_MARKER='ASTRA_STEP2_BODY_8308';
const ACTIVE_KEY='activeDocumentId';

async function waitFor(evaluate,predicate,label){
  for(let i=0;i<100;i++){
    const value=await evaluate();
    if(predicate(value))return value;
    await new Promise(resolve=>setTimeout(resolve,150));
  }
  throw Error('Electron versionchange fixture timed out: '+label);
}

async function snapshot(win){
  return win.webContents.executeJavaScript(`(async()=>{
    const name=${JSON.stringify(DB_NAME)};
    const request=req=>new Promise((resolve,reject)=>{
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error||Error('IndexedDB snapshot request failed'));
    });
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open(name);
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error||Error('IndexedDB snapshot open failed'));
    });
    try{
      const stores=Array.from(db.objectStoreNames).sort();
      const tx=db.transaction(stores,'readonly');
      const done=new Promise((resolve,reject)=>{
        tx.oncomplete=()=>resolve();
        tx.onabort=()=>reject(tx.error||Error('IndexedDB snapshot aborted'));
        tx.onerror=()=>reject(tx.error||Error('IndexedDB snapshot failed'));
      });
      const data={version:db.version,stores,records:{}};
      await Promise.all(stores.map(async storeName=>{
        const store=tx.objectStore(storeName);
        if(storeName==='meta'){
          const [keys,values]=await Promise.all([request(store.getAllKeys()),request(store.getAll())]);
          data.records[storeName]=keys.map((key,index)=>[key,values[index]]);
          return;
        }
        const values=await request(store.getAll());
        data.records[storeName]=await Promise.all(values.map(async value=>{
          if(value&&value.blob instanceof Blob){
            return{...value,blob:{type:value.blob.type,size:value.blob.size,
              bytes:Array.from(new Uint8Array(await value.blob.arrayBuffer()))}};
          }
          return value;
        }));
      }));
      await done;
      return data;
    }finally{db.close();}
  })()`,true);
}

function findActiveDocument(data){
  const active=data.records.meta?.find(([key])=>key===ACTIVE_KEY)?.[1];
  return data.records.documents?.find(doc=>doc.id===active);
}

async function runStep2VersionchangeAcceptance(primary,BrowserWindow){
  if(process.env.GITHUB_ACTIONS!=='true'||!process.env.RUNNER_TEMP||
     !process.argv.includes('--astra-step2-schema-upgrade-verify'))
    throw Error('Electron versionchange acceptance requires the installed v2 GitHub Actions fixture');
  const runnerRoot=path.resolve(process.env.RUNNER_TEMP);
  const profile=path.resolve(process.env.ASTRA_STEP2_PROFILE_DIR||'');
  if(!process.env.ASTRA_STEP2_PROFILE_DIR||path.dirname(profile)!==runnerRoot||
     !/^astra-step2-profile-[A-Za-z0-9-]+$/i.test(path.basename(profile)))
    throw Error('Electron versionchange acceptance requires an isolated RUNNER_TEMP profile');

  const primaryUi=await primary.webContents.executeJavaScript(`(()=>({
    body:document.querySelector('.project-paper')?.textContent||'',
    imageWidth:document.querySelector('.project-paper figure img')?.naturalWidth||0,
    editable:document.querySelector('.section-editor textarea')?.disabled===false,
  }))()`,true);
  if(!primaryUi.body.includes(BODY_MARKER)||primaryUi.imageWidth!==2||!primaryUi.editable)
    throw Error('Installed v2 renderer did not load the synthetic STEP2 document and image');
  const before=await snapshot(primary);
  const activeBefore=findActiveDocument(before);
  if(before.version!==2||!before.stores.includes('migrationAudit')||
     !activeBefore?.content?.sections?.some(section=>section.blocks?.some(block=>
       block.kind==='paragraph'&&block.text.includes(BODY_MARKER)))||
     before.records.assets?.length!==1)
    throw Error('Installed v2 profile did not contain the expected synthetic document and PNG');

  const competing=new BrowserWindow({
    width:900,height:700,show:false,
    webPreferences:{
      preload:path.join(__dirname,'preload.cjs'),
      sandbox:true,contextIsolation:true,nodeIntegration:false,
      webviewTag:false,devTools:false,webSecurity:true,
    },
  });
  try{
    competing.webContents.setWindowOpenHandler(()=>({action:'deny'}));
    competing.webContents.on('will-navigate',(event,url)=>{
      if(!url.startsWith('astra://app/'))event.preventDefault();
    });
    await competing.loadURL(APP_URL);
    const evaluate=source=>competing.webContents.executeJavaScript(source,true);
    await waitFor(()=>evaluate("Boolean(document.querySelector('#root')?.firstElementChild)"),Boolean,'secondary Electron renderer mount');
    await waitFor(()=>evaluate("document.querySelector('.warning[role=alert]')?.textContent||''"),
      message=>message.includes('다른 탭에서 문서함을 편집'),'secondary renderer edit lock');

    const upgrade=await evaluate(`(async()=>{
      let blocked=0,upgradedFrom=null;
      const result=await new Promise((resolve,reject)=>{
        const req=indexedDB.open(${JSON.stringify(DB_NAME)},3);
        const timer=setTimeout(()=>reject(Error('Electron v2→v3 probe timed out')),10000);
        req.onblocked=()=>{blocked++;};
        req.onupgradeneeded=event=>{
          upgradedFrom=event.oldVersion;
          if(event.oldVersion!==2){req.transaction.abort();return;}
          if(!req.result.objectStoreNames.contains('electronVersionchangeProbe'))
            req.result.createObjectStore('electronVersionchangeProbe');
        };
        req.onerror=()=>{clearTimeout(timer);reject(req.error||Error('Electron probe upgrade failed'));};
        req.onsuccess=()=>{clearTimeout(timer);resolve({db:req.result,blocked,upgradedFrom});};
      });
      window.__electronVersionchangeDb=result.db;
      return{version:result.db.version,blocked:result.blocked,upgradedFrom:result.upgradedFrom,
        stores:Array.from(result.db.objectStoreNames).sort()};
    })()`);
    if(upgrade.version!==3||upgrade.upgradedFrom!==2||upgrade.blocked!==0||
       !upgrade.stores.includes('electronVersionchangeProbe'))
      throw Error('Electron renderer upgrade was blocked or did not create its synthetic schema probe');

    await waitFor(()=>primary.webContents.executeJavaScript(
      "document.querySelector('.warning[role=alert]')?.textContent||''",true),
    message=>message.includes('저장소가 다른 앱 버전에서 업데이트되었습니다'),'primary renderer versionchange warning');
    const primaryAfter=await primary.webContents.executeJavaScript(`(()=>({
      body:document.querySelector('.project-paper')?.textContent||'',
      imageWidth:document.querySelector('.project-paper figure img')?.naturalWidth||0,
      disabled:document.querySelector('.section-editor textarea')?.disabled===true,
      warning:document.querySelector('.warning[role=alert]')?.textContent||'',
    }))()`,true);
    if(!primaryAfter.body.includes(BODY_MARKER)||primaryAfter.imageWidth!==2||!primaryAfter.disabled||
       !primaryAfter.warning.includes('저장되지 않은 내용이 보이면'))
      throw Error('Primary Electron renderer did not retain the project in read-only recovery mode');

    const after=await snapshot(competing);
    if(after.version!==3||!after.stores.includes('electronVersionchangeProbe'))
      throw Error('Electron v3 synthetic schema was not readable after upgrade');
    for(const store of before.stores){
      if(!after.stores.includes(store)||!isDeepStrictEqual(before.records[store],after.records[store]))
        throw Error('Electron versionchange changed existing IndexedDB store data: '+store);
    }
    if(findActiveDocument(after)?.id!==activeBefore.id||after.records.assets?.length!==1||
       after.records.assets[0]?.blob?.bytes?.length!==before.records.assets[0]?.blob?.bytes?.length)
      throw Error('Electron versionchange lost the active document or image bytes');
    await evaluate('window.__electronVersionchangeDb.close();window.__electronVersionchangeDb=null');
    console.log('PASS ASTRA ELECTRON VERSIONCHANGE: concurrent v2 renderer upgrade closed the old connection without blocking');
    console.log('PASS ASTRA ELECTRON VERSIONCHANGE: old editor became read-only and retained its loaded project');
    console.log('PASS ASTRA ELECTRON VERSIONCHANGE: all prior stores, document, PNG bytes, metadata, and active ID survived');
  }finally{
    if(!competing.isDestroyed())competing.destroy();
  }
}

module.exports={runStep2VersionchangeAcceptance};
