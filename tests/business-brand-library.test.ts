import test from 'node:test';
import assert from 'node:assert/strict';
import {PALETTE} from '../src/types.ts';
import {BUSINESS_LIBRARY_KEY,BUSINESS_LIBRARY_MAX,serializeBrandLibrary,parseBrandLibrary,readLocalBrandLibrary,writeLocalBrandLibrary} from '../src/step4/businessBrandLibrary.ts';
const entry={id:'aabbddee-1234-5678-9090-abcd12345678',label:'합성 회사',savedAt:1794657600000,kit:{name:'합성 회사',tagline:'검증',footer:'검증자만 볼 문구',accent:PALETTE[0].value}};
test('P98 local brand library roundtrip stores only bounded text, not project content or logo',()=>{
 const map=new Map<string,string>();
 const storage={getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>{map.set(key,value);}};
 assert.deepEqual(readLocalBrandLibrary(storage),[]);
 writeLocalBrandLibrary(storage,[entry]);
 assert.deepEqual(readLocalBrandLibrary(storage),[entry]);
 assert.deepEqual(parseBrandLibrary(serializeBrandLibrary([entry])),[entry]);
 assert.equal(map.size,1);assert.ok(map.has(BUSINESS_LIBRARY_KEY));
 assert.doesNotMatch(map.get(BUSINESS_LIBRARY_KEY)??'',/PDF-|assetId|base64|sourcePdf|sections/);
});
test('P98 corrupted, extra field, duplicate, long and unsupported color fail closed',()=>{
 assert.throws(()=>serializeBrandLibrary([entry,entry]));
 assert.throws(()=>serializeBrandLibrary([{...entry,kit:{...entry.kit,accent:'javascript:alert(1)'}}]));
 assert.throws(()=>parseBrandLibrary(JSON.stringify({...JSON.parse(serializeBrandLibrary([entry])),unsafe:true})));
 assert.throws(()=>parseBrandLibrary('{'));
 assert.throws(()=>serializeBrandLibrary(Array.from({length:BUSINESS_LIBRARY_MAX+1},(_,i)=>({...entry,id:'0000000'+i+'-1234-5678-9090-abcd12345678'}))));
});
