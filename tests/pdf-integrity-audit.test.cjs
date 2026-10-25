'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const load=()=>import('./pdf-integrity-audit.mjs');

test('M04 marker parity catches omission, duplicate and out-of-order positions',async()=>{
  const {checkMarkerSequence}=await load();
  assert.equal(checkMarkerSequence(['M04_START_X1 M04_MIDDLE_Y2','M04_LAST_Z3'],[
    'M04_START_X1','M04_MIDDLE_Y2','M04_LAST_Z3']).markersChecked,3);
  assert.throws(()=>checkMarkerSequence(['M04_START_X1 M04_LAST_Z3'],[
    'M04_START_X1','M04_MISSING_Q9','M04_LAST_Z3']),/missing or duplicated/);
  assert.throws(()=>checkMarkerSequence(['M04_START_X1 M04_START_X1 M04_LAST_Z3'],[
    'M04_START_X1','M04_LAST_Z3']),/missing or duplicated/);
  assert.throws(()=>checkMarkerSequence(['M04_LAST_Z3 M04_START_X1'],[
    'M04_START_X1','M04_LAST_Z3']),/inverted/);
});
test('M04 text A4 bounds checks overflows and discloses skipped rotations',async()=>{
  const {checkTextGeometry}=await load();
  const item=(x,y,width=50,rotated=false)=>({str:'TOKEN',width,height:12,transform:[1,rotated?1:0,0,1,x,y]});
  assert.equal(checkTextGeometry([item(20,800),item(30,700)],595,842).checked,2);
  assert.throws(()=>checkTextGeometry([item(580,800)],595,842),/extent/);
  assert.throws(()=>checkTextGeometry([item(15,-12)],595,842),/extent/);
  assert.equal(checkTextGeometry([item(20,800,50,true)],595,842).skippedRotation,1);
});
test('M04 independent PDF.js structural audit checks actual two-page mixed fixture',async()=>{
  const {auditPdfBytes}=await load();
  const {makeMixedLayoutPdf,MIXED_LAYOUT_MARKERS}=await import('./fixtures/step3-mixed-layout-pdf.mjs');
  const result=await auditPdfBytes(makeMixedLayoutPdf(),{markers:MIXED_LAYOUT_MARKERS,requireRaster:true,label:'M04 mixed source'});
  assert.equal(result.pages,2);
  assert.equal(result.markers,13);
  assert.ok(result.textItemsChecked>=13);
  assert.ok(result.rasterDraws>=1);
});
