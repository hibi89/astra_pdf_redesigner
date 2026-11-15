import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import LocalModelReview from '../../src/humanize/LocalModelReview.tsx';

const BRIDGE='http://127.0.0.1:4174';
async function request(path,body){
 const response=await fetch(BRIDGE+path,{method:body?'POST':'GET',
  headers:body?{'content-type':'application/json'}:undefined,
  body:body?JSON.stringify(body):undefined,cache:'no-store',credentials:'omit'});
 if(!response.ok)throw Error('local-test-bridge-unavailable');
 return response.json();
}
window.astraDesktop={
 localModelStatus:()=>request('/status'),
 localModelPropose:(text,explicitConsent)=>request('/propose',{text,explicitConsent,caseId:window.__astraCurrentCase||'unassigned'}),
 localModelCancel:()=>request('/cancel',{}),
};
window.__astraCurrentCase='unassigned';
async function seedSyntheticStorage(){
 localStorage.setItem('astra-p123-synthetic-v1-sentinel',JSON.stringify({kind:'synthetic-only',version:1}));
 await new Promise((resolve,reject)=>{
  const open=indexedDB.open('astra-p123-synthetic-v2-sentinel',1);
  open.onupgradeneeded=()=>{if(!open.result.objectStoreNames.contains('state'))open.result.createObjectStore('state');};
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction('state','readwrite');
   tx.objectStore('state').put({kind:'synthetic-only',version:2},'sentinel');
   tx.oncomplete=()=>{db.close();resolve();};
   tx.onerror=()=>reject(tx.error);
  };
 });
}
window.__astraStorageReady=seedSyntheticStorage();
window.__astraSnapshotStorage=async()=>{
 const local=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).sort()
  .map(key=>[key,localStorage.getItem(key)]);
 const value=await new Promise((resolve,reject)=>{
  const open=indexedDB.open('astra-p123-synthetic-v2-sentinel');
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction('state','readonly');
   const read=tx.objectStore('state').get('sentinel');
   read.onsuccess=()=>resolve(read.result||null);
   read.onerror=()=>reject(read.error);
   tx.oncomplete=()=>db.close();
  };
 });
 return JSON.stringify({local,indexeddb:value});
};
function Harness(){
 const [text,setText]=useState('이 문서는 내용을 정리하고 다시 확인하는 과정을 통해 작성되었습니다.');
 const [applyCount,setApplyCount]=useState(0);
 const apply=next=>{setText(next);setApplyCount(value=>value+1);};
 return React.createElement(React.Fragment,null,
  React.createElement('label',null,'Synthetic Korean source',
   React.createElement('textarea',{'data-model-source':true,value:text,
    onChange:event=>setText(event.target.value)})),
  React.createElement(LocalModelReview,{text,sourceScope:'synthetic-p123-document:block-1',disabled:false,onApply:apply}),
  React.createElement('output',{'data-model-value':true},text),
  React.createElement('output',{'data-model-apply-count':true},String(applyCount)),
 );
}
createRoot(document.getElementById('root')).render(React.createElement(Harness));
