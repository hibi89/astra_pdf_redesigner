import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzePdfTypography,analyzeReferencePixels,suggestPdfBodyTextSize} from '../src/step5/referenceAnalysis.ts';

function pixels(width,height,paint){
  const data=new Uint8ClampedArray(width*height*4);
  for(let offset=0;offset<data.length;offset+=4){data[offset]=255;data[offset+1]=255;data[offset+2]=255;data[offset+3]=255;}
  paint?.((x,y,color)=>{const offset=(y*width+x)*4;data.set(color,offset);});
  return data;
}

test('P118 pixel analysis returns bounded whitespace, density, margins and palette accent',()=>{
  const data=pixels(4,4,paint=>{for(let y=1;y<3;y++)for(let x=1;x<3;x++)paint(x,y,[63,100,77,255]);});
  const metrics=analyzeReferencePixels(data,4,4);
  assert.equal(metrics.whiteSpace,.75);
  assert.equal(metrics.visualDensity,.25);
  assert.deepEqual(metrics.margins,{top:.25,right:.25,bottom:.25,left:.25});
  assert.equal(metrics.accent,'#3f644d');
  assert.equal(metrics.suggestedTheme,'minimal');
  assert.equal(metrics.suggestedTextSize,'large');
});

test('P118 transparent pixels are treated as white page area and do not create false density',()=>{
  const data=new Uint8ClampedArray(4*4*4);
  data.set([32,32,32,255],(1*4+1)*4);
  const metrics=analyzeReferencePixels(data,4,4);
  assert.equal(metrics.whiteSpace,15/16);
  assert.equal(metrics.visualDensity,1/16);
  assert.deepEqual(metrics.margins,{top:.25,right:.5,bottom:.5,left:.25});
  assert.equal(metrics.accent,null);
});

test('P118 rejects malformed dimensions and pixel buffers before computing metrics',()=>{
  assert.throws(()=>analyzeReferencePixels(new Uint8ClampedArray(3),1,1),/픽셀 데이터/);
  assert.throws(()=>analyzeReferencePixels(new Uint8ClampedArray(0),0,1),/픽셀 데이터/);
  assert.throws(()=>analyzeReferencePixels(new Uint8ClampedArray(0),5000,5000),/픽셀 데이터/);
});

test('P118 PDF typography uses the median valid text fragment and estimates alignment',()=>{
  const metrics=analyzePdfTypography([
    {str:'small',transform:[1,0,0,8,10,0],width:20},
    {str:'body',transform:[1,0,0,12,80,0],width:30},
    {str:'title',transform:[1,0,0,20,160,0],width:20},
    {str:'   ',transform:[1,0,0,30,10,0],width:20},
    {str:'invalid-size',transform:[1,0,0,0,10,0],width:20},
    {str:'invalid-width',transform:[1,0,0,12,10,0],width:Infinity},
  ],200);
  assert.equal(metrics.selectableTextCount,3);
  assert.equal(metrics.medianFontSize,12);
  assert.equal(metrics.largestToMedianRatio,20/12);
  assert.equal(metrics.largestFragmentAlignment,'right');
});

test('P118 text-size suggestions use normalized PDF size and safe fallbacks',()=>{
  const withSize=(count,medianFontSize)=>({
    selectableTextCount:count,medianFontSize,largestToMedianRatio:null,largestFragmentAlignment:'unavailable',
  });
  assert.equal(suggestPdfBodyTextSize(withSize(1,13.9),1000),'small');
  assert.equal(suggestPdfBodyTextSize(withSize(1,14),1000),'medium');
  assert.equal(suggestPdfBodyTextSize(withSize(1,22),1000),'medium');
  assert.equal(suggestPdfBodyTextSize(withSize(1,22.1),1000),'large');
  assert.equal(suggestPdfBodyTextSize(withSize(0,12),1000,'small'),'small');
  assert.equal(suggestPdfBodyTextSize(withSize(2,12),0,'large'),'large');
  assert.deepEqual(analyzePdfTypography([],0),{
    selectableTextCount:0,medianFontSize:null,largestToMedianRatio:null,largestFragmentAlignment:'unavailable',
  });
});
