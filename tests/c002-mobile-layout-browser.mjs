// C002 mobile viewport acceptance for the existing 3-SKU studio and A4 preview.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-c002-mobile-'));
const browser=launchBrowser(binary,profile,'C002 mobile layout');
let ws,sequence=0;
const pending=new Map();
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=x=>Boolean(x),timeout=30000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(predicate(last))return last;await pause(100);}
 throw Error('C002 mobile viewport timed out: '+JSON.stringify(last));
}
try{
 ws=await browser.connect();
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.id&&pending.has(message.id)){
   const item=pending.get(message.id);pending.delete(message.id);
   if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
  }
 });
 const request=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const id=++sequence;pending.set(id,{resolve,reject});
  ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
 const {targetId}=await request('Target.createTarget',{url});
 const {sessionId}=await request('Target.attachToTarget',{targetId,flatten:true});
 const send=(method,params={})=>request(method,params,sessionId);
 await send('Page.enable');await send('Runtime.enable');
 const evaluate=async expression=>{
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
 };
 await eventually(()=>evaluate("Boolean(document.querySelector('.studio-layout .editor-column')&&document.querySelector('.studio-layout .preview-column .project-paper'))"));
 for(const width of [390,360,320]){
  await send('Emulation.setDeviceMetricsOverride',{
   width,height:844,deviceScaleFactor:1,mobile:true,
  });
  await evaluate("new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))");
  const metrics=await evaluate(`(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height}};
   const main=document.querySelector('.studio-layout');
   const editor=document.querySelector('.studio-layout .editor-column');
   const preview=document.querySelector('.studio-layout .preview-column');
   const paper=document.querySelector('.studio-layout .project-paper');
   const style=document.querySelector('.studio-style-column');
   const steps=[...document.querySelectorAll('.studio-layout .studio-steps button')].map(rect);
   const print=document.querySelector('.app-header .print-button');
   return {
    viewport:innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth,
    mainDisplay:getComputedStyle(main).display,mainDirection:getComputedStyle(main).flexDirection,
    editor:rect(editor),preview:rect(preview),paper:rect(paper),style:rect(style),
    steps,print:print?rect(print):null,
   };
  })()`);
  assert.equal(metrics.viewport,width,'mobile viewport meta must honor device width');
  assert.ok(metrics.root<=width+1,'document root must not have horizontal overflow: '+JSON.stringify(metrics));
  assert.ok(metrics.body<=width+1,'body must not have horizontal overflow: '+JSON.stringify(metrics));
  assert.equal(metrics.mainDisplay,'flex','studio switches to a single-column mobile layout');
  assert.equal(metrics.mainDirection,'column','editor, preview and style panels stack vertically');
  for(const [name,box] of [['editor',metrics.editor],['preview',metrics.preview],['A4 preview',metrics.paper],['style',metrics.style]]){
   assert.ok(box.width>0&&box.left>=-1&&box.right<=width+1,
    name+' stays inside mobile viewport: '+JSON.stringify({width,box,metrics}));
  }
  assert.equal(metrics.steps.length,4,'all four stage controls remain present');
  for(const box of metrics.steps)assert.ok(box.left>=-1&&box.right<=width+1&&box.height>0,
   'stage control remains on-screen: '+JSON.stringify({width,box}));
  assert.ok(metrics.print&&metrics.print.width>0&&metrics.print.height>0,
   'primary PDF action remains visible in the responsive header');
  console.log('PASS C002 MOBILE VIEWPORT',JSON.stringify({width,root:metrics.root,body:metrics.body,
   paperWidth:Math.round(metrics.paper.width),stageButtons:metrics.steps.length,
   printButton:metrics.print.width+'x'+metrics.print.height}));
 }
 console.log('PASS C002 responsive 3-SKU studio: 390/360/320 CSS-pixel viewports, no horizontal overflow, visible stage navigation and A4 preview');
}finally{
 try{ws?.close();}catch{}
 try{await browser.kill();}catch{}
 try{rmSync(profile,{recursive:true,force:true});}catch{}
}
