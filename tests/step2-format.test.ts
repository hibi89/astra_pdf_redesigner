import assert from 'node:assert/strict';
import test from 'node:test';
import { blankProject, documentAssetIds, LIMITS, type ImageAsset } from '../src/step2/model.ts';
import { imageDimensions, imageType } from '../src/step2/images.ts';
import { exportProject, fromBase64, safeFilename, toBase64, importProject } from '../src/step2/projectFile.ts';

test('project export keeps text, design and refuses missing referenced assets',async()=>{
  const doc=blankProject();doc.content.sections[0].blocks[0]={...doc.content.sections[0].blocks[0],kind:'paragraph',text:'한글\n\n123%'};
  doc.content.sections[0].blocks.push({id:'image-1',kind:'image',assetId:'asset-1',caption:'캡션',alignment:'right',size:'medium'});
  await assert.rejects(exportProject(doc,[]),/이미지가 누락/);
  const a:ImageAsset={id:'asset-1',documentId:doc.id,byteSize:4,mimeType:'image/png',width:1,height:1,originalName:'test.png',blob:new Blob(['1234'])};
  const data=JSON.parse(await exportProject(doc,[a]));
  assert.deepEqual(data.document.content,doc.content,'Project export must preserve exact content');
  assert.deepEqual(data.document.design,doc.design,'Project export must preserve every design setting');
  assert.equal(data.document.content.sections[0].blocks[0].text,'한글\n\n123%');
  assert.equal(data.assets[0].base64,'MTIzNA==');assert.deepEqual(documentAssetIds(doc),['asset-1']);
  assert.equal(data.format,'astra-local-document');assert.equal(data.formatVersion,1);
});
test('base64 strict parser and filename cleaning',async()=>{
  assert.equal(await toBase64(new Blob(['a'.repeat(90000)])),Buffer.from('a'.repeat(90000)).toString('base64'));
  assert.deepEqual(fromBase64('YWJj'),new Uint8Array([97,98,99]));
  assert.throws(()=>fromBase64('bad!*'),/Base64/);
  assert.equal(safeFilename('../abc:a?'),'.._abc_a_');
});
test('import rejects damaged JSON, unknown version, invalid doc and wrong image refs',async()=>{
  await assert.rejects(importProject(new Blob(['{broken'])),/JSON/);
  await assert.rejects(importProject(new Blob([JSON.stringify({format:'other',formatVersion:1})])),/형식 또는 버전/);
  const doc=blankProject();
  await assert.rejects(importProject(new Blob([JSON.stringify({format:'astra-local-document',formatVersion:1,document:{...doc,schemaVersion:9},assets:[]})])),/문서 데이터/);
  doc.content.sections[0].blocks.push({id:'im',kind:'image',assetId:'missing',caption:'',size:'small',alignment:'left'});
  await assert.rejects(importProject(new Blob([JSON.stringify({format:'astra-local-document',formatVersion:1,document:doc,assets:[]})])),/개수/);
});
test('project import rejects oversized input before reading its text',async()=>{
  let textRead=false;
  const oversized={size:LIMITS.importBytes+1,text:async()=>{textRead=true;return '';}} as unknown as Blob;
  await assert.rejects(importProject(oversized),/100MiB/);
  assert.equal(textRead,false,'Oversized input must be rejected before allocating/parsing its text');
});
test('image signature and dimensional limit prefilter',()=>{
  const png=Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,2,0,0,0,3]);
  assert.equal(imageType(png),'image/png');assert.deepEqual(imageDimensions(png,'image/png'),{width:2,height:3});
  assert.equal(imageType(Uint8Array.from([60,115,118,103,62])),null);
});
test('validated import strips unrecognized keys and preserves exact known text',async()=>{
  const doc=blankProject();doc.content.sections[0].blocks[0]={...doc.content.sections[0].blocks[0],kind:'paragraph',text:'원문\n\n100%'};
  const input={format:'astra-local-document',formatVersion:1,document:{...doc,rogue:'ignore-me',content:{...doc.content,rogue:'remove',sections:doc.content.sections.map(section=>({...section,other:'untrusted'}))},design:{...doc.design,evil:'untrusted'}},assets:[]};
  const imported=await importProject(new Blob([JSON.stringify(input)]));
  assert.equal(imported.document.content.sections[0].blocks[0].kind,'paragraph');
  assert.equal(imported.document.content.sections[0].blocks[0].text,'원문\n\n100%');
  assert.ok(!('rogue' in imported.document));
  assert.ok(!('rogue' in imported.document.content));
  assert.ok(!('other' in imported.document.content.sections[0]));
  assert.ok(!('evil' in imported.document.design));
});

