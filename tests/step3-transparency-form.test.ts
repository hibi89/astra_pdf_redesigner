import test from 'node:test';
import assert from 'node:assert/strict';
import {makeTransparencyFormPdf} from './fixtures/step3-transparency-form-pdf.mjs';

test('STEP3 Form XObject and alpha: actual PDF.js operator traces are observable',async()=>{
  const {getDocument,OPS}=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const lookup=new Map(Object.entries(OPS).filter(([,value])=>Number.isInteger(value))
    .map(([key,value])=>[value,key]));
  for(const [label,option] of [
    ['transparent form',{alpha:0.4,group:true}],
    ['opaque form',{alpha:1,group:false}],
  ] as const){
    const task=getDocument({data:new Uint8Array(makeTransparencyFormPdf(option)),useSystemFonts:true});
    try{
      const pdf=await task.promise,page=await pdf.getPage(1);
      const textContent=await page.getTextContent();
      const texts=textContent.items.flatMap(item=>'str' in item?[item.str]:[]).join(' ');
      assert.ok(texts.includes('FORM_ALPHA_SOURCE_201')&&texts.includes('FORM_ALPHA_END_202'));
      const list=await page.getOperatorList();
      const relevant=list.fnArray.map((code,index)=>({name:lookup.get(code)??String(code),args:list.argsArray[index]}))
        .filter(item=>/form|group|gstate|transparent|image|path/i.test(item.name));
      assert.ok(relevant.length>0,label+' operator list did not include graphics: '+JSON.stringify(list.fnArray));
      const hasForm=relevant.some(item=>/form|group/i.test(item.name));
      const hasState=relevant.some(item=>/gstate|transparent/i.test(item.name));
      assert.equal(hasForm,true,label+' must expose Form XObject boundary: '+JSON.stringify(relevant).slice(0,4000));
      assert.equal(hasState,true,label+' must expose graphics state: '+JSON.stringify(relevant).slice(0,4000));
    }finally{await task.destroy();}
  }
});

test('STEP3 composition signals: actual transparent and opaque Form PDFs differ without content change',async()=>{
  const {getDocument,OPS}=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const {scanGraphicsComposition}=await import('../src/step3/graphicsRisk.ts');
  for(const scenario of [
    {label:'transparent grouped form',input:{alpha:0.4,group:true},transparent:true},
    {label:'opaque non-group form',input:{alpha:1,group:false},transparent:false},
  ]){
    const task=getDocument({data:new Uint8Array(makeTransparencyFormPdf(scenario.input)),useSystemFonts:true});
    try{
      const pdf=await task.promise,page=await pdf.getPage(1);
      const result=scanGraphicsComposition(await page.getOperatorList(),OPS);
      assert.ok(result.formScopes>0,scenario.label+' Form boundary must be reported');
      assert.equal(result.transparencySignals>0,scenario.transparent,
        scenario.label+' alpha/group classification mismatch: '+JSON.stringify(result));
      const original=(await page.getTextContent()).items.flatMap(item=>'str' in item?[item.str]:[]).join(' ');
      assert.ok(original.includes('FORM_ALPHA_SOURCE_201')&&original.includes('FORM_ALPHA_END_202'));
    }finally{await task.destroy();}
  }
});

test('STEP3 composition risk: alpha/soft mask/blend and Form warnings stay independent',async()=>{
  const {scanGraphicsComposition}=await import('../src/step3/graphicsRisk.ts');
  const ops={setGState:1,beginGroup:2,paintFormXObjectBegin:3};
  assert.deepEqual(scanGraphicsComposition({fnArray:[1,3,2],argsArray:[
    [[['ca',0.5],['CA',1],['BM','multiply'],['SMask',true]]],[],[],
  ]},ops),{transparencySignals:4,formScopes:1});
  assert.deepEqual(scanGraphicsComposition({fnArray:[1,3],argsArray:[
    [[['ca',1],['CA',1],['BM','Normal'],['SMask',false]]],[],
  ]},ops),{transparencySignals:0,formScopes:1});
  assert.deepEqual(scanGraphicsComposition({fnArray:[],argsArray:[]},ops),
    {transparencySignals:0,formScopes:0});
});
