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
