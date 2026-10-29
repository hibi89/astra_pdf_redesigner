import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeReferencePixels} from '../src/step5/referenceAnalysis.ts';

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
