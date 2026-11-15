// G002 CI-only controlled font matrix: print synthetic Latin/Korean/table
// pages in actual Chromium; compare PDF.js font modes against local Poppler.
// Never prints, uploads, or persists source content or output PDF bytes.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {compareSyntheticPdfCrossEngine} from '../tools/gpt-final-qa-pdf-cross-parser.mjs';
import {inspectSyntheticPdfNulAttribution,compareSyntheticNulModes}
  from '../tools/gpt-final-qa-pdfjs-nul-attribution.mjs';

const cases=Object.freeze([
  {id:'ASCII_MONOSPACE',font:'monospace',marker:'FONT_ASCII_8301',
    title:'ASCII numbers + punctuation',body:'A4 230,000 - 2026/11/15 12,345.67%'},
  {id:'KOREAN_SANS',font:'"Noto Sans CJK KR",sans-serif',marker:'FONT_KOREAN_8302',
    title:'한국어와 숫자 혼합',body:'금액 230,000원 · 승인 전 외부 전송 금지 · 날짜 2026-11-15'},
  {id:'KOREAN_SERIF_TABLE',font:'"Noto Serif CJK KR",serif',marker:'FONT_TABLE_8303',
    title:'2열 표와 강조',body:'행 1 금액 9,001원 · 행 2 금액 1,002원'},
]);
const html=record=>`<!doctype html><html lang="ko"><head><meta charset="UTF-8">
<style>@page{size:A4;margin:12mm}body{font-family:${record.font};font-size:15px}
main{max-width:170mm}table{border-collapse:collapse;width:100%}
td,th{border:1px solid #555;padding:6px}strong{font-weight:700}</style></head>
<body data-case="${record.id}"><main>
<h1>${record.marker}</h1><p>${record.title}</p><p><strong>${record.body}</strong></p>
<table><thead><tr><th>구분</th><th>합성 금액</th></tr></thead>
<tbody><tr><td>항목 1</td><td>12,345원</td></tr>
<tr><td>항목 2</td><td>230,000원</td></tr></tbody></table></main></body></html>`;
const profile=mkdtempSync(join(tmpdir(),'astra-g002-font-matrix-'));
const browser=launchBrowser(process.env.CHROME_PATH||'chromium',profile,'G002 controlled synthetic font matrix');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let ws,sequence=0;
const pending=new Map();
try{
  ws=await browser.connect();
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(!message.id||!pending.has(message.id))return;
    const item=pending.get(message.id);pending.delete(message.id);
    if(message.error)item.reject(Error(message.error.message));
    else item.resolve(message.result);
  });
  const request=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const id=++sequence;pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await request('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await request('Target.attachToTarget',{targetId,flatten:true});
  const send=(method,params={})=>request(method,params,sessionId);
  await send('Page.enable');
  await send('Runtime.enable');
  const evaluate=async expression=>{
    const reply=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(reply.exceptionDetails)throw Error('G002_SYNTHETIC_FONT_RENDER_FAILED');
    return reply.result.value;
  };
  for(const record of cases){
    await send('Page.navigate',{url:'data:text/html;charset=UTF-8,'+encodeURIComponent(html(record))});
    let ready=false;
    for(let attempt=0;attempt<100;attempt++){
      ready=await evaluate(`document.body?.dataset.case===${JSON.stringify(record.id)}`);
      if(ready)break;
      await sleep(100);
    }
    assert.equal(ready,true,'synthetic page failed to initialize');
    assert.equal(await evaluate('document.fonts.ready.then(()=>document.fonts.status)'),'loaded');
    const printed=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
    const pdf=Buffer.from(printed.data||'','base64');
    assert.ok(pdf.length>1000&&pdf.subarray(0,5).toString('ascii')==='%PDF-');
    const cross=await compareSyntheticPdfCrossEngine({
      sourcePdf:pdf,outputPdf:pdf,expectedMarkers:[record.marker],
    });
    assert.equal(cross.sourceMarkersPresentBoth,1);
    assert.equal(cross.outputMarkersPresentBoth,1);
    const yes=await inspectSyntheticPdfNulAttribution(pdf,{useSystemFonts:true});
    const no=await inspectSyntheticPdfNulAttribution(pdf,{useSystemFonts:false});
    const comparison=compareSyntheticNulModes(yes,no);
    assert.equal(cross.outputPdfjsNul,yes.nulGlyphs);
    assert.equal(comparison.release,'RELEASE HOLD');
    assert.equal(comparison.numericSemanticFidelity,'NOT_CERTIFIED');
    assert.equal(comparison.underlyingToUnicodeCause,'UNASSESSED');
    assert.equal(cross.actualVisualLoss,'UNASSESSED');
    assert.equal(cross.scoreDelta,0);
    console.log('PASS G002 CONTROLLED FONT CASE',JSON.stringify({
      case:record.id,bytes:pdf.length,pages:yes.pageCount,
      pdfjsNuls:yes.nulGlyphs,popplerNuls:cross.outputPopplerNul,
      noSystemFontsNuls:no.nulGlyphs,
      modeClassification:comparison.classification,
      fontCategories:[...new Set(yes.pages.flatMap(p=>p.fonts.map(f=>f.familyBucket)))].sort(),
      manualReviewRequired:comparison.manualReviewRequired,
    }));
  }
}finally{
  try{ws?.close();}catch{}
  try{await browser.close();}catch{}
  try{rmSync(profile,{recursive:true,force:true});}catch{}
}
