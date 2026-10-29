import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzePdfTypography,analyzeReferencePixels} from '../src/step5/referenceAnalysis.ts';

test('STEP5 local reference analysis measures whitespace, margins, density, and a supported palette color',()=>{
  const width=10,height=10,pixels=new Uint8ClampedArray(width*height*4);
  for(let i=0;i<width*height;i++)pixels.set([255,255,255,255],i*4);
  // A centered forest-green panel with white space around it.
  for(let y=2;y<8;y++)for(let x=2;x<8;x++)pixels.set([63,100,77,255],(y*width+x)*4);
  const result=analyzeReferencePixels(pixels,width,height);
  assert.equal(result.accent,'#3f644d');
  assert.equal(result.whiteSpace,.64);
  assert.equal(result.visualDensity,.36);
  assert.equal(result.margins.top,.2);assert.equal(result.margins.left,.2);
  assert.equal(result.suggestedTheme,'minimal');assert.equal(result.suggestedTextSize,'large');
});

test('STEP5 local reference analysis retains the current accent when the image has no salient color',()=>{
  const pixels=new Uint8ClampedArray(4*4*4);
  for(let i=0;i<16;i++)pixels.set([30,30,30,255],i*4);
  assert.equal(analyzeReferencePixels(pixels,4,4).accent,null);
});

test('STEP5 local reference analysis rejects malformed and oversized pixel arrays',()=>{
  assert.throws(()=>analyzeReferencePixels(new Uint8ClampedArray(4),2,2),/픽셀/i);
  assert.throws(()=>analyzeReferencePixels(new Uint8ClampedArray(0),5000,5000),/픽셀/i);
});

test('STEP5 embedded PDF text estimates relative type size and alignment without reading pixel text',()=>{
  const metrics=analyzePdfTypography([
    {str:'LARGE_TITLE',transform:[1,0,0,20,200,700],width:200},
    {str:'Body fragment A',transform:[1,0,0,10,40,500],width:120},
    {str:'Body fragment B',transform:[1,0,0,10,40,480],width:140},
    {str:'',transform:[1,0,0,99,0,0],width:100},
  ],600);
  assert.equal(metrics.selectableTextCount,3);
  assert.equal(metrics.medianFontSize,10);
  assert.equal(metrics.largestToMedianRatio,2);
  assert.equal(metrics.largestFragmentAlignment,'center');
});

test('STEP5 embedded PDF text reports when no selectable text is available',()=>{
  assert.deepEqual(analyzePdfTypography([{str:'',transform:[],width:0}],600),{
    selectableTextCount:0,medianFontSize:null,largestToMedianRatio:null,largestFragmentAlignment:'unavailable',
  });
});
