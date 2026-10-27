// Real-browser IndexedDB upgrade boundaries in a disposable profile. All
// documents and image bytes are synthetic and the profile is removed at exit.
import assert from 'node:assert/strict';
import {existsSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';

const browser=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-idb-versionchange-'));
const browserSession=launchBrowser(browser,profile,'STEP2 IndexedDB versionchange');
const DB_NAME='astra-pdf-redesigner:v2';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let ws,sequence=1,testError;
const pending=new Map(),targets=[];

function rpc(method,params={},sessionId){
  return new Promise((resolve,reject)=>{
    const id=sequence++;
    pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
}
async function until(fn,predicate=value=>Boolean(value),timeout=15000){
  const started=Date.now();let last;
  while(Date.now()-started<timeout){
    try{last=await fn();if(predicate(last))return last;}
    catch(error){if(!/context was destroyed|Cannot find context|navigated or closed/i.test(String(error)))throw error;}
    await delay(100);
  }
  throw Error('IndexedDB versionchange condition timed out (last='+JSON.stringify(last)+')');
}
async function attach(){
  const {targetId}=await rpc('Target.createTarget',{url});targets.push(targetId);
  const {sessionId}=await rpc('Target.attachToTarget',{targetId,flatten:true});
  const send=(method,params={})=>rpc(method,params,sessionId);
  await send('Runtime.enable');await send('Page.enable');
  const evalJS=async(expression)=>{
    const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(response.exceptionDetails)throw Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  const reload=async()=>{
    let listener,timer;
    const loaded=new Promise((resolve,reject)=>{
      listener=event=>{
        const message=JSON.parse(event.data);
        if(message.sessionId===sessionId&&message.method==='Page.loadEventFired'){
          clearTimeout(timer);ws.removeEventListener('message',listener);resolve();
        }
      };
      ws.addEventListener('message',listener);
      timer=setTimeout(()=>{ws.removeEventListener('message',listener);reject(Error('Page reload timed out'));},15000);
    });
    try{await send('Page.reload',{ignoreCache:true});await loaded;}
    finally{clearTimeout(timer);ws.removeEventListener('message',listener);}
  };
  return{targetId,sessionId,send,evalJS,reload};
}
const snapshotExpression=dbExpression=>`(async()=>{
  const database=${dbExpression};
  const read=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
  const tx=database.transaction(['documents','assets','meta'],'readonly');
  const [documents,assets,activeDocumentId]=await Promise.all([
    read(tx.objectStore('documents').getAll()),
    read(tx.objectStore('assets').getAll()),
    read(tx.objectStore('meta').get('activeDocumentId')),
  ]);
  const images=await Promise.all(assets.map(async asset=>({
    id:asset.id,documentId:asset.documentId,mimeType:asset.mimeType,
    originalName:asset.originalName,byteSize:asset.byteSize,width:asset.width,height:asset.height,
    bytes:Array.from(new Uint8Array(await asset.blob.arrayBuffer())),
  })));
  return{version:database.version,documents,images,activeDocumentId,stores:Array.from(database.objectStoreNames).sort()};
})()`;

try{
  ws=await browserSession.connect();
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id&&pending.has(message.id)){
      const item=pending.get(message.id);pending.delete(message.id);
      if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
    }
  });

  const first=await attach();
  await until(()=>first.evalJS("Boolean(document.querySelector('.project-paper')&&document.querySelector('.doc-list-item.active'))"));

  const seeded=await first.evalJS(`(async()=>{
    const model=await import('/src/step2/model.ts');
    const storage=await import('/src/step2/idb.ts');
    const db=await storage.openDatabase();
    try{
      const doc=model.blankProject('2026-10-19T00:00:00.000Z');
      doc.name='Synthetic versionchange preservation';
      doc.content.title='Synthetic versionchange preservation';
      const assetId='synthetic-versionchange-png';
      const sectionId=crypto.randomUUID(),paragraphId=crypto.randomUUID(),imageBlockId=crypto.randomUUID();
      doc.content.sections=[{id:sectionId,title:'Synthetic data',blocks:[
        {id:paragraphId,kind:'paragraph',text:'VERSIONCHANGE_DOCUMENT_SENTINEL_20261019'},
        {id:imageBlockId,kind:'image',assetId,caption:'Synthetic image metadata',alignment:'center',size:'medium'},
      ]}];
      const encoded='iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGOUS3nGwMDAxMDAwMDAAAAQQgFsBOs6hwAAAABJRU5ErkJggg==';
      const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
      const asset={id:assetId,documentId:doc.id,mimeType:'image/png',originalName:'synthetic-versionchange.png',byteSize:bytes.length,width:2,height:2,blob:new Blob([bytes],{type:'image/png'})};
      await storage.writeTransaction(db,doc,[asset],[],{[storage.ACTIVE]:doc.id});
      const read=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
      const tx=db.transaction(['documents','assets','meta'],'readonly');
      const [documents,assets,activeDocumentId]=await Promise.all([
        read(tx.objectStore('documents').getAll()),read(tx.objectStore('assets').getAll()),read(tx.objectStore('meta').get('activeDocumentId')),
      ]);
      const images=await Promise.all(assets.map(async item=>({
        id:item.id,documentId:item.documentId,mimeType:item.mimeType,originalName:item.originalName,
        byteSize:item.byteSize,width:item.width,height:item.height,bytes:Array.from(new Uint8Array(await item.blob.arrayBuffer())),
      })));
      return{doc,documents,images,activeDocumentId};
    }finally{db.close();}
  })()`);
  await first.reload();
  await until(()=>first.evalJS("Boolean(document.querySelector('.project-paper')?.textContent.includes('VERSIONCHANGE_DOCUMENT_SENTINEL_20261019')&&document.querySelector('.project-paper img')?.naturalWidth===2)"));
  console.log('PASS STEP2 VERSIONCHANGE: synthetic document and PNG loaded before concurrent upgrade');

  const second=await attach();
  await until(()=>second.evalJS("Boolean(document.querySelector('.warning[role=alert]')?.textContent.includes('다른 탭에서 문서함을 편집'))"));
  const upgradeV2=await second.evalJS(`(async()=>{
    let blocked=0;
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open(${JSON.stringify(DB_NAME)},2);
      const timer=setTimeout(()=>reject(Error('version 2 open timed out')),8000);
      req.onblocked=()=>blocked++;
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('versionchangeProbe'))req.result.createObjectStore('versionchangeProbe');};
      req.onerror=()=>{clearTimeout(timer);reject(req.error)};
      req.onsuccess=()=>{clearTimeout(timer);resolve(req.result)};
    });
    window.__upgradeDb=db;
    return{version:db.version,blocked,stores:Array.from(db.objectStoreNames).sort()};
  })()`);
  assert.equal(upgradeV2.version,2,'the competing v2 open did not finish');
  assert.equal(upgradeV2.blocked,0,'the application did not close its connection on versionchange');
  const v2Snapshot=await second.evalJS(snapshotExpression('window.__upgradeDb'));
  assert.deepEqual(v2Snapshot.documents,seeded.documents,'v1→v2 changed or removed a document');
  assert.deepEqual(v2Snapshot.images,seeded.images,'v1→v2 changed PNG bytes or metadata');
  assert.equal(v2Snapshot.activeDocumentId,seeded.activeDocumentId,'v1→v2 changed the active document ID');
  await until(()=>first.evalJS("document.querySelector('.warning[role=alert]')?.textContent||''"),message=>message.includes('저장소가 다른 앱 버전에서 업데이트되었습니다'));
  assert.equal(await first.evalJS("document.querySelector('.section-editor .block-editor textarea')?.disabled"),true,'the old app tab stayed editable after its connection closed');
  assert.equal(await first.evalJS("document.querySelector('.project-paper')?.textContent.includes('VERSIONCHANGE_DOCUMENT_SENTINEL_20261019')"),true,'the old app hid the loaded document after versionchange');
  console.log('PASS STEP2 VERSIONCHANGE: v1→v2 unblocked safely; document, PNG bytes, metadata and active ID preserved');
  console.log('PASS STEP2 VERSIONCHANGE: old editor becomes read-only and asks the user to restart');

  const repeatV2=await second.evalJS(`(async()=>{
    window.__upgradeDb.close();
    let upgraded=false;
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open(${JSON.stringify(DB_NAME)},2);
      req.onupgradeneeded=()=>{upgraded=true;};
      req.onerror=()=>reject(req.error);
      req.onsuccess=()=>resolve(req.result);
    });
    window.__upgradeDb=db;
    return{version:db.version,upgraded,stores:Array.from(db.objectStoreNames).sort()};
  })()`);
  assert.equal(repeatV2.version,2);
  assert.equal(repeatV2.upgraded,false,'reopening the same version unexpectedly reran an upgrade');
  assert.deepEqual(repeatV2.stores,upgradeV2.stores,'same-version reopen changed store layout');
  assert.deepEqual(await second.evalJS(snapshotExpression('window.__upgradeDb')),v2Snapshot,'same-version reopen changed stored records');
  console.log('PASS STEP2 VERSIONCHANGE: repeated open is idempotent');

  const aborted=await second.evalJS(`(async()=>{
    window.__upgradeDb.close();window.__upgradeDb=null;
    return await new Promise(resolve=>{
      const req=indexedDB.open(${JSON.stringify(DB_NAME)},3);
      req.onupgradeneeded=()=>{req.result.createObjectStore('failedProbe');req.transaction.abort();};
      req.onerror=()=>resolve({error:req.error?.name||'Unknown'});
      req.onsuccess=()=>{req.result.close();resolve({unexpectedSuccess:true});};
      setTimeout(()=>resolve({timeout:true}),8000);
    });
  })()`);
  assert.equal(aborted.error,'AbortError','the synthetic versionchange abort did not abort the schema transaction');
  const afterAbort=await second.evalJS(`(async()=>{
    const db=await new Promise((resolve,reject)=>{const req=indexedDB.open(${JSON.stringify(DB_NAME)});req.onerror=()=>reject(req.error);req.onsuccess=()=>resolve(req.result)});
    try{return{version:db.version,stores:Array.from(db.objectStoreNames).sort(),snapshot:await (${snapshotExpression('db')})};}
    finally{db.close();}
  })()`);
  assert.equal(afterAbort.version,2,'aborted schema upgrade advanced the database version');
  assert.equal(afterAbort.stores.includes('failedProbe'),false,'aborted schema upgrade left a partial object store');
  assert.deepEqual(afterAbort.snapshot.documents,seeded.documents,'aborted schema upgrade changed documents');
  assert.deepEqual(afterAbort.snapshot.images,seeded.images,'aborted schema upgrade changed the PNG');
  assert.equal(afterAbort.snapshot.activeDocumentId,seeded.activeDocumentId);
  console.log('PASS STEP2 VERSIONCHANGE: aborted schema upgrade rolls back version/store changes and preserves all data');

  await second.reload();
  await until(()=>second.evalJS("document.querySelector('.warning[role=alert]')?.textContent||''"),message=>message.includes('문서 저장소가 이 앱보다 높은 버전으로 업데이트되었습니다'));
  console.log('PASS STEP2 VERSIONCHANGE: restart after an aborted upgrade reports the newer schema and leaves data accessible');

  const retryV3=await second.evalJS(`(async()=>{
    let blocked=0;
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open(${JSON.stringify(DB_NAME)},3);
      const timer=setTimeout(()=>reject(Error('version 3 retry timed out')),8000);
      req.onblocked=()=>blocked++;
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('upgradeRetryProbe'))req.result.createObjectStore('upgradeRetryProbe');};
      req.onerror=()=>{clearTimeout(timer);reject(req.error)};
      req.onsuccess=()=>{clearTimeout(timer);resolve(req.result)};
    });
    window.__upgradeDb=db;
    return{version:db.version,blocked,stores:Array.from(db.objectStoreNames).sort()};
  })()`);
  assert.equal(retryV3.version,3,'retry after schema abort did not advance to v3');
  assert.equal(retryV3.blocked,0,'v3 retry remained blocked');
  const v3Snapshot=await second.evalJS(snapshotExpression('window.__upgradeDb'));
  assert.deepEqual(v3Snapshot.documents,seeded.documents);
  assert.deepEqual(v3Snapshot.images,seeded.images);
  assert.equal(v3Snapshot.activeDocumentId,seeded.activeDocumentId);
  console.log('PASS STEP2 VERSIONCHANGE: retry after aborted schema transaction succeeds with original document and PNG');

  const repeatV3=await second.evalJS(`(async()=>{
    window.__upgradeDb.close();
    let upgraded=false;
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open(${JSON.stringify(DB_NAME)},3);
      req.onupgradeneeded=()=>{upgraded=true;};
      req.onerror=()=>reject(req.error);req.onsuccess=()=>resolve(req.result);
    });
    window.__upgradeDb=db;
    return{version:db.version,upgraded,stores:Array.from(db.objectStoreNames).sort()};
  })()`);
  assert.equal(repeatV3.version,3);assert.equal(repeatV3.upgraded,false);
  assert.deepEqual(repeatV3.stores,retryV3.stores);
  assert.deepEqual(await second.evalJS(snapshotExpression('window.__upgradeDb')),v3Snapshot);
  console.log('PASS STEP2 VERSIONCHANGE: retried version remains idempotent on restart');

  const blockedOpen=await first.evalJS(`(async()=>{
    const storage=await import('/src/step2/idb.ts');
    const prototype=IDBFactory.prototype,original=prototype.open;
    window.__forcedUpgradeBlocked=false;window.__lateUpgradeConnection=null;
    prototype.open=function(name,version){
      if(name===storage.NAME){
        const req=original.call(this,name,4);
        req.addEventListener('blocked',()=>{window.__forcedUpgradeBlocked=true;});
        req.addEventListener('success',()=>{window.__lateUpgradeConnection=req.result;});
        return req;
      }
      return original.apply(this,arguments);
    };
    try{
      const outcome=await storage.openDatabase().then(db=>{db.close();return{status:'resolved'};},error=>({status:'rejected',message:error.message}));
      return{...outcome,blocked:window.__forcedUpgradeBlocked};
    }finally{prototype.open=original;}
  })()`);
  assert.equal(blockedOpen.status,'rejected','openDatabase should report a still-blocked upgrade');
  assert.equal(blockedOpen.blocked,true,'the blocked event did not reach openDatabase');
  assert.match(blockedOpen.message,/다른 탭을 닫아 주세요/);
  await second.evalJS("window.__upgradeDb.close();window.__upgradeDb=null");
  await until(()=>first.evalJS('Boolean(window.__lateUpgradeConnection)'),Boolean,8000);
  assert.equal(await first.evalJS(`(()=>{try{window.__lateUpgradeConnection.transaction('documents','readonly');return false}catch(error){return error.name==='InvalidStateError'}})()`),true,'late success left a database connection open after its promise was rejected');
  const v5=await second.evalJS(`(async()=>{
    let blocked=0;
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open(${JSON.stringify(DB_NAME)},5);
      const timer=setTimeout(()=>reject(Error('post-late-success v5 open timed out')),8000);
      req.onblocked=()=>blocked++;
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('version5Probe'))req.result.createObjectStore('version5Probe');};
      req.onerror=()=>{clearTimeout(timer);reject(req.error)};
      req.onsuccess=()=>{clearTimeout(timer);resolve(req.result)};
    });
    window.__upgradeDb=db;
    return{version:db.version,blocked,stores:Array.from(db.objectStoreNames).sort()};
  })()`);
  assert.equal(v5.version,5,'a leaked late-success connection blocked the next upgrade');
  assert.equal(v5.blocked,0,'the next upgrade emitted a blocked event after late success');
  const finalSnapshot=await second.evalJS(snapshotExpression('window.__upgradeDb'));
  assert.deepEqual(finalSnapshot.documents,seeded.documents,'repeated upgrades changed documents');
  assert.deepEqual(finalSnapshot.images,seeded.images,'repeated upgrades changed PNG bytes/metadata');
  assert.equal(finalSnapshot.activeDocumentId,seeded.activeDocumentId,'repeated upgrades changed the active document ID');
  assert.equal(finalSnapshot.stores.includes('failedProbe'),false,'aborted store leaked into the retried schema');
  assert.deepEqual(finalSnapshot.stores,['assets','documents','meta','upgradeRetryProbe','version5Probe','versionchangeProbe']);
  console.log('PASS STEP2 VERSIONCHANGE: blocked open rejects promptly; its late success closes; next upgrade completes');
  console.log('PASS STEP2 VERSIONCHANGE: final document, PNG bytes, metadata, and active ID survive abort/retry/repeated upgrades');
}catch(error){
  testError=error;
}finally{
  const cleanupErrors=[];
  if(ws){
    for(const targetId of targets){
      try{await rpc('Target.closeTarget',{targetId});}catch(error){cleanupErrors.push(error);}
    }
    try{ws.close();}catch(error){cleanupErrors.push(error);}
  }
  try{await browserSession.close();}catch(error){cleanupErrors.push(error);}
  for(let attempt=0;attempt<40&&existsSync(profile);attempt++){
    try{rmSync(profile,{recursive:true,force:true,maxRetries:4,retryDelay:100});}
    catch(error){
      if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code)){cleanupErrors.push(error);break;}
    }
    if(existsSync(profile))await delay(250);
  }
  if(existsSync(profile))cleanupErrors.push(Error('Disposable browser profile was not removed after browser exit'));
  if(cleanupErrors.length){
    const errors=testError?[testError,...cleanupErrors]:cleanupErrors;
    throw new AggregateError(errors,'STEP2 versionchange test or isolated-profile cleanup failed');
  }
}
if(testError)throw testError;
