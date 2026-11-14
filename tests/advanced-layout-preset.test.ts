import test from 'node:test';
import assert from 'node:assert/strict';
import {exportAdvancedLayoutPreset,parseAdvancedLayoutPreset} from '../src/step4/advancedLayoutPreset.ts';
test('STEP4 all advanced layouts can roundtrip in a content-free portable JSON',()=>{
 for(const tier of ['pro','business'])for(let n=1;n<=(tier==='pro'?12:10);n++){
   const id=`${tier}-${String(n).padStart(2,'0')}`;
   const json=exportAdvancedLayoutPreset(id);
   const receipt=parseAdvancedLayoutPreset(json);
   assert.equal(receipt.layoutId,id);
   assert.deepEqual(Object.keys(receipt).sort(),['format','layoutId','version']);
   assert.doesNotMatch(json,/sourcePdf|content|asset|document/);
 }
});
test('STEP4 imported presets fail closed on unknown design, extra fields, oversized payload and invalid JSON',()=>{
 for(const invalid of ['','{}','{"format":"astra-advanced-layout","version":1,"layoutId":"pro-13"}','{bad}',JSON.stringify({format:'astra-advanced-layout',version:1,layoutId:'pro-01',pdfContents:'secret'}),'x'.repeat(1025)]){
   assert.throws(()=>parseAdvancedLayoutPreset(invalid));
 }
 assert.throws(()=>exportAdvancedLayoutPreset('../private'));
});
