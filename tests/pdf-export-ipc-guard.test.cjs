'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {APP_DOCUMENT,CUSTOMER_NATIVE_PDF_MODE,assertTrustedPdfSaveRequest}=
 require('../desktop/pdf-export-ipc-guard.cjs');
function fixture(){
 const mainFrame={url:APP_DOCUMENT};
 const contents={mainFrame,isDestroyed:()=>false,getURL:()=>APP_DOCUMENT};
 const win={webContents:contents,isDestroyed:()=>false};
 const event={sender:contents,senderFrame:mainFrame};
 return{win,event,contents,mainFrame};
}
test('P110 trusted main app frame retains existing unsigned preview PDF export',()=>{
 assert.equal(CUSTOMER_NATIVE_PDF_MODE,false);
 const {win,event}=fixture();
 assert.doesNotThrow(()=>assertTrustedPdfSaveRequest(event,win));
});
test('P110 cross-window, missing sender, destroyed window and destroyed webContents are rejected',()=>{
 const {win,event,contents}=fixture();
 for(const override of [{sender:{}},{sender:null},{sender:undefined}]){
  assert.throws(()=>assertTrustedPdfSaveRequest({...event,...override},win),/Blocked untrusted PDF/);
 }
 assert.throws(()=>assertTrustedPdfSaveRequest(null,win),/Blocked untrusted PDF/);
 assert.throws(()=>assertTrustedPdfSaveRequest(event,{...win,isDestroyed:()=>true}),/Blocked untrusted PDF/);
 assert.throws(()=>assertTrustedPdfSaveRequest(event,{...win,webContents:{...contents,isDestroyed:()=>true}}),/Blocked untrusted PDF/);
});
test('P110 same window from child frame cannot invoke native save PDF',()=>{
 const {win,event}=fixture();
 for(const url of [APP_DOCUMENT,'astra://app/other.html','https://app/index.html']){
  assert.throws(()=>assertTrustedPdfSaveRequest({...event,senderFrame:{url}},win),/Blocked untrusted PDF/);
 }
});
test('P110 exact app URL required: no path, origin, query, fragment or port substitutions',()=>{
 const urls=[
 'astra://app/','astra://app/other.html','astra://app/index.html?q=1',
 'astra://app/index.html#fragment','astra://app:443/index.html',
 'astra://not-app/index.html','https://app/index.html',
 'file:///index.html','astra://app/index.html/../index.html',
 ];
 for(const url of urls){
  const f=fixture();
  f.mainFrame.url=url;
  f.contents.getURL=()=>url;
  assert.throws(()=>assertTrustedPdfSaveRequest(f.event,f.win),/Blocked untrusted PDF/,url);
 }
});
test('P110 frame URL and webContents URL must match each other and canonical app document',()=>{
 const f=fixture();
 f.contents.getURL=()=> 'astra://app/other.html';
 assert.throws(()=>assertTrustedPdfSaveRequest(f.event,f.win),/Blocked untrusted PDF/);
});
test('P110 main PDF IPC enforces guard before native printToPDF, dialog and filesystem writes',()=>{
 const main=fs.readFileSync(path.resolve(__dirname,'../desktop/main.cjs'),'utf8');
 assert.ok(main.includes("require('./pdf-export-ipc-guard.cjs')"));
 const start=main.indexOf("ipcMain.handle('astra:save-pdf'");
 const end=main.indexOf('function registerLocalModel()',start);
 const handler=main.slice(start,end);
 const guard=handler.indexOf('assertTrustedPdfSaveRequest(event,mainWindow)');
 assert.ok(guard>=0);
 for(const anchor of ['validOutputMarkers(rawExpectedTextMarkers)','await renderLocalPdf()','await fs.writeFile(output,data)']){
  assert.ok(guard<handler.indexOf(anchor),anchor+' must happen after IPC guard');
 }
});
