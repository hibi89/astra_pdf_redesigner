// C009: render and print all eight base themes and 22 PRO/BUSINESS layouts
// through the real React Workspace and the browser's A4 PDF print pipeline.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdirSync,mkdtempSync,rmSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {isAbsolute,join,relative,resolve} from 'node:path';
import {launchBrowser} from './browser-process.mjs';

const binary=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const profile=mkdtempSync(join(tmpdir(),'astra-c009-layout-'));
const runnerTemp=process.env.RUNNER_TEMP?resolve(process.env.RUNNER_TEMP):null;
const outputRoot=process.env.C009_OUTPUT_DIR?resolve(process.env.C009_OUTPUT_DIR):join(profile,'outputs');
if(process.env.GITHUB_ACTIONS==='true'){
 if(!runnerTemp||!process.env.C009_OUTPUT_DIR)throw Error('C009 evidence output must be under GitHub RUNNER_TEMP.');
 const rel=relative(runnerTemp,outputRoot);
 if(rel==='..'||rel.startsWith('..')||isAbsolute(rel))
  throw Error('C009 output path escaped GitHub RUNNER_TEMP.');
}
mkdirSync(outputRoot,{recursive:true});
const browser=launchBrowser(binary,profile,'C009 30-layout print matrix');
const pause=ms=>new Promise(resolvePause=>setTimeout(resolvePause,ms));
const titleMarker='C009_LAYOUT_MATRIX_TITLE_6041';
const bodyMarker='C009_LAYOUT_MATRIX_BODY_6042';
const syntheticBody=[
 bodyMarker+' · 합성 레이아웃 회귀 검수용 본문입니다.',
 '금액 230,000원과 날짜 2026-11-15를 그대로 출력해야 합니다.',
 '승인 전에는 외부에 전달하지 않습니다.',
 '표·숫자·부정 표현과 한국어 문장이 모든 디자인에서 유지되어야 합니다.',
 'C009_LAYOUT_MATRIX_END_6043 · 이 문서에는 실제 고객 자료가 없습니다.'
].join('\n\n');
let ws,sequence=0;
const pending=new Map();

