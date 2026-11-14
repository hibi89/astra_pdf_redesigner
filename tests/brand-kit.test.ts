import test from 'node:test';
import assert from 'node:assert/strict';
import {PALETTE} from '../src/types.ts';
import {validateBusinessBrandKit,exportBusinessBrandKit,parseBusinessBrandKit} from '../src/step4/brandKit.ts';

const sample={name:'테스트 디자인',tagline:'합성 예시 · 로컬 테스트',footer:'검증 전 초안',accent:PALETTE[0].value};
test('P94 BUSINESS brand kit roundtrip is bounded and content-free',()=>{
 const source=exportBusinessBrandKit(sample);
 const kit=parseBusinessBrandKit(source);
 assert.deepEqual(kit,sample);
 assert.deepEqual(Object.keys(JSON.parse(source)).sort(),['format','kit','version']);
 assert.doesNotMatch(source,/assetId|sourcePdf|sections|base64/);
});
test('P94 BUSINESS brand kit rejects extra fields, injection controls, unsupported color, oversized input',()=>{
 assert.throws(()=>validateBusinessBrandKit({...sample,unapproved:'ok'}));
 assert.throws(()=>validateBusinessBrandKit({...sample,name:''}));
 assert.throws(()=>validateBusinessBrandKit({...sample,name:'bad\nheader'}));
 assert.throws(()=>validateBusinessBrandKit({...sample,accent:'url(javascript:alert(1))'}));
 assert.throws(()=>validateBusinessBrandKit({...sample,footer:'x'.repeat(151)}));
 assert.throws(()=>parseBusinessBrandKit(JSON.stringify({format:'astra-business-brand-kit',version:1,kit:{...sample,PDF:'private'}})));
 assert.throws(()=>parseBusinessBrandKit('x'.repeat(4097)));
 assert.throws(()=>parseBusinessBrandKit('{invalid json'));
});
