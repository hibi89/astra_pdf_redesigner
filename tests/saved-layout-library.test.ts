import test from 'node:test';
import assert from 'node:assert/strict';
import {PRO_LIBRARY_MAX,PRO_LIBRARY_KEY,readLocalLayoutLibrary,writeLocalLayoutLibrary,parseSavedLayoutLibrary,serializeSavedLayoutLibrary} from '../src/step4/savedLayoutLibrary.ts';
const item={id:'synthetic-1234',name:'개인 보관용',layoutId:'pro-01',savedAt:1794657600000};
test('P97 independent layout store persists without changing project V2 or PDF data',()=>{
 const map=new Map<string,string>();
 const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};
 assert.deepEqual(readLocalLayoutLibrary(storage),[]);
 writeLocalLayoutLibrary(storage,[item]);
 assert.deepEqual(readLocalLayoutLibrary(storage),[item]);
 assert.ok(map.has(PRO_LIBRARY_KEY));
 assert.equal(map.size,1);
 assert.doesNotMatch(map.get(PRO_LIBRARY_KEY)??'',/PDF-|assetId|sections|sourcePdf|base64/);
});
test('P97 rejects corrupt data, extra keys, unsupported layouts, oversized library',()=>{
 const good=serializeSavedLayoutLibrary([item]);
 assert.deepEqual(parseSavedLayoutLibrary(good),[item]);
 assert.throws(()=>parseSavedLayoutLibrary(JSON.stringify({...JSON.parse(good),unknown:true})));
 assert.throws(()=>serializeSavedLayoutLibrary([{...item,layoutId:'../../secrets'}]));
 assert.throws(()=>serializeSavedLayoutLibrary([{...item,name:'x\nInjected'}]));
 assert.throws(()=>serializeSavedLayoutLibrary([item,item]));
 assert.throws(()=>serializeSavedLayoutLibrary(Array.from({length:PRO_LIBRARY_MAX+1},(_,i)=>({...item,id:'unique-layout-'+i}))));
 assert.throws(()=>parseSavedLayoutLibrary('{'));
});
