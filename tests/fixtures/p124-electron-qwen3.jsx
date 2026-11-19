import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from '../../src/Root.tsx';
import '../../src/styles.css';

const sentinelKey = 'astra-p124-synthetic-v1-sentinel';
const databaseName = 'astra-p124-synthetic-v2-sentinel';
const productV1Key = 'astra-pdf-redesigner:current:v1';
const baseline = 'ASTRA_P124_PDF_SOURCE_7401 · 최종 결제 금액은 230,000원이며, 승인 전에는 외부에 전달하지 않습니다.';

async function seedSyntheticV1V2() {
  const v1 = {schemaVersion:1,document:{title:'P124 합성 문서',author:'P124 합성 사용자',
    date:'2026-11-15',learned:baseline,difficult:'',solved:'',reflection:''},
    design:{theme:'report',accent:'#285a73',textSize:'medium',font:'sans'}};
  localStorage.setItem(productV1Key,JSON.stringify(v1));
  localStorage.setItem(sentinelKey,JSON.stringify({kind:'synthetic-only',version:1,value:'unchanged'}));
  await new Promise((resolve, reject) => {
    const open = indexedDB.open(databaseName, 1);
    open.onupgradeneeded = () => open.result.createObjectStore('state');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction('state', 'readwrite');
      transaction.objectStore('state').put({ kind: 'synthetic-only', version: 2, value: 'unchanged' }, 'sentinel');
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  });
}

window.__p124StorageReady = seedSyntheticV1V2();
async function stableValue(value) {
  if (value instanceof Date) return { type: 'Date', value: value.toISOString() };
  const bytesToBase64 = bytes => {
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  };
  if (value instanceof Blob) return { type: 'Blob', mimeType: value.type, bytes: bytesToBase64(new Uint8Array(await value.arrayBuffer())) };
  if (value instanceof ArrayBuffer) return { type: 'ArrayBuffer', bytes: bytesToBase64(new Uint8Array(value)) };
  if (ArrayBuffer.isView(value)) return { type: value.constructor.name,
    bytes: bytesToBase64(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)) };
  if (Array.isArray(value)) return Promise.all(value.map(stableValue));
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.keys(value).sort().map(async key => [key, await stableValue(value[key])]));
    return Object.fromEntries(entries);
  }
  return value;
}
function openProductDatabase(){
  return new Promise((resolve,reject)=>{
    const open=indexedDB.open('astra-pdf-redesigner:v2');
    open.onerror=()=>reject(open.error);
    open.onsuccess=()=>resolve(open.result);
  });
}
async function readStore(db,name){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(name,'readonly'),store=tx.objectStore(name);
    const keys=store.getAllKeys(),records=store.getAll();
    tx.oncomplete=()=>resolve({keys:keys.result,records:records.result});
    tx.onerror=()=>reject(tx.error);
  });
}
window.__p124SnapshotStorage = async () => {
  const local = localStorage.getItem(sentinelKey);
  const value = await new Promise((resolve, reject) => {
    const open = indexedDB.open(databaseName);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result,tx = db.transaction('state','readonly');
      const read = tx.objectStore('state').get('sentinel');
      read.onsuccess = () => resolve(read.result || null);
      read.onerror = () => reject(read.error);
      tx.oncomplete = () => db.close();
    };
  });
  return JSON.stringify({ local, indexeddb: value });
};
window.__p124SnapshotProductStorage = async () => {
  const local = Array.from({length:localStorage.length},(_,index)=>localStorage.key(index)).sort()
    .map(key=>[key,localStorage.getItem(key)]);
  const db=await openProductDatabase(),names=Array.from(db.objectStoreNames).sort();
  const stores=[];
  for(const name of names){
    const raw=await readStore(db,name);
    const records=name==='documents'?raw.records.map(record=>{
      const copy={...record};delete copy.updatedAt;return copy;
    }):raw.records;
    stores.push([name,{keys:await stableValue(raw.keys),records:await stableValue(records)}]);
  }
  const version=db.version;db.close();
  return JSON.stringify({local,version,stores});
};
window.__p124ReadPersistedSource = async () => {
  const db=await openProductDatabase();
  const [docs,meta]=await Promise.all([readStore(db,'documents'),readStore(db,'meta')]);
  db.close();
  const active=meta.records[meta.keys.indexOf('activeDocumentId')];
  const doc=docs.records.find(item=>item.id===active);
  const block=doc?.content?.sections?.flatMap(section=>section.blocks)
    .find(item=>item.kind==='paragraph');
  return block?.text??null;
};
window.__p124ReadProductTimestamps = async () => {
  const db=await openProductDatabase(),docs=await readStore(db,'documents');
  db.close();
  return JSON.stringify(docs.records.map(record=>[record.id,record.updatedAt]).sort((a,b)=>a[0].localeCompare(b[0])));
};
window.__p124P124TestMode = true;
window.__p124StorageReady.then(()=>createRoot(document.getElementById('root')).render(<Root />));
