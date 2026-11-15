// C009 hosted accessibility smoke: real Chromium AX tree and keyboard-only focus.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-c009-a11y-'));
const browser=launchBrowser(binary,profile,'C009 accessibility');
let ws,sequence=0;
const pending=new Map();
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=x=>Boolean(x),timeout=30000){
 const end=Date.now()+timeout;let last;
 while(Date.now()<end){last=await fn();if(predicate(last))return last;await pause(100);}
 throw Error('C009 accessibility startup timeout: '+JSON.stringify(last));
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
 await send('Page.enable');await send('Runtime.enable');await send('Accessibility.enable');
 const evaluate=async expression=>{
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
 };
 await eventually(()=>evaluate("Boolean(document.querySelector('.studio-layout .studio-steps button')&&document.querySelector('.studio-layout .print-button'))"));
 const nav=await evaluate("(()=>{const n=document.querySelector('.studio-layout .studio-steps');return {label:n?.getAttribute('aria-label'),stages:[...n.querySelectorAll('button')].map(b=>b.querySelector('span')?.textContent?.trim()),print:document.querySelector('.studio-layout .print-button')?.textContent?.trim()}})()");
 assert.equal(nav.label,'PDF 리디자인 작업 순서','stage navigation has a programmatic label');
 assert.deepEqual(nav.stages,['PDF 불러오기','원본 대조','디자인 선택','새 PDF 저장']);
 assert.ok(nav.print,'primary PDF action has visible text');
 const {nodes=[]}=await send('Accessibility.getFullAXTree');
 const exposed=nodes.filter(node=>!node.ignored);
 const roleName=node=>node.role?.value||'';
 const accessibleNames=exposed.filter(node=>roleName(node)==='button').map(node=>node.name?.value||'');
 const navAx=exposed.find(node=>roleName(node)==='navigation'&&node.name?.value==='PDF 리디자인 작업 순서');
 assert.ok(navAx,'screen-reader accessibility tree exposes named stage navigation');
 for(const label of nav.stages)assert.ok(accessibleNames.some(name=>name.includes(label)),
  'accessibility tree exposes stage button name: '+label);
 assert.ok(accessibleNames.some(name=>name.includes(nav.print)),
  'accessibility tree exposes primary PDF action name');
 await evaluate("(()=>{document.activeElement?.blur();window.focus();return true})()");
 const seenStages=new Set();let sawPrint=false,sawVisibleFocus=false;
 for(let index=0;index<100;index++){
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  const state=await evaluate("(()=>{const e=document.activeElement;return {stage:e?.closest?.('.studio-steps')?e.querySelector('span')?.textContent?.trim():null,print:e?.classList?.contains('print-button')||false,outline:getComputedStyle(e).outlineWidth,outlineStyle:getComputedStyle(e).outlineStyle}})()");
  if(state.stage){
   seenStages.add(state.stage);
   if(parseFloat(state.outline)>=2&&state.outlineStyle!=='none')sawVisibleFocus=true;
  }
  if(state.print)sawPrint=true;
  if(sawPrint&&seenStages.has('PDF 불러오기')&&seenStages.has('디자인 선택'))break;
 }
 assert.ok(sawPrint,'keyboard Tab reaches the primary PDF action');
 assert.ok(seenStages.has('PDF 불러오기'),'keyboard Tab reaches the first enabled stage control');
 assert.ok(seenStages.has('디자인 선택'),'keyboard Tab reaches the design stage control');
 assert.ok(sawVisibleFocus,'keyboard focus on stage navigation has a visible focus indicator');
 console.log('PASS C009 ACCESSIBILITY',JSON.stringify({browser:binary,axButtons:accessibleNames.length,
  namedStages:nav.stages.length,keyboardStages:[...seenStages],printReachable:sawPrint,visibleFocus:sawVisibleFocus}));
}finally{
 try{ws?.close();}catch{}
 try{await browser.close();}catch{}
 try{rmSync(profile,{recursive:true,force:true});}catch{}
}
