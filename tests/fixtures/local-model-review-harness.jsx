import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import LocalModelReview from '../../src/humanize/LocalModelReview.tsx';

const model={
 calls:[],pending:[],cancelCalls:0,statusCalls:0,
 status:async()=>{model.statusCalls++;return{status:'available',modelId:'synthetic-test-only'};},
 propose:(text,consent)=>{
  model.calls.push({text,consent});
  return new Promise((resolve,reject)=>model.pending.push({resolve,reject}));
 },
 cancel:async()=>{model.cancelCalls++;return{status:'cancel-requested'};},
 resolve:(index,response)=>model.pending[index]?.resolve(response),
 reject:(index)=>model.pending[index]?.reject(Error('synthetic local inference failure')),
};
window.__astraModelMock=model;
window.astraDesktop={
 localModelStatus:model.status,
 localModelPropose:model.propose,
 localModelCancel:model.cancel,
};
function Harness(){
 const [text,setText]=useState('문서를 확인하였습니다.');
 const [scope,setScope]=useState('synthetic-doc-a:block-a');
 const [applyCount,setApplyCount]=useState(0);
 const apply=next=>{setText(next);setApplyCount(value=>value+1);};
 return React.createElement(React.Fragment,null,
  React.createElement('label',null,'Synthetic source',
   React.createElement('textarea',{ 'data-model-source':true,value:text,
    onChange:event=>setText(event.target.value)})),
  React.createElement('button',{'data-change-scope':true,onClick:()=>setScope(value=>value==='synthetic-doc-a:block-a'?'synthetic-doc-b:block-b':'synthetic-doc-a:block-a')},'Change synthetic document/block'),
  React.createElement(LocalModelReview,{text,sourceScope:scope,disabled:false,onApply:apply}),
  React.createElement('output',{'data-model-scope':true},scope),
  React.createElement('output',{'data-model-value':true},text),
  React.createElement('output',{'data-model-apply-count':true},String(applyCount)),
 );
}
createRoot(document.getElementById('root')).render(React.createElement(Harness));
