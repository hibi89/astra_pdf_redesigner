import test from 'node:test';
import assert from 'node:assert/strict';
import {STYLE_PRESET_FORMAT,STYLE_PRESET_VERSION,exportStylePreset,parseStylePreset,importStylePreset}
  from '../src/step4/stylePreset.ts';
import {defaultDesign} from '../src/types.ts';
const valid=defaultDesign();
test('STEP4 portable style preset roundtrips all four design controls only',()=>{
 const json=exportStylePreset('보고서 A',valid);
 const parsed=parseStylePreset(json);
 assert.equal(parsed.format,STYLE_PRESET_FORMAT);
 assert.equal(parsed.version,STYLE_PRESET_VERSION);
 assert.equal(parsed.name,'보고서 A');
 assert.deepEqual(parsed.design,valid);
 assert.deepEqual(Object.keys(parsed).sort(),['design','format','name','version']);
 assert.doesNotMatch(json,/sourcePdf|content|sections|password|PRIVATE_CUSTOMER/);
});
test('STEP4 import never inherits arbitrary unknown or executable untrusted fields',()=>{
 const baseline=JSON.parse(exportStylePreset('정상',valid));
 for(const hostile of [
  {...baseline,document:{title:'PRIVATE_CUSTOMER'}},
  {...baseline,design:{...valid,__proto_pollute:'value'}},
  {...baseline,version:2},{...baseline,format:'unexpected'},
  {...baseline,name:'\u200b비밀'},{...baseline,name:'<img>'},
  {...baseline,name:'x'.repeat(61)},
  {...baseline,design:{...valid,theme:'unknown'}},
  {...baseline,design:{...valid,accent:'#ff00ff'}},
  {...baseline,design:{...valid,textSize:'xlarge'}},
  {...baseline,design:{...valid,font:'untrusted'}},
 ]){
  assert.throws(()=>parseStylePreset(JSON.stringify(hostile)),/프리셋|손상/);
 }
});
test('STEP4 malformed oversized JSON and empty preset name fail closed',()=>{
 for(const s of ['','{', '[]','null',JSON.stringify({format:STYLE_PRESET_FORMAT,version:1,name:'',design:valid}),
   ' '.repeat(8193), '🤔'.repeat(3000)])assert.throws(()=>parseStylePreset(s));
});
test('STEP4 bad design and malformed names rejected on export',()=>{
 assert.throws(()=>exportStylePreset('깨짐',{...valid,theme:'broken'} as any));
 assert.throws(()=>exportStylePreset('with\nnewline',valid));
});
test('STEP4 File import reads a user-selected bounded JSON only',async()=>{
 const json=exportStylePreset('월간',valid);
 const uploaded=new File([json],'my-astra-preset.json',{type:'application/json'});
 assert.deepEqual((await importStylePreset(uploaded)).design,valid);
 await assert.rejects(importStylePreset(new File([json],'document.pdf')));
 await assert.rejects(importStylePreset(new File([' ' .repeat(8193)],'huge.json')));
});
test('STEP4 serialized and parsed presets do not mutate caller settings',()=>{
 const before=structuredClone(valid);
 const decoded=parseStylePreset(exportStylePreset('정상',valid));
 decoded.design.theme='folio';
 assert.deepEqual(valid,before);
});
