import test from 'node:test';
import assert from 'node:assert/strict';
import {readSources,writeSources,parseSources,serializeSources,SOURCE_LIBRARY_KEY} from '../src/step6/sourceRecords.ts';
const sample={id:'aaccee-1234-5678-9090-012345678999',title:'참고 시안',sourceUrl:'https://example.org/gallery',note:'권리 확인 전',addedAt:1794657600000,rights:'UNVERIFIED' as const};
test('P100 STEP6 source records are local-only metadata, rights always unverified',()=>{
 const store=new Map<string,string>(),s={getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>{store.set(k,v);}};
 assert.deepEqual(readSources(s),[]);
 writeSources(s,[sample]);assert.deepEqual(readSources(s),[sample]);
 assert.deepEqual(parseSources(serializeSources([sample])),[sample]);
 assert.equal(store.size,1);assert.ok(store.has(SOURCE_LIBRARY_KEY));
 assert.doesNotMatch(store.get(SOURCE_LIBRARY_KEY)??'',/PDF-|assetId|sourceText|base64|sections/);
});
test('P100 refuse private hosts, credentials, untrusted status, malformed content',()=>{
 for(const bad of ['http://example.org','https://localhost/secret','https://127.0.0.1/a',
  'https://192.168.1.5/private','https://[::1]/','https://user:pw@example.org/'])
  assert.throws(()=>serializeSources([{...sample,sourceUrl:bad}]));
 assert.throws(()=>serializeSources([{...sample,rights:'VERIFIED' as never}]));
 assert.throws(()=>serializeSources([{...sample,extra:'imageData'}] as never));
 assert.throws(()=>parseSources('{'));
});
