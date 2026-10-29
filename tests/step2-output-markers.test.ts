import test from 'node:test';
import assert from 'node:assert/strict';
import {blankProject} from '../src/step2/model.ts';
import {pdfOutputHasImages,pdfOutputTextMarkers} from '../src/step2/outputMarkers.ts';

test('STEP4 PDF export markers cover visible document text and image captions without changing stored content',()=>{
  const doc=blankProject('2026-01-01T00:00:00.000Z');
  doc.content.title='Export Title 100%';
  doc.content.author='Writer 42';
  doc.content.sections=[
    {id:'s1',title:'Visible Section 7',blocks:[
      {id:'b1',kind:'paragraph',text:'First body marker 12345'},
      {id:'b2',kind:'heading',text:'Subheading marker 67890'},
      {id:'b3',kind:'image',assetId:'a1',caption:'Figure caption 24680',alignment:'center',size:'medium'},
      {id:'b4',kind:'caption',text:''},
    ]},
    {id:'s2',title:'Empty section ignored',blocks:[{id:'b5',kind:'paragraph',text:''}]},
  ];
  const before=structuredClone(doc),markers=pdfOutputTextMarkers(doc);
  assert.ok(markers.includes('ExportTitle100%'));
  assert.ok(markers.includes('VisibleSection7'));
  assert.ok(markers.includes('Firstbodymarker12345'));
  assert.ok(markers.includes('Subheadingmarker67890'));
  assert.ok(markers.includes('Figurecaption24680'));
  assert.ok(!markers.some(marker=>marker.includes('Emptysection')));
  assert.equal(pdfOutputHasImages(doc),true);
  assert.deepEqual(doc,before,'Creating transient output markers must not mutate project content');
});

test('STEP4 long output blocks are sampled at both ends within bounded marker size',()=>{
  const doc=blankProject('2026-01-01T00:00:00.000Z');
  const long='START_MARKER_1234567890'+('중간 내용 '.repeat(40))+'END_MARKER_9876543210';
  doc.content.sections[0].blocks[0].text=long;
  const markers=pdfOutputTextMarkers(doc);
  const compact=long.replace(/\s+/gu,'');
  assert.ok(markers.includes(compact.slice(0,48)));
  assert.ok(markers.some(marker=>marker.endsWith('END_MARKER_9876543210')));
  assert.ok(markers.every(marker=>marker.length<=96));
});

test('STEP4 image preflight only expects a raster when a visible image block exists',()=>{
  const doc=blankProject('2026-01-01T00:00:00.000Z');
  assert.equal(pdfOutputHasImages(doc),false);
  doc.content.sections[0].blocks=[{id:'img',kind:'image',assetId:'asset',caption:'',alignment:'center',size:'medium'}];
  assert.equal(pdfOutputHasImages(doc),true);
});
