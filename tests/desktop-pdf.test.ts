import test from 'node:test';
import assert from 'node:assert/strict';
import {hasDesktopPdfExport,savePdfFromEditor} from '../src/desktopPdf.ts';
const prior=Object.getOwnPropertyDescriptor(globalThis,'window');
function setFakeWindow(fake:unknown){
  Object.defineProperty(globalThis,'window',{value:fake,configurable:true,writable:true});
}
function restoreWindow(){
  if(prior)Object.defineProperty(globalThis,'window',prior);
  else Reflect.deleteProperty(globalThis,'window');
}
test('desktop PDF: ordinary web users keep browser print fallback',async()=>{
  let calls=0;setFakeWindow({print:()=>{calls++;}});
  try{
    assert.equal(hasDesktopPdfExport(),false);
    assert.equal(await savePdfFromEditor(),'browser');
    assert.equal(calls,1);
  }finally{restoreWindow();}
});
test('desktop PDF: successful save and user cancellation are not errors',async()=>{
  setFakeWindow({astraDesktop:{savePdf:async()=>({status:'saved'})}});
  try{
    assert.equal(hasDesktopPdfExport(),true);
    assert.equal(await savePdfFromEditor(),'saved');
    (globalThis.window as Window).astraDesktop={savePdf:async()=>({status:'cancelled'})};
    assert.equal(await savePdfFromEditor(),'cancelled');
  }finally{restoreWindow();}
});
test('desktop PDF: only known success states are accepted; failures are visible',async()=>{
  setFakeWindow({astraDesktop:{savePdf:async()=>({status:'error',message:'Disk full'})}});
  try{
    await assert.rejects(savePdfFromEditor(),/Disk full/);
    (globalThis.window as Window).astraDesktop={savePdf:async()=>({status:'untrusted'} as never)};
    await assert.rejects(savePdfFromEditor(),/응답을 확인/);
  }finally{restoreWindow();}
});