function request(method,params={},sessionId){
 return new Promise((resolveRequest,rejectRequest)=>{
  const id=++sequence;
  const timeout=setTimeout(()=>{
   pending.delete(id);
   rejectRequest(Error('C009 CDP request timed out: '+method));
  },60000);
  pending.set(id,{
   resolve(value){clearTimeout(timeout);resolveRequest(value);},
   reject(error){clearTimeout(timeout);rejectRequest(error);},
  });
  ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
 });
}
async function eventually(fn,predicate=x=>Boolean(x),label='state',timeoutMs=45000){
 const end=Date.now()+timeoutMs;let last;
 while(Date.now()<end){
  last=await fn();
  if(predicate(last))return last;
  await pause(100);
 }
 throw Error('C009 '+label+' timed out: '+JSON.stringify(last));
}
async function main(){
 ws=await browser.connect();
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.id&&pending.has(message.id)){
   const item=pending.get(message.id);pending.delete(message.id);
   if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
  }
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
 const setValue=async(selectorExpression,value)=>{
  const expression='(()=>{const e='+selectorExpression+';if(!e)throw Error("Missing synthetic editor field");'+
   'const p=e instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;'+
   'Object.getOwnPropertyDescriptor(p,"value").set.call(e,'+JSON.stringify(value)+');'+
   'e.dispatchEvent(new Event("input",{bubbles:true}));return true})()';
  return evaluate(expression);
 };
 await eventually(()=>evaluate('Boolean(document.querySelector(".studio-layout .project-paper")&&document.querySelector("[data-style-compare-toggle]")&&document.querySelector(".section-editor textarea"))'),
  Boolean,'Workspace and synthetic document');
 const originalTheme=await evaluate('(()=>{const e=document.querySelector("input[name=v2theme]:checked");return e?.closest("label")?.querySelector("strong")?.textContent?.trim()||""})()');
 assert.ok(originalTheme,'The persisted design selection must be visible before preview-only testing.');
 await setValue('[...document.querySelectorAll(".editor-column label.field")].find(e=>e.textContent.includes("출력 제목"))?.querySelector("input")',titleMarker);
 await setValue('document.querySelector(".editor-column .section-editor textarea")',syntheticBody);
 await eventually(()=>evaluate('(()=>{const e=document.querySelector(".paper-surface .project-paper");return e?.innerText||""})()'),
  text=>text.includes(titleMarker)&&text.includes(bodyMarker),'synthetic text rendered by React Workspace');
 await evaluate('document.fonts?document.fonts.ready.then(()=>true):Promise.resolve(true)');
 await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');

 const output=[];
 const reportPath=join(outputRoot,'report.json');
 const writeReport=status=>writeFileSync(reportPath,JSON.stringify({
  schema:'astra-c009-layout-print-matrix-v1',
  status,
  browser:binary,
  theme_count:output.filter(item=>item.kind==='theme').length,
  advanced_layout_count:output.filter(item=>item.kind==='advanced').length,
  unique_first_page_rasters:new Set(output.map(item=>item.first_page_png_sha256)).size,
  cases:output,
 },null,2),'utf8');

 const capture=async(id,kind,expectedClass)=>{
  const view=await evaluate('(()=>{const e=document.querySelector(".paper-surface .project-paper");return e?{classes:[...e.classList],advanced:e.getAttribute("data-advanced-layout"),text:e.innerText}:null})()');
  assert.ok(view,'The actual React ProjectPreview must remain mounted.');
  assert.ok(view.text.includes(titleMarker)&&view.text.includes(bodyMarker),'The source text must stay visible in each layout.');
  assert.ok(view.classes.includes(expectedClass),'Expected layout class is missing for '+id+': '+JSON.stringify(view.classes));
  if(kind==='theme')assert.equal(view.advanced,null,'Base theme comparison must not select an advanced layout.');
  else assert.equal(view.advanced,id,'Advanced preview must show its selected layout ID.');

  await evaluate('document.fonts?document.fonts.ready.then(()=>true):Promise.resolve(true)');
  await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const printed=await send('Page.printToPDF',{preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
  const pdfBytes=Buffer.from(printed.data,'base64');
  assert.ok(pdfBytes.length>1000,'Printed PDF is unexpectedly small: '+id);
  const stem=(kind==='theme'?'theme-':'layout-')+id;
  const pdfPath=join(outputRoot,stem+'.pdf');
  writeFileSync(pdfPath,pdfBytes,{flag:'wx'});

  const info=execFileSync('pdfinfo',[pdfPath],{encoding:'utf8'});
  const pageCount=Number(info.match(/Pages:\s+(\d+)/)?.[1]||0);
  const size=info.match(/Page size:\s+([\d.]+)\s+x\s+([\d.]+)\s+pts/);
  assert.ok(pageCount>=1&&pageCount<=5,'Unexpected A4 page count for '+id+': '+pageCount);
  assert.ok(size,'PDF page size is missing for '+id+': '+info);
  assert.ok(Math.abs(Number(size[1])-595.276)<3&&Math.abs(Number(size[2])-841.89)<3,
   'Printed layout is not A4 for '+id+': '+size[0]);

  const extracted=execFileSync('pdftotext',[pdfPath,'-'],{encoding:'utf8'}).normalize('NFC').replace(/\s+/g,' ').trim();
  const compactText=extracted.replace(/[^A-Za-z0-9가-힣]/g,'');
  const titleToken=titleMarker.replace(/[^A-Za-z0-9]/g,'');
  const bodyToken=bodyMarker.replace(/[^A-Za-z0-9]/g,'');
  assert.ok(compactText.includes(titleToken),'Printed PDF lost its title marker: '+id+'; extracted excerpt='+extracted.slice(0,700));
  assert.ok(compactText.includes(bodyToken),'Printed PDF lost its body marker: '+id);
  assert.ok(compactText.includes('230000원'),'Printed PDF changed its amount: '+id);
  assert.ok(compactText.includes('승인전에는외부에전달하지않습니다'),'Printed PDF changed its negation: '+id);
  assert.ok(!extracted.includes('DESIGN STUDIO'),'Non-print studio UI leaked into the PDF: '+id);

  const pngPrefix=join(outputRoot,stem+'-first-page');
  execFileSync('pdftoppm',['-f','1','-l','1','-r','72','-singlefile','-png',pdfPath,pngPrefix],{stdio:'ignore'});
  const pngPath=pngPrefix+'.png';
  const rasterHash=createHash('sha256').update(readFileSync(pngPath)).digest('hex');
  const entry={
   id,kind,classes:view.classes,
   pdf_pages:pageCount,
   page_width_pt:Number(size[1]),page_height_pt:Number(size[2]),
   pdf_bytes:pdfBytes.length,
   pdf_sha256:createHash('sha256').update(pdfBytes).digest('hex'),
   first_page_png_sha256:rasterHash,
   text_markers_preserved:true,
  };
  output.push(entry);
  writeReport('RUNNING');
  console.log('PASS C009 layout print',JSON.stringify({id,kind,pages:pageCount,png_sha256:rasterHash}));
  return entry;
 };

 const openCompare=await evaluate('(()=>{const e=document.querySelector("[data-style-compare-toggle]");if(!e)throw Error("Missing actual style comparison control");e.click();return true})()');
 assert.equal(openCompare,true);
 const themes=await eventually(()=>evaluate('[...document.querySelectorAll("[data-style-compare-theme]")].map(e=>e.getAttribute("data-style-compare-theme"))'),
  items=>Array.isArray(items)&&items.length===8,'all eight base theme controls');
 assert.equal(new Set(themes).size,8,'Base theme IDs must be unique.');
 for(const theme of themes){
  await evaluate('(()=>{const e=[...document.querySelectorAll("[data-style-compare-theme]")].find(x=>x.getAttribute("data-style-compare-theme")==='+JSON.stringify(theme)+');if(!e)throw Error("Missing base theme "+'+JSON.stringify(theme)+');e.click();return true})()');
  await eventually(()=>evaluate('(()=>{const e=document.querySelector(".paper-surface .project-paper");return e?.classList.contains('+JSON.stringify('paper-theme-'+theme)+')||false})()'),
   Boolean,'base theme preview '+theme);
  await capture(theme,'theme','paper-theme-'+theme);
 }
 const layouts=await evaluate('[...document.querySelectorAll("[data-extended-layout-id]")].map(e=>e.getAttribute("data-extended-layout-id"))');
 assert.equal(layouts.length,22,'Expected the twelve PRO and ten BUSINESS print candidates.');
 assert.equal(new Set(layouts).size,22,'Advanced layout IDs must be unique.');
 for(const layout of layouts){
  await evaluate('(()=>{const e=[...document.querySelectorAll("[data-extended-layout-id]")].find(x=>x.getAttribute("data-extended-layout-id")==='+JSON.stringify(layout)+');if(!e)throw Error("Missing advanced layout "+'+JSON.stringify(layout)+');if(e.disabled)throw Error("Internal hosted preview unexpectedly disabled "+'+JSON.stringify(layout)+');e.click();return true})()');
  await eventually(()=>evaluate('document.querySelector(".paper-surface .project-paper")?.getAttribute("data-advanced-layout")||""'),
   value=>value===layout,'advanced layout preview '+layout);
  const view=await evaluate('(()=>{const e=document.querySelector(".paper-surface .project-paper");return e?[...e.classList]:[]})()');
  const advancedClass='paper-advanced-'+layout;
  assert.ok(view.includes(advancedClass),'Advanced layout class missing: '+layout);
  const themeClass=view.find(value=>value.startsWith('paper-theme-'));
  assert.ok(themeClass,'Advanced layout base theme class missing: '+layout);
  await capture(layout,'advanced',advancedClass);
 }
 assert.equal(output.length,30,'All eight base themes plus 22 advanced compositions must print.');
 assert.equal(new Set(output.map(item=>item.first_page_png_sha256)).size,30,
  'All 30 actual first-page renders must remain visually distinct, not palette-only duplicates.');
 const finalTheme=await evaluate('(()=>{const e=document.querySelector("input[name=v2theme]:checked");return e?.closest("label")?.querySelector("strong")?.textContent?.trim()||""})()');
 assert.equal(finalTheme,originalTheme,'Previewing the 30 layouts must not change the saved document theme.');
 writeReport('PASS');
 console.log('PASS C009 30-layout React/Chrome PDF matrix',JSON.stringify({
  browser:binary,base_themes:themes.length,advanced_layouts:layouts.length,
  unique_first_page_rasters:new Set(output.map(item=>item.first_page_png_sha256)).size,
  output_root:outputRoot,
 }));
}

try{
 await main();
}finally{
 try{ws?.close();}catch{}
 try{await browser.close();}catch{}
 try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}catch{}
}
